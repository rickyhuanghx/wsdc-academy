// Server-only gate for the coach desk (/admin/*).
//
// One shared key, set in the ADMIN_KEY env var. The coach enters it once on
// the desk's unlock form (a Server Function in src/app/admin/actions.ts),
// which sets an httpOnly cookie holding an HMAC derived from the key. Every
// desk page and the CSV export check that cookie. Changing the env var logs
// every browser out at once; with it unset the desk is closed.
//
// Never import this from a client component: it reads env and request cookies.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'wsdc_admin';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function adminKey(): string | undefined {
  const value = process.env.ADMIN_KEY?.trim();
  return value ? value : undefined;
}

export function isAdminConfigured(): boolean {
  return adminKey() !== undefined;
}

function tokenFor(key: string): string {
  return createHmac('sha256', key).update('wsdc-admin-access-v1').digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Constant-time check of an entered key against the configured one. */
export function checkAdminKey(attempt: string): boolean {
  const expected = adminKey();
  if (!expected) return false;
  return safeEqual(attempt, expected);
}

/** Reads the request cookies and says whether the viewer has unlocked the desk. */
export async function hasAdminAccess(): Promise<boolean> {
  const expected = adminKey();
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return !!token && safeEqual(token, tokenFor(expected));
}

/** Cookie attributes for a successful unlock. `secure` is off only in local dev, where there is no HTTPS. */
export function adminCookie(): { name: string; value: string; options: Record<string, unknown> } {
  const expected = adminKey();
  if (!expected) throw new Error('ADMIN_KEY is not set');
  return {
    name: ADMIN_COOKIE,
    value: tokenFor(expected),
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COOKIE_MAX_AGE_SECONDS,
    },
  };
}
