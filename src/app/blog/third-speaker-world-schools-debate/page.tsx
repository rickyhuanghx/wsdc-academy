import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('third-speaker-world-schools-debate');

const post = getPostBySlug('third-speaker-world-schools-debate')!;

const faqs = [
  {
    question: 'Can the third speaker really say nothing new?',
    answer:
      'No new substantive arguments. That is the rule, and judges enforce it through the Strategy score. But new responses, new examples, and new weighing are all fair game. The whip’s job is to do new things with existing material, not to introduce material.',
  },
  {
    question: 'How many clashes should a whip speech cover?',
    answer:
      'Two or three. One clash means you have collapsed the debate too far and ignored live material; four or more means you are doing a line-by-line in disguise. The test: could you name each clash as a question the judge must answer to decide the round?',
  },
  {
    question: 'How is the third speaker different from the reply speech?',
    answer:
      'The whip still fights: it answers arguments, rebuts, and weighs inside each clash. The reply speech (given later, by the first or second speaker) fights nothing. It is a calm, biased summary of a debate that is already over. A whip that sounds like a reply gave up four minutes too early; a reply that sounds like a whip breaks the rules.',
  },
];

export default function ThirdSpeakerPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Clash selection is learned in live rounds."
      ctaBody="No drill teaches whipping like a real debate with honest adjudication. That is what our weekly judged rounds are for."
      lede={
        <p>
          By the fifth speech of a World Schools round, the debate is a mess:
          arguments half-answered, examples contested, weighing scattered
          across forty minutes of speeches. The third speaker&apos;s job is to
          clean it up <em>in your favor</em>: reorganize everything said into
          two or three decisive questions, win each one, and tell the judge
          exactly why the round is over. Nothing new, all judgment. (The
          in-round version of this post is the{' '}
          <Link href="/resources/third-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            printable clash sheet
          </Link>
          .)
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Think in clashes, not speeches</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The weakest whip speeches walk through the debate chronologically:
          &ldquo;their first speaker said, then our second speaker
          said&hellip;&rdquo; The strongest reorganize it thematically. A{' '}
          <strong>clash</strong> is a question the judge must answer to decide
          the round: <em>Does the policy actually reduce harm? Whose freedom
          matters more here? Can the model be enforced?</em> Everything said in
          eight speeches sorts into two or three such questions, and the team
          whose whip names those questions usually gets them answered on its
          own terms.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          This means the whip works during the whole round, not before it.
          Flow every speech with the clash sheet in front of you, sorting
          material into clashes as it lands. By the time you stand up, the
          speech should already exist on paper.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Winning a clash: four moves</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Tag their best material.', 'Summarize the strongest thing still standing on their side of this clash, and do it fairly. The judge knows what was said; a distorted tag costs you credibility exactly when you need it most.'],
            ['Break it.', 'Show why that material does not survive: the mechanism was never proven, the example cuts the other way, the rebuilding never answered your second speaker’s response.'],
            ['Weigh internally.', 'Why is your case in this clash still standing while theirs is not? This is the "what survived" comparison: argument quality after eight speeches of contact.'],
            ['Weigh externally.', 'Even if you grant them their best case in this clash, why do your impacts still matter more? Scale, severity, reversibility, priority of stakeholder. This is the "our worst case beats their best case" move, and it is what separates whips from summarizers.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-navy-700">
          The internal/external distinction is the heart of the role. We
          unpack it fully in{' '}
          <Link href="/blog/weighing-in-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            the weighing guide
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Concede strategically</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          You will not win every clash, and pretending otherwise burns
          credibility. Strong whips position the clashes they are winning as
          decisive and the ones they are losing as marginal: &ldquo;Even if
          they win on cost, and they don&apos;t cleanly, cost was never the
          question. The question is who this policy protects, and on that
          question they have no answer.&rdquo; That is not weakness; it is the
          Strategy score working for you. Remember the{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            judging criteria
          </Link>
          : 20% of every score is about making the right choices, and clash
          prioritization is the most visible choice a whip makes.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Close on the metric</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Your first speaker set a metric in minute two of the debate. The
          whip&apos;s final minute cashes it in: remind the judge what the test
          was, show that your side passed it and theirs did not, and end on the
          caseline your whole bench has been repeating. A whip speech that ends
          mid-clash, out of time, gives back everything its organization
          earned. Build the conclusion first and protect its thirty seconds
          ruthlessly.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Where whip speeches go wrong</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['New arguments', 'the role violation judges punish hardest. If it is a new causal story for your side, it belongs to your second speaker, not you.'],
            ['The disguised line-by-line', 'six "clashes" of forty seconds each is not clash analysis; it is an inventory with headers.'],
            ['Summary without weighing', 'retelling the debate accurately is a reply speech. The whip’s job is comparison: what survived, and why it decides the round.'],
            ['Ignoring the metric', 'if your team set a test and your final speech never mentions it, the judge is free to invent their own, and it may not favor you.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          Print the{' '}
          <Link href="/resources/third-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            third speaker cheat sheet
          </Link>{' '}
          and flow your next practice round on it, even as a spectator.
          Whipping is a skill you can train from the audience.
        </p>
      </section>
    </BlogPostShell>
  );
}
