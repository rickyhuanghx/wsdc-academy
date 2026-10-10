import Link from 'next/link';
import { AdminShell, AdminUnlock } from '@/components/AdminShell';
import { hasAdminAccess } from '@/lib/admin-auth';
import { QUIZ_TOTAL } from '@/lib/self-report-key';
import { listSelfReports, sumMarks, type SelfReportSummary } from '@/lib/self-reports-admin';

// Coach desk: every midterm check-in submission, newest first. Reads
// Supabase on each request (force-dynamic) so a paper shows up the moment
// it is sent. Click a row for the full paper and the marking form.

export const dynamic = 'force-dynamic';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });
}

function marks(m: Record<string, number> | null, total: number): string {
  const sum = sumMarks(m);
  return sum === null ? '—' : `${sum}/${total}`;
}

const statusClass: Record<string, string> = {
  new: 'bg-signal-50 text-signal-600 border-signal-200',
  marked: 'bg-navy-50 text-navy-700 border-navy-200',
  discussed: 'bg-white text-navy-500 border-navy-200',
};

export default async function SelfReportsDesk({ searchParams }: { searchParams: Promise<{ error?: string; class?: string }> }) {
  const sp = await searchParams;
  if (!(await hasAdminAccess())) return <AdminUnlock error={sp.error} />;

  let rows: SelfReportSummary[] = [];
  let loadError = '';
  try {
    rows = await listSelfReports();
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Could not load submissions.';
  }

  const classes = Array.from(new Set(rows.map((r) => r.class_name).filter(Boolean))) as string[];
  const filter = sp.class && classes.includes(sp.class) ? sp.class : '';
  const shown = filter ? rows.filter((r) => r.class_name === filter) : rows;
  const unmarked = rows.filter((r) => r.status === 'new').length;

  return (
    <AdminShell title="Midterm check-ins">
      {loadError ? (
        <div className="rounded-sm border border-signal-500 bg-signal-50 p-5 text-sm text-signal-600" role="alert">
          <p className="font-semibold">Could not read the submissions table.</p>
          <p className="mt-1">{loadError}</p>
          <p className="mt-3 text-navy-600">
            If this says the relation does not exist, run the self_reports block from supabase/schema.sql in the
            Supabase SQL Editor. If it mentions env vars, set NEXT_PUBLIC_SUPABASE_URL and
            SUPABASE_SERVICE_ROLE_KEY on the host.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-navy-600">
              <span className="font-mono font-semibold text-navy-900">{rows.length}</span> submission{rows.length === 1 ? '' : 's'}
              {unmarked > 0 && (
                <>
                  , <span className="font-mono font-semibold text-signal-500">{unmarked}</span> not yet marked
                </>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {classes.length > 1 && (
                <nav className="flex flex-wrap gap-1.5" aria-label="Filter by class">
                  <Link
                    href="/admin/self-reports"
                    className={`rounded-sm border px-2.5 py-1 text-xs ${!filter ? 'border-signal-500 bg-signal-50 text-navy-900' : 'border-navy-200 text-navy-600 hover:border-navy-400'}`}
                  >
                    All
                  </Link>
                  {classes.map((c) => (
                    <Link
                      key={c}
                      href={`/admin/self-reports?class=${encodeURIComponent(c)}`}
                      className={`rounded-sm border px-2.5 py-1 text-xs ${filter === c ? 'border-signal-500 bg-signal-50 text-navy-900' : 'border-navy-200 text-navy-600 hover:border-navy-400'}`}
                    >
                      {c}
                    </Link>
                  ))}
                </nav>
              )}
              {/* A route handler, not a page: Link would try to prefetch a download. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/admin/self-reports/export" download className="font-semibold text-navy-700 underline underline-offset-4 hover:text-signal-500">
                Download CSV
              </a>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="rounded-sm border border-navy-200 bg-white p-8 text-sm text-navy-600">
              No submissions yet. Papers appear here the moment a student presses Send.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-sm border border-navy-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-navy-50 text-left text-xs uppercase tracking-wide text-navy-500">
                  <tr>
                    <th className="px-4 py-3">Submitted (ET)</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3 text-right">Quiz</th>
                    <th className="px-4 py-3 text-right">Explain</th>
                    <th className="px-4 py-3 text-right">Part C</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.id} className="border-t border-navy-100 hover:bg-cream">
                      <td className="whitespace-nowrap px-4 py-3 text-navy-600">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/self-reports/${r.id}`} className="font-semibold text-navy-900 underline underline-offset-4 hover:text-signal-500">
                          {r.student_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-navy-600">{r.class_name ?? '—'}</td>
                      <td className="px-4 py-3 text-navy-600">{r.student_grade ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-mono">{r.quiz_score ?? '—'}/{r.quiz_total ?? QUIZ_TOTAL}</td>
                      <td className="px-4 py-3 text-right font-mono">{marks(r.explain_marks, 18)}</td>
                      <td className="px-4 py-3 text-right font-mono">{marks(r.motion_marks, 12)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-sm border px-2 py-0.5 text-xs font-semibold ${statusClass[r.status] ?? statusClass.new}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
