export interface Resource {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: 'Cheat sheets' | 'Quick references' | 'Practice & prep';
  printable: boolean;
}

export const resources: Resource[] = [
  {
    slug: 'first-speaker-cheat-sheet',
    title: 'First Speaker Cheat Sheet',
    shortTitle: 'First Speaker',
    description:
      'A printable prep-room template for the first speaker: set-up, definitions, stance, split, winning metric, and two fully mechanized arguments.',
    category: 'Cheat sheets',
    printable: true,
  },
  {
    slug: 'second-speaker-cheat-sheet',
    title: 'Second Speaker Cheat Sheet',
    shortTitle: 'Second Speaker',
    description:
      'A printable template for the deputy speech: rebuttal in "they say / however" form, rebuilding, and the extension argument.',
    category: 'Cheat sheets',
    printable: true,
  },
  {
    slug: 'third-speaker-cheat-sheet',
    title: 'Third Speaker (Whip) Cheat Sheet',
    shortTitle: 'Third Speaker',
    description:
      'A printable clash sheet for the whip: three clashes, each with response, internal weighing, and external weighing.',
    category: 'Cheat sheets',
    printable: true,
  },
  {
    slug: 'prep-hour-planner',
    title: 'The 1-Hour Prep Planner',
    shortTitle: 'Prep Planner',
    description:
      'A minute-by-minute plan for the impromptu prep hour: what your team should be doing at 0:10, 0:25, 0:45, and 0:55, with a printable checklist.',
    category: 'Practice & prep',
    printable: true,
  },
  {
    slug: 'practice-motions',
    title: 'Practice Motion Bank',
    shortTitle: 'Practice Motions',
    description:
      '40 World Schools practice motions organized by motion type (policy, value, actor, and regret) for scrimmages and prep drills.',
    category: 'Practice & prep',
    printable: false,
  },
  {
    slug: 'wsdc-format-quick-reference',
    title: 'World Schools Format Quick Reference',
    shortTitle: 'Format Reference',
    description:
      'Speech order, timings, reply-speech rules, prep-time rules, and the 40/40/20 judging criteria on one page.',
    category: 'Quick references',
    printable: true,
  },
  {
    slug: 'motion-types',
    title: 'The Four Motion Types',
    shortTitle: 'Motion Types',
    description:
      'Policy, value, actor, and regret motions: what each asks you to prove, where each debate is usually won, and example motions for every type.',
    category: 'Quick references',
    printable: false,
  },
  {
    slug: 'glossary',
    title: 'World Schools Debate Glossary',
    shortTitle: 'Glossary',
    description:
      'Every term your coach will use, defined: burden, caseline, clash, countermodel, extension, metric, POI, split, weighing, whip, and more.',
    category: 'Quick references',
    printable: false,
  },
];

export const resourceCategories: Resource['category'][] = [
  'Cheat sheets',
  'Quick references',
  'Practice & prep',
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}
