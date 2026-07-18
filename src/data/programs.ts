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
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  ageRange: { min: number; max: number };
  format: 'Small-group online' | 'Private online';
  schedule: string;
  image: string; // path under /public
  imageAlt: string;
  pricing: {
    amount: number;
    currency: 'USD';
    model: string; // e.g. "per term"
  };
  /**
   * What one checkout purchase buys. Drives the cart, /checkout, and the
   * payment-intent route (prices are always re-resolved from here server-side).
   * Amounts are launch placeholders pending owner sign-off — see CLAUDE.md.
   * Ignored for invitation-only programs (not purchasable).
   */
  enrollment: {
    unitLabel: string; // e.g. "One term (Term 1, 2026/27)"
    amount: number; // USD
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
   * date range, meeting at the same time on each listed day. `meetings` are all required
   * (not either/or options) and use the same ET anchor as tracks; rendered timezone-aware
   * by BootcampSchedule.
   */
  bootcamp?: {
    dateRange: string; // "August 18–27, 2026"
    sessionCount: number;
    totalHours: number;
    meetings: { day: string; dayOfWeek: number; start: string; end: string }[];
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
  start: 'Classes begin September 4, 2026',
  earlyBird: 'Enroll before August 15 for the early-bird rate',
};

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
    level: 'Beginner',
    ageRange: { min: 11, max: 18 },
    format: 'Small-group online',
    schedule: 'Weekly 2-hour class + monthly practice debate',
    image: '/images/student-debating.jpg',
    imageAlt: 'A student delivering a practice speech in class',
    pricing: { amount: 549, currency: 'USD', model: 'per term' },
    enrollment: { unitLabel: 'One term (Term 1, 2026/27)', amount: 549 },
    term: TERM_1,
    tracks: [
      {
        band: 'Junior',
        label: 'Junior World Schools',
        ageRange: { min: 11, max: 14 },
        cadence: 'One 2-hour class per week + one practice debate per month',
        options: [
          { id: 'a', day: 'Saturdays', dayOfWeek: 6, start: '13:00', end: '15:00' },
          { id: 'b', day: 'Sundays', dayOfWeek: 0, start: '07:00', end: '09:00' },
        ],
      },
      {
        band: 'Senior',
        label: 'Senior World Schools',
        ageRange: { min: 14, max: 18 },
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
    coachSlugs: ['ricky-huang', 'netra-easwaran', 'mac-hays'],
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
          'Same curriculum, grouped by age so students train with peers at their own stage. Junior is built for younger students (roughly ages 11–14) and Senior for high schoolers (roughly ages 14–18). If you are unsure which fits, a free consultation ends with a placement recommendation.',
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
    level: 'Intermediate',
    ageRange: { min: 11, max: 18 },
    format: 'Small-group online',
    schedule: 'Weekly 2-hour class + weekly practice debate',
    image: '/images/team-prep-session.jpg',
    imageAlt: 'A debate team preparing cases together before rounds',
    pricing: { amount: 749, currency: 'USD', model: 'per term' },
    enrollment: { unitLabel: 'One term (Term 1, 2026/27)', amount: 749 },
    term: TERM_1,
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
        ageRange: { min: 14, max: 18 },
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
    coachSlugs: ['ricky-huang', 'biser-angelov', 'zach-fleeser'],
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
    tagline: 'Invitation-only training for the top of the American pathway',
    description:
      'An invitation-only squad for our most advanced competitors: two classes a week plus a weekly practice debate, built around national-circuit breaks, NSDA Nationals, and national-team selection.',
    longDescription:
      'The National Team Sprint is the top rung of the pathway, and it is invitation-only. It brings together our most advanced competitors for two classes a week plus a weekly practice debate, training against international-style benchmarks. The focus is elimination-round strategy, prepared and impromptu cases to a national-final standard, and the specific demands of NSDA Nationals and national-team selection. Coaches invite students on the strength of their competitive results and progress in the Competition Team.',
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
    level: 'All Levels',
    ageRange: { min: 11, max: 18 },
    format: 'Private online',
    schedule: 'Flexible scheduling · 60-minute sessions',
    image: '/images/tournament-awards.jpg',
    imageAlt: 'Two students holding tournament award plaques',
    pricing: { amount: 109, currency: 'USD', model: 'per hour' },
    // Hourly billing doesn't fit fixed-price checkout; sold as a 5-session pack (5 × $109).
    enrollment: { unitLabel: 'Five-session pack (5 × 60 min)', amount: 545 },
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
  },
  {
    id: 'summer-bootcamp',
    slug: 'summer-bootcamp',
    name: 'World Schools Summer Bootcamp',
    shortName: 'Summer Bootcamp',
    tagline: 'A three-week intro to World Schools debate, built for total beginners',
    description:
      'A 12-hour intensive for students brand new to World Schools debate: the format, your first real arguments, rebuttal, points of information, and a friendly practice debate. Cohorts run June, July, and August; only the August cohort still has open enrollment.',
    longDescription:
      'The Summer Bootcamp is the easiest way to try World Schools debate before the fall season starts. It runs as monthly cohorts in June, July, and August. Enrollment for the June and July cohorts has closed, so the August cohort (August 3–21) is the last of the summer. Students meet twice a week for a two-hour class over three weeks (twelve hours in all) and go from never having debated to giving a real speech in a judged practice round. It is built for complete beginners, and it sets up a running start for the fall Foundation class.',
    level: 'Beginner',
    ageRange: { min: 11, max: 16 },
    format: 'Small-group online',
    schedule: 'Twice weekly (Mon & Fri) · 6 sessions · August 3–21',
    image: '/images/student-speech-competition.jpg',
    imageAlt: 'A student delivering a speech to a full room',
    pricing: { amount: 328, currency: 'USD', model: 'for the 12-hour bootcamp ($27 an hour)' },
    enrollment: { unitLabel: 'August bootcamp (6 sessions, 12 hours)', amount: 328 },
    seasonal: true,
    term: {
      label: 'Summer 2026 · Final cohort',
      start: 'August 3–21, 2026 · the last bootcamp of the summer (June and July have closed)',
      earlyBird: 'Enroll before July 27 for the early-bird rate',
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
      meetings: [
        { day: 'Mondays', dayOfWeek: 1, start: '13:00', end: '15:00' },
        { day: 'Fridays', dayOfWeek: 5, start: '13:00', end: '15:00' },
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
      { title: 'Session 1 · Mon, Aug 3 · The format', detail: 'How a World Schools round runs, the speaker roles, and how Style / Content / Strategy judging works' },
      { title: 'Session 2 · Fri, Aug 7 · Building arguments', detail: 'Turning an opinion into a real argument: claim, warrant, and impact, with your first practice speech' },
      { title: 'Session 3 · Mon, Aug 10 · Rebuttal', detail: 'Listening to the other side, finding the weak point in an argument, and answering it out loud' },
      { title: 'Session 4 · Fri, Aug 14 · Points of information', detail: 'Offering and answering POIs without freezing, plus keeping your speech on track under interruption' },
      { title: 'Session 5 · Mon, Aug 17 · Teamwork and case building', detail: 'Working as a three-speaker bench and building a full case together for the final debate' },
      { title: 'Session 6 · Fri, Aug 21 · Your first debate', detail: 'A full judged practice round with individual written feedback and a fall placement note' },
    ],
    idealFor: [
      'Students who have never tried World Schools (or debate at all)',
      'Families who want to try it before committing to the fall term',
      'Summer-break learners who like a short, focused challenge',
    ],
    coachSlugs: ['ricky-huang', 'netra-easwaran', 'mac-hays'],
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
          'Twice a week (Mondays and Fridays) for three weeks in August, two hours per session, twelve hours in total. The August cohort runs August 3–21, 2026, and times show in your timezone on this page.',
      },
      {
        question: 'What happens after the bootcamp?',
        answer:
          'Students finish ready for the fall Foundation class, which begins September 4. We send a short placement note with each student’s recommended starting point, so the bootcamp flows straight into the season.',
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
