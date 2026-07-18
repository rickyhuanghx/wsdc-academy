import type { Metadata } from 'next';

export interface BlogPost {
  slug: string;
  title: string; // on-page H1
  metaTitle: string; // <title> — keyword-led
  description: string;
  category: 'Speaker roles' | 'Technique' | 'The US circuit' | 'International';
  date: string; // ISO
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'first-speaker-world-schools-debate',
    title: 'The first speaker: building the house everyone lives in',
    metaTitle: 'First Speaker in World Schools Debate: The Complete Role Guide',
    description:
      'What the first speaker actually does in World Schools Debate: framing the motion, definitions, the split, the winning metric, and how to structure your two arguments so the whole case stands on them.',
    category: 'Speaker roles',
    date: '2026-07-09',
  },
  {
    slug: 'second-speaker-world-schools-debate',
    title: 'The second speaker: rebut, rebuild, extend',
    metaTitle: 'Second Speaker in World Schools Debate: Rebuttal, Rebuilding & the Extension',
    description:
      'The deputy speech is where rounds are won or lost. How to rebut the best version of the opposing case, rebuild your own, and still land a fully developed new argument.',
    category: 'Speaker roles',
    date: '2026-07-09',
  },
  {
    slug: 'third-speaker-world-schools-debate',
    title: 'The third speaker: deciding the debate',
    metaTitle: 'Third Speaker (Whip) in World Schools Debate: Clashes, Weighing & Role Guide',
    description:
      'The whip speech explained: how to reorganize a messy round into two or three clashes, win each one, and weigh the debate shut without breaking the no-new-arguments rule.',
    category: 'Speaker roles',
    date: '2026-07-09',
  },
  {
    slug: 'how-to-build-a-debate-argument',
    title: 'How to build an argument that survives contact',
    metaTitle: 'How to Build a Debate Argument: Tagline, Mechanisms, Impact, Weighing',
    description:
      'The four-layer argument structure top World Schools teams use (tagline, mechanisms, impact, weighing), with a worked example carried from claim to comparison.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'debate-rebuttal-guide',
    title: 'Rebuttal: how to take an argument apart',
    metaTitle: 'How to Rebut in Debate: The "They Say / However" Method (With Examples)',
    description:
      'A practical rebuttal guide for World Schools Debate: the four-step response structure, why you must answer the best version of an argument, and where to aim (premise, mechanism, impact, or weighing).',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'weighing-in-debate',
    title: 'Weighing: how close rounds actually get decided',
    metaTitle: 'Weighing in Debate: Internal vs External Weighing & Metrics Explained',
    description:
      'What weighing means in World Schools Debate: internal vs external weighing, setting a metric, the "our worst case beats their best case" move, and why weighing belongs in every speech, not just the whip.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'reply-speech-world-schools-debate',
    title: 'The reply speech: a biased judge’s summary',
    metaTitle: 'The Reply Speech in World Schools Debate: Structure, Rules & Strategy',
    description:
      'How to deliver the four-minute reply speech in World Schools Debate: who gives it, why the order flips, what belongs in a biased adjudication, and the mistakes that waste it.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'world-schools-case-files',
    title: 'Case files: the prep you do before prep',
    metaTitle: 'How to Build a World Schools Debate Case File (What to Bring to Prep)',
    description:
      'Printed materials are legal in the World Schools prep room. What a strong case file contains (topic briefs, example banks, frameworks, actor profiles) and how to build one across a season.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'points-of-information-debate',
    title: 'Points of information: the sixty-second duel',
    metaTitle: 'Points of Information (POIs) in Debate: When to Offer, How to Answer',
    description:
      'POIs are the only live contact between teams in World Schools Debate. When to offer them, how many to take, how to answer without losing your speech, and the conventions judges expect.',
    category: 'Technique',
    date: '2026-07-09',
  },
  {
    slug: 'usa-debate-team-application-guide',
    title: 'USA Debate: the year before you apply',
    metaTitle: 'How to Prepare for the USA Debate Application: The Year-Before Plan',
    description:
      'The USA Debate application is three debate speeches, so the real preparation is the season before it. A season-long training plan for the year before you apply.',
    category: 'The US circuit',
    date: '2026-07-09',
  },
  {
    slug: 'usa-debate-team-skills',
    title: 'What national-team selectors are actually looking for',
    metaTitle: 'USA Debate Team Tryouts: The Skills Selectors Actually Reward',
    description:
      'The specific, trainable skills that separate USA Debate applicants beyond raw talent: role discipline, weighing, POI composure, and consistency across motion types.',
    category: 'The US circuit',
    date: '2026-07-09',
  },
  {
    slug: 'world-schools-debate-tournaments',
    title: 'Where to compete: the World Schools tournament map',
    metaTitle: 'World Schools Debate Tournaments: The US Circuit & International Guide',
    description:
      'Every place to compete in World Schools Debate, with links: the US invitational circuit month by month, TOC and NSDA Nationals, state championships, and the international tournaments American school teams can actually enter.',
    category: 'The US circuit',
    date: '2026-07-10',
  },
  {
    slug: 'international-world-schools-tournaments',
    title: 'Taking a bench abroad: the international World Schools calendar',
    metaTitle: 'International World Schools Debate Tournaments: The Complete Guide',
    description:
      'Every major international World Schools tournament, verified with links: the national-team championships (WSDC, EuroSDC), the opens American school teams can enter (Istanbul, Zagreb, Prague, Singapore), plus online events and the famous tournaments that are NOT World Schools format.',
    category: 'International',
    date: '2026-07-10',
  },
  {
    slug: 'world-schools-debate-pathway-us',
    title: 'The World Schools pathway in the US',
    metaTitle: 'World Schools Debate in the US: Tournaments, State Leagues & the Pathway',
    description:
      'Where American students actually debate World Schools: school teams, the state leagues with WS divisions, NSDA Nationals, and how the pathway runs from a first practice round to the national team.',
    category: 'The US circuit',
    date: '2026-07-09',
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
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
    },
  };
}
