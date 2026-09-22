import type { Metadata } from 'next';
import { CoachingRequestForm } from '@/components/CoachingRequestForm';

// Unlisted by design, the same way /for/* is: noindex/nofollow here, an
// X-Robots-Tag header in next.config.ts, no sitemap entry, and nothing on the
// site links to it. Staff send the URL to a family directly. /1on1 redirects
// here (next.config.ts) so the link is short enough to paste into WhatsApp.
//
// Families who reach this page have already settled on 1-on-1 coaching, so
// there is no pricing anywhere on it: the form exists to fix who teaches and
// when. Do not reintroduce fee copy here.
export const metadata: Metadata = {
  title: '1-on-1 Coaching: Request a Place',
  description:
    'Request one-on-one World Schools debate coaching: tell us the student’s level, when you are free, and which coaches you would like.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': 0,
      'max-image-preview': 'none',
    },
  },
};

export default function CoachingOneOnOnePage() {
  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">
            1-on-1 coaching
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Request a place
          </h1>
          <p className="mt-3 leading-relaxed text-navy-600">
            Tell us about the student, when you are free, and which coaches you would prefer. We
            will reply within one working day to confirm your coach and a time.
          </p>
        </header>

        <CoachingRequestForm />
      </div>
    </section>
  );
}
