import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('extemporaneous-debate');

const post = getPostBySlug('extemporaneous-debate')!;

const faqs = [
  {
    question: 'What is extemporaneous debate?',
    answer:
      'Extemporaneous Debate (XDB) is a one-on-one NSDA debate event. A new resolution is posted 30 minutes before each round, the tab room assigns sides, and the two debaters then argue a compact 16-minute round of two-minute speeches with one-minute cross-examinations. It is offered as a supplemental event at the NSDA National Tournament.',
  },
  {
    question: 'How long is an extemporaneous debate round?',
    answer:
      'About 16 minutes of scheduled time: a two-minute constructive and a one-minute cross-examination for each side, then two-minute rebuttals and final rebuttals for each side, with two fixed one-minute prep pauses built into the round. Every speech is two minutes, and speech time is protected: neither the opponent nor the judge may interrupt.',
  },
  {
    question: 'What is the difference between extemporaneous debate and extemporaneous speaking?',
    answer:
      'They share a word and a 30-minute prep window and nothing else. Extemporaneous speaking is a solo speech event: you draw three questions, pick one, and deliver a single seven-minute speech with no opponent. Extemporaneous debate is a head-to-head debate against another competitor, with cross-examination and rebuttals, on a resolution the tournament posts for everyone in the round.',
  },
  {
    question: 'Can you use the internet during extemporaneous debate prep?',
    answer:
      'Yes, between the posting of the topic and the start of the debate. NSDA rules let students research online during the 30-minute window and bring materials they created themselves, including pre-written blocks and flows, with the expectation that sources are cited and used ethically. Research is allowed but not required to win.',
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

const roundSegments: Array<[string, string]> = [
  ['Proposition constructive', '2 min'],
  ['Cross-examination (Opposition asks)', '1 min'],
  ['Opposition constructive', '2 min'],
  ['Cross-examination (Proposition asks)', '1 min'],
  ['Mandatory prep time', '1 min'],
  ['Proposition rebuttal', '2 min'],
  ['Opposition rebuttal', '2 min'],
  ['Mandatory prep time', '1 min'],
  ['Proposition final rebuttal', '2 min'],
  ['Opposition final rebuttal', '2 min'],
];

export default function ExtemporaneousDebatePost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/competition-team"
      ctaLabel="About the Competition Team"
      ctaHeading="Short-prep skills are trained skills."
      ctaBody="Our students prep unfamiliar motions on the clock every week. The case-building system that survives a 30-minute window is exactly what we coach."
      lede={
        <p>
          Extemporaneous Debate is the National Speech &amp; Debate
          Association&apos;s sprint format: one debater per side, a brand
          new resolution posted 30 minutes before the round, and a
          16-minute clash of two-minute speeches. Nothing in American
          debate rewards fast, structured thinking more directly. This
          guide covers the official format, what the rules actually allow
          during prep, how the event differs from the speech event it is
          always confused with, and a 30-minute prep routine that holds
          up.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          How does an extemporaneous debate round work?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Tournament officials post the resolution 30 minutes before the
          round (before flight A at flighted tournaments), and the tab
          room assigns each debater a side. Proposition must present and
          defend a sufficient case for the resolution; Opposition must
          oppose the resolution or the Proposition&apos;s case. The round
          itself runs ten segments:
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-navy-900 text-sm uppercase tracking-wide text-navy-900">
                <th className="py-2 pr-4 font-semibold">Segment</th>
                <th className="py-2 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {roundSegments.map(([segment, time]) => (
                <tr key={segment} className="border-b border-navy-200 text-navy-700">
                  <td className="py-2 pr-4">{segment}</td>
                  <td className="py-2 font-mono text-sm">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          Two details trip up newcomers. Speech times are protected, so
          there are no points of information and no interruptions from
          the judge. And the two one-minute prep blocks are fixed pauses
          in the round schedule, not a personal prep bank you spend when
          you choose, which is how prep works in Public Forum and
          Lincoln-Douglas.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What do the rules allow during the 30 minutes?
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          More than most competitors use. NSDA rules explicitly permit
          internet research between the topic posting and the start of
          the debate, with sources cited and used ethically, and allow
          debaters to bring materials they created themselves, including
          pre-written blocks and flows. Research is allowed but not
          required; the event is judged on the debate as it is debated.
          Judges decide the round on what was argued, not their personal
          beliefs, and give no oral or written feedback to the debaters
          after deciding.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          At the National Tournament, Extemporaneous Debate is a
          supplemental event, entered alongside the main events rather
          than instead of them, and NSDA publishes topic areas rather
          than resolutions in advance. The 2026 Nationals list ran from
          Environment and Conservation through U.S. Politics; the
          specific resolution still only appears 30 minutes out.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          One word, four different events
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          &ldquo;Extemporaneous&rdquo; is the most overloaded word in
          speech and debate, so it is worth being precise.
          <strong> Extemporaneous speaking</strong> is a solo speech
          event: draw three questions, pick one, prep 30 minutes, deliver
          one seven-minute speech with no opponent.
          <strong> Extemp Commentary</strong> is another solo speaking
          supplemental. <strong>Big Questions</strong> is one-on-one
          debate, but on a single resolution that lasts the whole season.
          And people say &ldquo;extemporaneous debating&rdquo; loosely
          for any limited-prep format, including American parliamentary
          debate and the impromptu half of{' '}
          <InLink href="/what-is-world-schools-debate">World Schools
          debate</InLink>, where teams prep unseen motions in an hour.
          When a tournament invitation says Extemporaneous Debate or XDB,
          it means the NSDA one-on-one format above.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          A 30-minute prep routine that holds up
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Thirty minutes is enough for a full case if you spend it in the
          right order. Minutes one to five: define the resolution&apos;s
          key terms in plain language and write the question the round
          should turn on, because framing decides short rounds even more
          than long ones. Minutes five to fifteen: build two arguments,
          each in layers (claim, mechanism, impact), using the structure
          in{' '}
          <InLink href="/blog/how-to-build-a-debate-argument">how to
          build a debate argument</InLink>. Minutes fifteen to
          twenty-two: switch sides in your head and write the two best
          arguments against you, plus one answer to each; the{' '}
          <InLink href="/blog/debate-rebuttal-guide">rebuttal
          four-step</InLink> compresses well into two-minute speeches.
          Minutes twenty-two to thirty: script your first thirty seconds
          and your final rebuttal&apos;s comparison, the two moments that
          decide most XDB ballots. In a two-minute final rebuttal there
          is no time to extend everything, so plan to{' '}
          <InLink href="/blog/weighing-in-debate">weigh</InLink>: pick
          the clash you are winning and tell the judge why it outweighs
          theirs.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          The only way to get fast at this is reps on unfamiliar topics.
          Pull a motion you have never thought about from the{' '}
          <InLink href="/motions">motion bank</InLink> or the leveled
          lists on the{' '}
          <InLink href="/debate-topics">debate topics page</InLink>, set
          a 30-minute timer, and run the routine start to finish. Ten of
          those sessions are worth a season of casual practice, and the
          same drill is the core of{' '}
          <InLink href="/blog/debate-practice">our practice
          guide</InLink>.
        </p>
      </section>
    </BlogPostShell>
  );
}
