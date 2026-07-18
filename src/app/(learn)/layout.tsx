import type { ReactNode } from 'react';
import { SectionShell } from '@/components/SectionShell';
import { guides } from '@/data/guides';

// Left-rail navigator for the "Learn" guide cluster. The four guides are top-level routes with
// no shared URL segment, so they live together in this (learn) route group purely to share this
// layout — the parentheses keep the group out of the URL. Driven off src/data/guides.ts.
const groups = [
  { items: guides.map((g) => ({ href: g.href, label: g.navLabel })) },
];

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <SectionShell title="Learn" groups={groups}>
      {children}
    </SectionShell>
  );
}
