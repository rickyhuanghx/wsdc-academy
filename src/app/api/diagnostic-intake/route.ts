// Pre-diagnostic intake (src/components/DiagnosticIntakeForm.tsx).
//
// Two sinks, both attempted, neither required:
//   1. Supabase table `diagnostic_intakes` (see supabase/schema.sql). Until
//      that table exists the insert fails and is logged; the email below is
//      the sink that matters.
//   2. Email via Resend: a staff alert to ADMIN_NOTIFICATION_EMAIL carrying the
//      student's written tasks in full, plus a short confirmation to the
//      parent, both from RESEND_FROM_EMAIL (WSDC Academy <info@wsdcacademy.com>).
//
// The session is already paid for, so nothing here mentions money. No calendar
// booking either: the time is confirmed by reply.

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
  CASE_MAX_CHARS,
  CASE_MIN_WORDS,
  DAYS,
  EXPERIENCE_VALUES,
  FORMATS_TRIED,
  GOALS,
  MOTIONS,
  REBUTTAL_MAX_CHARS,
  REBUTTAL_PROMPT,
  SIDES,
  TIME_SPENT,
  WINDOW_VALUES,
  getDiagnosticInvite,
  wordCount,
} from '@/lib/diagnostic-intake';
import { GRADE_LEVELS } from '@/data/programs';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

export const runtime = 'nodejs';

const VALID_GRADES = new Set<string>(GRADE_LEVELS);

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function pickFrom(v: unknown, allowed: readonly string[]): string {
  const value = str(v, 200);
  return allowed.includes(value) ? value : '';
}

function pickMany(v: unknown, allowed: readonly string[]): string[] {
  return Array.isArray(v) ? allowed.filter((a) => (v as unknown[]).includes(a)) : [];
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

function paragraphs(text: string): string {
  return escapeHtml(text).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br />');
}

function emailShell(heading: string, inner: string): string {
  return `
    <div style="margin:0;padding:24px;background-color:#faf9f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e7ebf1;">
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

function block(title: string, prompt: string, answer: string): string {
  return `
    <h2 style="color:#0d2240;font-size:16px;margin:28px 0 6px;">${escapeHtml(title)}</h2>
    <p style="color:#4c6787;font-size:13px;line-height:1.5;margin:0 0 10px;">${escapeHtml(prompt)}</p>
    <div style="border-left:3px solid #c8102e;padding:4px 14px;color:#0d2240;font-size:14px;line-height:1.65;">
      <p style="margin:0;">${paragraphs(answer)}</p>
    </div>`;
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

  if (isRateLimited(getClientIp(req), 'diagnostic-intake')) {
    return fail(429, 'Too many requests. Please try again in a minute.');
  }

  // Only a registered invite can submit: the token ties the answers to a paid
  // diagnostic, and an unknown one means the URL was guessed.
  const invite = getDiagnosticInvite(str(body.token, 80));
  if (!invite) return fail(404, 'This link is not valid.');

  const studentName = str(body.studentName, 200);
  const age = str(body.age, 4);
  const grade = str(body.grade, 40);
  const school = str(body.school, 200);
  const experience = pickFrom(body.experience, EXPERIENCE_VALUES);
  const formatsTried = pickMany(body.formatsTried, FORMATS_TRIED);
  const goals = pickMany(body.goals, GOALS);
  const competitions = str(body.competitions, 1500);
  const notes = str(body.notes, 2000);

  const motion = pickFrom(body.motion, MOTIONS);
  const side = pickFrom(body.side, SIDES);
  const caseText = str(body.caseText, CASE_MAX_CHARS);
  const rebuttalText = str(body.rebuttalText, REBUTTAL_MAX_CHARS);
  const speechUrl = str(body.speechUrl, 500);
  const timeSpent = pickFrom(body.timeSpent, TIME_SPENT);

  const parentName = str(body.parentName, 200);
  const parentEmail = str(body.parentEmail, 254);
  const parentPhone = str(body.parentPhone, 50);
  const studentEmail = str(body.studentEmail, 254);
  const timezone = str(body.timezone, 80);
  const pageUrl = str(body.pageUrl, 300);

  const days = pickMany(body.days, DAYS);
  const windows = pickMany(body.windows, WINDOW_VALUES);

  const ageNum = Number(age);
  if (
    !studentName ||
    !Number.isInteger(ageNum) ||
    ageNum < 8 ||
    ageNum > 20 ||
    !VALID_GRADES.has(grade) ||
    !experience ||
    goals.length === 0 ||
    !motion ||
    !side ||
    wordCount(caseText) < CASE_MIN_WORDS ||
    !rebuttalText ||
    !parentName ||
    !isValidEmail(parentEmail) ||
    parentPhone.replace(/\D/g, '').length < 6 ||
    (studentEmail && !isValidEmail(studentEmail)) ||
    days.length === 0 ||
    windows.length === 0
  ) {
    return fail(400, 'Please fill in all required fields.');
  }

  const submittedAt = new Date().toISOString();
  const record = {
    invite_token: invite.token,
    payment_ref: invite.paymentRef,
    student_name: studentName,
    student_age: ageNum,
    student_grade: grade,
    school: school || null,
    experience,
    formats_tried: formatsTried,
    goals,
    competitions: competitions || null,
    notes: notes || null,
    motion,
    side,
    case_text: caseText,
    rebuttal_prompt: REBUTTAL_PROMPT,
    rebuttal_text: rebuttalText,
    speech_url: speechUrl || null,
    time_spent: timeSpent || null,
    parent_name: parentName,
    parent_email: parentEmail,
    parent_phone: parentPhone,
    student_email: studentEmail || null,
    preferred_days: days,
    preferred_windows: windows,
    timezone: timezone || null,
    page_url: pageUrl || null,
    status: 'new',
  };

  // Sink 1: Supabase. Best-effort: a missing table or missing env must not
  // lose the submission, so getSupabaseAdmin's throw is caught here too.
  let insertFailed = true;
  try {
    const { error } = await getSupabaseAdmin().from('diagnostic_intakes').insert(record);
    if (error) {
      console.error(
        '[DIAGNOSTIC_INTAKE_INSERT_FAILED] Supabase insert failed, submission lives in the email only:',
        error.message,
        JSON.stringify(record),
      );
    } else {
      insertFailed = false;
    }
  } catch (err) {
    console.error('[DIAGNOSTIC_INTAKE_INSERT_FAILED] Supabase unavailable:', err, JSON.stringify(record));
  }

  // Sink 2: staff alert, with the written tasks in full for the coach.
  const staffRows: Array<[string, string]> = [
    ['Student', `${studentName}, age ${age}`],
    ['Grade / school', `${grade}${school ? ` · ${school}` : ''}`],
    ['Experience', experience],
    ['Formats tried', formatsTried.length ? formatsTried.join(', ') : '—'],
    ['Goals', goals.join(', ')],
    ['Competitions / deadlines', competitions || '—'],
    ['Anything else', notes || '—'],
    ['Speech recording', speechUrl || '—'],
    ['Time spent on tasks', timeSpent || '—'],
    ['Days', days.join(', ')],
    ['Time windows', windows.join(', ')],
    ['Timezone', timezone || '—'],
    ['Parent', parentName],
    ['Parent email', parentEmail],
    ['Parent phone', parentPhone],
    ['Student email', studentEmail || '—'],
    ['Payment', invite.paymentRef],
    ['Submitted', submittedAt],
  ];
  const staffSent = await sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL || CONTACT_EMAIL,
    replyTo: parentEmail,
    subject: `Diagnostic intake: ${studentName} (${experience})`,
    html: emailShell(
      'Diagnostic Intake Received',
      `${table(staffRows)}
       ${block('Task 1: the case', `${motion} — ${side}`, caseText)}
       ${block('Task 2: the response', `Responding to: “${REBUTTAL_PROMPT}”`, rebuttalText)}
       <p style="color:#4c6787;font-size:12px;margin-top:24px;">
         Submitted on the private pre-diagnostic page. Availability is in the family's own
         timezone. Forward the two tasks to the coach before the session.
       </p>`,
    ),
  });

  // Parent confirmation. No price, no coach name: both are settled by reply.
  const parentSent = await sendEmail({
    to: parentEmail,
    replyTo: CONTACT_EMAIL,
    subject: `${SITE_NAME}: ${studentName}'s diagnostic form is in`,
    html: emailShell(
      'Thank you',
      `<p style="color:#0d2240;font-size:15px;line-height:1.6;margin:0 0 16px;">
         Dear ${escapeHtml(parentName)},
       </p>
       <p style="color:#35506e;font-size:15px;line-height:1.6;margin:0 0 16px;">
         We have ${escapeHtml(studentName)}'s answers and the two written tasks. The coach will
         read them before the diagnostic session. We will be in touch within one working day to
         confirm a time.
       </p>
       <p style="color:#4c6787;font-size:13px;line-height:1.6;margin:24px 0 0;">
         Questions in the meantime? Just reply to this email.<br />
         ${escapeHtml(SITE_NAME)}
       </p>`,
    ),
  });

  if (!staffSent && insertFailed) {
    console.error('[DIAGNOSTIC_INTAKE_NO_SINK] Submission had no working sink:', JSON.stringify(record));
  }
  if (!parentSent) {
    console.error('[DIAGNOSTIC_INTAKE_PARENT_MAIL_FAILED]', parentEmail);
  }

  return NextResponse.json({ ok: true });
}
