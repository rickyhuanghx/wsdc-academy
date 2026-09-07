// Tournament waitlist. With a slug the entry is forwarded to the ClassDesk
// waitlist endpoint (server-side, brand stamped); without one (the listing
// page's "tell me when one opens" form) it is emailed to the admin inbox via
// the shared lead notifier, since there is no tournament to attach it to.

import { NextResponse } from 'next/server';
import {
  HONEYPOT_FIELD,
  getClientIp,
  isRateLimited,
  isValidEmail,
  sendAdminNotification,
} from '@/lib/leads';
import { GRADE_LEVELS } from '@/data/programs';
import { joinWaitlist } from '@/lib/tournaments';

export const runtime = 'nodejs';

const VALID_GRADES = new Set<string>(GRADE_LEVELS);
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,120}$/i;
const DOB_RE = /^\d{4}-\d{2}-\d{2}$/;
const TAG_RE = /^[A-Za-z0-9_.-]{1,200}$/;

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  // Honeypot: silent success for bots.
  if (typeof body[HONEYPOT_FIELD] === 'string' && (body[HONEYPOT_FIELD] as string).length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(getClientIp(req), 'tournament-waitlist')) {
    return fail(429, 'Too many requests. Please try again in a minute.');
  }

  const slug = str(body.slug, 120);
  const parentName = str(body.parentName, 200);
  const parentEmail = str(body.parentEmail, 254);
  const parentPhone = str(body.parentPhone, 50);
  const studentName = str(body.studentName, 200);
  const dob = str(body.dob, 10);
  const grade = str(body.grade, 40);
  const school = str(body.school, 200);

  if (parentName.length < 2) return fail(400, 'Please enter the parent or guardian name.');
  if (!isValidEmail(parentEmail)) return fail(400, 'Please enter a valid email address.');
  if (studentName.length < 2) return fail(400, 'Please enter the student name.');
  if (grade && !VALID_GRADES.has(grade)) return fail(400, 'Please choose a grade from the list.');
  if (dob && !DOB_RE.test(dob)) return fail(400, 'Please enter the date of birth as YYYY-MM-DD.');

  // Optional campaign tags from the client (same shape the checkout forwards).
  const utm: Record<string, string> = {};
  const rawUtm = body.utm && typeof body.utm === 'object' ? (body.utm as Record<string, unknown>) : {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid']) {
    const v = str(rawUtm[key], 200);
    if (v && TAG_RE.test(v)) utm[key] = v;
  }

  // Generic interest (no tournament): email the team, nothing goes to ClassDesk.
  if (!slug) {
    await sendAdminNotification('Tournament interest: WSDC Prep', {
      Parent: parentName,
      Email: parentEmail,
      Phone: parentPhone || '—',
      Student: studentName,
      Grade: grade || '—',
      ...(Object.keys(utm).length ? { Attribution: JSON.stringify(utm) } : {}),
    });
    return NextResponse.json({ ok: true });
  }

  if (!SLUG_RE.test(slug)) return fail(400, 'Unknown tournament.');

  const result = await joinWaitlist(slug, {
    parentName,
    parentEmail,
    ...(parentPhone ? { parentPhone } : {}),
    students: [
      {
        name: studentName,
        ...(dob ? { dob } : {}),
        ...(grade ? { grade } : {}),
        ...(school ? { school } : {}),
      },
    ],
    source: 'wsdc-site',
    ...(Object.keys(utm).length ? { utm } : {}),
  });

  if (result.ok) return NextResponse.json({ ok: true, entries: result.entries });

  if (result.status === 409) {
    return fail(
      409,
      result.error === 'closed'
        ? 'Registration for this tournament has closed, so the waitlist is no longer open.'
        : 'This tournament still has places. You can register directly instead of joining the waitlist.',
    );
  }
  if (result.status === 422) {
    const fields = result.fields?.length ? ` (${result.fields.join(', ')})` : '';
    return fail(400, `Please check the details you entered${fields}.`);
  }
  if (result.status === 404) return fail(404, 'Unknown tournament.');
  console.error('[tournament-waitlist] upstream failure:', slug, result.status, result.error);
  return fail(502, 'We could not save your place just now. Please try again or email us.');
}
