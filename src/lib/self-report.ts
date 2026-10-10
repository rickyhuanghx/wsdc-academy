// Student self-report quiz (/for/self-report).
//
// A private page for current students: they rate themselves against the
// skills the WSDC ballot rewards (content 40 / style 40 / strategy 20) and
// write three short reflections, so a coach can compare how a student sees
// their own debating with what the coach sees in class. Nothing here is a
// test with right answers; the score is the student's own picture.
//
// Access: the URL is unlisted (noindex via the /for layout and the X-Robots-Tag
// header in next.config.ts, absent from sitemap.ts, llms.txt and every menu)
// AND the page asks for a password before it renders the quiz. The password
// lives in the SELF_REPORT_PASSWORD env var; see src/lib/self-report-auth.ts.
//
// The client quiz and the API route both import from here, so what a student
// can pick and what the server accepts cannot drift apart.

export const SELF_REPORT_PATH = '/for/self-report';

/** Name of the httpOnly cookie that marks a browser as having entered the password. */
export const SELF_REPORT_COOKIE = 'wsdc_self_report';

export type SelfReportAreaId = 'content' | 'style' | 'strategy';

export interface SelfReportArea {
  id: SelfReportAreaId;
  name: string;
  /** Share of the WSDC ballot, used to weight the overall score. */
  weight: number;
  intro: string;
}

export const SELF_REPORT_AREAS: readonly SelfReportArea[] = [
  {
    id: 'content',
    name: 'Content',
    weight: 40,
    intro: 'The arguments themselves: whether they are built properly, explained fully, and answer what the other side said.',
  },
  {
    id: 'style',
    name: 'Style',
    weight: 40,
    intro: 'How you deliver: pace, clarity, structure, and whether a judge can follow you without reading your notes.',
  },
  {
    id: 'strategy',
    name: 'Strategy',
    weight: 20,
    intro: 'Choices in the round: which clashes you spend time on, how you use prep, and how you work with your teammates.',
  },
];

export interface SelfReportQuestion {
  id: string;
  area: SelfReportAreaId;
  text: string;
}

/**
 * Fifteen statements, five per area. Keep the ids stable: they are the keys
 * stored in Supabase, so renaming one would split the history of a student's
 * answers. Change the wording freely.
 */
export const SELF_REPORT_QUESTIONS: readonly SelfReportQuestion[] = [
  { id: 'c1', area: 'content', text: 'I can build an argument with a clear claim, reasoning, and an example.' },
  { id: 'c2', area: 'content', text: 'I can explain why my argument matters more than the best point on the other side.' },
  { id: 'c3', area: 'content', text: 'In rebuttal I answer their strongest point, not the easiest one.' },
  { id: 'c4', area: 'content', text: 'I notice weak logic or missing steps in an argument while it is being made.' },
  { id: 'c5', area: 'content', text: 'I follow the news closely enough to debate most motions without research.' },
  { id: 's1', area: 'style', text: 'I speak at a pace a judge can follow and write down.' },
  { id: 's2', area: 'style', text: 'I signpost so the judge always knows which part of the speech I am on.' },
  { id: 's3', area: 'style', text: 'I can fill my full speaking time without reading from a script.' },
  { id: 's4', area: 'style', text: 'I sound confident even when I am unsure of the material.' },
  { id: 's5', area: 'style', text: 'I take points of information without losing my place.' },
  { id: 't1', area: 'strategy', text: 'I can tell which clashes decide the round and spend my time there.' },
  { id: 't2', area: 'strategy', text: 'I use prep time well: a case split, roles, and a line the team agrees on.' },
  { id: 't3', area: 'strategy', text: 'I flow (take notes on) every speech, including my own side.' },
  { id: 't4', area: 'strategy', text: 'I pick up and extend what my teammates said rather than starting again.' },
  { id: 't5', area: 'strategy', text: 'When a debate goes somewhere unexpected, I adapt instead of sticking to the plan.' },
];

export const SELF_REPORT_QUESTION_IDS = SELF_REPORT_QUESTIONS.map((q) => q.id);

/** The 1 to 5 scale shown under every statement. Index 0 is unused. */
export const SELF_REPORT_SCALE: readonly { value: number; label: string }[] = [
  { value: 1, label: 'Not yet' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'About half the time' },
  { value: 4, label: 'Most rounds' },
  { value: 5, label: 'Every round' },
];

export const SCALE_MIN = 1;
export const SCALE_MAX = 5;

export interface SelfReportReflection {
  id: 'wentWell' | 'improve' | 'forCoach';
  label: string;
  help: string;
  required: boolean;
}

export const SELF_REPORT_REFLECTIONS: readonly SelfReportReflection[] = [
  {
    id: 'wentWell',
    label: 'What has gone best in your debating recently?',
    help: 'A round, a speech, or one skill that has clicked. Two or three sentences.',
    required: true,
  },
  {
    id: 'improve',
    label: 'What do you most want to improve next?',
    help: 'Pick one thing. The more specific, the easier it is to work on in class.',
    required: true,
  },
  {
    id: 'forCoach',
    label: 'Anything you want your coach to know?',
    help: 'Optional. Motions you found hard, a tournament coming up, a question for us.',
    required: false,
  },
];

export const REFLECTION_MAX_CHARS = 1500;

/** Classes a student can say they are in. "Other" covers trials, 1-on-1, and ex-students. */
export const SELF_REPORT_CLASSES = [
  'World Schools Foundation',
  'Competition Team',
  'Winter Academy',
  'Advanced Winter Academy',
  'Summer Bootcamp',
  '1-on-1 Coaching',
  'National Team Sprint',
  'Other / not sure',
] as const;

export const SELF_REPORT_EXPERIENCE = [
  'Under 3 months',
  '3 to 12 months',
  '1 to 2 years',
  'More than 2 years',
] as const;

export interface AreaScore {
  id: SelfReportAreaId;
  name: string;
  weight: number;
  /** Mean of the 1 to 5 answers, one decimal. */
  average: number;
  /** 0 to 100, where 100 means every statement was rated 5. */
  percent: number;
}

export interface SelfReportScore {
  areas: AreaScore[];
  /** Weighted 40/40/20, 0 to 100. */
  overall: number;
}

/**
 * Turns a full set of answers (question id -> 1..5) into per-area and overall
 * scores. Pure, so the client can show the result instantly and the server
 * can store the same numbers.
 */
export function scoreSelfReport(answers: Record<string, number>): SelfReportScore {
  const areas = SELF_REPORT_AREAS.map((area) => {
    const values = SELF_REPORT_QUESTIONS.filter((q) => q.area === area.id).map((q) => answers[q.id] ?? 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = values.length ? sum / values.length : 0;
    const percent = Math.round(((average - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100);
    return {
      id: area.id,
      name: area.name,
      weight: area.weight,
      average: Math.round(average * 10) / 10,
      percent: Math.max(0, Math.min(100, percent)),
    };
  });
  const overall = Math.round(areas.reduce((acc, a) => acc + (a.percent * a.weight) / 100, 0));
  return { areas, overall };
}

/** One line of plain-language reading for a score band, used on the result and in the staff email. */
export function describeBand(percent: number): string {
  if (percent >= 80) return 'Strong: this is working in almost every round.';
  if (percent >= 60) return 'Settling in: solid in most rounds, slips under pressure.';
  if (percent >= 40) return 'Developing: shows up sometimes, not yet reliable.';
  return 'Early: a good place to focus the next few weeks.';
}
