// Shared shape of the pre-diagnostic intake form (/for/diagnostic/[token]).
//
// A family that has paid for the $80 diagnostic session gets a private link.
// Before the session the student tells us a little about themselves, what they
// want from coaching, and does two short written argument tasks so the coach
// walks in with something to mark, not a blank page. The client form and the
// API route both import from here, so the options a student can pick and the
// values the server will accept cannot drift apart.
//
// The page is unlisted the same way /for/* is: noindex/nofollow from the /for
// layout, an X-Robots-Tag header in next.config.ts, no sitemap entry, and
// nothing links to it. Only the tokens registered below resolve; anything
// else is a 404.

import { DAYS, WINDOWS, WINDOW_VALUES } from '@/lib/coaching-request';

export { DAYS, WINDOWS, WINDOW_VALUES };

/**
 * One invite per paid diagnostic. The token is the last path segment of the
 * private URL; what we already know from checkout is prefilled so the family
 * confirms rather than retypes. Add a row here, deploy, and send the URL.
 */
export interface DiagnosticInvite {
  token: string;
  studentName: string;
  studentFirst: string;
  grade: string;
  school: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  /** For staff only: what this invite is tied to. Never rendered. */
  paymentRef: string;
}

export const DIAGNOSTIC_INVITES: readonly DiagnosticInvite[] = [
  {
    // Paid 2026-09-25 on the site checkout (HK Stripe pi_3UJXI6L1Pf2G27AU1WlM78DK,
    // Supabase orders b06b0940). Student is at Rosenberg in St. Gallen, so the
    // family is on Swiss time.
    token: 'igor-prokudin-e3c5',
    studentName: 'Igor Prokudin',
    studentFirst: 'Igor',
    grade: 'Grade 11',
    school: 'Institut auf dem Rosenberg',
    parentName: 'Tatiana Prokudina',
    parentEmail: 'igorandici@gmail.com',
    parentPhone: '+41 79 860 04 66',
    paymentRef: 'pi_3UJXI6L1Pf2G27AU1WlM78DK',
  },
];

export function getDiagnosticInvite(token: string): DiagnosticInvite | undefined {
  return DIAGNOSTIC_INVITES.find((i) => i.token === token);
}

export const AGES = ['11', '12', '13', '14', '15', '16', '17', '18', '19'];

export const EXPERIENCE: { value: string; help: string }[] = [
  { value: 'Never debated', help: 'This would be a first' },
  { value: 'School debating only', help: 'Club or class, no tournaments yet' },
  { value: 'A few tournaments', help: 'One or two competitions so far' },
  { value: 'Competing regularly', help: 'On a team, several tournaments a year' },
];

export const FORMATS_TRIED = [
  'World Schools',
  'British Parliamentary',
  'Public Forum',
  'Lincoln-Douglas',
  'Model UN',
  'Public speaking',
];

export const GOALS = [
  'Speaking with more confidence',
  'Building stronger arguments',
  'Rebuttal and thinking on my feet',
  'Structure and clarity',
  'Preparing for a specific competition',
  'Making a school or national team',
  'University applications',
  'Not sure yet',
];

/**
 * The written tasks. Two motions to choose from, both debatable at Grade 11
 * with no research, plus one fixed argument to respond to. Kept in one place
 * so the coach's email quotes exactly what the student saw.
 */
export const MOTIONS = [
  'This House would make voting compulsory.',
  'This House believes that schools should ban smartphones during the school day.',
];

export const SIDES = ['Proposition (for the motion)', 'Opposition (against the motion)'];

export const REBUTTAL_PROMPT =
  'Zoos should be banned. Keeping animals in captivity is cruel, and no amount of education or conservation work justifies confining an animal for people to look at.';

export const TIME_SPENT = ['Under 15 minutes', '15 to 30 minutes', '30 to 60 minutes', 'Over an hour'];

export const CASE_MIN_WORDS = 60;
export const CASE_MAX_CHARS = 2500;
export const REBUTTAL_MAX_CHARS = 1500;

export const EXPERIENCE_VALUES = EXPERIENCE.map((e) => e.value);

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
