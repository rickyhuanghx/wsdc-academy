// Editorial authorship. Every guide in the "Learn" cluster and every blog post is
// bylined to one credentialed coach. A named Person author (not the Organization)
// is the strongest E-E-A-T signal available for this niche, so the same author
// drives both the visible byline (ArticleByline) and the Article JSON-LD author
// (see ArticleJsonLd in src/components/JsonLd.tsx). Peregrine is already in the
// roster as `perry-beckett` (src/data/coaches.ts).

// Reviewer credits (2026-08-17 SEO audit): the long-form content is written by
// one author, but the roster's WSDC-specific authorities were invisible to
// search engines. A "Reviewed by" credit is honest (coaches review the format
// content) and puts WSDC-credentialed names on the pages meant to rank for
// WSDC queries. Credentials are pulled from the roster — never write new ones here.
import { coaches, type Coach } from '@/data/coaches';

export interface ArticleReviewer {
  name: string;
  role: string;
  /** One-line credential shown next to the credit. */
  byline: string;
  image: string;
  url: string;
  credentials: string[];
}

function reviewerFromRoster(slug: string): ArticleReviewer {
  const coach = coaches.find((c: Coach) => c.slug === slug);
  if (!coach) throw new Error(`Reviewer slug not in roster: ${slug}`);
  return {
    name: coach.name,
    role: coach.role,
    byline: coach.highlight,
    image: coach.image,
    url: '/coaches',
    credentials: coach.credentials,
  };
}

/** WSDC-format content (guides, speaker-role posts): the roster's top WSDC competitor. */
export const WSDC_REVIEWER = reviewerFromRoster('cailyn-min');
/** Judging/adjudication content: the roster's national-team coach and adjudicator. */
export const JUDGING_REVIEWER = reviewerFromRoster('biser-angelov');

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
