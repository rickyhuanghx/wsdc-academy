import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('first-speaker-world-schools-debate');

const post = getPostBySlug('first-speaker-world-schools-debate')!;

const faqs = [
  {
    question: 'How many arguments should a first speaker run?',
    answer:
      'Usually two, occasionally one very large one. The split announced in your set-up typically gives the first speaker one or two arguments and the second speaker one more. Three arguments in eight minutes means none of them gets real mechanisms, and under-developed arguments score worse than fewer, deeper ones.',
  },
  {
    question: 'Does the first speaker always need to define the motion?',
    answer:
      'No. Only when a term is genuinely ambiguous. Defining obvious words wastes time and signals inexperience, while a distorted, self-serving definition ("squirreling") gets punished. Define what needs defining, state it plainly, and move on.',
  },
  {
    question: 'Should first speakers take points of information?',
    answer:
      'One or two, like every substantive speaker, at moments you choose. Right after finishing a strong section is ideal. Taking zero looks evasive; taking three or more surrenders control of your own speech.',
  },
  {
    question: 'What does the opposition first speaker do differently?',
    answer:
      'Everything above, plus direct engagement: accept or challenge the definitions and framing, respond briefly to the proposition case, and (in policy debates) decide whether to defend the status quo or commit to a countermodel. Opposition firsts who deliver a pre-written case without touching what proposition said give away the framing battle.',
  },
];

export default function FirstSpeakerPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="First speeches are trained, not improvised."
      ctaBody="In our judged rounds, first speakers get written feedback on set-up, mechanization, and framing, every single week."
      lede={
        <p>
          Nothing your team says after the first speech can fix a debate that
          was framed against you in the first two minutes. &ldquo;Going
          first&rdquo; undersells the job. The first speaker chooses the ground
          the whole round is fought on: what the motion means, what the
          trade-off is, and how the judge should decide. This is the full job
          description, section by section. (When you&apos;re ready to drill it, print the{' '}
          <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            first speaker cheat sheet
          </Link>
          .)
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The introduction: frame before you argue</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The opening thirty seconds should make the judge see the motion your
          way before a single argument lands. Three devices do this reliably:
        </p>
        <ol className="mt-5 space-y-4">
          {[
            ['A historical example.', 'A well-known case that embodies your side of the motion. Debating a ban on private education? Open with a country whose two-track school system entrenched a two-track society. The judge now has a picture, and it is your picture.'],
            ['An emotional appeal.', 'Put the judge in your key stakeholder’s shoes: the student, the worker, the small nation. Not melodrama, just one concrete, human sentence that makes your impacts feel real before you prove them.'],
            ['A logical link.', 'A short chain of reasoning so hard to deny that accepting it quietly commits the judge to your case. If they nod at your first sentence, your first argument is already half-built.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The set-up: five sentences that decide the round</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          After the introduction comes the least glamorous, most consequential
          minute of the debate. Five jobs, in order:
        </p>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['Definitions', 'clarify genuinely ambiguous terms only. A fair definition buys credibility; an unfair one starts a definitional fight you will be blamed for.'],
            ['The trade-off', 'name the core tension honestly: what your side gives up and why it is worth it. Judges trust teams that acknowledge costs and win anyway.'],
            ['The stance', 'one clean sentence: "We believe that…" Every later claim must be consistent with it.'],
            ['The split', 'announce which arguments you will deliver and what your second speaker adds. This is the judge’s map of your case. Without it, your material reads as improvisation.'],
            ['The metric', 'tell the judge how to decide the round: "Vote for the side that protects the most vulnerable people in this debate." Set the test now; your whip wins on it later.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          The metric deserves special respect. Most young teams argue hard and
          let the judge pick the measuring stick; strong teams hand the judge
          the stick in minute two. When the{' '}
          <Link href="/blog/third-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            third speaker
          </Link>{' '}
          says &ldquo;judge this round on the metric we set in the first
          speech,&rdquo; that only works if the first speech actually set one.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The arguments: two, fully mechanized</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Each argument runs the four-layer structure
          (<strong>tagline, mechanisms, impact, weighing</strong>) that we break
          down fully in{' '}
          <Link href="/blog/how-to-build-a-debate-argument" className="font-semibold text-signal-500 hover:text-signal-600">
            how to build a debate argument
          </Link>
          . For the first speaker, two things matter most. First, mechanisms
          over assertions: &ldquo;private schools entrench inequality&rdquo; is
          a headline, not an argument, until you show the two or three causal
          pathways that make it true, each with reasoning and a real example.
          Second, weigh as you go: end each argument by telling the judge why
          its impact outranks whatever the opposition is about to say. Weighing
          delivered before the clash starts frames the clash.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The caseline: one sentence, three speeches</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Close with a sentence that captures your entire case
          (&ldquo;Education should be a ladder, not a moat&rdquo;) and make sure
          your teammates end their speeches with the same line. To a judge
          flowing eight speeches, a repeated caseline is the difference between
          a team with a case and three individuals with speeches. It costs ten
          seconds per speech and buys coherence nothing else can.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Where first speeches go wrong</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['Skipping the metric', 'the most common omission, and the one your whip pays for in the final speech.'],
            ['Three thin arguments', 'depth beats coverage. Judges score developed mechanisms, not lists of headlines.'],
            ['Defining the obvious', 'thirty seconds explaining what "school" means is thirty seconds of scoring time gone.'],
            ['Reading, not speaking', 'Style is 40% of the score. A first speech recited from a script loses marks a livelier, looser delivery would keep. See how judges score it in our judging guide.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          The full scoring breakdown is in{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            how World Schools judging works
          </Link>
          , and the fill-in version of this whole role is on the{' '}
          <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            printable cheat sheet
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
