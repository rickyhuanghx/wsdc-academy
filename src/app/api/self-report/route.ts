// Self-report quiz submissions (src/components/SelfReportQuiz.tsx).
//
// Only a browser holding the password cookie may submit. Two sinks, both
// attempted, neither required:
//   1. Supabase table `self_reports` (see supabase/schema.sql). Until the
//      table exists the insert fails and is logged; the email is the sink
//      that matters.
//   2. A staff email to ADMIN_NOTIFICATION_EMAIL with the scores, every
//      answer, and the reflections in full.
// The student sees their scores on the page; no email goes to them.

import { NextResponse } from 'next/server';
import { GRADE_LEVELS } from '@/data/programs';
import { HONEYPOT_FIELD, getClientIp, isRateLimited, isValidEmail, sendEmail } from '@/lib/leads';
import {
  REFLECTION_MAX_CHARS,
  SCALE_MAX,
  SCALE_MIN,
  SELF_REPORT_CLASSES,
  SELF_REPORT_EXPERIENCE,
  SELF_REPORT_QUESTIONS,
  SELF_REPORT_REFLECTIONS,
  SELF_REPORT_SCALE,
  describeBand,
  scoreSelfReport,
} from '@/lib/self-report';
import { hasSelfReportAccess } from '@/lib/self-report-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { CONTACT_EMAIL } from '@/lib/site';

export const runtime = 'nodejs';

const VALID_GRADES = new Set<string>(GRADE_LEVELS);

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function pickFrom(v: unknown, allowed: readonly string[]): string {
  const value = str(v, 200);
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

function block(title: string, answer: string): string {
  return `
    <h2 style="color:#0d2240;font-size:16px;margin:28px 0 10px;">${escapeHtml(title)}</h2>
    <div style="border-left:3px solid #c8102e;padding:4px 14px;color:#0d2240;font-size:14px;line-height:1.65;">
      <p style="margin:0;">${paragraphs(answer)}</p>
    </div>`;
}

export async function POST(req: Request) {
  if (!(await hasSelfReportAccess())) return fail(401, 'Please enter the password first.');

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

  if (isRateLimited(getClientIp(req), 'self-report')) {
    return fail(429, 'Too many requests. Please try again in a minute.');
  }

  const studentName = str(body.studentName, 200);
  const grade = str(body.grade, 40);
  const className = pickFrom(body.className, SELF_REPORT_CLASSES);
  const experience = pickFrom(body.experience, SELF_REPORT_EXPERIENCE);
  const email = str(body.email, 254);
  const pageUrl = str(body.pageUrl, 300);

  // Every statement must carry an integer on the scale; anything else is rejected.
  const rawAnswers = body.answers && typeof body.answers === 'object' ? (body.answers as Record<string, unknown>) : {};
  const answers: Record<string, number> = {};
  for (const q of SELF_REPORT_QUESTIONS) {
    const v = rawAnswers[q.id];
    if (typeof v !== 'number' || !Number.isInteger(v) || v < SCALE_MIN || v > SCALE_MAX) {
      return fail(400, 'Please answer every statement.');
    }
    answers[q.id] = v;
  }

  const reflections: Record<string, string> = {};
  for (const r of SELF_REPORT_REFLECTIONS) {
    reflections[r.id] = str(body[r.id], REFLECTION_MAX_CHARS);
    if (r.required && !reflections[r.id]) return fail(400, 'Please fill in all required fields.');
  }

  if (!studentName || !VALID_GRADES.has(grade) || !className || !experience || (email && !isValidEmail(email))) {
    return fail(400, 'Please fill in all required fields.');
  }

  const score = scoreSelfReport(answers);
  const submittedAt = new Date().toISOString();
  const record = {
    student_name: studentName,
    student_grade: grade,
    class_name: className,
    experience,
    email: email || null,
    answers,
    went_well: reflections.wentWell,
    improve: reflections.improve,
    for_coach: reflections.forCoach || null,
    score_content: score.areas.find((a) => a.id === 'content')?.percent ?? 0,
    score_style: score.areas.find((a) => a.id === 'style')?.percent ?? 0,
    score_strategy: score.areas.find((a) => a.id === 'strategy')?.percent ?? 0,
    score_overall: score.overall,
    page_url: pageUrl || null,
    status: 'new',
  };

  // Sink 1: Supabase. Best-effort: a missing table or missing env must not
  // lose the submission, so getSupabaseAdmin's throw is caught here too.
  let insertFailed = true;
  try {
    const { error } = await getSupabaseAdmin().from('self_reports').insert(record);
    if (error) {
      console.error('[SELF_REPORT_INSERT_FAILED] Supabase insert failed, submission lives in the email only:', error.message, JSON.stringify(record));
    } else {
      insertFailed = false;
    }
  } catch (err) {
    console.error('[SELF_REPORT_INSERT_FAILED] Supabase unavailable:', err, JSON.stringify(record));
  }

  // Sink 2: staff email with everything the coach needs to read it.
  const scaleLabel = (v: number) => SELF_REPORT_SCALE.find((s) => s.value === v)?.label ?? String(v);
  const scoreRows: Array<[string, string]> = score.areas.map((a) => [
    `${a.name} (${a.weight}%)`,
    `${a.average.toFixed(1)} / 5 · ${a.percent}% · ${describeBand(a.percent)}`,
  ]);
  const answerRows: Array<[string, string]> = SELF_REPORT_QUESTIONS.map((q) => [
    `${answers[q.id]} · ${scaleLabel(answers[q.id])}`,
    q.text,
  ]);
  const staffSent = await sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL || CONTACT_EMAIL,
    replyTo: email || undefined,
    subject: `Self-report: ${studentName} (${className}) · ${score.overall}/100`,
    html: emailShell(
      'Student self-report received',
      `${table([
        ['Student', studentName],
        ['Grade', grade],
        ['Class', className],
        ['Debating for', experience],
        ['Email', email || '—'],
        ['Overall (40/40/20)', `${score.overall} / 100`],
        ...scoreRows,
        ['Submitted', submittedAt],
      ])}
       <h2 style="color:#0d2240;font-size:16px;margin:28px 0 10px;">Every statement</h2>
       ${table(answerRows)}
       ${SELF_REPORT_REFLECTIONS.map((r) => (reflections[r.id] ? block(r.label, reflections[r.id]) : '')).join('')}
       <p style="color:#4c6787;font-size:12px;margin-top:24px;">
         Submitted on the private self-report page. Scores are the student's own ratings, weighted content 40 / style 40 / strategy 20.
       </p>`,
    ),
  });

  if (!staffSent && insertFailed) {
    console.error('[SELF_REPORT_NO_SINK] Submission had no working sink:', JSON.stringify(record));
  }

  return NextResponse.json({ ok: true, score });
}
