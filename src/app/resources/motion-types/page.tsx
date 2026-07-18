import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'The 4 Types of World Schools Debate Motions (With Examples)',
  description:
    'Policy, value, actor, and regret motions in World Schools Debate: what each motion type asks you to prove, where each debate is usually won or lost, and example motions for every type.',
  alternates: { canonical: '/resources/motion-types' },
  openGraph: {
    title: 'The 4 Types of World Schools Debate Motions',
    description: 'Policy, value, actor, and regret motions: burdens, strategy, and examples for each.',
    url: '/resources/motion-types',
    type: 'article',
  },
};

const motionTypes = [
  {
    name: 'Policy motions',
    wording: '“This House would…” · “This House believes that X should…”',
    what: 'The proposition must defend a specific policy, with a model that defines how the motion would actually be implemented. The opposition can defend the status quo or propose a countermodel: a different policy that solves the same problem their way.',
    burden: 'Prove your policy works better in the real world than the alternative.',
    hinge: 'Real-world knowledge, feasibility, and the consequences of each side’s policy. Vague models lose; the team with the more concrete picture of implementation usually controls the debate.',
    examples: [
      'This House would ban private education.',
      'This House believes that the United States should implement a universal basic income.',
    ],
  },
  {
    name: 'Value motions',
    wording: '“This House believes that…”',
    what: 'There is no policy to defend. Instead, each team argues that its side of a principle, trend, or moral claim is preferable. These are debates about how the world should be understood, not what should be done.',
    burden: 'Prove your side of the value claim is more true or more desirable, on balance.',
    hinge: 'Analytical depth and moral persuasion. The winning team usually controls the framework: whose measure of “harm” or “good” the judge ends up using.',
    examples: [
      'This House believes that nationalism does more harm than good.',
      'This House believes that developing countries should prioritise environmental protection over economic growth.',
    ],
  },
  {
    name: 'Actor motions',
    wording: '“This House, as X, would…” · “This House, as X, believes that…”',
    what: 'Both teams argue from the perspective of a named actor (a country, a movement, an institution). The question is not what is best for the world in general, but what this actor should do given its own interests and values.',
    burden: 'Prove your side is preferable from the actor’s perspective, not from everyone’s.',
    hinge: 'Characterization. The team that builds the more credible picture of the actor’s incentives, constraints, and priorities gets to decide what “winning” means for that actor.',
    examples: [
      'This House, as Ukraine, would pursue a ceasefire with Russia.',
      'This House, as the feminist movement, believes that embracing traditional femininity undermines gender equality.',
    ],
  },
  {
    name: 'Regret motions',
    wording: '“This House regrets…”',
    what: 'A counterfactual: would the world have been better off if the thing named in the motion had never happened? The proposition regrets it; the opposition defends it. Neither side gets to propose fixing it. The debate is about the alternative history.',
    burden: 'Prove the world without X would have been better (or worse) than the world with it.',
    hinge: 'Imaginative but disciplined counterfactual analysis. The critical move is defining the most plausible alternative world. Teams that regret something without saying what would have filled the gap lose to teams that do.',
    examples: ['This House regrets the professionalisation of sports.'],
  },
];

const pageFaqs = [
  {
    question: 'What is a countermodel in World Schools Debate?',
    answer:
      'In a policy debate, the opposition is not required to defend the status quo. A countermodel is an alternative policy the opposition proposes to solve the same problem, which shifts the debate from "policy vs. nothing" to "your policy vs. ours." It is powerful but binding: once you countermodel, you must defend it as thoroughly as proposition defends theirs.',
  },
  {
    question: 'How should prep change based on the motion type?',
    answer:
      'The first ten minutes of prep should identify the type, because it sets the burdens. Policy motions need a model and implementation detail; value motions need a framework and a metric; actor motions need a characterization of the actor; regret motions need a defined counterfactual world. Teams that prep every motion the same way routinely miss their real burden.',
  },
  {
    question: 'Are some motion types easier for proposition or opposition?',
    answer:
      'Each type shifts the ground differently. Regret motions often favor opposition because defending the messy real world is easier than proving a cleaner alternate history. Policy motions place a heavier creative burden on proposition, which must build the model. Good teams train all four types rather than hoping for a favorable draw.',
  },
];

export default function MotionTypesPage() {
  return (
    <>
      <ArticleJsonLd
        title="The 4 Types of World Schools Debate Motions (With Examples)"
        description="Policy, value, actor, and regret motions: burdens, strategy, and example motions for each type."
        url="/resources/motion-types"
        datePublished="2026-07-09"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Motion Types', href: '/resources/motion-types' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Quick reference
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The four types of World Schools motions
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Every World Schools motion belongs to one of four families, and each
            family places a different burden on the teams. Identifying the type
            is the first job of the{' '}
            <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
              prep hour
            </Link>: a team that misreads the motion type spends eight minutes a
            speech proving the wrong thing.
          </p>
        </header>

        {motionTypes.map((type, i) => (
          <section key={type.name} className="mt-12 border-t-2 border-navy-900 pt-8">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-4xl font-bold text-signal-500">{i + 1}</span>
              <div>
                <h2 className="text-2xl font-bold text-navy-900">{type.name}</h2>
                <p className="mt-1 font-display text-sm italic text-navy-500">{type.wording}</p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-navy-700">{type.what}</p>
            <div className="mt-5 grid gap-px border border-navy-200 bg-navy-200 sm:grid-cols-2">
              <div className="bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy-500">The burden</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">{type.burden}</p>
              </div>
              <div className="bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy-500">Where it&apos;s won</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">{type.hinge}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-500">Example motions</p>
              <ul className="mt-2 space-y-2">
                {type.examples.map((m) => (
                  <li key={m} className="border-l-2 border-signal-500 pl-4 font-display italic text-navy-800">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <section className="mt-12 border-t-2 border-navy-900 pt-8">
          <h2 className="text-2xl font-bold text-navy-900">Common questions</h2>
          <div className="mt-6 space-y-3">
            {pageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-navy-100 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-navy-900">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 leading-relaxed text-navy-700">
            Ready to drill? The{' '}
            <Link href="/resources/practice-motions" className="font-semibold text-signal-500 hover:text-signal-600">
              practice motion bank
            </Link>{' '}
            has ten motions of each type, and the{' '}
            <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
              prep planner
            </Link>{' '}
            gives you the schedule to run them on.
          </p>
        </section>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Train all four families.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our training cycle rotates motion types deliberately, so no draw at a
            tournament is a surprise.
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
