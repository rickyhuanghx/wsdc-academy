// Server-only password gate for the self-report quiz (/for/self-report).
//
// Optional. With SELF_REPORT_PASSWORD unset the unlisted URL is the only
// protection and the paper opens directly. Set the env var to add a shared
// password that students receive with the link. Entering it on the page calls
// /api/self-report/unlock, which sets an httpOnly cookie holding an HMAC
// derived from the password. The page and the submit route both check that
// cookie, so neither the password nor anything derived from it is ever in
// the HTML, and changing the env var logs every browser out at once.
//
// Never import this from a client component: it reads env and request cookies.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { SELF_REPORT_COOKIE } from '@/lib/self-report';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function selfReportPassword(): string | undefined {
  const value = process.env.SELF_REPORT_PASSWORD?.trim();
  return value ? value : undefined;
}

/** True when the owner has configured a password. Without one the page opens without a gate. */
export function isSelfReportConfigured(): boolean {
  return selfReportPassword() !== undefined;
}

/** The value the access cookie must carry for the current password. */
function accessTokenFor(password: string): string {
  return createHmac('sha256', password).update('wsdc-self-report-access-v1').digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Constant-time check of a password attempt against the configured one. */
export function checkSelfReportPassword(attempt: string): boolean {
  const expected = selfReportPassword();
  if (!expected) return false;
  return safeEqual(attempt, expected);
}

/** Whether a presented cookie value grants access under the current password. */
export function isValidAccessToken(token: string | undefined): boolean {
  const expected = selfReportPassword();
  if (!expected || !token) return false;
  return safeEqual(token, accessTokenFor(expected));
}

/**
 * Reads the request cookies (Server Components and Route Handlers) and says
 * whether the viewer may see and submit the paper: always, when no password
 * is configured; otherwise only with a valid access cookie.
 */
export async function hasSelfReportAccess(): Promise<boolean> {
  if (!isSelfReportConfigured()) return true;
  const store = await cookies();
  return isValidAccessToken(store.get(SELF_REPORT_COOKIE)?.value);
}

/** Cookie attributes for a successful unlock. `secure` is off only in local dev, where there is no HTTPS. */
export function accessCookie(): { name: string; value: string; options: Record<string, unknown> } {
  const expected = selfReportPassword();
  if (!expected) throw new Error('SELF_REPORT_PASSWORD is not set');
  return {
    name: SELF_REPORT_COOKIE,
    value: accessTokenFor(expected),
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COOKIE_MAX_AGE_SECONDS,
    },
  };
}
