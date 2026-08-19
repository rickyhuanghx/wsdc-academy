// Callback-request endpoint for the dual-path consultation widget.
// Sinks: shared Google Sheet (Apps Script web app, SHEETS_WEBHOOK_URL) + admin
// email via Resend. Both are best-effort; a lead is never lost to a sink error
// without at least a server log. See docs/CALLBACK_LEADS.md for the sheet setup.

import {
  isRateLimited,
  getClientIp,
  sendAdminNotification,
  ok,
  badRequest,
  tooManyRequests,
} from '@/lib/leads';
import { SITE_NAME } from '@/lib/site';

const VALID_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const VALID_WINDOWS = ['Morning', 'Afternoon', 'Evening'];

function cleanString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function cleanList(value: unknown, allowed: string[]): string[] {
  if (!Array.isArray(value)) return [];
  // De-dupe and keep week/day order stable regardless of client order.
  return allowed.filter((item) => value.includes(item));
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  // Honeypot: silent success for bots
  if (body.website) return ok();

  if (isRateLimited(getClientIp(req), 'callback')) return tooManyRequests();

  const parentName = cleanString(body.parentName, 200);
  const phone = cleanString(body.phone, 40);
  const childName = cleanString(body.childName, 200);
  const childAge = cleanString(body.childAge, 4);
  const school = cleanString(body.school, 300);
  const experience = cleanString(body.experience, 500);
  const notes = cleanString(body.notes, 2000);
  const timezone = cleanString(body.timezone, 64);
  const pageUrl = cleanString(body.pageUrl, 500);
  // Google Ads click id (gclid, or gbraid:/wbraid:-prefixed) for offline
  // conversion matching from the sheet. Optional; strict charset.
  const gclid =
    typeof body.gclid === 'string' && /^[A-Za-z0-9_.:-]{1,220}$/.test(body.gclid) ? body.gclid : '';
  // Campaign attribution captured from the landing URL (see AdClickCapture):
  // UTM values are free text (strip control chars, cap length); fbclid is
  // Meta's click id with a strict charset like gclid.
  const utmTag = (v: unknown) =>
    typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 200) : '';
  const utmSource = utmTag(body.utmSource);
  const utmMedium = utmTag(body.utmMedium);
  const utmCampaign = utmTag(body.utmCampaign);
  const fbclid =
    typeof body.fbclid === 'string' && /^[A-Za-z0-9_.-]{1,255}$/.test(body.fbclid)
      ? body.fbclid
      : '';
  const days = cleanList(body.days, VALID_DAYS);
  const windows = cleanList(body.windows, VALID_WINDOWS);

  if (!parentName) return badRequest('Name is required');
  if (!phone) return badRequest('Phone number is required');
  if (!childName) return badRequest("Child's name is required");
  const ageNum = Number(childAge);
  if (!Number.isInteger(ageNum) || ageNum < 7 || ageNum > 18) {
    return badRequest('Valid age is required');
  }
  if (!school) return badRequest('School or area is required');
  if (days.length === 0) return badRequest('Pick at least one day');
  if (windows.length === 0) return badRequest('Pick at least one time window');

  const payload = {
    secret: process.env.SHEETS_WEBHOOK_SECRET ?? '',
    brand: SITE_NAME,
    type: 'callback',
    parentName,
    phone,
    childName,
    childAge,
    school,
    experience,
    notes,
    days,
    windows,
    timezone,
    pageUrl,
    gclid,
    utmSource,
    utmMedium,
    utmCampaign,
    fbclid,
    submittedAt: new Date().toISOString(),
  };

  // Sink 1: shared Google Sheet via Apps Script web hook
  const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
  if (sheetsUrl) {
    try {
      const res = await fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error(`[callback] Sheets webhook error ${res.status}: ${await res.text()}`);
      }
    } catch (err) {
      console.error('[callback] Sheets webhook request failed', err);
    }
  }

  // Sink 2: admin email via Resend (logs and continues when unconfigured)
  await sendAdminNotification(`New callback request — ${SITE_NAME}`, {
    'Parent name': parentName,
    Phone: phone,
    'Child name': childName,
    'Child age': childAge,
    'School / area': school,
    Experience: experience || '—',
    Notes: notes || '—',
    Days: days.join(', '),
    'Time windows': windows.join(', '),
    Timezone: timezone || '—',
    'Page URL': pageUrl || '—',
    'Submitted at': payload.submittedAt,
  });

  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY &&
      process.env.ADMIN_NOTIFICATION_EMAIL &&
      process.env.RESEND_FROM_EMAIL
  );
  if (!sheetsUrl && !resendConfigured) {
    console.error('[callback] No sink configured (SHEETS_WEBHOOK_URL / Resend) — lead logged only:', payload);
  }

  return ok();
}
