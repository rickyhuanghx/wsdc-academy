import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';
import { ColumnChart, GroupedColumnChart } from '@/components/DebateCharts';

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

const tocItems = [
  ['round', 'Anatomy of a round'],
  ['motions', 'Prepared vs impromptu'],
  ['judging', 'How judging works'],
  ['transfer', 'Why the skills transfer'],
  ['ai', 'In the age of AI'],
  ['us', 'In the United States'],
  ['faq', 'FAQ'],
];

const glanceStats = [
  ['3 v 3', 'Teams of 3–5 students; exactly three speak each round'],
  ['8 min', 'Each substantive speech, plus 4-minute reply speeches'],
  ['1 hour', 'Impromptu prep: no internet, no coaches, no AI'],
  ['40/40/20', 'Style, content, and strategy: the judging split'],
];

const judging = [
  ['Style', '40%', 'Delivery, persuasion, and engagement: how you speak'],
  ['Content', '40%', 'Arguments, analysis, and evidence: what you say'],
  ['Strategy', '20%', 'Structure, timing, points of information, and issue choice'],
];

const pageFaqs = [
  {
    question: 'What is World Schools debate, in one sentence?',
    answer:
      'It is the international 3v3 high school debate format used at the World Schools Debating Championships and, in the United States, at the NSDA National Tournament: two teams of three argue a "This House" motion in eight-minute speeches, judged 40% on style, 40% on content, and 20% on strategy.',
  },
  {
    question: 'How is World Schools different from Policy and Public Forum?',
    answer:
      'World Schools uses three-person teams, longer eight-minute speeches, and live points of information instead of crossfire, and it has no evidence cards or "spreading" (very fast delivery). Half the motions are impromptu, prepared in one hour with no internet or coaches. It rewards clear reasoning and persuasion for a general audience rather than research volume or speed.',
  },
  {
    question: 'How is World Schools debate judged?',
    answer:
      'On three published criteria: Style (40%), Content (40%), and Strategy (20%). Constructive speeches are scored on a 60 to 80 scale, with 70 as average; reply speeches are scored 30 to 40.',
  },
  {
    question: 'What are prepared and impromptu motions?',
    answer:
      'Prepared motions are released in advance, with full research and coaching allowed. Impromptu motions are released one hour before the round, and teams prepare alone with only printed reference material, no internet and no coaches. At the World Championships the eight preliminary rounds split evenly, four prepared and four impromptu.',
  },
  {
    question: 'Is World Schools debate good preparation for college and careers?',
    answer:
      'Competitive debate has strong long-run research behind it, and World Schools in particular trains general-purpose skills: clear reasoning, persuasion, general knowledge, and thinking on your feet. Those transfer to college interviews, seminars, and the workplace more readily than the jargon and evidence files that win some other formats.',
  },
  {
    question: 'Do you have to make a national team to compete in World Schools?',
    answer:
      'No. Most World Schools debating in the United States happens through school squads, district teams at the NSDA National Tournament, state divisions, and the Tournament of Champions circuit. USA Debate is the national team, but it is one pathway at the top of the ladder, not the way in.',
  },
];

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
      <FAQJsonLd faqs={pageFaqs} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-navy-950 text-white">
        <Image
          src="/images/finals-day-team.jpg"
          alt="A World Schools debate team together on finals day at a championship"
          fill
          sizes="100vw"
          className="object-cover object-[center_28%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-navy-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2 text-signal-500">/</span>
            <span className="text-navy-200">The Format</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-signal-400">
              The Format · 2026 Guide
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              What is World Schools Debate?
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-navy-100">
              Two teams of three argue a motion phrased as &ldquo;This
              House&hellip;&rdquo; in eight-minute speeches, take live
              interruptions, and close with reply speeches. For half the topics
              they get one hour to prepare, with no internet, no coaches, and
              nothing but a dictionary and an almanac. The format rewards the
              student who can think clearly on their feet and win over a room, not
              the one who can read the most evidence the fastest.
            </p>
            <ArticleByline date="2026-06-11" variant="onDark" />
          </div>
        </div>
      </section>

      {/* ── At a glance ──────────────────────────────────────── */}
      <section className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-px overflow-hidden rounded-sm border border-navy-100 bg-navy-100 sm:grid-cols-2 lg:grid-cols-4">
            {glanceStats.map(([stat, label]) => (
              <div key={label} className="bg-white p-6">
                <p className="stat font-display text-3xl font-semibold text-navy-900">{stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── In this guide (TOC) ──────────────────────────────── */}
      <nav aria-label="In this guide" className="sticky top-16 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <span className="hidden shrink-0 py-1.5 pr-1 text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 sm:block">
            In this guide
          </span>
          {tocItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-sm border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-navy-900"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Intro / credentials ──────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-navy-700">
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
            (WSDC), where well over 60 national teams compete each year. In the
            United States it is an official NSDA event with its own invitational at
            the National Tournament, growing state divisions, and a national team:{' '}
            <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
              USA Debate
            </Link>
            , which won the world championship in 2023.
          </p>
        </div>
      </section>

      {/* ── Anatomy of a round ───────────────────────────────── */}
      <section id="round" className="scroll-mt-32 border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">The breakdown</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            Anatomy of a round
          </h2>
          <p className="mt-5 leading-relaxed text-navy-700">
            Two teams, Proposition and Opposition, debate a single motion. Teams
            carry rosters of three to five students, but exactly{' '}
            <strong>three speak in any given round</strong>. Every debate runs to
            the same eight-speech shape.
          </p>
          <div className="mt-8 overflow-hidden rounded-sm border border-navy-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Speech</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Job</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                <tr><td className="px-4 py-3 font-semibold text-navy-900">Prop 1 / Opp 1</td><td className="px-4 py-3">8 min each</td><td className="px-4 py-3">Define the motion, set up the team case</td></tr>
                <tr><td className="px-4 py-3 font-semibold text-navy-900">Prop 2 / Opp 2</td><td className="px-4 py-3">8 min each</td><td className="px-4 py-3">Rebut, then extend the case with new substantive material</td></tr>
                <tr><td className="px-4 py-3 font-semibold text-navy-900">Prop 3 / Opp 3</td><td className="px-4 py-3">8 min each</td><td className="px-4 py-3">Deep clash: compare the cases and win the key issues</td></tr>
                <tr><td className="px-4 py-3 font-semibold text-navy-900">Opp Reply, then Prop Reply</td><td className="px-4 py-3">4 min each</td><td className="px-4 py-3">A &ldquo;biased adjudication&rdquo; of the round: why your side won. Opposition replies first; Proposition closes the debate.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            The reply speech is given by the first or second speaker, never the
            third, and no new arguments are allowed in it.
          </p>

          <div className="mt-8 border-l-4 border-signal-500 bg-white px-6 py-5">
            <h3 className="font-display text-lg font-semibold text-navy-900">Points of information</h3>
            <p className="mt-2 leading-relaxed text-navy-700">
              During substantive speeches, opponents may stand to offer{' '}
              <strong>points of information (POIs)</strong>: short interjections the
              speaker can accept or decline. Handling POIs well, and offering sharp
              ones, is a core part of the Strategy score. Reply speeches are
              protected: no POIs allowed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Prepared vs impromptu ────────────────────────────── */}
      <section id="motions" className="scroll-mt-32 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">What makes it different</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
              Prepared vs. impromptu motions
            </h2>
            <p className="mt-5 leading-relaxed text-navy-700">
              The thing that sets World Schools apart from every American format is
              the motion split. Half of a championship is researched to the hilt.
              The other half is a test of what you already carry in your head.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-navy-200 bg-white p-7">
              <p className="font-display text-xl font-semibold text-navy-900">Prepared</p>
              <p className="mt-3 leading-relaxed text-navy-600">
                Published in advance. Full research, casework, and coaching are
                allowed, so teams arrive with polished material and rehearsed
                clash. This is where preparation and depth win.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-navy-400">
                Released weeks ahead
              </p>
            </div>
            <div className="rounded-sm border border-navy-200 bg-navy-900 p-7 text-white">
              <p className="font-display text-xl font-semibold">Impromptu</p>
              <p className="mt-3 leading-relaxed text-navy-100">
                Released one hour before the round. Prep is limited to the three
                speakers and printed reference material, with no internet, no
                coaches, and no AI. This is where genuine thinking shows.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-signal-300">
                One hour, on your own
              </p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl leading-relaxed text-navy-700">
            At the World Championships the eight preliminary rounds split evenly,
            four prepared and four impromptu. That is why World Schools debaters
            become genuinely good thinkers rather than evidence-readers. For half
            the season, your preparation is your general knowledge, your
            frameworks, and your team.
          </p>

          <figure className="mx-auto mt-10 max-w-3xl">
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
              <Image
                src="/images/team-prep-session.jpg"
                alt="A debate team working through impromptu case preparation together before a round"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-navy-400">
              Prep is a team sport: your case is only as good as your three-person huddle.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Judging ──────────────────────────────────────────── */}
      <section id="judging" className="scroll-mt-32 border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">The scoresheet</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            How judging works: 40/40/20
          </h2>
          <p className="mt-5 leading-relaxed text-navy-700">
            World Schools is judged on three explicit, published criteria. Nothing
            is hidden, and every drill can be pointed straight at the scoresheet.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {judging.map(([name, pct, desc]) => (
              <div key={name} className="rounded-sm border border-navy-200 bg-white p-6 text-center">
                <p className="stat font-display text-4xl font-semibold text-signal-500">{pct}</p>
                <p className="mt-2 font-display text-lg font-semibold text-navy-900">{name}</p>
                <p className="mt-2 text-xs leading-relaxed text-navy-600">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 leading-relaxed text-navy-700">
            Constructive speeches are scored on a 60&ndash;80 scale (70 is average);
            reply speeches on 30&ndash;40. The explicit weight on style is a sharp
            contrast with evidence-heavy American formats. In World Schools, being
            persuasive is literally 40% of your score. For a full breakdown of what
            judges reward in each category, see{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              how World Schools judging works
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Why the skills transfer ──────────────────────────── */}
      <section id="transfer" className="scroll-mt-32 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">Why it matters</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            The skills go further than the trophy
          </h2>
          <p className="mt-5 leading-relaxed text-navy-700">
            Competitive debate has some of the strongest long-run evidence of any
            school activity. In a study of the Boston Public Schools debate
            program, students on debate teams pulled clear of their peers on the
            outcomes that actually shape a life after high school.
          </p>

          <figure className="mt-8">
            <div className="rounded-sm border border-navy-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">The outcome gap</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
                Debate-team students pulled clear of their peers
              </h3>
              <p className="mt-1 text-sm text-navy-400">
                Boston Public Schools debate program: students on a debate team vs comparable peers
              </p>
              <div className="mt-6">
                <GroupedColumnChart
                  data={[
                    { label: 'Graduated in 5 years', a: 80, b: 68 },
                    { label: 'College within 2 years', a: 53, b: 41 },
                  ]}
                  max={100}
                  seriesA="On a debate team"
                  seriesB="Comparable peers"
                  ariaLabel="Boston debate program outcomes: high school graduation 80 percent for debaters versus 68 percent for peers; college enrollment 53 percent versus 41 percent for peers."
                />
              </div>
              <p className="mt-4 border-t border-navy-100 pt-3 text-xs text-navy-400">
                Debate-team students also gained about two-thirds of a school year of extra reading growth.
              </p>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-navy-400">
              Figures from a study of the Boston Public Schools debate program (policy
              debate), reported by{' '}
              <a
                href="https://www.brookings.edu/articles/how-competitive-debate-can-improve-public-education/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-navy-300 underline-offset-2 hover:text-navy-600"
              >
                Brookings
              </a>
              . The research followed policy debaters, but the effect points at
              something every format shares.
            </figcaption>
          </figure>

          <p className="mt-8 leading-relaxed text-navy-700">
            World Schools is built to reward the parts of that training which travel
            the furthest. There are no evidence cards to call for, no technical
            jargon, and no &ldquo;spreading&rdquo; (the wall of fast speech that
            wins some American formats). Judges reward clear logic, principled
            analysis, and awareness of the wider world, delivered so that a general
            audience can follow every step. Those are the same skills a student uses
            in a seminar, a college interview, a courtroom, or a pitch, which is why
            we think World Schools carries over to real life more readily than the
            evidence-heavy US formats.{' '}
            <Link href="/world-schools-vs-public-forum" className="font-semibold text-signal-500 hover:text-signal-600">
              See how it compares with Public Forum
            </Link>
            , or read whether{' '}
            <Link href="/blog/does-debate-help-college-admissions" className="font-semibold text-signal-500 hover:text-signal-600">
              debate actually helps with college admissions
            </Link>
            .
          </p>

          <figure className="mt-10">
            <div className="rounded-sm border border-navy-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">Where the best debaters land</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-navy-900">
                Elite universities at many times the normal rate
              </h3>
              <p className="mt-1 text-sm text-navy-400">
                Share attending an Ivy, US Top-30, or Oxbridge school, by cohort
              </p>
              <div className="mt-6">
                <ColumnChart
                  data={[
                    { label: 'General applicant', value: 5, sub: 'Ivy acceptance', muted: true },
                    { label: 'WSDC Top 50', value: 41, sub: 'world field' },
                    { label: 'Team USA', value: 71, sub: 'complete cohort', highlight: true },
                  ]}
                  max={80}
                  ariaLabel="Elite-university rate by cohort: general applicant about 5 percent, world top-50 speakers 41 percent, Team USA alumni 71 percent."
                />
              </div>
              <p className="mt-4 border-t border-navy-100 pt-3 text-xs leading-relaxed text-navy-400">
                General applicant is an Ivy acceptance rate; the debater figures are the
                share attending an elite university.{' '}
                <Link href="/blog/does-debate-help-college-admissions" className="font-semibold text-signal-500 hover:text-signal-600">
                  See the full analysis and method
                </Link>
                .
              </p>
            </div>
          </figure>

          <figure className="mt-10">
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
              <Image
                src="/images/student-speech-competition.jpg"
                alt="A student delivering a persuasive speech to a full competition room"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-navy-400">
              Forty percent of a World Schools score is delivery: persuading a live room, not reading files.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── In the age of AI ─────────────────────────────────── */}
      <section id="ai" className="scroll-mt-32 border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">Future-proof by accident</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
                World Schools in the age of AI
              </h2>
              <p className="mt-5 leading-relaxed text-navy-700">
                A language model can now draft a case, find the counterarguments,
                and list the examples in seconds. That changes what is scarce. The
                valuable skill is no longer gathering the material; it is judging
                it, and then persuading a real person of it while the clock runs and
                an opponent interrupts.
              </p>
              <p className="mt-4 leading-relaxed text-navy-700">
                World Schools trains for exactly that. Delivery and persuasion are
                40% of the score, and half of all rounds are impromptu: one hour of
                preparation with no internet, no coaches, and no AI. An impromptu
                round is one of the few academic settings left where a teenager has
                to reason with nothing but their own head and their two teammates.
              </p>
            </div>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src="/images/impromptu-prep.jpg"
                  alt="Debaters preparing an impromptu case by hand, without laptops or internet"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-navy-400">
                Impromptu prep: one hour, no internet, no AI. Three students and what they actually know.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── AI evidence band ─────────────────────────────────── */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-2xl text-center font-display text-xl font-medium italic leading-relaxed sm:text-2xl">
            As information gets cheaper, the human ability to think clearly and
            speak convincingly gets dearer. Employers are already pricing it in.
          </p>
          <dl className="mx-auto mt-12 grid max-w-4xl gap-x-6 gap-y-10 text-center sm:grid-cols-3">
            {[
              ['#1', 'Analytical thinking, the top core skill in the WEF Future of Jobs 2025 report'],
              ['80%', 'say soft skills matter more than ever, with communication the most valued'],
              ['72%', 'of frequent AI users expect spoken communication to grow in importance'],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="stat font-display text-5xl font-semibold text-signal-400">{stat}</dt>
                <dd className="mx-auto mt-3 max-w-[220px] text-sm leading-snug text-navy-200">{label}</dd>
              </div>
            ))}
          </dl>
          <p className="mx-auto mt-12 max-w-2xl text-center leading-relaxed text-navy-100">
            World Schools was designed decades before ChatGPT, and it happens to
            train the skills a world full of AI rewards most. Sources:{' '}
            <a
              href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline decoration-signal-400 underline-offset-4 hover:decoration-white"
            >
              WEF Future of Jobs 2025
            </a>{' '}
            and{' '}
            <a
              href="https://www.forbes.com/sites/carolinecastrillon/2025/01/19/5-soft-skills-critical-in-the-age-of-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline decoration-signal-400 underline-offset-4 hover:decoration-white"
            >
              Forbes on soft skills in the age of AI
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── In the United States ─────────────────────────────── */}
      <section id="us" className="scroll-mt-32 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">The pathway</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            World Schools in the United States
          </h2>
          <div className="mt-8 space-y-8">
            <div className="border-t border-navy-200 pt-6">
              <h3 className="font-display text-xl font-semibold text-navy-900">NSDA Nationals</h3>
              <p className="mt-2 leading-relaxed text-navy-700">
                The USA World Schools Debate Invitational runs at the National
                Tournament each June; every NSDA district may enter up to two teams
                of 3&ndash;5 students. International teams compete too.
              </p>
            </div>
            <div className="border-t border-navy-200 pt-6">
              <h3 className="font-display text-xl font-semibold text-navy-900">State divisions and the circuit</h3>
              <p className="mt-2 leading-relaxed text-navy-700">
                Texas (TFA) runs a full points-qualified World Schools division
                through TFA State; Florida&apos;s FFL and Indiana&apos;s ISSDA
                contest it at state-level tournaments, and Washington has run it as
                a WIAA trial event. The Tournament of Champions runs a World Schools
                division entered through a season-long bid system spanning roughly
                thirty tournaments.{' '}
                <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
                  See the full tournament map
                </Link>
                .
              </p>
            </div>
            <div className="border-t border-navy-200 pt-6">
              <h3 className="font-display text-xl font-semibold text-navy-900">USA Debate</h3>
              <p className="mt-2 leading-relaxed text-navy-700">
                The NSDA selects a national team each year that represents the
                United States at WSDC.{' '}
                <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
                  Here is how students make the team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-32 border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-navy-200 border-y border-navy-200">
            {pageFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none font-semibold text-navy-900">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-navy-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Want to learn the format properly?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-navy-200">
            Our coaches have competed, coached, and adjudicated World Schools at the
            international level. Book a consultation and we will point you to the
            right starting program.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/consultation"
              className="rounded-sm bg-signal-500 px-8 py-3.5 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Book a Consultation
            </Link>
            <Link
              href="/programs"
              className="rounded-sm border border-navy-500 px-8 py-3.5 text-center font-semibold text-white transition hover:bg-navy-800 active:scale-[0.98]"
            >
              See Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
