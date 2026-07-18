import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('debate-rebuttal-guide');

const post = getPostBySlug('debate-rebuttal-guide')!;

const faqs = [
  {
    question: 'Should I respond to every argument the other team makes?',
    answer:
      'You must engage everything important, but not everything equally. Group minor points, answer them in a sentence, and spend your real time breaking the two or three arguments the round actually turns on. A completely dropped argument is dangerous because the opposition will call it conceded. Acknowledge everything, but triage your depth.',
  },
  {
    question: 'What if their argument is actually true?',
    answer:
      'Attack a different layer. Many true claims have exaggerated impacts, or impacts that weigh less than yours. "Even if we grant this entirely…" followed by weighing is real rebuttal, and often the strongest kind, because it survives even if your other responses fail.',
  },
  {
    question: 'How is rebuttal scored in World Schools?',
    answer:
      'Under Content (40% of the score) for the quality of the responses themselves, and under Strategy (20%) for choosing the right targets and allocating time well. A speech that builds its own case but ignores the clash scores like half a speech.',
  },
];

export default function RebuttalGuidePost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Rebuttal improves at exactly one speed: reps."
      ctaBody="Our students run rebuttal ladders against live opposition weekly, with written feedback on target selection and completeness."
      lede={
        <p>
          Rebuttal is not disagreement. Judges hear disagreement all round;
          what they score is <em>demonstrated failure</em>: showing that a
          specific argument, at a specific layer, no longer stands. That takes
          a structure, a target, and the discipline to attack the strongest
          version of what was said. This guide covers all three.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The four-step response</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Tag: “They say…”', 'One fair sentence stating their claim. Fairness is tactical: a judge who thinks you distorted the argument stops trusting the response before it starts.'],
            ['Respond: “However…”', 'The attack itself: the flaw in the logic, the counter-example, the missing link between claim and impact.'],
            ['Support.', 'One line of reasoning or one example proving your response. A response can be asserted as emptily as an argument can.'],
            ['Conclude: “This shows their argument fails because…”', 'Convert the exchange into a verdict. Without this line, the judge has heard noise on both sides and scored neither.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Pick your layer: the rebuttal ladder</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Every argument has four layers (
          <Link href="/blog/how-to-build-a-debate-argument" className="font-semibold text-signal-500 hover:text-signal-600">
            tagline, mechanisms, impact, weighing
          </Link>
          ), and each is a different target:
        </p>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['Attack the premise', '“this argument assumes X, and X is false.” The cleanest kill when available, because the whole structure falls at once.'],
            ['Attack the mechanism', '“even if the goal is real, this pathway doesn’t deliver it.” The workhorse response: most arguments have one strong mechanism and one weak one. Break the weak one and contest the strong one.'],
            ['Attack the impact', '“even if this happens, it is smaller / rarer / more reversible than claimed.” Mitigation, not refutation, so pair it with weighing.'],
            ['Attack the weighing', '“even at full strength, our impact outranks it.” The safety net that works when everything else fails, because it concedes nothing you can’t afford.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          Strong rebuttal often stacks two rungs: &ldquo;the mechanism is
          broken, and even if it weren&apos;t, the impact is outweighed.&rdquo;
          That structure survives even when one response doesn&apos;t.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Steel-man or lose slowly</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The single most important habit in World Schools rebuttal: respond to
          the <strong>best version</strong> of the argument, not the version
          that is easiest to answer. If their delivery was clumsy but the idea
          was strong, judges credit the idea and expect you to answer the
          idea. Beating the clumsy phrasing while the strong idea stands
          unanswered is how teams lose rounds they were &ldquo;winning&rdquo;
          exchange by exchange.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          The practical technique: before responding, restate their argument
          <em> slightly better than they said it</em>. It signals command of
          the round, earns Style and Strategy credit, and guarantees your
          response is aimed at something real.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Rebuttal by role</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Rebuttal work is distributed, not duplicated. The{' '}
          <Link href="/blog/second-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            second speaker
          </Link>{' '}
          does the heavy demolition: full four-step responses against each of
          their arguments, plus rebuilding. The{' '}
          <Link href="/blog/third-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            third speaker
          </Link>{' '}
          answers only what still stands, inside clash analysis with weighing
          attached. And first speakers on opposition owe the proposition case a
          first strike before building their own. If two speakers give the
          same response twice, one of them wasted the time.
        </p>
      </section>
    </BlogPostShell>
  );
}
