import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ProgramsCoachStrip } from '@/components/ProgramsCoachStrip';

// Commercial page for "online debate class(es)" queries (2026-08-31 keyword
// research). /debate-coaching keeps the methodology framing for "debate
// coaching"; this page speaks the parent-shopping vocabulary and funnels the
// same way: /programs, the two group classes, /consultation.

export const metadata: Metadata = {
  title: 'Online Debate Classes for Kids & Teens',
  description:
    'Live online debate classes for ages 9 to 18: small groups of 6 to 8, a structured curriculum, judged practice debates, and written feedback every week.',
  alternates: { canonical: '/online-debate-classes' },
  openGraph: {
    title: 'Online Debate Classes | WSDC Prep',
    description:
      'Live online debate classes in small groups: structured curriculum, judged practice debates, and written feedback, scheduled for US time zones.',
    url: '/online-debate-classes',
  },
};

const pageFaqs = [
  {
    question: 'How much do online debate classes cost?',
    answer:
      'Our group classes work out to $27 to $35 per hour of live instruction, billed by the term (14 weekly 2-hour sessions). Private 1-on-1 coaching is $120 per hour with an $80 diagnostic session. The programs page lists current prices for everything.',
  },
  {
    question: 'What ages are the classes for?',
    answer:
      'Ages 9 to 18. The beginner Foundation class runs junior (9 to 12) and senior (13 to 16) groups; the Competition Team runs 11 to 14 and 14 to 17. You pick the age group and time slot at enrollment, and a coach confirms placement by grade.',
  },
  {
    question: 'How do time zones work for a live online class?',
    answer:
      'Classes are anchored to US Eastern time with slots chosen for American school schedules, and every schedule on the site converts automatically to your local time zone. Students join from across the country; the roster is not tied to one city.',
  },
  {
    question: 'What does a typical class session look like?',
    answer:
      'Two hours, live, in a group of 6 to 8: a skill block, drills on that skill, and debating. Classes build toward judged practice rounds, and feedback after sessions is written down, so parents and students can see what was fixed and what comes next.',
  },
];

export default function OnlineDebateClassesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Online Debate Classes', href: '/online-debate-classes' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Online debate classes for kids and teens
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Live, small-group debate classes for ages 9 to 18: a structured
            curriculum, judged practice debates, and written feedback after
            every session. Scheduled for US time zones, joined from anywhere.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/programs"
              className="inline-block rounded-md bg-signal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              See classes &amp; prices
            </Link>
            <Link
              href="/consultation"
              className="inline-block rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Why an online class can out-teach the club down the street
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The core skills of debate (building arguments, taking them apart,
          weighing what is left) are taught, drilled, and judged exactly as
          well over live video as in a classroom. Online adds two things a
          local club cannot: a coach chosen from a national roster rather
          than whoever lives nearby, and opponents from across the country,
          so a strong student is never the big fish in a six-person pond. What
          it removes is the commute. What it must not remove is the debating
          itself, which is why every class here builds toward real, judged
          practice rounds rather than lectures.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          The two group classes
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              href: '/programs/foundations',
              title: 'Foundation (ages 9–16, beginner)',
              body: 'For students starting from zero: 14 weekly 2-hour sessions in a group of 6 to 8, with a monthly judged practice debate. Junior and senior age groups.',
              label: 'About the Foundation class',
            },
            {
              href: '/programs/competition-team',
              title: 'Competition Team (ages 11–17)',
              body: 'For students who want to compete: weekly training plus a judged practice debate every week, feedback written against the real judging criteria.',
              label: 'About the Competition Team',
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
        <p className="mt-6 leading-relaxed text-navy-700">
          Prefer one student, one coach? {' '}
          <Link
            href="/programs/private-coaching"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            Private 1-on-1 coaching
          </Link>{' '}
          runs on the same system with a flexible schedule, and each summer a
          two-week{' '}
          <Link
            href="/summer-debate-camp"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            online debate camp
          </Link>{' '}
          compresses the beginner curriculum into six sessions.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          One format, taught properly
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Our classes teach{' '}
          <Link
            href="/what-is-world-schools-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            World Schools Debate
          </Link>
          , the international 3-on-3 format used at NSDA Nationals and the
          world championships. It rewards clear speaking as much as content
          (judges score style at 40%), half its motions are impromptu, and
          every student speaks every round, which makes it the strongest
          teaching format we know for this age range. Shopping around first
          is reasonable: our{' '}
          <Link
            href="/blog/best-online-debate-classes"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            guide to online debate classes
          </Link>{' '}
          covers the whole provider landscape, including alternatives to us,
          and the checklist we would use on any of them.
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
          <h2 className="text-2xl font-bold">Not sure which class fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            A short free call ends with one named class and the reason it is
            that one. No pressure to decide on the call.
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
