import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';
import { ColumnChart, GroupedColumnChart } from '@/components/DebateCharts';

export const metadata = postMetadata('debate-motion-trends');

const post = getPostBySlug('debate-motion-trends')!;

const faqs = [
  {
    question: 'What do THW, THBT, THR, THS, THO, and THP mean in debate?',
    answer:
      'They abbreviate the standard motion openings: THW is "This House would" (the House commits to an action), THBT is "This House believes that" (a claim to be proven), THR is "This House regrets" (a judgment that something that happened, or a trend, was bad), THS is "This House supports", THO is "This House opposes", and THP is "This House prefers" (a comparison between two worlds). "The House" is the debating chamber itself, a convention inherited from parliamentary procedure.',
  },
  {
    question: 'What is an info slide in debate?',
    answer:
      'A short text released alongside the motion that defines a term, supplies necessary background, or sets the scenario, so that both teams debate the same thing. Info slides were rare before the 2010s and now accompany nearly half of newly recorded motions, which changes prep: reading the slide carefully is now the first task of the prep hour, because the slide often narrows the debate more than the motion does.',
  },
  {
    question: 'What is the most common type of debate motion?',
    answer:
      'In recorded motions from the 2020s, value motions (prove a claim or judgment) are the most common at roughly half, followed by policy motions (defend an action) at just under a fifth, with regret and actor motions each around a tenth. Twenty years earlier the split was policy and value in roughly equal halves, with regret and actor motions barely existing.',
  },
  {
    question: 'Where do these numbers come from?',
    answer:
      'From the 12,416 real tournament motions in our motion bank, compiled from public records: the MIT hello-motions dataset, direct harvests of public Tabbycat tournament sites, and the official WSDC motion archive. Every statistic is a share of recorded motions in an era, and the article states each era’s sample size; coverage is thinner before 2010, and skews toward tournaments that publish their tabs.',
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

const ERAS = ['1994–2009', '2010–14', '2015–19', '2020–26'];

export default function DebateMotionTrendsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/competition-team"
      ctaLabel="About the Competition Team"
      ctaHeading="We train for the motions being set now."
      ctaBody="Our practice rounds are drawn from the same bank this data comes from, weighted toward the judgment motions and info slides that decide modern tournaments."
      lede={
        <p>
          Our{' '}
          <InLink href="/motions">motion bank</InLink>{' '}
          holds 12,416 real
          tournament motions from 1994 to 2026, compiled from public
          records. Treated as a dataset, it shows the sport changing
          under debaters&apos; feet: &ldquo;This House would&rdquo;
          motions have fallen from half of all recorded motions to a
          sixth, judgment motions (regrets, prefers, opposes, supports)
          have grown from a rounding error to more than a quarter, info
          slides went from novelty to nearly half of new motions, and
          the topics quietly rotated. Here is what the data shows, and
          what it means for how debaters should train. Sample sizes by
          era: 269 recorded motions from 1994–2009, then 3,171
          (2010–14), 2,629 (2015–19), and 6,347 (2020–26).
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What happened to &ldquo;This House would&rdquo;?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The classic policy opening has been in steady decline for
          twenty years. Half of recorded motions before 2010 started
          with THW; in the 2020s, one in six does.
        </p>
        <div className="mt-6">
          <ColumnChart
            ariaLabel='Share of recorded motions opening with "This House would", by era: 49.8% in 1994–2009, 41.5% in 2010–14, 25.7% in 2015–19, 16.1% in 2020–26'
            max={60}
            data={[
              { label: ERAS[0], value: 49.8 },
              { label: ERAS[1], value: 41.5 },
              { label: ERAS[2], value: 25.7 },
              { label: ERAS[3], value: 16.1, highlight: true },
            ]}
          />
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          What replaced it is the judgment family: &ldquo;This House
          regrets&rdquo; (0.4 percent of motions before 2015, 10.1
          percent in the 2020s), &ldquo;This House prefers&rdquo;
          (essentially nonexistent before 2015, now 7.4 percent),
          &ldquo;supports&rdquo; (7.4 percent) and
          &ldquo;opposes&rdquo; (3.9 percent). Together the four went
          from under 2 percent of recorded motions to 28.8 percent.
        </p>
        <div className="mt-6">
          <ColumnChart
            ariaLabel="Combined share of regrets, prefers, supports, and opposes motions by era: 1.5%, 1.8%, 15.0%, 28.8%"
            max={35}
            data={[
              { label: ERAS[0], value: 1.5 },
              { label: ERAS[1], value: 1.8 },
              { label: ERAS[2], value: 15.0 },
              { label: ERAS[3], value: 28.8, highlight: true },
            ]}
          />
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          The remainder splits between &ldquo;This House believes
          that&rdquo; (still the single biggest opening at 26.4 percent,
          though down from 39) and motions not phrased with
          &ldquo;This House&rdquo; at all, a steady quarter of records
          since 2010, mostly from leagues and formats that write
          resolutions in plain language.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Policy motions have halved
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Classifying by what the motion asks you to prove rather than
          its opening words tells the same story more sharply. Policy
          motions (defend an action and a model) fell from roughly half
          of recorded motions to 18.8 percent; value motions (prove a
          claim or a judgment) held around half throughout and now lead
          at 50.1 percent. Regret motions grew tenfold, from 1.1 to
          10.7 percent, and actor motions (what should X do, argued
          from X&apos;s interests) went from essentially unrecorded to
          9.4 percent.
        </p>
        <div className="mt-6">
          <GroupedColumnChart
            ariaLabel="Policy versus value motion share by era. Policy: 49.8%, 43.0%, 29.9%, 18.8%. Value: 47.6%, 39.9%, 47.6%, 50.1%."
            max={60}
            seriesA="Policy motions"
            seriesB="Value motions"
            data={[
              { label: ERAS[0], a: 49.8, b: 47.6 },
              { label: ERAS[1], a: 43.0, b: 39.9 },
              { label: ERAS[2], a: 29.9, b: 47.6 },
              { label: ERAS[3], a: 18.8, b: 50.1 },
            ]}
          />
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          For a debater, the practical difference is where rounds are
          won. A policy round turns on a model and its consequences; a
          judgment round turns on framing and{' '}
          <InLink href="/blog/weighing-in-debate">weighing</InLink>,
          because both sides usually concede the facts and fight about
          what they mean. A training diet built on THW motions, which
          is what most older prep material teaches, underprepares
          students for a third of the modern card. The{' '}
          <InLink href="/resources/motion-types">motion types
          reference</InLink> breaks down what each type demands.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          The info-slide era
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The sharpest change in the data is the rise of the info
          slide, the short background text released with the motion.
          Under 1 percent of recorded motions before 2010 carried one.
          In the 2020s, 45 percent do.
        </p>
        <div className="mt-6">
          <ColumnChart
            ariaLabel="Share of recorded motions with an info slide by era: 0.7%, 3.4%, 16.8%, 45.0%"
            max={55}
            data={[
              { label: ERAS[0], value: 0.7 },
              { label: ERAS[1], value: 3.4 },
              { label: ERAS[2], value: 16.8 },
              { label: ERAS[3], value: 45.0, highlight: true },
            ]}
          />
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          Info slides let setters run debates on specific, technical,
          or invented scenarios without punishing students who lack
          niche knowledge, and their spread is probably one cause of
          the trends above: a slide can carry the background a
          judgment motion needs. They also changed prep. The slide
          often narrows the debate more than the motion does, so
          reading it closely is now minute one of the{' '}
          <InLink href="/resources/prep-hour-planner">prep
          hour</InLink>. Motions have grown to match: the median
          recorded motion is 14 words long in the 2020s, up from 10 in
          the 1990s and 2000s. You can drill specifically on
          slide-bearing motions in the{' '}
          <InLink href="/motions?infoslide=1#explorer">motion
          explorer</InLink>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Which topics rose, and which fell
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Topic shares move more slowly than phrasing, but three shifts
          stand out. War and security motions fell by more than half,
          from 13.4 percent of topic tags before 2010 to 5.6 percent in
          the 2020s. Feminism and gender motions roughly doubled after
          2010 (5.5 to about 9 percent, where they have stayed).
          Education motions tripled, from 2.1 to 6.5 percent. Economics
          is the quiet constant, always near the top and leading the
          2020s at 11.6 percent, just ahead of international relations
          at 10.5. And one absence is genuinely surprising: environment
          motions have never exceeded about 2 percent of recorded
          motions in any era, climate salience notwithstanding, which
          makes them exactly the kind of underprepped area the{' '}
          <InLink href="/resources/debate-research-system">research
          system</InLink> tells you to read against.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          How the numbers were computed
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Every figure is a share of the recorded motions in an era in
          our{' '}
          <InLink href="/motions">motion bank</InLink>: 12,416 motions
          from 1,269 tournaments, compiled from the MIT hello-motions
          dataset, direct harvests of public Tabbycat tournament sites,
          and the official WSDC archive. Two honest caveats. Coverage
          is far thinner before 2010 (269 motions), so early-era
          figures are indicative rather than precise. And the record
          skews toward tournaments that publish tabs online, which
          over-represents the university-influenced circuits that adopt
          conventions like info slides earliest; the true averages
          across every school tournament on Earth are probably a step
          behind the trend lines here, moving the same direction. Motion
          text is verbatim from the sources throughout; classification
          into openings, types, and topics is ours.
        </p>
      </section>
    </BlogPostShell>
  );
}
