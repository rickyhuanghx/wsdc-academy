import type { Metadata } from 'next';
import { SelfReportGate } from '@/components/SelfReportGate';
import { SelfReportQuiz } from '@/components/SelfReportQuiz';
import { hasSelfReportAccess, isSelfReportConfigured } from '@/lib/self-report-auth';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

// Private student self-report quiz, reached by direct link plus a password.
// Sits under /for so it inherits the layout's noindex/nofollow metadata and
// the X-Robots-Tag header from next.config.ts; absent from sitemap.ts,
// llms.txt and every menu. The cookie read makes this route dynamic, so the
// quiz is never in any static HTML a crawler could fetch without the password.
// force-dynamic is belt and braces: without it, a build with no password set
// would short-circuit before cookies() and bake "Not open yet" into static HTML.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: `Self-report quiz | ${SITE_NAME}` },
  description: 'A private self-assessment for current students.',
};

export default async function SelfReportPage() {
  const unlocked = await hasSelfReportAccess();
  const configured = isSelfReportConfigured();

  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">
            For current students
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            How is your debating going?
          </h1>
          <p className="mt-3 leading-relaxed text-navy-600">
            Fifteen quick statements and three short questions. Rate yourself honestly: there are no right
            answers, and nobody is marked on this. Your coach uses it to compare how you see your own
            debating with what they see in class, and to plan what to work on with you next.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-navy-500">About ten minutes. Best done by the student, not a parent.</p>
        </header>

        {!configured ? (
          <div className="rounded-sm border border-navy-200 bg-white p-8" role="status">
            <h2 className="font-display text-xl font-semibold text-navy-900">Not open yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              This page has not been set up. If you were sent here by your coach, email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-signal-500 underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        ) : unlocked ? (
          <SelfReportQuiz />
        ) : (
          <SelfReportGate />
        )}
      </div>
    </section>
  );
}
