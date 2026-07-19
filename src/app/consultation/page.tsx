import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';
import {
  CONSULTATION_CALENDLY_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book a Free World Schools Debate Consultation',
  description:
    'Book a free consultation with WSDC Prep: we learn about your student, answer your questions about the World Schools format, and recommend the right place to start. No obligation.',
  alternates: { canonical: '/consultation' },
  openGraph: {
    title: 'Book a Free Consultation | WSDC Prep',
    description:
      'A short, no-pressure call to find the right World Schools Debate program for your student. Pick a time that works.',
    url: '/consultation',
  },
};

// Brand-styled embed URL: scarlet primary color, cookie banner hidden.
const embedUrl = `${CONSULTATION_CALENDLY_URL}?hide_gdpr_banner=1&primary_color=c8102e`;

const steps = [
  {
    title: 'Tell us about your student',
    body: 'Their experience with debate, their goals, and the kind of schedule that fits your family.',
  },
  {
    title: 'We map the format to them',
    body: 'We explain how World Schools works and which program matches your student’s stage, whether that is Foundation, the Competition Team, or private coaching.',
  },
  {
    title: 'You get a clear recommendation',
    body: 'A specific place to start and the next step to take. There is no pressure to decide on the call.',
  },
];

export default function ConsultationPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Consultation', href: '/consultation' },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: what a consultation is */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal-500">
              Free &middot; No obligation
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl">
              Book a consultation
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-navy-700">
              Every family starts the same way: a short, one-on-one call with our
              team. We learn about your student, answer your questions about the
              World Schools format, and recommend the right place to start. It is
              free.
            </p>

            <ol className="mt-10 space-y-7">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-display text-3xl font-semibold leading-none text-signal-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy-900">
                      {step.title}
                    </h2>
                    <p className="mt-1 leading-relaxed text-navy-700">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-sm border border-navy-100 bg-cream p-6">
              <h2 className="font-display text-base font-semibold text-navy-900">
                Who it is for
              </h2>
              <p className="mt-2 leading-relaxed text-navy-700">
                Students new to debate or already competing, roughly ages 11 to 18.
                Exploring options for a school team? We can talk through that too.
              </p>
            </div>

            <div className="mt-8 text-sm text-navy-600">
              <p>
                Prefer to reach us directly? Email{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-signal-500 hover:text-signal-600"
                >
                  {CONTACT_EMAIL}
                </a>
                , call{' '}
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="font-semibold text-signal-500 hover:text-signal-600"
                >
                  {CONTACT_PHONE}
                </a>
                , or{' '}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-signal-500 hover:text-signal-600"
                >
                  message us on WhatsApp
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right: the scheduler */}
          <div>
            <h2 className="font-display text-xl font-semibold text-navy-900">
              Pick a time that works
            </h2>
            <p className="mt-2 text-navy-600">
              Choose a slot below and you will get a calendar invite by email.
            </p>
            <div className="mt-5 overflow-hidden rounded-sm border border-navy-100 bg-white">
              <CalendlyEmbed url={embedUrl} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
