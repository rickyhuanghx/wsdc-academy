import type { Metadata } from 'next';

// /for/* holds private, per-family proposal pages that are shared by direct link
// only. They must never be discoverable: noindex/nofollow here, an X-Robots-Tag
// header in next.config.ts, no sitemap entry, and no internal links to them.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': 0,
      'max-image-preview': 'none',
    },
  },
};

export default function PrivateProposalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
