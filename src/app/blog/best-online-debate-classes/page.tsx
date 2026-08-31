import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

// Accuracy note: provider descriptions state only what each publicly is.
// Prices, schedules, and class details change often — keep them out of this
// page and let the copy point readers to each provider's site.

export const metadata = postMetadata('best-online-debate-classes');

const post = getPostBySlug('best-online-debate-classes')!;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-signal-500 hover:text-signal-600"
    >
      {children}
    </a>
  );
}

const faqs = [
  {
    question: 'At what age can a child start an online debate class?',
    answer:
      'Around age 9 or 10, most children can hold a structured two-sided argument and enjoy doing it. Below that, public speaking and storytelling classes build the same muscles with less structure. The real threshold is not age but attention: a live class only works once a child can stay engaged on camera for the full session.',
  },
  {
    question: 'Do online debate classes actually work compared to in-person?',
    answer:
      'For the core skills, yes: argument construction, rebuttal, and weighing are taught, practiced, and judged just as well over video, and online formats widen the pool of teammates and opponents beyond one town. What online cannot replicate is the podium-in-a-room experience, which is why serious competitors eventually add in-person tournaments to online training.',
  },
  {
    question: 'How do I judge quality before paying for a term?',
    answer:
      'Ask for the curriculum in writing, ask how many judged practice debates a student gets per term, and ask what feedback looks like after a session. Then sit in on the first class. A provider confident in its classroom will let you watch it.',
  },
];

export default function BestOnlineDebateClassesPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/online-debate-classes"
      ctaLabel="See our online classes"
      ctaHeading="See what a training system looks like."
      ctaBody="Small live groups, a structured curriculum, judged practice rounds, and written feedback after every session, for ages 9 to 18."
      lede={
        <p>
          Search for an online debate class and you will find everything from
          $15 drop-in sessions to four-figure competitive academies, described
          in nearly identical language. The difference between them is not the
          Zoom link. It is whether the class is a training system or a weekly
          lecture. We run online classes ourselves and say so plainly below;
          the framework for evaluating providers applies to ours exactly as
          hard as to anyone else&apos;s.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          The four things that make a class real training
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Students do not improve from being told about debate; they improve
          from debating, being judged, and hearing what to fix. Whatever
          provider you consider, look for a curriculum with an order (skills
          stacking week over week, not a topic of the week), real practice
          rounds against other students, qualified judging of those rounds,
          and written feedback that survives past dinner. A class missing two
          of the four is an enrichment activity. That can be fine, as long as
          it is priced and chosen as one.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Marketplaces: the low-commitment on-ramp
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Platforms like <Ext href="https://outschool.com/online-classes/debate">Outschool</Ext>{' '}
          list hundreds of independent debate classes, usually short,
          inexpensive, and easy to try. They are a genuinely good way to
          discover whether a child enjoys arguing a side at all. Their limit
          is continuity: classes are one-off or short-series, the instructor
          pool varies widely, and few offer judged rounds against a stable
          cohort. Treat a marketplace class as the taste test, not the
          training plan.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Format specialists and competitive academies
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          At the serious end sit programs built around specific competitive
          formats. <Ext href="https://academy.debatedrills.com/">DebateDrills</Ext>{' '}
          is known for Public Forum, Lincoln-Douglas, and Policy;{' '}
          <Ext href="https://www.capitoldebate.com/">Capitol Debate</Ext> and{' '}
          <Ext href="https://potomacdebate.com/">Potomac Debate</Ext> run
          online classes alongside their camps; regional clubs like the{' '}
          <Ext href="https://www.fremontdebateacademy.org/">Fremont Debate
          Academy</Ext> and{' '}
          <Ext href="https://www.debateablekids.com/">Debateable Kids</Ext>{' '}
          serve younger students. We belong in this category too: our{' '}
          <Link
            href="/online-debate-classes"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            online debate classes
          </Link>{' '}
          teach{' '}
          <Link
            href="/what-is-world-schools-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            World Schools Debate
          </Link>{' '}
          in small live groups with judged rounds and written feedback, and
          that sentence is us describing our own product. The pattern to
          notice across all of these: the strong programs commit to a format
          and teach it deeply, rather than surveying &ldquo;debate&rdquo; in
          general.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Matching the class to the student
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          A nine-year-old trying debate for the first time, a seventh grader
          who loves arguing and needs structure, and a tenth grader chasing
          national-circuit results need different rooms. For the first,
          marketplaces or a beginner class with a real curriculum both work.
          For the second, pick a program with a stable weekly cohort and
          practice rounds; this is where skills actually form. For the third,
          the format question dominates: pick the circuit first (our{' '}
          <Link
            href="/world-schools-vs-public-forum"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            World Schools vs Public Forum comparison
          </Link>{' '}
          explains the main fork), then choose among the programs serious
          about that format. And for any of the three, the four-part checklist
          above is the filter that matters.
        </p>
      </section>
    </BlogPostShell>
  );
}
