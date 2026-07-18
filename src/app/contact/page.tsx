import type { Metadata } from 'next';
import { LeadForm } from '@/components/LeadForm';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us: World Schools Debate Coaching',
  description:
    'Questions about World Schools Debate coaching, school team programs, or placement? Contact WSDC Academy. We reply within one business day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | WSDC Academy',
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
