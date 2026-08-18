import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ProgramsCoachStrip } from '@/components/ProgramsCoachStrip';

// The commercial hub for generic "debate coaching" queries (2026-08-17 audit).
// /programs stays the pillar for "world schools debate coaching", which it
// already ranks for; this page targets the unmodified term and funnels into
// /programs, /programs/private-coaching, and /consultation. Generic-term SERPs
// are held by aged marketplaces, so this page is a seed planted to accrue age
// and links, not a quick win. Expand it once the domain has a link profile.

export const metadata: Metadata = {
  title: 'Online Debate Coaching for Students Ages 9–18',
  description:
    'Live online debate coaching: structured curriculum, judged practice rounds, and written feedback. Group classes and private 1-on-1 tutoring for ages 9 to 18.',
  alternates: { canonical: '/debate-coaching' },
  openGraph: {
    title: 'Online Debate Coaching | WSDC Prep',
    description:
      'Debate coaching built as a training system: structured curriculum, judged practice rounds, and written feedback after every session.',
    url: '/debate-coaching',
  },
};

const pageFaqs = [
  {
    question: 'How much does debate coaching cost?',
    answer:
      'Group programs work out to roughly $27 to $35 per hour of live instruction, billed by the term. Private 1-on-1 coaching is $120 per hour, with an $80 diagnostic session and discounted 10- and 20-hour packages. Current prices for every program are listed on the programs page.',
  },
  {
    question: 'Is the coaching online or in person?',
    answer:
      'All coaching is live and online, scheduled for US time zones: weekday evenings ET/CT/PT plus weekend slots. Sessions are built around American school schedules and the American competitive calendar.',
  },
  {
    question: 'Which debate format do you coach?',
    answer:
      'We coach World Schools Debate, the international 3-on-3 format used at the World Schools Debating Championships and at NSDA Nationals. Students arriving from Public Forum, Lincoln-Douglas, Congress, or Model UN convert quickly: the core skills of argument, rebuttal, and weighing transfer directly.',
  },
  {
    question: 'Does a beginner need a debate coach?',
    answer:
      'A beginner needs structure more than anything: a curriculum that builds skills in order, reps in real rounds, and feedback that names one fixable thing at a time. That is exactly what a good coaching program provides, and it is why our beginner classes end with judged practice debates rather than lectures.',
  },
];

export default function DebateCoachingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Debate Coaching', href: '/debate-coaching' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Online debate coaching for students
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Debate coaching, done as a training system: a structured curriculum,
            judged practice rounds, and written feedback after every session.
            Live online for students ages 9 to 18 across the United States.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/consultation"
              className="inline-block rounded-md bg-signal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Book a free consultation
            </Link>
            <Link
              href="/programs"
              className="inline-block rounded-md border border-navy-300 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              See programs &amp; prices
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          What debate coaching should actually include
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Plenty of debate instruction is a lecture about argumentation followed
          by a homework prompt. Students do not improve from being told about
          debate; they improve from debating, being judged, and hearing exactly
          what to fix. Whatever program you choose, ours or anyone else&apos;s,
          look for four things:
        </p>
        <ol className="mt-6 space-y-4">
          {[
            ['A curriculum with an order', 'Skills stack: claim construction before rebuttal, rebuttal before weighing, weighing before whole-round strategy. A coach with a syllabus beats a coach with a topic of the week.'],
            ['Real rounds, judged', 'Practice debates against other students, adjudicated by someone qualified to say who won and why. Reps without judging turn into habits nobody catches.'],
            ['Written feedback', 'Oral adjudication fades by dinner. A written note after every session gives the student, and you, a record of what was fixed and what is next.'],
            ['Format depth', 'Every format rewards different things. Coaching that is generic across formats tends to be shallow in all of them, which is why we coach one format deeply.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-5">
              <span className="font-display text-3xl font-semibold leading-none text-signal-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-navy-900">{title}</h3>
                <p className="mt-1 leading-relaxed text-navy-700">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          One format, coached deeply
        </h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          We coach{' '}
          <Link
            href="/what-is-world-schools-debate"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            World Schools Debate
          </Link>
          , the international 3-on-3 format debated at the World Schools
          Debating Championships and at NSDA Nationals. It is the format we
          would pick for a young debater even if we did not teach it: judging
          weighs persuasive delivery equally with content, half the motions are
          impromptu, and the team structure means every student speaks every
          round. Students coming from Public Forum or Lincoln-Douglas{' '}
          <Link
            href="/world-schools-vs-public-forum"
            className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
          >
            convert quickly
          </Link>
          .
        </p>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          Three ways to work with us
        </h2>
        <div className="mt-6 space-y-4">
          {[
            {
              href: '/programs',
              title: 'Group classes and teams',
              body: 'A beginner Foundation class, a year-round Competition Team, and summer bootcamps. Small groups, weekly live sessions, judged practice debates.',
              label: 'Compare the programs',
            },
            {
              href: '/programs/private-coaching',
              title: 'Private 1-on-1 coaching',
              body: 'A dedicated coach, flexible scheduling, and an agenda built around one student: speech redos, motion prep, tournament debriefs.',
              label: 'See 1-on-1 options',
            },
            {
              href: '/contact',
              title: 'School teams',
              body: 'Weekly squad practices, motion prep support, and tournament-week coaching for schools building a World Schools program.',
              label: 'Ask about team coaching',
            },
          ].map((card) => (
            <div key={card.href} className="rounded-sm border border-navy-100 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-navy-900">{card.title}</h3>
              <p className="mt-2 leading-relaxed text-navy-700">{card.body}</p>
              <Link
                href={card.href}
                className="mt-3 inline-block font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
              >
                {card.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-navy-100 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProgramsCoachStrip />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">
          Common questions
        </h2>
        <div className="mt-5 space-y-3">
          {pageFaqs.map((faq) => (
            <details key={faq.question} className="group rounded-sm border border-navy-100 bg-white p-5">
              <summary className="cursor-pointer list-none font-semibold text-navy-900">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Not sure which path fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            A short call with our team ends with one named program and the
            reason it is that one. Free, and there is no pressure to decide on
            the call.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
