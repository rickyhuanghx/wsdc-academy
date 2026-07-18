import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { programs, formatPrice } from '@/data/programs';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { EnrollButton } from '@/components/EnrollButton';
import { TermSchedule } from '@/components/TermSchedule';

export const metadata: Metadata = {
  title: 'World Schools Debate Programs: Classes, Teams & Coaching',
  description:
    'World Schools Debate programs for US students: an August beginner bootcamp, a Foundation class, a year-round Competition Team, the invitation-only National Team Sprint, and private 1-on-1 coaching. All online.',
  alternates: { canonical: '/programs' },
  openGraph: {
    title: 'World Schools Debate Programs | WSDC Academy',
    description:
      'Beginner Foundation, year-round Competition Team, the invitation-only National Team Sprint, and 1-on-1 coaching: America’s World Schools Debate pathway.',
    url: '/programs',
  },
};

export default function ProgramsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Programs', href: '/programs' },
        ]}
      />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            World Schools Debate Programs
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Every program is live, online, scheduled for US time zones, and focused
            on one thing: the World Schools format. Start where you are, and
            we&apos;ll move you up the ladder.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {[...programs]
            .sort((a, b) => {
              // Seasonal offers (summer bootcamp) lead; then the year-round ladder by step.
              const sa = a.seasonal ? 0 : 1;
              const sb = b.seasonal ? 0 : 1;
              if (sa !== sb) return sa - sb;
              return (a.pathwayStep ?? 99) - (b.pathwayStep ?? 99);
            })
            .map((program) => (
              <div
                key={program.id}
                className="grid gap-8 rounded-xl border border-navy-100 bg-white p-8 lg:grid-cols-3"
              >
                <div className="lg:col-span-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy-700">
                      {program.seasonal ? 'Summer intensive' : `Step ${program.pathwayStep}`}
                    </span>
                    {program.featured && (
                      <span className="rounded-full bg-signal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-signal-600">
                        Most popular
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-navy-900">{program.name}</h2>
                  <p className="mt-1 font-medium text-signal-500">{program.tagline}</p>
                  <p className="mt-4 leading-relaxed text-navy-600">{program.longDescription}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="inline-block rounded-md bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                    >
                      Program details
                    </Link>
                    {program.invitationOnly ? (
                      <Link
                        href="/contact"
                        className="inline-block rounded-md border border-navy-200 px-6 py-3 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400"
                      >
                        Request consideration
                      </Link>
                    ) : (
                      <EnrollButton program={program} variant="outline" size="sm" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg">
                    <Image
                      src={program.image}
                      alt={program.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="rounded-lg bg-cream p-6 text-sm">
                  <dl className="space-y-4">
                    <div>
                      <dt className="font-semibold text-navy-400">Ages</dt>
                      <dd className="text-navy-900">{program.ageRange.min}–{program.ageRange.max}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-navy-400">Level</dt>
                      <dd className="text-navy-900">{program.level}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-navy-400">Format</dt>
                      <dd className="text-navy-900">{program.format}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-navy-400">Schedule</dt>
                      <dd className="text-navy-900">{program.schedule}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-navy-400">Tuition</dt>
                      <dd className="font-bold text-navy-900">{formatPrice(program)}</dd>
                    </div>
                  </dl>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-12">
          <TermSchedule
            programs={programs
              .filter((p) => p.tracks && p.tracks.length > 0)
              .map((p) => ({ shortName: p.shortName, slug: p.slug, tracks: p.tracks! }))}
          />
        </div>

        <p className="mt-12 text-center text-navy-600">
          Not sure where to start?{' '}
          <Link href="/consultation" className="font-semibold text-signal-500 hover:text-signal-600">
            Book a consultation
          </Link>{' '}
          and we&apos;ll recommend a placement.
        </p>
      </section>
    </>
  );
}
