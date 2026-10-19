/* state.js — persistence, domain helpers, shared data */
(function () {
  'use strict';

  const KEY = 'geeta.state.v1';
  const G = window.GITA;

  const DEFAULT = {
    lang: 'en',            // meaning language: en | hi | ne  (Sanskrit is always shown)
    tab: 'today',
    read: {},              // "2.47" -> epoch ms
    introRead: {},         // chapter number -> epoch ms
    highlights: {},        // "2.47" -> { color, ts }
    notes: [],             // { id, ref, text, ts }
    prayers: [],           // { id, title, text, ts }
    streak: { current: 0, best: 0, last: null, days: [] },
    last: { ch: 1, v: 1 }, // continue reading
    history: [],           // recent references "2.47"
    settings: { fs: 1, theme: 'dark', rate: 0.95, showTranslit: true, showMeaning: true },
    plan: { day: 0, last: null },
    profileTab: 'highlights',
    refSort: 'number',
    chaptersRead: {},      // chapter number -> epoch ms (explicit "mark chapter as read")
    auth: { provider: null, name: null, email: null, picture: null },
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT);
      const parsed = JSON.parse(raw);
      return Object.assign(structuredClone(DEFAULT), parsed, {
        settings: Object.assign({}, DEFAULT.settings, parsed.settings || {}),
        streak: Object.assign({}, DEFAULT.streak, parsed.streak || {}),
        plan: Object.assign({}, DEFAULT.plan, parsed.plan || {}),
      });
    } catch (e) {
      return structuredClone(DEFAULT);
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }
  function reset() {
    state = structuredClone(DEFAULT);
    save();
  }

  /* ---------- refs & lookup ---------- */
  const verses = G.verses;
  const chapters = G.chapters;
  const keys = Object.keys(verses); // "1.1" ... "18.78"

  function vkey(ch, v) { return ch + '.' + v; }
  function parseKey(k) { const p = String(k).split('.'); return { ch: +p[0], v: +p[1] }; }
  function verse(k) { return verses[k]; }
  function chapter(n) { return chapters.find((c) => c.n === n); }
  function chapterKeys(n) {
    return keys.filter((k) => k.startsWith(n + '.')).sort((a, b) => +parseKey(a).v - +parseKey(b).v);
  }
  function refLabel(k) { const { ch, v } = parseKey(k); return 'BG ' + ch + ':' + v; }
  function nextKey(k) {
    const { ch, v } = parseKey(k);
    const c = chapter(ch);
    if (v < c.count) return vkey(ch, v + 1);
    return ch < 18 ? vkey(ch + 1, 1) : null;
  }
  function prevKey(k) {
    const { ch, v } = parseKey(k);
    if (v > 1) return vkey(ch, v - 1);
    return ch > 1 ? vkey(ch - 1, chapter(ch - 1).count) : null;
  }

  const LANGS = {
    sa: { label: 'सं', name: 'Sanskrit', html: 'sa', tts: 'hi-IN' },
    en: { label: 'EN', name: 'English', html: 'en', tts: 'en-US' },
    hi: { label: 'हिं', name: 'हिन्दी', html: 'hi', tts: 'hi-IN' },
    ne: { label: 'ने', name: 'नेपाली', html: 'ne', tts: 'ne-NP' },
  };

  function meaningText(k, lang) {
    const v = verses[k];
    if (!v) return '';
    return v[lang || state.lang] || '';
  }

  /* ---------- activity: reading, streak ---------- */
  const DAY = 86400000;
  function todayKey(d) {
    const x = d || new Date();
    return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate();
  }
  function touchStreak() {
    const t = todayKey();
    const s = state.streak;
    if (s.last === t) return;
    const y = todayKey(new Date(Date.now() - DAY));
    if (s.last === y) s.current += 1;
    else if (s.last === null) s.current = 1;
    else s.current = 1;
    s.last = t;
    if (s.current > s.best) s.best = s.current;
    if (!s.days) s.days = [];
    if (s.days[s.days.length - 1] !== t) s.days.push(t);
    if (s.days.length > 60) s.days = s.days.slice(-60);
    save();
  }
  function markRead(k) {
    if (state.read[k]) return false;
    state.read[k] = Date.now();
    touchStreak();
    save();
    return true;
  }
  function markIntroRead(ch) {
    if (state.introRead[ch]) return;
    state.introRead[ch] = Date.now();
    touchStreak();
    save();
  }
  function readCount() { return Object.keys(state.read).length; }
  function chapterReadCount(n) { return chapterKeys(n).filter((k) => state.read[k]).length; }
  function chapterDone(n) {
    if (state.chaptersRead && state.chaptersRead[n]) return true;
    return chapterReadCount(n) >= chapter(n).count;
  }
  // Explicitly mark a whole chapter as read (marks every verse too).
  function markChapterRead(n) {
    if (!state.chaptersRead) state.chaptersRead = {};
    chapterKeys(n).forEach((k) => { if (!state.read[k]) state.read[k] = Date.now(); });
    state.chaptersRead[n] = Date.now();
    touchStreak();
    save();
  }
  function chaptersDone() { return chapters.filter((c) => chapterDone(c.n)).length; }

  function pushHistory(k) {
    state.history = [k].concat((state.history || []).filter((x) => x !== k)).slice(0, 12);
    save();
  }

  /* ---------- verse of the day ---------- */
  function verseOfDay() {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const doy = Math.floor((d - start) / DAY);
    return keys[doy % keys.length];
  }

  /* ---------- highlights / notes / prayers ---------- */
  const COLORS = ['#d98b2b', '#d94f4f', '#4f9d6b', '#4a7fc1', '#28b8d8', '#d6d51f', '#4ed07a', '#dcb37a', '#cd7fd0'];
  function setHighlight(k, color) {
    if (!color) delete state.highlights[k];
    else state.highlights[k] = { color, ts: Date.now() };
    save();
  }
  function addNote(ref, text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return null;
    const note = { id: 'n' + Date.now(), ref, text: trimmed, ts: Date.now() };
    state.notes.unshift(note);
    save();
    return note;
  }
  function deleteNote(id) {
    state.notes = state.notes.filter((n) => n.id !== id);
    save();
  }
  function addPrayer(title, text) {
    const p = { id: 'p' + Date.now(), title: (title || 'Prayer').trim(), text: (text || '').trim(), ts: Date.now() };
    state.prayers.unshift(p);
    save();
    return p;
  }
  function deletePrayer(id) {
    state.prayers = state.prayers.filter((p) => p.id !== id);
    save();
  }
  function noteFor(k) { return state.notes.find((n) => n.ref === k); }

  /* ---------- formatting ---------- */
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(ts) {
    const d = new Date(ts);
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- TTS ---------- */
  let speaking = false;
  let speakQueue = [];
  function speechAvailable() { return 'speechSynthesis' in window; }
  function stopSpeech() {
    speaking = false;
    speakQueue = [];
    if (speechAvailable()) window.speechSynthesis.cancel();
  }
  function speak(text, lang, ondone) {
    if (!speechAvailable() || !text) { if (ondone) ondone(); return; }
    const u = new SpeechSynthesisUtterance(text);
    const cfg = LANGS[lang] || LANGS.en;
    u.lang = cfg.tts;
    u.rate = state.settings.rate || 0.95;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(cfg.tts.slice(0, 2)));
    if (match) u.voice = match;
    if (ondone) u.onend = ondone;
    u.onerror = function () { if (ondone) ondone(); };
    window.speechSynthesis.speak(u);
  }

  /* ---------- guides ---------- */
  const range = (ch, a, b) => {
    const out = [];
    for (let v = a; v <= b; v++) out.push(vkey(ch, v));
    return out;
  };
  const GUIDES = [
    {
      id: 'plan30',
      kind: 'Reading plan',
      title: 'Read the Gita in 30 days',
      sub: 'A little every day — 18 chapters split across 30 days.',
      plan: true,
      verses: [],
    },
    {
      id: 'karma',
      kind: 'Topic',
      title: 'Karma Yoga — the path of selfless action',
      sub: 'Krishna on acting without clinging to the fruit of action.',
      verses: ['2.47', '2.48', '2.50', '3.19', '3.35', '4.18', '4.20', '5.10', '18.47'].filter((k) => verses[k]),
    },
    {
      id: 'bhakti',
      kind: 'Topic',
      title: 'Bhakti Yoga — devotion',
      sub: 'Loving devotion as the surest way to the Divine.',
      verses: ['9.22', '9.26', '9.29', '12.6', '12.7', '12.15', '12.20', '15.7', '18.66'].filter((k) => verses[k]),
    },
    {
      id: 'jnana',
      kind: 'Topic',
      title: 'Jnana Yoga — knowledge',
      sub: 'Discrimination between the body, the mind and the self.',
      verses: ['2.13', '2.16', '2.17', '2.20', '2.22', '2.23', '2.24', '4.38', '4.39', '13.35'].filter((k) => verses[k]),
    },
    {
      id: 'stability',
      kind: 'Topic',
      title: 'Peace, balance and steady mind',
      sub: 'How to stay unshaken in success and in pain.',
      verses: ['2.14', '2.15', '2.31', '2.48', '2.56', '2.66', '2.71', '3.17', '12.13', '12.14', '18.26'].filter((k) => verses[k]),
    },
    {
      id: 'duty',
      kind: 'Topic',
      title: 'Duty, dharma and the warrior’s choice',
      sub: 'Arjuna’s dilemma and Krishna’s answer on the battlefield.',
      verses: ['1.39', '1.40', '2.31', '2.33', '2.37', '3.35', '4.7', '4.8', '18.47'].filter((k) => verses[k]),
    },
    {
      id: 'moksha',
      kind: 'Topic',
      title: 'The self and liberation',
      sub: 'Birthless, deathless — the nature of the soul and freedom.',
      verses: ['2.20', '2.25', '2.26', '2.27', '2.47', '2.72', '8.3', '15.1', '15.7', '18.66'].filter((k) => verses[k]),
    },
    {
      id: 'krishna',
      kind: 'Topic',
      title: 'Who is Krishna?',
      sub: 'The Lord declares his own nature and glories.',
      verses: ['4.6', '4.7', '4.8', '7.6', '7.24', '9.11', '10.8', '10.10', '10.41', '11.32', '15.15', '18.66'].filter((k) => verses[k]),
    },
  ];

  // 30-day plan: split the 701 verses into 30 slices, mapped back to chapter ranges
  function planDays() {
    const total = keys.length;
    const per = Math.ceil(total / 30);
    // global index -> { ch, v }
    const at = (idx) => {
      let acc = 0;
      for (const c of chapters) {
        if (idx <= acc + c.count) return { ch: c.n, v: idx - acc };
        acc += c.count;
      }
      const last = chapters[chapters.length - 1];
      return { ch: last.n, v: last.count };
    };
    const days = [];
    for (let d = 1; d <= 30; d++) {
      const from = Math.min(total, (d - 1) * per + 1);
      const to = Math.min(total, d * per);
      const a = at(from);
      const b = at(to);
      days.push({ day: d, from: from > to ? a : a, to: b, start: vkey(a.ch, a.v), end: vkey(b.ch, b.v), ch: a.ch });
    }
    return days;
  }

  const PRAYERS = [
    {
      id: 'gayatri',
      title: 'Gayatri Mantra',
      src: 'Rig Veda 3.62.10',
      skt: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
      meaning: 'We meditate on the glorious light of the divine Sun. May it illuminate our minds.',
    },
    {
      id: 'shanti',
      title: 'Lokah Samastah Sukhino Bhavantu',
      src: 'Shanti Mantra',
      skt: 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥',
      meaning: 'May all be happy, may all be free from illness, may all see goodness, and may no one suffer.',
    },
    {
      id: 'mrityunjaya',
      title: 'Mahamrityunjaya Mantra',
      src: 'Rig Veda 7.59.12',
      skt: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात् ॥',
      meaning: 'We worship the three-eyed one who nourishes all. Like a cucumber freed from its vine, free me from death — not from immortality.',
    },
    {
      id: 'gita-offering',
      title: 'Krishna’s offering — Gita 9.26',
      src: 'Bhagavad Gita 9.26',
      skt: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति तदहं भक्त्युपहृतमश्नामि प्रणतस्य मे प्रियम् ॥',
      meaning: 'Whoever offers me a leaf, a flower, a fruit or water with devotion — I accept it from the loving heart of the devotee.',
    },
  ];

  // ---------- auth (localStorage only; a real Google login needs the worker) ----------
  function setAuth(user) { state.auth = user || { provider: null, name: null, email: null, picture: null }; save(); }
  function clearAuth() { setAuth(null); }
  function isAuthed() { return !!(state.auth && state.auth.provider); }

  window.G = {
    get state() { return state; },
    setAuth, clearAuth, isAuthed,
    set state(v) { state = v; },
    save, reset,
    verses, chapters, keys, vkey, parseKey, verse, chapter, chapterKeys, refLabel, nextKey, prevKey,
    LANGS, meaningText,
    touchStreak, markRead, markIntroRead, markChapterRead, readCount, chapterReadCount, chapterDone, chaptersDone,
    pushHistory, verseOfDay, todayKey,
    COLORS, setHighlight, addNote, deleteNote, addPrayer, deletePrayer, noteFor,
    fmtDate, esc,
    speak, stopSpeech, speechAvailable,
    GUIDES, planDays, PRAYERS,
    isReading: () => speaking,
    setReading: (v) => { speaking = v; },
  };
})();
