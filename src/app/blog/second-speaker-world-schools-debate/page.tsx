import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('second-speaker-world-schools-debate');

const post = getPostBySlug('second-speaker-world-schools-debate')!;

const faqs = [
  {
    question: 'How should a second speaker split their eight minutes?',
    answer:
      'A common starting budget is roughly three minutes of rebuttal and rebuilding, four minutes for the new argument, and a minute for framing and conclusion. Then adjust live. If the opposition landed real damage, rebuilding earns more time; if their case was weak, extend harder. The budget is a default, not a rule.',
  },
  {
    question: 'What makes a good extension argument?',
    answer:
      'It should be genuinely new (not a re-worded version of your first speaker’s material), it should hit from a different angle so rebuttal against argument one doesn’t automatically apply to it, and it should still serve the same stance and metric. A good test: could the opposition’s existing responses answer it? If yes, it isn’t new enough.',
  },
  {
    question: 'Rebut first or rebuild first?',
    answer:
      'Convention and logic both say rebut first: tear down their case while it is freshest in the judge’s mind, then repair your own, then build new material on the cleared ground. Whatever order you choose, signpost it. The judge should always know which of your three jobs you are doing.',
  },
];

export default function SecondSpeakerPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Deputies are made in the clash."
      ctaBody="Our weekly rounds put second speakers against live opposition, then hand them written feedback on rebuttal quality and time discipline."
      lede={
        <p>
          Coaches argue about most things; almost none argue about this: the
          second speech is where rounds are won or lost. It is the only speech
          with three full-sized jobs (destroy the opposing case, repair your
          own, and deliver your team&apos;s final new argument) inside the same
          eight minutes as everyone else. Here is how each job works, and how
          they fit. (The fill-in version is the{' '}
          <Link href="/resources/second-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            second speaker cheat sheet
          </Link>
          .)
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Job one: rebut the best version of their case</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The cardinal rule of World Schools rebuttal: respond to the{' '}
          <strong>strongest</strong> version of what your opponents said, not
          the weakest. Judges flow the actual argument; if you beat a strawman,
          the real argument survives untouched, and you spent ninety seconds
          proving you either didn&apos;t understand it or couldn&apos;t handle
          it.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          Structure every response the same way:{' '}
          <em>&ldquo;They say&hellip; however&hellip;&rdquo;</em> Tag their
          claim in one fair sentence, then break it. And always close the
          exchange with a conclusion:{' '}
          <em>&ldquo;This shows their argument fails because&hellip;&rdquo;</em>{' '}
          That last line converts a list of objections into a verdict the judge
          can write down. The full taxonomy of where to aim (premise,
          mechanism, impact, or weighing) is in our{' '}
          <Link href="/blog/debate-rebuttal-guide" className="font-semibold text-signal-500 hover:text-signal-600">
            rebuttal guide
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Job two: rebuilding, the half everyone skips</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          By the time you speak, your first speaker&apos;s case has been
          attacked for eight minutes. A new argument stacked on a collapsed
          case impresses nobody, so before you extend, rebuild. The structure
          mirrors rebuttal: tag their response (&ldquo;they said our inequality
          argument ignores scholarships&rdquo;), answer it (&ldquo;however,
          scholarships reach a fraction of one percent&hellip;&rdquo;), and
          conclude: <em>&ldquo;so our argument still stands because&hellip;&rdquo;</em>
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          Rebuilding is also triage. You do not need to answer every response,
          only to save the material your team plans to win on. Check what
          your{' '}
          <Link href="/blog/third-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            third speaker
          </Link>{' '}
          intends to make the round about, and make sure <em>that</em> survives
          your speech.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Job three: the extension, new ground for the same case</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Your new argument is the team&apos;s last new material of the round.
          After you, only responses and weighing are allowed. Two properties
          make an extension strong. It is <strong>genuinely new</strong>: a
          different causal story, a different stakeholder, not argument one in
          a new outfit. And it is <strong>strategically placed</strong>: it
          hits from an angle their existing rebuttal cannot reach. That forces
          their third speaker to answer fresh material with no second speaker
          left to help.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          Structurally it is a full argument (tagline, mechanisms with
          reasoning and examples, impact, weighing), never a footnote. If your
          extension runs ninety seconds, it is a comment, not an argument, and
          judges score it accordingly.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Where second speeches go wrong</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['The line-by-line trap', 'answering all seven of their points shallowly instead of breaking their three important ones properly. Rebuttal is triage, not inventory.'],
            ['Skipping rebuilding entirely', 'the most common structural miss. If your case is rubble when the whip stands up, there is nothing left to weigh.'],
            ['The vanishing extension', 'spending six minutes in the clash and delivering the new argument as an afterthought at 7:30.'],
            ['No conclusions on exchanges', 'responses without a "this means their argument fails because…" line leave the judge to do your scoring work, and judges rarely do it in your favor.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          Print the{' '}
          <Link href="/resources/second-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            second speaker cheat sheet
          </Link>{' '}
          and run it against motions from the{' '}
          <Link href="/resources/practice-motions" className="font-semibold text-signal-500 hover:text-signal-600">
            practice bank
          </Link>
          . The structure becomes automatic faster than you&apos;d think.
        </p>
      </section>
    </BlogPostShell>
  );
}
