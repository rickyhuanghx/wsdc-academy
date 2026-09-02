import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

// Flagship beginner hub for "how to debate" queries (2026-08-31 keyword
// research). Deliberately a router: it teaches the map, then hands each skill
// to the existing deep-dive post. Keep new technique posts linked from here.

export const metadata = postMetadata('how-to-debate');

const post = getPostBySlug('how-to-debate')!;

const faqs = [
  {
    question: 'How do I start debating with no experience?',
    answer:
      'Pick one motion, set a 15-minute prep timer, and argue one side out loud to a phone camera for three minutes. That single rep teaches more than an afternoon of videos. Then find structure: a school club, a local league, or a coached class, because the fastest improvement comes from debating real opponents and hearing judged feedback.',
  },
  {
    question: 'How do I get better at debate quickly?',
    answer:
      'Isolate skills instead of only debating whole rounds. Rebuttal drills against recorded speeches, one-minute weighing exercises, and impromptu case-building against the clock each train one muscle at a time. Then put the skill back into a judged round within the week, while the correction is fresh.',
  },
  {
    question: 'Is debate hard to learn?',
    answer:
      'The entry is easy and the ceiling is high. Most students can argue a structured position within two or three sessions. What takes a season or more is the layered skill set: building arguments that survive rebuttal, answering the best version of the other side, and weighing the round shut. Each layer is learnable; they just stack in order.',
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

export default function HowToDebatePost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/foundations"
      ctaLabel="About the Foundation class"
      ctaHeading="Learn it in a judged round, not a lecture."
      ctaBody="Our beginner Foundation class teaches exactly this stack, in order, with real practice debates and written feedback every step."
      lede={
        <p>
          Debating is a skill stack, not a talent. Underneath every polished
          speaker is the same set of learnable moves: state a claim, prove it,
          attack the other side&apos;s proof, and show the judge why your
          points matter more. This guide walks the stack in the order the
          skills actually build, with a deeper essay linked at every layer.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          First, understand the shape of a round
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Every formal debate has the same skeleton: a motion (the statement
          being argued), two sides assigned for and against, alternating
          timed speeches, and a judge who decides on what was said, not on
          what they personally believe. Formats differ in team size and
          timings; in{' '}
          <InLink href="/what-is-world-schools-debate">World Schools
          Debate</InLink>, the format we coach, teams of three alternate
          eight-minute speeches and every speaker has a defined job. Knowing
          your speech&apos;s job is half of doing it well, which is why we
          wrote a full essay on each chair: the{' '}
          <InLink href="/blog/first-speaker-world-schools-debate">first
          speaker</InLink>, the{' '}
          <InLink href="/blog/second-speaker-world-schools-debate">second
          speaker</InLink>, and the{' '}
          <InLink href="/blog/third-speaker-world-schools-debate">third
          speaker</InLink>. (And since first impressions are scored too:{' '}
          <InLink href="/blog/how-to-start-a-debate-speech">how to start
          a debate speech</InLink>.)
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Layer one: build an argument that survives contact
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          An argument is not an opinion said confidently. It is a claim, the
          mechanism that makes the claim true, the impact that makes it
          matter, and a line about why that impact wins the round. Beginners
          who learn this four-layer structure first improve faster at
          everything else, because rebuttal and weighing both operate on the
          layers. The full method, with a worked example, is in{' '}
          <InLink href="/blog/how-to-build-a-debate-argument">how to
          build a debate argument</InLink>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Layer two: take arguments apart
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Rebuttal is where debates are won, and it has a discipline: answer
          the best version of what the other side said, not the easiest
          version, and aim your response at a specific layer, the premise,
          the mechanism, the impact, or the weighing. Scattershot
          disagreement sounds busy and moves nothing. The four-step response
          structure is in our{' '}
          <InLink href="/blog/debate-rebuttal-guide">rebuttal
          guide</InLink>, and the art of doing it mid-speech, under{' '}
          <InLink href="/blog/points-of-information-debate">points of
          information</InLink>, has its own essay.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Layer three: weigh, or the judge weighs for you
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          At the end of a close round, both teams have arguments standing.
          The winner is usually the team that told the judge how to compare
          them: which impact is bigger, likelier, or arrives first, and why
          &ldquo;our worst case beats their best case.&rdquo; This is
          weighing, it belongs in every speech rather than only the last one,
          and it is the most under-taught skill in beginner debate.{' '}
          <InLink href="/blog/weighing-in-debate">The weighing essay</InLink>{' '}
          covers internal versus external weighing and how to set a metric
          the round is decided on.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Then close the loop: practice like it counts
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The loop that actually produces improvement is short: debate a real
          motion, get judged, fix one named thing, repeat. Pick practice
          motions at the right level from our{' '}
          <InLink href="/debate-topics">curated debate topics</InLink> (or
          the full <InLink href="/motions">motion bank</InLink> once you want
          volume), run prep against a timer with the{' '}
          <InLink href="/resources">free cheat sheets and prep
          planner</InLink>, and make sure someone qualified judges the round
          and says who won and why. Solo drills fill the gaps between rounds
          (the <InLink href="/blog/debate-practice">practice guide</InLink>{' '}
          has a full drill menu and a weekly plan); they never replace them.
          When your speeches need to go from spoken to structured, work
          through{' '}
          <InLink href="/blog/how-to-write-a-debate-speech">how to write
          a debate speech</InLink>, and when the early gains flatten out,{' '}
          <InLink href="/blog/how-to-get-better-at-debate">how to get
          better at debate</InLink> is about breaking the plateau. If you
          want the loop built for you, that is what a{' '}
          <InLink href="/debate-coaching">coached program</InLink> is.
        </p>
      </section>
    </BlogPostShell>
  );
}
