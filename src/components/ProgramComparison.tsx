import Link from 'next/link';
import { getAgeGroupsDisplay, type Program } from '@/data/programs';
import { LevelMeter } from './LevelMeter';

// At-a-glance comparison strip for the /programs index: lets a visitor self-select before
// scrolling the full cards. Reuses the same sort order as the cards (seasonal first, then the
// year-round ladder by step) so the rows and the cards below read in the same sequence.

// One-line "best for" per program. Kept here (not in programs.ts) because these are short
// marketing summaries of the longer `idealFor` copy; owner can tune wording freely.
const BEST_FOR: Record<string, string> = {
  'summer-bootcamp': 'A first taste (last cohort: August)',
  foundations: 'Brand-new debaters',
  'competition-team': 'Tournament-bound students',
  'national-team-sprint': 'USA-team hopefuls (by invite)',
  'private-coaching': 'Targeted, flexible help',
};

function compactPrice(program: Program): string {
  if (program.invitationOnly) return 'By invitation';
  const model = program.pricing.model
    .replace('per term', '/ term')
    .replace('per hour', '/ hour')
    .replace('for the 12-hour bootcamp ($27 an hour)', 'one-time');
  return `$${program.pricing.amount.toLocaleString('en-US')} ${model}`;
}

function sortForLadder(list: Program[]): Program[] {
  return [...list].sort((a, b) => {
    const sa = a.seasonal ? 0 : 1;
    const sb = b.seasonal ? 0 : 1;
    if (sa !== sb) return sa - sb;
    return (a.pathwayStep ?? 99) - (b.pathwayStep ?? 99);
  });
}

export function ProgramComparison({ programs }: { programs: Program[] }) {
  const rows = sortForLadder(programs);

  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy-400">At a glance</h2>
      <div className="mt-4 overflow-x-auto rounded-sm border border-navy-100">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-cream text-xs uppercase tracking-wider text-navy-400">
              <th className="px-5 py-3 font-semibold">Program</th>
              <th className="px-5 py-3 font-semibold">Level</th>
              <th className="px-5 py-3 font-semibold">Ages</th>
              <th className="px-5 py-3 font-semibold">Tuition</th>
              <th className="px-5 py-3 font-semibold">Best for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((program) => (
              <tr key={program.id} className="border-b border-navy-50 last:border-0">
                <td className="px-5 py-4">
                  <Link
                    href={`/programs/${program.slug}`}
                    className="font-semibold text-navy-900 underline decoration-navy-200 underline-offset-4 hover:decoration-signal-500"
                  >
                    {program.shortName}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <LevelMeter level={program.level} />
                </td>
                <td className="px-5 py-4 font-mono text-navy-700">
                  {getAgeGroupsDisplay(program)}
                </td>
                <td className="px-5 py-4 font-semibold text-navy-900">{compactPrice(program)}</td>
                <td className="px-5 py-4 text-navy-600">{BEST_FOR[program.slug] ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
