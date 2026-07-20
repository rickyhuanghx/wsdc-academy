// Single source of truth for all program content (no DB, no CMS).
// Drives /programs, /programs/[slug], the sitemap, Course JSON-LD, and the homepage pathway section.
//
// NOTE: pricing values are launch placeholders pending owner sign-off — see CLAUDE.md.
// Schedules/term dates are owner-supplied (Term 1, 2026/27). Age bands on the Junior/Senior
// tracks are reasonable placeholders — placement is by the coach — and need owner sign-off.

export interface Program {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string; // card-length
  longDescription: string; // detail-page hero
  /**
   * Optional SEO meta-description override. When set, this (not `description`)
   * becomes the page's meta + OG description. Use it where the card copy runs
   * past a SERP snippet so the important, time-sensitive detail is not truncated.
   * Keep it ≤ ~155 characters.
   */
  metaDescription?: string;
  /**
   * Optional SEO title override (still run through the layout's `%s | brand`
   * template). Use it to point each program at a distinct search query
   * instead of the generic name+level formula in generateMetadata.
   */
  metaTitle?: string;
  /**
   * Optional keyword-bearing H1 for the detail page. Cards, steppers, and
   * checkout keep using `name`; only the /programs/[slug] H1 reads this.
   */
  seoH1?: string;
  /** ISO term boundaries. Feeds Course JSON-LD CourseInstance startDate/endDate. */
  termDates?: { start: string; end: string };
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  ageRange: { min: number; max: number };
  format: 'Small-group online' | 'Private online';
  schedule: string;
  image: string; // path under /public
  imageAlt: string;
  pricing: {
    amount: number; // current (early-bird) price the buyer pays
    compareAt?: number; // original price, struck through next to `amount`
    currency: 'USD';
    model: string; // e.g. "per term"
  };
  /**
   * Early-bird framing. The discount is a fixed marketing label (always shown,
   * never date-gated — see EARLY_BIRD_PERCENT); `deadlineLabel` is copy only.
   */
  earlyBird?: { deadlineLabel: string }; // e.g. "August 15"
  // --- At-a-glance facts (rendered in the sidebar "details" card when present) ---
  classSize?: string; // "6–8 students"
  sessionLength?: string; // "2 hours"
  instruction?: { totalHours: number; sessions: number }; // "28 hours total · 14 sessions"
  hourlyRate?: number; // USD per hour, for the "$27/hr" fact line
  semesterDuration?: string; // "September 1 – December 18, 2026"
  /**
   * What one checkout purchase buys. Drives the cart, /checkout, and the
   * payment-intent route (prices are always re-resolved from here server-side).
   * Amounts are launch placeholders pending owner sign-off — see CLAUDE.md.
   * Ignored for invitation-only programs, and for 1-on-1 (which sells `oneOnOne`
   * variants instead of a single fixed unit).
   */
  enrollment: {
    unitLabel: string; // e.g. "One term (Term 1, 2026/27)"
    amount: number; // USD
  };
  /**
   * Age bands + time slots the buyer must choose at checkout. Group programs
   * derive these from `tracks`; the bootcamp supplies its own `ageGroups`
   * (times come from `bootcamp.options`). Resolved by getEnrollmentOptions().
   */
  ageGroups?: { id: string; label: string; min: number; max: number }[];
  /**
   * 1-on-1 tiered pricing. Sold as selectable variants (diagnostic / hourly /
   * packages) rather than one fixed unit; the payment-intent route re-resolves
   * every amount from here server-side. Hours are valid for one year.
   */
  oneOnOne?: {
    diagnostic: { id: string; label: string; amount: number };
    hourly: { id: string; label: string; rate: number; minHours: number; maxHours: number };
    packages: { id: string; label: string; hours: number; amount: number }[];
    validityNote: string;
  };
  outcomes: string[];
  curriculum: { title: string; detail: string }[];
  idealFor: string[];
  featured?: boolean;
  /** Position on the homepage pathway ladder (1 = first rung). Omitted for seasonal programs. */
  pathwayStep?: number;
  /** Seasonal one-off (e.g. summer bootcamp): kept out of the year-round pathway ladders. */
  seasonal?: boolean;

  // --- Optional depth (rendered only when present) ---
  /**
   * Age-band tracks (Junior / Senior). Rendered as the class-schedule section.
   * Price stays at the program level for launch; the coach confirms band + time
   * slot in the enrollment follow-up (grade level is collected at checkout).
   */
  tracks?: {
    band: string; // "Junior" | "Senior"
    label: string; // "Junior World Schools"
    ageRange: { min: number; max: number };
    cadence: string; // "One 2-hour class per week + one practice debate per month"
    // Each slot is anchored to US Eastern wall-clock (start/end are ET "HH:MM", 24h;
    // dayOfWeek 0=Sun..6=Sat). The ScheduleTimezones client component converts these to
    // the viewer's timezone. `day` is a human label / no-JS fallback.
    options: { id: string; day: string; dayOfWeek: number; start: string; end: string }[];
  }[];
  /** Term / enrollment-window banner shown near the top of the program page. */
  term?: {
    label: string; // "Term 1 · 2026/27"
    start: string; // "Classes begin September 4, 2026"
    earlyBird?: string; // "Enroll before August 15 for the early-bird rate"
  };
  /**
   * Fixed-cohort intensive (e.g. the summer bootcamp): a set number of sessions over a
   * date range. The buyer picks ONE time `option` at checkout; each option meets twice a
   * week (its two `meetings`) at the same ET anchor as tracks; rendered timezone-aware
   * by BootcampSchedule.
   */
  bootcamp?: {
    dateRange: string; // "August 3–21, 2026"
    sessionCount: number;
    totalHours: number;
    /** Either/or time options; the buyer selects one at checkout. */
    options: {
      id: string;
      label: string; // "Option A · Mondays & Thursdays, 1–3 PM"
      meetings: { day: string; dayOfWeek: number; start: string; end: string }[];
    }[];
    /** Monthly summer cohorts; only the 'enrolling' one is purchasable (checkout sells that cohort). */
    cohorts: { label: string; status: 'closed' | 'enrolling' }[];
  };
  /** Invitation-only programs are not purchasable: no price, no cart, an inquiry CTA instead. */
  invitationOnly?: boolean;
  /** Coach slugs (from coaches.ts) shown in the "Who teaches it" section + hero strip. */
  coachSlugs?: string[];
  /** One prerequisite line for the "Is this right?" fit block. */
  prerequisites?: string;
  /** The next rung up: slug of the program to graduate into. */
  nextStepSlug?: string;
  /** Timed breakdown of a single session, for "What a session looks like". */
  sessionFlow?: { time: string; title: string; detail: string }[];
  /** Concrete deliverables for "What's included". */
  included?: string[];
  /** Program-specific FAQ (also emitted as FAQ JSON-LD). */
  faqs?: { question: string; answer: string }[];
}

const TERM_1: Program['term'] = {
  label: 'Term 1 · 2026/27',
  start: 'Classes run September 1 to December 18, 2026',
  earlyBird: 'Enroll before August 15 for the early-bird rate',
};

const TERM_1_DATES: Program['termDates'] = { start: '2026-09-01', end: '2026-12-18' };

export const programs: Program[] = [
  {
    id: 'foundations',
    slug: 'foundations',
    name: 'World Schools Foundation',
    shortName: 'Foundation',
    tagline: 'Learn the world’s format from the ground up',
    description:
      'An introduction to World Schools Debate for students new to the format: speech roles, argument construction, POIs, and monthly practice debates. Junior and Senior groups.',
    longDescription:
      'World Schools Foundation takes students from zero to competition-ready in the world’s most widely practiced debate format. Each week is a two-hour live class plus a monthly practice debate, split into Junior and Senior groups so students train alongside their own age band. Over the term, students master the 3-on-3 structure, learn what each speaker position does, build complete arguments, handle points of information, and debate in judged practice rounds.',
    metaTitle: 'World Schools Foundation: Online Debate Classes for Beginners (Ages 9–16)',
    metaDescription:
      'A beginner World Schools Debate class online for ages 9–16: a weekly 2-hour lesson plus monthly judged practice debates. Term 1 starts September 1. $756 per term.',
    level: 'Beginner',
    ageRange: { min: 9, max: 16 },
    format: 'Small-group online',
    schedule: 'Weekly 2-hour class + monthly practice debate',
    image: '/images/student-debating.jpg',
    imageAlt: 'A student delivering a practice speech in class',
    pricing: { amount: 756, compareAt: 945, currency: 'USD', model: 'per term' },
    enrollment: { unitLabel: 'One term (Term 1, 2026/27)', amount: 756 },
    earlyBird: { deadlineLabel: 'August 15' },
    classSize: '6–8 students',
    sessionLength: '2 hours',
    instruction: { totalHours: 28, sessions: 14 },
    hourlyRate: 27,
    semesterDuration: 'September 1 – December 18, 2026',
    term: TERM_1,
    termDates: TERM_1_DATES,
    tracks: [
      {
        band: 'Junior',
        label: 'Junior World Schools',
        ageRange: { min: 9, max: 12 },
        cadence: 'One 2-hour class per week + one practice debate per month',
        options: [
          { id: 'a', day: 'Saturdays', dayOfWeek: 6, start: '13:00', end: '15:00' },
          { id: 'b', day: 'Sundays', dayOfWeek: 0, start: '07:00', end: '09:00' },
        ],
      },
      {
        band: 'Senior',
        label: 'Senior World Schools',
        ageRange: { min: 13, max: 16 },
        cadence: 'One 2-hour class per week + one practice debate per month',
        options: [
          { id: 'a', day: 'Saturdays', dayOfWeek: 6, start: '12:00', end: '14:00' },
          { id: 'b', day: 'Sundays', dayOfWeek: 0, start: '09:00', end: '11:00' },
        ],
      },
    ],
    outcomes: [
      'Understand the full World Schools round structure: six 8-minute speeches plus reply speeches',
      'Deliver a complete first-speaker constructive with confidence',
      'Offer and answer points of information strategically',
      'Build team cases for prepared motions',
      'Compete in judged practice rounds with written feedback',
    ],
    curriculum: [
      { title: 'The format', detail: 'Round structure, speaker roles, and how Style/Content/Strategy judging works' },
      { title: 'Argumentation', detail: 'Claim–warrant–impact construction and refutation basics' },
      { title: 'Casebuilding', detail: 'Turning a prepared motion into a coherent three-speaker team case' },
      { title: 'Delivery', detail: 'Persuasive style for the 40% of your score that is how you speak' },
      { title: 'POIs', detail: 'When to offer, when to take, and how to answer points of information' },
      { title: 'Practice debates', detail: 'Monthly judged debates with individual written feedback' },
    ],
    idealFor: [
      'Students new to debate entirely',
      'PF, LD, or MUN students converting to World Schools',
      'Middle and high schoolers building toward a competition team',
    ],
    pathwayStep: 1,
    coachSlugs: ['netra-easwaran', 'biser-angelov', 'cailyn-min'],
    prerequisites:
      'None. Foundation assumes zero debate experience; a student who has never given a speech is exactly who it is built for.',
    nextStepSlug: 'competition-team',
    sessionFlow: [
      { time: '0:00', title: 'Warm-up', detail: 'A short speaking or thinking drill to get students talking before the pressure is on.' },
      { time: '0:15', title: 'Concept of the week', detail: 'One idea taught directly: a speaker role, an argument structure, or how POIs work, with examples.' },
      { time: '0:40', title: 'Guided drilling', detail: 'Students practice the concept in pairs or small groups while the coach circulates and corrects.' },
      { time: '1:20', title: 'Applied round', detail: 'A short judged debate applying the week’s skill, so every concept ends in real speaking, not theory.' },
      { time: '1:50', title: 'Feedback', detail: 'The coach debriefs the round and each student leaves with one specific thing to work on.' },
    ],
    included: [
      'Weekly 2-hour live small-group class, capped for real speaking time',
      'A monthly judged practice debate with a coach adjudicating, not just lecturing',
      'Written feedback tied to the Style / Content / Strategy criteria',
      'Full access to the printable resource library: speaker cheat sheets, the prep-hour planner, and the motion bank',
      'A coach who has competed and judged the format, not a volunteer reading a script',
    ],
    faqs: [
      {
        question: 'Does my child need any debate experience for Foundation?',
        answer:
          'No. Foundation starts from zero: what a round looks like, what each speaker does, and how to build a first argument. Students who have never debated are the intended audience. Students with some Public Forum, Lincoln-Douglas, or MUN experience also use it to convert to the World Schools format.',
      },
      {
        question: 'What is the difference between the Junior and Senior groups?',
        answer:
          'Same curriculum, grouped by age so students train with peers at their own stage. Junior is built for younger students (roughly ages 9–12) and Senior for older students (roughly ages 13–16). If you are unsure which fits, a free consultation ends with a placement recommendation.',
      },
      {
        question: 'How big are the classes?',
        answer:
          'Classes are small-group and capped so every student speaks in every session. World Schools is a speaking skill; it does not improve in a lecture hall.',
      },
      {
        question: 'What if we miss a session?',
        answer:
          'Life happens. Reach out and we will help the student catch up, and offer a make-up where we can. Our full withdrawal and refund terms are on the Refund Policy page.',
      },
      {
        question: 'What comes after Foundation?',
        answer:
          'Foundation students who want to compete move into the Competition Team, our year-round squad with weekly practice debates and tournament support. The best way to find the right starting point is a free consultation, which ends with a placement recommendation.',
      },
    ],
  },
  {
    id: 'competition-team',
    slug: 'competition-team',
    name: 'Competition Team',
    shortName: 'Competition Team',
    tagline: 'A year-round World Schools squad with a real training cycle',
    description:
      'Our flagship year-round program: a weekly 2-hour class, a weekly practice debate, prep on live tournament motions, and tournament support through the season. Junior and Senior squads.',
    longDescription:
      'The Competition Team is a year-round World Schools squad for students actively competing at local tournaments, state championships, and NSDA district qualifiers. Every week is a two-hour class plus a full practice debate, split into Junior and Senior squads. Training runs on a real competitive cycle: structured prep on live tournament motions, impromptu drills under the one-hour clock, and round-by-round adjudication from coaches who have judged at the international level.',
    metaTitle: 'Competition Team: Year-Round World Schools Debate Team Training',
    metaDescription:
      'Year-round World Schools Debate team training: a weekly class, a weekly judged practice debate, and tournament support through the season. $980 per term.',
    seoH1: 'World Schools Debate Competition Team',
    level: 'Intermediate',
    ageRange: { min: 11, max: 17 },
    format: 'Small-group online',
    schedule: 'Weekly 2-hour class + weekly practice debate',
    image: '/images/team-prep-session.jpg',
    imageAlt: 'A debate team preparing cases together before rounds',
    pricing: { amount: 980, compareAt: 1225, currency: 'USD', model: 'per term' },
    enrollment: { unitLabel: 'One term (Term 1, 2026/27)', amount: 980 },
    earlyBird: { deadlineLabel: 'August 15' },
    classSize: '6–8 students',
    sessionLength: '2 hours',
    instruction: { totalHours: 28, sessions: 14 },
    hourlyRate: 35,
    semesterDuration: 'September 1 – December 18, 2026',
    term: TERM_1,
    termDates: TERM_1_DATES,
    tracks: [
      {
        band: 'Junior',
        label: 'Junior World Schools',
        ageRange: { min: 11, max: 14 },
        cadence: 'One 2-hour class per week + one practice debate per week',
        options: [
          { id: 'a', day: 'Fridays', dayOfWeek: 5, start: '08:00', end: '10:00' },
          { id: 'b', day: 'Saturdays', dayOfWeek: 6, start: '13:00', end: '15:00' },
        ],
      },
      {
        band: 'Senior',
        label: 'Senior World Schools',
        ageRange: { min: 14, max: 17 },
        cadence: 'One 2-hour class per week + one practice debate per week',
        options: [
          { id: 'a', day: 'Saturdays', dayOfWeek: 6, start: '10:00', end: '12:00' },
          { id: 'b', day: 'Sundays', dayOfWeek: 0, start: '08:00', end: '10:00' },
        ],
      },
    ],
    outcomes: [
      'Run full impromptu prep cycles inside the one-hour window',
      'Master second- and third-speaker responsibilities: extension, comparison, and crystallization',
      'Develop reply speeches that win close rounds',
      'Build a season-long motion knowledge base across recurring themes',
      'Compete with confidence at district, state, and national-circuit tournaments',
    ],
    curriculum: [
      { title: 'Prepared motion cycles', detail: 'Research, casebuilding, and rebuttal prep on live tournament motions' },
      { title: 'Impromptu systems', detail: 'A repeatable one-hour prep method: framing, splits, and case assembly' },
      { title: 'Speaker specialization', detail: 'Dedicated training for 1st, 2nd, 3rd, and reply speaker roles' },
      { title: 'Adjudication literacy', detail: 'How judges actually apply the 40/40/20 criteria, and how to win them' },
      { title: 'Weekly practice debates', detail: 'A full judged round every week with oral adjudication' },
    ],
    idealFor: [
      'Students competing in state or NSDA district World Schools',
      'School teams that want structured external coaching',
      'Foundation students ready for real competition',
    ],
    featured: true,
    pathwayStep: 2,
    coachSlugs: ['biser-angelov', 'tin-puljic', 'matt-mauriello', 'cailyn-min'],
    prerequisites:
      'A season of Foundation or equivalent experience: the student can give a structured speech and knows the speaker roles. Not sure? A free consultation ends with a placement recommendation.',
    nextStepSlug: 'national-team-sprint',
    sessionFlow: [
      { time: '0:00', title: 'Round debrief', detail: 'The coach walks back through the week’s practice debate: what the adjudication rewarded, where rounds were won and lost, and the one habit to fix before the next one.' },
      { time: '0:15', title: 'Motion breakdown', detail: 'A live tournament motion goes on the table. The squad maps the burdens, the strongest ground for each side, and where the real clash sits.' },
      { time: '0:45', title: 'Case cycle', detail: 'Teams split and build: constructive material, the rebuttals they expect to face, and the extensions that separate a second speech from a first.' },
      { time: '1:15', title: 'Clash drills', detail: 'Timed refutation and points of information under pressure, so responding stops being the part that falls apart in a real round.' },
      { time: '1:40', title: 'Speaker labs', detail: 'Role-specific coaching for first through reply, plus individual feedback each debater carries into the week’s practice debate.' },
    ],
    included: [
      'Weekly 2-hour live class capped as a small squad, so every debater gets real speaking reps',
      'A judged practice debate every week with full oral adjudication, not just a lecture',
      'Written feedback after every round, mapped to the Style / Content / Strategy criteria',
      'Prep on live tournament motions, plus a team motion bank that grows through the season',
      'Tournament support: choosing events, prepping the motions, and debriefing each round across district, state, and national-circuit competitions',
    ],
    faqs: [
      {
        question: 'What experience does my child need for the Competition Team?',
        answer:
          'A season of Foundation or equivalent experience: the student can give a structured speech and knows the speaker roles. Students competing in another format who are converting to World Schools also fit here. If you are unsure, a free consultation ends with a placement recommendation.',
      },
      {
        question: 'How is this different from Foundation?',
        answer:
          'Foundation teaches the format from the ground up. The Competition Team trains a competing squad: a weekly practice debate, prep on live tournament motions, and round-by-round adjudication, all aimed at performing at real tournaments.',
      },
      {
        question: 'Do you help with actual tournaments?',
        answer:
          'Yes. We help students choose events, prepare on the motions, and debrief each round afterward, across district, state, and national-circuit competitions. We are an independent coaching program rather than a school team, so students enter under their own school or as independents.',
      },
      {
        question: 'What is the time commitment?',
        answer:
          'A two-hour class plus a judged practice debate each week through the season, on top of the prep students do between sessions. It is a real training cycle, not a drop-in class.',
      },
      {
        question: 'What if we miss a session?',
        answer:
          'Reach out and we will help the student catch up, and offer a make-up where we can. Our full withdrawal and refund terms are on the Refund Policy page.',
      },
    ],
  },
  {
    id: 'national-team-sprint',
    slug: 'national-team-sprint',
    name: 'National Team Sprint',
    shortName: 'National Team Sprint',
    tagline: 'Invitation-only World Schools Debate training for the top of the American pathway',
    description:
      'An invitation-only squad for our most advanced competitors: two classes a week plus a weekly practice debate, built around national-circuit breaks, NSDA Nationals, and national-team selection.',
    longDescription:
      'The National Team Sprint is the top rung of the pathway, and it is invitation-only. It brings together our most advanced competitors for two classes a week plus a weekly practice debate, training against international-style benchmarks. The focus is elimination-round strategy, prepared and impromptu cases to a national-final standard, and the specific demands of NSDA Nationals and national-team selection. Coaches invite students on the strength of their competitive results and progress in the Competition Team.',
    metaTitle: 'National Team Sprint: Advanced World Schools Debate Training',
    metaDescription:
      'An invitation-only advanced World Schools Debate squad: two classes plus a judged practice debate every week, built for NSDA Nationals and national-team selection.',
    level: 'Advanced',
    ageRange: { min: 14, max: 18 },
    format: 'Small-group online',
    schedule: 'Two classes per week + weekly practice debate',
    image: '/images/tournament-team-harvard.jpg',
    imageAlt: 'A squad of student debaters at the Harvard Invitational',
    pricing: { amount: 0, currency: 'USD', model: 'by invitation' },
    enrollment: { unitLabel: 'By invitation', amount: 0 },
    invitationOnly: true,
    outcomes: [
      'Prepare prepared-motion cases to a national-final standard',
      'Handle elimination-round pressure: close calls, judge adaptation, and panel strategy',
      'Train against the international benchmarks used at the World Schools Debating Championships',
      'Sharpen impromptu prep under national-circuit time pressure',
      'Get individual strategy reviews from coaches with national-team experience',
    ],
    curriculum: [
      { title: 'National-circuit preparation', detail: 'Prepared and impromptu prep tuned to the toughest US tournament fields and the USWSDI at NSDA Nationals' },
      { title: 'Elims strategy', detail: 'Panel adaptation, strategic concessions, and winning the adjudication discussion' },
      { title: 'International benchmarks', detail: 'Train against the standard set at the World Schools Debating Championships' },
      { title: 'Twice-weekly intensity', detail: 'Two classes and a full practice debate each week, the volume the top of the field trains at' },
    ],
    idealFor: [
      'Top Competition Team members invited to step up',
      'Deep-breaking state and national-circuit competitors',
      'Students targeting NSDA Nationals and national-team selection',
    ],
    pathwayStep: 3,
    coachSlugs: ['ricky-huang', 'perry-beckett', 'matt-mauriello'],
    prerequisites:
      'Invitation only. Coaches invite students on the strength of their competitive results and their progress in the Competition Team. The way in is to train with us and compete.',
    sessionFlow: [
      { time: '0:00', title: 'Benchmark review', detail: 'The squad watches back a break-round clip or a top international final and takes the standard apart: what actually won the room.' },
      { time: '0:20', title: 'Deep motion work', detail: 'A hard prepared motion at national-final depth: second-line arguments, the comparative, and the responses strong teams will bring.' },
      { time: '0:55', title: 'Impromptu under the clock', detail: 'A full one-hour prep run as a drill, so the method holds up when the motion is unseen and the opposition is good.' },
      { time: '1:20', title: 'Elimination-round craft', detail: 'Panel adaptation, strategic concessions, and how to win the adjudication discussion when the debate is close.' },
      { time: '1:45', title: 'Individual review', detail: 'One-on-one notes on each debater’s last round and the specific edge to sharpen before the next.' },
    ],
    included: [
      'Two live squad classes every week, capped tight so the room stays sharp and everyone speaks',
      'A judged practice debate every week against the strongest opposition in the program',
      'Prepared and impromptu prep at a national-final standard, on the toughest motions',
      'Individual strategy reviews from coaches with national-team experience',
      'Elimination-round and adjudication coaching tuned to NSDA Nationals and the international standard',
    ],
    faqs: [
      {
        question: 'How do students get into the National Team Sprint?',
        answer:
          'By invitation. Coaches invite students from the Competition Team on the strength of their competitive results and their progress in the squad. The way in is to train with us and compete; there is no application to buy your way in.',
      },
      {
        question: 'Is the Sprint the same as making USA Debate?',
        answer:
          'No. The Sprint is our own advanced squad. It prepares students for the top of the US circuit, NSDA Nationals, and national-team selection, but selection to USA Debate is run by the National Speech & Debate Association, not by us.',
      },
      {
        question: 'What is the time commitment?',
        answer:
          'Two classes plus a judged practice debate every week, on top of tournament travel and the prep students do on their own. It is the heaviest program we run, and it is built for students who want that.',
      },
      {
        question: 'Can we pay to join?',
        answer:
          'No. The Sprint is invitation-only and is not sold through checkout. Places come by coach invitation, based on how a student is competing and progressing.',
      },
      {
        question: 'What if my child is not invited yet?',
        answer:
          'Train in the Competition Team and compete; that is where invitations come from. Ask a coach and we will tell you honestly what the next step looks like.',
      },
    ],
  },
  {
    id: 'private-coaching',
    slug: 'private-coaching',
    name: '1-on-1 Coaching',
    shortName: '1-on-1 Coaching',
    tagline: 'Private World Schools coaching, scheduled around you',
    description:
      'Private sessions with a World Schools specialist: speech redos, round reviews, impromptu drills, or application prep, depending on what the student needs.',
    longDescription:
      'One-on-one coaching pairs a student with a World Schools specialist for fully personalized training. Sessions adapt to exactly what the student needs: rebuilding a speaker role, reviewing tournament recordings round by round, running impromptu prep drills, or preparing a USA Debate application. Scheduling is flexible across US time zones.',
    metaTitle: 'Private World Schools Debate Coaching: 1-on-1 Online Sessions',
    metaDescription:
      'Work 1-on-1 with a private World Schools Debate coach online. Diagnostic session $80, hourly coaching at $120, and 10- or 20-hour packages. Flexible US scheduling.',
    seoH1: 'Private 1-on-1 World Schools Debate Coaching',
    level: 'All Levels',
    ageRange: { min: 11, max: 18 },
    format: 'Private online',
    schedule: 'Flexible scheduling · 60-minute sessions',
    image: '/images/tournament-awards.jpg',
    imageAlt: 'Two students holding tournament award plaques',
    // Displayed "from" price (the hourly rate). Real checkout prices are the
    // `oneOnOne` variants below, always re-resolved server-side.
    pricing: { amount: 120, compareAt: 160, currency: 'USD', model: 'per hour' },
    // Fallback unit only; 1-on-1 lines carry their own variant label + amount.
    enrollment: { unitLabel: 'Hourly 1-on-1 coaching', amount: 120 },
    earlyBird: { deadlineLabel: '' },
    sessionLength: '60 minutes',
    oneOnOne: {
      diagnostic: { id: 'diagnostic', label: 'Diagnostic session (60 min)', amount: 80 },
      hourly: { id: 'hourly', label: 'Hourly coaching (60 min)', rate: 120, minHours: 1, maxHours: 9 },
      packages: [
        { id: 'pack-10', label: '10-hour package', hours: 10, amount: 1000 },
        { id: 'pack-20', label: '20-hour package', hours: 20, amount: 1700 },
      ],
      validityNote: 'Hours are valid for one year from the date of purchase.',
    },
    outcomes: [
      'A personalized development plan after a diagnostic first session',
      'Round-by-round review of tournament recordings',
      'Targeted drills for your weakest scoring category (Style, Content, or Strategy)',
      'Flexible support for school tryouts, state series, or national applications',
    ],
    curriculum: [
      { title: 'Diagnostic', detail: 'A first session that maps strengths and gaps against the 40/40/20 criteria' },
      { title: 'Custom plan', detail: 'A session-by-session plan built around the student’s competition calendar' },
      { title: 'Film review', detail: 'Detailed breakdowns of the student’s recorded rounds' },
      { title: 'On-demand prep', detail: 'Surge sessions before tryouts, state, Nationals, or application deadlines' },
    ],
    idealFor: [
      'Students who want to improve fast between seasons',
      'Competitors with a specific tournament or application deadline',
      'Students whose schedules don’t fit weekly group classes',
    ],
    pathwayStep: 4,
    coachSlugs: [
      'ricky-huang',
      'cailyn-min',
      'biser-angelov',
      'tin-puljic',
      'netra-easwaran',
      'matt-mauriello',
      'perry-beckett',
      'zach-fleeser',
      'mac-hays',
      'shaurya-chandranvanshi',
    ],
    prerequisites:
      'None. 1-on-1 works at any level, from a first speech to national-circuit prep. The first session is a diagnostic, so the coach meets the student exactly where they are.',
    included: [
      'A diagnostic first session that maps the student against the Style / Content / Strategy criteria',
      'A coach matched to the student’s goal, drawn from the full roster',
      'Flexible scheduling across US time zones, evenings and weekends included',
      'Round-by-round film review of the student’s own recordings when they have them',
      'Hours valid for a full year, so you can spread them across a season',
    ],
    faqs: [
      {
        question: 'How does buying hours work?',
        answer:
          'Start with a one-time diagnostic session at $80 so a coach can map the student’s level, then buy hours as you need them: $120 an hour for one to nine hours, or a 10-hour package for $1,000 or a 20-hour package for $1,700. All hours are valid for a full year from purchase.',
      },
      {
        question: 'Which coach will my child work with?',
        answer:
          'Any coach on our roster is available for 1-on-1. After you book, we match the student to a coach based on their goal, whether that is a first speech, tournament prep, or a USA Debate application. Tell us if you have a preference and we will do our best to honor it.',
      },
      {
        question: 'Do the hours expire?',
        answer:
          'Hours are valid for one year from the date of purchase, so you can use them steadily through a season or save them for a push before a specific tournament or deadline.',
      },
      {
        question: 'How is a session scheduled?',
        answer:
          'Scheduling is flexible across US time zones, including evenings and weekends. After purchase, a coach reaches out to set the first session at a time that works for the student.',
      },
    ],
  },
  {
    id: 'summer-bootcamp',
    slug: 'summer-bootcamp',
    name: 'World Schools Summer Bootcamp',
    shortName: 'Summer Bootcamp',
    tagline: 'A three-week intro to World Schools debate, built for total beginners',
    description:
      'A 12-hour intensive for students brand new to World Schools debate: the format, your first real arguments, rebuttal, points of information, and a friendly practice debate. Cohorts run June, July, and August; only the August cohort still has open enrollment.',
    metaDescription:
      'A 12-hour online World Schools debate summer camp for complete beginners. The August cohort (Aug 3–21) is the last of the summer and is enrolling now.',
    metaTitle: 'World Schools Debate Summer Camp Online: 3-Week Beginner Bootcamp',
    seoH1: 'World Schools Debate Summer Bootcamp',
    longDescription:
      'The Summer Bootcamp is the easiest way to try World Schools debate before the fall season starts. It runs as monthly cohorts in June, July, and August. Enrollment for the June and July cohorts has closed, so the August cohort (August 3–21) is the last of the summer. Students meet twice a week for a two-hour class over three weeks (twelve hours in all) and go from never having debated to giving a real speech in a judged practice round. It is built for complete beginners, and it sets up a running start for the fall Foundation class.',
    level: 'Beginner',
    ageRange: { min: 9, max: 16 },
    format: 'Small-group online',
    schedule: 'Two time options · twice weekly · 6 sessions · August 3–21',
    image: '/images/student-speech-competition.jpg',
    imageAlt: 'A student delivering a speech to a full room',
    pricing: { amount: 328, compareAt: 410, currency: 'USD', model: 'for the 12-hour bootcamp ($27 an hour)' },
    enrollment: { unitLabel: 'August bootcamp (6 sessions, 12 hours)', amount: 328 },
    earlyBird: { deadlineLabel: 'August 1' },
    classSize: '6–8 students',
    sessionLength: '2 hours',
    instruction: { totalHours: 12, sessions: 6 },
    hourlyRate: 27,
    ageGroups: [
      { id: '9-12', label: 'Ages 9–12', min: 9, max: 12 },
      { id: '13-16', label: 'Ages 13–16', min: 13, max: 16 },
    ],
    seasonal: true,
    termDates: { start: '2026-08-03', end: '2026-08-21' },
    term: {
      label: 'Summer 2026 · Final cohort',
      start: 'August 3–21, 2026 · the last bootcamp of the summer (June and July have closed)',
      earlyBird: 'Enroll before August 1 for the early-bird rate',
    },
    bootcamp: {
      dateRange: 'August 3–21, 2026',
      sessionCount: 6,
      totalHours: 12,
      cohorts: [
        { label: 'June cohort', status: 'closed' },
        { label: 'July cohort', status: 'closed' },
        { label: 'August cohort · Aug 3–21', status: 'enrolling' },
      ],
      options: [
        {
          id: 'a',
          label: 'Option A · Mondays & Thursdays, 1–3 PM ET',
          meetings: [
            { day: 'Mondays', dayOfWeek: 1, start: '13:00', end: '15:00' },
            { day: 'Thursdays', dayOfWeek: 4, start: '13:00', end: '15:00' },
          ],
        },
        {
          id: 'b',
          label: 'Option B · Tuesdays & Fridays, 10 AM–12 PM ET',
          meetings: [
            { day: 'Tuesdays', dayOfWeek: 2, start: '10:00', end: '12:00' },
            { day: 'Fridays', dayOfWeek: 5, start: '10:00', end: '12:00' },
          ],
        },
      ],
    },
    outcomes: [
      'Understand how a World Schools round is structured and what each speaker does',
      'Build and deliver a simple, complete argument (claim, warrant, impact)',
      'Offer and answer points of information without freezing',
      'Debate in a friendly judged practice round by the final session',
      'Leave ready to start the fall Foundation class with a head start',
    ],
    curriculum: [
      { title: 'Session 1 · The format', detail: 'How a World Schools round runs, the speaker roles, and how Style / Content / Strategy judging works' },
      { title: 'Session 2 · Building arguments', detail: 'Turning an opinion into a real argument: claim, warrant, and impact, with your first practice speech' },
      { title: 'Session 3 · Rebuttal', detail: 'Listening to the other side, finding the weak point in an argument, and answering it out loud' },
      { title: 'Session 4 · Points of information', detail: 'Offering and answering POIs without freezing, plus keeping your speech on track under interruption' },
      { title: 'Session 5 · Teamwork and case building', detail: 'Working as a three-speaker bench and building a full case together for the final debate' },
      { title: 'Session 6 · Your first debate', detail: 'A full judged practice round with individual written feedback and a fall placement note' },
    ],
    idealFor: [
      'Students who have never tried World Schools (or debate at all)',
      'Families who want to try it before committing to the fall term',
      'Summer-break learners who like a short, focused challenge',
    ],
    coachSlugs: ['biser-angelov', 'netra-easwaran', 'matt-mauriello', 'tin-puljic', 'cailyn-min'],
    prerequisites:
      'None at all. The bootcamp is built for students who have never debated; a first speech is exactly what they will leave with.',
    nextStepSlug: 'foundations',
    sessionFlow: [
      { time: '0:00', title: 'Warm-up', detail: 'A short speaking or thinking game to get students talking before the pressure is on.' },
      { time: '0:15', title: 'Skill of the day', detail: 'One idea taught directly (a speaker role, an argument, or POIs) with clear examples.' },
      { time: '0:40', title: 'Guided practice', detail: 'Students try the skill in pairs or small groups while the coach circulates and corrects.' },
      { time: '1:15', title: 'Mini-debate', detail: 'A short round applying the day’s skill, so every session ends in real speaking.' },
      { time: '1:45', title: 'Feedback', detail: 'The coach debriefs and each student leaves with one thing to work on next time.' },
    ],
    included: [
      'Six live 2-hour classes over three weeks (12 hours in total, $27 an hour)',
      'A judged practice debate in the final session with written feedback',
      'The printable beginner resource pack: speaker cheat sheets and a first-motion set',
      'A placement note recommending the right fall-term class',
      'A small-group setting capped so every student speaks in every session',
    ],
    faqs: [
      {
        question: 'Does my child need any experience?',
        answer:
          'No. The bootcamp is for complete beginners, including students who have never done any debate. Everything starts from what a round looks like and what a first argument is.',
      },
      {
        question: 'When and how often does it meet?',
        answer:
          'Twice a week for three weeks in August, two hours per session, twelve hours in total. You choose one of two time options at checkout: Option A meets Mondays and Thursdays from 1 to 3 PM Eastern, and Option B meets Tuesdays and Fridays from 10 AM to 12 PM Eastern. Times show in your timezone on this page.',
      },
      {
        question: 'What happens after the bootcamp?',
        answer:
          'Students finish ready for the fall Foundation class, which begins September 1. We send a short placement note with each student’s recommended starting point, so the bootcamp flows straight into the season.',
      },
      {
        question: 'What does my child need to take part?',
        answer:
          'A computer or tablet with a camera and microphone, and a quiet space to speak. Classes are live and online. We provide all the materials, including the printable resource pack.',
      },
      {
        question: 'What if we miss a session?',
        answer:
          'It is a short program, so reach out and we will share notes and help the student catch up before the next class. Our full withdrawal and refund terms are on the Refund Policy page.',
      },
    ],
  },
];

// Allow-listed grade options for checkout student info. Shared by the cart UI
// and the payment-intent route's server-side validation.
export const GRADE_LEVELS = [
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Other',
] as const;

export function getProgramById(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getFeaturedPrograms(): Program[] {
  return programs.filter((p) => p.featured);
}

export function formatPrice(program: Program): string {
  if (program.invitationOnly) return 'By invitation';
  return `$${program.pricing.amount.toLocaleString('en-US')} ${program.pricing.model}`;
}

// Early-bird discount is a fixed marketing label, always shown regardless of
// date (owner directive: "don't make it smart"). Used for the "N% off" badge.
export const EARLY_BIRD_PERCENT = 25;

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export interface EnrollAgeOption { id: string; label: string }
export interface EnrollTimeOption { id: string; label: string; ageId?: string }

/**
 * Age band + time slot a buyer must pick at checkout, or null if the program
 * has no selectable options (e.g. 1-on-1). Group programs derive them from
 * `tracks` (time slots are tied to a band via `ageId`); the bootcamp derives
 * ages from `ageGroups` and times from `bootcamp.options` (independent).
 * The payment-intent route re-runs this to validate the client's choice.
 */
export function getEnrollmentOptions(
  program: Program,
): { ages: EnrollAgeOption[]; times: EnrollTimeOption[] } | null {
  if (program.tracks && program.tracks.length > 0) {
    const ages = program.tracks.map((t) => ({
      id: t.band,
      label: `Ages ${t.ageRange.min}–${t.ageRange.max} (${t.band})`,
    }));
    const times = program.tracks.flatMap((t) =>
      t.options.map((o) => ({
        id: `${t.band}:${o.id}`,
        ageId: t.band,
        label: `${o.day} ${to12h(o.start)}–${to12h(o.end)} ET`,
      })),
    );
    return { ages, times };
  }
  if (program.bootcamp && program.ageGroups && program.ageGroups.length > 0) {
    const ages = program.ageGroups.map((g) => ({ id: g.id, label: g.label }));
    const times = program.bootcamp.options.map((o) => ({ id: o.id, label: o.label }));
    return { ages, times };
  }
  return null;
}

/**
 * Human display of the age bands for a program: "9–12 · 13–16" for programs
 * with selectable groups, else the plain min–max range. Used on cards / facts
 * so we show the actual groups instead of a flat span.
 */
export function getAgeGroupsDisplay(program: Program): string {
  if (program.tracks && program.tracks.length > 0) {
    return program.tracks.map((t) => `${t.ageRange.min}–${t.ageRange.max}`).join(' · ');
  }
  if (program.ageGroups && program.ageGroups.length > 0) {
    return program.ageGroups.map((g) => `${g.min}–${g.max}`).join(' · ');
  }
  return `${program.ageRange.min}–${program.ageRange.max}`;
}

export function labelForEnrollmentIds(
  program: Program,
  ageId: string,
  timeId: string,
): { ageLabel: string; timeLabel: string } | null {
  const opts = getEnrollmentOptions(program);
  if (!opts) return null;
  const age = opts.ages.find((a) => a.id === ageId);
  const time = opts.times.find((t) => t.id === timeId);
  if (!age || !time) return null;
  // For track programs, the chosen slot must belong to the chosen age band.
  if (time.ageId && time.ageId !== ageId) return null;
  return { ageLabel: age.label, timeLabel: time.label };
}

export interface ResolvedOneOnOne { amount: number; unitLabel: string; hours: number }

/**
 * Resolve a 1-on-1 variant to a price + label, or null if invalid. This is the
 * server-side source of truth for 1-on-1 amounts — the checkout never trusts a
 * client-sent price. `quantity` is the hour count for the hourly variant.
 */
export function resolveOneOnOne(
  program: Program,
  variantId: string,
  quantity?: number,
): ResolvedOneOnOne | null {
  const oo = program.oneOnOne;
  if (!oo) return null;
  if (variantId === oo.diagnostic.id) {
    return { amount: oo.diagnostic.amount, unitLabel: oo.diagnostic.label, hours: 1 };
  }
  if (variantId === oo.hourly.id) {
    const q = Number(quantity);
    if (!Number.isInteger(q) || q < oo.hourly.minHours || q > oo.hourly.maxHours) return null;
    return {
      amount: oo.hourly.rate * q,
      unitLabel: `${q} hour${q > 1 ? 's' : ''} of 1-on-1 coaching`,
      hours: q,
    };
  }
  const pack = oo.packages.find((p) => p.id === variantId);
  if (pack) return { amount: pack.amount, unitLabel: pack.label, hours: pack.hours };
  return null;
}
