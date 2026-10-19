// Generates PNG app icons (dark rounded square + amber ॐ glyph) with zero deps.
// Usage: node scripts/gen-icons.mjs
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'icons');
fs.mkdirSync(OUT, { recursive: true });

const BG = [10, 10, 10];
const AMBER = [233, 161, 59];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Draw the icon into an RGBA buffer.
function draw(size, maskable) {
  const rgba = Buffer.alloc(size * size * 4);
  const radius = maskable ? 0 : size * 0.18; // maskable fills full bleed
  const cx = size / 2, cy = size * 0.52;
  const glyphR = size * 0.30;
  const stroke = size * 0.055;
  const rr = radius;
  const inRound = (x, y) => {
    if (rr <= 0) return true;
    const dx = Math.max(rr - x, x - (size - rr), 0);
    const dy = Math.max(rr - y, y - (size - rr), 0);
    return dx * dx + dy * dy <= rr * rr;
  };
  // distance to a circle ring (for the om outer arc)
  const ringDist = (x, y, r, w) => Math.abs(Math.hypot(x - cx, y - cy) - r) - w / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let r = 0, g = 0, b = 0, a = 0;
      if (inRound(x, y)) {
        [r, g, b] = BG; a = 255;
        // amber ring (the halo of the om)
        const d = ringDist(x, y, glyphR, stroke);
        if (d <= 0) { [r, g, b] = AMBER; }
        // amber dot (bindu) above-center
        const bx = cx, by = cy - glyphR * 0.05, br = stroke * 0.9;
        if (Math.hypot(x - bx, y - by) <= br) { [r, g, b] = AMBER; }
        // horizontal bar through lower third
        const barY = cy + glyphR * 0.42, halfW = glyphR * 0.7;
        if (Math.abs(y - barY) <= stroke / 2 && Math.abs(x - cx) <= halfW) { [r, g, b] = AMBER; }
      }
      rgba[i] = r; rgba[i + 1] = g; rgba[i + 2] = b; rgba[i + 3] = a;
    }
  }
  return rgba;
}

function write(name, size, maskable = false) {
  const rgba = draw(size, maskable);
  fs.writeFileSync(path.join(OUT, name), encodePNG(size, rgba));
  console.log('wrote icons/' + name, size + 'px');
}

write('icon-192.png', 192);
write('icon-512.png', 512);
write('icon-512-maskable.png', 512, true);
write('apple-touch-icon.png', 180);
write('icon-180.png', 180);
write('icon-152.png', 152);
write('icon-120.png', 120);
write('icon-167.png', 167);
write('icon-1024.png', 1024);
console.log('done');
