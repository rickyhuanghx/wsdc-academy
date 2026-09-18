import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ProgramsCoachStrip } from '@/components/ProgramsCoachStrip';

// Commercial page for "winter debate camp" / "winter break debate camp" queries,
// the winter sibling of /summer-debate-camp. The URL carries no year on purpose:
// it is reused every winter so it keeps its links and crawl history. Each season,
// update the dates, prices, and status copy here and in the two winter entries in
// src/data/programs.ts (source of truth for price and schedule). After the
// academy wraps, flip this page to next-winter framing; never delete or 404 it.

export const metadata: Metadata = {
  title: 'Online Winter Debate Camp for Ages 9–18',
  description:
    'A live online winter debate camp, December 21–30: 12 hours of small-group World Schools training over the winter break, with judged practice debates.',
  alternates: { canonical: '/winter-debate-camp' },
  openGraph: {
    title: 'Online Winter Debate Camp | WSDC Prep',
    description:
      'A two-week live online debate camp over the winter break: small groups, judged practice debates, written feedback. Beginner and advanced tracks, three time zones.',
    url: '/winter-debate-camp',
  },
};

const pageFaqs = [
  {
    question: 'When is the winter debate camp?',
    answer:
      'The Winter Academy runs December 21 to 30, 2026: six 2-hour sessions on Monday, Tuesday, and Wednesday of each week (December 21, 22, 23, 28, 29, and 30). There are no classes on Christmas Eve, Christmas Day, New Year’s Eve, or New Year’s Day.',
  },
  {
    question: 'How much does the winter debate camp cost?',
    answer:
      'Tuition is $384 at the early-bird rate, which runs until November 15, and $480 after that. Either way it covers 12 hours of live small-group instruction, a judged practice debate, written feedback, and the printable resource pack. At the early-bird rate that is $32 an hour.',
  },
  {
    question: 'What time are the classes?',
    answer:
      'There are three time options and each student picks one. Option A is 1 to 3 PM Eastern, which is 10 AM to 12 PM Pacific. Option B is 9 to 11 AM Eastern, which is 6 to 8 PM in Dubai and 2 to 4 PM in London. Option C is 1 to 3 PM in Dubai, which is 5 to 7 PM in Singapore and Hong Kong. The program pages show every option in your own timezone.',
  },
  {
    question: 'Is the camp online or in person?',
    answer:
      'Fully online and fully live: six 2-hour sessions in groups of 6 to 8 students. Students join from home or from wherever the family is spending the break.',
  },
  {
    question: 'Does my child need debate experience to join?',
    answer:
      'No. The beginner Winter Academy assumes zero experience and ends with students debating a real judged practice round. Students who already compete can take the Advanced Winter Academy, which runs at competition pace.',
  },
  {
    question: 'What happens after the camp ends?',
    answer:
      'Term 2 begins on January 8. Beginner graduates typically continue into the Foundation class, and experienced debaters into the Competition Team. The academy curriculum is cut from the same training system, so nothing is relearned.',
  },
];

const timeOptions = [
  {
    name: 'Option A',
    who: 'US West Coast and East Coast',
    times: ['1–3 PM Eastern', '10 AM–12 PM Pacific', '6–8 PM London'],
  },
  {
    name: 'Option B',
    who: 'US East Coast and the Gulf',
    times: ['9–11 AM Eastern', '6–8 PM Dubai', '2–4 PM London'],
  },
  {
    name: 'Option C',
    who: 'The Gulf, Singapore, and Hong Kong',
    times: ['1–3 PM Dubai', '5–7 PM Singapore and Hong Kong', '2:30–4:30 PM India'],
  },
];

const linkClass =
  'font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600';

export default function WinterDebateCampPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Winter Debate Camp', href: '/winter-debate-camp' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            The online winter debate camp
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Two weeks, six live sessions, real judged debates. The Winter
            Academy fits a beginner term of World Schools training into 12
            hours of small-group coaching over the winter break, for ages 9
            to 18, with class times for the US, the Gulf, and Asia.
          </p>
          <p className="mt-4 max-w-2xl text-sm font-semibold uppercase tracking-wider text-signal-500">
            December 21–30, 2026. Enrolling now, early-bird rate until
            November 15.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/programs/winter-academy"
              className="inline-block rounded-md bg-signal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Beginner Winter Academy
            </Link>
            <Link
              href="/programs/advanced-winter-academy"
              className="inline-block rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              Advanced Winter Academy
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What two weeks of winter debate camp should produce
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          A camp is judged by what the student can do on the last day that
          they could not do on the first. Ours is built backwards from that
          test: by the final session, every student has constructed
          arguments with a clear structure, rebutted live opponents, and
          debated a full practice round that a coach judged and wrote
          feedback on. The format is{' '}
          <Link href="/what-is-world-schools-debate" className={linkClass}>
            World Schools Debate
          </Link>
          , the international 3-on-3 style debated at NSDA Nationals and the
          world championships, where every student speaks every round.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          The winter break suits this better than most parents expect. There
          is no homework competing for attention, the second half of the
          tournament season starts in January, and two weeks is long enough
          to go from a first speech to a full round. It is the same course
          as our{' '}
          <Link href="/summer-debate-camp" className={linkClass}>
            summer debate camp
          </Link>
          , on a winter calendar.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Dates: six sessions, holidays left free
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Classes meet on Monday, Tuesday, and Wednesday for two weeks:
          December 21, 22, and 23, then December 28, 29, and 30. Christmas
          Eve, Christmas Day, New Year&apos;s Eve, and New Year&apos;s Day
          have no classes. Each session is two hours, twelve hours in all,
          in groups of 6 to 8.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Three time options
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Each student picks one option at checkout and keeps it for all six
          sessions. Every option covers the same curriculum. Families who
          travel over the break can pick the option that fits where they
          will be.
        </p>
        <div className="mt-6 space-y-4">
          {timeOptions.map((option) => (
            <div key={option.name} className="rounded-sm border border-navy-100 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-navy-900">
                {option.name}: {option.who}
              </h3>
              <ul className="mt-3 space-y-1 font-mono text-sm text-navy-700">
                {option.times.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          The program pages convert every option to your own timezone.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Two tracks, one design
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              href: '/programs/winter-academy',
              title: 'Beginner Winter Academy (ages 9–16)',
              body: 'Zero experience assumed. Six 2-hour sessions in groups of 6 to 8, ending with a real judged practice debate. 12 hours of live instruction.',
              label: 'About the beginner Winter Academy',
            },
            {
              href: '/programs/advanced-winter-academy',
              title: 'Advanced Winter Academy (ages 11–18)',
              body: 'For students who already compete: competition-pace rounds, impromptu prep against the clock, and feedback against the 40/40/20 judging criteria.',
              label: 'About the Advanced Winter Academy',
            },
          ].map((card) => (
            <div key={card.href} className="rounded-sm border border-navy-100 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-navy-900">{card.title}</h3>
              <p className="mt-2 leading-relaxed text-navy-700">{card.body}</p>
              <Link href={card.href} className={`mt-3 inline-block ${linkClass}`}>
                {card.label}
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What it costs
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Tuition is $384 until November 15 and $480 after that, for either
          track. That covers all 12 hours of live instruction, the judged
          practice debate, written feedback, and the printable resource
          pack. There are no placement or assessment fees. To prepare before
          the first session, the{' '}
          <Link href="/motions" className={linkClass}>
            motion bank
          </Link>{' '}
          and the{' '}
          <Link href="/resources" className={linkClass}>
            free resource library
          </Link>{' '}
          are the same materials students train with.
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
          <h2 className="text-2xl font-bold">Not sure which track fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            A short free call ends with a placement recommendation. If the
            break is already full, the weekly{' '}
            <Link href="/programs" className="font-semibold text-white underline underline-offset-4">
              year-round programs
            </Link>{' '}
            start their next term on January 8.
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
