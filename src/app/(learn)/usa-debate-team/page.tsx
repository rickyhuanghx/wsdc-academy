import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';

export const metadata: Metadata = {
  title: 'How to Make the USA Debate Team: Application, Eligibility & Timeline (2026)',
  description:
    'A complete guide to USA Debate, the national World Schools team: eligibility rules, the application timeline, the motion-response videos, the Development Team, and how to prepare a winning application.',
  alternates: { canonical: '/usa-debate-team' },
  openGraph: {
    title: 'How to Make the USA Debate Team (2026 Guide)',
    description:
      'Eligibility, application timeline, motion-response videos, and how to prepare for the USA Debate national team selection.',
    url: '/usa-debate-team',
    type: 'article',
  },
};

const pageFaqs = [
  {
    question: 'Who is eligible to apply for USA Debate?',
    answer:
      'Applicants must be US citizens (dual citizenship is fine) or permanent residents of 2+ years, currently living in the US and attending a secondary diploma-granting institution, at least 14 years old and not yet 20 by the July of the championship year (per WSDC rules), and active NSDA student members at a member school.',
  },
  {
    question: 'When does the USA Debate application open?',
    answer:
      'Applications open in early April and close in late June each year, with results over the summer and the team announced in late August. The 2026–27 window ran April 1 to June 25, 2026.',
  },
  {
    question: 'What does the USA Debate application involve?',
    answer:
      'An online application form, coach and administrator recommendation signatures, and video recordings responding to three provided motions. Selection has historically run through multiple stages with additional video tasks.',
  },
  {
    question: 'What is the USA Debate Development Team?',
    answer:
      'Strong applicants who are not selected for the National Team may be offered a place on the Development Team, which trains members and promotes the World Schools format in their communities. It also positions members well for future National Team selection.',
  },
  {
    question: 'Do I need World Schools experience to apply?',
    answer:
      'No format résumé is formally required, but successful applicants almost always have serious competitive experience and genuine fluency in the World Schools format. The application videos are motion responses judged on World Schools standards.',
  },
];

export default function UsaDebateTeamPage() {
  return (
    <>
      <ArticleJsonLd
        title="How to Make the USA Debate Team: Application, Eligibility & Timeline (2026)"
        description="A complete guide to USA Debate national team selection: eligibility, timeline, application videos, and preparation."
        url="/usa-debate-team"
        datePublished="2026-06-11"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'How to Make the USA Debate Team', href: '/usa-debate-team' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">The Pathway</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            How to Make the USA Debate Team
          </h1>
          <ArticleByline date="2026-06-11" />
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            USA Debate is the national team program run by the National Speech &amp;
            Debate Association. It is the sole US representative at the World
            Schools Debating Championships. In 2023, the team{' '}
            <strong>won the world title</strong>. This guide covers exactly how
            selection works, who is eligible, and how to prepare an application
            that stands out.
          </p>
          <figure className="mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
              <Image
                src="/images/tournament-team-harvard.jpg"
                alt="A squad of student debaters in front of the John Harvard statue on tournament weekend"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-2 text-xs text-navy-400">
              Our coaches&apos; students at Harvard, the campus that hosts USA
              Debate&apos;s official summer training.
            </figcaption>
          </figure>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">What USA Debate is</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Each year the NSDA selects a small national roster from its membership
            of roughly 140,000 students. The <strong>National Team</strong>{' '}
            represents the United States at domestic and international events,
            including WSDC, where the{' '}
            <a
              href="https://www.wsdcdebating.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              official championship
            </a>{' '}
            draws well over 60 national teams each year. The title moves around
            the world: the US won in 2023, Scotland in 2024, and India in 2025.
            Applicants who impress but aren&apos;t selected may be offered the{' '}
            <strong>Development Team</strong>, which trains members and feeds
            future National Team classes.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Team members commit to weekly online practices (currently 1–2 hours most
            Mondays), at least one event per month, and ongoing research and case
            construction. Several partner schools provide training opportunities,
            including The Blake School, Greenhill, Harvard-Westlake, Taipei
            American School, and Holy Cross.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Eligibility</h2>
          <ul className="mt-5 space-y-3 text-navy-700">
            {[
              'US citizen (dual citizenship OK) or a permanent resident for 2+ years',
              'Currently living in the US and attending a secondary diploma-granting institution',
              'At least 14 years old and not yet 20 by July of the championship year (WSDC rule)',
              'A current, active NSDA student member at a member school',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 font-bold text-signal-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">The application timeline</h2>
          <div className="mt-6 space-y-0">
            {[
              ['Early April', 'Application opens', 'The 2026–27 window opened April 1 at noon CT. Start preparing well before this.'],
              ['April – June', 'Build your application', 'Online form, coach and administrator recommendation signatures, and video recordings responding to three provided motions.'],
              ['Late June', 'Deadline', 'The 2026–27 application closed June 25 at 11:59 p.m. CT. Late applications are not considered.'],
              ['Summer', 'Selection stages', 'Selection has historically run through multiple stages, including additional video response tasks for shortlisted applicants.'],
              ['Late August', 'Team announced', 'National Team and Development Team offers go out before the season begins.'],
            ].map(([when, title, detail], i, arr) => (
              <div key={title as string} className="relative flex gap-5 pb-8">
                {i < arr.length - 1 && (
                  <span className="absolute left-[15px] top-8 h-full w-0.5 bg-navy-100" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-signal-500">{when}</p>
                  <h3 className="mt-0.5 font-bold text-navy-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-600">{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="rounded-lg bg-navy-50 p-4 text-sm leading-relaxed text-navy-700">
            <strong>Always verify current-year dates</strong> on the NSDA&apos;s
            official page:{' '}
            <a
              href="https://www.speechanddebate.org/usa-debate/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              speechanddebate.org/usa-debate
            </a>
            . The application window and requirements are set annually by the NSDA.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            The part that decides it: your motion videos
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            The heart of the application is a set of{' '}
            <strong>video recordings responding to three provided motions</strong>.
            This is where most applicants are won or lost. The selectors are watching
            for genuine World Schools fluency: principled argumentation, structured
            analysis, persuasive style, and strategic judgment: the same 40/40/20
            standard used in the format itself.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Common mistakes we see: treating the video like a PF speech (too much
            evidence-reading, not enough principle), ignoring style entirely, and
            failing to engage the strongest version of the other side. A motion
            response should sound like the best first-speaker speech you&apos;ve
            ever given.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How to prepare, starting now</h2>
          <ul className="mt-5 space-y-4 text-navy-700">
            <li className="flex gap-3">
              <span className="mt-1 font-bold text-signal-500">1.</span>
              <span>
                <strong>Compete in World Schools all season.</strong> District
                qualifiers, state divisions, and circuit tournaments build exactly
                the fluency the videos test.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 font-bold text-signal-500">2.</span>
              <span>
                <strong>Train impromptu systematically.</strong> One-hour prep
                cycles, every week. Selection rewards debaters who can build a case
                from first principles.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 font-bold text-signal-500">3.</span>
              <span>
                <strong>Get international-standard feedback.</strong> Most American
                feedback loops are calibrated to PF and LD. Train against the
                standard the selectors actually use.
              </span>
            </li>
          </ul>
          <p className="mt-6 leading-relaxed text-navy-700">
            Our{' '}
            <Link href="/programs/private-coaching" className="font-semibold text-signal-500 hover:text-signal-600">
              1-on-1 Coaching
            </Link>{' '}
            includes dedicated support for the application itself: motion-response
            video preparation, application review, and mock selection tasks, with
            coaches who have national-team experience. For the deeper background, read{' '}
            <Link href="/blog/usa-debate-team-application-guide" className="font-semibold text-signal-500 hover:text-signal-600">
              the year-before training plan
            </Link>
            ,{' '}
            <Link href="/blog/usa-debate-team-skills" className="font-semibold text-signal-500 hover:text-signal-600">
              what selectors actually reward
            </Link>
            , and{' '}
            <Link href="/blog/world-schools-debate-pathway-us" className="font-semibold text-signal-500 hover:text-signal-600">
              the full US World Schools pathway
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {pageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-navy-100 bg-white p-5">
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
        </section>

        <section className="mt-14 rounded-xl bg-navy-900 p-8 text-white">
          <h2 className="text-2xl font-bold">Targeting the team?</h2>
          <p className="mt-3 leading-relaxed text-navy-100">
            Train with coaches who have competed for and coached national teams.
            The application window opens every April, and the strongest applicants
            start preparing months earlier.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/programs/national-team-sprint"
              className="rounded-md bg-signal-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              See the National Team Sprint
            </Link>
            <Link
              href="/consultation"
              className="rounded-md border border-navy-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-navy-800 active:scale-[0.98]"
            >
              Book a Consultation
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
