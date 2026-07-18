import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'What is World Schools Debate? Format, Rules & Judging (2026 Guide)',
  description:
    'World Schools Debate explained: the 3v3 format, 8-minute speeches, reply speeches, prepared vs impromptu motions, POIs, and the 40/40/20 judging criteria, plus how the format works in US competition.',
  alternates: { canonical: '/what-is-world-schools-debate' },
  openGraph: {
    title: 'What is World Schools Debate? The Complete 2026 Guide',
    description:
      'The 3v3 format, speech structure, prepared vs impromptu motions, POIs, and 40/40/20 judging, plus the American competitive pathway.',
    url: '/what-is-world-schools-debate',
    type: 'article',
  },
};

export default function WhatIsWorldSchoolsPage() {
  return (
    <>
      <ArticleJsonLd
        title="What is World Schools Debate? Format, Rules & Judging (2026 Guide)"
        description="World Schools Debate explained: format, speech structure, motions, POIs, and judging criteria."
        url="/what-is-world-schools-debate"
        datePublished="2026-06-11"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'What is World Schools Debate?', href: '/what-is-world-schools-debate' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">The Format</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            What is World Schools Debate?
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            World Schools Debate is the international standard for high school
            debate: the format of the{' '}
            <a
              href="https://www.wsdcdebating.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              World Schools Debating Championships
            </a>{' '}
            (WSDC), where well over 60 national teams compete each year. In the United States
            it is an official NSDA event with its own invitational at the National
            Tournament, growing state divisions, and a national team:{' '}
            <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
              USA Debate
            </Link>
            , which won the world championship in 2023.
          </p>
        </header>

        <section className="prose-section mt-12">
          <h2 className="text-2xl font-bold text-navy-900">The structure of a round</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Two teams, Proposition and Opposition, debate a motion phrased as
            &ldquo;This House&hellip;&rdquo;. Teams carry rosters of three to five
            students, but exactly <strong>three speak in any given round</strong>.
            Each debate has eight speeches:
          </p>
          <div className="mt-6 overflow-hidden rounded-lg border border-navy-100">
            <table className="w-full text-sm">
              <thead className="bg-navy-900 text-left text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Speech</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                <tr><td className="px-4 py-3">Prop 1 / Opp 1</td><td className="px-4 py-3">8 min each</td><td className="px-4 py-3">Define the motion, set up the team case</td></tr>
                <tr><td className="px-4 py-3">Prop 2 / Opp 2</td><td className="px-4 py-3">8 min each</td><td className="px-4 py-3">Rebut, then extend the case with new substantive material</td></tr>
                <tr><td className="px-4 py-3">Prop 3 / Opp 3</td><td className="px-4 py-3">8 min each</td><td className="px-4 py-3">Deep clash: compare the cases and win the key issues</td></tr>
                <tr><td className="px-4 py-3">Opp Reply, then Prop Reply</td><td className="px-4 py-3">4 min each</td><td className="px-4 py-3">A &ldquo;biased adjudication&rdquo; of the round: why your side won. Opposition replies first; Proposition closes the debate.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            The reply speech is given by the first or second speaker, never the
            third, and no new arguments are allowed in it.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Prepared vs. impromptu motions</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            What makes World Schools unique among American formats is the motion
            split. Some motions are <strong>prepared</strong>: published in advance,
            with full research and coaching allowed. Others are{' '}
            <strong>impromptu</strong>, released <strong>one hour</strong> before the
            round. Prep for those is limited to the three speakers and printed
            reference materials, with no internet and no coaches. At the World
            Championships itself, the eight preliminary rounds split evenly: four
            prepared, four impromptu.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            This is why World Schools debaters become genuinely good thinkers rather
            than evidence-readers. For half the season, your preparation is your
            general knowledge, your frameworks, and your team.
          </p>
          <figure className="mt-8">
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
              Prep is a team sport: your case is only as good as your three-person huddle.
            </figcaption>
          </figure>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Points of information</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            During substantive speeches, opponents may rise to offer{' '}
            <strong>points of information (POIs)</strong>: short interjections the
            speaker can accept or decline. Handling POIs well (and offering sharp
            ones) is a core part of the Strategy score. Reply speeches are protected:
            no POIs allowed.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How judging works: 40/40/20</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            World Schools is judged on three explicit criteria:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['Style', '40%', 'Delivery, persuasion, and engagement: how you speak'],
              ['Content', '40%', 'Arguments, analysis, and evidence: what you say'],
              ['Strategy', '20%', 'Structure, time allocation, POIs, and issue choice'],
            ].map(([name, pct, desc]) => (
              <div key={name} className="rounded-lg border border-navy-100 bg-white p-5 text-center">
                <p className="text-3xl font-bold text-signal-500">{pct}</p>
                <p className="mt-1 font-bold text-navy-900">{name}</p>
                <p className="mt-2 text-xs leading-relaxed text-navy-600">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-navy-700">
            Constructive speeches are scored on a 60–80 scale (70 is average); reply
            speeches on 30–40. The explicit weight on style is a sharp contrast with
            evidence-heavy American formats. In World Schools, being persuasive is
            literally 40% of your score. For a full breakdown of what judges reward
            in each category, see{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              how World Schools judging works
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">World Schools in the United States</h2>
          <ul className="mt-5 space-y-4 text-navy-700">
            <li className="flex gap-3">
              <span className="mt-1 font-bold text-signal-500">•</span>
              <span>
                <strong>NSDA Nationals.</strong> The USA World Schools Debate
                Invitational runs at the National Tournament each June; every NSDA
                district may enter up to two teams of 3–5 students. International
                teams compete too.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 font-bold text-signal-500">•</span>
              <span>
                <strong>State divisions and the circuit.</strong> Texas (TFA) runs a
                full points-qualified World Schools division through TFA State;
                Florida&apos;s FFL and Indiana&apos;s ISSDA contest it at state-level
                tournaments, and Washington has run it as a WIAA trial event. The
                Tournament of Champions runs a World Schools division entered
                through a season-long bid system spanning roughly thirty
                tournaments.{' '}
                <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
                  See the full tournament map
                </Link>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 font-bold text-signal-500">•</span>
              <span>
                <strong>USA Debate.</strong> The NSDA selects a national team each
                year that represents the United States at WSDC.{' '}
                <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
                  Here&apos;s how students make the team →
                </Link>
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-xl bg-navy-900 p-8 text-white">
          <h2 className="text-2xl font-bold">Want to learn the format properly?</h2>
          <p className="mt-3 leading-relaxed text-navy-100">
            Our coaches have competed, coached, and adjudicated World Schools at the
            international level. Book a consultation and we&apos;ll point you to the
            right starting program.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/consultation"
              className="rounded-md bg-signal-500 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-signal-600"
            >
              Book a Consultation
            </Link>
            <Link
              href="/programs"
              className="rounded-md border border-navy-500 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-navy-800"
            >
              See Programs
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
