import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'World Schools Debate Judging Ballot (Printable)',
  description:
    'A printable World Schools debate ballot with the official 40/40/20 score split, the 60–80 speaker scale, reply-speech scoring, and a calibration guide for new and parent judges.',
  alternates: { canonical: '/resources/judging-ballot' },
  openGraph: {
    title: 'Printable World Schools Debate Judging Ballot',
    description:
      'Score a World Schools round properly: per-speaker 40/40/20 boxes, reply scoring out of 50, and a speaker-scale calibration guide for lay judges.',
    url: '/resources/judging-ballot',
    type: 'article',
  },
};

const speakerRows = [
  'Proposition 1',
  'Opposition 1',
  'Proposition 2',
  'Opposition 2',
  'Proposition 3',
  'Opposition 3',
];

const calibration = [
  {
    band: '76–80',
    label: 'Exceptional',
    detail: 'A speech you would expect at the top of a national circuit: sophisticated argument, commanding delivery, flawless role fulfilment. Rare by design.',
  },
  {
    band: '73–75',
    label: 'Excellent',
    detail: 'Clearly above the field: well-mechanized arguments, responsive engagement, strong structure, only minor lapses.',
  },
  {
    band: '70–72',
    label: 'Above average to good',
    detail: '70 is the anchor: the average speech at this tournament. Award it freely; move up only for concrete reasons you could name.',
  },
  {
    band: '66–69',
    label: 'Below average',
    detail: 'Real contributions with visible gaps: assertions without mechanisms, missed rebuttal, structure that wanders.',
  },
  {
    band: '60–65',
    label: 'Developing',
    detail: 'Significant problems across style, content, or strategy. Reserve the bottom of the band for speeches with little usable material.',
  },
];

const pageFaqs = [
  {
    question: 'How do you score a World Schools debate round?',
    answer:
      'Each substantive speech is marked out of 100: up to 40 for style (delivery and persuasion), 40 for content (arguments and evidence), and 20 for strategy (structure, timing, prioritization, and role fulfilment). Reply speeches are marked out of 50 on the same proportions (20/20/10). In practice, substantive speeches live on a 60–80 scale with 70 as the average, and replies on 30–40. The team with more total speaker points usually wins, but the ballot asks for a winner on the debate as argued, not an arithmetic check.',
  },
  {
    question: 'Can a team lose the round but have the top speaker?',
    answer:
      'Yes, and it is common. Speaker scores rate individual speeches; the result rates which side won the clash of cases. A brilliant speaker on a team that dropped a decisive argument loses with high points. If your totals and your instinct about the winner disagree, re-examine both: usually one number is charitable somewhere the round was actually decided.',
  },
  {
    question: 'What should a parent judge focus on in a World Schools round?',
    answer:
      'Judge as an average reasonable person: no specialist knowledge, no personal views on the motion. Track three things per speech: did it answer the strongest opposing material, did its own arguments come with reasons rather than assertions, and could you follow the structure. Resist rewarding confidence alone; a fluent speech that ignores the debate scores worse on content and strategy than a plainer one that engages.',
  },
  {
    question: 'Do points of information affect the score?',
    answer:
      'Yes, under style and strategy. Speakers should take one or two POIs in the unprotected minutes and answer them without losing their thread; offering sharp POIs during opponents’ speeches also counts toward engagement. A speaker who takes none, or collapses on the ones they take, loses strategy marks; nobody is obliged to take more than two.',
  },
];

function InLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
    >
      {children}
    </Link>
  );
}

export default function JudgingBallotPage() {
  return (
    <>
      <ArticleJsonLd
        title="Printable World Schools Debate Judging Ballot, With a Calibration Guide"
        description="A printable World Schools ballot: 40/40/20 boxes per speaker, reply scoring, and a 60–80 speaker-scale calibration guide for new judges."
        url="/resources/judging-ballot"
        datePublished="2026-09-02"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Judging Ballot', href: '/resources/judging-ballot' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Quick references
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The judging ballot
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Most school scrimmages are judged by whoever is available,
            and most new judges are handed nothing but a blank page.
            This ballot fixes that: per-speaker boxes on the official
            40/40/20 split, reply scoring, and a calibration guide so a
            first-time or parent judge lands scores in the same band an
            experienced adjudicator would. It pairs with our full{' '}
            <InLink href="/world-schools-debate-judging">judging
            guide</InLink>, which explains what style, content, and
            strategy actually reward.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PrintButton label="Print the ballot" />
            <span className="text-sm text-navy-500">One per judge per round.</span>
          </div>
        </header>

        <div className="cheat-sheet mt-10 border border-navy-300 bg-white">
          <div className="border-b-2 border-navy-900 px-6 py-5 sm:px-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-navy-900">World Schools ballot</h2>
              <span className="hidden text-xs font-semibold uppercase tracking-wider text-navy-400 sm:block">
                wsdcacademy.com
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              Motion: ____________________________________________ · Round: ______ · Judge: ______________
            </p>
          </div>

          <div className="px-6 py-5 sm:px-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-navy-900 text-xs uppercase tracking-wide text-navy-900">
                    <th className="py-2 pr-3 font-semibold">Speaker</th>
                    <th className="py-2 pr-3 font-semibold">Style /40</th>
                    <th className="py-2 pr-3 font-semibold">Content /40</th>
                    <th className="py-2 pr-3 font-semibold">Strategy /20</th>
                    <th className="py-2 font-semibold">Total /100</th>
                  </tr>
                </thead>
                <tbody>
                  {speakerRows.map((s) => (
                    <tr key={s} className="border-b border-navy-200 text-navy-700">
                      <td className="py-3 pr-3 font-semibold text-navy-900">{s}</td>
                      <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                      <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                      <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                      <td className="py-3"><span className="inline-block h-6 w-16 border-b-2 border-navy-900" /></td>
                    </tr>
                  ))}
                  <tr className="border-b border-navy-200 text-navy-700">
                    <td className="py-3 pr-3 font-semibold text-navy-900">Opp reply <span className="font-normal text-navy-500">(20/20/10)</span></td>
                    <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                    <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                    <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                    <td className="py-3"><span className="inline-block h-6 w-16 border-b-2 border-navy-900" /> /50</td>
                  </tr>
                  <tr className="border-b border-navy-200 text-navy-700">
                    <td className="py-3 pr-3 font-semibold text-navy-900">Prop reply <span className="font-normal text-navy-500">(20/20/10)</span></td>
                    <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                    <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                    <td className="py-3 pr-3"><span className="inline-block h-6 w-14 border-b border-navy-400" /></td>
                    <td className="py-3"><span className="inline-block h-6 w-16 border-b-2 border-navy-900" /> /50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-700">
              <strong>Result:</strong> this debate is won by
              ______________________ because
              _________________________________________________________
              _________________________________________________________
            </p>
            <p className="mt-3 text-xs leading-relaxed text-navy-500">
              Reply speeches: opposition replies first, proposition
              closes. Replies take no points of information; the first
              and last minute of each substantive speech are protected.
            </p>
          </div>
        </div>

        <div className="cheat-sheet mt-10 border border-navy-300 bg-white">
          <div className="border-b-2 border-navy-900 px-6 py-5 sm:px-8">
            <h2 className="text-2xl font-bold text-navy-900">Calibrating the 60–80 scale</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              Substantive speeches are scored between 60 and 80, with 70
              the average and replies on 30–40. New judges drift high;
              the fix is anchoring on 70 and moving for named reasons.
            </p>
          </div>
          <div className="divide-y divide-navy-200">
            {calibration.map((c) => (
              <section key={c.band} className="px-6 py-4 sm:px-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="stat font-display text-xl font-bold text-signal-500">{c.band}</span>
                  <h3 className="font-display text-base font-bold text-navy-900">{c.label}</h3>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-navy-700">{c.detail}</p>
              </section>
            ))}
          </div>
        </div>

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            The three habits of a fair lay judge
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            First, flow the round: a two-column page of what each side
            argued, because the result should come from what was said,
            not what you remember loudest. Second, judge as an average
            reasonable person; your own expertise and opinions on the
            motion are set aside, and a two-point gap per speech is a
            normal winning margin, so small consistent differences
            matter more than one dramatic mark. Third, decide the round
            before totting up the points, then reconcile: the winner is
            the team that won the important clashes, which is the same
            skill the{' '}
            <InLink href="/blog/third-speaker-world-schools-debate">whip
            speech</InLink> and{' '}
            <InLink href="/blog/weighing-in-debate">weighing</InLink>{' '}
            essays teach from the debater&apos;s side of the table.
            Judging a practice round, incidentally, is one of the
            fastest ways for a debater to improve; hand teammates this
            ballot and rotate the job, with motions from the{' '}
            <InLink href="/resources/practice-motions">practice
            bank</InLink>.
          </p>
        </section>

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Common questions</h2>
          <div className="mt-6 space-y-3">
            {pageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-navy-100 bg-white p-5">
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
        </section>

        <div className="print-hide mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Every one of our rounds is judged like this.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Students in our programs debate judged practice rounds on
            this exact rubric, with written feedback after every
            session.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
