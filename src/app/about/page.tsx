import type { Metadata } from 'next';
import Link from 'next/link';
import { coaches, founders } from '@/data/coaches';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About WSDC Prep: Who Coaches Your World Schools Debate Training',
  description:
    'WSDC Prep is a year-round online World Schools Debate training program founded in 2026 by coaches from the Oxford Union and Columbia Debate Society. Who we are, how we train, and why.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About WSDC Prep',
    description:
      'A year-round training system for World Schools Debate, founded in 2026 by coaches from the Oxford Union and Columbia Debate Society.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-signal-400">About</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Built by people who lived the format.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-100">
            WSDC Prep is a year-round online training program for World Schools
            Debate, built for US students and run by coaches who have competed and
            adjudicated the format at the international level.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-navy-900">Why we started this</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          World Schools is the most widely practiced debate format in the world, and the
          American pathway into it has grown fast: an official NSDA event with its own
          invitational at Nationals, state divisions in Texas, Florida, and Indiana, a
          Tournament of Champions division, and a national team that won the World Schools
          Debating Championships in 2023. What the US did not have was year-round training
          built specifically for the format. Most serious World Schools programs in America
          run as summer intensives; seasons are won between September and June.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          WSDC Prep launched in 2026 to close that gap: a structured curriculum mapped to
          the 40/40/20 judging criteria, judged practice rounds on real tournament motions,
          and written feedback after every session, all season long.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-navy-900">Who runs it</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The academy was founded by {founders.map((f) => f.name).join(' and ')}.
        </p>
        <div className="mt-6 space-y-5">
          {founders.map((f) => (
            <div key={f.slug} className="border-t border-navy-100 pt-5">
              <h3 className="font-bold text-navy-900">
                {f.name}
                <span className="font-normal text-navy-500"> · {f.role}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">
                {f.credentials.join('. ')}.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 leading-relaxed text-navy-700">
          They lead a team of {coaches.length} coaches{' '}
          whose experience spans the Oxford
          Union, the Columbia Debate Society, Harvard, Yale, Brown, LSE, and national-squad
          training rooms in Europe and the Middle East. Every coach&apos;s full credentials are
          listed on{' '}
          <Link href="/coaches" className="font-medium underline underline-offset-2 hover:text-signal-500">
            the coaches page
          </Link>
          .
        </p>

        <h2 className="mt-12 text-2xl font-bold text-navy-900">
          About the &quot;500+ students&quot; number
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The homepage says our team has coached more than 500 students. That figure counts
          students taught across our coaches&apos; combined careers in competitive debate,
          public speaking, and academic-competition coaching, not enrollments in WSDC
          Academy alone, which launched in 2026. We phrase it as &quot;coached by our
          team&quot; for exactly that reason.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-navy-900">How we train</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Everything runs on one loop: drill, compete, review. Classes drill the skills the
          judging criteria actually score. Students then debate judged practice rounds under
          competition conditions, on real tournament motions and the real one-hour impromptu
          clock. Every round ends with a full oral adjudication, and every session ends with
          written feedback. Four programs carry that loop from a student&apos;s first round
          to NSDA Nationals and the USA Debate application; the{' '}
          <Link href="/programs" className="font-medium underline underline-offset-2 hover:text-signal-500">
            programs page
          </Link>{' '}
          maps the ladder.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-navy-900">Independence</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          WSDC Prep is an independent coaching service. We are not affiliated with,
          endorsed by, or officially connected to the National Speech &amp; Debate
          Association, the World Schools Debating Championships, or USA Debate. When we
          write about their rules and dates, we cite their official pages and tell you to
          treat those as the source of truth.
        </p>

        <h2 className="mt-12 text-2xl font-bold text-navy-900">Contact</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The fastest way to reach us is{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline underline-offset-2 hover:text-signal-500">
            {CONTACT_EMAIL}
          </a>
          . If you are deciding whether the program fits your student, the{' '}
          <Link href="/consultation" className="font-medium underline underline-offset-2 hover:text-signal-500">
            free consultation
          </Link>{' '}
          ends with a placement recommendation and no obligation.
        </p>
      </section>
    </>
  );
}
