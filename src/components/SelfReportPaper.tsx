'use client';

// Client-only loader for the midterm check-in paper. The paper restores a
// draft from localStorage in its initial state, which only works if the
// component never renders on the server (otherwise the server's empty form
// and the browser's draft would disagree at hydration). The page is
// password-gated and noindex, so there is nothing to prerender anyway.

import dynamic from 'next/dynamic';

const SelfReportQuiz = dynamic(() => import('@/components/SelfReportQuiz').then((m) => m.SelfReportQuiz), {
  ssr: false,
  loading: () => (
    <p className="rounded-sm border border-navy-200 bg-white p-8 text-sm text-navy-500" role="status">
      Loading the paper…
    </p>
  ),
});

export function SelfReportPaper() {
  return <SelfReportQuiz />;
}
