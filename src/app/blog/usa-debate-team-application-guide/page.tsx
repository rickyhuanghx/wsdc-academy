import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('usa-debate-team-application-guide');

const post = getPostBySlug('usa-debate-team-application-guide')!;

const faqs = [
  {
    question: 'How early should I start preparing for the USA Debate application?',
    answer:
      'A full season. The application asks for video recordings of debate speeches, and speeches are the output of training, not of application-writing. Starting in September gives you a fall of real World Schools rounds, a winter of case-file and knowledge work, and a spring of recorded practice before the window opens. Starting in March gives you weeks to fake what others built over a year.',
  },
  {
    question: 'Do I need World Schools experience to apply?',
    answer:
      'Strong applicants usually have real World Schools rounds behind them, but converts from Public Forum, Lincoln-Douglas, and Policy are common in the format. What matters is demonstrating the WSDC skill set (style-forward delivery, role discipline, weighing), not the label on your past events. Converts should start with how the formats differ.',
  },
  {
    question: 'What are my chances?',
    answer:
      'The national team roster is small, so selection is genuinely competitive. But the NSDA also fields a Development Team specifically for students building their World Schools skills and growing the format locally, which widens the door. And the preparation is not wasted either way: the skills selectors reward are the same ones that win circuit tournaments, college interviews, and scholarship rounds.',
  },
];

export default function UsaDebateApplicationPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Build the season before the application."
      ctaBody="Our competition team runs the full training cycle (judged rounds, written feedback, real tournaments) that a credible application sits on top of."
      lede={
        <p>
          The USA Debate application is, at its core, three debate speeches:
          video recordings on motions the NSDA provides, plus a form and
          recommendations. That has a blunt consequence. You cannot cram for
          it, because the thing being judged is the debater you already are.
          This guide is the training plan for the year <em>before</em> you
          apply. For the process itself (eligibility rules, this cycle&apos;s
          window, how the two squads work), start with{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            our full USA Debate guide
          </Link>
          .
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Know the shape of it, then train</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Two facts about the process matter for planning, and only two. The
          window opens in the spring and closes in early summer, so put a
          reminder in your calendar every January; if you find out after it
          closes, your next chance is a year away. And the selection materials
          are debate speeches on provided motions, so everything that improves
          your debating improves your application. Current-cycle dates and
          eligibility live at{' '}
          <a
            href="https://www.speechanddebate.org/usa-debate/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-signal-500 hover:text-signal-600"
          >
            speechanddebate.org/usa-debate
          </a>{' '}
          and in{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            our guide to the team
          </Link>
          . Everything below is about the part no page of requirements can do
          for you.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">What a credible application sits on</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Real World Schools rounds.', 'Nothing substitutes for the format itself: three-person benches, impromptu prep, reply speeches, POIs. Find WS opportunities at local tournaments, your state league if it runs a division, or a training program that stages full judged rounds.'],
            ['Role fluency across all three chairs.', 'National-team debaters are interchangeable parts. Train the first, second, and third speaker roles until you are dangerous in any of them. Selectors value flexibility over a single polished lane.'],
            ['A broad knowledge base.', 'WSDC motions range across geopolitics, economics, ethics, and culture, and prep is offline. A season of case-file building (briefs, example banks, frameworks) is national-team preparation by another name.'],
            ['Style, deliberately trained.', 'International judging weights delivery at 40%. American speed and jargon habits are the most common convert weakness; oratory reps are the fix.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-navy-700">
          The deeper breakdown of what evaluators reward is in{' '}
          <Link href="/blog/usa-debate-team-skills" className="font-semibold text-signal-500 hover:text-signal-600">
            what national-team selectors look for
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The year, season by season</h2>
        <div className="mt-5 space-y-6">
          <div className="border-t border-navy-200 pt-5">
            <h3 className="font-bold text-navy-900">Fall (September to November): get into real rounds</h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              Join whatever World Schools competition you can reach: your
              school team, a state division, an online tournament, or a squad
              that scrimmages weekly. Rotate roles deliberately, one chair per
              tournament or practice block, and keep the written feedback from
              every judged round. The{' '}
              <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
                tournament map
              </Link>{' '}
              lists where the rounds are, including the online circuit if
              travel is a constraint.
            </p>
          </div>
          <div className="border-t border-navy-200 pt-5">
            <h3 className="font-bold text-navy-900">Winter (December to February): build the knowledge base</h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              Competition thins out over the holidays, which makes winter the
              case-file season. Write briefs on recurring motion themes, build
              your example bank, and run one-hour impromptu prep cycles on old
              WSDC motions weekly. Watch film of your fall rounds and pick the
              two weaknesses that show up most; those are your winter drills.
            </p>
          </div>
          <div className="border-t border-navy-200 pt-5">
            <h3 className="font-bold text-navy-900">Early spring (March): rehearse the actual task</h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              The application asks for recorded speeches, and recording is its
              own skill: no audience energy, no bench beside you, a camera
              instead of a judge. Record full 8-minute speeches on practice
              motions, watch them at full length, and redo them. Most students
              are shocked by their first recording. Better to be shocked in
              March than in the application window.
            </p>
          </div>
          <div className="border-t border-navy-200 pt-5">
            <h3 className="font-bold text-navy-900">The window (spring): execute, don&apos;t improvise</h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              When the cycle opens, read the current requirements top to
              bottom, ask your coach or administrator for recommendations
              early (they have their own deadlines and inboxes), and treat
              each provided motion like a real prep cycle: casebuild, draft,
              deliver, review, re-record. Submit days before the deadline, not
              hours.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Keep it in proportion</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The competition at the top is genuinely global: the last three
          World Schools Debating Championships were won by the United States
          (2023), Scotland (2024), and India (2025). That is part of what
          makes the format worth training regardless of where selection lands.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          A word of perspective from the coaching side: USA Debate is a
          milestone, not the sport. The roster is small by design, and most
          excellent World Schools debaters in America never wear the national
          blazer. They win circuit tournaments, captain their school teams,
          and carry the skill set into universities and careers. Build the
          season for its own sake (the{' '}
          <Link href="/blog/world-schools-debate-pathway-us" className="font-semibold text-signal-500 hover:text-signal-600">
            US pathway
          </Link>{' '}
          has honest rungs at every level) and let the application be
          something your training makes possible, not the only thing it is
          for.
        </p>
      </section>
    </BlogPostShell>
  );
}
