import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';
import { ColumnChart, RankedBars, WaffleGrid } from '@/components/DebateCharts';

export const metadata = postMetadata('does-debate-help-college-admissions');

const post = getPostBySlug('does-debate-help-college-admissions')!;

const faqs = [
  {
    question: 'Does debate actually help with college admissions?',
    answer:
      'The strongest data we have points firmly to yes. Team USA, the national World Schools team, publishes a complete alumni archive: of the 42 members from the classes of 2014 to 2020 with a listed college, 71% attended an Ivy, a US-News Top-30 university, or Oxford or Cambridge, against a roughly 5% general Ivy acceptance rate. That is a base rate rather than a controlled study, so part of the gap is who these students already were, but the association is very large and very consistent.',
  },
  {
    question: 'Which universities do top World Schools debaters go to?',
    answer:
      'For Team USA it is a Harvard story: Harvard alone took 8 of the 42 alumni, ahead of Yale, Penn, Columbia, and Stanford. Across the wider global field of world-championship speakers, Oxford is the single most common elite destination, followed by Harvard and Stanford, reflecting the Commonwealth pipeline from the UK, Australia, South Africa, India, and Malaysia.',
  },
  {
    question: 'Is the boost caused by debate, or just the kind of student who debates?',
    answer:
      'Both, and the honest answer is that we cannot fully separate them here. Debaters who make national teams were already strong students, so debate amplifies and showcases an existing profile more than it manufactures one. Proving that debaters place better than comparable non-debaters would need a matched control group, which this analysis does not have. Read it as "top debate travels with elite admission," not "debate guarantees it."',
  },
  {
    question: 'Do you have to make a national team for debate to help?',
    answer:
      'No. The national-team cohort is simply the cleanest group to measure. The wider pattern, that the skills debate builds line up almost one-to-one with what selective admissions screen for, applies to any serious competitor. Most World Schools debating in the US runs through school squads, state divisions, and the Tournament of Champions circuit, not the national team.',
  },
];

/* All figures below are the study's verified numbers. */
const gapData = [
  { label: 'General applicant', value: 5, sub: 'Ivy acceptance', muted: true },
  { label: 'WSDC Top 50', value: 41, sub: 'global, traced' },
  { label: 'WSDC Top 10', value: 62, sub: 'global, traced' },
  { label: 'Team USA', value: 71, sub: 'complete cohort', highlight: true },
];

const usaDestinations = [
  { label: 'Harvard', value: 8, elite: true },
  { label: 'Yale', value: 3, elite: true },
  { label: 'UPenn', value: 3, elite: true },
  { label: 'George Washington', value: 3, elite: false },
  { label: 'Columbia / Barnard', value: 2, elite: true },
  { label: 'Stanford', value: 2, elite: true },
  { label: 'UT Austin', value: 2, elite: true },
  { label: '10 more elite (×1)', value: 10, elite: true },
  { label: '9 more others (×1)', value: 9, elite: false },
];

const funnelData = [
  { label: 'Top-50 finishes scraped', value: 298, colorClass: 'fill-navy-300' },
  { label: 'University confirmed', value: 68, colorClass: 'fill-navy-700' },
  { label: 'At an elite university', value: 28, colorClass: 'fill-signal-500' },
];

const tierData = [
  { label: 'Top 10', value: 62, sub: '8 of 13', highlight: true },
  { label: 'Ranks 11–25', value: 37, sub: '11 of 30' },
  { label: 'Ranks 26–50', value: 36, sub: '9 of 25' },
];

const yearlyData = [
  { label: '2013', value: 38 },
  { label: '2014', value: 31 },
  { label: '2015', value: 50 },
  { label: '2016', value: 33 },
  { label: '2017', value: 57 },
  { label: '2018', value: 50 },
  { label: '2024', value: 67, sub: 'emerging', muted: true },
];

const strict = [
  { title: 'General applicant', big: '~5', cap: 'Ivy or Oxbridge admit', pct: 5 },
  { title: 'Top-10 WSDC speaker', big: '54', cap: '7 of 13 traced', pct: 54 },
  { title: 'Team USA speaker', big: '43', cap: '18 of 42 alumni', pct: 43 },
];

export default function DoesDebateHelpAdmissionsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/private-coaching"
      ctaLabel="See 1-on-1 coaching"
      ctaHeading="Build the profile that travels."
      ctaBody="Our coaches train the argument, composure, and range that selective admissions reward. Book a consultation and we will find the right starting point."
      lede={
        <p>
          Ask an admissions officer what they want and you hear the same words:
          argument, curiosity, composure, the ability to think on your feet. Those
          happen to be exactly what competitive debate drills, every round. So it is
          worth asking what that training is actually worth when the letters arrive.
          We traced the world&apos;s best schools debaters, a complete national-team
          cohort and the messier global field, to the universities they reached. Both
          tell the same story, and it starts with the outcome.
        </p>
      }
    >
      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">The cleanest case</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">
          71% of Team USA&apos;s alumni went to an elite university
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Start with the group whose outcomes are cleanest:{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            Team USA
          </Link>
          . USA Debate publishes an alumni archive naming every past national-team
          member and the university they attended. Because it is a complete record
          kept by the program itself, it dodges the deepest flaw in this kind of
          analysis, that you usually only count the people who are easy to find. For
          the classes of 2014 to 2020, that is 42 alumni with a confirmed college.
        </p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-navy-200 bg-navy-200 sm:grid-cols-3">
          {[
            ['71%', 'of Team USA alumni went to an Ivy, US Top-30, or Oxbridge school'],
            ['~5%', 'general-applicant benchmark (Ivy League acceptance rate)'],
            ['42 of 42', 'a complete cohort, with no missing-data bias'],
          ].map(([stat, label]) => (
            <div key={label} className="bg-white p-6 text-center">
              <p className="stat font-display text-4xl font-semibold text-signal-500">{stat}</p>
              <p className="mt-2 text-xs leading-relaxed text-navy-600">{label}</p>
            </div>
          ))}
        </div>

        <figure className="my-10">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">The gap</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
              Roughly 8–14× more likely to reach an elite university
            </h3>
            <p className="mt-1 text-sm text-navy-400">
              Share attending an Ivy, US Top-30, or Oxbridge school, by cohort
            </p>
            <div className="mt-6">
              <ColumnChart
                data={gapData}
                max={80}
                ariaLabel="Elite-university rate by cohort: general applicant 5 percent, WSDC top 50 41 percent, WSDC top 10 62 percent, Team USA 71 percent."
              />
            </div>
            <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-navy-400">
              n: Team USA 42 · global Top-10 13 · global Top-50 68. Baseline: Ivy acceptance about 5% (Class of 2028).
            </p>
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-navy-500">
            The more selective the group, the wider the gap. Team USA, the only cohort
            we can measure in full, reaches 71%.
          </figcaption>
        </figure>

        <p className="leading-relaxed text-navy-700">
          For Team USA it is a Harvard story, not the Oxford one that leads the global
          field. Harvard alone took <strong>eight</strong> of the 42, more than twice
          any other school.
        </p>

        <figure className="my-10">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">Destinations</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
              Where Team USA&apos;s debaters actually went
            </h3>
            <p className="mt-1 text-sm text-navy-400">USA Debate alumni by college, classes of 2014 to 2020 (n = 42)</p>
            <div className="mb-4 mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-navy-700">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-signal-500" />
                Ivy / Top-30 / Oxbridge
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-navy-400" />
                Other university
              </span>
            </div>
            <RankedBars
              data={usaDestinations}
              max={10}
              ariaLabel="Team USA alumni by college: Harvard 8, Yale 3, UPenn 3, George Washington 3, Columbia or Barnard 2, Stanford 2, UT Austin 2, ten more elite schools once each, nine more other schools once each."
            />
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-navy-500">
            The dozen outside the elite band still went to strong schools. George
            Washington took three; the rest spread across schools like Boston
            University, Rutgers, Indiana, and Smith.
          </figcaption>
        </figure>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">Why it works</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">Debate trains what admissions officers screen for</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          These numbers are not magic; they track a mechanism. A{' '}
          <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            World Schools round
          </Link>{' '}
          gives you eight minutes to build a case on a motion you first saw an hour
          ago, then defend it live against opponents and judges from thirty countries.
          Do that for years and you develop a specific, transferable toolkit, and it
          lines up almost one-to-one with what selective admissions reward.
        </p>
        <div className="mt-6 rounded-sm border border-navy-200 bg-cream p-6">
          <h3 className="font-display text-lg font-semibold text-navy-900">
            What debate builds, and what universities look for
          </h3>
          <ul className="mt-4 space-y-3 text-navy-700">
            {[
              ['Argument and reasoning', 'the analytical spine of a strong personal essay and supplement.'],
              ['Rapid research and evidence', 'academic readiness, and ease with unfamiliar, complex material.'],
              ['Public speaking and composure', 'interviews, and the confidence that surfaces in recommendations.'],
              ['Listening and rebuttal', 'intellectual flexibility: engaging a counter-view instead of dodging it.'],
              ['A national or international team', 'a rare, verifiable achievement that anchors an application.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3 border-t border-navy-200 pt-3 first:border-t-0 first:pt-0">
                <span className="leading-relaxed">
                  <strong className="text-navy-900">{title}</strong>: {body}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 leading-relaxed text-navy-700">
          None of these is unique to debate, but few activities bundle so many of the
          signals together, and fewer still produce a credential as legible as
          &ldquo;represented my country at the world championship.&rdquo; That bundle
          is the effect the charts are measuring.
        </p>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">Does it generalize?</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">The global field points the same way</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Team USA is a small, strong slice. To test the pattern, we ran the same trace
          on the full top-50 tabs of six championships from 2013 to 2018, messier,
          because the rest of the world&apos;s debaters do not come with an alumni page.
          We began with <strong>298 top-50 finishes</strong> and recorded a university
          only on corroboration from public sources. The drop to 68 confirmed is mostly{' '}
          <em>unverified</em>, not disproven: a mid-project search limit under-traced
          2017 and 2018.
        </p>

        <figure className="my-10">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">Method</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
              From 298 speaker finishes to a verified core of 68
            </h3>
            <p className="mt-1 text-sm text-navy-400">
              Tracing global top-50 speakers to a corroborated university (2013 to 2018)
            </p>
            <div className="mt-6">
              <RankedBars
                data={funnelData}
                max={298}
                ariaLabel="Of 298 top-50 finishes scraped, 68 had a university confirmed, and 28 of those were at an elite university."
              />
            </div>
            <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-navy-400">
              Of the 68 we could place, 28 (41%) reached an elite university, a floor, since
              the untraced names are missing, not ordinary.
            </p>
          </div>
        </figure>

        <figure className="my-10">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">The top-10 cliff</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
              Cracking the world&apos;s top 10 roughly doubles the elite rate
            </h3>
            <p className="mt-1 text-sm text-navy-400">Elite-admission rate by finishing position, global</p>
            <div className="mt-6">
              <ColumnChart
                data={tierData}
                max={80}
                ariaLabel="Elite rate by finishing position: top 10 62 percent, ranks 11 to 25 37 percent, ranks 26 to 50 36 percent."
              />
            </div>
            <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-navy-400">
              The lift is concentrated at the very top. Ranks 11–25 and 26–50 are
              near-identical.
            </p>
          </div>
        </figure>

        <figure className="my-10">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">Consistency</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
              The edge holds at every championship across a decade
            </h3>
            <p className="mt-1 text-sm text-navy-400">Elite-admission rate of traced top-50 speakers, by year</p>
            <div className="mt-6">
              <ColumnChart
                data={yearlyData}
                max={80}
                baseline={5}
                baselineLabel="general ~5%"
                ariaLabel="Elite rate by championship year, all far above the 5 percent general benchmark, ranging from 31 percent in 2014 to 67 percent in the emerging 2024 cohort."
              />
            </div>
            <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-navy-400">
              Ten years, seven championships, never near the 5% baseline. 2024 is an
              emerging cohort with partial coverage.
            </p>
          </div>
        </figure>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">The strict test</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">
          Even by the toughest definition, the gap barely moves
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Narrow &ldquo;elite&rdquo; to just the eight Ivies plus Oxford and Cambridge,
          with no Stanford, no MIT, no state flagships. The base rates still do not
          touch. Each grid below is 100 students.
        </p>
        <figure className="my-10">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <div className="grid gap-8 sm:grid-cols-3">
              {strict.map((s) => (
                <div key={s.title}>
                  <h4 className="text-sm font-semibold text-navy-900">{s.title}</h4>
                  <p className="mt-1 font-display text-3xl font-semibold text-signal-500">
                    {s.big}
                    <span className="text-base text-navy-400"> in 100</span>
                  </p>
                  <p className="mb-3 text-xs text-navy-400">{s.cap}</p>
                  <WaffleGrid pct={s.pct} ariaLabel={`${s.title}: ${s.big} in 100 admitted to an Ivy or Oxbridge school.`} />
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-navy-100 pt-3 text-xs text-navy-400">
              Ivy or Oxbridge only. Broaden to add US Top-30 and the rates rise to 62%
              and 71%.
            </p>
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-navy-500">
            Drop Stanford, MIT, and every state flagship, and top debaters still clear
            the bar roughly 9 to 11 times more often than the field.
          </figcaption>
        </figure>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">Method</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">How we built this</h2>
        <div className="mt-6 rounded-sm border border-navy-200 bg-cream p-6">
          <ul className="space-y-3 text-navy-700">
            {[
              ['Team USA.', 'USA Debate’s complete public alumni archive (classes 2014 to 2020, n = 42) lists each member’s university, so the 71% is a full-cohort rate with no missing-data bias.'],
              ['Global field.', 'Official top-50 speaker tabs for 2013, 2014, 2015, 2017, and 2018, plus the 2016 top-20, about 298 finishes, and the emerging 2024 cohort. Each finisher was traced to a university only when a public source corroborated it. Unverified names were excluded, and no individual names are published here.'],
              ['Definition.', '"Elite" means the eight Ivies, US-News Top-30 National Universities, and Oxford and Cambridge. Baseline is the Ivy League average acceptance rate of about 5% (Class of 2028).'],
              ['Coverage.', 'The global figures are floors. A mid-project research limit under-traced 2017 and 2018, so those years are undercounts.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3 border-t border-navy-200 pt-3 first:border-t-0 first:pt-0">
                <span className="leading-relaxed text-sm">
                  <strong className="text-navy-900">{title}</strong> {body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">How much can debate claim?</p>
        <h2 className="mt-2 text-2xl font-bold text-navy-900">A powerful amplifier, not a guarantee</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The effect is real, but its size deserves honesty, for students deciding
          where to spend their years, and for anyone selling the activity. Three things
          to hold in mind:
        </p>
        <div className="mt-6 rounded-sm border border-navy-200 bg-cream p-6">
          <ul className="space-y-3 text-navy-700">
            {[
              ['It amplifies more than it creates.', 'These debaters were strong students before they made a team, so much of the gap is who they already were. Debate sharpens and showcases that profile; it does not conjure one from nothing.'],
              ['No control group.', 'To prove debaters place better than comparable non-debaters you would need a matched comparison. This is a base rate, so the true causal lift is smaller than the raw gap.'],
              ['The metrics differ slightly.', 'The 5% baseline is an acceptance rate; the debater figures are attendance. The scale of the gap is real. Read it as "top debate travels with elite admission," not "debate guarantees it."'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3 border-t border-navy-200 pt-3 first:border-t-0 first:pt-0">
                <span className="leading-relaxed text-sm">
                  <strong className="text-navy-900">{title}</strong> {body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-signal-500">The bottom line</p>
        <blockquote className="mt-4 border-l-4 border-signal-500 pl-5">
          <p className="font-display text-2xl font-semibold leading-snug text-navy-900">
            Debate will not hand a student an acceptance, but it develops and broadcasts
            the exact qualities that earn one.
          </p>
        </blockquote>
        <p className="mt-6 leading-relaxed text-navy-700">
          For a family weighing the years and the airfare, that is the honest frame:
          competitive debate is a rigorous arena that builds and showcases what
          selective admissions reward, argument under pressure, composure, and range,
          and top performers reach elite universities at many times the normal rate. It
          compounds a strong profile powerfully. It does not manufacture one from
          nothing. For the right student, few investments do more. If you want to see
          what that training looks like week to week, here are our{' '}
          <Link href="/programs" className="font-semibold text-signal-500 hover:text-signal-600">
            World Schools programs
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
