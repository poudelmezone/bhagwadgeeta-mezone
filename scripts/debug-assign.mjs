import fs from 'node:fs';
import path from 'node:path';

const EPUB_DIR = path.resolve('data/raw/nepali_epub/EPUB');
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
  let chapter = null;
  const hd = head.match(/यथारूपं?\s*अध्याय\s*[ः.\-–—/,\s]*([०-९]{1,2})/);
  if (hd) chapter = toNumber(hd[1]);
  else {
    const hw = head.match(/यथारूपं?\s*अध्याय\s*[.\-–—/,\s]*([^\s()।]{1,8})/);
    if (hw && NEPALI_NUM_WORDS[hw[1]]) chapter = NEPALI_NUM_WORDS[hw[1]];
  }
  let range = null;
  const rm = head.match(/श्लोक\s*([०-९]{1,3})\s*(?:[-–—]\s*([०-९]{1,3}))?/);
  if (rm) {
    const a = toNumber(rm[1]);
    const b = rm[2] ? toNumber(rm[2]) : a;
    if (a && b) range = [a, b];
  }
  pages.push({ f, start: all.length, end: all.length + h.length, recto: chapter, range, head: head.replace(/\s+/g, ' ').slice(0, 70) });
  all += h + '\n';
}
const firstVerseHit = all.indexOf('धर्मक्षेत्र');
const scanStart = Math.max(0, firstVerseHit - 600);

let cur = null;
let seen = 0;
for (const p of pages) {
  p.chapter = null;
  if (p.start < scanStart) continue;
  if (p.recto) {
    if (p.recto !== cur) { cur = p.recto; seen = 1; } else seen++;
    p.chapter = cur;
    continue;
  }
  if (p.range && p.range[0] === 1 && cur !== null && seen >= 2 && cur < 18) {
    cur = cur + 1;
    seen = 1;
    p.chapter = cur;
    continue;
  }
  p.chapter = cur;
  if (cur !== null) seen++;
}

// summary: for each chapter, first/last assigned page index
const idx = Object.fromEntries(pages.map((p, i) => [p.f, i]));
console.log('scanStart', scanStart, 'first धर्मक्षेत्र page', pages.find((p) => p.end > firstVerseHit)?.f);
const byCh = {};
for (const p of pages) {
  if (p.chapter === null) continue;
  (byCh[p.chapter] ||= []).push(p);
}
for (let c = 1; c <= 18; c++) {
  const arr = byCh[c];
  if (!arr) { console.log(`ch ${c}: NONE`); continue; }
  console.log(`ch ${c}: pages ${arr[0].f}..${arr[arr.length - 1].f} (${arr.length} pages)  firstHead="${arr[0].head}"`);
}

// monotonicity of starts
let prev = scanStart;
for (let c = 1; c <= 18; c++) {
  const arr = byCh[c];
  let s = c === 1 ? scanStart : arr ? arr[0].start : prev;
  if (s < prev) s = prev;
  console.log(`segStart[${c}] = ${s}  (${arr && s === arr[0].start ? 'first page' : arr ? 'CLAMPED' : 'no pages'})`);
  prev = s;
}
