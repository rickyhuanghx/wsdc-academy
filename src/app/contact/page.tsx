import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/LeadForm';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us: World Schools Debate Coaching',
  description:
    'Questions about World Schools Debate coaching, school team programs, or placement? Contact WSDC Prep. We reply within one business day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | WSDC Prep',
    description: 'Questions about programs, school teams, or placement? We reply within one business day.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-navy-700">
              Questions about programs, placement, or coaching for your school
              team? Send us a message and we&apos;ll reply within one business
              day.
            </p>

            <h2 className="mt-10 text-xl font-bold text-navy-900">
              What people usually write in about
            </h2>
            <ul className="mt-4 space-y-4 text-navy-700">
              <li>
                <strong className="text-navy-900">Placement.</strong> Which
                program a student belongs in, especially when they have debated
                another format. If that is your question, the{' '}
                <Link
                  href="/consultation"
                  className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
                >
                  free consultation
                </Link>{' '}
                answers it faster than email does.
              </li>
              <li>
                <strong className="text-navy-900">School teams.</strong> Coaches
                and teachers setting up a World Schools squad, or looking for
                outside judging and training support. Tell us your league and
                roughly how many students you have.
              </li>
              <li>
                <strong className="text-navy-900">
                  The National Team Sprint.
                </strong>{' '}
                It is{' '}
                <Link
                  href="/programs/national-team-sprint"
                  className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
                >
                  invitation-only
                </Link>
                , so requests for consideration come through here. Include the
                student&apos;s competitive record.
              </li>
              <li>
                <strong className="text-navy-900">The motion bank.</strong>{' '}
                Corrections, missing tournaments, or archives from before 1994. We
                take these seriously; the{' '}
                <Link
                  href="/motions"
                  className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
                >
                  bank
                </Link>{' '}
                is compiled from public records and it is not perfect.
              </li>
              <li>
                <strong className="text-navy-900">Billing and refunds.</strong>{' '}
                Covered by the{' '}
                <Link
                  href="/refund"
                  className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
                >
                  refund policy
                </Link>
                , but write to us and a person will handle it.
              </li>
            </ul>
            <p className="mt-6 leading-relaxed text-navy-700">
              Already know the answer is somewhere on the site? Most of it is in
              the{' '}
              <Link
                href="/faq"
                className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
              >
                FAQ
              </Link>{' '}
              or on the{' '}
              <Link
                href="/programs"
                className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
              >
                programs page
              </Link>
              .
            </p>
            <dl className="mt-8 space-y-5 text-navy-700">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-semibold text-signal-500 hover:text-signal-600"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="font-semibold text-signal-500 hover:text-signal-600"
                  >
                    {CONTACT_PHONE}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-signal-500 hover:text-signal-600"
                  >
                    Message us on WhatsApp
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <LeadForm
            endpoint="/api/contact"
            submitLabel="Send Message"
            successMessage="We received your message and will reply within one business day."
            fields={[
              { name: 'name', label: 'Your name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                required: true,
                placeholder: 'Tell us about your student, school team, or question…',
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
