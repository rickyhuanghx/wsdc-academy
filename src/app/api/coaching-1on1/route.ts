// 1-on-1 coaching request intake (src/components/CoachingRequestForm.tsx).
//
// Two sinks, both attempted, neither required:
//   1. Supabase table `coaching_1on1_requests` (see supabase/schema.sql).
//      Until that table exists the insert fails and is logged — the form still
//      works, because the email below is the sink that matters.
//   2. Email via Resend: a staff alert to ADMIN_NOTIFICATION_EMAIL plus a short
//      confirmation to the parent, both from RESEND_FROM_EMAIL
//      (WSDC Academy <info@wsdcacademy.com>) — never a personal mailbox.
//
// Families reaching this form have already settled on 1-on-1 coaching, so
// nothing here mentions a fee. No calendar booking either: follow-up is manual.

import { NextResponse } from 'next/server';
import {
  HONEYPOT_FIELD,
  getClientIp,
  isRateLimited,
  isValidEmail,
  sendEmail,
} from '@/lib/leads';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  DAYS,
  FORMATS,
  LEVEL_VALUES,
  NO_PREFERENCE,
  WINDOW_VALUES,
  coachNameForSlug,
} from '@/lib/coaching-request';
import { GRADE_LEVELS } from '@/data/programs';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const runtime = 'nodejs';

const VALID_GRADES = new Set<string>(GRADE_LEVELS);

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function pickFrom(v: unknown, allowed: readonly string[]): string {
  const value = str(v, 60);
  return allowed.includes(value) ? value : '';
}

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailShell(heading: string, inner: string): string {
  return `
    <div style="margin:0;padding:24px;background-color:#faf9f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e7ebf1;">
        <div style="background:#0d2240;padding:28px;text-align:center;">
          <h1 style="color:#ffffff;font-size:20px;margin:0;">${escapeHtml(heading)}</h1>
        </div>
        <div style="padding:28px;">${inner}</div>
      </div>
    </div>`;
}

function table(rows: Array<[string, string]>): string {
  const body = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e7ebf1;color:#4c6787;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e7ebf1;color:#0d2240;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;">${body}</table>`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  // Honeypot: bots fill the hidden field. Pretend success.
  if (typeof body[HONEYPOT_FIELD] === 'string' && (body[HONEYPOT_FIELD] as string).length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(getClientIp(req), 'coaching-1on1')) {
    return fail(429, 'Too many requests. Please try again in a minute.');
  }

  const studentName = str(body.studentName, 200);
  const age = str(body.age, 4);
  const grade = str(body.grade, 40);
  const level = pickFrom(body.level, LEVEL_VALUES);
  const format = pickFrom(body.format, FORMATS);
  const goal = str(body.goal, 300);
  const parentName = str(body.parentName, 200);
  const parentEmail = str(body.parentEmail, 254);
  const parentPhone = str(body.parentPhone, 50);
  const videoUrl = str(body.videoUrl, 500);
  const notes = str(body.notes, 2000);
  const timezone = str(body.timezone, 80);
  const pageUrl = str(body.pageUrl, 300);

  const days = Array.isArray(body.days) ? DAYS.filter((d) => (body.days as unknown[]).includes(d)) : [];
  const windows = Array.isArray(body.windows)
    ? WINDOW_VALUES.filter((w) => (body.windows as unknown[]).includes(w))
    : [];

  // Ordered coach preference, sent as slugs. Unknown slugs are dropped and
  // duplicates collapsed, so a tampered payload can only shrink the list,
  // never inject a name that is not on the roster.
  const noPreference = body.noPreference === true;
  const rankedNames = Array.isArray(body.coachRanking)
    ? (body.coachRanking as unknown[])
        .map((v) => str(v, 60))
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .map((slug) => coachNameForSlug(slug))
        .filter((name): name is string => Boolean(name))
    : [];
  // Stored as one ordered, readable string: "1. Tin Puljić · 2. Biser Angelov",
  // or "No preference".
  const coachSummary = noPreference
    ? NO_PREFERENCE
    : rankedNames.map((name, i) => `${i + 1}. ${name}`).join(' · ');

  // Server-side validation mirrors the form's required fields.
  const ageNum = Number(age);
  if (
    !studentName ||
    !Number.isInteger(ageNum) ||
    ageNum < 8 ||
    ageNum > 19 ||
    !VALID_GRADES.has(grade) ||
    !level ||
    !format ||
    !parentName ||
    !isValidEmail(parentEmail) ||
    parentPhone.replace(/\D/g, '').length < 6 ||
    !coachSummary ||
    days.length === 0 ||
    windows.length === 0
  ) {
    return fail(400, 'Please fill in all required fields.');
  }

  const submittedAt = new Date().toISOString();
  const record = {
    student_name: studentName,
    student_age: ageNum,
    student_grade: grade,
    level,
    format_focus: format,
    goal: goal || null,
    parent_name: parentName,
    parent_email: parentEmail,
    parent_phone: parentPhone,
    preferred_coach: coachSummary,
    preferred_days: days,
    preferred_windows: windows,
    timezone: timezone || null,
    video_url: videoUrl || null,
    notes: notes || null,
    page_url: pageUrl || null,
    status: 'new',
  };

  // Sink 1: Supabase. Best-effort — a missing table or missing env must not
  // lose the lead, so getSupabaseAdmin's throw is caught here too.
  let insertFailed = true;
  try {
    const { error } = await getSupabaseAdmin().from('coaching_1on1_requests').insert(record);
    if (error) {
      console.error(
        '[COACHING_1ON1_INSERT_FAILED] Supabase insert failed, lead lives in the email only:',
        error.message,
        JSON.stringify(record),
      );
    } else {
      insertFailed = false;
    }
  } catch (err) {
    console.error('[COACHING_1ON1_INSERT_FAILED] Supabase unavailable:', err, JSON.stringify(record));
  }

  // Sink 2: staff alert.
  const staffRows: Array<[string, string]> = [
    ['Student', `${studentName}, age ${age}`],
    ['Grade', grade],
    ['Level', level],
    ['Focus', format],
    ['Working towards', goal || '—'],
    ['Coach ranking', coachSummary],
    ['Days', days.join(', ')],
    ['Time windows', windows.join(', ')],
    ['Timezone', timezone || '—'],
    ['Parent', parentName],
    ['Email', parentEmail],
    ['Phone', parentPhone],
    ['Speech / ballot', videoUrl || '—'],
    ['Notes', notes || '—'],
    ['Page', pageUrl || '—'],
    ['Submitted', submittedAt],
  ];
  const staffSent = await sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL || CONTACT_EMAIL,
    replyTo: parentEmail,
    subject: `1-on-1 coaching request: ${studentName} (${level})`,
    html: emailShell(
      'New 1-on-1 Coaching Request',
      `${table(staffRows)}
       <p style="color:#4c6787;font-size:12px;margin-top:20px;">
         Submitted on the unlisted 1-on-1 request form. Availability is in the parent's own
         timezone, and the coaches are in their order of preference. Work down the list until
         one fits.
       </p>`,
    ),
  });

  // Parent confirmation. Deliberately silent on price and on which coach is
  // free: both are settled in the reply.
  const parentSent = await sendEmail({
    to: parentEmail,
    replyTo: CONTACT_EMAIL,
    subject: `${SITE_NAME}: we've got your request`,
    html: emailShell(
      'Request received',
      `<p style="color:#0d2240;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Dear ${escapeHtml(parentName)},
       </p>
       <p style="color:#35506e;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Thank you for your interest in one-on-one debate coaching. We have your details for
         ${escapeHtml(studentName)} and will be in touch within one working day to confirm your
         coach and a time.
       </p>
       <p style="color:#4c6787;font-size:13px;line-height:1.6;margin:24px 0 0;">
         Questions in the meantime? Just reply to this email.<br />
         ${escapeHtml(SITE_NAME)}
       </p>`,
    ),
  });

  if (!staffSent && insertFailed) {
    // Both durable sinks are down: keep the whole lead in the function logs.
    console.error('[COACHING_1ON1_NO_SINK] Request had no working sink:', JSON.stringify(record));
  }
  if (!parentSent) {
    console.error('[COACHING_1ON1_PARENT_MAIL_FAILED]', parentEmail);
  }

  return NextResponse.json({ ok: true });
}
