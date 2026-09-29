// Generates Meta (Facebook/Instagram) static ads from real photos in public/images/.
// Layout: photo on top, navy panel below with a serif headline, a detail line
// and the domain. Text stays inside the 9:16 safe zone (clear of the top 14%
// and bottom 35% that Reels/Stories UI covers). No generative AI, no emojis.
//
// Run:  FONTCONFIG_FILE=scripts/fonts/fonts.conf node scripts/generate-meta-ads.mjs
// Output: ad-assets/meta/

import sharp from "sharp";
import { mkdirSync, statSync } from "fs";
import path from "path";

const NAVY = "#0d2240";
const SCARLET = "#c8102e";
const PAPER = "#faf9f6";
const MUTED = "#c9d1de";
const SERIF = "Source Serif 4";
const SANS = "Inter";

const IMG = "public/images";
const OUT = "ad-assets/meta";

// panelTop = where the navy panel starts; text block is laid out from there.
// Story: the navy area below ~1250px sits under the Reels caption/CTA overlay, so the
// text block must end above it; the domain line sits below it (seen in Stories, covered in Reels).
const FORMATS = {
  feed: { w: 1080, h: 1350, panelTop: 700, pad: 64, h1: 76, lh: 86, body: 34, eyebrow: 24 },
  square: { w: 1080, h: 1080, panelTop: 470, pad: 60, h1: 66, lh: 76, body: 31, eyebrow: 22 },
  story: { w: 1080, h: 1920, panelTop: 740, pad: 56, h1: 68, lh: 78, body: 32, eyebrow: 24 },
};

// One entry per ad concept. `h1` is pre-broken into lines so wrapping is ours.
const CONCEPTS = [
  {
    tag: "a-starts-oct10",
    photo: "tournament-awards.jpg",
    focusY: 0.4,
    eyebrow: "WORLD SCHOOLS DEBATE · ONLINE",
    h1: ["New classes start", "October 10."],
    body: ["10 live 2-hour classes · 6–8 students", "Ages 9–17 · one class a week, online"],
  },
  {
    tag: "b-price",
    photo: "team-prep-session.jpg",
    focusY: 0.5,
    eyebrow: "FOUNDATION · AGES 9–16",
    h1: ["$540 for 10 live", "debate classes."],
    body: ["Small online groups, 2 hours each week", "Starts October 10 · join from anywhere"],
  },
  {
    tag: "c-format",
    photo: "impromptu-prep.jpg",
    focusY: 0.55,
    eyebrow: "WHAT IS WORLD SCHOOLS DEBATE?",
    h1: ["Eight minutes.", "No script. One hour", "to prepare."],
    body: ["We teach it in small online classes", "New groups start October 10"],
  },
  {
    tag: "d-competition",
    photo: "tournament-team-harvard.jpg",
    focusY: 0.5,
    eyebrow: "COMPETITION TEAM · AGES 11–17",
    h1: ["Already debating?", "Train with a team."],
    body: ["Weekly judged rounds and written feedback", "10 classes from October 10 · $700"],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function panelSvg(f, c) {
  const { w, h, panelTop, pad } = f;
  let y = panelTop + pad + f.eyebrow;
  const parts = [
    `<rect x="0" y="${panelTop}" width="${w}" height="${h - panelTop}" fill="${NAVY}"/>`,
    `<rect x="0" y="${panelTop}" width="${w}" height="8" fill="${SCARLET}"/>`,
    `<text x="${pad}" y="${y}" font-family="${SANS}" font-weight="600" font-size="${f.eyebrow}" letter-spacing="3" fill="${MUTED}">${esc(c.eyebrow)}</text>`,
  ];
  y += Math.round(f.eyebrow * 1.1);
  for (const line of c.h1) {
    y += f.lh;
    parts.push(
      `<text x="${pad}" y="${y}" font-family="${SERIF}" font-weight="600" font-size="${f.h1}" fill="${PAPER}">${esc(line)}</text>`
    );
  }
  y += Math.round(f.lh * 0.35);
  parts.push(`<rect x="${pad}" y="${y}" width="72" height="4" fill="${SCARLET}"/>`);
  y += Math.round(f.body * 0.6);
  for (const line of c.body) {
    y += Math.round(f.body * 1.45);
    parts.push(
      `<text x="${pad}" y="${y}" font-family="${SANS}" font-weight="400" font-size="${f.body}" fill="${PAPER}">${esc(line)}</text>`
    );
  }
  parts.push(
    `<text x="${pad}" y="${f === FORMATS.story ? 1330 : h - pad + 10}" font-family="${SANS}" font-weight="600" font-size="${Math.round(f.body * 0.82)}" letter-spacing="1" fill="${MUTED}">wsdcacademy.com</text>`
  );
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>`);
}

async function logoChip(size) {
  const pad = Math.round(size * 0.16);
  const logo = await sharp(path.join(IMG, "logo.png"))
    .resize(size - pad * 2, size - pad * 2, { fit: "inside" })
    .toBuffer();
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.14)}" fill="${PAPER}" fill-opacity="0.95"/></svg>`
  );
  return sharp(bg).composite([{ input: logo, gravity: "centre" }]).png().toBuffer();
}

async function render(c, name) {
  const f = FORMATS[name];
  // Scale to full width, then cut the strip centred on focusY (0 = top, 1 = bottom).
  const ph = f.panelTop;
  const scaled = await sharp(path.join(IMG, c.photo))
    .rotate() // bake EXIF orientation into pixels
    .resize({ width: f.w, height: ph, fit: "outside" })
    .toBuffer({ resolveWithObject: true });
  const { width: sw, height: sh } = scaled.info;
  const top = Math.max(0, Math.min(sh - ph, Math.round((c.focusY ?? 0.5) * sh - ph / 2)));
  const left = Math.round((sw - f.w) / 2);
  const photo = await sharp(scaled.data).extract({ left, top, width: f.w, height: ph }).toBuffer();
  const chip = 112;
  // Story: keep the logo below the top 14% UI band.
  const chipTop = name === "story" ? Math.round(f.h * 0.14) + 20 : 36;
  const out = path.join(OUT, `wsdc-oct-${c.tag}-${name}-${f.w}x${f.h}.jpg`);
  await sharp({ create: { width: f.w, height: f.h, channels: 3, background: NAVY } })
    .composite([
      { input: photo, top: 0, left: 0 },
      { input: panelSvg(f, c), top: 0, left: 0 },
      { input: await logoChip(chip), top: chipTop, left: 36 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);
  return out;
}

mkdirSync(OUT, { recursive: true });
for (const c of CONCEPTS) {
  for (const name of Object.keys(FORMATS)) {
    const p = await render(c, name);
    console.log(`${p}  (${Math.round(statSync(p).size / 1024)} KB)`);
  }
}
