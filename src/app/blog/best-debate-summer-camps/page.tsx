import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

// Accuracy note: camp descriptions below state only what each program
// publicly is (host, general format focus). Dates, prices, locations, and
// session details change yearly — never add them here; the copy tells readers
// to verify with each camp. Re-skim the named camps' sites each winter.

export const metadata = postMetadata('best-debate-summer-camps');

const post = getPostBySlug('best-debate-summer-camps')!;

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
    question: 'When should we register for a debate summer camp?',
    answer:
      'Earlier than feels necessary. Many camps open registration in winter, and popular residential sessions can fill months before summer. If a specific camp or session matters to you, get on its list as soon as registration opens and confirm dates directly with the organizer.',
  },
  {
    question: 'Residential or online: which is better?',
    answer:
      'They do different jobs. A residential institute gives full immersion, a cohort, and long days of rounds; it suits committed competitors. Online intensives cost less, remove travel, and fit around family plans; they suit beginners testing the water and students who want focused skill work rather than a campus experience.',
  },
  {
    question: 'What should a debate camp day actually contain?',
    answer:
      'The same things a good season contains, compressed: instruction in the morning, practice rounds in the afternoon, and feedback that names what to fix. Ask any camp how many judged practice rounds a student debates per week. That single number predicts more than any brochure page.',
  },
];

export default function BestDebateCampsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/summer-debate-camp"
      ctaLabel="About our summer camp"
      ctaHeading="Want the online option done properly?"
      ctaBody="Our summer bootcamp compresses a beginner term into two weeks: live small-group sessions, real practice debates, and written feedback."
      lede={
        <p>
          There are more American debate camps than any family has time to
          research, and most &ldquo;best camps&rdquo; lists are advertising.
          This one is a map instead: the four kinds of camp that actually
          exist, named examples of each, and the questions that separate a
          strong program from an expensive one. We run a summer program
          ourselves and say so where it appears; every other program listed
          here is independent of us, and dates, prices, and formats should be
          verified with each camp directly.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          University-hosted institutes
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The classic residential experience: multi-week programs hosted on a
          university campus, with dorms, long training days, and a large
          cohort. <Ext href="https://hdcsw.org/">Harvard Debate Council
          Summer Workshops</Ext> and Emory&apos;s{' '}
          <Ext href="https://barkleyforum.emory.edu/institutes/index.html">
            Barkley Forum institutes
          </Ext>{' '}
          are long-running examples, and the{' '}
          <Ext href="https://snfi.stanford.edu/">Stanford National Forensic
          Institute</Ext>{' '}
          runs both on-campus and online sessions. These suit
          committed competitors who want immersion and a national peer group.
          They are also the most expensive kind, so match the investment to
          the student&apos;s actual competitive goals.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          National camp providers
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Independent organizations that run sessions in multiple cities or
          multiple formats each summer.{' '}
          <Ext href="https://www.capitoldebate.com/">Capitol Debate</Ext> and{' '}
          <Ext href="https://www.debatecamp.com/">Debate Camp</Ext> both
          operate this way, and{' '}
          <Ext href="https://www.nsdebatecamp.com/">National Symposium for
          Debate</Ext> specializes in LD and PF with topic-focused prep. The
          advantage is accessibility: more locations, more session lengths,
          and usually a wider range of experience levels than a single
          university institute.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          League and community camps
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Urban debate leagues and regional clubs run summer programs that are
          often the best value in the landscape:{' '}
          <Ext href="https://www.bostondebate.org/debatecamp/">Boston Debate
          League</Ext>, the{' '}
          <Ext href="https://www.brooklyndebateleague.org/camp">Brooklyn
          Debate League</Ext>, the{' '}
          <Ext href="https://mnudl.augsburg.edu/">Minnesota Urban Debate
          League</Ext>, and regional programs like{' '}
          <Ext href="https://potomacdebate.com/summer-camp/">Potomac
          Debate</Ext> in the DC area. If one operates where you live, it is
          usually the right first camp: local, affordable, and connected to
          the school-year circuit the student will actually compete in.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          Online intensives
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Live online camps compress a term of instruction into one or two
          weeks without travel. Several providers above run virtual sessions
          alongside their campus ones. Ours is the{' '}
          <Link
            href="/summer-debate-camp"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            WSDC Prep summer debate camp
          </Link>
          : a live, small-group World Schools bootcamp for ages 9 to 16 with
          judged practice debates and written feedback (that is our program,
          so weigh this paragraph accordingly). Online works best when the
          group is small and the camp ends with real, judged rounds rather
          than a showcase.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">
          How to compare any two camps
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Four questions do most of the work. How many judged practice rounds
          per week, and who judges them? What is the student-to-instructor
          ratio in the lab or group, not the lecture? Does feedback arrive in
          writing, or evaporate with the applause? And which{' '}
          <Link
            href="/what-is-world-schools-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            format
          </Link>{' '}
          does the camp teach, in depth, rather than surveying? A camp with
          strong answers to all four beats a famous name with weak ones. For
          what a full training year looks like after camp, see our{' '}
          <Link
            href="/blog/world-schools-debate-pathway-us"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            US World Schools pathway guide
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
