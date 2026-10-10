import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { socialMeta } from '@/lib/pageMeta';

export const metadata: Metadata = {
  title: 'The 4 World Schools Debate Motion Types',
  description:
    'Policy, value, actor, and regret motions: what each asks you to prove, where each debate is won or lost, and example motions for every type.',
  alternates: { canonical: '/resources/motion-types' },
  ...socialMeta({
    title: 'The 4 Types of World Schools Debate Motions',
    description: 'Policy, value, actor, and regret motions: burdens, strategy, and examples for each.',
    url: '/resources/motion-types',
    type: 'article',
  }),
};

const motionTypes = [
  {
    name: 'Policy motions',
    wording: '“This House would…” · “This House believes that X should…”',
    what: 'The proposition must defend a specific policy, with a model that defines how the motion would actually be implemented. The opposition can defend the status quo or propose a countermodel: a different policy that solves the same problem their way.',
    burden: 'Prove your policy works better in the real world than the alternative.',
    hinge: 'Real-world knowledge, feasibility, and the consequences of each side’s policy. Vague models lose; the team with the more concrete picture of implementation usually controls the debate.',
    slug: 'policy',
    drill: 'Proposition must model the policy; opposition may countermodel. Drill implementation detail and real-world consequences.',
    examples: [
      'This House would ban private education.',
      'This House believes that the United States should implement a universal basic income.',
      'This House would make voting compulsory.',
      'This House would ban targeted political advertising on social media.',
      'This House would require social media platforms to verify the age of all users.',
      'This House would abolish standardized testing in university admissions.',
      'This House would impose a carbon tax on imported goods.',
      'This House would pay college athletes a salary.',
      'This House believes that developing countries should nationalize their natural-resource industries.',
      'This House would grant legal personhood to rivers and forests.',
    ],
  },
  {
    name: 'Value motions',
    wording: '“This House believes that…”',
    what: 'There is no policy to defend. Instead, each team argues that its side of a principle, trend, or moral claim is preferable. These are debates about how the world should be understood, not what should be done.',
    burden: 'Prove your side of the value claim is more true or more desirable, on balance.',
    hinge: 'Analytical depth and moral persuasion. The winning team usually controls the framework: whose measure of “harm” or “good” the judge ends up using.',
    slug: 'value',
    drill: 'No model to defend: win the framework. Drill metrics, moral weighing, and framing.',
    examples: [
      'This House believes that nationalism does more harm than good.',
      'This House believes that social media has done more harm than good for democracy.',
      'This House believes that developing countries should prioritise environmental protection over economic growth.',
      'This House believes that influencer culture has harmed young people.',
      'This House believes that charity is a poor substitute for justice.',
      'This House believes that the pursuit of prestige does more harm than good in education.',
      'This House believes that artificial intelligence will do more good than harm for workers.',
      'This House believes that celebrity activism does more good than harm.',
      'This House believes that competitive sports do more good than harm for children.',
      'This House believes that globalization has done more good than harm for cultural diversity.',
    ],
  },
  {
    name: 'Actor motions',
    wording: '“This House, as X, would…” · “This House, as X, believes that…”',
    what: 'Both teams argue from the perspective of a named actor (a country, a movement, an institution). The question is not what is best for the world in general, but what this actor should do given its own interests and values.',
    burden: 'Prove your side is preferable from the actor’s perspective, not from everyone’s.',
    hinge: 'Characterization. The team that builds the more credible picture of the actor’s incentives, constraints, and priorities gets to decide what “winning” means for that actor.',
    slug: 'actor',
    drill: 'Argue from the named actor’s perspective. Drill characterization: incentives, constraints, and what “winning” means for the actor.',
    examples: [
      'This House, as Ukraine, would pursue a ceasefire with Russia.',
      'This House, as the feminist movement, believes that embracing traditional femininity undermines gender equality.',
      'This House, as the environmental movement, would embrace nuclear power.',
      'This House, as a small island nation, would sell citizenship to fund climate adaptation.',
      'This House, as the labor movement, would oppose fully remote work.',
      'This House, as the African Union, would adopt a single continental currency.',
      'This House, as a parent, would prohibit their child from social media until age 16.',
      'This House, as the international art community, would return all colonial-era artifacts to their countries of origin.',
      'This House, as a developing country, would prioritize STEM education over the humanities.',
      'This House, as the scientific community, would refuse to collaborate with militaries.',
    ],
  },
  {
    name: 'Regret motions',
    wording: '“This House regrets…”',
    what: 'A counterfactual: would the world have been better off if the thing named in the motion had never happened? The proposition regrets it; the opposition defends it. Neither side gets to propose fixing it. The debate is about the alternative history.',
    burden: 'Prove the world without X would have been better (or worse) than the world with it.',
    hinge: 'Imaginative but disciplined counterfactual analysis. The critical move is defining the most plausible alternative world. Teams that regret something without saying what would have filled the gap lose to teams that do.',
    slug: 'regret',
    drill: 'Debate the counterfactual world. Drill defining the most plausible alternative history, and holding both teams to it.',
    examples: [
      'This House regrets the professionalisation of sports.',
      'This House regrets the rise of the gig economy.',
      'This House regrets the dominance of the college degree as a hiring signal.',
      'This House regrets the commercialization of space exploration.',
      'This House regrets the rise of true-crime entertainment.',
      'This House regrets the invention of the “like” button.',
      'This House regrets the narrative that hard work guarantees success.',
      'This House regrets the decline of local newspapers.',
      'This House regrets the gamification of education.',
      'This House regrets the rise of fast fashion.',
    ],
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
          <p className="mt-4 leading-relaxed text-navy-700">
            Each type below comes with ten World Schools practice motions, all
            debatable on both sides: forty in total, enough for a season of
            scrimmages, timed prep-hour drills, or solo casebuilding. A good
            session is one motion, one hour of prep, one judged round. For more
            World Schools motions, the full{' '}
            <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
              motion bank
            </Link>{' '}
            has 12,000+ real tournament motions, including{' '}
            <Link href="/motions/wsdc" className="font-semibold text-signal-500 hover:text-signal-600">
              every Worlds motion since 1994
            </Link>
            .
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-500">
                10 {type.name.replace(' motions', '').toLowerCase()} practice motions
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{type.drill}</p>
              <ol className="mt-4 space-y-3">
                {type.examples.map((m, n) => (
                  <li key={m} className="flex gap-4 border-t border-navy-200 pt-3">
                    <span className="stat font-display text-lg font-bold text-signal-500">
                      {String(n + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display italic leading-relaxed text-navy-800">{m}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm">
                <Link
                  href={`/motions?type=${type.slug}#explorer`}
                  className="font-semibold text-signal-500 hover:text-signal-600"
                >
                  Search every {type.name.toLowerCase().replace(' motions', '')} motion in the motion bank
                </Link>
              </p>
            </div>
          </section>
        ))}

        <section className="mt-12 border-t-2 border-navy-900 pt-8">
          <h2 className="text-2xl font-bold text-navy-900">How to get the most out of a practice motion</h2>
          <ol className="mt-6 space-y-4">
            {[
              ['Prep both sides before you pick one.', 'Ten minutes sketching proposition and opposition cases teaches you more about a motion than an hour on one side. It is also what you must do at a tournament before sides are assigned.'],
              ['Run real conditions.', 'One hour, no internet, printed materials only. Practicing with your phone open builds habits that fail on tournament day.'],
              ['Finish with adjudication.', 'A round without feedback is just talking. Have someone judge on the 40/40/20 criteria and give one action item per speaker.'],
              ['Rotate the families.', 'If your team only ever debates policy motions, your first regret motion at a tournament will feel like a different sport. Cycle through all four types.'],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
                <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
                <p className="leading-relaxed text-navy-700">
                  <strong>{title}</strong> {body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 border-t-2 border-navy-900 pt-8">
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
          <p className="mt-8 leading-relaxed text-navy-700">
            Ready to drill? Pick a motion from any list above, and the{' '}
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
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
