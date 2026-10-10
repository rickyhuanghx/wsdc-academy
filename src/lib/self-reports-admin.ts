// Coach-desk data access for midterm check-in submissions (/admin/self-reports).
//
// Reads and updates the Supabase `self_reports` table with the service-role
// client, so this is server-only. Also holds the small analysis the desk
// shows: each core skill's self-rating set against the quiz questions that
// check it, following the "Reading the results" grid in the question bank.

import { CORE_SKILLS, QUIZ_QUESTIONS, type OptionKey } from '@/lib/self-report';
import { QUIZ_KEY } from '@/lib/self-report-key';
import { getSupabaseAdmin } from '@/lib/supabase';

export type SelfReportStatus = 'new' | 'marked' | 'discussed';
export const SELF_REPORT_STATUSES: readonly SelfReportStatus[] = ['new', 'marked', 'discussed'];

export interface SelfReportRow {
  id: string;
  created_at: string;
  student_name: string;
  student_grade: string | null;
  class_name: string | null;
  email: string | null;
  ratings: Record<string, number>;
  explains: Record<string, string>;
  quiz_answers: Record<string, OptionKey>;
  quiz_correct: Record<string, boolean>;
  quiz_score: number | null;
  quiz_total: number | null;
  motion: string | null;
  motion_answers: Record<string, string>;
  reflections: Record<string, string>;
  page_url: string | null;
  explain_marks: Record<string, number> | null;
  motion_marks: Record<string, number> | null;
  coach_notes: string | null;
  status: SelfReportStatus;
}

export type SelfReportSummary = Pick<
  SelfReportRow,
  'id' | 'created_at' | 'student_name' | 'student_grade' | 'class_name' | 'quiz_score' | 'quiz_total' | 'explain_marks' | 'motion_marks' | 'status'
>;

const SUMMARY_COLUMNS =
  'id, created_at, student_name, student_grade, class_name, quiz_score, quiz_total, explain_marks, motion_marks, status';

export async function listSelfReports(): Promise<SelfReportSummary[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('self_reports')
    .select(SUMMARY_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SelfReportSummary[];
}

export async function listSelfReportsFull(): Promise<SelfReportRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('self_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SelfReportRow[];
}

export async function getSelfReport(id: string): Promise<SelfReportRow | null> {
  const { data, error } = await getSupabaseAdmin().from('self_reports').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as SelfReportRow | null) ?? null;
}

export async function updateSelfReportMarks(
  id: string,
  patch: {
    explain_marks: Record<string, number>;
    motion_marks: Record<string, number>;
    coach_notes: string | null;
    status: SelfReportStatus;
  },
): Promise<void> {
  const { error } = await getSupabaseAdmin().from('self_reports').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

/** Sum of 0..2 marks, or null when nothing has been entered yet. */
export function sumMarks(marks: Record<string, number> | null | undefined): number | null {
  if (!marks) return null;
  const values = Object.values(marks).filter((v) => typeof v === 'number');
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0);
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---------------------------------------------------------------------------
// Rating vs evidence, per core skill
// ---------------------------------------------------------------------------

export interface SkillGap {
  skillId: string;
  label: string;
  rating: number;
  /** Quiz questions that check this skill, as 1-based numbers. */
  checks: number[];
  correct: number;
  explainMark: number | null;
  verdict: 'secure' | 'overconfident' | 'underconfident' | 'reteach' | 'unchecked';
  advice: string;
}

/** Which quiz questions (1-based) check each Part A skill, derived from the key's skill tags. */
function checksFor(skillLabel: string): number[] {
  return QUIZ_QUESTIONS.map((q, i) => (QUIZ_KEY[q.id].skill.split(',').map((s) => s.trim()).includes(skillLabel) ? i + 1 : 0)).filter(Boolean);
}

export function skillGaps(row: SelfReportRow): SkillGap[] {
  return CORE_SKILLS.map((s, i) => {
    const label = `A${i + 1}`;
    const rating = row.ratings[s.id] ?? 0;
    const checks = checksFor(label);
    const correct = checks.filter((n) => row.quiz_correct[QUIZ_QUESTIONS[n - 1].id]).length;
    const explainMark = row.explain_marks?.[s.id] ?? null;

    // Evidence = quiz checks where they exist, plus the Explain mark once entered.
    const quizWrong = checks.length > 0 && correct < checks.length;
    const explainWeak = explainMark !== null && explainMark < 2;
    const hasEvidence = checks.length > 0 || explainMark !== null;
    const evidenceBad = quizWrong || explainWeak;

    let verdict: SkillGap['verdict'];
    let advice: string;
    if (!hasEvidence) {
      verdict = 'unchecked';
      advice = 'No quiz check for this skill: judge from the Explain line.';
    } else if (rating >= 3 && !evidenceBad) {
      verdict = 'secure';
      advice = 'Secure: stretch them (harder motions, judge a round, lead prep).';
    } else if (rating >= 3) {
      verdict = 'overconfident';
      advice = "Overconfident: coach first, they won't ask for help.";
    } else if (!evidenceBad) {
      verdict = 'underconfident';
      advice = 'Underconfident: give speaking reps and say what they got right.';
    } else {
      verdict = 'reteach';
      advice = 'Not yet taught: reteach in a small group.';
    }
    return { skillId: s.id, label: `${label} ${s.name}`, rating, checks, correct, explainMark, verdict, advice };
  });
}
