/* app.js — router + screens for the Bhagavad Gita app */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const G = window.G;
  const esc = G.esc;

  /* ---------------- icons ---------------- */
  const svg = (p, cls) => '<svg class="' + (cls || '') + '" viewBox="0 0 24 24">' + p + '</svg>';
  const ICON = {
    share: svg('<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="M8.3 10.8l7.4-4M8.3 13.2l7.4 4"/>'),
    pencil: svg('<path d="M4 20l4.5-1L20 7.5a2.1 2.1 0 0 0-3-3L5.5 16z"/><path d="M14.5 6.5l3 3"/>'),
    search: svg('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    gear: svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2M12 18.5v2M4.9 7.8l1.7 1M17.4 15.2l1.7 1M4.9 16.2l1.7-1M17.4 8.8l1.7-1M3.5 12h2M18.5 12h2"/>'),
    headphone: svg('<path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2"/><rect x="3" y="13.5" width="4" height="6.5" rx="1.6"/><rect x="17" y="13.5" width="4" height="6.5" rx="1.6"/>'),
    back: svg('<path d="M15 5l-7 7 7 7"/>'),
    clock: svg('<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 1.8"/>'),
    az: svg('<path d="M4 17.5L8.5 6l4.5 11.5M5.6 14h5.8"/><path d="M14.5 17.5L17.5 9l3 8.5M15.4 15.4h4.2"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2.4"/><path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15"/>'),
    compare: svg('<path d="M7 4v16M17 4v16"/><path d="M4 8h6M14 16h6"/>'),
    note: svg('<rect x="4.5" y="4" width="15" height="16" rx="2.5"/><path d="M8 9h8M8 13h6"/>'),
    check: svg('<path d="M5 12.5l4.5 4.5L19 7"/>'),
    trash: svg('<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>'),
    book: svg('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 9.5h8M8 14.5h5"/>'),
    flame: svg('<path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-2 1-3.4 1-3.4S9.5 11 11 11c1.6 0 1-3.4 1-8z"/>'),
    bolt: svg('<path d="M13 2L5 13.5h6L10 22l8-11.5h-6z"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    chev: svg('<path d="M9 5l7 7-7 7"/>'),
    x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    user: svg('<circle cx="12" cy="8" r="3.6"/><path d="M5.5 19.5c1.2-3.4 3.7-5 6.5-5s5.3 1.6 6.5 5"/>'),
    google: svg('<path d="M21.6 12.2c0-.7-.06-1.3-.18-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z" fill="#4285F4" stroke="none"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" stroke="none"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14z" fill="#FBBC05" stroke="none"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.7 2 12 2a10 10 0 0 0-8.9 5.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335" stroke="none"/>'),
    logout: svg('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4M6 12h11"/>'),
    lock: svg('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    bell: svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
    bookmark: svg('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>'),
    help: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3.5"/><path d="M12 17.5v.01"/>'),
    widget: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    heart: svg('<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l8.8 8.8 8.8-8.8a5 5 0 0 0 0-7.1z"/>'),
    brain: svg('<path d="M12 5.2a3.2 3.2 0 0 0-6.2 1.1 3.5 3.5 0 0 0-.5 6.2 3.4 3.4 0 0 0 3.4 5.4 3.2 3.2 0 0 0 3.3 1.8zM12 5.2a3.2 3.2 0 0 1 6.2 1.1 3.5 3.5 0 0 1 .5 6.2 3.4 3.4 0 0 1-3.4 5.4 3.2 3.2 0 0 1-3.3 1.8zM8 9h1m-2 5h2m6-5h1m-1 5h2M12 5v14"/>'),
    prayer: svg('<path d="M8 3v5m0 0a2 2 0 0 0-4 0v4c0 3 2 5 5 7l3 2 3-2c3-2 5-4 5-7V8a2 2 0 0 0-4 0V3m-8 5 2 6m8-6-2 6m-7 1 3 2 3-2"/>'),
    library: svg('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21zM4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8m-8 4h8"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>'),
    mic: svg('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/>'),
  };

  /* ---------------- helpers ---------------- */
  function go(hash) { location.hash = hash; }
  function route() { return (location.hash || '#/today').replace(/^#/, ''); }
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.add('hidden'), 2100);
  }
  function applySettings() {
    const s = G.state.settings;
    document.documentElement.style.setProperty('--fs', String(1 + (s.fs - 2) * 0.08));
    document.documentElement.setAttribute('data-theme', s.theme || 'dark');
  }

  /* ---------------- sheet / modal ---------------- */
  function openSheet(html) {
    $('#sheet').innerHTML = html;
    $('#sheetLayer').classList.remove('hidden');
  }
  function closeSheet() { $('#sheetLayer').classList.add('hidden'); $('#sheet').innerHTML = ''; }
  function openModal(html) {
    $('#modal').innerHTML = html;
    $('#modalLayer').classList.remove('hidden');
  }
  function closeModal() { $('#modalLayer').classList.add('hidden'); $('#modal').innerHTML = ''; }

  /* ---------------- top bar builders ---------------- */
  function topbar(html) { $('#topbar').innerHTML = html || ''; }
  function streakBadge() {
    const s = G.state.streak;
    return '<button class="tb-streak" id="streakBtn">' + ICON.bolt + '<span>' + (s.current || 0) + '</span></button>';
  }

  /* ---------------- TODAY ---------------- */
  function renderToday() {
    topbar(
      streakBadge() +
      '<div class="tb-center"><div class="tb-title">Today</div></div>' +
      '<div class="tb-spacer"></div>'
    );
    const k = G.verseOfDay();
    const v = G.verse(k);
    const st = G.state;
    const readTotal = G.readCount();
    const pct = readTotal / G.keys.length;
    const lastCh = st.last.ch;
    const continueRef = st.last.v ? 'Chapter ' + lastCh + ' · Verse ' + st.last.v : 'Chapter ' + lastCh;
    const memKey = pickMemorizeKey();
    const prayer = G.PRAYERS[new Date().getDate() % G.PRAYERS.length];

    const meaning = G.meaningText(k);
    const html =
      '<div class="votd-ref">' + esc(G.refLabel(k).replace('BG ', '')) + '</div>' +
      '<p class="votd-text">' + esc(stripRef(v.skt)) + '</p>' +
      (meaning ? '<p class="muted" style="font-family:var(--serif);font-size:calc(18px * var(--fs));line-height:1.5;margin:10px 2px 0">' + esc(meaning) + '</p>' : '') +
      '<div class="votd-actions">' +
      '<button id="votdShare">' + ICON.share + '<span>Share</span></button>' +
      '<button id="votdNote">' + ICON.pencil + '<span>Note</span></button>' +
      '</div>' +

      '<button class="row-card" data-go="#/prayer">' +
      '<span class="row-thumb">' + ICON.prayer + '</span>' +
      '<span class="rc-body"><span class="rc-title">Today\'s Prayer</span><span class="rc-sub">' + esc(prayer.title) + '</span></span>' +
      '</button>' +

      '<button class="row-card" data-go="#/memorize">' +
      '<span class="row-thumb">' + ICON.brain + '</span>' +
      '<span class="rc-body"><span class="rc-title">Memorize Verse</span><span class="rc-sub">' + esc(G.refLabel(memKey)) + '</span></span>' +
      '</button>' +

      '<button class="row-card" data-go="#/read/' + lastCh + '">' +
      '<span class="row-thumb">' + ICON.library + '</span>' +
      '<span class="rc-body"><span class="rc-title">Continue Reading</span><span class="rc-sub">' + esc(continueRef) + '</span></span>' +
      '</button>' +

      '<button class="row-card" data-go="#/progress">' +
      '<span class="ring-wrap">' + ringSvg(pct) + '<span class="ring-label">' + Math.round(pct * 100) + '%</span></span>' +
      '<span class="rc-body"><span class="rc-title">Reading Progress</span><span class="rc-sub">' +
      readTotal + ' of ' + G.keys.length + ' verses · ' + G.chaptersDone() + ' chapters read</span></span>' +
      '</button>' +

      '<div class="card" style="margin-top:6px;text-align:center">' +
      '<div class="streak-stats">' +
      '<div class="streak-stat"><div class="num">' + (st.streak.current || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Current Streak</div></div>' +
      '<div class="streak-divider"></div>' +
      '<div class="streak-stat"><div class="num">' + (st.streak.best || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Best Streak</div></div>' +
      '</div>' +
      '<div class="streak-copy">Streaks help you build your Gita habit to sit with the scripture daily.</div>' +
      '</div>';

    $('#view').innerHTML = html;
    $('#transport').classList.add('hidden');

    $('#streakBtn').onclick = showStreakSheet;
    $('#votdShare').onclick = () => shareVerse(k);
    $('#votdNote').onclick = () => openNoteModal(k);
    $('#view').querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(b.dataset.go)));
  }

  function stripRef(skt) {
    // keep the verse lines, drop the ।।1.1।। reference suffix
    let t = String(skt || '').trim().replace(/\s*[।]{2}\s*\d+(?:\.\d+)?\s*[।]{2}\s*$/, '').trim();
    const lines = t.split('\n').filter((l) => l.trim());
    return lines.slice(-2).join('\n') || t;
  }

  function ringSvg(pct) {
    const r = 24, c = 2 * Math.PI * r;
    const dash = Math.max(0.001, Math.min(1, pct)) * c;
    return '<svg viewBox="0 0 60 60" width="58" height="58">' +
      '<circle class="ring-bg" cx="30" cy="30" r="' + r + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle class="ring-fg" cx="30" cy="30" r="' + r + '" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="' + dash + ' ' + c + '"/>' +
      '</svg>';
  }

  function pickMemorizeKey() {
    const readKeys = Object.keys(G.state.read);
    if (readKeys.length) return readKeys[readKeys.length - 1];
    return G.keys[new Date().getDate() % G.keys.length];
  }

  function showStreakSheet() {
    const s = G.state.streak;
    openSheet(
      '<div class="sheet-grip"></div>' +
      '<div class="streak-sheet">' +
      '<div class="streak-stats">' +
      '<div class="streak-stat"><div class="num">' + (s.current || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Current Streak</div></div>' +
      '<div class="streak-divider"></div>' +
      '<div class="streak-stat"><div class="num">' + (s.best || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Best Streak</div></div>' +
      '</div>' +
      '<div class="streak-copy">Streaks help you build your Gita habit to sit with the scripture daily.</div>' +
      '<p class="muted" style="font-size:14.5px;margin-top:14px">Last ' + (s.days || []).length + ' active days recorded on this device.</p>' +
      '</div>'
    );
  }

  /* ---------------- READER ---------------- */
  let observer = null;
  let player = null;

  /* ---- chapter narrator: reads the whole chapter in the chosen meaning language ---- */
  let narrator = null;
  function startNarration(ch) {
    if (!G.speechAvailable()) { toast('Speech is not available in this browser'); return; }
    stopNarration();
    const keys = G.chapterKeys(ch);
    const lang = G.state.lang;
    let i = 0;
    narrator = { playing: true, ch, lang };
    G.setReading(true);
    syncAudioButtons(true);
    updatePlayIcon(true);
    step();
    function step() {
      if (!narrator || !narrator.playing) return;
      if (i >= keys.length) { finish(); return; }
      const k = keys[i];
      const { ch: c, v } = G.parseKey(k);
      // keep the active-verse highlight + reading position in sync while narrating
      markActive(c, v);
      const el = document.getElementById('v-' + c + '-' + v);
      if (el) $('#view').scrollTop = Math.max(0, el.offsetTop - 140);
      // speak the meaning in the chosen language (falls back to Sanskrit if missing)
      const meaning = G.meaningText(k, lang);
      const text = meaning || G.verse(k).skt.replace(/[॥।]\s*\d+\.\d+\s*[॥।]*$/, '');
      G.speak(text, meaning ? lang : 'sa', () => {
        if (!narrator || !narrator.playing) return;
        i++; setTimeout(step, 240);
      });
    }
    function finish() {
      markChapterReadInline(ch);
      toast('Chapter ' + ch + ' narrated · marked read');
      stopNarration();
    }
  }
  function pauseNarration() {
    if (!narrator) return;
    narrator.playing = false;
    G.setReading(false);
    G.stopSpeech();
    syncAudioButtons(false);
    updatePlayIcon(false);
  }
  function stopNarration() {
    if (narrator) narrator.playing = false;
    narrator = null;
    G.setReading(false);
    G.stopSpeech();
    syncAudioButtons(false);
    updatePlayIcon(false);
  }
  function toggleNarration(ch) {
    if (narrator && narrator.playing && narrator.ch === ch) pauseNarration();
    else startNarration(ch);
  }
  function syncAudioButtons(on) {
    const b = $('#btnAudio');
    if (b) b.classList.toggle('active', !!on);
  }
  function markChapterReadInline(ch) {
    G.markChapterRead(ch);
    // update the end-of-chapter button in place
    const btn = $('#chMarkRead');
    if (btn) { btn.textContent = 'Chapter read ✓'; btn.classList.add('read-done'); btn.disabled = true; }
  }

  function renderReader(ch, mode, focusVerse) {
    const c = G.chapter(ch);
    if (!c) return go('#/today');
    const s = G.state.settings;
    const st = G.state;
    st.last = { ch, v: focusVerse || st.last.v || 1 };
    G.save();

    topbar(
      '<div class="pill-group">' +
      '<button class="pill" id="pillRef">' + (mode === 'intro' ? 'Chapter ' + ch + ' Intro' : 'Chapter ' + ch) + '</button>' +
      '<button class="pill" id="pillLang" title="Change meaning language">' + G.LANGS[st.lang].label + '</button>' +
      '</div>' +
      '<div class="tb-spacer"></div>' +
      '<button class="tb-btn' + (narrator && narrator.playing ? ' active' : '') + '" id="btnAudio" title="Narrate this chapter">' + ICON.headphone + '</button>' +
      '<button class="tb-btn" id="btnSearch" title="Search">' + ICON.search + '</button>' +
      '<button class="tb-btn" id="btnSettings" title="Settings">' + ICON.gear + '</button>' +
      (G.isAuthed() ? '' : '<button class="tb-btn" id="btnAuth" title="Sign in">' + ICON.user + '</button>')
    );

    const head =
      '<div class="reader-head">' +
      '<div class="reader-book">' + esc(c.name) + '</div>' +
      '<div class="reader-num">' + ch + '</div>' +
      '</div>';

    if (mode === 'intro') {
      const summary = st.lang === 'hi' && c.summaryHi ? c.summaryHi : c.summaryEn;
      $('#view').innerHTML =
        head +
        '<div class="reader-section">' + esc(c.meaning) + '</div>' +
        '<div class="intro-body"><div class="ib-head">Intro</div>' + esc(summary) + '</div>' +
        (st.lang !== 'en' && !(st.lang === 'hi' && c.summaryHi) ? '<div class="intro-lang">Chapter summary shown in English (no Nepali summary available).</div>' : '') +
        '<button class="btn primary" id="introStart" style="margin-top:26px">Start reading</button>';
      $('#introStart').onclick = () => go('#/read/' + ch);
      $('#transport').classList.add('hidden');
      attachReaderBar(ch, mode);
      return;
    }

    const keys = G.chapterKeys(ch);
    const alreadyRead = G.chapterDone(ch);
    let html = head + '<div class="reader-section">' + esc(c.meaning) + '</div><div class="reader-pad">';
    for (const k of keys) html += verseHtml(k);
    html += '</div>' +
      '<button class="btn ' + (alreadyRead ? 'read-done' : 'primary') + '" id="chMarkRead"' + (alreadyRead ? ' disabled' : '') + '>' +
      (alreadyRead ? 'Chapter read ✓' : 'Mark chapter as read') + '</button>' +
      '<div style="height:40px"></div>';
    $('#view').innerHTML = html;
    $('#view').classList.add('no-pad');
    $('#view').style.paddingLeft = '18px';
    $('#view').style.paddingRight = '18px';

    attachReaderBar(ch, mode);
    wireVerses();

    const chMark = $('#chMarkRead');
    if (chMark) chMark.onclick = () => {
      G.markChapterRead(ch);
      chMark.textContent = 'Chapter read ✓';
      chMark.classList.add('read-done');
      chMark.disabled = true;
      toast('Chapter ' + ch + ' marked as read');
    };

    // scroll to focus verse
    const target = focusVerse ? document.getElementById('v-' + ch + '-' + focusVerse) : null;
    if (target) {
      const y = target.offsetTop - 90;
      $('#view').scrollTop = Math.max(0, y);
      markActive(ch, focusVerse);
    } else {
      $('#view').scrollTop = 0;
      markActive(ch, 1);
    }
    $('#transport').classList.remove('hidden');

    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      let top = null;
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.55) {
          const el = e.target;
          const vv = +el.dataset.v;
          G.markRead(G.vkey(ch, vv));
          G.state.last = { ch, v: vv };
          G.save();
          if (!top || vv < top) top = vv;
        }
      }
      if (top) markActive(ch, top);
    }, { root: $('#view'), threshold: [0.55] });
    document.querySelectorAll('.verse').forEach((v) => observer.observe(v));
  }

  function verseHtml(k) {
    const v = G.verse(k);
    const st = G.state.settings;
    const { ch, v: vn } = G.parseKey(k);
    const hl = G.state.highlights[k];
    const meaning = G.meaningText(k);
    return '<div class="verse' + (hl ? ' hl' : '') + '" id="v-' + ch + '-' + vn + '" data-key="' + k + '" data-v="' + vn + '"' +
      (hl ? ' style="--hl:' + hl.color + '"' : '') + '>' +
      '<span class="vnum">' + vn + '</span><span class="sanskrit-text">' + esc(v.skt) + '</span>' +
      (st.showTranslit && v.tr ? '<div class="translit">' + esc(v.tr) + '</div>' : '') +
      (st.showMeaning ? (meaning ? '<div class="meaning">' + esc(meaning) + '</div>'
        : '<div class="no-ne">Nepali meaning is not available for this verse — switch language above.</div>') : '') +
      '</div>';
  }

  function markActive(ch, vn) {
    document.querySelectorAll('.verse.active-v').forEach((e) => e.classList.remove('active-v'));
    const el = document.getElementById('v-' + ch + '-' + vn);
    if (el) el.classList.add('active-v');
    G.state.last = { ch, v: vn };
    G.save();
  }

  function attachReaderBar(ch, mode) {
    $('#pillRef').onclick = () => go('#/references');
    // language pill cycles meaning languages on each press
    $('#pillLang').onclick = () => cycleLanguage(ch, mode);
    $('#btnSearch').onclick = () => go('#/search');
    $('#btnSettings').onclick = openSettingsSheet;
    $('#btnAudio').onclick = () => toggleNarration(ch);
    if ($('#btnAuth')) $('#btnAuth').onclick = openAuthSheet;
  }

  // Cycle meaning language: en -> hi -> ne -> en …
  const CYCLE = ['en', 'hi', 'ne'];
  function cycleLanguage(ch, mode) {
    const st = G.state;
    const idx = CYCLE.indexOf(st.lang);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    st.lang = next;
    G.save();
    const pill = $('#pillLang');
    if (pill) { pill.textContent = G.LANGS[next].label; pill.classList.remove('pill-bump'); void pill.offsetWidth; pill.classList.add('pill-bump'); }
    toast('Meaning language: ' + G.LANGS[next].name);
    // if narrating in a language, restart narration in the new one
    const wasNarrating = narrator && narrator.playing;
    if (wasNarrating) stopNarration();
    renderReader(ch, mode, G.state.last.v);
    if (wasNarrating) startNarration(ch);
  }

  function wireVerses() {
    document.querySelectorAll('.verse').forEach((el) => {
      el.addEventListener('click', () => openVerseSheet(el.dataset.key));
    });
  }

  function openLangSheet(ch, mode) {
    const st = G.state;
    const opts = ['en', 'hi', 'ne'].map((l) =>
      '<button class="pill-tab' + (st.lang === l ? ' active' : '') + '" data-lang="' + l + '">' + G.LANGS[l].label + ' · ' + esc(G.LANGS[l].name) + '</button>'
    ).join('');
    openSheet(
      '<div class="sheet-grip"></div><div class="sheet-title">Translation language</div>' +
      '<div class="sheet-sub">The original Sanskrit is always shown. Choose the meaning below it.</div>' +
      '<div style="display:flex;flex-direction:column;gap:10px">' + opts + '</div>' +
      '<p class="license" style="margin-top:18px">English: Swami Sivananda · हिन्दी: स्वामी रामसुखदास (गीता प्रेस) · नेपाली: श्रीमद्भगवद्गीता यथारूप (OCR)</p>'
    );
    $('#sheet').querySelectorAll('[data-lang]').forEach((b) => (b.onclick = () => {
      st.lang = b.dataset.lang;
      G.save();
      closeSheet();
      renderReader(ch, mode, G.state.last.v);
    }));
  }

  /* ---- verse transport / TTS playback ---- */
  function startPlayback(ch) {
    if (!G.speechAvailable()) { toast('Speech is not available in this browser'); return; }
    const keys = G.chapterKeys(ch);
    let i = Math.max(0, keys.findIndex((k) => +G.parseKey(k).v === G.state.last.v));
    if (i < 0) i = 0;
    player = { playing: true, stop };
    G.setReading(true);
    updatePlayIcon(true);
    step();
    function step() {
      if (!player || !player.playing) return;
      if (i >= keys.length) { stop(); return; }
      const k = keys[i];
      const { ch: c, v } = G.parseKey(k);
      G.markRead(k);
      G.state.last = { ch: c, v };
      G.save();
      markActive(c, v);
      const el = document.getElementById('v-' + c + '-' + v);
      if (el) $('#view').scrollTop = Math.max(0, el.offsetTop - 140);
      const text = G.verse(k).skt.replace(/[॥।]\s*\d+\.\d+\s*[॥।]*$/, '');
      G.speak(text, 'sa', () => {
        if (!player || !player.playing) return;
        const m = G.meaningText(k);
        if (m) G.speak(m, G.state.lang, () => { i++; setTimeout(step, 220); });
        else { i++; setTimeout(step, 220); }
      });
    }
    function stop() {
      if (player) player.playing = false;
      G.setReading(false);
      G.stopSpeech();
      updatePlayIcon(false);
    }
    player.stop = stop;
  }
  function updatePlayIcon(on) {
    $('#tpPlay').querySelector('.ic-play').classList.toggle('hidden', on);
    $('#tpPlay').querySelector('.ic-pause').classList.toggle('hidden', !on);
  }

  function transportTo(mode) {
    const cur = route().match(/^\/read\/(\d+)/);
    if (!cur) return;
    const ch = +cur[1];
    const wasNarrating = narrator && narrator.playing;
    if (mode === 'next') {
      if (ch < 18) { stopNarration(); go('#/read/' + (ch + 1)); }
      else toast('End of the Bhagavad Gita');
    } else {
      if (ch > 1) { stopNarration(); go('#/read/' + (ch - 1)); }
      else toast('Beginning of the Bhagavad Gita');
    }
    if (wasNarrating) setTimeout(() => startNarration(mode === 'next' ? Math.min(18, ch + 1) : Math.max(1, ch - 1)), 120);
  }

  /* ---------------- VERSE SHEET ---------------- */
  let sheetKey = null;
  function openVerseSheet(k) {
    sheetKey = k;
    const cur = G.state.highlights[k];
    const swatches = G.COLORS.map((c) =>
      '<button class="swatch' + (cur && cur.color === c ? ' on' : '') + '" data-color="' + c + '" style="background:' + c + '"></button>'
    ).join('') + '<button class="swatch none' + (!cur ? ' on' : '') + '" data-color=""></button>';
    openSheet(
      '<div class="sheet-grip"></div>' +
      '<div class="sheet-title">Bhagavad Gita ' + esc(k.replace('.', ':')) + '</div>' +
      '<div class="sheet-sub">To highlight, tap a color</div>' +
      '<div class="swatches">' + swatches + '</div>' +
      '<div class="grid2">' +
      '<button class="btn" id="shCopy">' + ICON.copy + 'Copy</button>' +
      '<button class="btn" id="shShare">' + ICON.share + 'Share</button>' +
      '<button class="btn" id="shCompare">' + ICON.compare + 'Compare</button>' +
      '<button class="btn" id="shNote">' + ICON.note + (G.noteFor(k) ? 'Edit note' : 'Note') + '</button>' +
      '</div>' +
      '<button class="btn ghost" id="shRead" style="margin-top:12px">Open in reader</button>'
    );
    $('#sheet').querySelectorAll('[data-color]').forEach((b) => (b.onclick = () => {
      G.setHighlight(k, b.dataset.color || null);
      toast(b.dataset.color ? 'Highlight saved' : 'Highlight removed');
      closeSheet();
      const verse = document.querySelector('.verse[data-key="' + k + '"]');
      if (verse) {
        const highlight = G.state.highlights[k];
        verse.classList.toggle('hl', !!highlight);
        if (highlight) verse.style.setProperty('--hl', highlight.color);
        else verse.style.removeProperty('--hl');
      }
    }));
    $('#shCopy').onclick = () => { copyText(verseExport(k)); closeSheet(); toast('Copied'); };
    $('#shShare').onclick = () => { closeSheet(); shareVerse(k); };
    $('#shCompare').onclick = () => openCompare(k);
    $('#shNote').onclick = () => { closeSheet(); openNoteModal(k); };
    $('#shRead').onclick = () => { closeSheet(); const t = G.parseKey(k); go('#/read/' + t.ch + '/' + t.v); };
  }

  function openCompare(k) {
    const v = G.verse(k);
    const blocks = [
      ['Sanskrit (original)', v.skt, 'sans'],
      ['Transliteration', v.tr, ''],
      ['English · Swami Sivananda', v.en, ''],
      ['हिन्दी · स्वामी रामसुखदास', v.hi, ''],
      ['नेपाली · यथारूप', v.ne, ''],
    ].filter((b) => b[1]);
    openSheet(
      '<div class="sheet-grip"></div>' +
      '<div class="sheet-title">Compare — ' + esc(G.refLabel(k)) + '</div>' +
      blocks.map((b) => '<div class="cmp-block"><div class="cb-lang">' + esc(b[0]) + '</div><div class="cb-text ' + b[2] + '">' + esc(b[1]) + '</div></div>').join('') +
      (!v.ne ? '<div class="cmp-block"><div class="cb-lang">नेपाली</div><div class="cb-text" style="font-size:16px;opacity:.7">Not available for this verse (see About for the OCR source note).</div></div>' : '')
    );
  }

  function verseExport(k) {
    const v = G.verse(k);
    const parts = [v.skt, '— ' + G.refLabel(k)];
    const m = G.meaningText(k);
    if (m) parts.push(m);
    return parts.join('\n\n');
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    fallbackCopy(text);
    function fallbackCopy(t) {
      const ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
  }
  function shareVerse(k) {
    const text = verseExport(k);
    if (navigator.share) navigator.share({ title: 'Bhagavad Gita ' + k, text }).catch(() => {});
    else { copyText(text); toast('Verse copied — paste it anywhere'); }
  }

  function openNoteModal(k) {
    const existing = G.noteFor(k);
    openModal(
      '<div class="sheet-title">Note — ' + esc(G.refLabel(k)) + '</div>' +
      '<div class="sheet-sub">Your note is saved on this device and backed up to Google when you are signed in online.</div>' +
      '<textarea class="note-input" id="noteText" placeholder="Write your reflection…">' + esc(existing ? existing.text : '') + '</textarea>' +
      '<div class="grid2" style="margin-top:14px">' +
      '<button class="btn ghost" id="noteCancel">Cancel</button>' +
      '<button class="btn primary" id="noteSave">Save</button>' +
      '</div>'
    );
    $('#noteCancel').onclick = closeModal;
    $('#noteSave').onclick = () => {
      const text = $('#noteText').value;
      if (existing) {
        const n = G.state.notes.find((x) => x.id === existing.id);
        if (n) { n.text = text.trim(); n.ts = Date.now(); G.save(); }
      } else G.addNote(k, text);
      closeModal();
      toast('Note saved');
      rerenderCurrent();
    };
  }

  /* ---------------- REFERENCES ---------------- */
  function renderReferences() {
    topbar(
      '<button class="tb-btn" id="refBack">' + ICON.back + '</button>' +
      '<div class="tb-title">References</div>' +
      '<div class="tb-spacer"></div>' +
      '<button class="tb-btn" id="refSort" title="Sort">' + ICON.az + '</button>' +
      '<button class="tb-btn" id="refHist" title="History">' + ICON.clock + '</button>'
    );
    $('#view').innerHTML =
      '<div class="searchbar">' + ICON.search + '<input id="refSearch" placeholder="Search chapter or verse" autocomplete="off"></div>' +
      '<div id="refList"></div>';
    $('#refBack').onclick = () => history.length > 1 ? history.back() : go('#/read');
    $('#refSort').onclick = () => {
      G.state.refSort = G.state.refSort === 'number' ? 'alpha' : 'number';
      G.save();
      drawRefList('');
      toast(G.state.refSort === 'number' ? 'Sorted by number' : 'Sorted A–Z');
    };
    $('#refHist').onclick = showHistory;
    $('#refSearch').addEventListener('input', (e) => drawRefList(e.target.value.trim()));
    drawRefList('');
    $('#transport').classList.add('hidden');
  }

  function drawRefList(q) {
    const st = G.state;
    let list = G.chapters.slice();
    if (st.refSort === 'alpha') list.sort((a, b) => a.meaning.localeCompare(b.meaning));
    let html = '';
    const ql = q.toLowerCase();
    if (q && /^\d+\.\d+$/.test(q)) {
      const k = q;
      if (G.verse(k)) html += verseSearchRow(k);
    }
    for (const c of list) {
      const matches = !q || (c.name.toLowerCase().includes(ql) || c.meaning.toLowerCase().includes(ql) || String(c.n) === q);
      if (!matches) continue;
      const read = G.chapterReadCount(c.n);
      const total = c.count + 1;
      const done = G.chapterDone(c.n);
      const dot = done ? '<span class="read-dot" title="Read"></span>' : '';
      html +=
        '<button class="ref-chapter" data-ch="' + c.n + '">' +
        '<span class="ref-chapter-title"><span class="ref-chapter-number">Chapter ' + c.n + '</span><span class="ref-chapter-name">' + esc(c.name) + dot + '</span>' +
        '<span class="ref-chapter-meaning">' + esc(c.meaning) + '</span></span>' +
        '<span class="ref-chapter-meta"><span>' + (read + (G.state.introRead[c.n] ? 1 : 0)) + ' of ' + total + '</span>' + ICON.chev + '</span></button>';
    }
    if (!html) html = '<div class="empty">Nothing matches “' + esc(q) + '”.<br>Try a chapter name like “devotion” or a reference like 2.47.</div>';
    const host = $('#refList');
    host.innerHTML = html;
    host.querySelectorAll('[data-ch]').forEach((b) => (b.onclick = () => {
      const ch = +b.dataset.ch;
      G.state.last = { ch, v: 1 };
      G.save();
      go('#/read/' + ch);
    }));
    host.querySelectorAll('[data-sref]').forEach((b) => (b.onclick = () => { const t = G.parseKey(b.dataset.sref); go('#/read/' + t.ch + '/' + t.v); }));
  }

  function verseSearchRow(k) {
    const v = G.verse(k);
    const m = G.meaningText(k);
    return '<button class="sr-item" data-sref="' + k + '"><div class="sr-ref">' + esc(G.refLabel(k)) + '</div>' +
      '<div class="sr-text">' + esc((m || v.skt).slice(0, 140)) + '</div></button>';
  }

  function showHistory() {
    const items = (G.state.history || []).map((k) =>
      '<button class="sr-item" data-href="' + k + '"><div class="sr-ref">' + esc(G.refLabel(k)) + '</div>' +
      '<div class="sr-text">' + esc(G.meaningText(k) || G.verse(k).skt).slice(0, 120) + '</div></button>'
    ).join('');
    openSheet(
      '<div class="sheet-grip"></div><div class="sheet-title">Recent</div>' +
      (items || '<div class="empty">Verses you open will appear here.</div>')
    );
    $('#sheet').querySelectorAll('[data-href]').forEach((b) => (b.onclick = () => {
      closeSheet();
      const t = G.parseKey(b.dataset.href);
      go('#/read/' + t.ch + '/' + t.v);
    }));
  }

  /* ---------------- SEARCH ---------------- */
  function renderSearch() {
    topbar(
      '<button class="tb-btn" id="sBack">' + ICON.back + '</button>' +
      '<div class="tb-title">Search</div>'
    );
    $('#view').innerHTML =
      '<div class="searchbar">' + ICON.search + '<input id="sInput" placeholder="Search Sanskrit, English, हिन्दी, नेपाली…" autocomplete="off"></div>' +
      '<div id="sResults"><div class="empty">Search every verse of the Gita in all four languages.<br>Try: “karma”, “आत्मा”, “शरणागति”.</div></div>';
    $('#sBack').onclick = () => history.length > 1 ? history.back() : go('#/today');
    const input = $('#sInput');
    input.addEventListener('input', () => doSearch(input.value.trim()));
    setTimeout(() => input.focus(), 60);
    $('#transport').classList.add('hidden');
  }

  function doSearch(q) {
    const host = $('#sResults');
    if (q.length < 2) {
      host.innerHTML = '<div class="empty">Type at least two characters.</div>';
      return;
    }
    const ql = q.toLowerCase();
    const hits = [];
    for (const k of G.keys) {
      const v = G.verse(k);
      const fields = [['skt', v.skt], ['en', v.en], ['hi', v.hi], ['ne', v.ne], ['tr', v.tr]];
      let found = null;
      if (k.includes(q)) found = { text: v.skt, field: 'ref' };
      else {
        for (const [f, t] of fields) {
          if (t && t.toLowerCase().includes(ql)) { found = { text: t, field: f }; break; }
        }
      }
      if (found) hits.push({ k, text: found.text, field: found.field });
      if (hits.length >= 60) break;
    }
    if (!hits.length) { host.innerHTML = '<div class="empty">No verses match “' + esc(q) + '”.</div>'; return; }
    host.innerHTML = hits.map((h) => {
      const idx = h.field === 'ref' ? -1 : h.text.toLowerCase().indexOf(ql);
      let excerpt = h.text;
      if (idx >= 0) {
        const s = Math.max(0, idx - 60);
        excerpt = (s > 0 ? '…' : '') + h.text.slice(s, idx) + '<mark>' + h.text.substr(idx, q.length) + '</mark>' + h.text.slice(idx + q.length, idx + q.length + 120);
      } else excerpt = h.text.slice(0, 160);
      return '<button class="sr-item" data-k="' + h.k + '"><div class="sr-ref">' + esc(G.refLabel(h.k)) + '</div>' +
        '<div class="sr-text">' + esc(excerpt).replace(/&lt;mark&gt;/g, '<mark>').replace(/&lt;\/mark&gt;/g, '</mark>') + '</div></button>';
    }).join('');
    host.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => {
      const t = G.parseKey(b.dataset.k);
      G.pushHistory(b.dataset.k);
      go('#/read/' + t.ch + '/' + t.v);
    }));
  }

  /* ---------------- GUIDES ---------------- */
  function renderGuides() {
    topbar('<div class="tb-title" style="padding-left:4px">Guides</div>');
    const plan = G.state.plan;
    const days = G.planDays();
    const html = G.GUIDES.map((g) => {
      let prog = '';
      if (g.plan) {
        const done = (plan.last && plan.day) ? plan.day : 0;
        prog = '<div class="gc-prog"><div class="prog-bar"><i style="width:' + Math.round((done / 30) * 100) + '%"></i></div>' +
          '<div class="faint" style="font-size:13px;margin-top:6px">Day ' + Math.max(1, done) + ' of 30</div></div>';
      }
      return '<button class="guide-card" data-g="' + g.id + '">' +
        '<div class="gc-kind">' + esc(g.kind) + '</div>' +
        '<div class="gc-title">' + esc(g.title) + '</div>' +
        '<div class="gc-sub">' + esc(g.sub) + '</div>' + prog +
        (g.plan ? '' : '<div class="faint" style="font-size:13px;margin-top:10px">' + g.verses.length + ' verses</div>') +
        '</button>';
    }).join('');
    $('#view').innerHTML = html;
    $('#view').querySelectorAll('[data-g]').forEach((b) => (b.onclick = () => go('#/guide/' + b.dataset.g)));
    $('#transport').classList.add('hidden');
  }

  function renderGuide(id) {
    const g = G.GUIDES.find((x) => x.id === id);
    if (!g) return go('#/guides');
    topbar('<button class="tb-btn" id="gBack">' + ICON.back + '</button><div class="tb-title">Guide</div>');
    if (g.plan) return renderPlan(g);
    const rows = g.verses.map((k) =>
      '<button class="gv-item" data-k="' + k + '">' +
      '<span class="gi-ref">' + esc(G.refLabel(k).replace('BG ', '')) + '</span>' +
      '<span class="gi-text">' + esc(G.meaningText(k) || G.verse(k).skt) + '</span></button>'
    ).join('');
    $('#view').innerHTML =
      '<div class="section-label">' + esc(g.kind) + '</div>' +
      '<h2 style="font-family:var(--serif);font-size:27px;margin:4px 2px 8px">' + esc(g.title) + '</h2>' +
      '<p class="muted" style="margin:0 2px 18px;line-height:1.55">' + esc(g.sub) + '</p>' + rows;
    $('#gBack').onclick = () => go('#/guides');
    $('#view').querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => {
      const t = G.parseKey(b.dataset.k);
      G.pushHistory(b.dataset.k);
      go('#/read/' + t.ch + '/' + t.v);
    }));
    $('#transport').classList.add('hidden');
  }

  function renderPlan(g) {
    const days = G.planDays();
    const plan = G.state.plan;
    const doneDay = plan.last === G.todayKey() || plan.last === yesterday() ? plan.day : 0;
    const rows = days.map((d) => {
      const isDone = d.day <= doneDay;
      const isNext = d.day === doneDay + 1;
      return '<div class="prog-row" style="opacity:' + (isNext ? 1 : isDone ? .65 : .45) + '">' +
        '<div class="pr-top"><span><b>Day ' + d.day + '</b> · Chapters ' + (d.from.ch === d.to.ch ? d.from.ch : d.from.ch + '–' + d.to.ch) + '</span>' +
        '<span class="' + (isDone ? '' : 'faint') + '">' + (isDone ? '✓ read' : G.parseKey(d.start).v + '–' + G.parseKey(d.end).v + ' of ch ' + d.start.split('.')[0]) + '</span></div>' +
        '<div class="prog-bar"><i style="width:' + (isDone ? 100 : isNext ? 35 : 0) + '%"></i></div>' +
        '<div style="display:flex;gap:10px;margin-top:8px">' +
        '<button class="btn ghost" style="padding:8px;font-size:13.5px" data-open="' + d.start + '">Open</button>' +
        (isNext || isDone ? '' : '<button class="btn ghost" style="padding:8px;font-size:13.5px" data-open="' + d.start + '">Read</button>') +
        '</div></div>';
    }).join('');
    $('#view').innerHTML =
      '<div class="section-label">' + esc(g.kind) + '</div>' +
      '<h2 style="font-family:var(--serif);font-size:27px;margin:4px 2px 8px">' + esc(g.title) + '</h2>' +
      '<p class="muted" style="margin:0 2px 16px;line-height:1.55">' + esc(g.sub) + '</p>' +
      '<div class="card" style="margin-bottom:18px"><b>Day ' + Math.max(1, doneDay + 1) + ' of 30</b>' +
      '<div class="muted" style="font-size:14.5px;margin-top:4px">Read today’s verses, then mark the day complete.</div>' +
      '<div class="grid2" style="margin-top:14px">' +
      '<button class="btn primary" id="planOpen">Open day ' + Math.max(1, doneDay + 1) + '</button>' +
      '<button class="btn" id="planDone">Mark day read</button></div></div>' + rows;
    $('#gBack').onclick = () => go('#/guides');
    $('#planOpen').onclick = () => {
      const d = days[Math.max(0, Math.min(29, doneDay))];
      const t = G.parseKey(d.start);
      go('#/read/' + t.ch + '/' + t.v);
    };
    $('#planDone').onclick = () => {
      const idx = Math.max(0, Math.min(29, doneDay));
      const d = days[idx];
      G.keys.forEach((k) => {
        const p = G.parseKey(k);
        const order = verseOrder(k);
        const fromOrder = verseOrder(d.start);
        const toOrder = verseOrder(d.end);
        if (order >= fromOrder && order <= toOrder) G.markRead(k);
      });
      G.state.plan = { day: idx + 1, last: G.todayKey() };
      G.save();
      toast('Day ' + (idx + 1) + ' complete');
      renderPlan(g);
    };
    $('#view').querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => {
      const t = G.parseKey(b.dataset.open);
      G.pushHistory(b.dataset.open);
      go('#/read/' + t.ch + '/' + t.v);
    }));
    $('#transport').classList.add('hidden');
  }

  function yesterday() { return G.todayKey(new Date(Date.now() - 86400000)); }
  function verseOrder(k) {
    const { ch, v } = G.parseKey(k);
    let acc = 0;
    for (let i = 1; i < ch; i++) acc += G.chapter(i).count;
    return acc + v;
  }

  /* ---------------- PROFILE ---------------- */
  function renderProfile() {
    topbar(
      '<button class="tb-btn hamb" id="pfMenu">' + ICON.menu + '</button>' +
      '<div class="tb-center"><div class="tb-title">My Profile</div></div>' +
      '<div class="tb-spacer"></div>'
    );
    const tabs = [['highlights', 'Highlights'], ['progress', 'Reading Progress'], ['prayer', 'Prayer'], ['notes', 'Notes'], ['streaks', 'Streaks']];
    const cur = G.state.profileTab || 'highlights';
    const pillHtml = tabs.map(([id, label]) =>
      '<button class="pill-tab' + (cur === id ? ' active' : '') + '" data-pt="' + id + '">' + label + '</button>'
    ).join('');
    $('#view').innerHTML = '<div class="pill-tabs">' + pillHtml + '</div><div id="pfBody"></div>';
    $('#view').querySelectorAll('[data-pt]').forEach((b) => (b.onclick = () => {
      G.state.profileTab = b.dataset.pt;
      G.save();
      renderProfile();
    }));
    $('#pfMenu').onclick = openProfileMenu;
    drawProfileBody(cur);
    $('#transport').classList.add('hidden');
  }

  function drawProfileBody(tab) {
    const host = $('#pfBody');
    const st = G.state;
    if (tab === 'highlights') {
      const items = Object.entries(st.highlights).sort((a, b) => b[1].ts - a[1].ts);
      if (!items.length) return (host.innerHTML = emptyState('No highlights yet.\nTap a verse in the reader, then pick a color.'));
      let html = '';
      let day = '';
      for (const [k, h] of items) {
        const d = G.fmtDate(h.ts);
        if (d !== day) { day = d; html += '<div class="entry-date">' + d + '</div>'; }
        html += '<div class="entry" style="border-color:' + h.color + '">' +
          '<div class="ev-text">' + esc(G.meaningText(k) || G.verse(k).skt) + '</div>' +
          '<div class="ev-ref">' + esc(G.refLabel(k)) + ' · ' + G.LANGS[st.lang].label + '</div>' +
          '<div class="entry-actions"><button data-open="' + k + '">Open</button><button data-unhl="' + k + '">Remove</button></div>' +
          '</div>';
      }
      host.innerHTML = html;
      host.querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => { const t = G.parseKey(b.dataset.open); go('#/read/' + t.ch + '/' + t.v); }));
      host.querySelectorAll('[data-unhl]').forEach((b) => (b.onclick = () => { G.setHighlight(b.dataset.unhl, null); renderProfile(); }));
    } else if (tab === 'progress') {
      const read = G.readCount();
      let html =
        '<div class="card" style="margin-top:14px"><div style="display:flex;gap:20px;justify-content:space-around;text-align:center">' +
        '<div><div style="font-size:30px;font-weight:800">' + read + '</div><div class="muted" style="font-size:14px">verses read</div></div>' +
        '<div><div style="font-size:30px;font-weight:800">' + G.chaptersDone() + '</div><div class="muted" style="font-size:14px">chapters read</div></div>' +
        '<div><div style="font-size:30px;font-weight:800">' + Object.keys(st.highlights).length + '</div><div class="muted" style="font-size:14px">highlights</div></div>' +
        '</div></div><div class="section-label">By chapter</div>';
      for (const c of G.chapters) {
        const r = G.chapterReadCount(c.n);
        const pct = Math.round((r / c.count) * 100);
        html += '<div class="prog-row"><div class="pr-top"><span>' + c.n + '. ' + esc(c.name) + '</span><span class="faint">' + r + '/' + c.count + '</span></div>' +
          '<div class="prog-bar"><i style="width:' + pct + '%"></i></div></div>';
      }
      host.innerHTML = html;
    } else if (tab === 'prayer') {
      if (!st.prayers.length) return (host.innerHTML = emptyState('No saved prayers.\nOpen Today’s Prayer and add one.'));
      host.innerHTML = st.prayers.map((p) =>
        '<div class="entry" style="border-color:var(--amber);margin-top:16px">' +
        '<div class="ev-ref" style="margin:0 0 6px">' + esc(p.title) + ' · ' + G.fmtDate(p.ts) + '</div>' +
        '<div class="ev-note">' + esc(p.text) + '</div>' +
        '<div class="entry-actions"><button data-delp="' + p.id + '">Delete</button></div></div>'
      ).join('');
      host.querySelectorAll('[data-delp]').forEach((b) => (b.onclick = () => { G.deletePrayer(b.dataset.delp); renderProfile(); }));
    } else if (tab === 'notes') {
      if (!st.notes.length) return (host.innerHTML = emptyState('No notes yet.\nTap Note under any verse to write one.'));
      host.innerHTML = st.notes.map((n) =>
        '<div class="entry" style="border-color:var(--line);margin-top:16px">' +
        '<div class="ev-ref" style="margin:0 0 6px">' + esc(G.refLabel(n.ref)) + ' · ' + G.fmtDate(n.ts) + '</div>' +
        '<div class="ev-note">' + esc(n.text) + '</div>' +
        '<div class="entry-actions"><button data-open="' + n.ref + '">Open</button><button data-del="' + n.id + '">Delete</button></div></div>'
      ).join('');
      host.querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => { const t = G.parseKey(b.dataset.open); go('#/read/' + t.ch + '/' + t.v); }));
      host.querySelectorAll('[data-del]').forEach((b) => (b.onclick = () => { G.deleteNote(b.dataset.del); renderProfile(); }));
    } else if (tab === 'streaks') {
      const s = st.streak;
      const days = (s.days || []).slice(-30);
      host.innerHTML =
        '<div class="card" style="margin-top:14px"><div class="streak-stats">' +
        '<div class="streak-stat"><div class="num">' + (s.current || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Current Streak</div></div>' +
        '<div class="streak-divider"></div>' +
        '<div class="streak-stat"><div class="num">' + (s.best || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Best Streak</div></div>' +
        '</div><div class="streak-copy">Streaks help you build your Gita habit to sit with the scripture daily.</div></div>' +
        '<div class="section-label">Last 30 days</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        (days.length ? days.map(() => '<span style="width:22px;height:22px;border-radius:6px;background:var(--green)"></span>').join('')
          : '<span class="faint">Open a verse today to start a streak.</span>') +
        '</div>';
    }
  }
  function emptyState(text) {
    return '<div class="empty">' + esc(text).replace(/\n/g, '<br>') + '</div>';
  }

  /* ---------------- SETTINGS / ABOUT ---------------- */
  function openSettingsSheet() {
    const s = G.state.settings;
    const st = G.state;
    openSheet(
      '<div class="sheet-grip"></div><div class="sheet-title">Settings</div>' +
      '<div class="field"><div><div class="f-label">Text size</div><div class="f-sub">Applies to scripture and meanings</div></div>' +
      '<div class="stepper"><button id="fsDown">−</button><span id="fsVal">' + s.fs + '</span><button id="fsUp">+</button></div></div>' +
      '<div class="field"><div><div class="f-label">Meaning language</div></div>' +
      '<div class="seg" id="langSeg">' +
      ['en', 'hi', 'ne'].map((l) => '<button data-l="' + l + '"' + (st.lang === l ? ' class="on"' : '') + '>' + G.LANGS[l].label + '</button>').join('') +
      '</div></div>' +
      '<div class="field"><div><div class="f-label">Theme</div></div>' +
      '<div class="seg" id="themeSeg">' +
      '<button data-t="dark"' + (s.theme === 'dark' ? ' class="on"' : '') + '>Dark</button>' +
      '<button data-t="light"' + (s.theme === 'light' ? ' class="on"' : '') + '>Light</button></div></div>' +
      '<div class="field"><div><div class="f-label">Show transliteration</div><div class="f-sub">IAST under the Sanskrit</div></div>' +
      '<div class="seg" id="trSeg"><button data-tr="1"' + (s.showTranslit ? ' class="on"' : '') + '>On</button><button data-tr="0"' + (!s.showTranslit ? ' class="on"' : '') + '>Off</button></div></div>' +
      '<div class="field"><div><div class="f-label">Show meaning</div><div class="f-sub">Meaning under every verse</div></div>' +
      '<div class="seg" id="mnSeg"><button data-mn="1"' + (s.showMeaning ? ' class="on"' : '') + '>On</button><button data-mn="0"' + (!s.showMeaning ? ' class="on"' : '') + '>Off</button></div></div>' +
      '<div class="field"><div><div class="f-label">Reading speed</div><div class="f-sub">For the listen button</div></div>' +
      '<div class="seg" id="rateSeg">' +
      [['0.75', 'Slow'], ['0.95', 'Normal'], ['1.15', 'Fast']].map(([v, l]) => '<button data-rate="' + v + '"' + (+s.rate === +v ? ' class="on"' : '') + '>' + l + '</button>').join('') +
      '</div></div>' +
      '<button class="btn ghost" id="setAbout" style="margin-top:14px">About &amp; sources</button>'
    );
    const bump = (d) => { s.fs = Math.max(1, Math.min(5, s.fs + d)); $('#fsVal').textContent = s.fs; G.save(); applySettings(); };
    $('#fsDown').onclick = () => bump(-1);
    $('#fsUp').onclick = () => bump(1);
    $('#sheet').querySelectorAll('[data-l]').forEach((b) => (b.onclick = () => { st.lang = b.dataset.l; G.save(); closeSheet(); rerenderCurrent(); }));
    $('#sheet').querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => { s.theme = b.dataset.t; G.save(); applySettings(); openSettingsSheet(); }));
    $('#sheet').querySelectorAll('[data-tr]').forEach((b) => (b.onclick = () => { s.showTranslit = b.dataset.tr === '1'; G.save(); closeSheet(); rerenderCurrent(); }));
    $('#sheet').querySelectorAll('[data-mn]').forEach((b) => (b.onclick = () => { s.showMeaning = b.dataset.mn === '1'; G.save(); closeSheet(); rerenderCurrent(); }));
    $('#sheet').querySelectorAll('[data-rate]').forEach((b) => (b.onclick = () => { s.rate = +b.dataset.rate; G.save(); openSettingsSheet(); }));
    $('#setAbout').onclick = () => { closeSheet(); openAbout(); };
  }

  function openAbout() {
    const m = G.GITA_META || window.GITA.meta;
    openSheet(
      '<div class="sheet-grip"></div><div class="sheet-title">About</div>' +
      '<div class="sheet-sub">Bhagavad Gita — ' + m.verseTotal + ' verses · ' + m.chapterTotal + ' chapters · four languages offline.</div>' +
      '<div class="cmp-block"><div class="cb-lang">Original text</div><div style="font-size:15.5px;line-height:1.6;color:var(--text-dim)">Sanskrit (Devanagari), I transliteration and word-for-word meanings — the standard 700-verse recension.</div></div>' +
      '<div class="cmp-block"><div class="cb-lang">Meanings</div>' +
      '<ul class="license" style="padding-left:18px">' +
      '<li><b>English</b> — Swami Sivananda</li>' +
      '<li><b>हिन्दी</b> — स्वामी रामसुखदास (गीता प्रेस)</li>' +
      '<li><b>नेपाली</b> — श्रीमद्भगवद्गीता यथारूप (स्क्यान गरिएको प्रतिबाट OCR गरिएको पाठ; केही त्रुटि हुन सक्छ)</li>' +
      '</ul></div>' +
      '<div class="cmp-block"><div class="cb-lang">Data sources</div><ul class="license" style="padding-left:18px">' +
      m.sources.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul></div>' +
      '<div class="cmp-block"><div class="cb-lang">Your data</div><div style="font-size:15.5px;line-height:1.6;color:var(--text-dim)">Your highlights, notes, prayers and reading progress stay on this device. When you sign in with Google, they are also backed up to your private Firebase account whenever you are online.</div></div>'
    );
  }

  /* ---------------- PRAYER ---------------- */
  function renderPrayer() {
    topbar('<button class="tb-btn" id="pBack">' + ICON.back + '</button><div class="tb-title">Prayer</div>');
    const saved = G.state.prayers;
    const html = G.PRAYERS.map((p) =>
      '<div class="card prayer-card" style="margin-bottom:14px">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">' +
      '<div><div style="font-weight:800;font-size:17.5px">' + esc(p.title) + '</div>' +
      '<div class="faint" style="font-size:13.5px;margin-top:2px">' + esc(p.src) + '</div></div>' +
      '<div style="display:flex;gap:2px">' +
      '<button class="tb-btn" data-bell="' + p.id + '" title="Set a reminder">' + ICON.bell + '</button>' +
      '<button class="tb-btn" data-say="' + p.id + '" title="Listen">' + ICON.mic + '</button></div></div>' +
      '<div style="font-family:var(--serif);font-size:calc(21px * var(--fs));line-height:1.6;margin:14px 0 10px;white-space:pre-wrap">' + esc(p.skt) + '</div>' +
      '<div class="muted" style="font-size:15.5px;line-height:1.55">' + esc(p.meaning) + '</div>' +
      '<div class="prayer-actions">' +
      '<button class="btn primary" data-om="' + p.id + '"><span class="om-symbol" aria-hidden="true">ॐ</span>Mark as practiced</button>' +
      '<button class="btn save-prayer" data-pray="' + p.id + '">' + ICON.bookmark + 'Save Prayer</button>' +
      '<button class="btn ghost" data-ppray="' + p.id + '">Write my own</button>' +
      '</div></div>'
    ).join('') +
    (saved.length ? '<div class="section-label">My prayers</div>' + saved.map((p) =>
      '<div class="entry" style="border-color:var(--amber);margin-bottom:16px">' +
      '<div class="ev-ref" style="margin:0 0 6px">' + esc(p.title) + ' · ' + G.fmtDate(p.ts) + '</div>' +
      '<div class="ev-note">' + esc(p.text) + '</div>' +
      '<div class="entry-actions"><button data-delp="' + p.id + '">Delete</button></div></div>').join('') : '');
    $('#view').innerHTML = html;
    $('#pBack').onclick = () => history.length > 1 ? history.back() : go('#/today');
    $('#view').querySelectorAll('[data-say]').forEach((b) => (b.onclick = () => {
      const p = G.PRAYERS.find((x) => x.id === b.dataset.say);
      G.stopSpeech(); G.speak(p.skt, 'sa'); toast('Chanting ' + p.title);
    }));
    $('#view').querySelectorAll('[data-om]').forEach((b) => (b.onclick = () => {
      const p = G.PRAYERS.find((x) => x.id === b.dataset.om);
      b.classList.add('om-on');
      b.innerHTML = '<span class="om-symbol" aria-hidden="true">ॐ</span>Practiced ✓';
      G.addPrayer(p.title, p.skt + '\n\n' + p.meaning);
      G.markRead(G.verseOfDay());
      toast('ॐ — recorded in your prayers');
    }));
    $('#view').querySelectorAll('[data-bell]').forEach((b) => (b.onclick = () => {
      b.classList.toggle('bell-on');
      toast(b.classList.contains('bell-on') ? 'Reminder set for this prayer' : 'Reminder removed');
    }));
    $('#view').querySelectorAll('[data-pray]').forEach((b) => (b.onclick = () => {
      const p = G.PRAYERS.find((x) => x.id === b.dataset.pray);
      G.addPrayer(p.title, p.skt + '\n\n' + p.meaning);
      toast('Saved to Profile → Prayer');
      renderPrayer();
    }));
    $('#view').querySelectorAll('[data-ppray]').forEach((b) => (b.onclick = () => openPrayerModal(b.dataset.ppray)));
    $('#view').querySelectorAll('[data-delp]').forEach((b) => (b.onclick = () => { G.deletePrayer(b.dataset.delp); renderPrayer(); }));
    $('#transport').classList.add('hidden');
  }

  function openPrayerModal(id) {
    const p = G.PRAYERS.find((x) => x.id === id);
    openModal(
      '<div class="sheet-title">My prayer</div>' +
      '<div class="sheet-sub">' + esc(p.title) + '</div>' +
      '<textarea class="note-input" id="prayText" placeholder="Write your prayer or vow…"></textarea>' +
      '<div class="grid2" style="margin-top:14px"><button class="btn ghost" id="pCancel">Cancel</button><button class="btn primary" id="pSave">Save</button></div>'
    );
    $('#pCancel').onclick = closeModal;
    $('#pSave').onclick = () => { G.addPrayer(p.title, $('#prayText').value); closeModal(); toast('Saved'); renderPrayer(); };
  }

  /* ---------------- PRACTICE (memorize flow) ---------------- */
  // Stages: read (verse shown, read aloud) -> hide (cover/show) -> fill (fill-in-the-blank) -> done
  let memKey = null;
  let memStage = 'read';
  let memRevealed = 0;
  let fillState = null; // { slots:[], pool:[] } for the fill-in-the-blank round

  function practiceWords(k) {
    const v = G.verse(k);
    // prefer the meaning in the chosen language; fall back to Sanskrit
    const text = (G.meaningText(k) || v.skt).replace(/\s*॥\s*\d+(?:\.\d+)?\s*॥\s*$/, '').trim();
    return text.split(/\s+/).filter(Boolean);
  }

  function renderMemorize() {
    if (!memKey) { memKey = pickMemorizeKey(); memStage = 'read'; memRevealed = 0; fillState = null; }
    if (memStage === 'read') return renderPracticeRead();
    if (memStage === 'hide') return renderPracticeHide();
    if (memStage === 'fill') return renderPracticeFill();
    if (memStage === 'done') return renderPracticeDone();
    renderPracticeRead();
  }

  function practiceTopbar(title) {
    topbar('<button class="tb-btn" id="mBack">' + ICON.back + '</button>' +
      '<div class="tb-center"><div class="tb-title">' + title + '</div></div><div class="tb-spacer"></div>' +
      '<button class="tb-btn" id="mShuffle" title="Shuffle verse">↻</button>');
    $('#mBack').onclick = () => {
      if (memStage !== 'read' && memStage !== 'done') { memStage = 'read'; memRevealed = 0; renderMemorize(); }
      else { memKey = null; history.length > 1 ? history.back() : go('#/today'); }
    };
    $('#mShuffle').onclick = () => { memKey = G.keys[Math.floor(Math.random() * G.keys.length)]; resetPractice(); renderMemorize(); };
  }

  function resetPractice() { memStage = 'read'; memRevealed = 0; fillState = null; }

  // ---- Stage 1: read the verse out loud ----
  function renderPracticeRead() {
    practiceTopbar('Practice');
    const words = practiceWords(memKey);
    const meaning = G.meaningText(memKey) || G.verse(memKey).skt;
    $('#view').innerHTML =
      '<p class="practice-instruct">Read the verse out loud, then continue.</p>' +
      '<div class="practice-card">' +
      '<div class="pc-verse">' + esc(words.join(' ')) + '</div>' +
      '<div class="pc-ref">' + esc(G.refLabel(memKey).replace('BG ', '')) + '</div>' +
      '<div class="grid2" style="margin-top:18px">' +
      '<button class="btn" id="pcListen">' + ICON.headphone + 'Listen</button>' +
      '<button class="btn primary" id="pcStart">Start practice</button>' +
      '</div></div>' +
      '<div class="practice-hint">Try saying it from memory before you tap Start.</div>';
    $('#pcListen').onclick = () => { G.stopSpeech(); G.speak(meaning, G.meaningText(memKey) ? G.state.lang : 'sa'); };
    $('#pcStart').onclick = () => { memStage = 'hide'; memRevealed = 0; renderMemorize(); };
    $('#transport').classList.add('hidden');
  }

  // ---- Stage 2: hide the verse, reveal to check ----
  function renderPracticeHide() {
    practiceTopbar('Practice');
    const words = practiceWords(memKey);
    const revealCount = memRevealed === -1 ? words.length : Math.max(1, Math.ceil(words.length * memRevealed / 3));
    const shown = words.map((w, i) =>
      '<span class="mem-word ' + (i < revealCount || memRevealed === -1 ? 'shown-w' : 'hidden-w') + '">' + esc(w) + '</span>'
    ).join(' ');
    const allShown = memRevealed === -1 || memRevealed >= 3;
    $('#view').innerHTML =
      '<p class="practice-instruct">Say it from memory, then reveal to check.</p>' +
      '<div class="practice-card">' +
      '<div class="mem-verse">' + shown + '</div>' +
      '<div class="pc-ref">' + esc(G.refLabel(memKey).replace('BG ', '')) + '</div>' +
      '<button class="btn primary" id="pcReveal" style="margin-top:18px">' + (allShown ? 'Hide verse' : 'Reveal more') + '</button>' +
      '</div>' +
      '<div class="practice-next-wrap">' +
      '<button class="next-fab' + (allShown ? ' ready' : '') + '" id="pcNext" aria-label="Next step">→</button>' +
      '</div>';
    $('#pcReveal').onclick = () => {
      if (allShown) memRevealed = 0;
      else { memRevealed++; if (memRevealed > 3) memRevealed = -1; }
      renderMemorize();
    };
    $('#pcNext').onclick = () => {
      if (!allShown) { toast('Reveal the whole verse first'); return; }
      startFillRound();
      memStage = 'fill';
      renderMemorize();
    };
    $('#transport').classList.add('hidden');
  }

  // ---- Stage 3: fill in the blank (tap or drag word tiles) ----
  function startFillRound() {
    const words = practiceWords(memKey);
    // blank out roughly every other content word, keep a handful visible
    const isBlank = (w, i) => {
      const clean = w.replace(/[^\p{L}\p{N}]/gu, '');
      if (clean.length < 3) return false;         // keep short/punctuation words visible
      return i % 2 === 0;                          // blank alternate words
    };
    const blanks = [];
    const slots = words.map((w, i) => {
      if (isBlank(w, i)) { const b = { word: w, idx: blanks.length, filled: null }; blanks.push(b); return { blank: b }; }
      return { word: w };
    });
    // pool = blanked words + a few decoys, shuffled
    const decoys = [];
    const wantDecoys = Math.min(3, words.length);
    for (let d = 0; d < wantDecoys; d++) {
      const cand = words[(d * 3 + 1) % words.length];
      if (cand && !blanks.some((b) => b.word === cand)) decoys.push(cand);
    }
    const pool = blanks.map((b) => b.word).concat(decoys).map((w, i) => ({ id: 'w' + i, word: w }));
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    fillState = { slots, pool, blanks };
  }

  function renderPracticeFill() {
    practiceTopbar('Fill in the Blank');
    if (!fillState) startFillRound();
    const st = fillState;
    const solved = st.blanks.every((b) => b.filled != null);
    // build the sentence with tappable blanks
    let sentHtml = '';
    let bi = 0;
    for (const cell of st.slots) {
      if (cell.word != null) { sentHtml += '<span class="fill-word">' + esc(cell.word) + '</span> '; continue; }
      const b = cell.blank;
      const filled = b.filled != null ? st.pool.find((p) => p.id === b.filled) : null;
      sentHtml += '<button class="fill-slot' + (filled ? ' filled' : '') + '" data-slot="' + b.idx + '">' +
        (filled ? esc(filled.word) : '&nbsp;') + '</button> ';
      bi++;
    }
    const poolHtml = st.pool.map((p) =>
      '<button class="word-tile' + (p.used ? ' used' : '') + '" data-tile="' + p.id + '" draggable="true">' + esc(p.word) + '</button>'
    ).join('');
    $('#view').innerHTML =
      '<div class="fill-ref">' + esc(G.refLabel(memKey).replace('BG ', '')) + '</div>' +
      '<p class="practice-instruct" style="margin-top:0">Tap a word, then tap a blank — or drag it in.</p>' +
      '<div class="fill-sentence">' + sentHtml + '</div>' +
      '<div class="section-label">Tap or drag</div>' +
      '<div class="word-bank">' + poolHtml + '</div>' +
      '<div class="grid2" style="margin:22px 0 8px">' +
      '<button class="btn ghost" id="fillSkip">Skip</button>' +
      '<button class="btn primary" id="fillCheck"' + (solved ? '' : ' disabled') + '>Check</button>' +
      '</div>';
    wireFill(st);
    $('#fillSkip').onclick = () => { memStage = 'done'; renderMemorize(); };
    $('#fillCheck').onclick = () => {
      if (!solved) return;
      const correct = st.blanks.every((b) => b.filled && st.pool.find((p) => p.id === b.filled).word === b.word);
      toast(correct ? 'Perfect — every word in place!' : 'Some words are off — keep going');
      memStage = 'done';
      renderMemorize();
    };
    $('#transport').classList.add('hidden');
  }

  function wireFill(st) {
    let selectedTile = null;
    const tiles = $('#view').querySelectorAll('[data-tile]');
    const slots = $('#view').querySelectorAll('[data-slot]');
    tiles.forEach((t) => {
      t.addEventListener('click', () => {
        if (t.classList.contains('used')) return;
        tiles.forEach((x) => x.classList.remove('sel'));
        if (selectedTile === t.dataset.tile) { selectedTile = null; return; }
        selectedTile = t.dataset.tile;
        t.classList.add('sel');
      });
      t.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', t.dataset.tile); });
    });
    slots.forEach((s) => {
      s.addEventListener('click', () => {
        const bi = +s.dataset.slot;
        const b = st.blanks[bi];
        // tapping a filled blank returns the word to the pool
        if (b.filled != null) { const p = st.pool.find((x) => x.id === b.filled); if (p) p.used = false; b.filled = null; renderPracticeFill(); return; }
        if (!selectedTile) { toast('Pick a word below first'); return; }
        placeTile(bi, selectedTile);
        selectedTile = null;
      });
      s.addEventListener('dragover', (e) => { e.preventDefault(); });
      s.addEventListener('drop', (e) => { e.preventDefault(); placeTile(+s.dataset.slot, e.dataTransfer.getData('text/plain')); });
    });
    function placeTile(bi, tileId) {
      const b = st.blanks[bi];
      const p = st.pool.find((x) => x.id === tileId);
      if (!b || !p || p.used) return;
      // if this blank already held a word, free it
      if (b.filled != null) { const prev = st.pool.find((x) => x.id === b.filled); if (prev) prev.used = false; }
      b.filled = p.id;
      p.used = true;
      renderPracticeFill();
    }
  }

  // ---- Stage 4: completion ----
  function renderPracticeDone() {
    practiceTopbar(' '); // keep bar minimal; heading lives in the view
    topbar('<button class="tb-btn" id="mBack">' + ICON.back + '</button><div class="tb-spacer"></div>' +
      '<button class="btn ghost" id="mSave" style="width:auto;padding:8px 16px">Save</button>');
    $('#mBack').onclick = () => { memKey = null; history.length > 1 ? history.back() : go('#/today'); };
    $('#mSave').onclick = () => { G.markRead(memKey); toast('Verse saved to your practice'); };
    const last = G.state.last;
    const words = practiceWords(memKey);
    $('#view').innerHTML =
      '<h2 class="done-title">Time well spent!</h2>' +
      '<div class="done-art" aria-hidden="true">' + ICON.heart + '</div>' +
      '<div class="done-verse">' + esc(words.join(' ')) + '</div>' +
      '<div class="pc-ref" style="text-align:center">' + esc(G.refLabel(memKey).replace('BG ', '')) + '</div>' +
      '<button class="row-card" data-go="#/read/' + last.ch + '" style="margin-top:26px">' +
      '<span class="row-thumb">' + ICON.library + '</span><span class="rc-body"><span class="rc-title">Continue Reading</span>' +
      '<span class="rc-sub">Chapter ' + last.ch + '</span></span>' + ICON.chev + '</button>' +
      '<button class="btn primary" id="mDone" style="margin-top:18px">Done</button>';
    $('#view').querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(b.dataset.go)));
    $('#mDone').onclick = () => { G.markRead(memKey); memKey = null; go('#/today'); };
    $('#transport').classList.add('hidden');
  }

  /* ---------------- PROGRESS SUMMARY ---------------- */
  function renderProgress() {
    topbar('<button class="tb-btn" id="pgBack">' + ICON.back + '</button><div class="tb-title">Reading Progress</div>');
    const read = G.readCount();
    const pct = Math.round((read / G.keys.length) * 100);
    let html = '<div class="card" style="margin-top:16px;text-align:center">' +
      '<div class="ring-wrap" style="width:130px;height:130px;margin:0 auto">' +
      '<svg viewBox="0 0 60 60" width="130" height="130"><circle class="ring-bg" cx="30" cy="30" r="24" stroke-width="5" fill="none"/>' +
      '<circle class="ring-fg" cx="30" cy="30" r="24" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="' + (pct / 100 * 2 * Math.PI * 24) + ' ' + (2 * Math.PI * 24) + '"/></svg>' +
      '<div class="ring-label" style="font-size:26px">' + pct + '%</div></div>' +
      '<div style="margin-top:14px;font-weight:800;font-size:18px">' + read + ' of ' + G.keys.length + ' verses read</div>' +
      '<div class="muted" style="font-size:15px;margin-top:4px">' + G.chaptersDone() + ' of 18 chapters completed · ' +
      Object.keys(G.state.highlights).length + ' highlights · ' + G.state.notes.length + ' notes</div>' +
      '<div class="streak-stats" style="margin-top:18px">' +
      '<div class="streak-stat"><div class="num">' + (G.state.streak.current || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Current Streak</div></div>' +
      '<div class="streak-divider"></div>' +
      '<div class="streak-stat"><div class="num">' + (G.state.streak.best || 0) + ' ' + ICON.bolt + '</div><div class="lbl">Best Streak</div></div>' +
      '</div></div><div class="section-label">By chapter</div>';
    for (const c of G.chapters) {
      const r = G.chapterReadCount(c.n);
      html += '<div class="prog-row"><div class="pr-top"><span>' + c.n + '. ' + esc(c.name) + '</span><span class="faint">' + r + '/' + c.count + '</span></div>' +
        '<div class="prog-bar"><i style="width:' + Math.round((r / c.count) * 100) + '%"></i></div></div>';
    }
    $('#view').innerHTML = html;
    $('#pgBack').onclick = () => history.length > 1 ? history.back() : go('#/today');
    $('#transport').classList.add('hidden');
  }

  /* ---------------- MORE ---------------- */
  function renderMore() {
    topbar(
      '<div class="tb-center"><div class="tb-title">More</div></div>' +
      '<div class="tb-spacer"></div>'
    );
    const authed = G.isAuthed();
    const a = G.state.auth || {};
    const authCard = authed
      ? '<div class="card auth-card" style="margin-bottom:18px">' +
        '<div class="auth-row">' +
        (a.picture ? '<img class="auth-pic" src="' + esc(a.picture) + '" alt="">' : '<span class="auth-pic auth-pic-fb">' + esc((a.name || '?').slice(0, 1).toUpperCase()) + '</span>') +
        '<div class="auth-id"><div class="auth-name">' + esc(a.name || 'Signed in') + '</div><div class="auth-sub">' + esc(GitaCloud && a.provider === 'google' ? GitaCloud.status() : (a.email || a.provider)) + '</div></div>' +
        '<button class="tb-btn" id="authSignOut" title="Sign out">' + ICON.logout + '</button>' +
        '</div></div>'
      : '<button class="card auth-cta" id="authCta">' +
        '<span class="auth-cta-ic">' + ICON.user + '</span>' +
        '<span class="auth-cta-body"><span class="auth-cta-title">Sign in</span>' +
        '<span class="auth-cta-sub">' + esc(GitaCloud ? GitaCloud.status() : 'Google backup is being set up') + '</span></span>' +
        ICON.chev +
        '</button>';

    const items = [
      { icon: ICON.bolt, title: 'Hanuman Chalisa', sub: '40 verses of the beloved hymn', soon: true },
      { icon: ICON.book, title: 'Ramayan', sub: 'The epic of Shri Ram', soon: true },
      { icon: ICON.compare, title: 'Mahabharat', sub: 'The great war and its wisdom', soon: true },
      { icon: ICON.library, title: 'More scriptures', sub: 'Vedas, Upanishads, Puranas & more', soon: true },
    ];
    const rows = items.map((it) =>
      '<div class="row-card coming-soon">' +
      '<span class="row-thumb">' + it.icon + '</span>' +
      '<span class="rc-body"><span class="rc-title">' + esc(it.title) + '</span><span class="rc-sub">' + esc(it.sub) + '</span></span>' +
      '<span class="soon-badge">Coming soon</span>' +
      '</div>'
    ).join('');

    const installCard = '<button class="row-card" id="installCard"><span class="row-thumb">' + ICON.bookmark + '</span><span class="rc-body"><span class="rc-title">Install app</span><span class="rc-sub">Add the Gita to your home screen</span></span>' + ICON.chev + '</button>';

    $('#view').innerHTML =
      authCard +
      '<div class="section-label">The Gita</div>' +
      '<button class="row-card" data-go="#/references"><span class="row-thumb">' + ICON.library + '</span><span class="rc-body"><span class="rc-title">All chapters</span><span class="rc-sub">18 chapters · 700 verses</span></span>' + ICON.chev + '</button>' +
      '<button class="row-card" data-go="#/search"><span class="row-thumb">' + ICON.search + '</span><span class="rc-body"><span class="rc-title">Search the Gita</span><span class="rc-sub">Sanskrit, English, हिन्दी, नेपाली</span></span>' + ICON.chev + '</button>' +
      installCard +
      '<button class="row-card" data-go="#/about"><span class="row-thumb">' + ICON.info + '</span><span class="rc-body"><span class="rc-title">About &amp; sources</span><span class="rc-sub">Text, translations and licences</span></span>' + ICON.chev + '</button>' +
      '<div class="section-label">Coming soon</div>' + rows;

    $('#view').querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(b.dataset.go)));
    if ($('#installCard')) $('#installCard').onclick = async () => {
      const ok = await G.promptInstall();
      if (ok) toast('Installing…');
    };
    if ($('#authCta')) $('#authCta').onclick = openAuthSheet;
    if ($('#authSignOut')) $('#authSignOut').onclick = async () => {
      try { await GitaCloud.signOut(); toast('Signed out'); renderMore(); }
      catch (_) { toast('Could not sign out. Try again.'); }
    };
    $('#transport').classList.add('hidden');
  }

  /* ---------------- ABOUT SCREEN ---------------- */
  function renderAbout() {
    topbar('<button class="tb-btn" id="abBack">' + ICON.back + '</button><div class="tb-title">About</div>');
    $('#abBack').onclick = () => (history.length > 1 ? history.back() : go('#/more'));
    $('#view').innerHTML =
      '<h2 style="font-family:var(--serif);font-size:27px;margin:14px 2px 10px">Bhagavad Gita</h2>' +
      '<p class="muted" style="margin:0 2px 18px;line-height:1.55">The complete 18 chapters · 700 verses with Sanskrit, transliteration and meanings in English, हिन्दी and नेपाली — fully offline.</p>' +
      '<div class="card" style="margin-bottom:14px"><div class="cb-lang" style="color:var(--amber);font-weight:800;font-size:12.5px;letter-spacing:.7px;text-transform:uppercase;margin-bottom:7px">Text sources</div>' +
      '<div style="font-size:15.5px;line-height:1.6;color:var(--text-dim)">Sanskrit text and meanings are drawn from public-domain translations. नेपाली meanings are OCR’d from a printed edition and may contain small errors.</div></div>' +
      '<div class="card"><div style="color:var(--amber);font-weight:800;font-size:12.5px;letter-spacing:.7px;text-transform:uppercase;margin-bottom:7px">Your data</div>' +
      '<div style="font-size:15.5px;line-height:1.6;color:var(--text-dim)">Highlights, notes, prayers, reading progress and streaks are stored on this device. Sign in with Google to back them up to your private account when online.</div></div>';
    $('#transport').classList.add('hidden');
  }

  /* ---------------- AUTH ---------------- */
  // Google sign-in stays unavailable until this app is connected to its Firebase
  // project; never present a local placeholder profile as a Google account.
  function openAuthSheet() {
    const nativeCloud = !!(window.GitaCloud && GitaCloud.isNative);
    openSheet(
      '<div class="sheet-grip"></div>' +
      '<div class="sheet-title">Sign in</div>' +
      '<div class="sheet-sub">Cloud backup needs Google sign-in and an internet connection. Reading stays available offline.</div>' +
      '<button class="btn google-btn" id="gSignin" ' + (nativeCloud ? '' : 'disabled aria-disabled="true"') + '>' + ICON.google + (nativeCloud ? 'Continue with Google' : 'Google sign-in is available in the Android app') + '</button>' +
      '<button class="btn ghost" id="gGuest" style="margin-top:12px">Continue as guest on this device</button>' +
      '<p class="license" style="margin-top:18px">Your notes, reading progress and prayers stay on this device and sync to your Google account when you are online.</p>'
    );
    if ($('#gSignin') && nativeCloud) $('#gSignin').onclick = async () => {
      const button = $('#gSignin');
      button.disabled = true;
      button.textContent = 'Signing in…';
      try {
        await GitaCloud.signIn();
        closeSheet();
        toast('Signed in and cloud backup is ready');
        rerenderCurrent();
      } catch (error) {
        toast(error && error.message ? error.message : 'Google sign-in failed. Try again.');
        button.disabled = false;
        button.innerHTML = ICON.google + 'Try Google sign-in again';
      }
    };
    $('#gGuest').onclick = () => {
      G.setAuth({ provider: 'guest', name: 'Guest', email: 'Saved on this device', picture: null });
      closeSheet();
      toast('Continuing as guest');
      rerenderCurrent();
    };
  }

  /* ---------------- SIDE MENU (drawer) ---------------- */
  function openDrawer() {
    const authed = G.isAuthed();
    const a = G.state.auth || {};
    const head = authed
      ? '<div class="drawer-user">' +
        (a.picture ? '<img class="auth-pic" src="' + esc(a.picture) + '" alt="">' : '<span class="auth-pic auth-pic-fb">' + esc((a.name || '?').slice(0, 1).toUpperCase()) + '</span>') +
        '<div class="auth-id"><div class="auth-name">' + esc(a.name || 'Signed in') + '</div><div class="auth-sub">' + esc(GitaCloud && a.provider === 'google' ? GitaCloud.status() : (a.email || a.provider)) + '</div></div></div>'
      : '<button class="drawer-user drawer-cta" id="drawerAuth"><span class="auth-pic auth-pic-fb">' + ICON.user + '</span>' +
        '<div class="auth-id"><div class="auth-name">Sign in</div><div class="auth-sub">' + esc(GitaCloud ? GitaCloud.status() : 'Back up your practice') + '</div></div>' + ICON.chev + '</button>';
    const row = (id, icon, label) => '<button class="drawer-row" data-d="' + id + '">' + icon + '<span>' + label + '</span></button>';
    const items =
      row('support', ICON.heart, 'Spiritual Support') +
      row('practice', ICON.book, 'Practice') +
      row('prayer', ICON.bell, 'Prayer') +
      '<div class="drawer-sep"></div>' +
      row('widget', ICON.widget, 'Add Widget') +
      row('share', ICON.share, 'Share the App') +
      row('help', ICON.help, 'Get Help') +
      row('about', ICON.book, 'About') +
      row('publisher', ICON.user, 'About the Publisher') +
      '<div class="drawer-sep"></div>' +
      row('settings', ICON.gear, 'Settings') +
      row('more', ICON.menu, 'More options') +
      row('references', ICON.search, 'References') +
      (authed ? row('signout', ICON.logout, 'Sign Out') : row('signin', ICON.user, 'Sign In')) +
      row('language', ICON.globe, 'Select a Language') +
      '<div class="drawer-sep"></div>' +
      '<button class="drawer-row danger" data-d="reset">' + ICON.trash + '<span>Erase all my data</span></button>';
    openSheet('<div class="sheet-grip"></div>' + head + '<div class="drawer-list">' + items + '</div>');
    if ($('#drawerAuth')) $('#drawerAuth').onclick = () => { closeSheet(); openAuthSheet(); };
    $('#sheet').querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => handleDrawer(b.dataset.d)));
  }

  function handleDrawer(id) {
    closeSheet();
    if (id === 'support') return openSpiritualSupport();
    if (id === 'practice') { memKey = null; resetPractice(); return go('#/memorize'); }
    if (id === 'prayer') return go('#/prayer');
    if (id === 'about') return go('#/about');
    if (id === 'help') return openHelp();
    if (id === 'share') return shareApp();
    if (id === 'language') return openLangSheet(G.state.last ? G.state.last.ch : 1, 'read');
    if (id === 'signin') return openAuthSheet();
    if (id === 'signout') {
      GitaCloud.signOut().then(() => { toast('Signed out'); render(); }).catch(() => toast('Could not sign out. Try again.'));
      return;
    }
    if (id === 'widget') return toast('Widgets are coming in a future update');
    if (id === 'publisher') return toast('Published by the Gita project');
    if (id === 'settings') return openSettingsSheet();
    if (id === 'references') return go('#/references');
    if (id === 'more') return go('#/more');
    if (id === 'reset') {
      openModal(
        '<div class="sheet-title">Erase all data?</div>' +
        '<div class="sheet-sub">Highlights, notes, prayers, reading progress and streaks stored on this device will be removed. If signed in, your cloud backup will be erased too.</div>' +
        '<div class="grid2"><button class="btn ghost" id="rCancel">Cancel</button><button class="btn danger" id="rOk">Erase</button></div>'
      );
      $('#rCancel').onclick = closeModal;
      $('#rOk').onclick = async () => {
        const button = $('#rOk');
        button.disabled = true;
        await GitaCloud.deleteCloudState();
        G.reset(); applySettings(); closeModal(); go('#/today'); renderToday(); toast('All data erased');
      };
    }
  }

  function openSpiritualSupport() {
    openSheet(
      '<div class="sheet-grip"></div>' +
      '<div class="sheet-title">Spiritual Support</div>' +
      '<div class="sheet-sub">Whatever you are carrying today, sit with a verse and a short prayer.</div>' +
      '<div class="cmp-block"><div class="cb-lang">A prayer for today</div>' +
      '<div class="cb-text">' + esc(G.PRAYERS[new Date().getDate() % G.PRAYERS.length].meaning) + '</div></div>' +
      '<div class="cmp-block"><div class="cb-lang">A verse to hold</div>' +
      '<div class="cb-text">' + esc(G.meaningText("2.47") || G.verse("2.47").skt) + '</div>' +
      '<div class="faint" style="font-size:13px;margin-top:6px">BG 2:47</div></div>' +
      '<div class="grid2" style="margin-top:16px">' +
      '<button class="btn ghost" id="ssPrayer">Open Prayer</button>' +
      '<button class="btn primary" id="ssPractice">Practice a verse</button></div>'
    );
    $('#ssPrayer').onclick = () => { closeSheet(); go('#/prayer'); };
    $('#ssPractice').onclick = () => { closeSheet(); memKey = null; resetPractice(); go('#/memorize'); };
  }

  function openHelp() {
    openSheet(
      '<div class="sheet-grip"></div><div class="sheet-title">Get Help</div>' +
      '<div class="sheet-sub">How the app works.</div>' +
      '<div class="cmp-block"><div class="cb-lang">Read</div><div class="cb-text" style="font-family:var(--sans);font-size:15.5px">Open the Gita tab, pick a chapter, and scroll. Tap any verse to highlight, note or share it. Scroll to the end to mark the chapter read.</div></div>' +
      '<div class="cmp-block"><div class="cb-lang">Practice</div><div class="cb-text" style="font-family:var(--sans);font-size:15.5px">From the menu, choose Practice. Read a verse aloud, hide it, say it from memory, then rebuild it in Fill in the Blank.</div></div>' +
      '<div class="cmp-block"><div class="cb-lang">Listen</div><div class="cb-text" style="font-family:var(--sans);font-size:15.5px">Tap the headphone icon to narrate a whole chapter, or the ▶ button to play and pause.</div></div>'
    );
  }

  function shareApp() {
    const url = location.href.split('#')[0];
    const data = { title: 'Bhagavad Gita', text: 'Read and practice the Bhagavad Gita — offline.', url };
    if (navigator.share) navigator.share(data).catch(() => {});
    else { copyText(url); toast('Link copied — share it anywhere'); }
  }

  // drawer is opened from the Profile hamburger; keep the old profile menu wired to it
  function openProfileMenu() { openDrawer(); }

  /* ---------------- router ---------------- */
  function rerenderCurrent() { render(); }

  function render() {
    const r = route();
    if (observer) { observer.disconnect(); observer = null; }
    if (player && player.playing) player.stop();
    if (narrator && narrator.playing) stopNarration();
    updatePlayIcon(false);

    let m;
    if (r === '/today' || r === '/' || r === '') { G.state.tab = 'today'; renderToday(); }
    else if (r === '/more') { G.state.tab = 'profile'; renderMore(); }
    else if (r === '/about') renderAbout();
    else if (r === '/references') renderReferences();
    else if (r === '/search') renderSearch();
    else if (r === '/guides') { G.state.tab = 'guides'; renderGuides(); }
    else if ((m = r.match(/^\/guide\/([\w-]+)$/))) renderGuide(m[1]);
    else if (r === '/profile') { G.state.tab = 'profile'; renderProfile(); }
    else if (r === '/prayer') renderPrayer();
    else if (r === '/memorize') renderMemorize();
    else if (r === '/progress') renderProgress();
    else if ((m = r.match(/^\/read\/(\d+)(?:\/(intro|(\d+)))?$/))) {
      G.state.tab = 'read';
      renderReader(+m[1], m[2] === 'intro' ? 'intro' : 'read', m[3] ? +m[3] : 0);
    } else if (r.startsWith('/read')) {
      const last = G.state.last;
      go('#/read/' + last.ch);
      return;
    } else { go('#/today'); return; }

    G.save();
    updateTabs();
    if (!r.startsWith('/read/')) $('#view').scrollTop = 0;
  }

  function updateTabs() {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === G.state.tab));
    // animate the content area on screen change
    const v = $('#view');
    v.classList.remove('screen-in');
    void v.offsetWidth;
    v.classList.add('screen-in');
  }

  /* ---------------- boot ---------------- */
  document.querySelectorAll('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      const tab = t.dataset.tab;
      if (tab === 'today') go('#/today');
      else if (tab === 'read') { const l = G.state.last; go('#/read/' + l.ch); }
      else if (tab === 'guides') go('#/guides');
      else if (tab === 'profile') go('#/profile');
    });
  });
  $('#sheetScrim').addEventListener('click', closeSheet);
  $('#modalScrim').addEventListener('click', closeModal);
  $('#tpPrev').addEventListener('click', () => transportTo('prev'));
  $('#tpNext').addEventListener('click', () => transportTo('next'));
  $('#tpPlay').addEventListener('click', () => {
    const cur = route().match(/^\/read\/(\d+)/);
    if (!cur) return;
    toggleNarration(+cur[1]);
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('gita-cloud-restored', () => {
    if (['/today', '/', '/more', '/profile', '/progress'].includes(route())) render();
  });
  window.addEventListener('beforeunload', () => G.stopSpeech());

  // Handle the Android system Back button inside the app instead of closing it.
  const capacitor = window.capacitorExports && window.capacitorExports.Capacitor;
  const nativeApp = window.capacitorApp && window.capacitorApp.App;
  if (capacitor && capacitor.isNativePlatform() && nativeApp) {
    nativeApp.addListener('backButton', ({ canGoBack }) => {
      if (!$('#sheetLayer').classList.contains('hidden')) { closeSheet(); return; }
      if (!$('#modalLayer').classList.contains('hidden')) { closeModal(); return; }
      if (route() !== '/today' && route() !== '/' && route() !== '') {
        if (canGoBack || window.history.length > 1) window.history.back();
        else go('#/today');
        return;
      }
      nativeApp.minimizeApp().catch(() => {});
    });
  }

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // ---- PWA install prompt ----
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
    G.canInstall = true;
    if (typeof renderMore === 'function' && G.state.tab === 'more') renderMore();
  });
  window.addEventListener('appinstalled', () => { deferredInstall = null; G.canInstall = false; });
  G.canInstall = false;
  G.promptInstall = async () => {
    if (!deferredInstall) { toast('Use your browser menu → “Add to Home Screen”'); return false; }
    deferredInstall.prompt();
    const choice = await deferredInstall.userChoice.catch(() => null);
    deferredInstall = null;
    G.canInstall = false;
    return !!(choice && choice.outcome === 'accepted');
  };

  applySettings();
  G.touchStreak();
  if (G.state.auth && G.state.auth.provider === 'google' && G.state.auth.email === 'reader@gita.app') G.clearAuth();
  $('#app').classList.add('app-open');
  if (!location.hash) location.hash = '#/today';
  render();
  if (window.GitaCloud) GitaCloud.initialize();
})();
