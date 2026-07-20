import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('weighing-in-debate');

const post = getPostBySlug('weighing-in-debate')!;

const faqs = [
  {
    question: 'When should weighing start in a World Schools round?',
    answer:
      'In the first speech. Each argument should end with a line of weighing, and the first speaker should set the metric the judge decides on. Teams that save weighing for the whip are asking one speech to do work that eight minutes cannot hold, and letting the other side frame the comparison for half the round.',
  },
  {
    question: 'What are the standard weighing lenses?',
    answer:
      'Scale (how many people are affected), severity (how deeply), reversibility (can the harm be undone), probability (how likely is the impact to actually happen), and timeframe (immediate versus generational). Strong weighing names its lens explicitly: "even if their harm is broader, ours is irreversible, and irreversibility comes first."',
  },
  {
    question: 'What if both teams weigh and the lenses conflict?',
    answer:
      'Then you meta-weigh: argue why your lens is the right one for this motion. "In debates about fundamental rights, severity beats scale, because a deep injustice to few outranks an inconvenience to many." This is exactly what a metric is for; if your first speaker set one, your whip resolves the conflict with it.',
  },
];

export default function WeighingPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/competition-team"
      ctaLabel="Train with the Competition Team"
      ctaHeading="Weighing is the highest-leverage skill we teach."
      ctaBody="Every judged round in our program ends with feedback on the comparison layer, because that is where close rounds are decided."
      lede={
        <p>
          In most close rounds, <em>both</em> teams prove their arguments. The
          judge believes the policy helps some people and hurts others, that
          both freedoms matter, that both harms are real. What decides the
          round is who <strong>compared</strong> better, not who proved more.
          That comparison is weighing, and it is the most undertrained skill in
          the format.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Internal weighing: what survived?</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Internal weighing compares the state of the arguments themselves
          after a round of contact: <em>our case is still standing; theirs is
          not</em>. It sounds like: &ldquo;Their economy argument rests on a
          mechanism our second speaker broke and they never rebuilt, while our
          fairness argument took their best response and survived it.&rdquo;
          It is bookkeeping, done out loud, in your favor. It only works
          if it is true, which is why{' '}
          <Link href="/blog/second-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            rebuilding
          </Link>{' '}
          matters so much.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">External weighing: whose world is better?</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          External weighing concedes, for the sake of argument, that both cases
          stand, then compares the impacts directly. The canonical form is the
          strongest sentence in debate:{' '}
          <strong>&ldquo;our worst case beats their best case.&rdquo;</strong>{' '}
          Grant them everything they claimed; show that what you proved still
          matters more, whether by scale, severity, reversibility, probability, or
          timeframe. External weighing is the safety net that wins rounds even
          when individual exchanges were lost, because it does not depend on
          winning them.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          The two kinds are not alternatives. A complete whip speech does
          both, clash by clash, exactly as structured on the{' '}
          <Link href="/resources/third-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            third speaker cheat sheet
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Metrics: setting the test in advance</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          A metric is weighing installed early: the first speaker tells the
          judge what question decides the round (&ldquo;vote for the side
          that better protects the people who cannot protect
          themselves&rdquo;) and the team spends three speeches winning that
          question. When the whip closes with &ldquo;we set the test, and we
          passed it,&rdquo; the judge has been using your measuring stick all
          round. Metrics also resolve weighing stand-offs: when both teams
          claim scale and severity, the team with an established metric has a
          referee&apos;s answer to whose lens applies.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Where weighing goes wrong</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['Weighing that is just repetition', 'saying your impact again, louder, is not comparison. Weighing must mention their side: "ours outranks theirs because…"'],
            ['Lens-shopping', 'claiming scale in one clash and severity in the next, whichever is convenient. Judges notice. Pick your lens per clash and defend it.'],
            ['Saving it all for the whip', 'a round with no weighing until minute 40 is a coin flip by then. Weigh inside every argument, from the first speech on.'],
            ['Conceding nothing', '"we win every clash on every lens" reads as noise. Real weighing admits what the other side proved and beats it anyway. That is what makes it credible.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          Weighing lives inside the Strategy and Content scores. See{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            how World Schools judging works
          </Link>{' '}
          for where judges put it on the ballot.
        </p>
      </section>
    </BlogPostShell>
  );
}
