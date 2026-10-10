// Midterm check-in (/for/self-report): the student-facing paper.
//
// Source: "WSDC Academy Midterm Check-in: Question Bank" (owner, 2026-10-10).
// Everyone sits the same 30-minute paper in three parts:
//   A. Skills self-report: rate 18 skills 1 to 4, and write a one-line
//      Explain for the 9 core skills.
//   B. Quiz: 16 multiple-choice questions, easy to hard.
//   C. Motion analysis: choose 1 of 3 motions, answer 6 short prompts.
// plus a short optional reflection.
//
// THIS FILE IS SHIPPED TO THE BROWSER. It holds only what a student may see:
// no answer key, no marking rubric, no "which skill does this question check"
// tags. The key and the marking notes live in src/lib/self-report-key.ts,
// which only the API route imports. Keep it that way.
//
// Access: the URL is unlisted (noindex via the /for layout and the X-Robots-Tag
// header in next.config.ts, absent from sitemap.ts, llms.txt and every menu)
// and that is the whole gate: no password, by the owner's decision (2026-10-10).
//
// Ids (a1..a18, q1..q16, c1..c6) are the keys stored in Supabase: reword
// freely, never rename.

export const SELF_REPORT_PATH = '/for/self-report';

export const PAPER_TITLE = 'Midterm Check-in';

// ---------------------------------------------------------------------------
// Part A: skills self-report
// ---------------------------------------------------------------------------

export const RATING_SCALE: readonly { value: number; label: string }[] = [
  { value: 1, label: "I don't know what this is yet" },
  { value: 2, label: "I know what it is, but I can't do it in a round yet" },
  { value: 3, label: 'I can do it in a round' },
  { value: 4, label: 'I can do it well and could explain it to a teammate' },
];
export const RATING_MIN = 1;
export const RATING_MAX = 4;

export const PART_A_NOTE = 'Be honest: a 2 you can explain is more useful to your coach than a 4 you can’t.';

export interface SkillItem {
  id: string;
  /** Short bold name, e.g. "Format". Core skills only. */
  name?: string;
  /** The "I can…" statement. */
  text: string;
  /** The Explain prompt. Present on the nine core skills only. */
  explain?: string;
}

export const CORE_SKILLS: readonly SkillItem[] = [
  {
    id: 'a1',
    name: 'Format',
    text: "I know the WSDC speaking order, each speaker's job and the speech times.",
    explain: 'Write all 8 speeches in order, with the time for each.',
  },
  {
    id: 'a2',
    name: 'Prep',
    text: 'I can use a 1-hour impromptu prep well with my team.',
    explain: 'How does your team use the hour? Write the steps with rough minutes.',
  },
  {
    id: 'a3',
    name: '8-minute speech',
    text: 'I can speak for the full 8 minutes without running out of material.',
    explain: 'In your last full speech, how long did you speak, and what did you run out of or not reach?',
  },
  {
    id: 'a4',
    name: '4-minute reply',
    text: 'I can give a reply that summarises the debate without new arguments.',
    explain: "What is the reply for, what can't you do in it, and how would you structure it?",
  },
  {
    id: 'a5',
    name: 'Motion types',
    text: 'I can tell THW, THBT, THS, THR, THP and "TH, as X, would" apart and know what each asks Prop to prove.',
    explain: 'What does Prop have to prove in a THW motion, a THBT motion and a THR motion?',
  },
  {
    id: 'a6',
    name: 'Framing',
    text: 'I can define the motion and set out what each side must prove.',
    explain: 'What is framing? Write the first two sentences you’d say as Prop 1 on "THW ban homework".',
  },
  {
    id: 'a7',
    name: 'Mechanism',
    text: 'I can explain how and why my claim happens.',
    explain: 'What is a mechanism? Give a one-sentence example.',
  },
  {
    id: 'a8',
    name: 'Impact',
    text: 'I can explain who is affected, how much and why it matters.',
    explain: 'What is an impact, and why do judges care about it?',
  },
  {
    id: 'a9',
    name: 'Weighing',
    text: 'I can explain why our arguments matter more than theirs.',
    explain: 'What is weighing? Name two ways to weigh one argument against another.',
  },
];

export const SUPPORTING_SKILLS: readonly SkillItem[] = [
  { id: 'a10', text: 'Offer POIs, take 1–2 per speech and answer them confidently.' },
  { id: 'a11', text: 'Speak from brief notes instead of reading a script.' },
  { id: 'a12', text: 'Agree a team line and split so our three speeches fit together.' },
  { id: 'a13', text: 'Build a case file for a prepared motion, including likely opposition arguments.' },
  { id: 'a14', text: "Rebut the opposition's strongest argument, not just the easiest one." },
  { id: 'a15', text: 'Identify the main clash of a debate.' },
  { id: 'a16', text: 'Explain how judges score a WSDC speech (style, content, strategy).' },
  { id: 'a17', text: 'Win an argument through reasoning, without relying on quoted statistics.' },
  { id: 'a18', text: 'Describe how real actors would behave (their incentives and limits), not how I wish they would.' },
];

export const ALL_SKILLS: readonly SkillItem[] = [...CORE_SKILLS, ...SUPPORTING_SKILLS];
export const EXPLAIN_MAX_CHARS = 1200;

// ---------------------------------------------------------------------------
// Part B: quiz (no answers here; see self-report-key.ts)
// ---------------------------------------------------------------------------

export type OptionKey = 'A' | 'B' | 'C' | 'D';
export const OPTION_KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D'];

export interface QuizQuestion {
  id: string;
  text: string;
  /** Italic quoted material shown above the options, where the question has one. */
  quote?: string;
  options: readonly { key: OptionKey; text: string }[];
}

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'q1',
    text: 'In a WSDC debate, who gives the first speech?',
    options: [
      { key: 'A', text: 'First Proposition' },
      { key: 'B', text: 'First Opposition' },
      { key: 'C', text: 'The Proposition reply speaker' },
      { key: 'D', text: 'Whichever team wins the coin toss' },
    ],
  },
  {
    id: 'q2',
    text: 'At the WSDC championship, how long is a substantive (non-reply) speech?',
    options: [
      { key: 'A', text: '4 minutes' },
      { key: 'B', text: '5 minutes' },
      { key: 'C', text: '7 minutes' },
      { key: 'D', text: '8 minutes' },
    ],
  },
  {
    id: 'q3',
    text: 'When can a Point of Information be offered?',
    options: [
      { key: 'A', text: 'At any time during any speech' },
      { key: 'B', text: 'Only during the first minute of a speech' },
      { key: 'C', text: 'Only during reply speeches' },
      { key: 'D', text: 'After the first minute and before the last minute of a substantive speech' },
    ],
  },
  {
    id: 'q4',
    text: "Who is allowed to give a team's reply speech?",
    options: [
      { key: 'A', text: 'The first or second speaker' },
      { key: 'B', text: 'Only the third speaker' },
      { key: 'C', text: 'Any of the three speakers' },
      { key: 'D', text: 'Only the team captain' },
    ],
  },
  {
    id: 'q5',
    text: 'In what order are the reply speeches given?',
    options: [
      { key: 'A', text: 'Proposition reply, then Opposition reply' },
      { key: 'B', text: 'Both replies come before the third speeches' },
      { key: 'C', text: 'Opposition reply, then Proposition reply' },
      { key: 'D', text: 'Only the Proposition gives a reply' },
    ],
  },
  {
    id: 'q6',
    text: 'Which of these is NOT allowed in a reply speech?',
    options: [
      { key: 'A', text: 'Summarising the main clashes' },
      { key: 'B', text: 'Explaining why your team won those clashes' },
      { key: 'C', text: "Responding to the other team's case" },
      { key: 'D', text: 'Introducing a brand-new argument' },
    ],
  },
  {
    id: 'q7',
    text: '"This House Would ban homework in primary schools." What type of motion is this, and what does Prop usually need to show?',
    options: [
      { key: 'A', text: 'A policy motion: Prop shows the ban would be better on balance' },
      { key: 'B', text: 'A regret motion: Prop shows homework should never have existed' },
      { key: 'C', text: 'An actor motion: Prop argues as the government' },
      { key: 'D', text: 'A value motion: Prop shows homework is morally wrong' },
    ],
  },
  {
    id: 'q8',
    text: '"This House Regrets the rise of social media influencers." What must Prop show?',
    options: [
      { key: 'A', text: 'That the world would be better if influencer culture had not risen' },
      { key: 'B', text: 'That influencers should be banned from today' },
      { key: 'C', text: 'That individual influencers are bad people' },
      { key: 'D', text: 'That influencers should pay higher taxes' },
    ],
  },
  {
    id: 'q9',
    text: 'What should the First Proposition do at the start of their speech?',
    options: [
      { key: 'A', text: 'Go straight into the first argument' },
      { key: 'B', text: "Rebut the Opposition's case" },
      { key: 'C', text: 'Define the key terms, set out what the debate is about and what Prop must prove, then outline the team split' },
      { key: 'D', text: 'Summarise the whole debate' },
    ],
  },
  {
    id: 'q10',
    text: 'Your team has one hour to prep an impromptu motion. What is the best first step?',
    options: [
      { key: 'A', text: 'Each speaker starts writing their own speech straight away' },
      { key: 'B', text: 'Agree together what the motion means, what each side must prove and your main arguments, then split them' },
      { key: 'C', text: 'Write the reply speech first' },
      { key: 'D', text: 'Spend most of the hour collecting statistics' },
    ],
  },
  {
    id: 'q11',
    text: 'Read this argument. Which part is the mechanism?',
    quote: 'Banning phones in class improves learning. Without phones, students focus on the teacher instead of checking notifications, so they take in more of each lesson.',
    options: [
      { key: 'A', text: '"Banning phones in class improves learning"' },
      { key: 'B', text: '"Students focus on the teacher instead of checking notifications"' },
      { key: 'C', text: '"Phones"' },
      { key: 'D', text: 'There is no mechanism' },
    ],
  },
  {
    id: 'q12',
    text: 'Which is the strongest impact?',
    options: [
      { key: 'A', text: '"This is really bad."' },
      { key: 'B', text: '"This affects a lot of people."' },
      { key: 'C', text: '"Many experts agree with us."' },
      { key: 'D', text: '"Students who already struggle lose the most focus, so the attainment gap widens every year they stay in school."' },
    ],
  },
  {
    id: 'q13',
    text: 'Which sentence is weighing?',
    options: [
      { key: 'A', text: '"Even if their point is true, ours matters more: it permanently affects millions of children, while theirs is a small, temporary cost."' },
      { key: 'B', text: '"Our second argument is about the economy."' },
      { key: 'C', text: '"They said X, but X is wrong."' },
      { key: 'D', text: '"In conclusion, we are proud to propose."' },
    ],
  },
  {
    id: 'q14',
    text: 'A speaker says this and moves on. Why might a WSDC judge give it little credit?',
    quote: '70% of teenagers feel anxious because of social media',
    options: [
      { key: 'A', text: 'Statistics are banned in WSDC' },
      { key: 'B', text: 'Only third speakers may use evidence' },
      { key: 'C', text: 'Without explaining why it is true and why it matters, it is just an assertion; judges reward reasoning' },
      { key: 'D', text: "The speaker didn't give the website address" },
    ],
  },
  {
    id: 'q15',
    text: 'Which reply speech structure is strongest?',
    options: [
      { key: 'A', text: 'Recap each speech in the order they were given' },
      { key: 'B', text: 'Organise it around the 2–3 key clashes and explain why your side won each' },
      { key: 'C', text: 'Add a new argument the team forgot' },
      { key: 'D', text: 'List every argument both sides made' },
    ],
  },
  {
    id: 'q16',
    text: 'Which kind of weighing is this?',
    quote: 'Their harm can be fixed next year; ours, once it happens, can never be undone.',
    options: [
      { key: 'A', text: 'Scope (how many people)' },
      { key: 'B', text: 'Probability (how likely)' },
      { key: 'C', text: 'Reversibility (whether it can be undone)' },
      { key: 'D', text: 'Timeframe (how soon)' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Part C: motion analysis
// ---------------------------------------------------------------------------

export const MOTIONS = [
  'This House Would replace end-of-year school exams with coursework.',
  'This House Believes That social media companies should be legally responsible for misinformation on their platforms.',
  'This House Regrets the rise of AI companions for teenagers.',
] as const;

export const PART_C_NOTE =
  'The three motions rise in difficulty. You lose no marks for choosing the first; the harder ones give more room to show depth. Aim for 1–3 lines per prompt.';

export interface MotionPrompt {
  id: string;
  name: string;
  text: string;
}

export const MOTION_PROMPTS: readonly MotionPrompt[] = [
  { id: 'c1', name: 'Motion type and burden', text: 'What type of motion is this, and what must Prop prove to win?' },
  { id: 'c2', name: 'Framing', text: 'Define the key terms and say in one or two sentences what this debate is really about.' },
  { id: 'c3', name: 'Prop argument', text: 'Write one Prop argument as Claim → Mechanism → Impact, one line each.' },
  { id: 'c4', name: 'Opp argument', text: 'Write one Opp argument as Claim → Mechanism → Impact, one line each.' },
  { id: 'c5', name: 'Clash', text: 'What single question will this debate be won or lost on?' },
  { id: 'c6', name: 'Weighing', text: 'Pick a side. Write one or two sentences explaining why your Prop or Opp argument outweighs the other.' },
];
export const MOTION_ANSWER_MAX_CHARS = 1500;

// ---------------------------------------------------------------------------
// Open reflection (optional)
// ---------------------------------------------------------------------------

export interface Reflection {
  id: 'improve' | 'competition' | 'forCoach';
  label: string;
}

export const REFLECTIONS: readonly Reflection[] = [
  { id: 'improve', label: 'The one skill I most want to improve before the end of term is…' },
  { id: 'competition', label: "The competition I'm aiming for next is…" },
  { id: 'forCoach', label: 'Something I want my coach to know is…' },
];
export const REFLECTION_MAX_CHARS = 1000;

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

/** What the browser sends to /api/self-report. Validated again on the server. */
export interface SelfReportSubmission {
  studentName: string;
  grade: string;
  className: string;
  email: string;
  ratings: Record<string, number>;
  explains: Record<string, string>;
  quiz: Record<string, OptionKey>;
  motion: string;
  motionAnswers: Record<string, string>;
  reflections: Record<string, string>;
}
