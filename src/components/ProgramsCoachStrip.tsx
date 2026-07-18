import Link from 'next/link';
import Image from 'next/image';
import { coaches } from '@/data/coaches';

// Trust strip for the /programs index: shows who actually teaches. Reuses the shared roster
// (src/data/coaches.ts) so it stays in sync with /coaches. Visual only — the Person/CoachList
// JSON-LD lives on /coaches, so we don't duplicate structured data here.

export function ProgramsCoachStrip() {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">
        Who you&apos;ll train with
      </h2>
      <p className="mt-3 max-w-2xl text-navy-600">
        Every program is taught by national-team coaches and championship finalists, the same
        roster across the pathway.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {coaches.map((coach) => (
          <li key={coach.slug}>
            <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full border border-navy-100">
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-navy-900">{coach.name}</p>
            <p className="mt-1 text-center text-xs leading-snug text-navy-500">{coach.highlight}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8">
        <Link
          href="/coaches"
          className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
        >
          Meet the coaches
        </Link>
      </p>
    </div>
  );
}
