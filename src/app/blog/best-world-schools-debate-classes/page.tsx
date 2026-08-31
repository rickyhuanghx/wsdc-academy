import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

// Accuracy note (pattern shared with the other listicles): provider
// descriptions state only what each program publicly is (host, format,
// delivery). Dates, prices, and session details change yearly — never add
// them; the copy tells readers to confirm with each provider. Atlantic Ivy
// is a sister academy (same family as this site; the relationship is public
// on atlanticivy.com) and every mention of a family program below discloses
// it. Formats were verified 2026-08-31: each named camp's World Schools
// division was checked on its own site; UTNIF and ESU block crawlers, so
// re-verify those two manually each winter.

export const metadata = postMetadata('best-world-schools-debate-classes');

const post = getPostBySlug('best-world-schools-debate-classes')!;

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

function Int({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
    >
      {children}
    </Link>
  );
}

const faqs = [
  {
    question: 'How can I tell if a class actually teaches the World Schools format?',
    answer:
      'Ask three questions: do students debate three against three with reply speeches, are speeches marked on the 40/40/20 content, style, and strategy split, and does the class train impromptu motions on a one-hour clock? A provider that answers in Public Forum or parliamentary terms teaches a different format. It may still be an excellent class; it is just not World Schools.',
  },
  {
    question: 'Are there free World Schools debate programs?',
    answer:
      'Yes. Debate Spaces runs free online academy sessions through the school year, the NSDA Springboard series offers free online World Schools scrimmages that non-members can enter, and every national squad pathway, including USA Debate, is free to apply to. A school team plus a public motion bank covers daily practice at no cost.',
  },
  {
    question: 'What should I ask a provider before paying for a term?',
    answer:
      'Ask for the curriculum in writing, ask how many judged practice rounds a student debates per term and who judges them, and ask to see an example of the written feedback a student takes home. Then ask about the coach: no official World Schools coaching certification exists, so a coach’s own competition and judging record in this format is the honest signal. A provider confident in its classroom will let you sit in on the first session.',
  },
];

export default function BestWorldSchoolsClassesPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs"
      ctaLabel="See our programs"
      ctaHeading="See the checklist running in a classroom."
      ctaBody="Small live groups, a curriculum mapped to the 40/40/20 criteria, a judged round with oral adjudication, and written feedback after every session."
      lede={
        <p>
          Search for a World Schools debate class and most of what comes back
          teaches a different format entirely. This guide was written with the
          debate faculty at Atlantic Ivy Academy, our sister academy, whose
          coaches run World Schools classrooms in Dubai and share a roster
          with our online programs. That relationship is stated plainly
          wherever a family program appears below; every other academy and
          camp on this list is independent of us, and sessions, formats, and
          enrollment details should be confirmed with each provider directly.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          First, check the format
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          World Schools is the three-a-side international format: eight-minute
          speeches, a four-minute reply, points of information, and a season
          split between prepared and impromptu motions. If that sentence is
          new, start with our guide to{' '}
          <Int href="/what-is-world-schools-debate">what World Schools debate is</Int>.
          Many of the best-known American programs teach something else
          altogether. Capitol Debate and the National Symposium for Debate are
          respected Public Forum and Lincoln-Douglas camps, Stanford&apos;s
          summer institute is built around parliamentary formats, and most
          university institutes run Policy labs. None of that is a criticism
          of those programs. It does mean a student can train hard for a whole
          year and never hear a reply speech. If World Schools is the goal,
          the first filter is simple: does this class debate the format at
          all? Our{' '}
          <Int href="/world-schools-vs-public-forum">World Schools vs Public Forum comparison</Int>{' '}
          shows how much actually differs.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          What real World Schools training looks like
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The format publishes its own definition of good debating: speeches
          are marked 40 percent on content, 40 percent on style, and 20
          percent on strategy, and judges must explain their decision in a
          reasoned oral adjudication after the round. A serious class is built
          backwards from those rules. The curriculum maps to{' '}
          <Int href="/world-schools-debate-judging">the judging criteria</Int>,
          practice rounds end in the same oral adjudication a tournament
          delivers, and students take written feedback home. The second
          non-negotiable is impromptu work: half the preliminary rounds at the
          world championship are impromptu, with one hour of preparation and
          no coach or internet in the room, so a class where the coach builds
          every case is training students for exactly the wrong hour. Look
          for programs that make students prep unseen motions on a clock; a
          public <Int href="/motions">motion bank</Int>{' '}
          makes that cheap to drill at home as well. Last, the coach. No official World Schools
          coaching certification exists, so the honest signals are a
          coach&apos;s own competition and judging record in this specific
          format, and whether the program lets you watch a session before you
          pay.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Year-round academies and classes
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Year-round classes genuinely centered on World Schools are rare
          enough to name individually.{' '}
          <Ext href="https://capstonedebate.com/">Capstone Debate</Ext> in
          Hong Kong teaches WSDC-format classes in person and online, with
          age divisions from primary through senior secondary.{' '}
          <Ext href="https://www.debatespaces.org/">Debate Spaces</Ext>, an
          American nonprofit, runs free online academy sessions through the
          school year and draws students from dozens of countries. The{' '}
          <Ext href="https://www.speechdebateindia.com/">Speech and Debate Academy</Ext>{' '}
          teaches World Schools and British Parliamentary online in small
          groups for students in India and the UAE.{' '}
          <Ext href="https://www.debatedrills.com/">DebateDrills</Ext>, one of
          the strongest American online academies, is worth reading precisely:
          its club teams compete in Public Forum and Lincoln-Douglas, and it
          currently offers World Schools as private tutoring rather than group
          classes. We belong on this list twice, and say so plainly: our own{' '}
          <Int href="/programs">Foundation and Competition Team classes</Int>{' '}
          teach World Schools in small live groups with judged rounds and
          written feedback, and{' '}
          <Ext href="https://atlanticivy.com/dubai-debate-classes">Atlantic Ivy Academy</Ext>,
          our sister academy, runs the in-person version of that training in
          Dubai. Hold the family programs to the checklist above at least as
          hard as everyone else.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Summer camps with a real World Schools division
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Summer is where format confusion costs the most, because big camps
          sell out on reputation before families check the tracks. These
          programs actually run World Schools. The{' '}
          <Ext href="https://hdcsw.org/world-schools/">Harvard Debate Council Summer Workshops</Ext>{' '}
          have a dedicated World Schools division whose named faculty have
          coached the USA Debate team. The{' '}
          <Ext href="https://commstudies.utexas.edu/forensics/utnif">UTNIF</Ext>{' '}
          at the University of Texas runs a World Schools camp of its own,{' '}
          <Ext href="https://www.ilr.cornell.edu/cornell-international-debate-camp">Cornell&apos;s international debate camp</Ext>{' '}
          teaches the format and closes with a World Schools tournament, and
          the{' '}
          <Ext href="https://www.uh.edu/honors/programs-minors/co-curricular-programs/debate/debate-workshop/">University of Houston&apos;s Honors workshop</Ext>{' '}
          carries World Schools among several formats.{' '}
          <Ext href="https://vbidebate.com/camps">VBI</Ext>{' '}
          offers World Schools at selected sessions only, so confirm the
          specific session
          before enrolling. Outside the United States, the English-Speaking
          Union&apos;s{' '}
          <Ext href="https://www.esu.org/programmes/debate-academy/">Debate Academy</Ext>{' '}
          has run a World Schools track at its UK residential summer school,
          though not in every recent year, and the{' '}
          <Ext href="https://idebate.net/world-schools-debate-academy-2026~b5745/">World Schools Debate Academy</Ext>{' '}
          in Kranjska Gora, Slovenia pairs a training week with a closing
          tournament. At any multi-format camp the question is the same: will
          this student sit in a World Schools lab, with World Schools judges,
          debating World Schools rounds? For the wider map of camp types, our{' '}
          <Int href="/blog/best-debate-summer-camps">summer camp guide</Int>{' '}
          covers the categories.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          The free and selective routes
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Some of the best training in the format comes from the bodies that
          run it. In the United States,{' '}
          <Int href="/usa-debate-team">USA Debate</Int> selects a national
          team and a development team through an open application each spring
          (our{' '}
          <Int href="/blog/usa-debate-team-application-guide">application guide</Int>{' '}
          walks through it), and the NSDA&apos;s Springboard series offers
          free online World Schools scrimmages that even non-members can
          enter. Most other countries pick their WSDC squads through open
          trials run by the national debating body, from Canada and Hong Kong
          to Malaysia, Qatar, and India. Those trial calendars are worth
          knowing even for a student years away from squad level, because
          they define what a training season should build toward. Our essay
          on{' '}
          <Int href="/blog/world-schools-debate-pathway-us">the American World Schools pathway</Int>{' '}
          lays the whole ladder out, school team to Worlds.
        </p>
      </section>
    </BlogPostShell>
  );
}
