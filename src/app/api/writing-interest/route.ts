// Writing-competition interest (homepage section). Validates the submission,
// forwards it to the ClassDesk interest endpoint server-side (brand stamped),
// and if ClassDesk is down or rejects it, emails the admin inbox with the same
// details so the lead is never lost. The browser gets a success either way.

import { NextResponse } from 'next/server';
import {
  HONEYPOT_FIELD,
  getClientIp,
  isRateLimited,
  isValidEmail,
  sendAdminNotification,
} from '@/lib/leads';
import { GRADE_LEVELS } from '@/data/programs';
import { SEED_SLUGS, getCompetitions, registerInterest } from '@/lib/competitions';

export const runtime = 'nodejs';

const VALID_GRADES = new Set<string>(GRADE_LEVELS);
const MAX_SLUGS = 20;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,120}$/i;
const TAG_RE = /^[A-Za-z0-9_.-]{1,200}$/;
// gclid, or gbraid:/wbraid:-prefixed (see analytics.getAdClickId)
const CLICK_ID_RE = /^[A-Za-z0-9_.:-]{1,220}$/;

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

  if (isRateLimited(getClientIp(req), 'writing-interest')) {
    return fail(429, 'Too many requests. Please try again in a minute.');
  }

  const parentName = str(body.parentName, 200);
  const parentEmail = str(body.parentEmail, 254);
  const parentPhone = str(body.parentPhone, 50);
  const studentName = str(body.studentName, 200);
  const grade = str(body.grade, 40);

  if (!isValidEmail(parentEmail)) {
    return fail(400, 'Please enter a valid email address; it is where the details go.');
  }
  if (grade && !VALID_GRADES.has(grade)) return fail(400, 'Please choose a grade from the list.');

  // Competitions: unique, well-formed, and part of the catalogue we actually
  // list (the live ClassDesk catalogue plus the bundled seed).
  const rawSlugs = Array.isArray(body.competitionSlugs) ? body.competitionSlugs : [];
  const competitionSlugs = Array.from(
    new Set(rawSlugs.map((s) => str(s, 120)).filter((s) => s && SLUG_RE.test(s))),
  );
  if (competitionSlugs.length === 0) {
    return fail(400, 'Tick at least one competition so we know what to send you.');
  }
  if (competitionSlugs.length > MAX_SLUGS) return fail(400, 'Please choose fewer competitions.');
  const catalogue = await getCompetitions();
  const known = new Set<string>([...SEED_SLUGS, ...catalogue.map((c) => c.slug)]);
  if (competitionSlugs.some((s) => !known.has(s))) {
    return fail(400, 'One of the competitions you chose is not on our list. Please reload the page and try again.');
  }
  const names = competitionSlugs.map((s) => catalogue.find((c) => c.slug === s)?.shortName ?? s);

  // Campaign attribution, same shape the checkout and waitlist routes accept
  // (camelCase from analytics.ts or snake_case), stamped only when well-formed.
  const attribution: Record<string, string> = {};
  const rawAttr =
    body.attribution && typeof body.attribution === 'object' ? (body.attribution as Record<string, unknown>) : {};
  const pairs: [string, unknown, RegExp][] = [
    ['utm_source', rawAttr.utmSource ?? rawAttr.utm_source, TAG_RE],
    ['utm_medium', rawAttr.utmMedium ?? rawAttr.utm_medium, TAG_RE],
    ['utm_campaign', rawAttr.utmCampaign ?? rawAttr.utm_campaign, TAG_RE],
    ['gclid', rawAttr.gclid, CLICK_ID_RE],
    ['fbclid', rawAttr.fbclid, TAG_RE],
  ];
  for (const [key, value, re] of pairs) {
    const v = str(value, 220);
    if (v && re.test(v)) attribution[key] = v;
  }

  const result = await registerInterest({
    competitionSlugs,
    ...(parentName ? { parentName } : {}),
    parentEmail,
    ...(parentPhone ? { parentPhone } : {}),
    ...(studentName ? { studentName } : {}),
    ...(grade ? { grade } : {}),
    source: 'wsdc-site',
    ...(Object.keys(attribution).length ? { attribution } : {}),
  });

  if (result.ok) return NextResponse.json({ ok: true, ids: result.ids });

  // ClassDesk unavailable or unhappy: keep the lead by email, still succeed.
  console.error('[writing-interest] upstream failure, emailing admin instead:', result.status, result.error);
  await sendAdminNotification('Writing competition interest: WSDC Prep', {
    Competitions: names.join(', '),
    Parent: parentName || '—',
    Email: parentEmail,
    Phone: parentPhone || '—',
    Student: studentName || '—',
    Grade: grade || '—',
    ...(Object.keys(attribution).length ? { Attribution: JSON.stringify(attribution) } : {}),
    Note: `ClassDesk did not accept this submission (status ${result.status}, ${result.error}); it is not in the CRM yet.`,
  });
  return NextResponse.json({ ok: true, ids: [], fallback: true });
}
