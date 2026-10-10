import type { Metadata } from 'next';
import { SelfReportPaper } from '@/components/SelfReportPaper';
import { PAPER_TITLE } from '@/lib/self-report';
import { SITE_NAME } from '@/lib/site';

// Private midterm check-in paper, reached by direct link only. No password:
// the owner wants a URL that just works. Sits under /for so it inherits the
// layout's noindex/nofollow metadata and the X-Robots-Tag header from
// next.config.ts; absent from sitemap.ts, llms.txt and every menu, and
// nothing on the site links here. The paper itself is client-only (see
// SelfReportPaper.tsx), so the questions are not in the static HTML either.

export const metadata: Metadata = {
  title: { absolute: `${PAPER_TITLE} | ${SITE_NAME}` },
  description: 'A private check-in paper for current students.',
};

export default function SelfReportPage() {
  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">
            For current students
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {PAPER_TITLE}
          </h1>
          <p className="mt-3 leading-relaxed text-navy-600">
            Everyone in the class sits the same 30-minute paper: you rate each core skill and prove it in
            a line, then a short quiz and a motion task test the same skills. Nobody is ranked on this. It
            shows your coach exactly where to coach you next.
          </p>
          <ol className="mt-4 space-y-1 text-sm text-navy-600">
            <li><span className="mr-2 font-mono font-semibold text-signal-500">A</span>Skills self-report, about 10 minutes</li>
            <li><span className="mr-2 font-mono font-semibold text-signal-500">B</span>Quiz, 16 questions, about 10 minutes</li>
            <li><span className="mr-2 font-mono font-semibold text-signal-500">C</span>Motion analysis, one motion, six prompts, about 10 minutes</li>
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-navy-500">Best done by the student, in one sitting, without looking anything up.</p>
        </header>

        <SelfReportPaper />
      </div>
    </section>
  );
}
