// Extract Nepali translations verse-by-verse from the OCR'd "Bhagavad Gita As It Is" (Nepali)
// EPUB pages in data/raw/nepali_epub/EPUB/page_*.html
//
// Book layout per verse:
//   [Sanskrit shloka ॥ N ॥] [shabdartha: "word — gloss; ..."] [Nepali translation] [तात्पर्य : purport]
// Some pages print two shlokas together sharing one glossary/translation/purport block (e.g. 5.27-28);
// those are detected as "grouped" and share the block of the last verse of the group.
//
// Alignment strategy:
//   1. every page's running head identifies its chapter (recto: "श्रीमद्‌भगवद्‌गीता यथारूप अध्याय N",
//      verso: "श्लोक X-Y <chapter name>"; a chapter may open with a title page using Nepali number
//      words). Pages are assigned to chapters; a verso head starting at shloka 1 starts a new chapter.
//   2. inside a chapter segment markers are matched sequentially against the canonical counts,
//      gap-filling when OCR swallowed a marker.
//
// Output: data/raw/nepali_verses.json  { "1.1": "नेपाली अनुवाद...", ... }
//         data/raw/nepali_report.md    coverage + quality report

import fs from 'node:fs';
import path from 'node:path';

const EPUB_DIR = path.resolve('data/raw/nepali_epub/EPUB');
const VERSES_JSON = path.resolve('data/raw/gita_verse.json');
const OUT = path.resolve('data/raw/nepali_verses.json');
const REPORT = path.resolve('data/raw/nepali_report.md');

const DEV_DIGITS = '०१२३४५६७८९';
function toNumber(raw) {
  const mapped = String(raw).replace(/[lI|!]/g, '1');
  const s = [...mapped].filter((c) => (c >= '०' && c <= '९') || (c >= '0' && c <= '9')).join('');
  if (!s) return null;
  let n = 0;
  for (const c of s) n = n * 10 + (c >= '०' ? DEV_DIGITS.indexOf(c) : +c);
  return n;
}

const NEPALI_NUM_WORDS = {
  एक: 1, दुई: 2, तीन: 3, चार: 4, पोँच: 5, पाँच: 5, छ: 6, सात: 7, आठ: 8, नौ: 9,
  दस: 10, एघार: 11, बाह्र: 12, सत्र: 13, चौध: 14, पन्ध्र: 15, सोह्र: 16, सतर: 17, अठार: 18,
};

const canon = JSON.parse(fs.readFileSync(VERSES_JSON, 'utf8'));
const counts = [0];
for (const v of canon) counts[v.chapter_number] = Math.max(counts[v.chapter_number] || 0, v.verse_number);
const totalVerses = counts.reduce((a, b) => a + b, 0);

// ---------- read pages in numeric order, capture running heads ----------
const files = fs
  .readdirSync(EPUB_DIR)
  .filter((f) => /^page_\d+\.html$/.test(f))
  .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);

let all = '';
const pages = [];
for (const f of files) {
  let h = fs.readFileSync(path.join(EPUB_DIR, f), 'utf8');
  h = h
    .replace(/<title[\s\S]*?<\/title>/, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r/g, '');
  h = h.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n');

  const head = h.slice(0, 220);
  // recto head: book title + chapter (digits or Nepali number word)
  let chapter = null;
  const hd = head.match(/यथारूपं?\s*अध्याय\s*[ः.\-–—/,\s]*([०-९]{1,2})/);
  if (hd) chapter = toNumber(hd[1]);
  else {
    const hw = head.match(/यथारूपं?\s*अध्याय\s*[.\-–—/,\s]*([^\s()।]{1,8})/);
    if (hw && NEPALI_NUM_WORDS[hw[1]]) chapter = NEPALI_NUM_WORDS[hw[1]];
  }
  // verso head: "श्लोक X[-Y] <chapter name> ( <subtitle> ) <page>"
  let range = null;
  const rm = head.match(/श्लोक\s*([०-९]{1,3})\s*(?:[-–—]\s*([०-९]{1,3}))?/);
  if (rm) {
    const a = toNumber(rm[1]);
    const b = rm[2] ? toNumber(rm[2]) : a;
    if (a && b) range = [a, b];
  }
  pages.push({ start: all.length, end: all.length + h.length, recto: chapter, range, file: f });
  all += h + '\n';
}
fs.writeFileSync(path.join(EPUB_DIR, '_all.txt'), all);

// ---------- skip front matter, assign pages to chapters ----------
const firstVerseHit = all.indexOf('धर्मक्षेत्र');
if (firstVerseHit < 0) throw new Error('could not locate verse 1.1 in OCR text');
const scanStart = Math.max(0, firstVerseHit - 600);

const MARKER_RE = /[॥।]{1,2}\s*[-–—.:\s]?\s*([०-९0-9lI|!.\s]{1,9})\s*[॥।]{1,2}/g;

// Running heads are OCR'd: a head can name a chapter far ahead of the real one (a misread digit)
// or a verso head can claim "shloka 1" mid-chapter. A boundary is therefore only accepted when
// it advances by at most one chapter and early shloka numbers of the new chapter follow soon after.
const PLAU_RE = new RegExp(MARKER_RE.source, 'g');
function plausibleStart(pos, chapter) {
  PLAU_RE.lastIndex = pos;
  let m;
  let probes = 0;
  while ((m = PLAU_RE.exec(all)) !== null) {
    if (m.index > pos + 9000) break;
    const n = toNumber(m[1]);
    if (n !== null && n >= 1 && n <= 8 && n <= counts[chapter]) return true;
    if (++probes > 14) break;
  }
  return false;
}

let cur = 1;
let startIdx = pages.findIndex((p) => p.end > scanStart);
if (startIdx < 0) startIdx = 0;
pages.forEach((p, i) => {
  p.chapter = null;
  if (p.start < scanStart) return;
  if (p.recto && (p.recto === cur || (p.recto === cur + 1 && plausibleStart(p.start, p.recto)))) {
    if (p.recto !== cur) { cur = p.recto; startIdx = i; }
    p.chapter = cur;
    return;
  }
  if (p.range && p.range[0] === 1 && cur < 18 && i - startIdx >= 15 && plausibleStart(p.start, cur + 1)) {
    cur = cur + 1;
    startIdx = i;
    p.chapter = cur;
    return;
  }
  p.chapter = cur;
});

// ---------- per-chapter marker scan ----------
// contiguous partition of the scanned region: chapter c runs from segStart[c] to segStart[c+1]
const segStart = {};
let prevEnd = scanStart;
for (let c = 1; c <= 18; c++) {
  const inSeg = pages.filter((p) => p.chapter === c);
  let s = c === 1 ? scanStart : inSeg.length ? inSeg[0].start : prevEnd;
  if (s < prevEnd) s = prevEnd;
  segStart[c] = s;
  prevEnd = s;
}
function segmentFor(chapter) {
  const from = segStart[chapter];
  const to = chapter === 18 ? all.length : segStart[chapter + 1];
  if (to <= from) return null;
  return [from, to];
}

const accepted = [];
const missing = [];

for (let c = 1; c <= 18; c++) {
  const seg = segmentFor(c);
  if (!seg) {
    for (let v = 1; v <= counts[c]; v++) missing.push(`${c}.${v}`);
    continue;
  }
  const [from, to] = seg;
  const re = new RegExp(MARKER_RE.source, 'g');
  re.lastIndex = from;
  // verso heads of this segment tell which shlokas each page carries -> recovery points
  const cues = pages
    .filter((p) => p.chapter === c && p.range)
    .map((p) => ({ pos: p.start, at: p.range[0] }))
    .sort((a, b) => a.pos - b.pos);
  let cue = 0;
  let next = 1;
  let m;
  while ((m = re.exec(all)) !== null) {
    if (m.index >= to) break;
    while (cue < cues.length && cues[cue].pos <= m.index) {
      if (cues[cue].at > next && cues[cue].at <= counts[c]) {
        for (let g = next; g < cues[cue].at; g++) missing.push(`${c}.${g}`);
        next = cues[cue].at;
      }
      cue++;
    }
    const n = toNumber(m[1]);
    if (n === null) continue;
    if (n === next) {
      accepted.push({ ch: c, v: n, markerStart: m.index, markerEnd: m.index + m[0].length });
      next++;
    } else if (n > next && n <= counts[c]) {
      for (let g = next; g < n; g++) missing.push(`${c}.${g}`);
      accepted.push({ ch: c, v: n, markerStart: m.index, markerEnd: m.index + m[0].length });
      next = n + 1;
    }
  }
  for (let v = next; v <= counts[c]; v++) missing.push(`${c}.${v}`);
}
accepted.sort((a, b) => a.markerStart - b.markerStart);

// ---------- recover verses whose marker the first pass skipped ----------
for (let c = 1; c <= 18; c++) {
  const seg = segmentFor(c);
  if (!seg) continue;
  const [from, to] = seg;
  const mine = accepted.filter((a) => a.ch === c);
  for (let v = 1; v <= counts[c]; v++) {
    if (mine.some((a) => a.v === v)) continue;
    let lo = from;
    let hi = to;
    for (const a of mine) if (a.v < v && a.markerEnd > lo) lo = a.markerEnd;
    for (const a of mine) if (a.v > v && a.markerStart < hi) hi = a.markerStart;
    if (hi <= lo) continue;
    const re = new RegExp(MARKER_RE.source, 'g');
    re.lastIndex = lo;
    let m;
    while ((m = re.exec(all)) !== null) {
      if (m.index >= hi) break;
      if (toNumber(m[1]) === v) {
        const hit = { ch: c, v, markerStart: m.index, markerEnd: m.index + m[0].length };
        accepted.push(hit);
        mine.push(hit);
        break;
      }
    }
  }
}
accepted.sort((a, b) => a.markerStart - b.markerStart);

// ---------- third pass: recover verses whose number was destroyed by OCR ----------
// Fall back on the Sanskrit itself: the canonical shloka's letters usually survive OCR even when
// the trailing ॥ N ॥ does not. Locate a distinctive slice of the canonical text inside the hole.
function letterKey(s) {
  let out = '';
  for (const c of s) if (c >= 'ऀ' && c <= 'ॿ') out += c;
  return out;
}
const canonByKey = new Map();
for (const v of canon) {
  const key = letterKey(v.text);
  if (key.length >= 30) canonByKey.set(`${v.chapter_number}.${v.verse_number}`, key);
}

let recovered = 0;
for (let c = 1; c <= 18; c++) {
  const seg = segmentFor(c);
  if (!seg) continue;
  const [from, to] = seg;
  const mine = accepted.filter((a) => a.ch === c);
  for (let v = 1; v <= counts[c]; v++) {
    if (mine.some((a) => a.v === v)) continue;
    const key = canonByKey.get(`${c}.${v}`);
    if (!key) continue;
    let lo = from;
    let hi = to;
    for (const a of mine) if (a.v < v && a.markerEnd > lo) lo = a.markerEnd;
    for (const a of mine) if (a.v > v && a.markerStart < hi) hi = a.markerStart;
    if (hi - lo > 40000 || hi <= lo) continue;

    const win = all.slice(lo, hi);
    const idxMap = [];
    let norm = '';
    for (let i = 0; i < win.length; i++) {
      const ch = win[i];
      if (ch >= 'ऀ' && ch <= 'ॿ') { norm += ch; idxMap.push(i); }
    }
    if (norm.length < 20) continue;

    const W = 13;
    // probe from the tail of the canonical shloka first: the match then ends where the
    // destroyed ॥ N ॥ used to be, so the block opens right at the glossary/translation.
    const probes = [];
    const step = Math.max(6, Math.floor(key.length / 24));
    for (let p = key.length - W; p >= 0 && probes.length < 26; p -= step) probes.push(key.slice(Math.max(0, p), Math.max(0, p) + W));
    let hitPos = -1;
    for (const probe of probes) {
      const q = norm.indexOf(probe);
      if (q >= 0) {
        const absEnd = lo + idxMap[Math.min(q + W - 1, idxMap.length - 1)];
        hitPos = absEnd + 1;
        break;
      }
    }
    if (hitPos < 0) continue;
    const hit = { ch: c, v, markerStart: hitPos, markerEnd: hitPos, fuzzy: true };
    accepted.push(hit);
    mine.push(hit);
    recovered++;
  }
}
accepted.sort((a, b) => a.markerStart - b.markerStart);

// ---------- group verses sharing one glossary/translation/purport block ----------
function purportIndex(after, limit) {
  const t = all.indexOf('तात्पर्य', after);
  if (t < 0 || t > limit) return -1;
  return t;
}

const items = [];
for (let i = 0; i < accepted.length; i++) {
  const a = accepted[i];
  const nextStart = i + 1 < accepted.length ? accepted[i + 1].markerStart : all.length;
  const own = purportIndex(a.markerEnd, nextStart);
  if (own >= 0) {
    items.push({ ...a, block: all.slice(a.markerEnd, own), grouped: false });
  } else {
    let j = i;
    let t = -1;
    while (j < accepted.length) {
      const lim = j + 1 < accepted.length ? accepted[j + 1].markerStart : all.length;
      t = purportIndex(accepted[j].markerEnd, lim);
      if (t >= 0) break;
      j++;
    }
    if (j > i) {
      items.push({ ...a, block: all.slice(accepted[j].markerEnd, t), grouped: true });
      i = Math.max(i, j - 1);
    } else {
      items.push({ ...a, block: all.slice(a.markerEnd, Math.min(a.markerEnd + 6000, nextStart)), grouped: false });
    }
  }
}

// ---------- strip the word-meaning glossary, keep the Nepali translation ----------
const DEV_RUN = /[ऀ-ॿ]/g;
function devaCount(s) {
  DEV_RUN.lastIndex = 0;
  let n = 0, m;
  while ((m = DEV_RUN.exec(s)) !== null) n++;
  return n;
}

function translationFrom(block) {
  const pre = block.split('तात्पर्य')[0].replace(/\s+/g, ' ').trim();
  if (!pre) return '';

  const segs = [];
  let start = 0;
  const re = /।{1,2}\s*/g;
  let m2;
  while ((m2 = re.exec(pre)) !== null) {
    segs.push(pre.slice(start, m2.index + m2[0].length));
    start = m2.index + m2[0].length;
  }
  if (start < pre.length) segs.push(pre.slice(start));
  if (segs.length === 0) return clean(pre);

  const isGlossary = (s) => {
    if (s.includes(';')) return true;
    if (/--|—|–|\s-\s/.test(s) && s.length < 160) return true;
    const dev = devaCount(s);
    if (dev < 12) return true; // OCR junk / stray headers
    if (dev / Math.max(1, s.length) < 0.5) return true;
    return false;
  };

  let first = -1;
  for (let i = 0; i < segs.length; i++) if (!isGlossary(segs[i])) { first = i; break; }
  let out;
  if (first === -1) {
    const li = pre.lastIndexOf(';');
    out = li >= 0 ? pre.slice(li + 1) : pre;
  } else {
    out = pre.slice(segs.slice(0, first).reduce((acc, s) => acc + s.length, 0));
  }
  return clean(out);
}

function clean(s) {
  let t = s.replace(/\s+/g, ' ').trim();
  // trailing running head or symbol noise
  t = t.replace(/\s*श्लोक\s*[०-९\-\s]*[०-९]\s*$/, '');
  t = t.replace(/[^\u0900-\u097Fa-zA-Z\s।?॥"'()\-—]+$/, '');
  // leading symbol / numbering noise
  t = t.replace(/^[^\u0900-\u097Fa-zA-Z]+/, '');
  t = t.replace(/^[\s।॥;:,.\-—"'()०-९0-9]+/, '');
  // leading citation fragment, e.g. "कु सिडी नि उन (59.95. )"
  if (/^\S+(?:\s+\S+){0,4}\s*\(\s*[०-९0-9][०-९0-9.\s]*\)/.test(t))
    t = t.replace(/^\S+(?:\s+\S+){0,4}\s*\(\s*[०-९0-9][०-९0-9.\s]*\)\s*/, '');
  // glossary entries that leaked into the translation ("word — gloss," ...)
  let guard = 0;
  while (guard++ < 8 && /^[^,;।]{1,50}(?:—|--)\s*[^,;।]{1,40}\s*[,;]/.test(t))
    t = t.replace(/^[^,;।]{1,50}(?:—|--)\s*[^,;।]{1,40}\s*[,;]\s*/, '');
  // a single short gloss sitting before the first danda
  guard = 0;
  while (guard++ < 4) {
    const stop = t.indexOf('।');
    if (stop < 0 || stop > 40) break;
    const head = t.slice(0, stop);
    if (!/(?:—|--|\s-\s)/.test(head)) break;
    t = t.slice(stop + 1).trim();
  }
  t = t
    .replace(/[\\`^~*_|{}<>[\]]/g, ' ')
    .replace(/\s*"[^"]*"\s*/g, ' ')
    .replace(/\s*'\s*/g, ' ')
    .replace(/\s*[-–—]{2,}\s*/g, ' — ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s।॥;:,.\-—"'()०-९0-9]+/, '')
    .replace(/[\s।॥;:,.\-—"'()]+$/, '')
    .trim();
  return t;
}

// ---------- assemble ----------
const out = {};
const quality = [];
for (const it of items) {
  const key = `${it.ch}.${it.v}`;
  const t = translationFrom(it.block);
  out[key] = t.length >= 25 ? t : '';
  if (out[key]) {
    const semis = (t.match(/;/g) || []).length;
    const dashes = (t.match(/--|—/g) || []).length;
    if (semis > 0 || dashes > 1 || t.length > 900)
      quality.push({ key, len: t.length, semis, dashes, text: t });
  }
}

const present = Object.values(out).filter((t) => t).length;
const missingCanon = [];
for (let c = 1; c <= 18; c++) for (let v = 1; v <= counts[c]; v++) if (!out[`${c}.${v}`]) missingCanon.push(`${c}.${v}`);

fs.writeFileSync(OUT, JSON.stringify(out, null, 0));

const perChapter = [];
for (let c = 1; c <= 18; c++) {
  let got = 0;
  for (let v = 1; v <= counts[c]; v++) if (out[`${c}.${v}`]) got++;
  perChapter.push(`${c}:${got}/${counts[c]}`);
}

const rep = [];
rep.push('# Nepali extraction report');
rep.push('');
rep.push(`- pages scanned: ${files.length}`);
rep.push(`- canonical verses: ${totalVerses}`);
rep.push(`- markers accepted: ${accepted.length}`);
rep.push(`- verses with translation: ${present}`);
rep.push(`- per chapter: ${perChapter.join('  ')}`);
rep.push(`- missing (${missingCanon.length}): ${missingCanon.slice(0, 100).join(', ')}${missingCanon.length > 100 ? ' …' : ''}`);
rep.push(`- flagged for quality review: ${quality.length}`);
rep.push('');
rep.push('## Flagged');
for (const q of quality.slice(0, 60)) rep.push(`- ${q.key} (len ${q.len}, ; ${q.semis}, — ${q.dashes}): ${q.text.slice(0, 260)}`);
rep.push('');
rep.push('## Samples');
for (const key of ['1.1', '1.47', '2.1', '2.47', '2.72', '3.1', '3.35', '4.7', '5.25', '6.20', '7.30', '8.7', '9.22', '10.10', '11.55', '12.15', '13.35', '14.5', '15.15', '16.1', '17.16', '18.66']) {
  rep.push(`- **${key}**: ${out[key] || '(MISSING)'}`);
}
fs.writeFileSync(REPORT, rep.join('\n'));
console.log(`verses with translation: ${present}/${totalVerses}`);
console.log(`markers accepted: ${accepted.length}, missing: ${missing.length}`);
console.log(`flagged: ${quality.length}`);
console.log(`per chapter: ${perChapter.join(' ')}`);
