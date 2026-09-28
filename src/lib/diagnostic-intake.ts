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
import { SITE_NAME } from '@/lib/site';

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
  /** For staff only: what this invite is tied to. Stripped before the page passes the invite to the client. */
  paymentRef: string;
  /**
   * What the family paid for. 'diagnostic' (the default) is the $80 1-on-1
   * session; 'class' is a group-class enrolment, where the same form is used
   * to place the student in the right group before their first class.
   */
  kind?: 'diagnostic' | 'class';
  /** For kind 'class': the programme name shown on the page and in emails. */
  programName?: string;
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
  {
    // Paid 2026-09-27 on the site checkout for World Schools Foundation Term 1
    // ($756, HK Stripe pi_3UKQo7L1Pf2G27AU1fHVR0cg). Senior group; picked the
    // Saturday 12-2 PM ET slot at checkout. Family is in Spain.
    token: 'luke-keller-10d8',
    studentName: 'Luke Keller',
    studentFirst: 'Luke',
    grade: 'Grade 10',
    school: 'Palacio de Granda',
    parentName: 'Kate Sweeney',
    parentEmail: 'kateksweeney@gmail.com',
    parentPhone: '+34 658 288 050',
    paymentRef: 'pi_3UKQo7L1Pf2G27AU1fHVR0cg',
    kind: 'class',
    programName: 'World Schools Foundation',
  },
];

export function getDiagnosticInvite(token: string): DiagnosticInvite | undefined {
  return DIAGNOSTIC_INVITES.find((i) => i.token === token);
}

/**
 * The words that change between a diagnostic invite and a class-placement
 * invite. The page, the form and both emails read from here.
 */
export function inviteCopy(invite: Pick<DiagnosticInvite, 'kind' | 'programName' | 'studentFirst'>) {
  if (invite.kind === 'class') {
    const program = invite.programName ?? 'your class';
    return {
      eyebrow: `${program} · Term 1`,
      title: `Before your first class, ${invite.studentFirst}`,
      metaDescription: `A short form to complete before joining ${program} with ${SITE_NAME}.`,
      intro: `Your place in ${program} is paid for. This page takes about twenty to thirty minutes. It asks a few questions about you and what you want, whether a national team could be an option, two short written tasks, and when you are free. Your coach reads all of it before your first class, so we can put you in the right group and start from where you are.`,
      availability: `${program} meets once a week for two hours on Zoom. Tick every time that could work, so we can place you in a group that fits your week.`,
      confirmLine: 'We confirm your class time within one working day.',
      doneLine: 'Your coach will read them before your first class. We will email within one working day to confirm your class time.',
      staffLabel: `Class intake (${program})`,
      staffNote: 'Use the availability to place the student in a section, and send the two tasks to their coach before the first class.',
      parentSubjectNoun: 'intake form',
      parentLine: 'The coach will read them before the first class. We will be in touch within one working day to confirm the class time.',
    };
  }
  return {
    eyebrow: '1-on-1 diagnostic session',
    title: `Before your diagnostic session, ${invite.studentFirst}`,
    metaDescription: `A short form to complete before a 1-on-1 diagnostic session with ${SITE_NAME}.`,
    intro: 'Your diagnostic session is paid for. This page takes about twenty to thirty minutes. It asks a few questions about you and what you want, whether a national team could be an option, two short written tasks, and when you are free. Your coach reads all of it before the session, so the hour goes on your debating and not on introductions.',
    availability: 'The session is 60 minutes on Zoom. Tick everything that could work. The more options you give us, the sooner we can find a slot.',
    confirmLine: 'We confirm a session time within one working day.',
    doneLine: 'Your coach will read them before the session. We will email within one working day to confirm a time.',
    staffLabel: 'Diagnostic intake',
    staffNote: "Submitted on the private pre-diagnostic page. Availability is in the family's own timezone. Send the two tasks to the coach before the session.",
    parentSubjectNoun: 'diagnostic form',
    parentLine: 'The coach will read them before the diagnostic session. We will be in touch within one working day to confirm a time.',
  };
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

/**
 * World Schools national teams. WSDC is contested between national teams, so
 * the coach needs to know which country or countries a student could speak
 * for. Eligibility is set by each nation; most ask for citizenship or a period
 * of residency plus enrolment at a secondary school.
 */
export const NATIONAL_TEAM_INTEREST: { value: string; help: string }[] = [
  { value: 'Yes, a goal of mine', help: 'I want to work towards trials' },
  { value: 'Curious, tell me more', help: 'I would like to understand the route' },
  { value: 'Not for now', help: 'Other goals come first' },
];

export const NATIONAL_TEAM_INTEREST_VALUES = NATIONAL_TEAM_INTEREST.map((n) => n.value);

export const TIME_SPENT = ['Under 15 minutes', '15 to 30 minutes', '30 to 60 minutes', 'Over an hour'];

export const CASE_MIN_WORDS = 60;
export const CASE_MAX_CHARS = 2500;
export const REBUTTAL_MAX_CHARS = 1500;

export const EXPERIENCE_VALUES = EXPERIENCE.map((e) => e.value);

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
