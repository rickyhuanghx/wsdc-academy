// Editorial authorship. Every guide in the "Learn" cluster and every blog post is
// bylined to one credentialed coach. A named Person author (not the Organization)
// is the strongest E-E-A-T signal available for this niche, so the same author
// drives both the visible byline (ArticleByline) and the Article JSON-LD author
// (see ArticleJsonLd in src/components/JsonLd.tsx). Peregrine is already in the
// roster as `perry-beckett` (src/data/coaches.ts).

export const ARTICLE_AUTHOR = {
  name: 'Peregrine Beckett',
  role: 'Program Director',
  // One-line credential string shown under the byline.
  byline: '3rd Best APDA Debater · TOC Semifinalist · Columbia Debate Society Coach',
  image: '/images/coaches/perry-beckett.png',
  // No per-coach profile page exists yet; point at the roster page that lists him.
  url: '/coaches',
  // Longer form used for the Person schema description.
  credentials: [
    '3rd Best APDA Debater',
    'Tournament of Champions Semifinalist',
    'Debate Coach, Columbia Debate Society',
  ],
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Format an ISO date-only string ("2026-07-09") without timezone drift
    (parsing it as a Date would shift to the previous day in western zones). */
export function formatArticleDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
