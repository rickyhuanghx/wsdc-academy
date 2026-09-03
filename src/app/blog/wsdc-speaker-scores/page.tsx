import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';
import { ColumnChart } from '@/components/DebateCharts';

export const metadata = postMetadata('wsdc-speaker-scores');

const post = getPostBySlug('wsdc-speaker-scores')!;

const faqs = [
  {
    question: 'What is a good speaker score in World Schools debate?',
    answer:
      'At the 2026 World Championships, the average ranked speaker averaged 70.8 per substantive speech and the middle half of the field sat between 69.7 and 71.7. Anything holding above 72 per speech was top-50-in-the-world territory, and above 73 was top ten. At national and school tournaments the same 60–80 scale applies with 70 as the anchor, so a consistent 72–73 is an excellent score almost anywhere.',
  },
  {
    question: 'What does the best speaker at WSDC score?',
    answer:
      'The 2026 championship’s top speaker averaged 73.72 across six preliminary-round speeches. No ranked speaker at the tournament averaged above 74. The scale is far more compressed than newcomers assume: the best debater in the world sits about three points above the tournament average, not ten, so judges treat small, consistent differences as decisive.',
  },
  {
    question: 'How many wins do you need to break at WSDC?',
    answer:
      'In each of the last three championships (2024, 2025, 2026), the lowest-ranked breaking teams had 4 wins from 8 preliminary rounds, with speaker points deciding which 4-win teams advanced. In 2025, all thirteen 5-win teams broke and only 3 of sixteen 4-win teams did. An even record keeps you alive at Worlds, but only with strong speaks.',
  },
  {
    question: 'Are WSDC speaker tabs public?',
    answer:
      'Not consistently. The 2026 championship published its full speaker tab; the 2025 and 2024 championships never released theirs (the standings pages are permission-locked). Team break data is public for all three years, which is why break statistics here cover 2024–26 while speaker-score statistics come from 2026 alone.',
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

export default function WsdcSpeakerScoresPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/competition-team"
      ctaLabel="About the Competition Team"
      ctaHeading="We score every practice round on this scale."
      ctaBody="Our students get 40/40/20 scores and written feedback after every judged round, so they always know where they sit on the band that decides real tournaments."
      lede={
        <p>
          Every World Schools debater is told that speeches are scored
          from 60 to 80 with 70 as average. Almost nobody has seen what
          that actually produces at the top of the sport, because
          championship speaker tabs are rarely published. The 2026 World
          Schools Debating Championships in Nairobi released its full
          tab, so we computed the statistics: 334 ranked speakers across
          eight preliminary rounds, a true average of 70.8, a world
          number one at 73.7, and an entire world championship separated
          by about six points. That compression changes how a debater
          should read their own scores.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          The real distribution
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Across the 334 speakers with at least one scored speech, the
          mean average score was 70.80 and the median 70.98, almost
          exactly the 70 the{' '}
          <InLink href="/world-schools-debate-judging">judging
          criteria</InLink> prescribe as average. The middle half of the
          field averaged between 69.71 and 71.74, a spread of two
          points. The lowest ranked average at the entire world
          championship was 67.22 and the highest 73.72: every speaker
          on Earth good enough to be at Worlds fit inside six and a
          half points.
        </p>
        <div className="mt-6">
          <ColumnChart
            ariaLabel="Points above the WSDC 2026 tournament mean of 70.8: median speaker +0.2, 75th percentile +0.9, top-50 cutoff +1.4, top-10 cutoff +2.3, number one speaker +2.9"
            max={3.5}
            unit=" pts"
            data={[
              { label: 'Median', value: 0.2 },
              { label: '75th pct', value: 0.9 },
              { label: 'Top 50', value: 1.4 },
              { label: 'Top 10', value: 2.3 },
              { label: 'No. 1', value: 2.9, highlight: true },
            ]}
          />
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          Read as distance above the tournament average, the whole
          ladder to the top of the sport is under three points. Making
          the top 50 in the world took an average of 72.20; the top ten
          took 73.13; the number one speaker, an American, averaged
          73.72 with a standard deviation of about a third of a point,
          which is its own lesson: the best tab in the world was built
          on consistency, not spikes. (He is the same speaker named
          best in the world on our{' '}
          <InLink href="/wsdc-champions">championship results
          page</InLink>.)
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Why a two-point gap is enormous
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Parents and students new to the format often read a 71
          against a 73 as &ldquo;basically the same speech.&rdquo; The
          tab says otherwise: two points per speech is the difference
          between the middle of the world championship and its top ten.
          Judges are trained for this compression, and it is
          why our{' '}
          <InLink href="/resources/judging-ballot">printable judging
          ballot</InLink>{' '}
          anchors new judges on 70 and asks them to
          move for named reasons. It also reframes improvement: a
          season that moves your average from 70 to 72 has not gained
          you &ldquo;two marks,&rdquo; it has moved you most of the
          distance from an average Worlds speaker toward the top fifty.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What it takes to break at Worlds
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The championship&apos;s public break data adds the team-level
          picture, and it is consistent across three straight years: in
          2024 (68 teams, breaking 32), 2025 (59 teams, breaking 24),
          and 2026 (74 teams, breaking 32), the last teams into
          elimination rounds had 4 wins from 8 preliminary rounds, with
          total speaker points deciding which even-record teams
          advanced. The 2025 standings, the one year full team records
          are public, show how brutal that tiebreak is: all thirteen
          teams on 5 wins broke, and only three of the sixteen teams on
          4 wins joined them. An even record keeps a team alive at
          Worlds; speaker points decide whether it survives. That is
          the practical case for treating style and strategy marks as
          seriously as wins all season, and for knowing the{' '}
          <InLink href="/blog/reply-speech-world-schools-debate">reply
          speech</InLink> and{' '}
          <InLink href="/blog/weighing-in-debate">weighing</InLink>{' '}
          craft that close scores reward.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Sources and caveats
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          All speaker statistics are computed from the published WSDC
          2026 speaker tab (wsdc2026.calicotab.com), which covers
          substantive speeches in the eight preliminary rounds only: no
          reply speeches, no elimination rounds, exactly as the
          tournament presents it. The averages include 23 speakers who
          spoke only once; restricting to speakers with four or more
          speeches barely moves the numbers (mean 70.90, middle half
          69.97 to 71.83). Break data for 2024–26 comes from each
          championship&apos;s public break announcement pages. The 2025
          and 2024 speaker tabs were never made public, so no
          speaker-score claims are made about them. For how these
          scores are actually earned, criterion by criterion, start
          with the{' '}
          <InLink href="/world-schools-debate-judging">judging
          guide</InLink>.
        </p>
      </section>
    </BlogPostShell>
  );
}
