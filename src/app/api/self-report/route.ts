// Midterm check-in submissions (src/components/SelfReportQuiz.tsx).
//
// No password: the unlisted URL is the only gate, so the honeypot and the
// per-IP rate limit are what keep junk out. The quiz is graded HERE against src/lib/self-report-key.ts; the student never receives the
// key, the score, or per-question correctness. Two sinks, both attempted:
//   1. Supabase table `self_reports` (see supabase/schema.sql): the durable
//      record, with the raw answers and the computed quiz result.
//   2. A staff email to ADMIN_NOTIFICATION_EMAIL with everything laid out for
//      marking: ratings, Explain lines beside the 2-mark guide, the quiz with
//      the key, and the Part C answers beside the rubric.
// If NEITHER sink accepts the paper the route returns 500, so the student is
// told to try again instead of being thanked for answers that went nowhere
// (their draft stays in the browser until a submit succeeds).

import { NextResponse } from 'next/server';
import { GRADE_LEVELS } from '@/data/programs';
import { HONEYPOT_FIELD, getClientIp, isRateLimited, isValidEmail, sendEmail } from '@/lib/leads';
import {
  ALL_SKILLS,
  CORE_SKILLS,
  EXPLAIN_MAX_CHARS,
  MOTIONS,
  MOTION_ANSWER_MAX_CHARS,
  MOTION_PROMPTS,
  OPTION_KEYS,
  QUIZ_QUESTIONS,
  RATING_MAX,
  RATING_MIN,
  RATING_SCALE,
  REFLECTIONS,
  REFLECTION_MAX_CHARS,
  SELF_REPORT_CLASSES,
  SUPPORTING_SKILLS,
  type OptionKey,
} from '@/lib/self-report';
import { EXPLAIN_GUIDE, MOTION_RUBRIC, QUIZ_KEY, gradeQuiz } from '@/lib/self-report-key';
import { getSupabaseAdmin } from '@/lib/supabase';
import { CONTACT_EMAIL } from '@/lib/site';

export const runtime = 'nodejs';

const VALID_GRADES = new Set<string>(GRADE_LEVELS);

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function pickFrom(v: unknown, allowed: readonly string[]): string {
  const value = str(v, 300);
  return allowed.includes(value) ? value : '';
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
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
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e7ebf1;">
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
          <td style="padding:8px 12px;border-bottom:1px solid #e7ebf1;color:#4c6787;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e7ebf1;color:#0d2240;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;">${body}</table>`;
}

function h2(text: string): string {
  return `<h2 style="color:#0d2240;font-size:17px;margin:32px 0 10px;border-top:2px solid #0d2240;padding-top:14px;">${escapeHtml(text)}</h2>`;
}

function answerBlock(title: string, prompt: string, answer: string, guide?: string): string {
  return `
    <h3 style="color:#0d2240;font-size:14px;margin:20px 0 4px;">${escapeHtml(title)}</h3>
    <p style="color:#4c6787;font-size:12px;line-height:1.5;margin:0 0 8px;">${escapeHtml(prompt)}</p>
    <div style="border-left:3px solid #c8102e;padding:4px 14px;color:#0d2240;font-size:14px;line-height:1.65;">
      <p style="margin:0;">${answer ? paragraphs(answer) : '<em style="color:#4c6787;">(blank)</em>'}</p>
    </div>
    ${guide ? `<p style="color:#4c6787;font-size:12px;line-height:1.5;margin:8px 0 0;"><strong>2 marks:</strong> ${escapeHtml(guide)}</p>` : ''}`;
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

  if (isRateLimited(getClientIp(req), 'self-report')) {
    return fail(429, 'Too many requests. Please try again in a minute.');
  }

  const studentName = str(body.studentName, 200);
  const grade = str(body.grade, 40);
  const className = pickFrom(body.className, SELF_REPORT_CLASSES);
  const email = str(body.email, 254);
  const pageUrl = str(body.pageUrl, 300);
  if (!studentName || !VALID_GRADES.has(grade) || !className || (email && !isValidEmail(email))) {
    return fail(400, 'Please fill in your name, grade and class.');
  }

  // Part A: every skill rated 1..4; every core skill explained.
  const rawRatings = obj(body.ratings);
  const ratings: Record<string, number> = {};
  for (const s of ALL_SKILLS) {
    const v = rawRatings[s.id];
    if (typeof v !== 'number' || !Number.isInteger(v) || v < RATING_MIN || v > RATING_MAX) {
      return fail(400, 'Please rate every skill in Part A.');
    }
    ratings[s.id] = v;
  }
  const rawExplains = obj(body.explains);
  const explains: Record<string, string> = {};
  for (const s of CORE_SKILLS) {
    explains[s.id] = str(rawExplains[s.id], EXPLAIN_MAX_CHARS);
    if (!explains[s.id]) return fail(400, 'Please write an Explain line for each core skill in Part A.');
  }

  // Part B: one option per question.
  const rawQuiz = obj(body.quiz);
  const quiz: Record<string, OptionKey> = {};
  for (const q of QUIZ_QUESTIONS) {
    const v = pickFrom(rawQuiz[q.id], OPTION_KEYS) as OptionKey | '';
    if (!v) return fail(400, 'Please answer every quiz question in Part B.');
    quiz[q.id] = v;
  }
  const result = gradeQuiz(quiz);

  // Part C: one motion, every prompt answered.
  const motion = pickFrom(body.motion, MOTIONS);
  if (!motion) return fail(400, 'Please choose a motion in Part C.');
  const rawMotionAnswers = obj(body.motionAnswers);
  const motionAnswers: Record<string, string> = {};
  for (const p of MOTION_PROMPTS) {
    motionAnswers[p.id] = str(rawMotionAnswers[p.id], MOTION_ANSWER_MAX_CHARS);
    if (!motionAnswers[p.id]) return fail(400, 'Please answer every prompt in Part C.');
  }

  // Reflection: optional.
  const rawReflections = obj(body.reflections);
  const reflections: Record<string, string> = {};
  for (const r of REFLECTIONS) {
    const v = str(rawReflections[r.id], REFLECTION_MAX_CHARS);
    if (v) reflections[r.id] = v;
  }

  const submittedAt = new Date().toISOString();
  const record = {
    student_name: studentName,
    student_grade: grade,
    class_name: className,
    email: email || null,
    ratings,
    explains,
    quiz_answers: quiz,
    quiz_correct: result.correct,
    quiz_score: result.score,
    quiz_total: result.total,
    motion,
    motion_answers: motionAnswers,
    reflections,
    page_url: pageUrl || null,
    status: 'new',
  };

  // Sink 1: Supabase, the durable record.
  let stored = false;
  try {
    const { error } = await getSupabaseAdmin().from('self_reports').insert(record);
    if (error) {
      console.error('[SELF_REPORT_INSERT_FAILED] Supabase insert failed:', error.message, JSON.stringify(record));
    } else {
      stored = true;
    }
  } catch (err) {
    console.error('[SELF_REPORT_INSERT_FAILED] Supabase unavailable:', err, JSON.stringify(record));
  }

  // Sink 2: staff email, laid out for marking.
  const ratingLabel = (v: number) => RATING_SCALE.find((s) => s.value === v)?.label ?? String(v);
  const coreRows: Array<[string, string]> = CORE_SKILLS.map((s, i) => [`A${i + 1} ${s.name}`, `${ratings[s.id]} · ${ratingLabel(ratings[s.id])}`]);
  const supportRows: Array<[string, string]> = SUPPORTING_SKILLS.map((s, i) => [`A${CORE_SKILLS.length + i + 1}`, `${ratings[s.id]} · ${s.text}`]);
  const quizRows: Array<[string, string]> = QUIZ_QUESTIONS.map((q, i) => {
    const given = quiz[q.id];
    const key = QUIZ_KEY[q.id];
    const mark = result.correct[q.id] ? '✓' : `✗ (key ${key.answer})`;
    return [`Q${i + 1} ${mark}`, `${given}: ${q.options.find((o) => o.key === given)?.text ?? ''} · ${key.skill}`];
  });

  const staffSent = await sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL || CONTACT_EMAIL,
    replyTo: email || undefined,
    subject: `Midterm check-in: ${studentName} (${className}) · quiz ${result.score}/${result.total}`,
    html: emailShell(
      'Midterm check-in received',
      `${table([
        ['Student', studentName],
        ['Grade', grade],
        ['Class', className],
        ['Email', email || '—'],
        ['Quiz (auto-marked)', `${result.score} / ${result.total}`],
        ['Explain lines (/18) and Part C (/12)', 'To mark by hand, guides below'],
        ['Submitted', submittedAt],
      ])}
       ${h2('Part A · Core skills: rating and Explain line')}
       ${table(coreRows)}
       ${CORE_SKILLS.map((s, i) => answerBlock(`A${i + 1} ${s.name} (rated ${ratings[s.id]})`, s.explain ?? '', explains[s.id], EXPLAIN_GUIDE[s.id])).join('')}
       ${h2('Part A · Supporting skills: rating only')}
       ${table(supportRows)}
       ${h2(`Part B · Quiz: ${result.score} / ${result.total}`)}
       ${table(quizRows)}
       ${h2('Part C · Motion analysis')}
       <p style="color:#0d2240;font-size:14px;margin:0 0 6px;"><strong>Motion:</strong> ${escapeHtml(motion)}</p>
       ${MOTION_PROMPTS.map((p) => answerBlock(`${p.id.toUpperCase()} ${p.name}`, p.text, motionAnswers[p.id], `${MOTION_RUBRIC[p.id].two} (1 mark: ${MOTION_RUBRIC[p.id].one})`)).join('')}
       <p style="color:#4c6787;font-size:12px;margin-top:12px;">Part C bands: 0–4 building foundations, 5–8 developing, 9–12 secure.</p>
       ${h2('Open reflection')}
       ${REFLECTIONS.map((r) => answerBlock(r.label, '', reflections[r.id] ?? '')).join('')}
       <p style="color:#4c6787;font-size:12px;margin-top:24px;">
         Submitted on the private midterm check-in page. The student saw no scores and no key. Compare each rating with its Explain line and the quiz questions that check it: rated 3–4 but wrong = coach first; rated 1–2 but right = give speaking reps.
       </p>`,
    ),
  });

  if (!stored && !staffSent) {
    console.error('[SELF_REPORT_NO_SINK] Submission had no working sink:', JSON.stringify(record));
    return fail(500, 'We could not save your answers just now. Nothing is lost: wait a minute and press Send again.');
  }

  return NextResponse.json({ ok: true });
}
