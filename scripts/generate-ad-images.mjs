// Generates Google Ads image assets from real photos in public/images/.
// Design: photo fills the frame, navy bar with serif text along the bottom,
// scarlet top rule + offer chip, logo chip top-left. No generative AI —
// Google prohibits AI-generated images of minors in ads.
//
// Run:  FONTCONFIG_FILE=scripts/fonts/fonts.conf node scripts/generate-ad-images.mjs
// Output: ad-assets/ (upload these in Google Ads > Assets > Images)

import sharp from "sharp";
import { mkdirSync, statSync } from "fs";
import path from "path";

const NAVY = "#0d2240";
const SCARLET = "#c8102e";
const PAPER = "#faf9f6";
const SERIF = "Source Serif 4";

// Edit these two lines per campaign flight, then re-run.
const LINE = "World Schools Debate · Ages 9–17";
const CHIP = "FALL TERM · SEPT 1";

const IMG = "public/images";
const OUT = "ad-assets";

// Google Ads recommended sizes. bar = navy band height, fs = text size.
const FORMATS = {
  landscape: { w: 1200, h: 628, bar: 104, fs: 38, chipFs: 21 },
  square: { w: 1200, h: 1200, bar: 132, fs: 44, chipFs: 23 },
  portrait: { w: 960, h: 1200, bar: 120, fs: 36, chipFs: 20 },
};

// photo → formats to produce from it
// cropTop: per-format manual crop offset (px from the top of the photo after
// it is scaled to the target width) — overrides the automatic attention crop.
const JOBS = [
  { photo: "tournament-team-harvard.jpg", tag: "team", formats: ["landscape", "square"] },
  { photo: "finals-day-team.jpg", tag: "finals", formats: ["landscape", "square", "portrait"], cropTop: { landscape: 640 } },
  { photo: "student-debating.jpg", tag: "speaker", formats: ["portrait"] },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function overlaySvg({ w, h, bar, fs, chipFs }) {
  const barTop = h - bar;
  const chipText = esc(CHIP);
  const chipW = Math.round(chipText.length * chipFs * 0.68) + 44;
  const chipH = Math.round(chipFs * 2.1);
  const chipX = w - chipW - 28;
  const chipY = barTop + (bar - chipH) / 2;
  // Drop the chip if the bar text would collide with it (narrow formats).
  const textW = LINE.length * fs * 0.52;
  const showChip = 28 + textW + 24 < chipX;
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="${barTop}" width="${w}" height="${bar}" fill="${NAVY}"/>
  <rect x="0" y="${barTop}" width="${w}" height="5" fill="${SCARLET}"/>
  <text x="28" y="${barTop + bar / 2}" dominant-baseline="central"
    font-family="${SERIF}" font-weight="600" font-size="${fs}" fill="${PAPER}">${esc(LINE)}</text>
  ${
    showChip
      ? `<rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="${chipH / 2}" fill="${SCARLET}"/>
  <text x="${chipX + chipW / 2}" y="${chipY + chipH / 2}" dominant-baseline="central" text-anchor="middle"
    font-family="${SERIF}" font-weight="600" font-size="${chipFs}" letter-spacing="1.5" fill="${PAPER}">${chipText}</text>`
      : ""
  }
</svg>`);
}

async function logoChip(size) {
  const pad = Math.round(size * 0.16);
  const logo = await sharp(path.join(IMG, "logo.png"))
    .resize(size - pad * 2, size - pad * 2, { fit: "inside" })
    .toBuffer();
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.14)}" fill="${PAPER}" fill-opacity="0.94"/></svg>`
  );
  return sharp(bg).composite([{ input: logo, gravity: "centre" }]).png().toBuffer();
}

async function renderPhotoAd(job, formatName) {
  const f = FORMATS[formatName];
  const manualTop = job.cropTop?.[formatName];
  let pipeline = sharp(path.join(IMG, job.photo)).rotate(); // bake EXIF orientation into pixels
  if (manualTop != null) {
    const scaled = await pipeline.resize({ width: f.w }).toBuffer();
    const { height: sh } = await sharp(scaled).metadata();
    pipeline = sharp(scaled).extract({ left: 0, top: Math.min(manualTop, sh - f.h), width: f.w, height: f.h });
  } else {
    pipeline = pipeline.resize(f.w, f.h, { fit: "cover", position: sharp.strategy.attention });
  }
  const base = await pipeline.toBuffer();

  const chipSize = Math.round(f.h * 0.11);
  const out = path.join(OUT, `ad-${formatName}-${f.w}x${f.h}-${job.tag}.jpg`);
  await sharp(base)
    .composite([
      { input: overlaySvg(f), top: 0, left: 0 },
      { input: await logoChip(chipSize), top: 24, left: 24 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  return out;
}

async function renderLogos() {
  const outs = [];
  for (const [w, h, name] of [
    [1200, 1200, "logo-square-1200x1200.png"],
    [1200, 300, "logo-landscape-1200x300.png"],
  ]) {
    const pad = Math.round(h * 0.18);
    const logo = await sharp(path.join(IMG, "logo.png"))
      .resize(w - pad * 2, h - pad * 2, { fit: "inside" })
      .toBuffer();
    const out = path.join(OUT, name);
    await sharp({ create: { width: w, height: h, channels: 3, background: PAPER } })
      .composite([{ input: logo, gravity: "centre" }])
      .png()
      .toFile(out);
    outs.push(out);
  }
  return outs;
}

mkdirSync(OUT, { recursive: true });
const produced = [];
for (const job of JOBS) {
  for (const fmt of job.formats) produced.push(await renderPhotoAd(job, fmt));
}
produced.push(...(await renderLogos()));

for (const p of produced) {
  const kb = Math.round(statSync(p).size / 1024);
  console.log(`${p}  (${kb} KB)`);
}
console.log(`\n${produced.length} files in ${OUT}/ — all must be < 5120 KB (Google limit).`);
