import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('how-to-start-a-debate-speech');

const post = getPostBySlug('how-to-start-a-debate-speech')!;

const faqs = [
  {
    question: 'How do you write an opening statement for a debate?',
    answer:
      'State your side, define the debate on your terms, and preview your arguments, in that order and inside a minute. A serviceable template: "We stand in proposition of this motion. This debate comes down to [the real question]. We will prove two things: first, [argument one]; second, [argument two]." Polish comes later; clarity wins now.',
  },
  {
    question: 'Should I open a debate speech with a hook or a quote?',
    answer:
      'A one-line hook that frames the actual clash can work. A memorized quotation, a dictionary definition, or a rhetorical question usually costs more than it buys, because judges are listening for the debate to be defined, not decorated. If a hook does not make your side easier to vote for, cut it.',
  },
  {
    question: 'How long should the opening of a speech be?',
    answer:
      'Thirty to sixty seconds for a first speech: side, framing, preview, then into the first argument. Later speeches should open even faster, because their first job is responding to what was just said, and every second spent on ceremony is a second of rebuttal lost.',
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

export default function HowToStartADebateSpeechPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/foundations"
      ctaLabel="About the Foundation class"
      ctaHeading="Openings are a drill, not a gift."
      ctaBody="Students in our classes rehearse speech openings weekly, in judged rounds, until the first thirty seconds run on rails."
      lede={
        <p>
          Judges form an impression of a speech in its first thirty seconds,
          and most beginners spend those seconds on throat-clearing:
          greetings, restating the motion word for word, a quotation someone
          told them was classy. The fix is knowing what each speech&apos;s
          opening is <em>for</em>. There are only three jobs an opening can
          have, and they map onto the three kinds of speech in a round.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Opening the first speech: define the debate
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The first speaker for each side owns the framing. The opening must
          do three things fast: state your side, tell the judge what this
          debate is really about, and preview your case. For a motion like
          &ldquo;This House would ban homework&rdquo;:
        </p>
        <Example>
          &ldquo;We propose. This debate is not about whether practice
          matters; it is about whether after-school hours belong to schools
          or to families. We will prove two things: that homework&apos;s
          learning benefit is small and unequal, and that its cost to
          childhood is large and universal.&rdquo;
        </Example>
        <p className="mt-4 leading-relaxed text-navy-700">
          Twenty seconds, and the judge now has a lens for the whole round,
          your lens. The full framing toolkit (definitions, the split, the
          winning metric) is in our{' '}
          <InLink href="/blog/first-speaker-world-schools-debate">first
          speaker essay</InLink>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Opening a middle speech: pivot off the clash
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Second speeches and later must not open with prepared material. The
          judge just heard the other side; the opening that earns attention
          is the one that engages it immediately. Name the biggest thing your
          opponents said, then flag what you will do to it:
        </p>
        <Example>
          &ldquo;The previous speaker&apos;s whole case rests on one claim,
          that homework is the only scalable form of practice. In the next
          minute I will show you it is neither the only form nor a working
          one, and then rebuild our argument about family time, which went
          completely unanswered.&rdquo;
        </Example>
        <p className="mt-4 leading-relaxed text-navy-700">
          That opening signposts rebuttal, promises rebuilding, and quietly
          tells the judge an argument was dropped. The mechanics of the
          rebuttal that follows are in the{' '}
          <InLink href="/blog/debate-rebuttal-guide">rebuttal
          guide</InLink> and the{' '}
          <InLink href="/blog/second-speaker-world-schools-debate">second
          speaker essay</InLink>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Opening a closing speech: zoom out
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Closing speeches (the third speaker, and the reply in formats that
          have one) open by shrinking the round. Not &ldquo;I will respond
          to everything,&rdquo; but:
        </p>
        <Example>
          &ldquo;This round has come down to two questions: does homework
          actually teach, and who should control a child&apos;s evening?
          We&apos;ve won the first on the evidence and they have barely
          contested the second. Let me show you both.&rdquo;
        </Example>
        <p className="mt-4 leading-relaxed text-navy-700">
          Organizing a messy round into two or three named clashes is the
          whole craft of the closing chairs; the{' '}
          <InLink href="/blog/third-speaker-world-schools-debate">whip
          speech essay</InLink> and the{' '}
          <InLink href="/blog/reply-speech-world-schools-debate">reply
          speech essay</InLink> teach it in full.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          The three classic ways to waste thirty seconds
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The ceremonial opening (&ldquo;Good afternoon judges, honorable
          opponents&hellip;&rdquo;), the dictionary opening (&ldquo;Webster
          defines homework as&hellip;&rdquo;), and the borrowed-gravitas
          opening (an inspirational quote with no argumentative work to do).
          All three delay the moment the judge starts hearing your case, and
          none earns speaker points in any modern format. Cut them, open on
          the job your speech exists to do, and practice it: pull a motion
          from the{' '}
          <InLink href="/debate-topics">topics page</InLink>, give yourself
          five minutes of prep, and deliver just the first minute, three
          times, three different ways. It is the cheapest drill in debate and
          the fastest one to show up in scores.
        </p>
      </section>
    </BlogPostShell>
  );
}
