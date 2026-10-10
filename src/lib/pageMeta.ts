import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

/**
 * Per-page social metadata (Open Graph + Twitter card).
 *
 * Next.js replaces a parent's `openGraph` object wholesale when a page sets its
 * own, so a page that exports `openGraph: { title, description, url }` silently
 * loses the root layout's og:image, siteName, and locale. And because the root
 * layout used to carry a full `twitter` block, every inner page shipped the
 * homepage's twitter:title/description.
 *
 * Every page that sets its own social metadata should spread this instead:
 *
 *   export const metadata: Metadata = {
 *     title: '...',
 *     description: '...',
 *     ...socialMeta({ title: '...', description: '...', url: '/path' }),
 *   };
 *
 * The og:image defaults to the site card unless the page passes `images`.
 * URLs stay relative (resolved against `metadataBase`).
 */

export const DEFAULT_OG_IMAGE = {
  url: '/images/og-home.jpg',
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: World Schools Debate Coaching & Training`,
};

type OgImage = { url: string; alt?: string; width?: number; height?: number };

export interface SocialMetaInput {
  title: string;
  description?: string;
  url?: string;
  type?: 'website' | 'article';
  images?: OgImage[];
}

export function socialMeta({
  title,
  description,
  url,
  type = 'website',
  images,
}: SocialMetaInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  return {
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(url ? { url } : {}),
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
      images: ogImages.map((img) => img.url),
    },
  };
}
