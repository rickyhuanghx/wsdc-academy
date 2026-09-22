// Shared shape of the unlisted 1-on-1 coaching request form (/coaching-1on1).
//
// The client form and the API route both import from here, so the options a
// parent can pick and the values the server will accept cannot drift apart.
// Ported from atlantic-ivy-landing's HIR one-on-one form, with the debate
// roster and debate-specific questions in place of the writing ones.

import { coaches, type Coach } from '@/data/coaches';

/**
 * Whose cards appear on the form, in the order they are shown. Trimming or
 * reordering the roster is a one-line edit here — the card list, the server's
 * allow-list, and the email summary all follow from it.
 *
 * Cailyn Min, Mac Hays and Zach Fleeser are on /coaches but deliberately NOT
 * offered for 1-on-1 (owner, 2026-09-22). Because the server's allow-list is
 * derived from this list, their slugs are rejected server-side too. Do not
 * re-add them without asking.
 */
export const ONE_ON_ONE_COACH_SLUGS = [
  'biser-angelov',
  'tin-puljic',
  'perry-beckett',
  'netra-easwaran',
  'matt-mauriello',
] as const;

/** The roster above resolved against src/data/coaches.ts, in display order. */
export const oneOnOneCoaches: Coach[] = ONE_ON_ONE_COACH_SLUGS.map((slug) =>
  coaches.find((c) => c.slug === slug),
).filter((c): c is Coach => Boolean(c));

export function coachNameForSlug(slug: string): string | undefined {
  return oneOnOneCoaches.find((c) => c.slug === slug)?.name;
}

export const NO_PREFERENCE = 'No preference';

export const LEVELS: { value: string; help: string }[] = [
  { value: 'New to debate', help: 'Little or no competitive experience yet' },
  { value: 'Some experience', help: 'A season or two, a few tournaments' },
  { value: 'Competitive', help: 'Breaking at majors, or on a squad' },
];

export const FORMATS = [
  'World Schools',
  'British Parliamentary',
  'Lincoln-Douglas',
  'Public Forum',
  'Public speaking',
  'Not sure yet',
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WINDOWS: { value: string; range: string }[] = [
  { value: 'Morning', range: '9:00 AM – 12:00 PM' },
  { value: 'Afternoon', range: '12:00 PM – 5:00 PM' },
  { value: 'Evening', range: '5:00 PM – 9:00 PM' },
];

export const LEVEL_VALUES = LEVELS.map((l) => l.value);
export const WINDOW_VALUES = WINDOWS.map((w) => w.value);
