// Verifies the Supabase connection + orders schema without writing anything.
// Usage: npm run check:supabase   (reads .env.local)
//
// Checks, in order: env vars present → client connects → `orders` table exists
// and is reachable with the service-role key. Prints a clear next step on failure.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env.local parser (no dependency on Node's --env-file flag).
function loadEnv(file) {
  const out = {};
  let text;
  try {
    text = readFileSync(join(root, file), 'utf8');
  } catch {
    return out;
  }
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = { ...loadEnv('.env.local'), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

if (!url || !key) {
  console.log(red('✗ Supabase env vars are not set.'));
  console.log(dim('  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'));
  console.log(dim('  (Supabase dashboard → Project Settings → API).'));
  process.exit(1);
}

if (key.startsWith('eyJ') === false && key.startsWith('sb_') === false) {
  console.log(red('✗ SUPABASE_SERVICE_ROLE_KEY does not look like a Supabase key.'));
  console.log(dim('  Copy the "service_role" secret (NOT the anon/public key).'));
  process.exit(1);
}

console.log(dim(`Connecting to ${url} …`));

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { count, error } = await supabase
  .from('orders')
  .select('*', { count: 'exact', head: true });

if (error) {
  console.log(red('✗ Connected, but the orders table is not reachable.'));
  console.log(dim(`  Supabase says: ${error.message} (code ${error.code ?? '—'})`));
  if (error.code === '42P01' || /does not exist/i.test(error.message)) {
    console.log(dim('  → Run supabase/schema.sql in the SQL Editor, then re-run this check.'));
  } else if (/JWT|api key|invalid/i.test(error.message)) {
    console.log(dim('  → Double-check you used the service_role secret and the correct Project URL.'));
  }
  process.exit(1);
}

console.log(green('✓ Supabase is connected and the orders table is ready.'));
console.log(dim(`  orders currently holds ${count ?? 0} row(s).`));
