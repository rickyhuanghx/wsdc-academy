import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { coaches } from '@/data/coaches';
import { CoachListJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Our Coaches: World Schools Debate Specialists',
  description:
    'Meet the WSDC Prep coaching team: international adjudicators and competitors from Oxford, Harvard, Yale, Brown, Columbia, and LSE, with coaching experience up to national-squad level.',
  alternates: { canonical: '/coaches' },
  openGraph: {
    title: 'Our Coaches | WSDC Prep',
    description:
      'International adjudicators and competitors from Oxford, Harvard, Yale, Brown, Columbia, and LSE, with coaching experience up to national-squad level.',
    url: '/coaches',
  },
};

export default function CoachesPage() {
  return (
    <>
      <CoachListJsonLd coaches={coaches} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Coaches', href: '/coaches' },
        ]}
      />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">The coaching team</h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Most American coaches learned World Schools secondhand. Our team has
            competed at the highest level of the format, adjudicated international
            championships, and coached squads up to national level. It shows in
            how they train.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((coach) => (
            <div key={coach.slug} className="overflow-hidden rounded-xl border border-navy-100 bg-white">
              <div className="relative aspect-square">
                <Image
                  src={coach.image}
                  alt={`${coach.name}, ${coach.role} at WSDC Prep`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-navy-900">{coach.name}</h2>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-signal-500">
                  {coach.role}
                </p>
                <ul className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm text-navy-600">
                  {coach.credentials.map((credential) => (
                    <li key={credential} className="flex gap-2">
                      <span className="mt-0.5 text-signal-500">•</span>
                      {credential}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <figure className="md:col-span-1">
            <div className="relative h-72 overflow-hidden rounded-xl">
              <Image
                src="/images/finals-day-team.jpg"
                alt="Four students outside a historic school building on tournament finals day"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs text-navy-400">Finals day.</figcaption>
          </figure>
          <figure className="md:col-span-2">
            <div className="relative h-72 overflow-hidden rounded-xl">
              <Image
                src="/images/student-speech-competition.jpg"
                alt="A student delivering a speech to a full room on competition day"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs text-navy-400">
              In round, where the coaching shows.
            </figcaption>
          </figure>
        </div>

        <div className="mt-16 rounded-xl bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Train with them.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Every new student starts with a free consultation and a placement
            recommendation from the coaching team.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-md bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
