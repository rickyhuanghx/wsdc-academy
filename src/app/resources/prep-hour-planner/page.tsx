import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'The 1-Hour Prep Planner: Minute-by-Minute World Schools Debate Prep',
  description:
    'How to use the one-hour prep time in World Schools Debate: a minute-by-minute team plan from motion analysis (0–10) through casebuilding (25–45) to the final sync check (55–60), with a printable checklist.',
  alternates: { canonical: '/resources/prep-hour-planner' },
  openGraph: {
    title: 'The 1-Hour Prep Planner (World Schools Debate)',
    description: 'What your team should be doing at 0:10, 0:25, 0:45, and 0:55 of the impromptu prep hour.',
    url: '/resources/prep-hour-planner',
    type: 'article',
  },
};

const phases = [
  {
    window: '0:00 – 0:10',
    title: 'Understand the motion',
    tasks: [
      'Identify the key words of the motion and what each side must prove (the burdens).',
      'Sketch what each side’s world looks like, visually and concretely.',
      'Name the trade-off at the heart of the debate.',
    ],
  },
  {
    window: '0:10 – 0:25',
    title: 'Set the case',
    tasks: [
      'Decide a clear stance and 2–3 main arguments.',
      'Choose the metric the judge should use to decide the round.',
      'Assign the split: 1–2 arguments for the first speaker, one new argument for the second, responses and weighing for the third.',
      'Draft the caseline: one sentence every speaker can repeat.',
    ],
  },
  {
    window: '0:25 – 0:45',
    title: 'Build the arguments',
    tasks: [
      'Develop each argument to full depth: every mechanism gets reasoning and an example.',
      'Add real-world illustrations and stylistic flair while you build, not after.',
      'Check each argument actually proves your burden. Cut anything that doesn’t.',
    ],
  },
  {
    window: '0:45 – 0:55',
    title: 'Pre-empt the other side',
    tasks: [
      'Predict their strongest rebuttals and POIs; script your answers.',
      'Plan the weighing strategy: which clashes you’ll win, which you’ll concede, and why yours matter more.',
    ],
  },
  {
    window: '0:55 – 1:00',
    title: 'Sync check',
    tasks: [
      'Review the case and its meta-narrative out loud, fast.',
      'Confirm every speaker knows the stance, the split, the metric, and the caseline.',
      'Walk to the round confident. The last five minutes are for calm, not new ideas.',
    ],
  },
];

const pageFaqs = [
  {
    question: 'What are you allowed to use during World Schools prep time?',
    answer:
      'For impromptu motions, teams typically get one hour of preparation with no internet and no electronic devices. Printed materials (case files, almanacs, notes prepared in advance) are allowed, which is why strong teams invest in building them before the tournament.',
  },
  {
    question: 'What is the biggest mistake teams make in the prep hour?',
    answer:
      'Skipping the first ten minutes of burden analysis and jumping straight to brainstorming arguments. Teams that never agree on what the motion actually requires end up with three speeches proving three different things, and the third speaker inherits a debate that cannot be weighed cleanly.',
  },
  {
    question: 'Should the whole team prep every argument together?',
    answer:
      'No. After the stance, split, and metric are set together (by roughly minute 25), speakers develop their own material in parallel and reconvene. The sync check at the end exists precisely so parallel work converges back into one case.',
  },
];

export default function PrepHourPlannerPage() {
  return (
    <>
      <ArticleJsonLd
        title="The 1-Hour Prep Planner: Minute-by-Minute World Schools Debate Prep"
        description="A minute-by-minute team plan for the World Schools impromptu prep hour, with a printable checklist."
        url="/resources/prep-hour-planner"
        datePublished="2026-07-09"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: '1-Hour Prep Planner', href: '/resources/prep-hour-planner' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Practice & prep
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            The 1-hour prep planner
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Impromptu rounds are won in the prep room. You get the motion, one
            hour, no internet, no devices: just your team and whatever printed
            materials you brought. The difference between a coherent case and
            three disconnected speeches is almost always <em>time discipline</em>.
            This is the schedule we train teams to run.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PrintButton label="Print the planner" />
            <span className="text-sm text-navy-500">Tape it inside your case file.</span>
          </div>
        </header>

        <div className="cheat-sheet mt-10 border border-navy-300 bg-white">
          <div className="border-b-2 border-navy-900 px-6 py-5 sm:px-8">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-navy-900">The prep hour, minute by minute</h2>
              <span className="hidden text-xs font-semibold uppercase tracking-wider text-navy-400 sm:block">
                wsdcacademy.com
              </span>
            </div>
          </div>
          <div className="divide-y divide-navy-200">
            {phases.map((phase) => (
              <section key={phase.window} className="px-6 py-5 sm:px-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="stat font-display text-xl font-bold text-signal-500">{phase.window}</span>
                  <h3 className="font-display text-lg font-bold text-navy-900">{phase.title}</h3>
                </div>
                <ul className="mt-3 space-y-2">
                  {phase.tasks.map((task) => (
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

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Why the front of the hour matters most</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Notice the shape of the schedule: a full quarter of the hour passes
            before anyone writes an argument. That is deliberate. Burdens,
            stance, metric, and split are the load-bearing decisions. Every
            minute spent there saves three later, and every minute skipped there
            costs the third speaker a coherent round to weigh. Teams that
            &ldquo;save time&rdquo; by casebuilding immediately are usually the
            ones rewriting their case at minute forty.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            The prep hour also rewards preparation that happened weeks earlier:
            printed case files are legal, so motion-area briefs, example banks,
            and framing notes all travel with you. Fill your speakers&apos;
            sheets faster with the{' '}
            <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              first
            </Link>
            ,{' '}
            <Link href="/resources/second-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              second
            </Link>
            , and{' '}
            <Link href="/resources/third-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              third speaker
            </Link>{' '}
            cheat sheets, and drill the schedule on motions from the{' '}
            <Link href="/resources/practice-motions" className="font-semibold text-signal-500 hover:text-signal-600">
              practice motion bank
            </Link>
            .
          </p>
        </section>

        <section className="print-hide mt-12">
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
        </section>

        <div className="print-hide mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Run the hour under real conditions.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our practice rounds run timed prep on live motions, then a judged
            round, then written feedback on both the case and the clock.
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
