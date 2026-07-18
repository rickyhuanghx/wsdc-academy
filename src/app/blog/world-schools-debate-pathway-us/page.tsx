import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('world-schools-debate-pathway-us');

const post = getPostBySlug('world-schools-debate-pathway-us')!;

const faqs = [
  {
    question: 'My school has no World Schools team. Where do I start?',
    answer:
      'Three realistic doors: convince your existing speech and debate program to enter a WS division (three interested students is a bench), join an independent training program that fields teams, or start with online judged rounds to build the fundamentals while you organize the first two. The format needs three people and a coach willing to learn, which is less than most clubs assume.',
  },
  {
    question: 'Which states have World Schools divisions?',
    answer:
      'Verified at the state-championship level: Texas (World Schools is an official TFA event with a division at TFA State), Indiana (ISSDA State Debate runs a WS bracket), and Florida (the FFL Open State Championship has offered WS); Washington has run WS as a trial event at its WIAA state championships. Georgia’s GFCA State does not include WS, but Georgia invitationals like Westminster and the Peach State Classic run divisions. The format is growing year to year, so check your state association’s current event list, and remember that invitationals, the TOC bid circuit, and NSDA district qualification are open routes regardless of state infrastructure.',
  },
  {
    question: 'Is World Schools worth it if I never aim for the national team?',
    answer:
      'Arguably more than any other format. The skills WS trains (impromptu analysis, persuasive oratory to generalist audiences, collaborative casebuilding) are the ones that transfer directly to interviews, seminars, and careers. The national team is one exit from the pathway; it is nowhere near the most common reason to walk it.',
  },
];

export default function PathwayPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Whatever rung you’re on, training is the ladder."
      ctaBody="From first-round beginners to national-circuit competitors, our programs meet students at their rung and move them up it."
      lede={
        <p>
          World Schools is the world&apos;s format, and in the United States
          it is the fastest-growing thing in competitive debate. The pathway
          now runs unbroken from a first practice round to representing the
          country, but because it assembled itself piece by piece, nobody
          hands students a map of it. This is the map: four rungs, what each
          one asks of you, and how to climb between them.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Rung one: the school team</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Everything starts with a bench of three and someone to judge them.
          Some students find World Schools inside an existing speech and
          debate program; others build it themselves, since a WS division
          entry needs fewer people than almost any other team event. Results
          matter less at this rung than reps in the format&apos;s actual
          shape: full rounds with reply speeches and POIs, all three{' '}
          <Link href="/blog/first-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            speaker roles
          </Link>{' '}
          rotated, prep hours run{' '}
          <Link href="/resources/prep-hour-planner" className="font-semibold text-signal-500 hover:text-signal-600">
            on the clock
          </Link>
          . If your school has nothing, online judged rounds fill this rung
          completely. The format travels well.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Rung two: invitationals and state leagues</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The first competitive step is whatever World Schools division is
          within reach, and there are more than most coaches realize. A full
          national circuit of invitationals now runs WS divisions from
          September through March: Yale and the Harvard National tournament in
          the Northeast, Stanford and Berkeley&apos;s Cal Invitational in
          California, Florida Blue Key and the Sunvitational in Florida, and a
          dense Texas calendar from the Grapevine Classic through St.
          Mark&apos;s Heart of Texas and UT Austin&apos;s Longhorn Classic.
          (The full month-by-month list, with links, is in our{' '}
          <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
            tournament guide
          </Link>
          .)
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          State associations are following. World Schools is an official{' '}
          <a href="https://texasforensicassociation.com/world-schools/" target="_blank" rel="noopener noreferrer" className="font-semibold text-signal-500 hover:text-signal-600">
            Texas Forensic Association
          </a>{' '}
          event with a division at TFA State;{' '}
          <a href="https://www.inspeechanddebate.org/tournaments/state-debate" target="_blank" rel="noopener noreferrer" className="font-semibold text-signal-500 hover:text-signal-600">
            Indiana&apos;s ISSDA
          </a>{' '}
          runs WS at its State Debate tournament; Florida&apos;s FFL has
          offered it at its Open State Championship; and Washington has staged
          it as a trial event at the WIAA state championships. This rung
          teaches what practice cannot: unfamiliar judges, unfamiliar benches,
          and motions you did not pick. Treat every tournament as case-file
          fuel: each debated motion becomes a{' '}
          <Link href="/blog/world-schools-case-files" className="font-semibold text-signal-500 hover:text-signal-600">
            brief in the binder
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Rung three: the national stage</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Two summits sit at the top of the domestic season. The{' '}
          <strong>Tournament of Champions</strong> at the University of
          Kentucky runs a World Schools division each April, entered through a
          bid system. Its{' '}
          <a href="https://ci.uky.edu/debate/toc/bids/bid-tournaments" target="_blank" rel="noopener noreferrer" className="font-semibold text-signal-500 hover:text-signal-600">
            official bid list
          </a>{' '}
          names roughly thirty qualifying tournaments a season, which is the
          clearest proof of how real the US circuit has become.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          The other is <strong>NSDA Nationals</strong>, whose World Schools
          event, formally the{' '}
          <a href="https://www.speechanddebate.org/uswsdi-manual/" target="_blank" rel="noopener noreferrer" className="font-semibold text-signal-500 hover:text-signal-600">
            USA World Schools Debate Invitational
          </a>
          , is the format&apos;s biggest annual stage in the country. The
          pathway runs through your NSDA district: each district may enter up
          to two teams of three to five students, assembled from competitors
          at the district tournament, so you do not need a
          school-based WS squad to get there. Prepared motions are released
          May 1; impromptu motions land one hour before each round. It is
          also where the skills separate visibly: benches that{' '}
          <Link href="/blog/weighing-in-debate" className="font-semibold text-signal-500 hover:text-signal-600">
            weigh
          </Link>
          , hold roles, and speak to the{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            40/40/20 criteria
          </Link>{' '}
          beat benches that merely argue well.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Rung four: USA Debate</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          At the top sits the national team: a small roster, selected annually
          through an NSDA-administered application, that competes
          internationally against the world&apos;s best school-age debaters (and won the
          World Schools Debating Championship as recently as 2023). The
          honest framing: it is a narrow gate that most excellent debaters
          never pass through, and the pathway is worth walking regardless.
          If it is your goal, the eligibility rules and timeline are in{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            our USA Debate guide
          </Link>
          , the training plan in{' '}
          <Link href="/blog/usa-debate-team-application-guide" className="font-semibold text-signal-500 hover:text-signal-600">
            the year-before plan
          </Link>
          , and the skill profile in{' '}
          <Link href="/blog/usa-debate-team-skills" className="font-semibold text-signal-500 hover:text-signal-600">
            what selectors look for
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Climbing between rungs</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The pattern across all four rungs is the same: the climb is made of{' '}
          <strong>judged rounds with real feedback</strong>, accumulated
          faster than your local circuit alone can provide them. That is the
          gap a training system exists to fill: weekly rounds, all roles,
          all{' '}
          <Link href="/resources/motion-types" className="font-semibold text-signal-500 hover:text-signal-600">
            motion types
          </Link>
          , written feedback against the criteria that actually get scored.
          Wherever you are on the ladder, the next rung is a season of that
          away.
        </p>
      </section>
    </BlogPostShell>
  );
}
