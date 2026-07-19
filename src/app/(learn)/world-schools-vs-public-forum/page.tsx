import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';

export const metadata: Metadata = {
  title: 'World Schools vs Public Forum Debate: Every Difference Explained (2026)',
  description:
    'World Schools Debate vs Public Forum compared: team size, speech structure, motions vs resolutions, evidence culture, judging, and what PF debaters need to adjust when converting to World Schools.',
  alternates: { canonical: '/world-schools-vs-public-forum' },
  openGraph: {
    title: 'World Schools vs Public Forum: Every Difference Explained',
    description:
      'Format, speeches, evidence culture, and judging compared, plus what actually transfers when a PF debater converts.',
    url: '/world-schools-vs-public-forum',
    type: 'article',
  },
};

const pageFaqs = [
  {
    question: 'Is World Schools harder than Public Forum?',
    answer:
      'It is differently hard. PF rewards research depth and evidence exchange on one topic at a time; World Schools adds longer speeches, live points of information, explicitly scored delivery, and impromptu motions prepped in one hour without internet or coaches. Most converts find the first month humbling and the skills permanently transferable.',
  },
  {
    question: 'Can a student do Public Forum and World Schools in the same season?',
    answer:
      'Yes, and many strong competitors do. World Schools in the US mostly runs through school squads, district teams, and dedicated tournament divisions, so it typically stacks alongside a PF partnership rather than replacing it. The training also compounds: WS delivery work raises PF speaker points, and PF research habits feed WS prepared motions.',
  },
  {
    question: 'How long does it take a PF debater to convert to World Schools?',
    answer:
      'The mechanics (speech structure, speaker roles, POIs) usually click within a few weeks of structured practice. Restyling delivery for a format that scores Style at 40% takes longer, which is why our conversion training starts with judged practice rounds and delivery feedback rather than more content theory.',
  },
];

export default function WsVsPfPage() {
  return (
    <>
      <ArticleJsonLd
        title="World Schools vs Public Forum Debate: Every Difference Explained (2026)"
        description="Team size, speech structure, motions, evidence culture, and judging compared, plus what PF debaters need to adjust."
        url="/world-schools-vs-public-forum"
        datePublished="2026-07-09"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'World Schools vs Public Forum', href: '/world-schools-vs-public-forum' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Format Comparison</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            World Schools vs Public Forum
          </h1>
          <ArticleByline date="2026-07-09" />
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Public Forum is America&apos;s most popular team debate format.{' '}
            <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              World Schools
            </Link>{' '}
            is the format the rest of the world plays, and the one growing fastest
            inside American leagues. Most students who join a World Schools squad
            arrive from PF, and most of what they know transfers. But the two
            formats reward genuinely different skills, and the differences are
            exactly where converts win or lose their first season.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">The formats side by side</h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-navy-100">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-navy-900 text-left text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold"></th>
                  <th className="px-4 py-3 font-semibold">World Schools</th>
                  <th className="px-4 py-3 font-semibold">Public Forum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                <tr>
                  <td className="px-4 py-3 font-semibold">Team</td>
                  <td className="px-4 py-3">Squad of 3–5; three speak per round</td>
                  <td className="px-4 py-3">Two partners</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Speeches</td>
                  <td className="px-4 py-3">8-minute substantives + 4-minute replies</td>
                  <td className="px-4 py-3">4-minute constructives and rebuttals, shorter summary and final focus</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Questioning</td>
                  <td className="px-4 py-3">Points of information: live interruptions during speeches</td>
                  <td className="px-4 py-3">Crossfire: dedicated question periods between speeches</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Topics</td>
                  <td className="px-4 py-3">Motions per round; roughly half impromptu with 1 hour of prep</td>
                  <td className="px-4 py-3">One resolution at a time, announced well in advance</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Evidence</td>
                  <td className="px-4 py-3">Reasoning-first; examples and analysis carry the round</td>
                  <td className="px-4 py-3">Card-based; cut evidence is exchanged and contested</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Judging</td>
                  <td className="px-4 py-3">Published criteria: Style 40 / Content 40 / Strategy 20</td>
                  <td className="px-4 py-3">Holistic ballot; criteria vary by judge</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">The five adjustments PF converts actually make</h2>

          <h3 className="mt-8 text-xl font-bold text-navy-900">1. Style becomes a scored category</h3>
          <p className="mt-3 leading-relaxed text-navy-700">
            In PF, delivery influences the judge; in World Schools, delivery{' '}
            <em>is 40% of the score</em>, equal to content. Speed-reading blocks,
            an asset on parts of the PF circuit, is a direct liability. The first
            thing converts retrain is pace, presence, and speaking to the judge
            rather than through them. (See{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              how 40/40/20 judging works
            </Link>
            .)
          </p>

          <h3 className="mt-8 text-xl font-bold text-navy-900">2. Eight minutes is a different sport</h3>
          <p className="mt-3 leading-relaxed text-navy-700">
            A PF constructive is four minutes; a World Schools substantive is
            eight, delivered while fielding interruptions. Filling that time with
            structured, developed argument, rather than repeating yourself at
            minute six, takes deliberate casebuilding technique and reps.
          </p>

          <h3 className="mt-8 text-xl font-bold text-navy-900">3. POIs replace crossfire</h3>
          <p className="mt-3 leading-relaxed text-navy-700">
            Crossfire is a fenced-off question period. Points of information are
            live: opponents rise mid-speech, and the speaker chooses when to take
            them. Managing POIs (offering sharp ones, taking one or two on your
            own terms, answering in one breath and returning to structure) is a
            skill PF never builds, and judges score it under Strategy.
          </p>

          <h3 className="mt-8 text-xl font-bold text-navy-900">4. Half the motions are impromptu</h3>
          <p className="mt-3 leading-relaxed text-navy-700">
            PF debaters live on one deeply researched resolution at a time. World
            Schools hands you roughly half your motions one hour before the round,
            with no internet and no coaches. Preparation shifts from cutting cards
            to building general knowledge, frameworks, and a one-hour team prep
            system that produces a full case under the clock.
          </p>

          <h3 className="mt-8 text-xl font-bold text-navy-900">5. Three speakers, one case</h3>
          <p className="mt-3 leading-relaxed text-navy-700">
            PF is a partnership; World Schools is a squad with specialized roles:
            first-speaker setup, second-speaker extension, third-speaker clash,
            and a reply speech that adjudicates the round from your side. Team
            coordination is scored, effectively, everywhere.
          </p>

          <figure className="mt-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/images/team-prep-session.jpg"
                alt="A debate team working through case preparation together before rounds"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs text-navy-400">
              The one-hour impromptu prep huddle: the skill PF never asks for.
            </figcaption>
          </figure>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">What transfers well</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Plenty. Research habits make prepared motions faster to case. Rebuttal
            instincts transfer directly into second- and third-speaker clash.
            Weighing (comparing impacts instead of listing them) is the PF
            skill that most impresses World Schools judges, because it scores
            under both Content and Strategy. PF converts usually arrive with the
            argumentative engine already built; what they need is the format&apos;s
            delivery standard, its roles, and its clock.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            That is a training problem, and a well-defined one. Our{' '}
            <Link href="/programs/foundations" className="font-semibold text-signal-500 hover:text-signal-600">
              Foundations
            </Link>{' '}
            program converts newer debaters, and experienced PF competitors
            typically place straight into the{' '}
            <Link href="/programs/competition-team" className="font-semibold text-signal-500 hover:text-signal-600">
              Competition Team
            </Link>{' '}
            after a placement conversation, with judged rounds, oral adjudications,
            and written feedback from the first week.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Common questions</h2>
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

        <div className="mt-16 rounded-xl bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Converting from PF?</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Book a consultation, tell us about your student, and get an honest
            recommendation on where to start from coaches who train converts every season.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-md bg-signal-500 px-7 py-3 font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
