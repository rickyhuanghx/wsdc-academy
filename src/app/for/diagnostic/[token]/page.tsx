import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DiagnosticIntakeForm } from '@/components/DiagnosticIntakeForm';
import { DIAGNOSTIC_INVITES, getDiagnosticInvite, inviteCopy } from '@/lib/diagnostic-intake';

// Private pre-diagnostic page for one family, shared by direct link only.
// Sits under /for so it inherits the layout's noindex/nofollow metadata and
// the X-Robots-Tag header from next.config.ts; absent from sitemap.ts,
// llms.txt and every menu. Only registered tokens build; anything else 404s.

export const dynamicParams = false;

export function generateStaticParams() {
  return DIAGNOSTIC_INVITES.map((i) => ({ token: i.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const invite = getDiagnosticInvite((await params).token);
  if (!invite) return { title: 'Not found' };
  const copy = inviteCopy(invite);
  return { title: copy.title, description: copy.metaDescription };
}

export default async function DiagnosticIntakePage({ params }: { params: Promise<{ token: string }> }) {
  const invite = getDiagnosticInvite((await params).token);
  if (!invite) notFound();
  // Only the prefill crosses to the client; the Stripe reference is staff-only.
  const { paymentRef: _paymentRef, ...publicInvite } = invite;
  void _paymentRef;
  const copy = inviteCopy(invite);

  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Before we meet, {invite.studentFirst}
          </h1>
          <p className="mt-3 leading-relaxed text-navy-600">
            {copy.intro}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-navy-500">
            Best filled in by {invite.studentFirst} in one sitting. Parents are welcome to check the
            contact details at the end.
          </p>
        </header>

        <DiagnosticIntakeForm invite={publicInvite} />
      </div>
    </section>
  );
}
