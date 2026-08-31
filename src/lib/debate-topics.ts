// Curated lists for /debate-topics. Every entry is a verbatim motion from the
// bank, referenced by stable id (same convention as FIRST_DEBATE_IDS in
// motion-bank.ts) — re-check these ids after any bank rebuild.
import { motionsByIds, type Motion } from '@/lib/motion-bank';

export interface TopicList {
  slug: string;
  /** Question-form H2. */
  heading: string;
  /** Hand-written coaching note. Human copy, part of the E-E-A-T edge. */
  note: string;
  seeAllHref: string;
  seeAllLabel: string;
  motions: Motion[];
}

const FUN_IDS = [1417, 259, 1832, 625, 2557, 5719, 1179, 2244, 4874, 2737, 5813, 3864];
const MIDDLE_SCHOOL_IDS = [328, 1106, 51, 238, 968, 809, 1029, 119, 857, 973, 974, 145];
const HIGH_SCHOOL_IDS = [4529, 4581, 4621, 4688, 4715, 4719, 4787, 5042, 5099, 5106, 5139, 4698, 4782];
const CONTROVERSIAL_IDS = [4930, 4924, 5097, 5401, 5419, 5424, 5449, 5507, 5532, 5550, 4832, 5111];
const IMPROMPTU_IDS = [5166, 5128, 5771, 5767, 5679, 5866, 5816, 5822, 5284, 5727, 5694, 5717];

export const topicLists: TopicList[] = [
  {
    slug: 'fun',
    heading: 'What are some fun debate topics for beginners?',
    note:
      'A first topic should be arguable at the dinner table with no research. Superheroes, Santa Claus, and participation trophies sound silly, but each of these hides a real clash about honesty, safety, or fairness, and every one was set at a real tournament.',
    seeAllHref: '/motions/arts-and-culture',
    seeAllLabel: 'More culture and everyday-life motions',
    motions: motionsByIds(FUN_IDS),
  },
  {
    slug: 'middle-school',
    heading: 'What are good debate topics for middle school?',
    note:
      'Middle schoolers argue best about worlds they live in: school, sports, family rules. These motions stay concrete (a thing is banned, funded, or required) so the debate is about consequences rather than definitions.',
    seeAllHref: '/motions/education',
    seeAllLabel: 'The full education motion archive',
    motions: motionsByIds(MIDDLE_SCHOOL_IDS),
  },
  {
    slug: 'high-school',
    heading: 'What are strong debate topics for high school students?',
    note:
      'High school rounds can carry real policy machinery: taxes, elections, technology regulation. Each of these motions has enough moving parts for an eight-minute case and enough clash for a full round of rebuttal.',
    seeAllHref: '/motions/politics',
    seeAllLabel: 'Browse politics and policy motions',
    motions: motionsByIds(HIGH_SCHOOL_IDS),
  },
  {
    slug: 'controversial',
    heading: 'What are controversial debate topics for advanced rounds?',
    note:
      'Controversial does not mean edgy for its own sake. These motions force a side you might personally reject, which is the skill: steelmanning a position, arguing it well, and weighing harms honestly. Best for experienced teams with a coach in the room.',
    seeAllHref: '/motions/criminal-justice',
    seeAllLabel: 'More justice and ethics motions',
    motions: motionsByIds(CONTROVERSIAL_IDS),
  },
  {
    slug: 'impromptu',
    heading: 'What are good impromptu debate topics?',
    note:
      'Impromptu motions reward structure over research: values, narratives, and "this house regrets" framings you can build a case on in one hour with no internet. Rotate these into practice so a regret motion at a tournament is never a first.',
    seeAllHref: '/motions?wsdc=1#explorer',
    seeAllLabel: 'What Worlds teams drew from the envelope',
    motions: motionsByIds(IMPROMPTU_IDS),
  },
];

export const curatedTopicCount = topicLists.reduce((n, l) => n + l.motions.length, 0);
