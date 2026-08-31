import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { topicLists, curatedTopicCount } from '@/lib/debate-topics';
import { bankStats, roundedCount } from '@/lib/motion-bank';

// The "topics" vocabulary bridge (2026-08-31 keyword research): Americans
// search "debate topics", not "motions", so this page carries the curated,
// listicle-shaped entry point and funnels into the motion bank. Every topic is
// a verbatim bank motion — never invent or paraphrase entries here.

export const metadata: Metadata = {
  title: 'Debate Topics for Students: 60+ Real Examples',
  description:
    '60+ debate topics for middle school, high school, and beginners, every one set at a real tournament. With coaching notes on picking and using them.',
  alternates: { canonical: '/debate-topics' },
  openGraph: {
    title: 'Debate Topics for Students: 60+ Real Examples',
    description:
      'Curated debate topics for middle school, high school, beginners, and impromptu practice, drawn from a bank of 12,000+ real tournament motions.',
    url: '/debate-topics',
    type: 'website',
  },
};

const pageFaqs = [
  {
    question: 'What is the difference between a debate topic and a motion?',
    answer:
      'They are the same thing at different levels of polish. A topic is the subject ("school uniforms"); a motion is the exact sentence a tournament debates ("This House would ban school uniforms"). Competitive formats debate motions, which is why every entry on this page is phrased as one.',
  },
  {
    question: 'How do I choose a debate topic for my class or club?',
    answer:
      'Match the topic to what the group already knows. Beginners argue best about school, family, and everyday life, with no research required to find the clash. Save motions that need policy knowledge or current-affairs context for experienced students. When in doubt, pick the motion a 12-year-old could argue both sides of at dinner.',
  },
  {
    question: 'Where do these debate topics come from?',
    answer:
      'Every topic on this page is a real motion set at a real tournament, quoted verbatim from public records: tournament tab sites, the official World Schools Debating Championships archive, and the openly licensed hello-motions dataset. Nothing here is AI-generated or invented.',
  },
  {
    question: 'What are the NSDA debate topics this year?',
    answer:
      'For the 2026-27 season, NSDA formats debate set resolutions: Policy debates national health insurance all year, while Public Forum and Lincoln-Douglas topics rotate through the season. Our NSDA topics guide lists the current resolutions and the release calendar.',
  },
];

const TYPE_ABBREVIATIONS: [string, string][] = [
  ['THW', 'This House would'],
  ['THBT', 'This House believes that'],
  ['THR / TH regrets', 'This House regrets'],
  ['THS / THO', 'This House supports / opposes'],
  ['THP', 'This House prefers'],
];

export default function DebateTopicsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Debate Topics', href: '/debate-topics' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/motions" className="hover:text-signal-600">Motion Bank</Link> · Curated lists
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Debate topics that were actually debated
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            This page lists {curatedTopicCount}{' '}
            debate topics for students, organized by level: fun topics for beginners, topics for middle
            school and high school, controversial motions for advanced rounds,
            and impromptu topics for one-hour prep. Every entry is quoted
            verbatim from a real tournament round; nothing is invented or
            AI-generated. In competitive debate a topic is phrased as a motion,
            a full sentence beginning &ldquo;This House&hellip;&rdquo;, and each
            list below keeps that phrasing. The lists are drawn from our free{' '}
            <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
              bank of {roundedCount(bankStats.total)} real motions
            </Link>{' '}
            ({bankStats.firstYear}&ndash;{bankStats.lastYear}), which you can
            search by subject, motion type, and year, including the complete{' '}
            <Link href="/motions/wsdc" className="font-semibold text-signal-500 hover:text-signal-600">
              Worlds championship archive
            </Link>
            . If you need this season&apos;s set American resolutions instead,
            see the{' '}
            <Link href="/blog/nsda-debate-topics" className="font-semibold text-signal-500 hover:text-signal-600">
              NSDA topics for 2026&ndash;27
            </Link>
            .
          </p>
        </header>

        <div className="mt-8 max-w-3xl rounded-sm border border-navy-100 bg-white p-5 text-sm leading-relaxed text-navy-600">
          <p className="font-semibold text-navy-900">Reading the shorthand</p>
          <p className="mt-1">
            Tournaments abbreviate the opening words of a motion:{' '}
            {TYPE_ABBREVIATIONS.map(([abbr, full], i) => (
              <span key={abbr}>
                <strong className="text-navy-900">{abbr}</strong> = {full}
                {i < TYPE_ABBREVIATIONS.length - 1 ? '; ' : '.'}
              </span>
            ))}
          </p>
        </div>

        {topicLists.map((list) => (
          <section key={list.slug} id={list.slug} className="mt-14 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
              {list.heading}
            </h2>
            <p className="mt-3 leading-relaxed text-navy-700">{list.note}</p>
            <ul className="mt-6 border-t border-navy-200">
              {list.motions.map((m) => (
                <li key={m.id} className="border-b border-navy-100 py-3">
                  <p className="leading-relaxed text-navy-900">{m.m}</p>
                  <p className="mt-1 text-xs text-navy-500">
                    {m.y ? `${m.y} · ` : ''}
                    {m.t}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href={list.seeAllHref}
              className="mt-4 inline-block text-sm font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
            >
              {list.seeAllLabel}
            </Link>
          </section>
        ))}

        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
            How do you run a debate once you have the topic?
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            A topic only becomes a debate with a format around it. In{' '}
            <Link
              href="/what-is-world-schools-debate"
              className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
            >
              World Schools Debate
            </Link>
            , two teams of three argue the motion through timed speeches, and
            judges score content, style, and strategy on the{' '}
            <Link
              href="/world-schools-debate-judging"
              className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
            >
              40/40/20 criteria
            </Link>
            . For classroom or club practice: give both sides the motion, allow
            a fixed prep window (one hour matches tournament impromptu rules),
            and use our free{' '}
            <Link
              href="/resources"
              className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
            >
              printable cheat sheets and prep planner
            </Link>{' '}
            to structure the speeches. Rotate topic types week to week: a ban
            one week, a values motion the next, a regret motion after that.
          </p>
        </section>

        <section className="mt-14 max-w-3xl">
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
            <h2 className="text-2xl font-bold">Want a coach in the room?</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">
              Our{' '}
              <Link href="/debate-coaching" className="font-semibold text-white underline underline-offset-4">
                debate coaching programs
              </Link>{' '}
              turn topics like these into judged practice rounds with written
              feedback after every session, live online for ages 9 to 18.
            </p>
            <Link
              href="/consultation"
              className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Book a Free Consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
