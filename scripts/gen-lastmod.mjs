// Writes src/generated/lastmod.json: last git commit date for every tracked
// file under src/. sitemap.ts reads it instead of shelling out to git, because
// on Netlify the sitemap is regenerated at request time (ISR, for the
// tournament list) inside a function that has no git checkout, so every
// static page fell back to FALLBACK_DATE. Runs as `prebuild` / `predev`.
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const out = 'src/generated/lastmod.json';
const dates = {};

try {
  // A shallow CI clone would date every file to the newest commit (churn).
  if (execSync('git rev-parse --is-shallow-repository', { encoding: 'utf8' }).trim() === 'true') {
    execSync('git fetch --unshallow --quiet', { stdio: 'ignore' });
  }
  // One pass over history, newest first: the first date seen per file wins.
  const log = execSync('git log --format=@%cI --name-only -- src', {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  let current = '';
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) current = line.slice(1);
    else if (line && !(line in dates)) dates[line] = current;
  }
} catch {
  // No git (or no network for unshallow): sitemap.ts uses its fixed fallback.
}

mkdirSync('src/generated', { recursive: true });
writeFileSync(out, JSON.stringify(dates, null, 0) + '\n');
console.log(`lastmod: ${Object.keys(dates).length} files -> ${out}`);
