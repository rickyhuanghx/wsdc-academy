// CSV export of every midterm check-in, for a spreadsheet. Open like the
// rest of the coach desk (unlisted URL, no login). One row per submission; jsonb columns
// are flattened to one column per id so the sheet is usable as is.

import { ALL_SKILLS, CORE_SKILLS, MOTION_PROMPTS, QUIZ_QUESTIONS, REFLECTIONS } from '@/lib/self-report';
import { QUIZ_KEY } from '@/lib/self-report-key';
import { listSelfReportsFull, sumMarks } from '@/lib/self-reports-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cell(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  let rows;
  try {
    rows = await listSelfReportsFull();
  } catch (err) {
    return new Response(`Could not read self_reports: ${err instanceof Error ? err.message : 'unknown error'}`, { status: 500 });
  }

  const header = [
    'submitted_utc', 'id', 'student', 'grade', 'class', 'email', 'status',
    'quiz_score', 'quiz_total', 'explain_total', 'motion_total', 'grand_total',
    ...ALL_SKILLS.map((s) => `rating_${s.id}`),
    ...CORE_SKILLS.map((s) => `explain_${s.id}`),
    ...CORE_SKILLS.map((s) => `explain_mark_${s.id}`),
    ...QUIZ_QUESTIONS.map((q) => `${q.id}_answer`),
    ...QUIZ_QUESTIONS.map((q) => `${q.id}_correct`),
    'motion',
    ...MOTION_PROMPTS.map((p) => `${p.id}_answer`),
    ...MOTION_PROMPTS.map((p) => `${p.id}_mark`),
    ...REFLECTIONS.map((r) => `reflection_${r.id}`),
    'coach_notes',
  ];

  const lines = rows.map((r) => {
    const explainTotal = sumMarks(r.explain_marks);
    const motionTotal = sumMarks(r.motion_marks);
    const grand = explainTotal !== null && motionTotal !== null ? (r.quiz_score ?? 0) + explainTotal + motionTotal : '';
    return [
      r.created_at, r.id, r.student_name, r.student_grade, r.class_name, r.email, r.status,
      r.quiz_score, r.quiz_total, explainTotal ?? '', motionTotal ?? '', grand,
      ...ALL_SKILLS.map((s) => r.ratings?.[s.id] ?? ''),
      ...CORE_SKILLS.map((s) => r.explains?.[s.id] ?? ''),
      ...CORE_SKILLS.map((s) => r.explain_marks?.[s.id] ?? ''),
      ...QUIZ_QUESTIONS.map((q) => r.quiz_answers?.[q.id] ?? ''),
      ...QUIZ_QUESTIONS.map((q) => (r.quiz_correct?.[q.id] === undefined ? '' : r.quiz_correct[q.id] ? 1 : 0)),
      r.motion,
      ...MOTION_PROMPTS.map((p) => r.motion_answers?.[p.id] ?? ''),
      ...MOTION_PROMPTS.map((p) => r.motion_marks?.[p.id] ?? ''),
      ...REFLECTIONS.map((x) => r.reflections?.[x.id] ?? ''),
      r.coach_notes,
    ].map(cell).join(',');
  });

  // Key row at the bottom so the sheet is self-explaining.
  const keyLine = ['KEY', '', '', '', '', '', '', '', '', '', '', '',
    ...ALL_SKILLS.map(() => ''), ...CORE_SKILLS.map(() => ''), ...CORE_SKILLS.map(() => ''),
    ...QUIZ_QUESTIONS.map((q) => QUIZ_KEY[q.id].answer), ...QUIZ_QUESTIONS.map(() => ''),
    '', ...MOTION_PROMPTS.map(() => ''), ...MOTION_PROMPTS.map(() => ''), ...REFLECTIONS.map(() => ''), ''].map(cell).join(',');

  const csv = '﻿' + [header.join(','), ...lines, keyLine].join('\r\n') + '\r\n';
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="midterm-check-ins-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
