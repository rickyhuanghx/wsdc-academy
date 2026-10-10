import type { Metadata } from 'next';

// /admin/* is the coach desk: private tooling over Supabase, never indexed.
// Belt and braces with the X-Robots-Tag header in next.config.ts and the
// robots.ts disallow. No login, by the owner's decision: the URL is the gate.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true, 'max-snippet': 0, 'max-image-preview': 'none' },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
