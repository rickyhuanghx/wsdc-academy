import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('world-schools-case-files');

const post = getPostBySlug('world-schools-case-files')!;

const faqs = [
  {
    question: 'Are case files actually allowed in World Schools prep?',
    answer:
      'Yes. For impromptu motions, the standard rule is one hour of prep with no internet or electronic devices, but printed materials are permitted. That asymmetry is the whole point of a case file: the research you cannot do in the hour, done in advance and carried in on paper. Always confirm the specific tournament’s rules, since local invitationals occasionally vary.',
  },
  {
    question: 'How long should a case file be?',
    answer:
      'Short enough to navigate in sixty minutes. A 300-page binder is a security blanket, not a tool. If finding the right brief takes five minutes, it cost you five minutes. Most strong files are tight: a few dozen well-organized pages with a table of contents, built to be scanned, not read.',
  },
  {
    question: 'Should we write full pre-prepared cases?',
    answer:
      'No. Pre-written cases tempt teams to force the motion into the case they brought, which judges spot instantly: the speech answers a slightly different motion than the one set. Build reusable components (briefs, examples, frameworks) and assemble them fresh against the actual wording in the room.',
  },
];

export default function CaseFilesPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Our teams build their files together, all season."
      ctaBody="Case-file construction is a standing assignment in our competition program: every motion we debate feeds the binder."
      lede={
        <p>
          The prep hour has a loophole, and it is printed on paper. No internet
          and no devices, but the rules of World Schools allow{' '}
          <strong>printed materials</strong> in the prep room. Which means the
          real preparation for an impromptu round happens weeks earlier, when
          your team decides what goes in the binder. Here is what belongs in a
          case file, what doesn&apos;t, and how to build one across a season.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">What goes in the file</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['Topic-area briefs', 'one or two pages each on the recurring motion territories: education, criminal justice, international relations, tech regulation, development economics, media, sports, health. Each brief: the core tensions, the standard arguments both ways, and the traps.'],
            ['An example bank', 'the highest-value section. Real-world cases sorted by what they prove (a policy that worked, a ban that backfired, a movement that split), each with three lines of context so any speaker can deploy it accurately.'],
            ['Framework pages', 'the reusable analytical spines: how to argue about rights vs. welfare, individual vs. collective, state vs. market, short-term vs. generational. These transfer across nearly every value motion.'],
            ['Actor profiles', 'for actor motions: one page each on the actors that recur (major powers, international institutions, social movements), covering incentives, constraints, and recent positioning.'],
            ['Your own templates', 'the prep planner and speaker sheets, blank, several copies each.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          The printable templates are in the{' '}
          <Link href="/resources" className="font-semibold text-signal-500 hover:text-signal-600">
            resource library
          </Link>
          . The{' '}
          <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
            prep planner
          </Link>{' '}
          and all three{' '}
          <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            speaker cheat sheets
          </Link>{' '}
          are designed to live in the front pocket of the file.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Build it as a season habit, not a project</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['After every practice motion, file the residue.', 'Each debated motion produces a brief’s worth of knowledge: arguments that worked, examples that landed, the trap your team fell into. Ten minutes of write-up after practice compounds into the best section of the file.'],
            ['Assign beats, like a newsroom.', 'Each teammate owns two or three topic areas and keeps those briefs current. Ownership beats committee: five people vaguely maintaining everything maintains nothing.'],
            ['Refresh examples monthly.', 'An example bank curdles fast; a case study from three years ago reads staler than one from this season. Rotate new material in and prune anything nobody has used.'],
            ['Rehearse with the file.', 'Run prep-hour drills using the binder so navigating it becomes muscle memory. The first time you search your own file should not be at a tournament.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">What to leave out</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Pre-written cases (they warp your reading of the actual motion),
          raw statistics without context (a number you can&apos;t explain is a{' '}
          <Link href="/blog/debate-rebuttal-guide" className="font-semibold text-signal-500 hover:text-signal-600">
            rebuttal
          </Link>{' '}
          waiting to happen), and anything nobody on the team has read. The
          file is a toolkit, not an archive: every page must earn its place by
          being usable in a sixty-minute window by a stressed teenager. Edit
          to that standard.
        </p>
      </section>
    </BlogPostShell>
  );
}
