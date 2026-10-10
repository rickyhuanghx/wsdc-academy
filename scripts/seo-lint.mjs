#!/usr/bin/env node
// Post-build SEO lint (WARN mode). Run after `next build`:  npm run seo-lint
//
// Adapted from ~/oxbridge-prep/scripts/seo-lint.mjs. Reads the prerendered HTML
// in .next/server/app and reports, per page:
//   1. <title> 30-65 chars (rendered, template included)
//   2. meta description 70-160 chars
//   3. exactly one <h1>
//   4. canonical present, absolute, and self-referencing (SITE_URL + route)
//   5. every JSON-LD block parses; no aggregateRating on an Organization node
//   6. og:image present
//   7. twitter:title present and matches the page (equals og:title; inner
//      pages must not carry the homepage's twitter:title)
//   8. no noindex on any URL listed in the sitemap
//
// WARN mode: always exits 0. It reports; it never rewrites copy. Not wired into
// the Netlify build. Routes rendered on demand (searchParams, dynamic tokens)
// have no prerendered HTML and are listed as "not checked".

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const APP = join(ROOT, '.next', 'server', 'app');
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wsdcacademy.com').replace(/\/$/, '');

if (!existsSync(APP)) {
  console.log('No .next/server/app: run `npm run build` first.');
  process.exit(0);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function routeOf(file) {
  let r = '/' + relative(APP, file).replace(/\.html$/, '');
  r = r.replace(/\/index$/, '') || '/';
  if (r === '/index') r = '/';
  return r;
}

// Private / transactional routes: noindex by design, not SEO surfaces.
const SKIP = /^\/(_|checkout|admin|for\/|api\/|enroll|trial-form|coaching-1on1)/;

const pages = new Map();
for (const f of walk(APP)) {
  const route = routeOf(f);
  if (SKIP.test(route) || route === '/_not-found' || route === '/_global-error') continue;
  pages.set(route, readFileSync(f, 'utf8'));
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ');

function meta(html, attr, key) {
  const re = new RegExp(`<meta[^>]*\\b${attr}="${key.replace(/[.:]/g, '\\$&')}"[^>]*>`, 'i');
  const tag = (html.match(re) || [])[0];
  if (!tag) return null;
  const c = tag.match(/\bcontent="([^"]*)"/);
  return c ? decode(c[1]) : '';
}

// Sitemap URLs (prerendered body of src/app/sitemap.ts)
const sitemapRoutes = (() => {
  for (const p of ['sitemap.xml.body', 'sitemap.xml']) {
    const f = join(APP, p);
    if (existsSync(f)) {
      const xml = readFileSync(f, 'utf8');
      return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
        const u = decode(m[1]).trim();
        return u.replace(SITE_URL, '').replace(/\/$/, '') || '/';
      });
    }
  }
  return null;
})();

const homeTwitterTitle = pages.has('/') ? meta(pages.get('/'), 'name', 'twitter:title') : null;

const findings = new Map(); // check -> [messages]
const add = (check, msg) => {
  if (!findings.has(check)) findings.set(check, []);
  findings.get(check).push(msg);
};

function hasOrgRating(node) {
  if (Array.isArray(node)) return node.some(hasOrgRating);
  if (!node || typeof node !== 'object') return false;
  const types = [].concat(node['@type'] || []);
  if (types.some((t) => /Organization$/.test(t)) && 'aggregateRating' in node) return true;
  return Object.values(node).some(hasOrgRating);
}

for (const [route, html] of pages) {
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = meta(html, 'name', 'description');
  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)];
  const canonical = decode((html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '');
  const robots = meta(html, 'name', 'robots') || '';
  const noindex = /noindex/i.test(robots);

  if (!title) add('title', `${route}: no <title>`);
  else if (title.length < 30 || title.length > 65) add('title', `${route}: ${title.length} chars "${title}"`);

  if (!desc) add('description', `${route}: no meta description`);
  else if (desc.length < 70 || desc.length > 160) add('description', `${route}: ${desc.length} chars`);

  if (h1s.length !== 1) add('h1', `${route}: ${h1s.length} H1s`);

  const expected = SITE_URL + (route === '/' ? '' : route);
  if (!canonical) {
    if (!noindex) add('canonical', `${route}: no canonical`);
  } else if (!/^https?:\/\//.test(canonical)) add('canonical', `${route}: not absolute (${canonical})`);
  else if (canonical.replace(/\/$/, '') !== expected.replace(/\/$/, ''))
    add('canonical', `${route}: not self-referencing (${canonical})`);

  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      if (hasOrgRating(j)) add('json-ld', `${route}: aggregateRating on an Organization node`);
    } catch {
      add('json-ld', `${route}: JSON-LD block does not parse`);
    }
  }

  if (!meta(html, 'property', 'og:image')) add('og:image', `${route}: no og:image`);

  const twTitle = meta(html, 'name', 'twitter:title');
  const ogTitle = meta(html, 'property', 'og:title');
  if (!twTitle) add('twitter:title', `${route}: no twitter:title`);
  else if (route !== '/' && homeTwitterTitle && twTitle === homeTwitterTitle)
    add('twitter:title', `${route}: carries the homepage twitter:title`);
  else if (ogTitle && twTitle !== ogTitle) add('twitter:title', `${route}: twitter:title "${twTitle}" != og:title "${ogTitle}"`);

  if (noindex && sitemapRoutes && sitemapRoutes.includes(route)) add('noindex-in-sitemap', `${route}: noindex but listed in sitemap`);
}

const notChecked = sitemapRoutes ? sitemapRoutes.filter((r) => !pages.has(r)) : [];

/* ------------------------------------------------------------- report */
const ORDER = ['title', 'description', 'h1', 'canonical', 'json-ld', 'og:image', 'twitter:title', 'noindex-in-sitemap'];
console.log(`SEO lint (warn mode): ${pages.size} prerendered pages checked against ${SITE_URL}`);
if (sitemapRoutes) console.log(`Sitemap: ${sitemapRoutes.length} URLs`);
else console.log('Sitemap: not found in build output, noindex-in-sitemap check skipped');
let total = 0;
for (const check of ORDER) {
  const list = findings.get(check) || [];
  total += list.length;
  console.log(`\n[${list.length ? 'WARN' : ' OK '}] ${check}: ${list.length}`);
  for (const m of list) console.log('  - ' + m);
}
if (notChecked.length) {
  console.log(`\n[INFO] ${notChecked.length} sitemap URLs have no prerendered HTML (rendered on demand), not checked:`);
  for (const r of notChecked) console.log('  - ' + r);
}
console.log(`\n${total} warnings. Warn mode: exit 0.`);
process.exit(0);
