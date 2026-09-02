import type { Metadata } from 'next';

export interface BlogPost {
  slug: string;
  title: string; // on-page H1
  metaTitle: string; // <title> — keyword-led
  /** Long form. Feeds the blog card and llms.txt, where detail is an asset. */
  description: string;
  /** SERP form, <=160 chars. Google truncates `description`, which runs long by design. */
  metaDescription: string;
  category: 'Why it matters' | 'Speaker roles' | 'Technique' | 'The US circuit' | 'International';
  date: string; // ISO
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'does-debate-help-college-admissions',
    title: 'What competitive debate does for university admissions',
    metaTitle: 'Does Debate Help With College Admissions?',
    description:
      'A data look at whether debate helps with college admissions: where the world’s best World Schools debaters go to university, how their base rate compares with the general applicant, and how much of the effect debate can honestly claim.',
    metaDescription:
      'Where the world’s best World Schools debaters actually go to university, how their base rate compares with the general applicant, and what debate can claim.',
    category: 'Why it matters',
    date: '2026-07-18',
  },
  {
    slug: 'first-speaker-world-schools-debate',
    title: 'The first speaker: building the house everyone lives in',
    metaTitle: 'First Speaker in World Schools Debate',
    description:
      'What the first speaker actually does in World Schools Debate: framing the motion, definitions, the split, the winning metric, and how to structure your two arguments so the whole case stands on them.',
    metaDescription:
      'What the first speaker does: framing the motion, definitions, the split, the winning metric, and how to structure two arguments the whole case stands on.',
    category: 'Speaker roles',
    date: '2026-07-09',
  },
  {
    slug: 'second-speaker-world-schools-debate',
    title: 'The second speaker: rebut, rebuild, extend',
    metaTitle: 'Second Speaker in World Schools Debate',
    description:
      'The deputy speech is where rounds are won or lost. How to rebut the best version of the opposing case, rebuild your own, and still land a fully developed new argument.',
    metaDescription:
      'The deputy speech is where rounds are won. How to rebut the best version of the opposing case, rebuild your own, and still land a developed new argument.',
    category: 'Speaker roles',
    date: '2026-07-09',
  },
  {
    slug: 'third-speaker-world-schools-debate',
    title: 'The third speaker: deciding the debate',
    metaTitle: 'Third Speaker (Whip) in World Schools Debate',
    description:
      'The whip speech explained: how to reorganize a messy round into two or three clashes, win each one, and weigh the debate shut without breaking the no-new-arguments rule.',
    metaDescription:
      'The whip speech explained: how to reorganize a messy round into two or three clashes, win each one, and weigh the debate shut without new arguments.',
    category: 'Speaker roles',
    date: '2026-07-09',
  },
  {
    slug: 'how-to-build-a-debate-argument',
    title: 'How to build an argument that survives contact',
    metaTitle: 'How to Build a Debate Argument That Holds',
    description:
      'The four-layer argument structure top World Schools teams use (tagline, mechanisms, impact, weighing), with a worked example carried from claim to comparison.',
    metaDescription:
      'The four-layer argument structure top World Schools teams use — tagline, mechanisms, impact, weighing — with a worked example from claim to comparison.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'debate-rebuttal-guide',
    title: 'Rebuttal: how to take an argument apart',
    metaTitle: 'How to Rebut in Debate: They Say / However',
    description:
      'A practical rebuttal guide for World Schools Debate: the four-step response structure, why you must answer the best version of an argument, and where to aim (premise, mechanism, impact, or weighing).',
    metaDescription:
      'The four-step response structure, why you must answer the best version of an argument, and where to aim: premise, mechanism, impact, or weighing.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'weighing-in-debate',
    title: 'Weighing: how close rounds actually get decided',
    metaTitle: 'Weighing in Debate: Internal vs External',
    description:
      'What weighing means in World Schools Debate: internal vs external weighing, setting a metric, the "our worst case beats their best case" move, and why weighing belongs in every speech, not just the whip.',
    metaDescription:
      'What weighing means in World Schools: internal vs external weighing, setting a metric, and why weighing belongs in every speech, not just the whip.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'reply-speech-world-schools-debate',
    title: 'The reply speech: a biased judge’s summary',
    metaTitle: 'The Reply Speech in World Schools Debate',
    description:
      'How to deliver the four-minute reply speech in World Schools Debate: who gives it, why the order flips, what belongs in a biased adjudication, and the mistakes that waste it.',
    metaDescription:
      'How to deliver the four-minute reply: who gives it, why the order flips, what belongs in a biased adjudication, and the mistakes that waste it.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'world-schools-case-files',
    title: 'Case files: the prep you do before prep',
    metaTitle: 'How to Build a World Schools Case File',
    description:
      'Printed materials are legal in the World Schools prep room. What a strong case file contains (topic briefs, example banks, frameworks, actor profiles) and how to build one across a season.',
    metaDescription:
      'Printed materials are legal in the World Schools prep room. What a strong case file contains — topic briefs, example banks, frameworks, actor profiles.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'points-of-information-debate',
    title: 'Points of information: the sixty-second duel',
    metaTitle: 'Points of Information (POIs) in Debate',
    description:
      'POIs are the only live contact between teams in World Schools Debate. When to offer them, how many to take, how to answer without losing your speech, and the conventions judges expect.',
    metaDescription:
      'POIs are the only live contact between teams. When to offer them, how many to take, how to answer without losing your speech, and what judges expect.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'usa-debate-team-application-guide',
    title: 'USA Debate: the year before you apply',
    metaTitle: 'How to Prepare for the USA Debate Application',
    description:
      'The USA Debate application is three debate speeches, so the real preparation is the season before it. A season-long training plan for the year before you apply.',
    metaDescription:
      'The USA Debate application is three debate speeches, so the real preparation is the season before it. A season-long training plan for the year before.',
    category: 'The US circuit',
    date: '2026-07-09',
  },
  {
    slug: 'usa-debate-team-skills',
    title: 'What national-team selectors are actually looking for',
    metaTitle: 'USA Debate Tryouts: What Selectors Reward',
    description:
      'The specific, trainable skills that separate USA Debate applicants beyond raw talent: role discipline, weighing, POI composure, and consistency across motion types.',
    metaDescription:
      'The trainable skills that separate USA Debate applicants beyond raw talent: role discipline, weighing, POI composure, and consistency across motions.',
    category: 'The US circuit',
    date: '2026-07-09',
  },
  {
    slug: 'world-schools-debate-tournaments',
    title: 'Where to compete: the World Schools tournament map',
    metaTitle: 'World Schools Debate Tournaments: US Circuit',
    description:
      'Every place to compete in World Schools Debate, with links: the US invitational circuit month by month, TOC and NSDA Nationals, state championships, and the international tournaments American school teams can actually enter.',
    metaDescription:
      'Every place to compete, with links: the US invitational circuit month by month, TOC and NSDA Nationals, state championships, and international opens.',
    category: 'The US circuit',
    date: '2026-07-10',
  },
  {
    slug: 'international-world-schools-tournaments',
    title: 'Taking a bench abroad: the international World Schools calendar',
    metaTitle: 'International World Schools Tournaments',
    description:
      'Every major international World Schools tournament, verified with links: the national-team championships (WSDC, EuroSDC), the opens American school teams can enter (Istanbul, Zagreb, Prague, Singapore), plus online events and the famous tournaments that are NOT World Schools format.',
    metaDescription:
      'Every major international World Schools tournament, verified with links: WSDC and EuroSDC, the opens US school teams can enter, plus online events.',
    category: 'International',
    date: '2026-07-10',
  },
  {
    slug: 'world-schools-debate-pathway-us',
    title: 'The World Schools pathway in the US',
    metaTitle: 'World Schools Debate in the US: The Pathway',
    description:
      'Where American students actually debate World Schools: school teams, the state leagues with WS divisions, NSDA Nationals, and how the pathway runs from a first practice round to the national team.',
    metaDescription:
      'Where American students actually debate World Schools: school teams, state leagues with WS divisions, NSDA Nationals, and the route to the national team.',
    category: 'The US circuit',
    date: '2026-07-09',
  },
  {
    slug: 'how-to-debate',
    title: 'How to debate: the skills, in the order they stack',
    metaTitle: 'How to Debate: A Beginner’s Guide',
    description:
      'A beginner’s guide to debating: how a formal debate is structured, how to build an argument that survives contact, how to rebut, how to weigh, and the practice loop that turns those four skills into wins.',
    metaDescription:
      'How a formal debate works, how to build an argument, how to rebut and weigh, and the practice loop that turns those skills into wins. A beginner’s guide.',
    category: 'Technique',
    date: '2026-08-31',
  },
  {
    slug: 'how-to-start-a-debate-speech',
    title: 'How to start a debate speech (and how not to)',
    metaTitle: 'How to Start a Debate Speech, With Examples',
    description:
      'Openings for every speech in a debate round: the first speaker’s framing, the rebuttal speaker’s pivot, and the closer’s big picture, with worked example openings and the three classic ways students waste their first thirty seconds.',
    metaDescription:
      'Openings for every speech in the round: the framer, the rebutter, the closer. With example openings and the three classic ways to waste thirty seconds.',
    category: 'Technique',
    date: '2026-08-31',
  },
  {
    slug: 'nsda-debate-topics',
    title: 'This season’s NSDA debate topics, in one place',
    metaTitle: 'NSDA Debate Topics 2026-27: PF, LD, Policy',
    description:
      'The current NSDA resolutions for the 2026-27 season: the year-long Policy and Big Questions topics, the September/October Public Forum and Lincoln-Douglas topics, the novice LD topic, and the release calendar for the rest of the year.',
    metaDescription:
      'The current 2026-27 NSDA resolutions: Policy, Big Questions, September/October PF and LD, the novice LD topic, and the release calendar for the season.',
    category: 'The US circuit',
    date: '2026-08-31',
  },
  {
    slug: 'best-debate-summer-camps',
    title: 'Choosing a debate summer camp: the real options',
    metaTitle: 'Best Debate Summer Camps: A 2027 Guide',
    description:
      'An honest map of the American debate camp landscape for summer 2027: university-hosted institutes, format-specific programs, local league camps, and online intensives, with what each kind is good for and how to compare them.',
    metaDescription:
      'The American debate camp landscape for 2027: university institutes, format-specific programs, league camps, and online intensives, and how to compare them.',
    category: 'The US circuit',
    date: '2026-08-31',
  },
  {
    slug: 'best-online-debate-classes',
    title: 'How to pick an online debate class that works',
    metaTitle: 'Best Online Debate Classes for Kids & Teens',
    description:
      'A parent’s guide to online debate classes: the four things that separate real training from a weekly lecture, the main kinds of providers (marketplaces, format specialists, local clubs online), and how to evaluate any of them.',
    metaDescription:
      'A parent’s guide to online debate classes: what separates real training from a weekly lecture, the main kinds of providers, and how to evaluate them.',
    category: 'Why it matters',
    date: '2026-08-31',
  },
  {
    slug: 'extemporaneous-debate',
    title: 'Extemporaneous debate: the 30-minute format, explained',
    metaTitle: 'Extemporaneous Debate: Rules, Format & Prep Guide',
    description:
      'The NSDA Extemporaneous Debate format in full: the ten-segment round of two-minute speeches, the 30-minute prep window, what the rules allow during prep, how it differs from extemp speaking, and how to prepare a case in half an hour.',
    metaDescription:
      'NSDA Extemporaneous Debate explained: the round structure, the 30-minute prep window, what the rules allow, and how to actually prep a case in half an hour.',
    category: 'The US circuit',
    date: '2026-09-01',
  },
  {
    slug: 'how-to-write-a-debate-speech',
    title: 'How to write a debate speech that holds up out loud',
    metaTitle: 'How to Write a Debate Speech (Structure + Example)',
    description:
      'The standard skeleton of a debate speech (roadmap, arguments in layers, rebuttal, weighing, close), how much of it to script versus deliver from notes, a worked example outline, and how to fit it all inside the clock.',
    metaDescription:
      'The standard skeleton of a debate speech, how much to script versus speak from notes, a worked example outline, and how to fit it inside the clock.',
    category: 'Technique',
    date: '2026-09-01',
  },
  {
    slug: 'debate-practice',
    title: 'Debate practice: drills that actually build the skill',
    metaTitle: 'Debate Practice: Drills, Exercises & a Weekly Plan',
    description:
      'How to practice debate deliberately: solo drills for rebuttal, openings, and points of information, partner exercises, how often to run full practice rounds, and a weekly plan that fits around school.',
    metaDescription:
      'How to practice debate deliberately: solo drills, partner exercises, how often to run full practice rounds, and a weekly plan that fits around school.',
    category: 'Technique',
    date: '2026-09-01',
  },
  {
    slug: 'how-to-get-better-at-debate',
    title: 'How to get better at debate when you have plateaued',
    metaTitle: 'How to Get Better at Debate: What Actually Works',
    description:
      'Why most debaters plateau after their first year, the feedback loop that separates improving debaters from busy ones, what to steal from watching championship rounds, and when coaching is worth paying for.',
    metaDescription:
      'Why most debaters plateau, the feedback loop that separates improving debaters from busy ones, and when coaching is actually worth paying for.',
    category: 'Technique',
    date: '2026-09-01',
  },
  {
    slug: 'best-world-schools-debate-classes',
    title: 'Where to actually learn World Schools debate',
    metaTitle: 'Best World Schools Debate Classes & Camps',
    description:
      'A coaches’ map of the programs that genuinely teach the World Schools format: the year-round academies, the summer camps with real WSDC divisions, the free and national-pathway routes, and the checklist that separates format-true training from a Public Forum class with a new label.',
    metaDescription:
      'A coaches’ map of where World Schools debate is really taught: year-round classes, the summer camps with true WSDC divisions, and the free routes in.',
    category: 'Why it matters',
    date: '2026-08-31',
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Standard per-post metadata — relative URLs resolved against metadataBase. */
export function postMetadata(slug: string): Metadata {
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `/blog/${post.slug}`,
      type: 'article',
    },
  };
}
