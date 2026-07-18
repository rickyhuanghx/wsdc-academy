import Link from 'next/link';
import Image from 'next/image';
import { programs } from '@/data/programs';
import { coaches } from '@/data/coaches';
import { homepageFaqs } from '@/data/faqs';
import { FAQJsonLd } from '@/components/JsonLd';
import { ColumnChart, RankedBars, WaffleGrid } from '@/components/DebateCharts';
import { TabbedExplorer } from '@/components/TabbedExplorer';
import { TermSchedule } from '@/components/TermSchedule';

export default function HomePage() {
  return (
    <>
      <FAQJsonLd faqs={homepageFaqs} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[680px] bg-navy-950 text-white sm:min-h-[780px]">
        <Image
          src="/images/tournament-team-harvard.jpg"
          alt="A squad of student debaters gathered at the Harvard Invitational"
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 py-28 sm:min-h-[780px] sm:py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-navy-200">
              <span>New York City</span>
              <span className="text-signal-500">·</span>
              <span>California</span>
              <span className="text-signal-500">·</span>
              <span>London</span>
              <span className="text-signal-500">·</span>
              <span>Dubai</span>
              <span className="text-signal-500">·</span>
              <span>Singapore</span>
              <span className="text-signal-500">·</span>
              <span>Online Globally</span>
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              A World Class Training system for{' '}
              <em className="italic">World Schools</em> debate
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100">
              Elite online World Schools Debate (WSDC) coaching, designed and
              taught by former world debate champions. A structured curriculum,
              judged practice rounds, and written feedback after every session.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/consultation"
                className="rounded-sm bg-signal-500 px-7 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-signal-600"
              >
                Book a Consultation Session
              </Link>
              <Link
                href="/programs"
                className="px-2 py-3.5 text-center text-base font-semibold text-white underline decoration-navy-300 underline-offset-4 transition-colors hover:decoration-white"
              >
                Explore programs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof strip ──────────────────────────────────────── */}
      <section className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">
            Our students got accepted into
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {[
              { name: 'Harvard University', src: '/images/logos/harvard.webp', w: 240, h: 160, size: 'h-12 sm:h-14' },
              { name: 'Yale University', src: '/images/logos/yale.webp', w: 152, h: 160, size: 'h-11 sm:h-12' },
              { name: 'University of Oxford', src: '/images/logos/oxford.webp', w: 128, h: 160, size: 'h-11 sm:h-12' },
              { name: 'The University of Chicago', src: '/images/logos/uchicago.webp', w: 160, h: 160, size: 'h-11 sm:h-12' },
              { name: 'Northwestern University', src: '/images/logos/northwestern.webp', w: 160, h: 160, size: 'h-11 sm:h-12' },
              { name: 'Emory University', src: '/images/logos/emory.webp', w: 119, h: 160, size: 'h-11 sm:h-12' },
              { name: 'Vanderbilt University', src: '/images/logos/vanderbilt.webp', w: 150, h: 160, size: 'h-11 sm:h-12' },
              { name: 'London School of Economics', src: '/images/logos/lse.webp', w: 160, h: 160, size: 'h-9 sm:h-10' },
            ].map((logo) => (
              <Image
                key={logo.name}
                src={logo.src}
                alt={`${logo.name} logo`}
                width={logo.w}
                height={logo.h}
                className={`${logo.size} w-auto object-contain mix-blend-multiply`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
            {[
              ['500+', 'students coached by our team'],
              ['120+', 'awards in the 2025–26 debate season'],
              ['100%', 'of coaches hold WUDC or APDA awards'],
              ['87%', 'semester-to-semester renewal rate'],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="font-display text-5xl font-semibold text-signal-500">{stat}</dt>
                <dd className="mx-auto mt-3 max-w-[240px] text-sm leading-snug text-navy-600">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Programs ─────────────────────────────────────────── */}
      <section className="border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              Four programs. Start anywhere.
            </h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Whether your student is brand new to debate, converting from PF or
              LD, or already competing in the format, one of these four is the
              right entry point. The same training system runs through all of
              them.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...programs]
              .filter((program) => !program.seasonal)
              .sort((a, b) => (a.pathwayStep ?? 0) - (b.pathwayStep ?? 0))
              .map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  className="group flex flex-col border border-navy-200 bg-white p-7 transition-colors hover:border-navy-400"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-500">
                    Step {program.pathwayStep}
                    {program.featured && ' · Most popular'}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-navy-900">
                    {program.shortName}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
                    {program.description}
                  </p>
                  <p className="mt-5 text-xs text-navy-400">
                    Ages {program.ageRange.min}–{program.ageRange.max} · {program.level}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 group-hover:text-signal-600">
                    Learn more
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── Coaches ──────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                Meet the coaches
              </h2>
              <p className="mt-4 leading-relaxed text-navy-600">
                Competitors and adjudicators from Oxford, Harvard, Yale, Brown,
                Columbia, and LSE, with international coaching experience up to
                national-squad level.
              </p>
            </div>
            <Link
              href="/coaches"
              className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
            >
              Full coaching team
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {coaches.slice(0, 4).map((coach) => (
              <div key={coach.slug}>
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <Image
                    src={coach.image}
                    alt={`${coach.name}, ${coach.role} at WSDC Academy`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy-900">{coach.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">
                  {coach.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────── */}
      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              Coaching from inside the format
            </h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                title: 'Exceptional competition results',
                body: 'The roster includes a World Universities Debating Champion, the Best Open Speaker at WSDC 2025, and champions and top speakers from Harvard, Stanford, and the Oxford Union. Students learn the format from people who have won at its highest levels.',
              },
              {
                title: 'National team coaching experience',
                body: 'Our coaches have trained and competed for national squads, including Team Bulgaria, Team Philippines, and Team Croatia, plus past members of Team USA. They know WSDC firsthand: the motions, the judging culture, and what selection takes.',
              },
              {
                title: 'Direct feedback and progress reports',
                body: 'Instead of a vague “great job today,” every session produces written feedback tied to the 40/40/20 criteria, and every judged round ends with a full oral adjudication. Students always know what to fix next.',
              },
            ].map((item) => (
              <div key={item.title} className="border-t-2 border-signal-500 pt-6">
                <h3 className="font-display text-xl font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is World Schools ────────────────────────────── */}
      <section className="border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                The format that emphasizes eloquence, impromptu speaking, and
                content generation
              </h2>
              <p className="mt-5 leading-relaxed text-navy-600">
                World Schools Debate is the format of the World Schools Debating
                Championships, where roughly 60 national teams compete every year.
                In the US it&apos;s now an official NSDA event with its own
                invitational at Nationals, full state divisions in Texas, Florida,
                and Indiana, and a Tournament of Champions division.
              </p>
              <p className="mt-4 leading-relaxed text-navy-600">
                Three speakers per side. Eight-minute speeches. Half the motions
                impromptu, prepped in one hour with no internet and no coaches.
                Judged 40% on style, 40% on content, 20% on strategy. There&apos;s
                nowhere to hide behind evidence dumps or speed, which is exactly
                why the format rewards training.
              </p>
              <p className="mt-6">
                <Link
                  href="/what-is-world-schools-debate"
                  className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
                >
                  Read the full guide to World Schools Debate
                </Link>
              </p>
            </div>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src="/images/impromptu-prep.jpg"
                  alt="Debaters lined up along a school hallway preparing before rounds on tournament morning"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-navy-400">
                Tournament morning: teams claim a corridor and get to work.
              </figcaption>
            </figure>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-navy-100 bg-navy-100 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['3 v 3', 'Teams of 3–5; three speak each round'],
              ['8 min', 'Substantive speeches, plus 4-minute replies'],
              ['1 hour', 'Impromptu prep: no internet, no coaches'],
              ['40/40/20', 'Style, content, strategy judging'],
            ].map(([stat, label]) => (
              <div key={label} className="bg-white p-6">
                <p className="stat font-display text-3xl font-semibold text-navy-900">{stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-500">
                The results
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                What the training leads to
              </h3>
              <p className="mt-4 leading-relaxed text-navy-600">
                The skills the format rewards are the ones selective admissions screen
                for. Top performers reach elite universities at many times the normal
                rate. Four ways to see it.
              </p>
            </div>

            <div className="mt-8 rounded-sm border border-navy-200 bg-white p-6 sm:p-8">
              <TabbedExplorer
                autoAdvanceMs={6000}
                tabs={[
                  {
                    label: 'Higher admit rate',
                    panel: (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-500">Higher admit rate</p>
                        <h4 className="mt-3 font-display text-2xl font-semibold tracking-tight text-navy-900">
                          Debaters reach elite universities at many times the normal rate
                        </h4>
                        <p className="mt-4 leading-relaxed text-navy-600">
                          71% of Team USA went to an Ivy, US Top-30, or Oxbridge, against a
                          roughly 5% general rate. And the higher a debater ranks in the
                          world, the wider the gap.
                        </p>
                        <div className="mt-6 grid gap-8 lg:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-500">By cohort</p>
                            <div className="mt-3">
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
                            <p className="mt-3 text-xs leading-relaxed text-navy-400">
                              Share attending an Ivy, US Top-30, or Oxbridge school.
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-500">By world rank</p>
                            <div className="mt-3">
                              <ColumnChart
                                data={[
                                  { label: 'Top 10', value: 62, sub: '8 of 13', highlight: true },
                                  { label: 'Ranks 11–25', value: 37, sub: '11 of 30' },
                                  { label: 'Ranks 26–50', value: 36, sub: '9 of 25' },
                                ]}
                                max={80}
                                ariaLabel="Elite rate by finishing position: top 10 62 percent, ranks 11 to 25 37 percent, ranks 26 to 50 36 percent."
                              />
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-navy-400">
                              Cracking the world top 10 roughly doubles the rate.
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: 'Where they go',
                    panel: (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-500">Destinations</p>
                        <h4 className="mt-3 font-display text-2xl font-semibold tracking-tight text-navy-900">
                          A Harvard story: eight of the 42 alumni
                        </h4>
                        <p className="mt-4 leading-relaxed text-navy-600">
                          USA Debate alumni by college, classes of 2014 to 2020.
                        </p>
                        <div className="mb-4 mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-navy-700">
                          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-signal-500" />Ivy / Top-30 / Oxbridge</span>
                          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm bg-navy-400" />Other university</span>
                        </div>
                        <div className="max-w-3xl">
                        <RankedBars
                          data={[
                            { label: 'Harvard', value: 8, elite: true },
                            { label: 'Yale', value: 3, elite: true },
                            { label: 'UPenn', value: 3, elite: true },
                            { label: 'George Washington', value: 3, elite: false },
                            { label: 'Columbia / Barnard', value: 2, elite: true },
                            { label: 'Stanford', value: 2, elite: true },
                            { label: 'UT Austin', value: 2, elite: true },
                            { label: '10 more elite (×1)', value: 10, elite: true },
                            { label: '9 more others (×1)', value: 9, elite: false },
                          ]}
                          max={10}
                          ariaLabel="Team USA alumni by college: Harvard 8, Yale 3, UPenn 3, George Washington 3, Columbia or Barnard 2, Stanford 2, UT Austin 2, ten more elite schools once each, nine more other schools once each."
                        />
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: 'Ivy + Oxbridge',
                    panel: (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-500">Ivy + Oxbridge</p>
                        <h4 className="mt-3 font-display text-2xl font-semibold tracking-tight text-navy-900">
                          Even Ivy or Oxbridge only, the gap holds
                        </h4>
                        <p className="mt-4 leading-relaxed text-navy-600">
                          Counting only Ivy League and Oxbridge admits, the pattern
                          holds. Each grid shows 100 students.
                        </p>
                        <div className="mt-6 grid gap-6 sm:grid-cols-3">
                          {(
                            [
                              ['General applicant', '~5', 'Ivy or Oxbridge admit', 5],
                              ['Top-10 WSDC speaker', '54', '7 of 13 traced', 54],
                              ['Team USA speaker', '43', '18 of 42 alumni', 43],
                            ] as [string, string, string, number][]
                          ).map(([title, big, cap, pct]) => (
                            <div key={title}>
                              <h5 className="text-sm font-semibold text-navy-900">{title}</h5>
                              <p className="mt-1 font-display text-3xl font-semibold text-signal-500">
                                {big}
                                <span className="text-base text-navy-400"> in 100</span>
                              </p>
                              <p className="mb-3 text-xs text-navy-400">{cap}</p>
                              <div className="max-w-[260px]">
                                <WaffleGrid pct={pct} ariaLabel={`${title}: ${big} in 100 admitted to an Ivy or Oxbridge school.`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <p className="mt-8">
              <Link
                href="/blog/does-debate-help-college-admissions"
                className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
              >
                Read the full admissions analysis and method
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Pull quote ───────────────────────────────────────── */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="font-display text-2xl font-medium italic leading-relaxed sm:text-3xl">
            &ldquo;Students improve when practice looks like the real thing:
            judged rounds, honest adjudication, and feedback specific enough to
            act on.&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-navy-300">
            Ricky Huang · Head of Training
          </p>
        </div>
      </section>

      {/* ── Season moments ───────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              Scenes from the season
            </h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Photos from our coaching team&apos;s recent tournaments.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <figure className="md:col-span-2">
              <div className="relative h-72 overflow-hidden rounded-sm md:h-96">
                <Image
                  src="/images/student-speech-competition.jpg"
                  alt="A student delivers a speech to a full room on competition day"
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs text-navy-400">
                Competition day: our coaches&apos; students in round.
              </figcaption>
            </figure>
            <figure>
              <div className="relative h-72 overflow-hidden rounded-sm md:h-96">
                <Image
                  src="/images/tournament-awards.jpg"
                  alt="Two students holding quarterfinalist plaques at the Harvard Invitational"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs text-navy-400">
                Hardware from the elimination rounds.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── How training works ───────────────────────────────── */}
      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
                How training works
              </h2>
              <p className="mt-5 leading-relaxed text-navy-600">
                Most debate programs teach content and hope it shows up in
                rounds. We train the way competitive squads prepare: a loop of
                drilling, competing, and reviewing that runs all season.
              </p>
              <p className="mt-6">
                <Link
                  href="/programs"
                  className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
                >
                  See the programs it runs through
                </Link>
              </p>
            </div>

            <div className="lg:col-span-3">
              {[
                {
                  n: '1',
                  title: 'Drill',
                  body: 'A structured curriculum where every exercise maps to the 40/40/20 judging criteria: style work, casebuilding reps, and one-hour impromptu prep cycles under the real clock.',
                },
                {
                  n: '2',
                  title: 'Compete',
                  body: 'Judged practice rounds on real tournament motions, every training cycle, run under competition conditions rather than classroom conditions.',
                },
                {
                  n: '3',
                  title: 'Review',
                  body: 'Every round ends with a full oral adjudication. Every session ends with written feedback the student (and you) can actually read.',
                },
                {
                  n: '4',
                  title: 'Progress',
                  body: 'We track development against the judging criteria across the season, so you always know where your student is placed, what their weak spots are, and what comes next.',
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-6 border-t border-navy-200 py-6 first:border-t-0 first:pt-0 last:pb-0">
                  <span className="font-display text-2xl font-semibold text-signal-500">{item.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy-900">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-navy-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Term schedule ────────────────────────────────────── */}
      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <TermSchedule
            programs={programs
              .filter((p) => p.tracks && p.tracks.length > 0)
              .map((p) => ({ shortName: p.shortName, slug: p.slug, tracks: p.tracks! }))}
          />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            Common questions
          </h2>
          <div className="mt-10 divide-y divide-navy-100 border-y border-navy-100">
            {homepageFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
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
          <p className="mt-8 text-center">
            <Link
              href="/faq"
              className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
            >
              All frequently asked questions
            </Link>
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start with a free consultation
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-navy-200">
            A short call to tell us about your student and get an honest
            recommendation on where to start.
          </p>
          <Link
            href="/consultation"
            className="mt-8 inline-block rounded-sm bg-signal-500 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
