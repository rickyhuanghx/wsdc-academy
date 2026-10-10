import Link from 'next/link';
import { notFound } from 'next/navigation';
import { saveMarks } from '@/app/admin/actions';
import { AdminShell, AdminUnlock } from '@/components/AdminShell';
import { hasAdminAccess } from '@/lib/admin-auth';
import {
  CORE_SKILLS,
  MOTION_PROMPTS,
  QUIZ_QUESTIONS,
  RATING_SCALE,
  REFLECTIONS,
  SUPPORTING_SKILLS,
} from '@/lib/self-report';
import { EXPLAIN_GUIDE, MOTION_RUBRIC, QUIZ_KEY, QUIZ_TOTAL } from '@/lib/self-report-key';
import { SELF_REPORT_STATUSES, getSelfReport, isUuid, skillGaps, sumMarks } from '@/lib/self-reports-admin';

// One student's paper, laid out for marking: the key beside each quiz
// answer, the 2-mark guide under each Explain line, the rubric under each
// Part C answer, and a form that saves the coach's marks back to Supabase.

export const dynamic = 'force-dynamic';

const markOptions = ['', '0', '1', '2'];
const selectClass = 'rounded-sm border border-navy-200 bg-white px-2 py-1 font-mono text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const verdictClass: Record<string, string> = {
  secure: 'bg-white text-navy-700 border-navy-200',
  overconfident: 'bg-signal-50 text-signal-600 border-signal-200',
  underconfident: 'bg-navy-50 text-navy-700 border-navy-200',
  reteach: 'bg-signal-50 text-signal-600 border-signal-200',
  unchecked: 'bg-white text-navy-500 border-navy-200',
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-navy-200 bg-white p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-navy-900">{title}</h2>
      {children}
    </section>
  );
}

function Answer({ text }: { text: string | undefined }) {
  return (
    <div className="mt-2 whitespace-pre-wrap border-l-2 border-signal-500 pl-3 text-sm leading-relaxed text-navy-900">
      {text?.trim() ? text : <span className="italic text-navy-500">(blank)</span>}
    </div>
  );
}

export default async function SelfReportDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  if (!(await hasAdminAccess())) return <AdminUnlock />;
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const row = await getSelfReport(id);
  if (!row) notFound();
  const { saved } = await searchParams;

  const gaps = skillGaps(row);
  const explainTotal = sumMarks(row.explain_marks);
  const motionTotal = sumMarks(row.motion_marks);
  const quiz = row.quiz_score ?? 0;
  const grand = explainTotal !== null && motionTotal !== null ? quiz + explainTotal + motionTotal : null;
  const ratingLabel = (v: number) => RATING_SCALE.find((s) => s.value === v)?.label ?? '';

  return (
    <AdminShell title={row.student_name}>
      <p className="-mt-4 mb-6 text-sm text-navy-600">
        <Link href="/admin/self-reports" className="underline underline-offset-4 hover:text-signal-500">
          All submissions
        </Link>
        {' · '}
        {row.class_name ?? 'Class not given'} · {row.student_grade ?? 'Grade not given'} ·{' '}
        {new Date(row.created_at).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' })} ET
        {row.email && (
          <>
            {' · '}
            <a href={`mailto:${row.email}`} className="underline underline-offset-4 hover:text-signal-500">
              {row.email}
            </a>
          </>
        )}
      </p>

      {saved && (
        <p className="mb-6 rounded-sm border border-navy-200 bg-white p-3 text-sm text-navy-700" role="status">
          Marks saved.
        </p>
      )}

      <form action={saveMarks} className="space-y-8">
        <input type="hidden" name="id" value={row.id} />

        {/* Score strip */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ['Quiz', `${quiz}/${QUIZ_TOTAL}`, 'auto-marked'],
            ['Explain lines', explainTotal === null ? '—' : `${explainTotal}/18`, 'your marks'],
            ['Motion analysis', motionTotal === null ? '—' : `${motionTotal}/12`, motionTotal === null ? 'your marks' : motionTotal <= 4 ? 'building foundations' : motionTotal <= 8 ? 'developing' : 'secure'],
            ['Total', grand === null ? '—' : `${grand}/46`, grand === null ? 'after marking' : ''],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-sm border border-navy-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-navy-500">{label}</p>
              <p className="mt-1 font-display text-3xl font-bold text-signal-500">{value}</p>
              {note && <p className="text-xs text-navy-500">{note}</p>}
            </div>
          ))}
        </div>

        {/* Reading the results */}
        <Card title="Rating against evidence">
          <p className="mt-2 text-sm text-navy-600">
            Each core skill&apos;s self-rating next to the quiz questions that check it and your Explain mark once
            entered. The gap says what to do in the second half of term.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-navy-500">
                <tr>
                  <th className="py-2 pr-4">Skill</th>
                  <th className="py-2 pr-4">Rated</th>
                  <th className="py-2 pr-4">Quiz checks</th>
                  <th className="py-2 pr-4">Explain</th>
                  <th className="py-2">Read</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((g) => (
                  <tr key={g.skillId} className="border-t border-navy-100">
                    <td className="py-2 pr-4 font-semibold text-navy-900">{g.label}</td>
                    <td className="py-2 pr-4 font-mono">{g.rating}</td>
                    <td className="py-2 pr-4 font-mono text-navy-700">
                      {g.checks.length ? `${g.correct}/${g.checks.length} (Q${g.checks.join(', Q')})` : '—'}
                    </td>
                    <td className="py-2 pr-4 font-mono text-navy-700">{g.explainMark === null ? '—' : `${g.explainMark}/2`}</td>
                    <td className="py-2">
                      <span className={`rounded-sm border px-2 py-0.5 text-xs ${verdictClass[g.verdict]}`}>{g.advice}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Part A */}
        <Card title="Part A · Core skills">
          <ol className="mt-4 space-y-6">
            {CORE_SKILLS.map((s, i) => (
              <li key={s.id} className="border-t border-navy-100 pt-5 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">
                    <span className="mr-2 font-mono text-signal-500">A{i + 1}</span>
                    {s.name}
                  </p>
                  <p className="text-xs text-navy-600">
                    Rated <span className="font-mono font-semibold text-navy-900">{row.ratings[s.id]}</span> · {ratingLabel(row.ratings[s.id])}
                  </p>
                </div>
                <p className="mt-1 text-xs text-navy-500">{s.explain}</p>
                <Answer text={row.explains[s.id]} />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-navy-500">
                    <span className="font-semibold text-navy-700">2 marks:</span> {EXPLAIN_GUIDE[s.id]}
                  </p>
                  <label className="text-xs text-navy-700">
                    Mark{' '}
                    <select name={`explain_${s.id}`} defaultValue={row.explain_marks?.[s.id]?.toString() ?? ''} className={selectClass}>
                      {markOptions.map((o) => (
                        <option key={o} value={o}>
                          {o === '' ? '–' : o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Part A · Supporting skills">
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {SUPPORTING_SKILLS.map((s, i) => (
              <li key={s.id} className="flex gap-3 rounded-sm border border-navy-100 p-3 text-sm">
                <span className="font-mono text-lg font-bold text-signal-500">{row.ratings[s.id]}</span>
                <span className="text-navy-700">
                  <span className="mr-1 font-mono text-xs text-navy-500">A{CORE_SKILLS.length + i + 1}</span>
                  {s.text}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Part B */}
        <Card title={`Part B · Quiz: ${quiz}/${QUIZ_TOTAL}`}>
          <ol className="mt-4 space-y-3">
            {QUIZ_QUESTIONS.map((q, i) => {
              const given = row.quiz_answers[q.id];
              const key = QUIZ_KEY[q.id];
              const ok = row.quiz_correct[q.id];
              return (
                <li key={q.id} className={`rounded-sm border p-3 text-sm ${ok ? 'border-navy-100' : 'border-signal-200 bg-signal-50/40'}`}>
                  <p className="text-navy-900">
                    <span className={`mr-2 font-mono font-semibold ${ok ? 'text-navy-500' : 'text-signal-500'}`}>
                      Q{i + 1} {ok ? '✓' : '✗'}
                    </span>
                    {q.text}
                    <span className="ml-2 font-mono text-xs text-navy-500">{key.skill}</span>
                  </p>
                  <p className="mt-1 text-navy-700">
                    Answered <span className="font-mono font-semibold">{given}</span>: {q.options.find((o) => o.key === given)?.text}
                  </p>
                  {!ok && (
                    <p className="mt-1 text-xs text-navy-600">
                      Key <span className="font-mono font-semibold">{key.answer}</span>: {key.why}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Part C */}
        <Card title="Part C · Motion analysis">
          <p className="mt-2 text-sm text-navy-700">
            <span className="font-semibold">Motion:</span> {row.motion}
          </p>
          <ol className="mt-4 space-y-6">
            {MOTION_PROMPTS.map((p) => (
              <li key={p.id} className="border-t border-navy-100 pt-5">
                <p className="text-sm font-semibold text-navy-900">
                  <span className="mr-2 font-mono text-signal-500">{p.id.toUpperCase()}</span>
                  {p.name}
                </p>
                <p className="mt-1 text-xs text-navy-500">{p.text}</p>
                <Answer text={row.motion_answers[p.id]} />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-navy-500">
                    <span className="font-semibold text-navy-700">1:</span> {MOTION_RUBRIC[p.id].one} ·{' '}
                    <span className="font-semibold text-navy-700">2:</span> {MOTION_RUBRIC[p.id].two}
                  </p>
                  <label className="text-xs text-navy-700">
                    Mark{' '}
                    <select name={`motion_${p.id}`} defaultValue={row.motion_marks?.[p.id]?.toString() ?? ''} className={selectClass}>
                      {markOptions.map((o) => (
                        <option key={o} value={o}>
                          {o === '' ? '–' : o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {/* Reflection */}
        <Card title="Open reflection">
          <dl className="mt-4 space-y-4">
            {REFLECTIONS.map((r) => (
              <div key={r.id}>
                <dt className="text-sm font-semibold text-navy-900">{r.label}</dt>
                <dd>
                  <Answer text={row.reflections[r.id]} />
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Coach notes + save */}
        <Card title="Coach notes">
          <textarea
            name="coach_notes"
            rows={4}
            defaultValue={row.coach_notes ?? ''}
            placeholder="What to work on with this student in the second half of term."
            className="mt-4 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none"
          />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="text-sm text-navy-700">
              Status{' '}
              <select name="status" defaultValue={row.status} className={selectClass}>
                {SELF_REPORT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600">
              Save marks
            </button>
          </div>
        </Card>
      </form>
    </AdminShell>
  );
}
