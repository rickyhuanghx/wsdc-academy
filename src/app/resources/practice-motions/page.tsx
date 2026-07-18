import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: '40 World Schools Debate Practice Motions (By Motion Type)',
  description:
    'A free bank of 40 World Schools Debate practice motions organized by type (10 policy, 10 value, 10 actor, and 10 regret motions) for scrimmages, prep-time drills, and casebuilding practice.',
  alternates: { canonical: '/resources/practice-motions' },
  openGraph: {
    title: '40 World Schools Debate Practice Motions',
    description: 'Ten motions each: policy, value, actor, and regret. Enough for a season of scrimmages.',
    url: '/resources/practice-motions',
    type: 'article',
  },
};

const motionBank: { type: string; note: string; motions: string[] }[] = [
  {
    type: 'Policy motions',
    note: 'Proposition must model the policy; opposition may countermodel. Drill implementation detail and real-world consequences.',
    motions: [
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
    type: 'Value motions',
    note: 'No model to defend: win the framework. Drill metrics, moral weighing, and framing.',
    motions: [
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
    type: 'Actor motions',
    note: 'Argue from the named actor’s perspective. Drill characterization: incentives, constraints, and what “winning” means for the actor.',
    motions: [
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
    type: 'Regret motions',
    note: 'Debate the counterfactual world. Drill defining the most plausible alternative history, and holding both teams to it.',
    motions: [
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

export default function PracticeMotionsPage() {
  return (
    <>
      <ArticleJsonLd
        title="40 World Schools Debate Practice Motions (By Motion Type)"
        description="A free motion bank: 10 policy, 10 value, 10 actor, and 10 regret motions for World Schools practice."
        url="/resources/practice-motions"
        datePublished="2026-07-09"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Practice Motions', href: '/resources/practice-motions' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Practice & prep
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            40 practice motions, by type
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Ten motions in each of the{' '}
            <Link href="/resources/motion-types" className="font-semibold text-signal-500 hover:text-signal-600">
              four motion families
            </Link>
            , all debatable on both sides. Use them for full scrimmages, timed{' '}
            <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
              prep-hour drills
            </Link>
            , or solo casebuilding practice. A good session is one motion,
            one hour of prep, one judged round.
          </p>
        </header>

        {motionBank.map((group) => (
          <section key={group.type} className="mt-12 border-t-2 border-navy-900 pt-8">
            <h2 className="text-2xl font-bold text-navy-900">{group.type}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">{group.note}</p>
            <ol className="mt-6 space-y-3">
              {group.motions.map((motion, i) => (
                <li key={motion} className="flex gap-4 border-t border-navy-200 pt-3">
                  <span className="stat font-display text-lg font-bold text-signal-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display italic leading-relaxed text-navy-800">{motion}</span>
                </li>
              ))}
            </ol>
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

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Motions are free. Judged rounds are the product.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Every week our students debate motions like these in full judged
            rounds, with oral adjudication and written feedback after every one.
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
