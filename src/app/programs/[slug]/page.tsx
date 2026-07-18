import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { programs, getProgramBySlug, formatPrice } from '@/data/programs';
import { getCoachBySlug } from '@/data/coaches';
import { CourseJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { EnrollButton } from '@/components/EnrollButton';
import { ScheduleTimezones } from '@/components/ScheduleTimezones';
import { BootcampSchedule } from '@/components/BootcampSchedule';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return {};

  return {
    title: `${program.name}: World Schools Debate ${program.level === 'Beginner' ? 'for Beginners' : 'Training'}`,
    description: program.description,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: {
      title: `${program.name} | WSDC Academy`,
      description: program.description,
      url: `/programs/${program.slug}`,
    },
  };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const coaches = (program.coachSlugs ?? [])
    .map((s) => getCoachBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const nextStep = program.nextStepSlug ? getProgramBySlug(program.nextStepSlug) : undefined;
  const isInvite = Boolean(program.invitationOnly);

  return (
    <>
      <CourseJsonLd program={program} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Programs', href: '/programs' },
          { name: program.shortName, href: `/programs/${program.slug}` },
        ]}
      />
      {program.faqs && program.faqs.length > 0 && <FAQJsonLd faqs={program.faqs} />}

      <section className="relative min-h-[560px] bg-navy-950 text-white">
        <Image
          src={program.image}
          alt={program.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-[center_25%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-navy-300">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="text-navy-500">/</span>
              <Link href="/programs" className="hover:text-white">Programs</Link>
              <span className="text-navy-500">/</span>
              <span className="text-navy-100">{program.shortName}</span>
            </nav>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
              {program.level} · Ages {program.ageRange.min}–{program.ageRange.max} · {program.format}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {program.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">{program.tagline}</p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              {isInvite ? (
                <>
                  <Link
                    href="/contact"
                    className="rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-signal-600"
                  >
                    Request consideration
                  </Link>
                  <span className="text-sm font-medium text-navy-200">Invitation only</span>
                </>
              ) : (
                <>
                  <EnrollButton program={program} />
                  <Link
                    href="/consultation"
                    className="px-2 py-3.5 text-center font-semibold text-white underline decoration-navy-300 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    Book a consultation first
                  </Link>
                </>
              )}
            </div>

            {coaches.length > 0 && (
              <div className="mt-9 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {coaches.map((coach) => (
                    <span
                      key={coach.slug}
                      className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-navy-950"
                    >
                      <Image src={coach.image} alt={coach.name} fill sizes="32px" className="object-cover" />
                    </span>
                  ))}
                </div>
                <span className="text-sm text-navy-200">
                  Taught by {coaches.map((c) => c.name.split(' ')[0]).join(', ')} and team
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pathway stepper (year-round ladder; hidden on seasonal one-offs) */}
        {!program.seasonal && (
        <div className="relative border-t border-white/10 bg-navy-950/60">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:text-sm">
              <li className="mr-2 font-semibold uppercase tracking-wider text-navy-300">
                The pathway
              </li>
              {[...programs]
                .filter((p) => !p.seasonal)
                .sort((a, b) => (a.pathwayStep ?? 0) - (b.pathwayStep ?? 0))
                .map((p, i) => (
                  <li key={p.id} className="flex items-center gap-2">
                    {i > 0 && <span className="text-navy-600">·</span>}
                    {p.id === program.id ? (
                      <span className="font-semibold text-white">
                        {p.pathwayStep}. {p.shortName}
                      </span>
                    ) : (
                      <Link
                        href={`/programs/${p.slug}`}
                        className="text-navy-300 transition-colors hover:text-white"
                      >
                        {p.pathwayStep}. {p.shortName}
                      </Link>
                    )}
                  </li>
                ))}
            </ol>
          </div>
        </div>
        )}
      </section>

      {program.term && (
        <div className="border-b border-navy-100 bg-cream">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-8">
            <span className="font-semibold text-navy-900">{program.term.label}</span>
            <span className="text-navy-600">{program.term.start}.</span>
            {program.term.earlyBird && (
              <span className="font-medium text-signal-600 sm:ml-auto">{program.term.earlyBird}.</span>
            )}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy-900">About this program</h2>
            <p className="mt-4 leading-relaxed text-navy-700">{program.longDescription}</p>

            {/* Is this right for your student? */}
            {(program.prerequisites || nextStep) && (
              <div className="mt-10 rounded-xl border border-navy-100 bg-navy-50 p-6">
                <h2 className="text-xl font-bold text-navy-900">Is this the right fit?</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="font-semibold text-navy-400">Who it&apos;s for</dt>
                    <dd className="mt-1 text-navy-700">{program.idealFor.join(' · ')}</dd>
                  </div>
                  {program.prerequisites && (
                    <div>
                      <dt className="font-semibold text-navy-400">Prerequisites</dt>
                      <dd className="mt-1 text-navy-700">{program.prerequisites}</dd>
                    </div>
                  )}
                  {nextStep && (
                    <div>
                      <dt className="font-semibold text-navy-400">Where it leads</dt>
                      <dd className="mt-1 text-navy-700">
                        Graduates step up to{' '}
                        <Link
                          href={`/programs/${nextStep.slug}`}
                          className="font-medium underline underline-offset-2 hover:text-signal-500"
                        >
                          {nextStep.name}
                        </Link>
                        .
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Class schedule (Junior / Senior tracks) with timezone selector */}
            {program.tracks && program.tracks.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold text-navy-900">Class schedule</h2>
                <p className="mt-3 text-navy-600">
                  Two age groups, each with two weekly time-slot options. Pick a group by age; a coach
                  confirms the slot when you enroll. Times show in your timezone by default, and you can
                  switch it below.
                </p>
                <ScheduleTimezones tracks={program.tracks} />
              </>
            )}

            {/* Bootcamp schedule (fixed cohort, all meetings required) */}
            {program.bootcamp && (
              <>
                <h2 className="mt-12 text-2xl font-bold text-navy-900">When it meets</h2>
                <p className="mt-3 text-navy-600">
                  The bootcamp runs as monthly summer cohorts, and each cohort meets twice a week for
                  three weeks. Only the August cohort is still open. Times show in your timezone by
                  default, and you can switch it below.
                </p>
                <BootcampSchedule bootcamp={program.bootcamp} />
              </>
            )}

            <h2 className="mt-12 text-2xl font-bold text-navy-900">What students achieve</h2>
            <ul className="mt-5 space-y-3">
              {program.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-navy-700">
                  <span className="mt-1 font-bold text-signal-500">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>

            {/* What a session looks like */}
            {program.sessionFlow && program.sessionFlow.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold text-navy-900">What a session looks like</h2>
                <p className="mt-3 text-navy-600">
                  Every class runs the same loop, so students always know the shape of the hour.
                </p>
                <ol className="mt-5">
                  {program.sessionFlow.map((block) => (
                    <li key={block.time} className="flex gap-5 border-t border-navy-100 py-4">
                      <span className="w-14 shrink-0 font-mono text-sm font-semibold text-signal-500">
                        {block.time}
                      </span>
                      <div>
                        <h3 className="font-bold text-navy-900">{block.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-navy-600">{block.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}

            <h2 className="mt-12 text-2xl font-bold text-navy-900">Curriculum</h2>
            <div className="mt-5 space-y-4">
              {program.curriculum.map((section, i) => (
                <div key={section.title} className="rounded-lg border border-navy-100 bg-white p-5">
                  <h3 className="font-bold text-navy-900">
                    <span className="mr-2 text-signal-500">{String(i + 1).padStart(2, '0')}</span>
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{section.detail}</p>
                </div>
              ))}
            </div>

            {/* What's included */}
            {program.included && program.included.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold text-navy-900">What&apos;s included</h2>
                <ul className="mt-5 space-y-3">
                  {program.included.map((item) => (
                    <li key={item} className="flex gap-3 text-navy-700">
                      <span className="mt-1 font-bold text-signal-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Who teaches it */}
            {coaches.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold text-navy-900">Who teaches it</h2>
                <div className="mt-5 space-y-5">
                  {coaches.map((coach) => (
                    <div key={coach.slug} className="flex gap-4 border-t border-navy-100 pt-5">
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                        <Image src={coach.image} alt={coach.name} fill sizes="64px" className="object-cover" />
                      </span>
                      <div>
                        <h3 className="font-bold text-navy-900">
                          {coach.name}
                          <span className="font-normal text-navy-500"> · {coach.role}</span>
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-navy-600">
                          {coach.credentials.slice(0, 2).join('. ')}.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm text-navy-600">
                  Full credentials for the whole team are on the{' '}
                  <Link href="/coaches" className="font-medium underline underline-offset-2 hover:text-signal-500">
                    coaches page
                  </Link>
                  .
                </p>
              </>
            )}

            {/* How enrollment works */}
            <h2 className="mt-12 text-2xl font-bold text-navy-900">
              {isInvite ? 'How to join' : 'How enrollment works'}
            </h2>
            <ol className="mt-5">
              {(isInvite
                ? [
                    ['Train and compete', 'The Sprint draws from the Competition Team. The way in is to train with us and put up results at tournaments.'],
                    ['A coach nominates you', 'Coaches invite students on the strength of their competitive record and their progress in the squad.'],
                    ['Accept your place', 'Invited students confirm the schedule with a coach and join the twice-weekly training block.'],
                  ]
                : [
                    ['Enroll and pay', 'Secure checkout takes a minute. You enter each student’s details and pay for the enrollment unit shown below.'],
                    ['We reach out in 24–48 hours', 'A coach contacts you to welcome the student, confirm the age group and time slot, and answer any questions.'],
                    ['Placement and first session', 'We place the student in the right class and send the class link and materials before the first meeting.'],
                  ]
              ).map(([title, detail], i) => (
                <li key={title} className="flex gap-5 border-t border-navy-100 py-4">
                  <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-navy-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-600">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            {isInvite ? (
              <p className="mt-4 text-sm text-navy-500">
                Not in the squad yet? Start on the{' '}
                <Link href="/programs/competition-team" className="underline underline-offset-2 hover:text-signal-500">
                  Competition Team
                </Link>{' '}
                or{' '}
                <Link href="/contact" className="underline underline-offset-2 hover:text-signal-500">
                  ask a coach
                </Link>{' '}
                about the path to an invitation.
              </p>
            ) : (
              <p className="mt-4 text-sm text-navy-500">
                Enrollment is covered by our{' '}
                <Link href="/refund" className="underline underline-offset-2 hover:text-signal-500">
                  Refund Policy
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="underline underline-offset-2 hover:text-signal-500">
                  Terms of Service
                </Link>
                .
              </p>
            )}

            {/* Program FAQ */}
            {program.faqs && program.faqs.length > 0 && (
              <>
                <h2 className="mt-12 text-2xl font-bold text-navy-900">Frequently asked questions</h2>
                <div className="mt-5 divide-y divide-navy-100 border-t border-navy-100">
                  {program.faqs.map((faq) => (
                    <details key={faq.question} className="group py-4">
                      <summary className="cursor-pointer list-none font-semibold text-navy-900 marker:content-none">
                        {faq.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-white p-6">
                <p className="text-sm font-semibold text-navy-400">{isInvite ? 'Enrollment' : 'Tuition'}</p>
                <p className="mt-1 text-2xl font-bold text-navy-900">{formatPrice(program)}</p>
                <dl className="mt-5 space-y-3 border-t border-navy-100 pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Format</dt>
                    <dd className="font-medium text-navy-900">{program.format}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Schedule</dt>
                    <dd className="max-w-[60%] text-right font-medium text-navy-900">{program.schedule}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Ages</dt>
                    <dd className="font-medium text-navy-900">{program.ageRange.min}–{program.ageRange.max}</dd>
                  </div>
                </dl>
                {isInvite ? (
                  <>
                    <Link
                      href="/contact"
                      className="mt-6 block rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-signal-600"
                    >
                      Request consideration
                    </Link>
                    <p className="mt-3 text-center text-xs text-navy-500">
                      Places are offered by coach invitation.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-xs text-navy-500">
                      Checkout unit: {program.enrollment.unitLabel.toLowerCase()}
                    </p>
                    <EnrollButton program={program} className="mt-6 block w-full" />
                    <Link
                      href="/consultation"
                      className="mt-3 block text-center text-sm font-medium text-navy-600 underline underline-offset-2 hover:text-signal-500"
                    >
                      or start with a consultation
                    </Link>
                  </>
                )}
              </div>

              <div className="rounded-xl bg-navy-50 p-6">
                <h3 className="font-bold text-navy-900">Ideal for</h3>
                <ul className="mt-3 space-y-2 text-sm text-navy-700">
                  {program.idealFor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-signal-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
