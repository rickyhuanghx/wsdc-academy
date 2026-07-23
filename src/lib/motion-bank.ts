// The motion bank: 12,000+ real tournament motions compiled from public
// records (tab sites, the official WSDC motion archive, and the MIT-licensed
// hello-motions dataset). Data is generated offline into
// src/data/motion-bank.json (server pages) and public/motion-bank-core.json +
// public/motion-bank-infoslides.json (client explorer). Regenerate with the
// build script rather than editing the JSON by hand.
import bankData from '@/data/motion-bank.json';

export interface Motion {
  /** Stable numeric id, shared with the client-side JSON files. */
  id: number;
  /** Motion text, verbatim from the source record. */
  m: string;
  /** Year the motion was set, when the source recorded a date. */
  y: number | null;
  /** Tournament name. */
  t: string;
  /** Round label ("Round 3", "Grand Final", ...). */
  r: string;
  /** Circuit / region label. */
  c: string;
  /** Topic slugs (see motionTopics). */
  top: string[];
  /** Motion family: policy | value | actor | regret | other. */
  ty: string;
  /** Info slide text, when the tournament released one. */
  i?: string;
  /** 1 = set at the World Schools Debating Championships. */
  w?: number;
  /** 1 = flagged international-level in the source data. */
  intl?: number;
}

export const motions: Motion[] = (bankData as { motions: Motion[] }).motions;

export interface MotionTopic {
  slug: string;
  label: string;
  /** One-line card description. */
  blurb: string;
  /** Topic-page introduction, unique per topic. */
  intro: string;
  /** Coaching note: where these debates are usually won. */
  prepTip: string;
}

export const motionTopics: MotionTopic[] = [
  {
    slug: 'international-relations',
    label: 'International Relations',
    blurb: 'Sanctions, sovereignty, alliances, intervention, and what states owe each other.',
    intro:
      'International relations is the largest topic area in the bank, and the one most likely to appear at Worlds-level rounds. These motions ask when states may interfere with each other, what international institutions are for, and whether small states should hedge, align, or resist.',
    prepTip:
      'IR rounds are usually won on actor incentives, not ideals. Before writing arguments, agree as a team on what each state in the motion actually wants, what it fears, and what it can credibly threaten. A caseline built on those three answers survives rebuttal.',
  },
  {
    slug: 'social-movements',
    label: 'Social Movements & Protest',
    blurb: 'Movement strategy, radical flanks, respectability politics, and who speaks for whom.',
    intro:
      'These motions put you inside a movement: civil rights, climate activism, labor, indigenous rights. The question is rarely whether the cause is just. It is whether a given tactic, message, or alliance helps the movement win.',
    prepTip:
      'Define success for the movement before you argue tactics. Radical action and moderate respectability both "work" for different goals, so the team that sets the metric (membership, legislation, public sympathy, long-run norms) controls the debate.',
  },
  {
    slug: 'feminism',
    label: 'Feminism & Gender',
    blurb: 'Movement strategy, representation, work, family, and the politics of gender.',
    intro:
      'Feminism motions are a fixture of the modern circuit, and many of the hardest ones are actor motions set from inside the movement itself. Expect debates about strategy (mirroring, separatism, alliance with markets or the state) as much as debates about policy.',
    prepTip:
      'The recurring clash is individual choice against structural effect. Strong teams concede that individuals choose freely, then argue about what those choices add up to, or the reverse. Decide early which level your case lives on and keep every argument there.',
  },
  {
    slug: 'war-and-security',
    label: 'War, Security & Terrorism',
    blurb: 'Military intervention, drones, deterrence, insurgency, and wartime ethics.',
    intro:
      'Security motions range from grand strategy (nuclear deterrence, alliances, pre-emptive strikes) to the ethics of individual actors: the soldier, the whistleblower, the occupied civilian. They reward teams who can talk about both power and principle in the same speech.',
    prepTip:
      'Almost every security debate contains a hidden comparative: war against the alternative to war. Make the counterfactual explicit. The side that describes the world without the intervention, honestly and in detail, usually wins the strategy score.',
  },
  {
    slug: 'politics',
    label: 'Politics & Democracy',
    blurb: 'Elections, institutions, populism, rights, and how democracies defend themselves.',
    intro:
      'These motions test whether you understand how democratic institutions actually work: voting systems, courts, parties, referendums, term limits, and the awkward tools democracies reach for when they feel threatened.',
    prepTip:
      'Ground arguments in incentives, not civics-class ideals. Who gains power under the proposal, what do they do with it, and how do voters respond two elections later? Judges reward teams who model second-round effects.',
  },
  {
    slug: 'economics',
    label: 'Economics & Development',
    blurb: 'Markets, tax, trade, labor, development policy, and who bears the cost.',
    intro:
      'Economics motions cover everything from universal basic income to resource nationalization to the gig economy. Development variants add the hardest constraint in debating: policies that work in rich states often behave differently in poor ones.',
    prepTip:
      'Trace the money. For any economic motion, work out who pays, who collects, and how behavior changes at the margin. Then weigh: efficiency claims win rounds only when tied to real people the judge can picture.',
  },
  {
    slug: 'criminal-justice',
    label: 'Criminal Justice',
    blurb: 'Punishment, policing, prisons, courts, and the limits of state power.',
    intro:
      'Criminal justice motions ask what punishment is for. Retribution, deterrence, rehabilitation, and incapacitation pull in different directions, and nearly every motion in this area (jury trials, sentencing, police powers, the death penalty) turns on which purpose you privilege.',
    prepTip:
      'Open your case by stating the purpose of punishment your side defends and why. It sounds basic, but the team that frames the criminal justice system’s job usually gets to decide what counts as the system failing.',
  },
  {
    slug: 'medical-ethics',
    label: 'Medical Ethics & Health',
    blurb: 'Autonomy, consent, public health, scarce organs, and end-of-life choices.',
    intro:
      'From euthanasia to vaccine mandates to organ markets, these motions stage the oldest clash in ethics: individual autonomy against collective welfare, played out on the human body. They are common at every level from novice rounds to Worlds finals.',
    prepTip:
      'Precision on consent does the heavy lifting. Who can consent, under what pressure, with what information? Teams that build a clear consent standard, then test the motion against it, sound like doctors instead of philosophers.',
  },
  {
    slug: 'ethics-and-philosophy',
    label: 'Ethics & Philosophy',
    blurb: 'Moral dilemmas, obligations, hypotheticals, and first-principles debates.',
    intro:
      'The purest debates in the bank: no policy mechanism to hide behind, just competing accounts of what people owe each other. Expect trolley-problem structures, obligations to strangers, and motions that put a price on principles.',
    prepTip:
      'Abstract motions still need concrete stakes. Give the judge two or three vivid test cases early and return to them all speech. The team whose examples the judge remembers is the team whose framework the judge adopts.',
  },
  {
    slug: 'education',
    label: 'Education',
    blurb: 'Schools, universities, testing, streaming, and what education is for.',
    intro:
      'Education motions feel deceptively familiar because every debater is a student. The good ones force a choice between goals we pretend are compatible: excellence and equity, autonomy and formation, credentials and learning.',
    prepTip:
      'Beware arguing from your own school. Judges hear anecdotes as assertions. Instead, argue about incentives on teachers, parents, and institutions, and use the student experience only as illustration.',
  },
  {
    slug: 'media-and-technology',
    label: 'Media & Technology',
    blurb: 'Platforms, algorithms, AI, journalism, privacy, and the attention economy.',
    intro:
      'The fastest-growing topic area on the circuit. Social media regulation, AI, surveillance, and the collapse of legacy journalism now appear at nearly every tournament, and the motions age quickly, which is exactly why judges reward teams with current examples.',
    prepTip:
      'Name the mechanism, not the vibe. "Algorithms radicalize" loses to a team that explains recommendation loops, engagement metrics, and advertiser incentives step by step. Specificity reads as expertise under the content score.',
  },
  {
    slug: 'religion',
    label: 'Religion',
    blurb: 'Faith, secularism, religious institutions, and belief in public life.',
    intro:
      'Religion motions ask where belief belongs in public life: state secularism, religious schooling, the internal politics of churches and faiths. They demand unusual empathy, since you will often defend a worldview nobody on the team holds.',
    prepTip:
      'Model the believer charitably. Rounds are lost when a team treats religion as merely irrational; judges notice. Argue about institutions, incentives, and community effects, and grant the sincerity of faith on both sides.',
  },
  {
    slug: 'arts-and-culture',
    label: 'Arts & Culture',
    blurb: 'Art, museums, celebrity, heritage, and the politics of culture.',
    intro:
      'Culture motions cover repatriating artifacts, funding the arts, celebrity activism, and the ethics of consuming art made by bad people. They tend to be broader than they look: underneath is usually a debate about identity and who owns a story.',
    prepTip:
      'Find the stakeholder the motion hides. Culture debates sound abstract until you center a specific community: the source nation, the artist, the diaspora audience. Weighing follows naturally once you pick whose loss matters most.',
  },
  {
    slug: 'environment',
    label: 'Environment & Climate',
    blurb: 'Climate policy, conservation, nuclear power, and growth against green.',
    intro:
      'Environment motions set the defining trade-offs of the next decades: growth against emissions, adaptation against mitigation, and whether the tools of capitalism can fix what they broke. Actor variants (small island states, the environmental movement) are increasingly common.',
    prepTip:
      'Timescale is the weighing tool. Costs of climate policy are near-term and concentrated; benefits are long-term and diffuse. The team that argues explicitly about discounting the future, in plain language, controls the endgame.',
  },
  {
    slug: 'sports',
    label: 'Sports',
    blurb: 'Doping, money, nationalism, and the governance of games.',
    intro:
      'Sports motions are accessible on the surface and technical underneath: doping rules, athlete pay, hosting boycotts, the ethics of fandom. They are popular for early rounds precisely because everyone has an opinion and few have a framework.',
    prepTip:
      'Decide what sport is for. Entertainment product, meritocratic contest, or community institution? Each answer flips several motions in this area, so claim one early and show why the alternatives fail.',
  },
  {
    slug: 'lgbt',
    label: 'LGBTQ+',
    blurb: 'Rights, representation, movement strategy, and queer politics.',
    intro:
      'These motions go beyond the legal-rights debates of past decades into harder questions of strategy and culture: assimilation against radicalism, representation in media, and how movements handle internal disagreement.',
    prepTip:
      'As with other movement debates, set the goal before the tactic. Also prepare the comparative across societies: what wins in a liberal democracy may backfire in a conservative one, and many motions specify the setting for exactly that reason.',
  },
  {
    slug: 'family-and-relationships',
    label: 'Family & Relationships',
    blurb: 'Parenting, marriage, childhood, and the private sphere as policy.',
    intro:
      'Family motions bring policy into the living room: parental licensing, children on social media, marriage norms, filial duties. They reward emotional intelligence, since the judge inevitably tests your case against their own family.',
    prepTip:
      'The recurring clash is the child’s interest against parental autonomy, with the state as clumsy referee. Teams that treat parents as fallible but well-meaning, rather than villains or saints, hold credibility on both sides.',
  },
];

export function getTopicMeta(slug: string): MotionTopic | undefined {
  return motionTopics.find((t) => t.slug === slug);
}

export function motionsForTopic(slug: string): Motion[] {
  return motions.filter((m) => m.top.includes(slug));
}

export function motionsForYear(year: number): Motion[] {
  return motions.filter((m) => m.y === year);
}

export const wsdcChampionshipMotions: Motion[] = motions.filter((m) => m.w === 1);

/** Years that get their own archive page (dense coverage only). */
export const motionYears: number[] = Array.from(
  new Set(motions.map((m) => m.y).filter((y): y is number => y !== null && y >= 2011)),
).sort((a, b) => b - a);

export const bankStats = {
  total: motions.length,
  tournaments: new Set(motions.filter((m) => m.t).map((m) => m.t)).size,
  infoslides: motions.filter((m) => m.i).length,
  firstYear: Math.min(...motions.map((m) => m.y ?? 9999)),
  lastYear: Math.max(...motions.map((m) => m.y ?? 0)),
  wsdc: wsdcChampionshipMotions.length,
};

/** "12,416" -> "12,400+" style rounded display. */
export function roundedCount(n: number, step = 100): string {
  return `${(Math.floor(n / step) * step).toLocaleString('en-US')}+`;
}

export const MOTION_TYPE_LABELS: Record<string, string> = {
  policy: 'Policy',
  value: 'Value',
  actor: 'Actor',
  regret: 'Regret',
  other: 'Open',
};
