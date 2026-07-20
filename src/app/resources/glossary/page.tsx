import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'World Schools Debate Glossary: Every Term, Defined',
  description:
    'A complete World Schools Debate glossary: burden, caseline, clash, countermodel, extension, mechanism, metric, POI, reply speech, split, weighing, whip, and every other term your coach will use.',
  alternates: { canonical: '/resources/glossary' },
  openGraph: {
    title: 'World Schools Debate Glossary',
    description: 'Every World Schools term defined, from burden and caseline to weighing and whip.',
    url: '/resources/glossary',
    type: 'article',
  },
};

const terms: { term: string; def: string }[] = [
  { term: 'Burden', def: 'What a team must prove to win its side of the motion. Identifying both teams’ burdens is the first job of prep. Arguments that don’t serve a burden don’t score.' },
  { term: 'Caseline', def: 'One sentence that captures a team’s entire case, repeated by every speaker. It is the connective tissue that makes three speeches sound like one argument.' },
  { term: 'Case file', def: 'The printed materials a team brings into the prep room: topic briefs, example banks, framing notes. Legal in prep, where devices and internet are not.' },
  { term: 'Clash', def: 'A point of direct disagreement between the two cases: a question the judge must answer to decide the round. Third speakers organize their speeches around 2–3 clashes.' },
  { term: 'Content', def: 'One of the three judging criteria (40%), covering the substance of the speech: logic, evidence, completeness of arguments, and quality of rebuttal.' },
  { term: 'Countermodel', def: 'In a policy debate, an alternative policy proposed by the opposition to solve the same problem, which shifts the round from “policy vs. status quo” to “your policy vs. ours.”' },
  { term: 'Definition', def: 'The first speaker’s clarification of ambiguous terms in the motion. Definitions must be reasonable. Squirrelly definitions that dodge the debate are penalized.' },
  { term: 'Deputy', def: 'The second speaker. Rebuts the opposing case, rebuilds their own, and delivers the team’s final new argument (the extension).' },
  { term: 'Extension', def: 'The new substantive argument delivered by the second speaker. It is the team’s last new material, since third speakers may not introduce new arguments.' },
  { term: 'External weighing', def: 'Comparing your impacts against the other team’s: even if both cases stand, why does your worst case beat their best case?' },
  { term: 'Framing', def: 'Presenting the debate so the judge sees it through your lens: what the round is “really about,” whose stakeholders matter, what is at stake.' },
  { term: 'Impact', def: 'The end consequence of an argument: who is affected, how deeply, and at what scale. An argument without an impact is a fact, not a reason to vote.' },
  { term: 'Impromptu motion', def: 'A motion released one hour before the round. Teams prepare with no internet or devices, using printed case files only.' },
  { term: 'Internal weighing', def: 'Comparing how the arguments themselves survived the round: why your case is still standing after their rebuttal while theirs is not.' },
  { term: 'Mechanism', def: 'A distinct causal pathway that makes an argument true: the “because” layer. Strong arguments run two or three mechanisms, each with reasoning and an example.' },
  { term: 'Metric', def: 'The standard a team asks the judge to decide the round on (e.g. “vote for the side that protects the most vulnerable”). Set it early, win on it late.' },
  { term: 'Model', def: 'The proposition’s concrete plan for implementing a policy motion: who does what, when, and how. The more specific the model, the harder it is to strawman.' },
  { term: 'Motion', def: 'The statement being debated, phrased from the proposition’s perspective (e.g. “This House would ban private education”). See the four motion types.' },
  { term: 'Opposition', def: 'The team arguing against the motion.' },
  { term: 'Ordinary intelligent voter', def: 'The judge’s required mindset: informed about the world and open to persuasion, but unmoved by jargon, specialist knowledge, or empty rhetoric.' },
  { term: 'Point of information (POI)', def: 'A short interjection offered by the opposing team during a substantive speech. The speaker chooses whether to accept; the first and last minute are protected.' },
  { term: 'Prepared motion', def: 'A motion released weeks before the tournament, allowing researched cases. Tournaments typically mix prepared and impromptu rounds.' },
  { term: 'Proposition', def: 'The team arguing for the motion. Called “government” in some other formats.' },
  { term: 'Rebuilding', def: 'Repairing your own case after it has been rebutted, to show why your arguments still stand. The second speaker’s job alongside rebuttal.' },
  { term: 'Rebuttal', def: 'Directly attacking the other side’s arguments, ideally the strongest version of them. Structured as “they say… / however… / this shows their argument fails because…”' },
  { term: 'Reply speech', def: 'The short final speech (half the length of a substantive), delivered by the first or second speaker: a “biased judge’s summary” of the round in your side’s favor. No new arguments, no POIs.' },
  { term: 'Split', def: 'The allocation of arguments across speakers, announced by the first speaker: typically 1–2 arguments for speaker one and one new argument for speaker two.' },
  { term: 'Stance', def: 'The team’s clear position on the motion, stated in the first speech. Everything the team says must be consistent with it.' },
  { term: 'Strategy', def: 'One of the three judging criteria (20%), covering the quality of a speaker’s choices: issue prioritization, structure, timing, POI handling, and role fulfillment.' },
  { term: 'Style', def: 'One of the three judging criteria (40%), covering delivery: clarity, vocal variety, presence, and persuasiveness. The category American converts most often undertrain.' },
  { term: 'Substantive speech', def: 'The main eight-minute speeches (speakers one through three of each team), as opposed to the shorter reply speeches.' },
  { term: 'Tagline', def: 'The short, memorable title of an argument (“Brain drain breaks the ladder”). It is what the judge writes at the top of their flow.' },
  { term: 'Trade-off', def: 'The core tension of the debate: what each side gains and gives up. Naming the trade-off honestly, then winning it, is stronger than pretending your side is costless.' },
  { term: 'Whip', def: 'The third speaker. Reorganizes the debate into clashes, wins each one, and weighs the round, without introducing new arguments.' },
];

export default function GlossaryPage() {
  return (
    <>
      <ArticleJsonLd
        title="World Schools Debate Glossary: Every Term, Defined"
        description="A complete glossary of World Schools Debate terminology, from burden and caseline to weighing and whip."
        url="/resources/glossary"
        datePublished="2026-07-09"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Glossary', href: '/resources/glossary' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Quick reference
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The World Schools glossary
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            {terms.length} terms, defined the way coaches actually use them.
            New to the format entirely? Start with{' '}
            <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              What is World Schools Debate?
            </Link>{' '}
            and keep this page open during your first practice rounds.
          </p>
        </header>

        <dl className="mt-10">
          {terms.map(({ term, def }) => (
            <div key={term} className="border-t border-navy-200 py-5 sm:grid sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="font-display text-lg font-bold text-navy-900">{term}</dt>
              <dd className="mt-1 leading-relaxed text-navy-700 sm:mt-0">{def}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 leading-relaxed text-navy-700">
          See these terms in action: the{' '}
          <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            speaker cheat sheets
          </Link>{' '}
          turn them into speech structure, and the{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            judging guide
          </Link>{' '}
          explains how Style, Content, and Strategy are actually scored.
        </p>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Fluency comes from rounds, not flashcards.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            One judged practice round with real adjudication will teach this
            vocabulary faster than any list. Come try one.
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
