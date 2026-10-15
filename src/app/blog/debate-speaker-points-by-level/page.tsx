import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';
import { ColumnChart } from '@/components/DebateCharts';
import { DATA_LICENSE_URL, StudyDatasetJsonLd } from '@/components/JsonLd';
import { JUDGING_REVIEWER } from '@/data/author';

export const metadata = postMetadata('debate-speaker-points-by-level');

const post = getPostBySlug('debate-speaker-points-by-level')!;

const CSV_PATH = '/data/world-schools-speaker-scores-by-level.csv';

/* Every figure on this page is computed from the 17 public Tabbycat speaker
   tabs listed in the CSV (substantive speeches only, scraped September 2026).
   Re-run the numbers before editing any of them. */

const faqs = [
  {
    question: 'What is a good speaker score in World Schools debate?',
    answer:
      'It depends on the room. Across 12,233 substantive speeches at 17 tournaments, the median was 70.2 and 84% of all speeches scored between 68 and 72. At a beginner tournament a 70 beat about two thirds of the field; at the 2026 world championship it beat about a quarter. Among speakers with three or more speeches, an average of 71.8 or more puts a speaker in the top 10% of the data.',
  },
  {
    question: 'How much do speaker points vary from round to round?',
    answer:
      'More than most students expect. Among 1,928 speakers with four or more scored speeches, the median gap between a speaker’s best and worst round was 2.5 points, and 39% had a gap of 3 points or more. A typical speaker’s scores move by about one point from round to round, which is a large share of the whole scale in practice.',
  },
  {
    question: 'Does a bad first round mean a bad tournament?',
    answer:
      'Usually less bad than it looks. Speakers who scored 68 or lower in their first round averaged 69.0 for the rest of the tournament, and speakers who scored 72 or higher in round one averaged 71.3 afterwards. A four-point gap after one round shrank to about two points by the end.',
  },
  {
    question: 'Why are speaker points so compressed?',
    answer:
      'Judges are trained to anchor on 70 and move for named reasons, and most of them score relative to the field in front of them. The result is that a speech scoring 74 or higher happens about once in every hundred, and about 1 in 300 speeches scores below 65, even though the official range runs from 60 to 80.',
  },
];

/* Percentile of a 70 within each level: share of speeches below 70 plus half
   of the ties at exactly 70. */
const seventyData = [
  { label: 'Beginner', value: 68, sub: '1 tab' },
  { label: 'Junior', value: 62, sub: '1 tab' },
  { label: 'Novice', value: 48, sub: '3 tabs' },
  { label: 'Open intl', value: 43, sub: '7 tabs' },
  { label: 'Pre-WSDC', value: 36, sub: '2 tabs' },
  { label: 'Worlds', value: 28, sub: 'WSDC 2026', highlight: true },
];

const levelRows: [string, string, string, string, string, string][] = [
  // level, tournaments, speeches, median, middle 80%, share 72+
  ['Beginner', 'Beginners WSDC 2026', '191', '69.0', '67.0–71.0', '5.8%'],
  ['Junior', 'IJWSDC 2025', '201', '70.0', '68.0–71.0', '5.0%'],
  ['National (UAE)', 'UAE WSDC 2026', '264', '68.6', '67.0–70.5', '2.7%'],
  ['Novice', 'Novice WSDC 2024, 2025, 2026', '1,285', '70.0', '68.0–72.0', '16.0%'],
  ['Open (international)', '7 open tournaments, 2024–26', '6,805', '70.0', '68.0–72.0', '16.0%'],
  ['Open (US)', 'Penn WSDC 2025', '667', '70.3', '68.5–72.0', '15.9%'],
  ['Pre-WSDC national-team prep', 'Austria WSDC, Seasons Pre-WSDC 2025', '1,100', '70.5', '68.5–72.3', '19.5%'],
  ['National teams', 'WSDC 2026', '1,720', '71.0', '68.7–72.8', '25.3%'],
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

export default function SpeakerPointsByLevelPost() {
  return (
    <>
      <StudyDatasetJsonLd
        name="World Schools debate speaker scores by level, 2024–2026"
        description="Aggregate speaker-score statistics (speeches, speakers, mean, median, 10th and 90th percentile, share scoring 72 or higher) for 12,233 substantive speeches at 17 World Schools tournaments with public Tabbycat speaker tabs, grouped by level from beginner to the world championship."
        url={`/blog/${post.slug}`}
        csvPath={CSV_PATH}
        temporalCoverage="2024/2026"
        variableMeasured={[
          'Speaker score per substantive speech (60–80 scale)',
          'Speeches per tournament',
          'Speakers per tournament',
        ]}
        keywords={['speaker points', 'World Schools debate', 'WSDC speaker scores', 'debate judging']}
        license={DATA_LICENSE_URL}
      />
      <BlogPostShell
        post={post}
        faqs={faqs}
        reviewer={JUDGING_REVIEWER}
        ctaHref="/programs/competition-team"
        ctaLabel="About the Competition Team"
        ctaHeading="Know where your scores really sit."
        ctaBody="Every judged practice round in our programs is scored on the same 60–80 scale, with written feedback, so students learn what moves a 70 to a 72."
        lede={
          <p>
            World Schools speeches are scored from 60 to 80, with 70 as
            average. Our{' '}
            <InLink href="/blog/wsdc-speaker-scores">analysis of the WSDC
            2026 tab</InLink>{' '}
            showed what that looks like at the world championship. This
            time we went wider: 12,233 substantive speeches by 3,047
            speakers at 17 tournaments whose speaker tabs are public, from a
            beginners&apos; tournament to Worlds. The scale turns out to be
            even narrower than the rulebook suggests, the same score means
            very different things at different levels, and a single
            round tells you less than most students think.
          </p>
        }
      >
        <section className="mt-12">
          <div className="grid gap-px overflow-hidden rounded-sm border border-navy-200 bg-navy-200 sm:grid-cols-3">
            {[
              ['84%', 'of all 12,233 speeches scored between 68 and 72'],
              ['1 in 100', 'speeches scored 74 or higher'],
              ['2.5 pts', 'median gap between a speaker’s best and worst round'],
            ].map(([stat, label]) => (
              <div key={label} className="bg-white p-6 text-center">
                <p className="stat font-display text-4xl font-semibold text-signal-500">{stat}</p>
                <p className="mt-2 text-xs leading-relaxed text-navy-600">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            The whole sport fits inside four points
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Pool every speech in the data and the median is 70.2, almost
            exactly the anchor the{' '}
            <InLink href="/world-schools-debate-judging">World Schools
            judging criteria</InLink>{' '}
            set. The spread is the surprise. 84% of speeches landed between
            68 and 72, and 95% between 67 and 73. Only 1.1% reached 74, only
            0.16% reached 75, and about 1 in 300 fell below 65. The
            official scale has twenty points; judges use about six of them.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Averaged across a whole tournament, the ladder is shorter
            still. Among speakers with three or more speeches, the median
            speaker averaged 70.3, the top quarter 71.1 or more, the top
            10% 71.8, and the top 1% 72.9. The best average at any of the
            17 tournaments was 73.7, at Worlds.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            The same 70 means different things at different levels
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            The median speech rises from 69 at the beginners&apos;
            tournament to 71 at the world championship. Two points sounds
            small until you see what it does to a single score. At the
            beginners&apos; tournament, a 70 sat at the 68th percentile of
            all speeches. At WSDC 2026, the same 70 sat at the 28th.
          </p>
          <figure className="my-8">
            <div className="rounded-sm border border-navy-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">Where a 70 lands</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
                Percentile of a 70 among all speeches at each level
              </h3>
              <div className="mt-6">
                <ColumnChart
                  ariaLabel="Percentile of a score of 70 among all speeches: beginner 68, junior 62, novice 48, open international 43, pre-WSDC 36, WSDC 2026 28"
                  max={80}
                  data={seventyData}
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-navy-500">
              Percentile counts speeches below 70 plus half of those at exactly
              70. Beginner, junior and Worlds are one tournament each.
            </figcaption>
          </figure>
          <p className="mt-4 leading-relaxed text-navy-700">
            High scores thin out the same way. A 72 or better was 1 speech in
            17 at the beginners&apos; tournament and 1 in 4 at Worlds. That
            does not mean beginner judges are harsh. Judges mostly score
            against the room they are in, so a beginner who earns a 72 has
            beaten about the same share of their field (96%) as a Worlds
            speaker who earns a 73.5.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="mb-3 text-left text-sm text-navy-500">
                Substantive speeches by level, 17 public tabs, 2024–26
              </caption>
              <thead>
                <tr className="border-b-2 border-navy-200 text-navy-900">
                  <th className="py-2 pr-4 font-semibold">Level</th>
                  <th className="py-2 pr-4 font-semibold">Tournaments</th>
                  <th className="py-2 pr-4 font-semibold">Speeches</th>
                  <th className="py-2 pr-4 font-semibold">Median</th>
                  <th className="py-2 pr-4 font-semibold">Middle 80%</th>
                  <th className="py-2 font-semibold">72 or higher</th>
                </tr>
              </thead>
              <tbody>
                {levelRows.map(([level, tournaments, n, median, mid, high]) => (
                  <tr key={level} className="border-b border-navy-100 text-navy-700">
                    <td className="py-2 pr-4 font-semibold text-navy-900">{level}</td>
                    <td className="py-2 pr-4">{tournaments}</td>
                    <td className="py-2 pr-4">{n}</td>
                    <td className="py-2 pr-4">{median}</td>
                    <td className="py-2 pr-4">{mid}</td>
                    <td className="py-2">{high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            One round tells you less than you think
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            We followed every speaker who gave four or more scored
            speeches at the same tournament, 1,928 of them. The median gap
            between their best and worst round was 2.5 points. Three
            speakers in four had a gap of at least 2 points, and 39% had a
            gap of 3 or more. On a scale where the top 1% of speakers
            average 72.9, that is the difference between an average round
            and a very good one, from the same person in the same week.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            First rounds are the clearest case. Speakers who scored 68 or
            lower in round one averaged 69.0 across their remaining rounds.
            Speakers who scored 72 or higher in round one averaged 71.3
            afterwards. A four-point gap after one round shrank to about
            two by the end of the tournament. Some of that is the draw, the
            motion and the judge; some of it is nerves. Either way, a
            student should read a tournament average, not a single ballot,
            and a coach should look at the written reasons before the
            number. Our{' '}
            <InLink href="/resources/judging-ballot">printable judging
            ballot</InLink>{' '}
            is built around those reasons.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            What this means for a student
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Moving a tournament average from 70 to 71.8 takes a speaker from
            the middle of the data to its top 10%. That is a realistic
            season goal, and it is mostly won on the criteria judges reward
            consistently: clear{' '}
            <InLink href="/blog/weighing-in-debate">weighing</InLink>, a
            case that holds up under rebuttal, and a{' '}
            <InLink href="/blog/reply-speech-world-schools-debate">reply
            speech</InLink>{' '}
            that tells the judge how to decide. For newer debaters in our{' '}
            <InLink href="/programs/foundations">Foundation
            classes</InLink>, the round-to-round numbers above point to the
            first job: narrow the gap between bad rounds and good ones
            before chasing great ones.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            Data, method and caveats
          </h2>
          <div className="mt-6 rounded-sm border border-navy-200 bg-cream p-6">
            <ul className="space-y-3 text-navy-700">
              {[
                ['Source.', 'Public Tabbycat speaker tabs for 17 World Schools tournaments held 2024–26, collected in September 2026. Each tab URL is listed in the download below. Only substantive speeches (scored 60–80) are counted; reply speeches and elimination rounds are not in these tabs.'],
                ['Levels.', 'We grouped tournaments by who enters them: beginner, junior, novice, open, pre-WSDC national-team preparation, and the world championship. The UAE national tournament is shown on its own. Beginner, junior, UAE and Worlds are one tournament each, so treat those rows as single examples, not averages for the level.'],
                ['Comparisons.', 'Judges score partly relative to the field, so a median at one level is not a measure of the same skill at another. The percentile figures describe where a score sits within each tournament’s own speeches.'],
                ['Privacy.', 'Tabs name speakers publicly, but we publish no names and the download holds aggregates only.'],
                ['Gaps.', 'The WSDC 2024 and 2025 speaker tabs are not public, so the world championship row is 2026 only.'],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3 border-t border-navy-200 pt-3 first:border-t-0 first:pt-0">
                  <span className="text-sm leading-relaxed">
                    <strong className="text-navy-900">{title}</strong> {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 leading-relaxed text-navy-700">
            Download the per-tournament figures:{' '}
            <a
              href={CSV_PATH}
              download
              className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
            >
              world-schools-speaker-scores-by-level.csv
            </a>
            . The figures are free to reuse under{' '}
            <a
              href={DATA_LICENSE_URL}
              rel="license"
              className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
            >
              CC BY 4.0
            </a>
            : credit &ldquo;WSDC Prep analysis of 17 public World Schools
            speaker tabs, 2024–26&rdquo; and link to this page.
          </p>
        </section>
      </BlogPostShell>
    </>
  );
}
