import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'The Debate Research System: How to Research for Debate',
  description:
    'A research system for debaters: the weekly reading mix, a four-tier source ladder, a three-step fact-check for every statistic, and a routine that turns reading into case-file material.',
  alternates: { canonical: '/resources/debate-research-system' },
  openGraph: {
    title: 'The Debate Research System',
    description:
      'How debaters build the knowledge that wins content points: reading mix, source ladder, fact-checking, and a case-file routine.',
    url: '/resources/debate-research-system',
    type: 'article',
  },
};

const weeklyMix = [
  {
    share: '~70%',
    title: 'Written journalism and analysis',
    tasks: [
      'A daily pass over one wire service or established front page (15 minutes, headlines plus two full articles).',
      'Two or three longer analysis pieces a week from serious outlets, chosen from areas you avoid, not areas you like.',
      'One explainer or backgrounder a week on a running story (a conflict, a policy fight, a technology) so you hold the history, not just the update.',
    ],
  },
  {
    share: '~20%',
    title: 'Curated audio and video',
    tasks: [
      'One current-affairs podcast or documentary a week, chosen for expertise, not entertainment.',
      'One recorded championship-level debate a week, watched for arguments and examples you can reuse.',
    ],
  },
  {
    share: '~10%',
    title: 'Primary sources',
    tasks: [
      'One report, dataset, speech, or court decision a month, read directly. Debaters who have touched the primary source argue it with a confidence secondhand readers cannot fake.',
    ],
  },
];

const sourceTiers = [
  {
    tier: 'Wire services & established media',
    examples: 'Reuters, AP, BBC, major national papers',
    use: 'Your daily baseline for what happened. Safe to cite in rounds for events; verify big causal claims before building a case on them.',
  },
  {
    tier: 'Institutions',
    examples: 'Government statistics agencies, UN bodies, central banks, major NGOs',
    use: 'The strongest tier for numbers: unemployment, emissions, casualties, budgets. Cite the institution by name; judges reward it. Watch for advocacy framing in NGO reports.',
  },
  {
    tier: 'Specialized publications & experts',
    examples: 'Field-specific outlets, academic blogs, professional newsletters',
    use: 'Where the best mechanisms live: the how and why behind the headline. Credibility varies by author, so check who wrote it every time.',
  },
  {
    tier: 'Academic research',
    examples: 'Peer-reviewed journals, university press books',
    use: 'The deepest evidence, and the easiest to misuse. Read the abstract and the limitations, not just the finding, and never cite a study you only know from a headline about it.',
  },
];

const factCheckSteps = [
  {
    step: '1. Find the original',
    detail:
      'Trace the claim to its first source. If the article cites a study, open the study; if a statistic has no citation at all, it does not go in your file.',
  },
  {
    step: '2. Check the source',
    detail:
      'Place the original on the source ladder. Check the date (a 2015 number about technology or geopolitics is often worse than no number) and whether the publisher has a stake in the conclusion.',
  },
  {
    step: '3. Check the context',
    detail:
      'Read enough of the original to know what the number actually measures, whether it was cherry-picked from a range, and what the source itself lists as caveats. Then record the claim with its source and date.',
  },
];

const pageFaqs = [
  {
    question: 'How do debaters stay informed about current events?',
    answer:
      'The debaters who feel effortlessly informed almost all run a system: a short daily pass over one trusted news source, a few deliberately chosen longer reads each week, and notes that turn what they read into arguments and examples they can retrieve later. Fifteen focused minutes a day beats a three-hour panic the night before a tournament, because knowledge for impromptu rounds has to be in your head, not your bookmarks.',
  },
  {
    question: 'How much should a debater read each week?',
    answer:
      'Around three to five hours of deliberate reading a week is enough to compete seriously, provided it is spread across the week and weighted toward written sources. The mix matters more than the volume: mostly written journalism and analysis, some curated audio and video, and a small, regular dose of primary sources like reports and datasets.',
  },
  {
    question: 'What sources should you cite in a debate round?',
    answer:
      'Named, checkable ones. An institution ("World Bank figures", "the UN refugee agency") or an established outlet carries weight with judges; "studies show" and "I read somewhere" carry none. In World Schools, judges assess evidence as reasonable non-specialists, so a clearly attributed, honestly framed number beats an impressive-sounding but vague one every time.',
  },
  {
    question: 'Can you use AI for debate research?',
    answer:
      'As a starting point, carefully; as a source, no. AI tools are useful for mapping an unfamiliar topic or generating counterargument lists to drill against, but they cannot be cited in a round, they sometimes invent statistics and sources, and leaning on them during practice trains the exact skill impromptu rounds test out of you: thinking without assistance. Anything an AI tells you goes through the same three-step fact-check as anything else, which usually means finding the real source anyway.',
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

export default function DebateResearchSystemPage() {
  return (
    <>
      <ArticleJsonLd
        title="The Debate Research System: How to Build the Knowledge That Wins Content Points"
        description="A research system for debaters: weekly reading mix, four-tier source ladder, three-step fact-checking, and a routine that turns reading into case-file material."
        url="/resources/debate-research-system"
        datePublished="2026-09-02"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Debate Research System', href: '/resources/debate-research-system' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Practice & prep
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The debate research system
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Content is 40 percent of a World Schools speech under the{' '}
            <InLink href="/world-schools-debate-judging">judging
            criteria</InLink>, and impromptu rounds ban the internet, so
            what you know walking into the building is the ceiling on what
            you can argue inside it. That knowledge is not accumulated by
            accident. This page is the system we teach: a weekly reading
            mix, a ladder for judging sources, a fact-check that every
            statistic passes before it enters your case file, and a
            reading routine that turns articles into material you can
            actually use mid-round.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PrintButton label="Print the system" />
            <span className="text-sm text-navy-500">The checklists print onto two pages.</span>
          </div>
        </header>

        <div className="cheat-sheet mt-10 border border-navy-300 bg-white">
          <div className="border-b-2 border-navy-900 px-6 py-5 sm:px-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-navy-900">The weekly reading mix</h2>
              <span className="hidden text-xs font-semibold uppercase tracking-wider text-navy-400 sm:block">
                wsdcacademy.com
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              Three to five hours a week, weighted heavily toward reading.
              Written content builds retrievable knowledge; video mostly
              builds the feeling of it.
            </p>
          </div>
          <div className="divide-y divide-navy-200">
            {weeklyMix.map((block) => (
              <section key={block.title} className="px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="stat font-display text-xl font-bold text-signal-500">{block.share}</span>
                  <h3 className="font-display text-lg font-bold text-navy-900">{block.title}</h3>
                </div>
                <ul className="mt-3 space-y-2">
                  {block.tasks.map((task) => (
                    <li key={task} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                      <span className="mt-1 h-3.5 w-3.5 flex-shrink-0 border border-navy-400" aria-hidden />
                      {task}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">The source ladder</h2>
          <p className="print-hide mt-4 leading-relaxed text-navy-700">
            Not all sources earn the same trust, and judges know the
            difference. Rank what you read, cite upward whenever you can,
            and let the ladder decide how much verification a claim needs
            before you repeat it in a round.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-navy-900 text-sm uppercase tracking-wide text-navy-900">
                  <th className="py-2 pr-4 font-semibold">Tier</th>
                  <th className="py-2 pr-4 font-semibold">Examples</th>
                  <th className="py-2 font-semibold">How a debater uses it</th>
                </tr>
              </thead>
              <tbody>
                {sourceTiers.map((t) => (
                  <tr key={t.tier} className="border-b border-navy-200 align-top text-navy-700">
                    <td className="py-3 pr-4 font-semibold text-navy-900">{t.tier}</td>
                    <td className="py-3 pr-4 text-sm">{t.examples}</td>
                    <td className="py-3 text-sm leading-relaxed">{t.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="print-hide mt-4 text-sm leading-relaxed text-navy-600">
            For outlets you do not recognize, bias-rating services such as
            AllSides and Media Bias/Fact Check are a reasonable first
            screen; treat their ratings as a prompt to read carefully, not
            a verdict.
          </p>
        </section>

        <div className="cheat-sheet mt-12 border border-navy-300 bg-white">
          <div className="border-b-2 border-navy-900 px-6 py-5 sm:px-8">
            <h2 className="text-2xl font-bold text-navy-900">The three-step fact-check</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              Every statistic passes this before it enters your case file.
              A number you cannot trace is a number an opponent can take
              away from you in one sentence.
            </p>
          </div>
          <div className="divide-y divide-navy-200">
            {factCheckSteps.map((s) => (
              <section key={s.step} className="px-6 py-5 sm:px-8">
                <h3 className="font-display text-lg font-bold text-navy-900">{s.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">{s.detail}</p>
              </section>
            ))}
          </div>
        </div>

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            From reading to case file: the 2–10–5 routine
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Reading only becomes debating when something written survives
            it. For each serious article, spend two minutes before reading
            (who wrote this, who published it, what is the headline
            selling), ten to fifteen minutes reading actively (what is the
            evidence, does the logic hold, what would the other side say),
            and five minutes afterward writing three things in your own
            words: the claim, the two or three strongest facts with their
            sources, and the best counterargument you can think of. Those
            five closing minutes are the whole trick; they convert the
            article into an argument shell you can rebuild in a prep room
            months later.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            File the notes by topic, not by date. The{' '}
            <InLink href="/motions">motion bank&apos;s</InLink>{' '}
            topic categories (international relations, economics, technology,
            justice, and the rest) are a ready-made filing system, and
            browsing a topic&apos;s motions tells you exactly which
            knowledge gaps to read against next. Printed topic files are
            legal in the impromptu prep hour, so a season of this routine
            walks into the prep room with you; the{' '}
            <InLink href="/resources/prep-hour-planner">1-hour prep
            planner</InLink> shows where in the hour they pay off, and{' '}
            <InLink href="/blog/how-to-build-a-debate-argument">the
            argument guide</InLink> shows how a filed fact becomes a
            mechanized argument. To pressure-test the whole system, debate
            an unfamiliar motion cold using only your files; the{' '}
            <InLink href="/blog/debate-practice">practice guide</InLink>{' '}
            builds that drill into a weekly plan.
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
          <h2 className="text-2xl font-bold">Knowledge is coached too.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our classes assign weekly reading against the season&apos;s
            motion areas and drill it in judged rounds, so the system runs
            itself by mid-term.
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
