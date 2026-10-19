import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('data/raw/nepali_epub/EPUB');
const DEV = '०१२३४५६७८९';
function toNumber(raw) {
  const s = [...String(raw)].filter((c) => (c >= '०' && c <= '९') || (c >= '0' && c <= '9')).join('');
  if (!s) return null;
  let n = 0;
  for (const c of s) n = n * 10 + (c >= '०' ? DEV.indexOf(c) : +c);
  return n;
}
function strip(h) {
  return h
    .replace(/<title[\s\S]*?<\/title>/, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n');
}

const rows = [];
const files = fs
  .readdirSync(DIR)
  .filter((f) => /^page_\d+\.html$/.test(f))
  .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
for (const f of files) {
  const h = strip(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const head = h.slice(0, 220);
  let recto = null;
  const hd = head.match(/यथारूपं?\s*अध्याय\s*[ः\-–—\s]*([०-९]{1,2})/);
  if (hd) recto = toNumber(hd[1]);
  else {
    const hw = head.match(/यथारूपं?\s*अध्याय\s*[\-–—\s]*([^\s()।]{1,8})/);
    if (hw) recto = 'WORD:' + hw[1];
  }
  let range = null;
  const rm = head.match(/श्लोक\s*([०-९]{1,3})\s*(?:[-–—]\s*([०-९]{1,3}))?/);
  if (rm) {
    const a = toNumber(rm[1]);
    const b = rm[2] ? toNumber(rm[2]) : a;
    if (a && b) range = [a, b];
  }
  rows.push({ f, recto, range, first: (h.split('\n').find((l) => l.trim()) || '').slice(0, 70) });
}

const from = +(process.argv[2] || 30);
const to = +(process.argv[3] || 60);
for (let i = from; i < to && i < rows.length; i++) {
  const r = rows[i];
  const rng = r.range ? `${r.range[0]}-${r.range[1]}` : '-';
  console.log(r.f.padEnd(16), 'recto=' + String(r.recto).padEnd(6), 'range=' + rng.padEnd(7), '|', r.first.replace(/\s+/g, ' '));
}
