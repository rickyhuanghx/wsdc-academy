import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import {
  BreadcrumbJsonLd,
  DatasetJsonLd,
  FAQJsonLd,
} from '@/components/JsonLd';
import { MotionExplorer } from '@/components/MotionExplorer';
import { DrawMotion } from '@/components/DrawMotion';
import {
  bankStats,
  coachShelves,
  motions,
  motionTopics,
  motionsForTopic,
  motionYears,
  motionsForYear,
  MOTION_TYPE_LABELS,
  roundedCount,
} from '@/lib/motion-bank';

export const metadata: Metadata = {
  title: 'Debate Motion Bank: 12,000+ Real World Schools & BP Motions, Searchable by Topic',
  description:
    'A free, searchable bank of 12,000+ real debate motions from 1,200+ tournaments (1994 to 2026): filter by topic, motion type, year, and info slide, including every World Schools Debating Championships motion since 1994. No signup.',
  alternates: { canonical: '/motions' },
  openGraph: {
    title: 'The Debate Motion Bank: 12,000+ Real Tournament Motions',
    description:
      'Search 12,000+ real debate motions by topic, type, and year, including the complete Worlds (WSDC) motion archive since 1994. Free, no signup.',
    url: '/motions',
    type: 'website',
  },
};

const faqs = [
  {
    question: 'Are these real debate motions?',
    answer:
      'Yes. Every motion in the bank was set at a real tournament and comes from a public record: tournament tab sites, the official World Schools Debating Championships motion archive, and the openly licensed hello-motions research dataset. We do not generate motions with AI or invent them in-house.',
  },
  {
    question: 'Are these motions suitable for World Schools debate?',
    answer:
      'Most are. The bank includes motions from World Schools tournaments (including every Worlds motion since 1994, which you can filter for) alongside motions from British Parliamentary and other formats. BP motions are standard practice material for World Schools teams: the topics, burdens, and clash are the same, and coaches across the circuit train with them.',
  },
  {
    question: 'What is an info slide?',
    answer:
      'An info slide is a short paragraph of background released with a motion, defining a term or describing a situation the debate depends on. Around 3,400 motions in the bank carry their original info slide, and you can filter for them when you want prep practice that starts from a briefing.',
  },
  {
    question: 'How should my team practice with the motion bank?',
    answer:
      'Pick a motion with the shuffle button or a topic filter, run a real 60-minute prep against the clock, then debate the round and judge it on the 40/40/20 criteria. Rotate motion types week to week (policy, value, actor, regret) so your first regret motion at a tournament is not your first regret motion ever.',
  },
  {
    question: 'How is this different from other motion databases?',
    answer:
      'Three things: every motion lives on fast, readable pages rather than inside an app you have to query; the World Schools Debating Championships archive is complete back to 1994 with prepared and impromptu rounds labeled; and each topic page comes with coaching notes on how that kind of debate is won, written by coaches who train the format year-round.',
  },
];

export default function MotionBankPage() {
  const stats = [
    { value: roundedCount(bankStats.total), label: 'real tournament motions' },
    { value: roundedCount(bankStats.tournaments), label: 'tournaments, 7 circuits' },
    { value: `${bankStats.firstYear}–${bankStats.lastYear}`, label: 'years covered' },
    { value: String(bankStats.wsdc), label: 'Worlds (WSDC) motions' },
  ];

  return (
    <>
      <DatasetJsonLd
        name="WSDC Prep Debate Motion Bank"
        description="A free, searchable dataset of real competitive debate motions from tournament public records, with topic, motion type, year, round, and info slide fields."
        url="/motions"
        size={bankStats.total}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Motion Bank', href: '/motions' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Motion Bank
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The debate motion bank
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Every motion here was set at a real tournament. Search{' '}
            {roundedCount(bankStats.total)} of them by keyword, topic, motion
            type, and year, browse the{' '}
            <Link href="/motions/wsdc" className="font-semibold text-signal-500 hover:text-signal-600">
              complete Worlds archive
            </Link>{' '}
            back to 1994, and copy anything straight into your next practice.
            Free, no signup, no app to fight with.
          </p>
        </header>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y-2 border-navy-900 py-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="stat font-display text-3xl font-bold text-signal-500 sm:text-4xl">
                {s.value}
              </dd>
              <dd className="mt-1 text-sm text-navy-600">{s.label}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12" aria-labelledby="start-here">
          <h2 id="start-here" className="sr-only">
            Start here
          </h2>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div className="rounded-sm border border-navy-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-signal-500">
                I need a motion now
              </p>
              <h3 className="mt-1.5 font-display text-lg font-bold text-navy-900">
                Draw a practice motion
              </h3>
              <div className="mt-4">
                <DrawMotion />
              </div>
            </div>
            <a
              href="#topics"
              className="group flex flex-col rounded-sm border border-navy-200 bg-white p-6 transition-colors hover:border-navy-400"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-signal-500">
                I&rsquo;m planning a unit
              </p>
              <h3 className="mt-1.5 font-display text-lg font-bold text-navy-900">
                Browse by topic
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
                17 topic pages, each with every motion in that area and a
                coaching note on where those debates are usually won.
              </p>
              <span className="mt-4 text-sm font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 group-hover:decoration-signal-500">
                See all 17 topics
              </span>
            </a>
            <Link
              href="/motions/wsdc"
              className="group flex flex-col rounded-sm border border-navy-200 bg-white p-6 transition-colors hover:border-navy-400"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-signal-500">
                I&rsquo;m prepping for Worlds
              </p>
              <h3 className="mt-1.5 font-display text-lg font-bold text-navy-900">
                The Worlds archive
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
                Every WSDC motion since 1994, prelims to Grand Finals, with
                prepared and impromptu rounds labeled.
              </p>
              <span className="mt-4 text-sm font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 group-hover:decoration-signal-500">
                Open the archive
              </span>
            </Link>
          </div>
        </section>

        <section id="explorer" className="mt-14 scroll-mt-24" aria-label="Search the motion bank">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Search the whole bank</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            The filter bar stays pinned while you scroll, and your filters live
            in the page address, so you can send a filtered view straight to
            your team. Tick any motion to build a practice set you can copy or
            print as a handout.
          </p>
          <div className="mt-6">
            <Suspense
              fallback={
                <p className="rounded-sm border border-navy-200 bg-white p-6 text-navy-500">
                  Loading 12,000+ motions…
                </p>
              }
            >
              <MotionExplorer />
            </Suspense>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="shelves-heading">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 id="shelves-heading" className="text-2xl font-bold text-navy-900">
              Coach&rsquo;s shelves
            </h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            Curated sets for the way practice actually gets planned: by what
            you are teaching this week, not by keyword.
          </p>
          <div className="mt-8 space-y-10">
            {coachShelves.map((shelf) => (
              <div key={shelf.slug}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-bold text-navy-900">{shelf.title}</h3>
                  <p className="text-sm text-navy-500">{shelf.why}</p>
                  {shelf.seeAllHref && (
                    <Link
                      href={shelf.seeAllHref}
                      className="ml-auto text-sm font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 hover:decoration-signal-500"
                    >
                      {shelf.seeAllLabel}
                    </Link>
                  )}
                </div>
                <p className="mt-2 max-w-3xl border-l-2 border-signal-500 pl-3 text-sm leading-relaxed text-navy-600">
                  <strong className="text-navy-800">Coach&rsquo;s note:</strong> {shelf.note}
                </p>
                <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {shelf.motions.map((m) => (
                    <li
                      key={m.id}
                      className="flex w-64 flex-none flex-col rounded-sm border border-navy-200 bg-white p-4"
                    >
                      <p className="flex-1 font-display text-sm italic leading-relaxed text-navy-800">
                        {m.m}
                      </p>
                      <p className="mt-3 text-[11px] text-navy-500">
                        {[m.y, m.t, m.r].filter(Boolean).join(' · ')}
                      </p>
                      <p className="mt-2 flex flex-wrap gap-1.5">
                        {m.w ? (
                          <span className="rounded-sm border border-signal-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-signal-500">
                            Worlds
                          </span>
                        ) : null}
                        {m.i ? (
                          <span className="rounded-sm border border-navy-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500">
                            Info slide
                          </span>
                        ) : null}
                        <span className="rounded-sm border border-navy-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500">
                          {MOTION_TYPE_LABELS[m.ty] ?? m.ty}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Fresh from the circuit</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            A dozen of the newest motions in the bank, from the{' '}
            {bankStats.lastYear} season.
          </p>
          <ol className="mt-6 space-y-3">
            {motions
              .filter((m) => m.y === bankStats.lastYear)
              .slice(0, 12)
              .map((m, i) => (
                <li key={m.id} className="flex gap-4 border-t border-navy-200 pt-3">
                  <span className="stat font-display text-lg font-bold text-signal-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-display italic leading-relaxed text-navy-800">{m.m}</p>
                    <p className="mt-1 text-xs text-navy-500">
                      {[m.y, m.t, m.r].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </li>
              ))}
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-navy-600">
            Browse the rest in the{' '}
            <Link
              href={`/motions/year/${bankStats.lastYear}`}
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              {bankStats.lastYear} archive
            </Link>
            .
          </p>
        </section>

        <section id="topics" className="mt-16 scroll-mt-24">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Motions by topic</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            Each topic page lists every motion in that area, grouped by year,
            with a coaching note on where those debates are usually won.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {motionTopics.map((t) => {
              const count = motionsForTopic(t.slug).length;
              return (
                <Link
                  key={t.slug}
                  href={`/motions/${t.slug}`}
                  className="group flex flex-col border border-navy-200 bg-white p-6 transition-colors hover:border-navy-400"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-navy-900">{t.label}</h3>
                    <span className="stat font-display text-sm font-bold text-signal-500">
                      {count.toLocaleString('en-US')}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{t.blurb}</p>
                  <span className="mt-4 text-sm font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 group-hover:decoration-signal-500">
                    Browse {t.label.toLowerCase()} motions
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16 border border-navy-200 bg-white p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            The flagship collection
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy-900">
            Every Worlds motion since 1994
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
            The World Schools Debating Championships motion archive: {bankStats.wsdc}{' '}
            motions from 32 championships, every round from prelims to Grand
            Finals, with prepared and impromptu rounds labeled. If you are
            preparing for national trials or Worlds itself, this is the study
            set.
          </p>
          <Link
            href="/motions/wsdc"
            className="mt-6 inline-block rounded-sm bg-navy-900 px-7 py-3 font-semibold text-white transition hover:bg-navy-800 active:scale-[0.98]"
          >
            Open the Worlds archive
          </Link>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Motions by year</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            Year archives from 2011 onward, grouped by tournament. Useful for
            seeing what the circuit debated during a season, or for pulling
            recent motions your opponents have not seen either.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {motionYears.map((y) => (
              <li key={y}>
                <Link
                  href={`/motions/year/${y}`}
                  className="inline-block rounded-sm border border-navy-200 bg-white px-4 py-2 font-semibold text-navy-800 transition-colors hover:border-navy-400 hover:text-signal-500"
                >
                  {y}{' '}
                  <span className="stat text-xs text-navy-400">
                    ({motionsForYear(y).length.toLocaleString('en-US')})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">How to train with the bank</h2>
          </div>
          <ol className="mt-6 space-y-4">
            {[
              [
                'Filter before you shuffle.',
                'Pick the topic your team is weakest in, or the motion type you have not debated this month, then shuffle inside that filter. Random practice on a weakness beats random practice on everything.',
              ],
              [
                'Run the real prep hour.',
                'Sixty minutes, no internet, printed materials only. Our 1-hour prep planner gives you the minute-by-minute structure; the bank gives you an endless supply of motions to run it on.',
              ],
              [
                'Prep both sides before you pick one.',
                'Ten minutes sketching proposition and opposition teaches you more about a motion than an hour on one side, and it is exactly what tournament day demands.',
              ],
              [
                'Finish with adjudication.',
                'A round without feedback is just talking. Judge on the 40/40/20 criteria and give one action item per speaker.',
              ],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
                <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
                <p className="leading-relaxed text-navy-700">
                  <strong>{title}</strong> {body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-navy-600">
            Useful companions: the{' '}
            <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
              1-hour prep planner
            </Link>
            , the{' '}
            <Link href="/resources/motion-types" className="font-semibold text-signal-500 hover:text-signal-600">
              guide to the four motion types
            </Link>
            , and the{' '}
            <Link href="/resources/glossary" className="font-semibold text-signal-500 hover:text-signal-600">
              World Schools glossary
            </Link>
            .
          </p>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Where the motions come from</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            The bank is compiled from public records: tournament tab sites
            (including the Tabbycat archives that most major tournaments
            publish), the official World Schools Debating Championships motion
            archive, and the openly licensed hello-motions research dataset
            started by Jessica Yung. Motion text is kept verbatim from the
            source, including info slides where the tournament released one.
            Records are deduplicated across sources, and topic labels come from
            the source data with keyword-based tagging filling the gaps. Spot a
            motion credited to the wrong tournament, or a missing one you can
            source?{' '}
            <Link href="/contact" className="font-semibold text-signal-500 hover:text-signal-600">
              Tell us
            </Link>{' '}
            and we will fix it.
          </p>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Motion bank FAQ</h2>
          </div>
          <dl className="mt-6 space-y-6">
            {faqs.map((f) => (
              <div key={f.question} className="border-t border-navy-200 pt-4">
                <dt className="font-display text-lg font-bold text-navy-900">{f.question}</dt>
                <dd className="mt-2 leading-relaxed text-navy-700">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-20 bg-navy-900 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Motions are free. Judged rounds are the product.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Every week our students debate motions from this bank in full judged
            rounds, with oral adjudication and written feedback after every one.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </>
  );
}
