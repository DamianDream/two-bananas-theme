/**
 * make-icon.ts — deterministic 128×128 marketplace icon generator.
 * Run: npm run build:icon
 *
 * Renders two banana crescents in Brand Yellow #FED141 on a rounded
 * Brand Black #171717 square. Pure Node (zlib) — no native image deps,
 * so the icon is reproducible on any machine and in CI.
 */
import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

const SIZE = 128;
const SS = 4; // supersampling factor for anti-aliasing
const W = SIZE * SS;

const BLACK = [0x17, 0x17, 0x17];
const YELLOW = [0xfe, 0xd1, 0x41];
const TIP = [0x8a, 0x6d, 0x1f]; // darker banana tip

const CORNER_RADIUS = 24 * SS;

type Arc = { cx: number; cy: number; r: number; t: number; a0: number; a1: number };

// Two parallel crescents ("smiles"), stacked vertically.
const bananas: Arc[] = [
  { cx: 64 * SS, cy: 36 * SS, r: 30 * SS, t: 15 * SS, a0: 25, a1: 155 },
  { cx: 64 * SS, cy: 70 * SS, r: 30 * SS, t: 15 * SS, a0: 25, a1: 155 },
];

function deg(a: number) {
  return (a * Math.PI) / 180;
}

function arcEnd(b: Arc, angle: number): [number, number] {
  return [b.cx + b.r * Math.cos(deg(angle)), b.cy + b.r * Math.sin(deg(angle))];
}

function insideRoundedSquare(x: number, y: number): boolean {
  const r = CORNER_RADIUS;
  const nx = Math.max(r - x, x - (W - 1 - r), 0);
  const ny = Math.max(r - y, y - (W - 1 - r), 0);
  return nx * nx + ny * ny <= r * r;
}

/** 0 = not on banana, 1 = yellow body, 2 = dark tip */
function bananaAt(x: number, y: number): number {
  for (const b of bananas) {
    const dx = x - b.cx;
    const dy = y - b.cy;
    const dist = Math.hypot(dx, dy);
    let ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (ang < 0) ang += 360;
    const half = b.t / 2;
    const onArc = Math.abs(dist - b.r) <= half && ang >= b.a0 && ang <= b.a1;
    if (onArc) {
      // Tip zones: the outermost few degrees of the arc get the dark tip color.
      if (ang <= b.a0 + 8 || ang >= b.a1 - 8) return 2;
      return 1;
    }
    // Round caps at both arc ends (slightly smaller = banana tips).
    for (const a of [b.a0, b.a1]) {
      const [ex, ey] = arcEnd(b, a);
      if (Math.hypot(x - ex, y - ey) <= half * 0.72) return 2;
    }
  }
  return 0;
}

// Render supersampled, then box-filter down to 128×128 RGBA.
const out = Buffer.alloc(SIZE * SIZE * 4);
for (let py = 0; py < SIZE; py++) {
  for (let px = 0; px < SIZE; px++) {
    let r = 0, g = 0, bch = 0, a = 0;
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const x = px * SS + sx;
        const y = py * SS + sy;
        if (!insideRoundedSquare(x, y)) continue;
        const hit = bananaAt(x, y);
        const c = hit === 1 ? YELLOW : hit === 2 ? TIP : BLACK;
        r += c[0]; g += c[1]; bch += c[2]; a += 255;
      }
    }
    const n = SS * SS;
    const i = (py * SIZE + px) * 4;
    // Premultiplied-style average: color averaged over covered samples only.
    const covered = a / 255 || 1;
    out[i] = Math.round(r / covered);
    out[i + 1] = Math.round(g / covered);
    out[i + 2] = Math.round(bch / covered);
    out[i + 3] = Math.round(a / n);
  }
}

// --- Minimal PNG encoder (RGBA8, filter 0) ---
function crc32(buf: Buffer): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
// compression 0, filter 0, interlace 0

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0; // filter: none
  out.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync("images", { recursive: true });
writeFileSync("images/icon.png", png);
console.log(`✔ images/icon.png (${SIZE}×${SIZE}, ${png.length} bytes)`);
