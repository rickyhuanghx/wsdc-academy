import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/JsonLd';
import { TermSchedule } from '@/components/TermSchedule';
import { coaches, getCoachBySlug } from '@/data/coaches';
import { getProgramBySlug, programs } from '@/data/programs';
import { formatSlot } from '@/lib/schedule';
import { socialMeta } from '@/lib/pageMeta';

// Regional landing page for families in the UK and Europe (2026-10-10). The
// classes, prices and coaches are the same as everywhere else on the site; this
// page shows them in UK and Central European time, prices them indicatively in
// pounds and euros, and explains where World Schools sits on the UK circuit.
// It is a distinct page, not a translation of /online-debate-classes, so it
// carries no hreflang. Prices, slots and coach credentials read from the data
// files; edit them there, not here.

const foundation = getProgramBySlug('foundations')!;
const competition = getProgramBySlug('competition-team')!;
const privateCoaching = getProgramBySlug('private-coaching')!;
const winter = getProgramBySlug('winter-academy')!;

// Indicative conversion only. Stripe charges in USD; the buyer's bank sets the
// final rate. Rates from the ECB reference feed (frankfurter.app), 9 Oct 2026.
const FX = { GBP: 0.756, EUR: 0.892, asOf: '9 October 2026' };
const roundTo5 = (n: number) => Math.round(n / 5) * 5;
const gbp = (usd: number) => `£${roundTo5(usd * FX.GBP).toLocaleString('en-GB')}`;
const eur = (usd: number) => `€${roundTo5(usd * FX.EUR).toLocaleString('en-GB')}`;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const UK = 'Europe/London';
const CET = 'Europe/Berlin';

const europeanCoaches = ['biser-angelov', 'tin-puljic', 'zach-fleeser']
  .map((slug) => getCoachBySlug(slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export const metadata: Metadata = {
  title: 'Online Debate Classes: UK & Europe',
  description:
    'Live World Schools debate classes for ages 9 to 18 at Saturday evening and Sunday lunchtime UK slots. Small groups, judged rounds, prices in pounds and euros.',
  alternates: { canonical: '/online-debate-classes-uk' },
  ...socialMeta({
    title: 'Online Debate Classes for the UK & Europe | WSDC Prep',
    description:
      'The same live small-group World Schools debate classes, shown in UK and Central European time, with indicative prices in pounds and euros.',
    url: '/online-debate-classes-uk',
  }),
};

const pageFaqs = [
  {
    question: 'What time are the classes in the UK?',
    answer:
      'The weekend group classes fall on Saturday afternoon and evening and Sunday lunchtime to mid afternoon in the UK, and one hour later in Central Europe. The schedule on this page shows every slot in your own time zone, and the enrolment form uses the same clock.',
  },
  {
    question: 'Do the times change when the clocks go back?',
    answer:
      'Classes are anchored to US Eastern time. The UK and the US change their clocks on different dates, so for about a week in late October and about three weeks in March the UK time of a class shifts by one hour. The schedule converts on the date of the next class, so what you see here is what you will get.',
  },
  {
    question: 'Can I pay in pounds or euros?',
    answer:
      'Checkout is in US dollars through Stripe, and any UK or European card works. The pound and euro figures on this page are indicative conversions at the exchange rate on the stated date. Your bank sets the final rate and may add a small foreign transaction fee.',
  },
  {
    question: 'Is World Schools debate used in UK schools?',
    answer:
      'Most UK school competitions, including the ESU Schools’ Mace and the Oxford and Cambridge Schools competitions, run their own formats. World Schools is the format of the national squads that England, Scotland, Wales and Ireland send to the World Schools Debating Championships, and of international events such as Heart of Europe. The skills carry across: a student trained in World Schools is well prepared for the school circuit.',
  },
  {
    question: 'Can a student join part way through the term?',
    answer:
      'Yes. Late starters pay a pro-rated price for the sessions remaining and get the catch-up materials from the sessions they missed. The coach confirms placement by age and experience in the first week.',
  },
  {
    question: 'Do you teach British Parliamentary?',
    answer:
      'No. Every class teaches World Schools debate. Plenty of our students also debate British Parliamentary or Mace at school, and the core skills, building an argument, taking one apart, weighing the clash and speaking so a judge can follow, carry straight across. If your child only wants BP coaching, a specialist in that format will serve them better.',
  },
];

function slotLabel(track: NonNullable<typeof foundation.tracks>[number], zone: string) {
  return track.options
    .map((o) => {
      const f = formatSlot(o, zone);
      return `${f.day} ${f.time} ${f.abbr}`;
    })
    .join(' or ');
}

export default function OnlineDebateClassesUkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Online Debate Classes', href: '/online-debate-classes' },
          { name: 'UK & Europe', href: '/online-debate-classes-uk' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />
      <ItemListJsonLd
        name="Online Debate Classes for the UK & Europe"
        description="Live small-group World Schools debate classes for ages 9 to 18 at UK and European weekend times, plus private 1-on-1 coaching."
        url="/online-debate-classes-uk"
        items={[foundation, competition, privateCoaching].map((p) => ({
          name: p.name,
          href: `/programs/${p.slug}`,
          description: p.description,
        }))}
      />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-navy-200">
            For families in the UK and Europe
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Online debate classes for UK and European students
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Live, small-group World Schools debate classes for ages 9 to 18,
            at Saturday evening and Sunday lunchtime slots in the UK. The same
            coaches, curriculum and judged practice rounds as our US classes,
            with the times and prices shown in your own clock and currency.
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
          Weekend slots that already suit the UK
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Our group classes meet at the weekend on US Eastern time, which puts
          them in the UK afternoon and evening. Students from Spain, France
          and the UK already train in these groups alongside American
          students, so yours would not be the only family on the call in a
          European time zone. Central Europe is one hour later than the times
          below; the full schedule further down converts to any zone.
        </p>
        <ul className="mt-6 divide-y divide-navy-100 border-y border-navy-100">
          {[foundation, competition].flatMap((p) =>
            (p.tracks ?? []).map((track) => (
              <li key={`${p.slug}-${track.band}`} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <Link href={`/programs/${p.slug}`} className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600">
                    {p.shortName} {track.band}
                  </Link>
                  <span className="text-sm text-navy-500">
                    ages {track.ageRange.min} to {track.ageRange.max}
                  </span>
                </div>
                <p className="mt-1 font-mono text-sm text-navy-900">{slotLabel(track, UK)}</p>
                <p className="mt-0.5 font-mono text-xs text-navy-500">{slotLabel(track, CET)}</p>
              </li>
            )),
          )}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          Times are for the next class date. The UK and the US move their
          clocks on different dates, so for a short stretch in late October
          and in March a class lands one hour earlier or later in the UK than
          usual. The schedule below always shows the correct time for the
          date you would attend.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          The two group classes
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              href: '/programs/foundations',
              title: `Foundation (ages ${foundation.ageRange.min}–${foundation.ageRange.max}, beginner)`,
              body: `For students starting from zero: ${foundation.instruction?.sessions} weekly ${foundation.sessionLength} sessions in a group of 6 to 8, with a monthly judged practice debate. Junior and senior age groups.`,
              label: 'About the Foundation class',
            },
            {
              href: '/programs/competition-team',
              title: `Competition Team (ages ${competition.ageRange.min}–${competition.ageRange.max})`,
              body: 'For students who want to compete: weekly training plus a judged practice debate every week, with feedback written against the real judging criteria.',
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
          Prefer one student, one coach?{' '}
          <Link
            href="/programs/private-coaching"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            Private 1-on-1 coaching
          </Link>{' '}
          runs on the same system at a time you agree with the coach, which for
          European families usually means a weekday evening. Over the Christmas
          holidays the{' '}
          <Link
            href="/winter-debate-camp"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            Winter Academy
          </Link>{' '}
          runs six two-hour sessions between December 21 and 30, with an option
          at 2 PM UK time.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Coaches who came up through the European circuit
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Several of our coaches debated and judged in Europe before coaching
          here, including a national-team coach and a World Universities
          Debating champion. The{' '}
          <Link href="/coaches" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            full roster of {coaches.length} coaches
          </Link>{' '}
          teaches across every program.
        </p>
        <ul className="mt-6 space-y-5">
          {europeanCoaches.map((coach) => (
            <li key={coach.slug} className="border-l-2 border-signal-500 pl-4">
              <p className="font-semibold text-navy-900">{coach.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-navy-700">
                {coach.credentials.join('. ')}.
              </p>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Where World Schools sits on the UK circuit
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Most UK school competitions, including the ESU Schools&apos; Mace and
          the Oxford and Cambridge Schools competitions, use their own formats.{' '}
          <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            World Schools
          </Link>{' '}
          is the format of the national squads: England, Scotland, Wales and
          Ireland each send a team to the World Schools Debating Championships,
          and Scotland won the 2024 championship in Belgrade. It is also the
          format of international school events such as Heart of Europe in the
          Czech Republic and the online ISDI qualifiers listed on our{' '}
          <Link href="/tournaments" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            tournaments page
          </Link>
          .
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          The format rewards clear speaking as much as content (judges score
          style at 40%), half its motions are impromptu, and every student
          speaks every round. A student trained this way arrives at a Mace or
          BP round with a stronger case, sharper rebuttal and more composure
          than most of the field, because every class ends in a judged debate
          with written feedback. The{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            judging guide
          </Link>{' '}
          explains what the scores mean.
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Prices in pounds and euros
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Group classes are billed by the term:{' '}
          {foundation.instruction?.sessions} weekly sessions of{' '}
          {foundation.sessionLength} each. {foundation.term?.start}. Checkout
          is in US dollars; the pound and euro figures are indicative at the
          exchange rate on {FX.asOf}.
        </p>
        <ul className="mt-5 divide-y divide-navy-100 border-y border-navy-100">
          {[
            {
              name: 'Foundation',
              href: '/programs/foundations',
              amount: foundation.pricing.amount,
              unit: 'per term',
              note: `${foundation.instruction?.totalHours} hours of live teaching`,
            },
            {
              name: 'Competition Team',
              href: '/programs/competition-team',
              amount: competition.pricing.amount,
              unit: 'per term',
              note: `${competition.instruction?.totalHours} hours, weekly judged debates included`,
            },
            {
              name: 'Winter Academy',
              href: '/programs/winter-academy',
              amount: winter.pricing.amount,
              unit: 'for 12 hours',
              note: 'December 21 to 30, early-bird price',
            },
            {
              name: 'Private 1-on-1 coaching',
              href: '/programs/private-coaching',
              amount: privateCoaching.pricing.amount,
              unit: 'per hour',
              note: privateCoaching.oneOnOne
                ? `${usd(privateCoaching.oneOnOne.diagnostic.amount)} (about ${gbp(privateCoaching.oneOnOne.diagnostic.amount)}) diagnostic session first`
                : '',
            },
          ].map((row) => (
            <li key={row.href} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <Link href={row.href} className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600">
                {row.name}
              </Link>
              <span className="text-right">
                <span className="font-mono font-semibold text-navy-900">
                  {usd(row.amount)} {row.unit}
                </span>
                <span className="block font-mono text-sm text-navy-700">
                  about {gbp(row.amount)} / {eur(row.amount)}
                </span>
                <span className="block text-sm text-navy-500">{row.note}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          Refunds are in full within 7 days of enrolling, as long as the
          student has not yet attended a second session. Current prices and
          enrolment are on the{' '}
          <Link href="/programs" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            programs page
          </Link>
          .
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          How a class runs
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Two hours on Zoom in a group of 6 to 8: a skill block, drills on
          that skill, then debating. Every class builds toward judged practice
          rounds, and the feedback after a round is written down, so parents
          and students can see what was fixed and what comes next. The{' '}
          <Link href="/online-debate-classes" className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600">
            online debate classes page
          </Link>{' '}
          walks through a full session minute by minute and explains how to
          judge any provider, including us.
        </p>
      </section>

      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <TermSchedule
            initialZone={UK}
            intro="Every group class in Term 1, shown in UK time unless your browser is set elsewhere. Each program runs Junior and Senior groups with two time-slot options; a coach confirms the slot when you enrol."
            programs={programs
              .filter((p) => p.tracks && p.tracks.length > 0)
              .map((p) => ({ shortName: p.shortName, slug: p.slug, tracks: p.tracks! }))}
          />
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
            A short free call, at a UK-friendly hour, ends with one named
            class and the reason it is that one. No pressure to decide on the
            call.
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
