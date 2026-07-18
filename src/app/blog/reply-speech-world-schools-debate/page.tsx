import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('reply-speech-world-schools-debate');

const post = getPostBySlug('reply-speech-world-schools-debate')!;

const faqs = [
  {
    question: 'Who should give the reply speech: speaker one or speaker two?',
    answer:
      'The rules allow either; the third speaker never replies. Many teams default to the first speaker, whose framing instincts fit the speech, but the real answer is whoever is best at calm synthesis under fatigue. Decide before the tournament, not in the prep room. The designated reply speaker should be practicing the speech all season.',
  },
  {
    question: 'Why does the opposition reply first?',
    answer:
      'The reply order flips so that proposition, the team carrying the burden of change, gets the true last word of the debate. For opposition, that means your reply must pre-empt: characterize what proposition will claim in their reply and take the sting out of it before it is said.',
  },
  {
    question: 'Can the reply speech introduce new examples?',
    answer:
      'No new arguments, and unlike the whip speech, the reply should not even introduce substantially new responses; it reviews a debate that is over. Fresh phrasing of existing material is fine and encouraged; fresh material is a rules problem and, worse, an admission that your substantive speeches left work unfinished.',
  },
];

export default function ReplySpeechPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Replies are rehearsed synthesis."
      ctaBody="Our students practice reply speeches on rounds they just debated, with feedback on what they chose to keep and what they wasted time on."
      lede={
        <p>
          The reply speech is the strangest four minutes in the format: half
          the length of a normal speech, delivered by someone who already
          spoke, with nothing new allowed. The classic description is a{' '}
          <strong>&ldquo;biased judge&apos;s summary&rdquo;</strong>: an
          adjudication of the round delivered as if by a judge who happens to
          be entirely on your side. Treat it as a fourth rebuttal speech and
          you waste it. Learn it properly and you get the last, calmest word
          the judge hears before deciding.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Think like a judge, argue like an advocate</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The framing device is the whole trick. A judge&apos;s oral
          adjudication reconstructs the round: here were the big questions,
          here is what each side said, here is why one side won each. Your
          reply borrows that structure and that tone (measured, comparative,
          slightly above the fray) while every &ldquo;finding&rdquo; lands in
          your favor. The persuasive power comes precisely from sounding
          judicial: after forty minutes of combat, the speech that sounds like
          a verdict tends to be remembered as one.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The structure: two or three questions, answered</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Open with the story of the round.', 'One or two sentences: what was this debate really about? This is framing, not recap. The team that names the story usually wins the story.'],
            ['Walk the big issues.', 'Take the two or three questions the round turned on (usually your whip’s clashes, simplified). For each: what both sides said, in one fair sentence each, then why yours prevailed, in comparative terms.'],
            ['Close on the metric and caseline.', 'Remind the judge of the test set in your first speech, declare it passed, and end on the caseline your bench has repeated all round. Last words stick; make them the same words.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-navy-700">
          Four minutes is shorter than it sounds: roughly ninety seconds per
          issue after the open and close. The discipline is the same as the{' '}
          <Link href="/blog/third-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            whip&apos;s
          </Link>
          , compressed: fewer issues, cleaner comparisons, and no detours.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Where replies go wrong</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['The fourth rebuttal', 'diving back into line-by-line exchanges. The fight is over; a reply that keeps fighting concedes that your side never finished it.'],
            ['The neutral summary', 'accurately recapping both sides and forgetting the "biased" half of the job. You are a judge who has already decided in your favor.'],
            ['New material', 'a new argument in the reply is both against the rules and strategically hollow: there is no speech left in which it can be tested.'],
            ['Speed', 'the reply is scored on the same Style criteria as everything else, and its register is calm authority. Rushing a summary reads as panic.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          Where the reply sits in the round, and its exact timings, are on
          the{' '}
          <Link href="/resources/wsdc-format-quick-reference" className="font-semibold text-signal-500 hover:text-signal-600">
            format quick reference
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
