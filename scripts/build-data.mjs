// Assemble data/gita.js — the single offline data bundle the app loads.
//
// Sources (data/raw):
//   gita_verse.json      gita/gita repo  -> original Sanskrit text, transliteration, word meanings
//   gita_translation.json gita/gita repo -> English (Swami Sivananda), Hindi (Swami Ramsukhdas)
//   gita_chapters.json   gita/gita repo  -> chapter names + English summaries
//   kashish_hi.json      scraped BG data -> Hindi chapter summaries
//   nepali_verses.json   scripts/extract-nepali.mjs -> Nepali translation (OCR, see report)
//
// Output: data/gita.js  (window.GITA = {...}, loaded with a <script> tag)

import fs from 'node:fs';
import path from 'node:path';

const raw = (f) => JSON.parse(fs.readFileSync(path.resolve('data/raw', f), 'utf8'));
const readText = (f) => (fs.existsSync(path.resolve(f)) ? fs.readFileSync(path.resolve(f), 'utf8') : '');

const versesRaw = raw('gita_verse.json');
const translations = raw('gita_translation.json');
const chaptersRaw = raw('gita_chapters.json');
const chapters = Array.isArray(chaptersRaw) ? chaptersRaw : Object.values(chaptersRaw);
let hiSummaries = {};
let enSummaries = {};
try {
  const hi = raw('kashish_hi.json');
  hiSummaries = hi.chapters || {};
} catch { /* optional */ }
try {
  const en = raw('kashish_en.json');
  enSummaries = en.chapters || {};
} catch { /* optional */ }
let nepali = {};
try {
  nepali = JSON.parse(readText('data/raw/nepali_verses.json'));
} catch { /* optional */ }

function pick(lang, author) {
  const map = new Map();
  for (const t of translations) {
    if (t.lang === lang && t.authorName === author) {
      let text = String(t.description || '').replace(/\s+/g, ' ').trim();
      // Hindi entries start with the reference label ।।1.1।। — drop it
      text = text.replace(/^[।]{2}\s*[\d.]+\s*[।]{2}\s*/, '').trim();
      map.set(t.verse_id, text);
    }
  }
  return map;
}
const enMap = pick('english', 'Swami Sivananda');
const hiMap = pick('hindi', 'Swami Ramsukhdas');

const verses = {};
for (const v of versesRaw) {
  const key = `${v.chapter_number}.${v.verse_number}`;
  const skt = String(v.text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]*\n+/g, '\n')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .trim();
  const entry = {
    skt,
    tr: String(v.transliteration || '').replace(/\n[ \t]*\n+/g, '\n').trim(),
    wd: String(v.word_meanings || '').replace(/\s+/g, ' ').trim(),
    en: enMap.get(v.id) || enMap.get(v.verse_order) || '',
    hi: hiMap.get(v.id) || hiMap.get(v.verse_order) || '',
    ne: nepali[key] || '',
  };
  verses[key] = entry;
}

const chapterList = chapters.map((c) => {
  const n = c.chapter_number;
  const en = enSummaries[n] || enSummaries[String(n)];
  const hi = hiSummaries[n] || hiSummaries[String(n)];
  return {
    n,
    name: c.name,
    meaning: c.name_meaning,
    count: c.verses_count,
    summaryEn: String((en && en.chapter_summary) || c.chapter_summary || '').replace(/\s+/g, ' ').trim(),
    summaryHi: String((hi && hi.chapter_summary) || '').replace(/\s+/g, ' ').trim(),
  };
});

const bundle = {
  meta: {
    builtAt: new Date().toISOString(),
    verseTotal: Object.keys(verses).length,
    chapterTotal: chapterList.length,
    languages: ['sa', 'en', 'hi', 'ne'],
    translators: { en: 'Swami Sivananda', hi: 'Swami Ramsukhdas (Gita Press)', ne: 'Bhagavad Gita As It Is (Nepali, OCR)' },
    sources: [
      'Sanskrit text, transliteration, word meanings, English & Hindi translations: github.com/gita/gita (Unlicense)',
      'Hindi chapter summaries: github.com/kashishkhullar/gita_json (scraped from BhagavadGita.io)',
      'Nepali translation: OCR text layer of a scanned "Bhagavad Gita As It Is" (Nepali) EPUB published on archive.org; minor OCR errors may remain',
    ],
  },
  chapters: chapterList,
  verses,
};

fs.mkdirSync(path.resolve('data'), { recursive: true });
const out = 'window.GITA = ' + JSON.stringify(bundle) + ';\n';
fs.writeFileSync(path.resolve('data/gita.js'), out);

// quick integrity report
let enMissing = 0, hiMissing = 0, neMissing = 0, sktMissing = 0;
for (const [, v] of Object.entries(verses)) {
  if (!v.en) enMissing++;
  if (!v.hi) hiMissing++;
  if (!v.ne) neMissing++;
  if (!v.skt) sktMissing++;
}
console.log(`verses: ${Object.keys(verses).length}, chapters: ${chapterList.length}`);
console.log(`missing -> skt ${sktMissing}, en ${enMissing}, hi ${hiMissing}, ne ${neMissing}`);
console.log(`size: ${(out.length / 1024 / 1024).toFixed(2)} MB -> data/gita.js`);
