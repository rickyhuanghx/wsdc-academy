import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

// SEASON-SPECIFIC PAGE. The resolutions below were verified against
// speechanddebate.org/topics on 2026-08-31. NSDA releases new PF/LD topics on
// Oct 1, Dec 1, Jan 1, Feb 1, and Mar 1 (9:00 a.m. CT) — update this page at
// each release and bump the post `date` in src/data/blog.ts. Never guess a
// resolution; quote it verbatim from the NSDA topics page.

export const metadata = postMetadata('nsda-debate-topics');

const post = getPostBySlug('nsda-debate-topics')!;

const faqs = [
  {
    question: 'When is the next NSDA topic released?',
    answer:
      'The November/December Public Forum and Lincoln-Douglas topics are announced October 1 at 9:00 a.m. Central. After that, PF moves to monthly topics: January’s is announced December 1, February’s on January 1, March’s on February 1, and April’s on March 1. NSDA members vote in the week before each release.',
  },
  {
    question: 'Does World Schools Debate have a national topic?',
    answer:
      'Not in the same way. World Schools tournaments set their own motions round by round, and about half of them are impromptu, released an hour before the debate. The one fixed point on the American calendar is NSDA Nationals: the USA World Schools Debate Invitational releases its prepared motions on May 1, and impromptu motions one hour before each round.',
  },
  {
    question: 'Where can I find practice topics beyond the set resolutions?',
    answer:
      'Our free motion bank holds 12,000+ real tournament motions searchable by subject, type, and year, and our curated debate topics page organizes 60+ of them by level, from beginner to advanced. Both are free with no signup.',
  },
];

const resolutions: { format: string; window: string; text: string }[] = [
  {
    format: 'Policy',
    window: 'Full 2026–27 season',
    text: 'Resolved: The United States federal government should establish national health insurance in the United States.',
  },
  {
    format: 'Public Forum',
    window: 'September/October 2026',
    text: 'Resolved: The United States federal government should enact a moratorium on hyperscale data center construction.',
  },
  {
    format: 'Lincoln-Douglas',
    window: 'September/October 2026',
    text: 'Resolved: Outer space colonization is a moral imperative.',
  },
  {
    format: 'Lincoln-Douglas (novice)',
    window: 'Full 2026–27 season',
    text: 'Resolved: In the United States, national service ought to be mandatory.',
  },
  {
    format: 'Big Questions',
    window: 'Full 2026–27 season',
    text: 'Resolved: Technological progress has surpassed humanity’s ability to use it ethically.',
  },
];

export default function NsdaTopicsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs"
      ctaLabel="See our programs"
      ctaHeading="Topics change. Technique compounds."
      ctaBody="Whatever the resolution, rounds are won with argument construction, rebuttal, and weighing. That is what we train, in judged rounds with written feedback."
      lede={
        <p>
          Every fall, American debaters and their parents go hunting for the
          same five sentences. Here they are: the current NSDA resolutions for
          the 2026&ndash;27 season, quoted verbatim, with the calendar for the
          releases still to come. We verified each one against the NSDA&apos;s
          official topics page on August 31, 2026.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          The current resolutions
        </h2>
        <div className="mt-6 space-y-4">
          {resolutions.map((r) => (
            <div key={r.format} className="rounded-sm border border-navy-100 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
                {r.format}
                <span className="ml-2 font-semibold normal-case tracking-normal text-navy-500">
                  {r.window}
                </span>
              </p>
              <p className="mt-2 text-lg leading-relaxed text-navy-900">{r.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          Source: the NSDA topics page at speechanddebate.org. Topics are
          quoted as released; always confirm against the official page before
          a tournament, since wording is occasionally corrected.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          When the rest of the season&apos;s topics arrive
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Policy, Big Questions, and the novice LD topic run all year. Varsity
          PF and LD rotate: the November/December topics are announced October
          1 at 9:00 a.m. Central, and Public Forum then switches to monthly
          topics, each announced on the first of the preceding month (January
          on December 1, February on January 1, March on February 1, April on
          March 1). NSDA members vote on the shortlist in the week before each
          release. One NSDA format never appears on this page at all:{' '}
          <Link
            href="/blog/extemporaneous-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            Extemporaneous Debate
          </Link>{' '}
          posts a brand-new resolution 30 minutes before every round.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What this means for World Schools debaters
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          <Link
            href="/what-is-world-schools-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            World Schools Debate
          </Link>{' '}
          works differently: motions are set per tournament, and roughly half
          are impromptu, released an hour before the round. There is no
          season-long resolution to research. The set-topic formats still
          matter to a World Schools debater for two reasons. First, this
          year&apos;s resolutions are excellent prepared-practice material: a
          national health insurance round or a data-center moratorium round
          maps directly onto the policy motions World Schools tournaments set.
          Second, if you compete in both circuits, the NSDA calendar above is
          the rhythm of your PF or LD season. For practice material beyond the
          set topics, our{' '}
          <Link
            href="/debate-topics"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            curated debate topics
          </Link>{' '}
          and the full{' '}
          <Link
            href="/motions"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            motion bank
          </Link>{' '}
          cover every level from first debate to Worlds finals.
        </p>
      </section>
    </BlogPostShell>
  );
}
