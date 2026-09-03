import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('how-to-write-a-debate-speech');

const post = getPostBySlug('how-to-write-a-debate-speech')!;

const faqs = [
  {
    question: 'What is the basic structure of a debate speech?',
    answer:
      'Opening (state your side and frame the debate), roadmap (tell the judge what you will cover, in order), rebuttal (if anyone has spoken before you), your constructive arguments delivered in layers (claim, mechanism, impact), weighing (why your material matters more than theirs), and a close that lands on your side of the motion. Later speeches shift the balance toward rebuttal and weighing, but the skeleton is the same.',
  },
  {
    question: 'Should a debate speech be fully written out?',
    answer:
      'Only the first proposition speech can be fully drafted, because it is the only speech that does not respond to anything. Every other speech must react to what was actually said, so script your structure and your best lines, and deliver the rest from notes. Judges in every major format reward engagement over recitation, and a read speech cannot engage.',
  },
  {
    question: 'How long is a debate speech?',
    answer:
      'It depends on the format. In World Schools debate the main speeches are eight minutes and the reply speech is four. Public Forum constructives are four minutes. Whatever the clock, the working rule is the same: budget your minutes across sections before you write a word, because material you cannot deliver in time does not exist for the judge.',
  },
  {
    question: 'How do you end a debate speech?',
    answer:
      'Return to the framing you opened with and answer it. One or two sentences that name the central question of the round and state why your side has won it beat any memorized flourish. If you find yourself summarizing all of your arguments again, you are re-giving the speech, not ending it.',
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

function Example({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-4 border-l-2 border-signal-500 bg-white p-5 leading-relaxed text-navy-700">
      {children}
    </blockquote>
  );
}

export default function HowToWriteADebateSpeechPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/foundations"
      ctaLabel="About the Foundation class"
      ctaHeading="Speech writing is coached, not guessed."
      ctaBody="Students in our classes draft speeches, deliver them in judged rounds, and get written feedback on the draft and the delivery, every week."
      lede={
        <p>
          A debate speech is not an essay read aloud. It is built from a
          standard skeleton: an opening that frames the debate, a roadmap, a
          rebuttal section, two or three arguments delivered in layers, and
          weighing that tells the judge why your material decides the round.
          Write to that skeleton and a speech almost assembles itself. Write
          it like an English assignment and it collapses the moment an
          opponent touches it. This guide walks the skeleton section by
          section, then shows a worked outline on a real motion.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Before you write: know your speech&apos;s job
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          No speech exists alone. A first speech builds the case, a middle
          speech defends and extends it, a closing speech decides the round.
          What you write depends entirely on which job is yours, which is
          why the same skeleton stretches differently: a first speaker might
          spend six of eight minutes on constructive material, while a third
          speaker spends nearly all of it on rebuttal and weighing. If you
          are not sure what your position owes the team, start with the
          role guides for the{' '}
          <InLink href="/blog/first-speaker-world-schools-debate">first</InLink>,{' '}
          <InLink href="/blog/second-speaker-world-schools-debate">second</InLink>, and{' '}
          <InLink href="/blog/third-speaker-world-schools-debate">third
          speaker</InLink>, then come back here for the writing itself.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What goes in the speech, in order
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>The opening</strong> states your side and frames what the
          debate is really about, in under a minute. It is important enough
          that we wrote a{' '}
          <InLink href="/blog/how-to-start-a-debate-speech">separate
          guide to openings</InLink>; the short version is that greetings,
          dictionary definitions, and inspirational quotes all waste the
          thirty seconds when the judge is listening hardest.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>The roadmap</strong> is two sentences of table of
          contents: &ldquo;I will respond to their economy argument, then
          bring two arguments of my own: access and accountability.&rdquo;
          Judges flow speeches in real time, and a speech they can follow
          scores better than a cleverer one they cannot.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Rebuttal</strong> comes before your own material in most
          speeches, because the judge has just heard the other side and
          wants to know what is left of it. Answer the best version of
          their strongest argument first; the mechanics are in the{' '}
          <InLink href="/blog/debate-rebuttal-guide">rebuttal
          guide</InLink>.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Your arguments</strong> are the core of the speech, and
          each one is written in layers: a one-line tagline the judge can
          write down, the mechanism (the step-by-step reasons the claim is
          true), the impact (who is affected, how much, why it matters),
          and a line of weighing. The full method, with a worked example,
          is in{' '}
          <InLink href="/blog/how-to-build-a-debate-argument">how to
          build a debate argument</InLink>. Two well-built arguments beat
          four asserted ones in every format we coach.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          <strong>Weighing and the close</strong> finish the job. Weighing
          compares: even if they win some of their material, why does
          yours matter more? Then the close returns to your opening
          framing and answers it in a sentence or two. The comparison
          toolkit is in the{' '}
          <InLink href="/blog/weighing-in-debate">weighing guide</InLink>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          A worked outline
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Take the classic motion &ldquo;This House would ban
          homework&rdquo; and a first proposition speech of eight minutes.
          A written outline, not a script, might read:
        </p>
        <Example>
          <span className="block">
            <strong>Open (0:00):</strong> We propose. This debate is about
            who owns a child&apos;s evening: schools or families. Two
            arguments: the learning benefit is small and unequal; the cost
            to childhood is large and universal.
          </span>
          <span className="mt-3 block">
            <strong>Definition and model (0:45):</strong> Ban graded
            take-home assignments in primary and secondary school; reading
            and optional practice remain.
          </span>
          <span className="mt-3 block">
            <strong>Argument one (1:30):</strong> Homework teaches less
            than it appears to. Mechanism: tired students copy, guess, or
            outsource; feedback arrives days late; the students who most
            need help have the least support at home. Impact: hours of
            childhood spent for marginal learning, concentrated on the
            students least able to afford it.
          </span>
          <span className="mt-3 block">
            <strong>Argument two (4:30):</strong> Evenings have better
            uses. Mechanism: sport, family, rest, and jobs all compete
            with homework and lose by default. Impact: measurable costs to
            sleep and family time across every student, not just the
            struggling ones.
          </span>
          <span className="mt-3 block">
            <strong>Weigh and close (7:15):</strong> Their best case is
            some lost practice, recoverable in class. Ours is childhood
            hours that do not come back. The evening belongs to families.
            Proud to propose.
          </span>
        </Example>
        <p className="mt-4 leading-relaxed text-navy-700">
          The outline carries timestamps, taglines, and mechanisms in
          shorthand, but no finished sentences. Those get made at
          delivery, on purpose.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          How much should you script?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Script three things word for word: your opening, your taglines,
          and your close. Everything else lives as structured notes,
          because everything else has to flex around what the other side
          actually says. This is also why judges can tell a written speech
          from a debated one: the written speech answers arguments nobody
          made. In World Schools, the expectation is explicit; speeches
          are delivered from notes, and reading is marked down under
          style, which is 40 percent of the score under the{' '}
          <InLink href="/world-schools-debate-judging">judging
          criteria</InLink>. If your handwriting or your nerves fight
          you, the printable{' '}
          <InLink href="/resources">speaker cheat sheets</InLink> give
          each role a pre-structured page to speak from.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Fitting the clock
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Budget minutes before you write, the way the outline above does,
          and rehearse against a timer at least once before you trust the
          budget. Everyone runs long on argument one and starves the
          weighing, which is the section that decides close rounds. If a
          section keeps overflowing, the fix is nearly always to cut a
          third argument, not to talk faster. Then make the drafting
          itself a habit: pull a motion from the{' '}
          <InLink href="/debate-topics">debate topics page</InLink>, give
          yourself thirty minutes to outline, and deliver it to a wall,
          a parent, or a phone camera. Speech writing improves at exactly
          the rate you produce speeches, and the{' '}
          <InLink href="/blog/debate-practice">practice guide</InLink>{' '}
          turns that into a weekly routine.
        </p>
      </section>
    </BlogPostShell>
  );
}
