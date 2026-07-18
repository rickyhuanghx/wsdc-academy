import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('usa-debate-team-skills');

const post = getPostBySlug('usa-debate-team-skills')!;

const faqs = [
  {
    question: 'Is raw speaking talent enough to make a national team?',
    answer:
      'No, and it is usually not even the differentiator. At the selection level, everyone speaks well. What separates candidates is the trained layer: role discipline, weighing instincts, composure under POI fire, and consistency across motion types. All of it is buildable; none of it is built in a month.',
  },
  {
    question: 'I dominate in Public Forum. Does that transfer?',
    answer:
      'Partially. Research depth, clash instincts, and competitive temperament transfer well. Speed, card-dependence, and paraphrase-heavy delivery do not, because World Schools judging weights style at 40% and expects oratory. Successful converts treat WS as a new sport with familiar muscles, not PF with an accent; our format comparison covers exactly what changes.',
  },
  {
    question: 'How early should I start preparing?',
    answer:
      'A season, minimum. The skills selectors reward (impromptu casebuilding, three-role fluency, weighing) are habits, not tricks, and they compound with judged repetition. Starting the summer before the spring application window is the realistic timeline; starting the month before is a rehearsal for next year.',
  },
];

export default function UsaDebateSkillsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Train the layer selectors actually see."
      ctaBody="Judged rounds, all three roles, written feedback against the real criteria. That is the whole design of our competition program."
      lede={
        <p>
          Every applicant to a national World Schools team can speak. By the
          time selection gets serious, fluency is table stakes. What
          evaluators are hunting for is the layer <em>underneath</em> the
          delivery: the habits that make a debater reliable at the
          international level, in any chair, on any motion, an hour after
          seeing it. Those habits are specific, observable, and trainable.
          Here they are.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The five separators</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Role discipline.', 'A first speech that sets a metric, a second that rebuilds before extending, a whip with no new arguments: role fidelity under pressure is the fastest signal of real WSDC training, and its absence is the fastest disqualifier. Selectors can forgive a lost clash; they remember a broken role.'],
            ['Weighing as a reflex.', 'Average debaters prove things; selectable debaters compare them. If your arguments end with weighing and your final speeches resolve clashes on explicit metrics, you sound like a national-team debater, because that is what they sound like.'],
            ['Impromptu composure.', 'The one-hour prep, offline, is where international rounds are won. Evaluators notice who owns the prep room: burden analysis first, clean splits, a caseline everyone repeats. The prep planner is the drill.'],
            ['POI presence.', 'Sixty seconds of live contact per speech reveals more temperament than the other seven minutes combined. Offering sharp points and answering in one composed breath is disproportionately visible to anyone assessing you.'],
            ['Consistency across motion types.', 'Policy, value, actor, regret: a candidate who is brilliant on policy motions and lost on counterfactuals is a specialist, and national benches need generalists. Train your weakest family until it is boring.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The American convert’s gap: style</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The most common weakness in strong American applicants is the 40% of
          the score their previous format never graded. US circuit habits
          (speed, evidence-dumping, talking to the flow instead of the judge)
          are penalized under{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            World Schools judging
          </Link>
          , where the model judge is an intelligent generalist who expects to
          be <em>persuaded</em>. The fix is unglamorous: delivery drills,
          rhetoric reps, speech redos with the same content and better
          oratory. Converts who take style seriously close the gap in months;
          converts who treat it as garnish plateau exactly there. Start with{' '}
          <Link href="/world-schools-vs-public-forum" className="font-semibold text-signal-500 hover:text-signal-600">
            what changes from Public Forum
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">How to train the layer</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          None of the five separators can be crammed, because all five are
          habits revealed under pressure. The only training that
          builds them is <strong>judged rounds with honest feedback</strong>,
          repeated weekly, across all three roles and all four motion types.
          A season of that cycle, with a{' '}
          <Link href="/blog/world-schools-case-files" className="font-semibold text-signal-500 hover:text-signal-600">
            case file
          </Link>{' '}
          growing alongside it, is what a competitive application is
          made of. The application logistics themselves are covered in{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            our USA Debate guide
          </Link>
          , and the training calendar that leads up to them in{' '}
          <Link href="/blog/usa-debate-team-application-guide" className="font-semibold text-signal-500 hover:text-signal-600">
            the year-before plan
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
