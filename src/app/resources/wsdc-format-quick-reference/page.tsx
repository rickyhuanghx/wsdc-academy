import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'World Schools Debate Format: Quick Reference (Speech Order, Times, Judging)',
  description:
    'The World Schools Debate format on one page: speech order and speaking times, reply speech rules, prep-time rules for impromptu motions, points of information, and the 40/40/20 judging criteria.',
  alternates: { canonical: '/resources/wsdc-format-quick-reference' },
  openGraph: {
    title: 'World Schools Debate Format Quick Reference',
    description: 'Speech order, timings, prep rules, POIs, and judging criteria on one printable page.',
    url: '/resources/wsdc-format-quick-reference',
    type: 'article',
  },
};

const speeches = [
  { order: 1, speech: 'Proposition 1', time: '8 min', job: 'Definitions, stance, split, metric, first 1–2 arguments' },
  { order: 2, speech: 'Opposition 1', time: '8 min', job: 'Challenge set-up if needed, opposition case, first rebuttal' },
  { order: 3, speech: 'Proposition 2', time: '8 min', job: 'Rebut, rebuild, one new argument' },
  { order: 4, speech: 'Opposition 2', time: '8 min', job: 'Rebut, rebuild, one new argument' },
  { order: 5, speech: 'Proposition 3', time: '8 min', job: 'Clash-by-clash comparison and weighing (no new arguments)' },
  { order: 6, speech: 'Opposition 3', time: '8 min', job: 'Clash-by-clash comparison and weighing (no new arguments)' },
  { order: 7, speech: 'Opposition Reply', time: '4 min', job: '“Biased judge’s summary,” given by speaker 1 or 2' },
  { order: 8, speech: 'Proposition Reply', time: '4 min', job: 'Same, but proposition gets the true last word' },
];

export default function FormatQuickReferencePage() {
  return (
    <>
      <ArticleJsonLd
        title="World Schools Debate Format: Quick Reference"
        description="Speech order, speaking times, reply speech rules, prep rules, POIs, and the 40/40/20 judging criteria on one page."
        url="/resources/wsdc-format-quick-reference"
        datePublished="2026-07-09"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Format Quick Reference', href: '/resources/wsdc-format-quick-reference' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Quick reference
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The World Schools format, on one page
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Everything a debater, parent, or first-time judge needs to follow a
            round: who speaks when, for how long, what each speech is for, and
            how the round is scored. For the full explanation, read{' '}
            <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              What is World Schools Debate?
            </Link>
          </p>
          <div className="mt-6">
            <PrintButton label="Print this reference" />
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-navy-900">Speech order and speaking times</h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-navy-100">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-navy-900 text-left text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Speech</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">The job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                {speeches.map((s) => (
                  <tr key={s.order}>
                    <td className="stat px-4 py-3 font-semibold text-signal-500">{s.order}</td>
                    <td className="px-4 py-3 font-semibold">{s.speech}</td>
                    <td className="stat px-4 py-3">{s.time}</td>
                    <td className="px-4 py-3">{s.job}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            Junior divisions commonly halve these times (4-minute substantive
            speeches, 2-minute replies). Note the reply order flips: opposition
            replies first, so proposition, which carries the burden of change,
            closes the debate.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Teams and the reply speech</h2>
          <ul className="mt-5 space-y-3 text-navy-700">
            {[
              ['Three speakers per team', 'each delivers one substantive speech; teams may register a fourth who can be subbed in between rounds at many tournaments.'],
              ['The reply is a summary, not a speech', 'a “biased judge’s adjudication” of the round in your favor. It is comparative, big-picture, and free of new arguments.'],
              ['Reply speaker is 1 or 2', 'the third speaker never gives the reply, so one teammate speaks twice in every round.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
                <span className="leading-relaxed">
                  <strong>{title}</strong>: {body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Prep time (impromptu motions)</h2>
          <ul className="mt-5 space-y-3 text-navy-700">
            {[
              ['One hour', 'from motion release to the round, for impromptu motions. Prepared motions are released weeks in advance.'],
              ['No internet, no devices', 'during the prep hour. The case comes from your team’s heads.'],
              ['Printed materials allowed', 'case files, almanacs, and pre-written briefs may come into the prep room, which is why strong teams build them all season.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
                <span className="leading-relaxed">
                  <strong>{title}</strong>: {body}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            At the World Schools Debating Championships itself, teams debate
            eight preliminary rounds (four on prepared motions, four
            impromptu) before elimination rounds. At NSDA Nationals&apos;
            World Schools event, prepared motions are released May 1 and
            impromptu motions one hour before each round. Run the hour on a
            schedule: see the{' '}
            <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
              1-hour prep planner
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Points of information</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            During substantive speeches, opponents may rise to offer short
            points of information (POIs). The speaker chooses whether to accept.
            The first and last minute of each substantive speech are protected
            (no POIs), and reply speeches take no POIs at all. Convention: offer
            regularly as a team, and accept one or two per speech at moments{' '}
            <em>you</em> control.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How it&apos;s scored: 40/40/20</h2>
          <div className="mt-6 grid gap-px border border-navy-200 bg-navy-200 sm:grid-cols-3">
            {[
              ['Style', '40%', 'Delivery: clarity, engagement, presence, persuasion'],
              ['Content', '40%', 'Substance: logic, evidence, rebuttal, completeness'],
              ['Strategy', '20%', 'Choices: issue priority, structure, timing, role fulfillment'],
            ].map(([name, weight, desc]) => (
              <div key={name} className="bg-white p-5">
                <p className="stat font-display text-3xl font-bold text-signal-500">{weight}</p>
                <p className="mt-1 font-semibold text-navy-900">{name}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy-600">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            Judges assess arguments as an &ldquo;ordinary intelligent
            voter&rdquo;: informed and open-minded, but unmoved by jargon and
            empty rhetoric. Full breakdown in{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              our judging guide
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Official rule documents</h2>
          <ul className="mt-5 space-y-3 text-navy-700">
            {[
              ['WSDC rules & adjudicator guides', 'the international championship’s official resource library', 'https://www.wsdcdebating.org/services-4'],
              ['NSDA: How to Judge World Schools Debate', 'the official US primer for new judges', 'https://www.speechanddebate.org/how-to-judge-world-schools-debate/'],
              ['USWSDI Manual', 'the full rules for the World Schools event at NSDA Nationals', 'https://www.speechanddebate.org/uswsdi-manual/'],
            ].map(([title, desc, href]) => (
              <li key={href} className="flex gap-3 border-t border-navy-200 pt-3">
                <span className="leading-relaxed">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-signal-500 hover:text-signal-600"
                  >
                    {title}
                  </a>: {desc}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            Individual tournaments occasionally vary timings and POI rules.
            When in doubt, the invite and the tab room outrank any reference,
            including this one.
          </p>
        </section>

        <div className="print-hide mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Know the format. Then train it.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Every element on this page (roles, replies, POIs, the criteria) is
            a drill in our weekly training cycle.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
