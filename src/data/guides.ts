// The "Learn" guide cluster: the four evergreen explainer pages (each an Article + FAQ page).
// Single source of truth for the section navigator; the pages themselves live in the
// (learn) route group. Keep in sync with sitemap.ts and the footer "Learn" column.

export interface Guide {
  href: string;
  navLabel: string; // short label for the left-rail navigator
}

export const guides: Guide[] = [
  { href: '/what-is-world-schools-debate', navLabel: 'What is World Schools?' },
  { href: '/world-schools-debate-judging', navLabel: 'How judging works' },
  { href: '/world-schools-vs-public-forum', navLabel: 'World Schools vs. Public Forum' },
  { href: '/usa-debate-team', navLabel: 'The USA Debate team' },
];
