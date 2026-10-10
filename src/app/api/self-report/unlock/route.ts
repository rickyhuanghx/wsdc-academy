// Password check for the self-report quiz (/for/self-report).
//
// POST { password } -> on a match, sets the httpOnly access cookie and the
// page re-renders with the quiz. Rate-limited per IP so the single shared
// password cannot be brute-forced from one machine; the response never says
// whether a password exists, only whether this one worked.

import { NextResponse } from 'next/server';
import { getClientIp, isRateLimited } from '@/lib/leads';
import { accessCookie, checkSelfReportPassword, isSelfReportConfigured } from '@/lib/self-report-auth';

export const runtime = 'nodejs';

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  if (!isSelfReportConfigured()) return fail(404, 'This page is not open.');

  if (isRateLimited(getClientIp(req), 'self-report-unlock')) {
    return fail(429, 'Too many tries. Please wait a minute and try again.');
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  const attempt = typeof body.password === 'string' ? body.password.trim().slice(0, 200) : '';
  if (!attempt || !checkSelfReportPassword(attempt)) {
    return fail(401, 'That password is not right.');
  }

  const cookie = accessCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
