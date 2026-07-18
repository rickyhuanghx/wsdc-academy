// Shared server-side lead handling: honeypot, rate limit, validation, notification.
// Pattern lifted from wsc-academy (Resend + Supabase); Supabase persistence is a
// follow-up once the brand's Supabase project exists — see CLAUDE.md.

import { NextResponse } from 'next/server';

export const HONEYPOT_FIELD = 'website_url';

// Per-IP in-memory rate limit: 5 requests/min/endpoint
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(ip: string, endpoint: string): boolean {
  const key = `${endpoint}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 5;
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Sends an admin notification via the Resend HTTP API (no SDK dependency).
 * Failures are logged but never thrown — the caller already accepted the lead.
 */
export async function sendAdminNotification(subject: string, fields: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(`[leads] Resend not configured — lead logged only: ${subject}`, fields);
    return;
  }

  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold">${escapeHtml(key)}</td><td style="padding:6px 12px">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html: `<h2 style="font-family:sans-serif">${escapeHtml(subject)}</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`,
      }),
    });
    if (!res.ok) {
      console.error(`[leads] Resend error ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error('[leads] Resend request failed', err);
  }
}

/**
 * Sends an arbitrary email via the Resend HTTP API (no SDK dependency).
 * Failures are logged but never thrown — used by the Stripe webhook, where the
 * order row is the source of truth and email is best-effort.
 */
export async function sendEmail(opts: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(`[leads] Resend not configured — email skipped: ${opts.subject} → ${opts.to}`);
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
    });
    if (!res.ok) {
      console.error(`[leads] Resend error ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error('[leads] Resend request failed', err);
  }
}

export function ok() {
  return NextResponse.json({ success: true });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function tooManyRequests() {
  return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
}
