import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/JsonLd';
import { ProgramsCoachStrip } from '@/components/ProgramsCoachStrip';
import { TermSchedule } from '@/components/TermSchedule';
import { getProgramBySlug, programs } from '@/data/programs';

// Commercial page for "online debate class(es)" queries (2026-08-31 keyword
// research). /debate-coaching keeps the methodology framing for "debate
// coaching"; this page speaks the parent-shopping vocabulary and funnels the
// same way: /programs, the two group classes, /consultation.
// 2026-09-27: expanded (by-age routing, session flow, live schedule, prices, a
// PF/LD note) after the page fell out of the top 100. Prices, ages and the
// session flow all read from programs.ts, so edit them there, not here.

const foundation = getProgramBySlug('foundations')!;
const competition = getProgramBySlug('competition-team')!;
const privateCoaching = getProgramBySlug('private-coaching')!;

const perHour = (p: typeof foundation) =>
  p.instruction ? Math.round(p.pricing.amount / p.instruction.totalHours) : p.pricing.amount;

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const band = (p: typeof foundation, name: string) => {
  const t = p.tracks?.find((track) => track.band === name);
  return t ? `${t.ageRange.min} to ${t.ageRange.max}` : '';
};

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
  {
    question: 'Do you teach Public Forum or Lincoln-Douglas?',
    answer:
      'No. Every class teaches World Schools debate. Plenty of our students also compete in Public Forum, Lincoln-Douglas, or Model UN at school, and the core skills (building an argument, refuting one, weighing the clash, speaking clearly) carry straight across. If your child only wants PF or LD coaching, a specialist in that format will serve them better.',
  },
  {
    question: 'Can a complete beginner join an online debate class?',
    answer:
      'Yes. The Foundation class assumes no experience at all; a student who has never given a speech is exactly who it is built for. The first sessions cover what a round looks like and what each speaker does before anyone debates.',
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
      <ItemListJsonLd
        name="Online Debate Classes for Kids & Teens"
        description="Live small-group online debate classes for ages 9 to 18, plus private 1-on-1 debate coaching."
        url="/online-debate-classes"
        items={[foundation, competition, privateCoaching].map((p) => ({
          name: p.name,
          href: `/programs/${p.slug}`,
          description: p.description,
        }))}
      />

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
          compresses the beginner curriculum into six sessions. The same
          course runs over the winter break as the{' '}
          <Link
            href="/winter-debate-camp"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            winter debate camp
          </Link>
          .
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

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Debate classes by age
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Students train with peers at their own stage, so each class runs
          separate age groups. Here is where a student usually starts.
        </p>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">
              Kids, ages 9 to 12
            </h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              Younger students start in the Foundation junior group (ages{' '}
              {band(foundation, 'Junior')}). Nobody is expected to have
              debated before. The early weeks are about standing up, making one
              clear point, and answering a question about it, then building
              that into a full speech.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">
              Middle school
            </h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              A middle schooler new to debate joins Foundation in the group
              that matches their age. One who already competes, or has a
              season of experience, can go straight to the Competition Team
              junior group (ages {band(competition, 'Junior')}), which runs a
              judged practice debate every week.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900">
              High school
            </h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              High school beginners take the Foundation senior group (ages{' '}
              {band(foundation, 'Senior')}). Competing debaters join the
              Competition Team senior group (ages{' '}
              {band(competition, 'Senior')}), which preps live tournament
              motions and supports students through district, state, and
              national-circuit events. For tryouts, NSDA Nationals, or a
              specific weakness,{' '}
              <Link href="/programs/private-coaching" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
                1-on-1 debate coaching
              </Link>{' '}
              adds private sessions on top.
            </p>
          </div>
        </div>
        <p className="mt-6 leading-relaxed text-navy-700">
          Unsure which group fits? A coach confirms placement by grade and
          experience at enrollment, or a{' '}
          <Link href="/consultation" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            free consultation
          </Link>{' '}
          ends with a recommendation.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What a two-hour class looks like
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          A typical Foundation session, start to finish. Every class ends in
          real speaking, so a concept taught at the start of the session gets
          used in a judged round before it ends.
        </p>
        <ol className="mt-6 space-y-4">
          {foundation.sessionFlow?.map((step) => (
            <li key={step.time} className="flex gap-5">
              <span className="w-12 shrink-0 font-mono text-sm font-semibold text-signal-500">
                {step.time}
              </span>
              <div>
                <h3 className="font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-1 leading-relaxed text-navy-700">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 leading-relaxed text-navy-700">
          The Competition Team session swaps the warm-up and concept block for
          a debrief of last week&apos;s round and a live tournament motion,
          and adds a full judged debate every week. Written feedback after
          each round is scored against the same{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            judging criteria
          </Link>{' '}
          tournament judges use.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What online debate classes cost
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Group classes are billed by the term: {foundation.instruction?.sessions}{' '}
          weekly sessions of {foundation.sessionLength} each.{' '}
          {foundation.term?.start}. Late joiners are welcome and get
          catch-up materials.
        </p>
        <ul className="mt-5 divide-y divide-navy-100 border-y border-navy-100">
          {[
            {
              name: 'Foundation',
              href: '/programs/foundations',
              price: `${usd(foundation.pricing.amount)} per term`,
              note: `about ${usd(perHour(foundation))} per hour of live teaching`,
            },
            {
              name: 'Competition Team',
              href: '/programs/competition-team',
              price: `${usd(competition.pricing.amount)} per term`,
              note: `about ${usd(perHour(competition))} per hour, weekly judged debates included`,
            },
            {
              name: 'Private 1-on-1 coaching',
              href: '/programs/private-coaching',
              price: `${usd(privateCoaching.pricing.amount)} per hour`,
              note: privateCoaching.oneOnOne
                ? `${usd(privateCoaching.oneOnOne.diagnostic.amount)} diagnostic session; packages from ${usd(privateCoaching.oneOnOne.packages[0].amount)} for ${privateCoaching.oneOnOne.packages[0].hours} hours`
                : '',
            },
          ].map((row) => (
            <li key={row.href} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <Link href={row.href} className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600">
                {row.name}
              </Link>
              <span className="text-right">
                <span className="font-mono font-semibold text-navy-900">{row.price}</span>
                <span className="block text-sm text-navy-500">{row.note}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          Refunds are in full within 7 days of enrolling, as long as the
          student has not yet attended a second session. Current prices and
          enrollment are on the{' '}
          <Link href="/programs" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            programs page
          </Link>
          .
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Coming from Public Forum, Lincoln-Douglas, or policy?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Most American school teams compete in Public Forum or
          Lincoln-Douglas, and many of our students still do. We only teach
          World Schools, and we say so plainly. What transfers is the core:
          building an argument with a real warrant, taking the other side&apos;s
          apart, weighing what is left, and speaking so a judge can follow
          you. Students who add World Schools usually find their PF or LD
          rebuttals get sharper, because every speaker has to engage live
          with the other team. The{' '}
          <Link href="/world-schools-vs-public-forum" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            World Schools vs Public Forum comparison
          </Link>{' '}
          lays out the differences side by side.
        </p>
      </section>

      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <TermSchedule
            programs={programs
              .filter((p) => p.tracks && p.tracks.length > 0)
              .map((p) => ({ shortName: p.shortName, slug: p.slug, tracks: p.tracks! }))}
          />
        </div>
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
