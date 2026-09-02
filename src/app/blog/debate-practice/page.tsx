import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('debate-practice');

const post = getPostBySlug('debate-practice')!;

const faqs = [
  {
    question: 'How can I practice debate by myself?',
    answer:
      'Three drills cover most of the skill: one-minute openings (draw a motion, prep five minutes, deliver just the first minute, three different ways), rebuttal reps (write a strong argument for the other side, then answer it out loud in ninety seconds), and rebuild drills (deliver an argument, then imagine the best attack on it and repair it). All three need nothing but a motion list and a timer, and all three show up directly in scores.',
  },
  {
    question: 'How often should a debate team practice?',
    answer:
      'Most competitive school teams run one or two sessions a week, with at least one full practice round every week or two. The ratio matters more than the hours: teams that only run rounds plateau, because rounds expose weaknesses without isolating them. The teams that improve fastest alternate judged rounds with targeted drills on whatever the last round exposed.',
  },
  {
    question: 'What are good debate exercises for beginners?',
    answer:
      'Start with structure, not speed: outline an argument in four layers (claim, mechanism, impact, weighing) on paper before ever delivering it, then deliver sixty-second versions of it until the layers come out in order without notes. Add one-minute openings next, and save rebuttal drills for once building is comfortable, since you cannot take apart a structure you cannot yet build.',
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

export default function DebatePracticePost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/competition-team"
      ctaLabel="About the Competition Team"
      ctaHeading="Practice rounds are our curriculum."
      ctaBody="The Competition Team runs a judged practice debate every week, with written feedback after every session, so the drill-round-feedback loop never breaks."
      lede={
        <p>
          Most debate practice is not practice. It is either hanging out
          with a motion on the whiteboard or running full rounds and hoping
          volume turns into skill. Deliberate practice is different: it
          isolates one skill, drills it against resistance, and feeds the
          result back into the next round. Here is what that looks like
          for a debater working alone, with a partner, and inside a team
          week.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What makes practice actually work?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Three conditions, and most sessions have none of them. The drill
          must isolate one skill (a whole practice round isolates
          nothing). It must produce output you can judge (spoken words on
          a timer, not silent reading). And something must come back:
          a score, a note, a recording you actually watch. Strip any
          session down to those three questions and you can tell in ten
          seconds whether it will move you. Everything below is built to
          pass that test.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Solo drills: the daily fifteen minutes
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>One-minute openings.</strong> Draw a motion, take five
          minutes of prep, deliver only the first minute of a first
          speech. Then deliver it again two more ways. This drills
          framing, the highest-leverage skill in the round, and our{' '}
          <InLink href="/blog/how-to-start-a-debate-speech">openings
          guide</InLink> gives you the three shapes to rotate through.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Rebuttal reps.</strong> Write the strongest argument you
          can for a side you disagree with, then stand up and take it
          apart in ninety seconds using the four-step structure in the{' '}
          <InLink href="/blog/debate-rebuttal-guide">rebuttal
          guide</InLink>. Building the target yourself is half the value:
          it forces you to rebut the best version, which is the habit
          judges reward.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Layer drills.</strong> Take one claim and extend it
          through all four layers (tagline, mechanism, impact, weighing)
          out loud in two minutes. When a layer keeps coming out thin, you
          have found this week&apos;s weakness. The method is in{' '}
          <InLink href="/blog/how-to-build-a-debate-argument">how to
          build a debate argument</InLink>.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          All three drills need motions. The{' '}
          <InLink href="/motions">motion bank</InLink> has more than
          12,000 real tournament motions with a draw-one button, and the
          leveled lists on the{' '}
          <InLink href="/debate-topics">debate topics page</InLink> are
          the right difficulty ladder for beginners.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Partner drills: adding resistance
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>POI gauntlet.</strong> One debater delivers a prepared
          argument for three minutes while the partner offers a point of
          information every thirty seconds. The speaker takes two,
          declines the rest, and has to land each answer inside fifteen
          seconds without losing the argument&apos;s thread. Nothing else
          teaches composure under interruption as fast; the tactics are in
          the{' '}
          <InLink href="/blog/points-of-information-debate">POI
          guide</InLink>.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Turn-taking rebuttal.</strong> Alternate speeches of
          ninety seconds on one motion: argument, rebuttal, rebuild,
          rebuttal of the rebuild. Four exchanges in, you are practicing
          the deepest layer of clash most school rounds never reach.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Blind weighing.</strong> Each partner writes the two
          best arguments for opposite sides, swaps papers, and delivers
          only the comparison: which argument wins and why, using the
          tools from the{' '}
          <InLink href="/blog/weighing-in-debate">weighing
          guide</InLink>. Weighing is the least-drilled skill in debate
          and the one that decides close rounds.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Full rounds: often enough, judged always
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Drills isolate skills; rounds integrate them. A full practice
          round every week or two is the right cadence for a competitive
          debater, and the non-negotiable is that someone judges it and
          says why a side won. An unjudged practice round teaches whatever
          the loudest debater already believed. If your school cannot
          field judges, that is the single strongest reason to join a
          structured program; it is the thing{' '}
          <InLink href="/debate-coaching">debate coaching</InLink> provides
          that self-study cannot. Build each round&apos;s motion sheet
          with the practice-set builder in the{' '}
          <InLink href="/motions">motion explorer</InLink>: check five
          motions, print the set, and you have a term of round topics in
          one sitting.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          A week that fits around school
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Monday and Wednesday: fifteen minutes of solo drills, rotating
          the three above. Thursday: thirty minutes of partner work.
          Weekend: one practice round with a judge, or when there is no
          round, one filmed speech watched back with a notepad. That is
          under two hours a week, it touches every skill in the round,
          and it beats a single three-hour Sunday marathon because speech
          skills consolidate between short sessions. When a tournament is
          four weeks out, tilt the mix toward full rounds; when the last
          round exposed a specific hole, tilt it back toward the drill
          that isolates it. For what to do when even this stops moving
          your scores, read{' '}
          <InLink href="/blog/how-to-get-better-at-debate">how to get
          better at debate</InLink>.
        </p>
      </section>
    </BlogPostShell>
  );
}
