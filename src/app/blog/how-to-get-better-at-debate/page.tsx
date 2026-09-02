import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('how-to-get-better-at-debate');

const post = getPostBySlug('how-to-get-better-at-debate')!;

const faqs = [
  {
    question: 'Why am I not improving at debate?',
    answer:
      'Almost always because your practice has volume but no feedback loop: you debate rounds, hear a result, and move on. Improvement requires knowing which specific skill cost you the round (framing, rebuttal depth, weighing, delivery) and drilling that skill in isolation before the next round. If nobody is telling you why you lost in terms you can drill, that is the missing piece, not more rounds.',
  },
  {
    question: 'How long does it take to get good at debate?',
    answer:
      'A committed beginner with weekly judged rounds and real feedback typically becomes a solid varsity contributor within one to two seasons. The variance is enormous, though, and it tracks feedback quality more than talent: a student who debates twice a term with no feedback can stay a beginner for years, while one inside a strong feedback loop can compress most of that first plateau into months.',
  },
  {
    question: 'Is a debate coach worth it?',
    answer:
      'A coach is worth it when the bottleneck is feedback: you are practicing and competing, but nobody can tell you precisely why you lose close rounds or what to drill next. A coach is not a substitute for reps, and a beginner who has never done a practice round will get more from any team than from private sessions. For a competitor stuck at the same speaker scores for a season, targeted coaching is usually the fastest way off the plateau.',
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

export default function HowToGetBetterAtDebatePost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/private-coaching"
      ctaLabel="About 1-on-1 coaching"
      ctaHeading="A diagnostic beats a guess."
      ctaBody="Our 1-on-1 coaching starts with a diagnostic session: a coach watches you debate and names the two or three things actually holding your scores down."
      lede={
        <p>
          Everyone improves fast in their first months of debate, because
          everything is new and every round teaches something. Then the
          curve flattens. The debaters who keep climbing after that are
          not the ones doing more rounds; they are the ones who closed a
          feedback loop: compete, find out precisely what cost you, drill
          that one thing, compete again. This guide is about building that
          loop, and about the handful of habits that reliably move
          debaters who feel stuck.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Why do debaters plateau?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Because rounds are a test, not a lesson. A round tells you that
          you lost; it does not tell you that you lost because your
          rebuttal answered a weaker version of the argument than the one
          delivered, or because your weighing arrived in the last thirty
          seconds of the last speech. Without that diagnosis, practice
          defaults to repeating what you already do. The plateau is not a
          talent ceiling. It is an information problem, and everything
          that follows is a way of getting better information.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Close the loop: diagnose, drill, re-test
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          After every competition round, write down one sentence: the
          moment the round was lost, and the skill that would have saved
          it. Ballots and judge comments help, but the discipline of
          naming one drillable cause yourself is the skill that
          compounds. Then spend the next two weeks of{' '}
          <InLink href="/blog/debate-practice">practice</InLink> tilted
          toward that one cause: thin mechanisms send you to the{' '}
          <InLink href="/blog/how-to-build-a-debate-argument">argument
          layers</InLink>, surface-level clash to the{' '}
          <InLink href="/blog/debate-rebuttal-guide">rebuttal
          four-step</InLink>, close losses in winnable rounds almost
          always to{' '}
          <InLink href="/blog/weighing-in-debate">weighing</InLink>.
          One cause per cycle. Debaters who try to fix everything fix
          nothing and call it a plateau.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Watch better debaters, and steal specifically
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Watching championship rounds works only when you watch like a
          coach, not a fan. Pick one speaker in your position and one
          question: how do they open rebuttal? Where in the speech does
          weighing appear? How do they handle a point of information
          mid-argument? Write down the move, then run it in your next
          drill. Grand finals from the World Schools championships and
          major university tournaments are on YouTube; if you are new to
          the format itself, start with{' '}
          <InLink href="/what-is-world-schools-debate">what World
          Schools debate is</InLink> so you know what the speakers are
          being scored on, and the{' '}
          <InLink href="/world-schools-debate-judging">judging
          guide</InLink> to see the round the way the adjudicator does.
          Judging is the most underrated improvement tool in debate:
          flowing a round you are not in, deciding it, and justifying the
          decision teaches you exactly what wins rounds, from the only
          seat where it is obvious.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Raise the difficulty of your inputs
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Stagnation often hides in comfortable motions. If every
          practice round is on a topic you already understand, you are
          drilling delivery and nothing else. Pull motions from areas you
          avoid; the{' '}
          <InLink href="/motions">motion bank</InLink> sorts more than
          12,000 real tournament motions by topic, and the info-slide
          motions are deliberately unfamiliar ground. Prep them at
          tournament speed. An hour of prep on a motion you find hard is
          worth three practice rounds on one you do not. And feed the
          machine: content is 40 percent of the score, so a weekly
          reading habit is training too. The{' '}
          <InLink href="/resources/debate-research-system">debate
          research system</InLink> is the version we assign our own
          students.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          When is it time for a coach?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Every step above assumes someone can tell you what actually
          cost you the round, and that is exactly what most school teams
          are missing: parent judges give results, not diagnoses. A coach
          is a diagnosis machine. If you have real competition experience
          and a season of flat speaker scores, a few targeted{' '}
          <InLink href="/debate-coaching">coaching sessions</InLink>{' '}
          usually surface two or three fixable habits nobody had named,
          which is why we start 1-on-1 work with a watched diagnostic
          round rather than a lesson. If you are earlier than that, a
          structured team with weekly judged rounds and written feedback
          closes the loop at team price; that comparison is laid out
          honestly in our{' '}
          <InLink href="/blog/best-online-debate-classes">guide to
          online debate classes</InLink>.
        </p>
      </section>
    </BlogPostShell>
  );
}
