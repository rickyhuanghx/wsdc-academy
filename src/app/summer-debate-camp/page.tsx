import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ProgramsCoachStrip } from '@/components/ProgramsCoachStrip';

// Commercial page for "debate camp" / "summer debate camp" queries
// (2026-08-31 keyword research). The 2026 bootcamps ran Aug 18–27 and have
// wrapped; this page holds next-summer framing until 2027 enrollment opens.
// When it does: update the status copy below and the FAQ pricing line, and
// point the CTA at the bootcamp program pages.

export const metadata: Metadata = {
  title: 'Online Summer Debate Camp for Ages 9–16',
  description:
    'A live online summer debate camp: 12 hours of small-group World Schools training over two weeks, with judged practice debates and written feedback.',
  alternates: { canonical: '/summer-debate-camp' },
  openGraph: {
    title: 'Online Summer Debate Camp | WSDC Prep',
    description:
      'A two-week live online debate bootcamp: small groups, judged practice debates, written feedback. Beginner and advanced tracks for ages 9 to 16.',
    url: '/summer-debate-camp',
  },
};

const pageFaqs = [
  {
    question: 'How much does the summer debate camp cost?',
    answer:
      'The 2026 bootcamps were $328 for 12 hours of live instruction, which works out to $27 an hour. Pricing for summer 2027 is published when enrollment opens; the programs page always carries current prices.',
  },
  {
    question: 'Is the camp online or in person?',
    answer:
      'Fully online and fully live: six 2-hour sessions over two weeks, in groups of 6 to 8 students, scheduled for US time zones. No travel, no recordings-instead-of-teaching.',
  },
  {
    question: 'Does my child need debate experience to join?',
    answer:
      'No. The beginner bootcamp assumes zero experience and ends with students debating real practice rounds. Students who already compete can take the advanced bootcamp, which runs at competition pace.',
  },
  {
    question: 'What happens after camp ends?',
    answer:
      'Camp graduates typically continue into the fall Foundation class or, for experienced debaters, the Competition Team. The bootcamp curriculum is the first two weeks of the same training system, so nothing is relearned.',
  },
];

export default function SummerDebateCampPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Summer Debate Camp', href: '/summer-debate-camp' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            The online summer debate camp
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Two weeks, six live sessions, real judged debates. Our summer
            bootcamps compress a beginner term of World Schools training into
            12 hours of small-group coaching for ages 9 to 16, online across
            US time zones.
          </p>
          <p className="mt-4 max-w-2xl text-sm font-semibold uppercase tracking-wider text-signal-500">
            The August 2026 session has wrapped. Summer 2027 opens for
            enrollment in the spring.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/consultation"
              className="inline-block rounded-md bg-signal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Join the 2027 interest list
            </Link>
            <Link
              href="/programs"
              className="inline-block rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              See year-round programs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What two weeks of debate camp should produce
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          A camp is judged by what the student can do on the last day that
          they could not do on the first. Ours is built backwards from that
          test: by the final session, every camper has constructed arguments
          with the four-layer structure, rebutted live opponents, and debated
          full practice rounds that a coach judged and wrote feedback on. The
          format is{' '}
          <Link
            href="/what-is-world-schools-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            World Schools Debate
          </Link>
          , the international 3-on-3 style debated at NSDA Nationals and the
          world championships, where every student speaks every round.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Two tracks, one design
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              href: '/programs/summer-bootcamp',
              title: 'Beginner bootcamp (ages 9–16)',
              body: 'Zero experience assumed. Six 2-hour sessions in groups of 6 to 8, ending with real judged practice debates. 12 hours of live instruction.',
              label: 'About the beginner bootcamp',
            },
            {
              href: '/programs/advanced-summer-bootcamp',
              title: 'Advanced bootcamp',
              body: 'For students who already compete: competition-pace rounds, impromptu prep against the clock, and feedback against the 40/40/20 judging criteria.',
              label: 'About the advanced bootcamp',
            },
          ].map((card) => (
            <div key={card.href} className="rounded-sm border border-navy-100 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-navy-900">{card.title}</h3>
              <p className="mt-2 leading-relaxed text-navy-700">{card.body}</p>
              <Link
                href={card.href}
                className="mt-3 inline-block font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
              >
                {card.label}
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Comparing camps? Compare honestly
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          An online bootcamp is not the same product as a residential
          institute, and depending on the student, either can be the right
          call. Our{' '}
          <Link
            href="/blog/best-debate-summer-camps"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            guide to American debate summer camps
          </Link>{' '}
          maps the whole landscape, including programs that compete with
          ours, and gives the four questions that separate strong camps from
          expensive ones. Until camp season, the{' '}
          <Link
            href="/motions"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            motion bank
          </Link>{' '}
          and the{' '}
          <Link
            href="/resources"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            free resource library
          </Link>{' '}
          are the same materials campers train with.
        </p>
      </section>

      <section className="border-t border-navy-100 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProgramsCoachStrip />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">
          Common questions
        </h2>
        <div className="mt-5 space-y-3">
          {pageFaqs.map((faq) => (
            <details key={faq.question} className="group rounded-sm border border-navy-100 bg-white p-5">
              <summary className="cursor-pointer list-none font-semibold text-navy-900">
                <span className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-navy-900">{faq.question}</h3>
                  <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Don&apos;t want to wait for summer?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            The fall Foundation class starts from zero, runs weekly, and uses
            the same curriculum the bootcamp is cut from. A short free call
            will tell you which fits.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
