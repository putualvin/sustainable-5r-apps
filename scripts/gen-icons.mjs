// Generator ikon PWA tanpa dependency (PNG encoder via zlib bawaan Node).
// Ikon: latar merah brand (#E30613) + cakram putih (kesan "target/dot").
// Jalankan: node scripts/gen-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "icons");
mkdirSync(OUT, { recursive: true });

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function png(size, draw) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = draw(x, y, size);
      const o = y * (1 + size * 4) + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const RED = [227, 6, 19];
const WHITE = [255, 255, 255];

// purpose: "any" → cakram lebih besar; "maskable" → cakram di zona aman (lebih kecil).
function makeDraw(maskable) {
  return (x, y, size) => {
    const cx = size / 2;
    const cy = size / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const rOuter = (maskable ? 0.3 : 0.36) * size;
    const rInner = (maskable ? 0.16 : 0.2) * size;
    if (dist <= rInner) return [...RED, 255]; // titik merah di tengah cakram
    if (dist <= rOuter) return [...WHITE, 255]; // cincin putih
    return [...RED, 255]; // latar merah
  };
}

writeFileSync(join(OUT, "icon-192.png"), png(192, makeDraw(false)));
writeFileSync(join(OUT, "icon-512.png"), png(512, makeDraw(false)));
writeFileSync(join(OUT, "maskable-512.png"), png(512, makeDraw(true)));
writeFileSync(join(OUT, "apple-touch-icon.png"), png(180, makeDraw(false)));
console.log("✓ Ikon PWA dibuat di public/icons/");
