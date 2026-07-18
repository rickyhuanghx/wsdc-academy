import type { ReactNode } from 'react';
import { SectionShell } from '@/components/SectionShell';
import { resources, resourceCategories } from '@/data/resources';

// Left-rail navigator for the resource library: an overview link plus every printable, grouped
// by category. Driven off src/data/resources.ts, so new resources appear automatically.
const groups = [
  { items: [{ href: '/resources', label: 'All resources' }] },
  ...resourceCategories.map((category) => ({
    label: category,
    items: resources
      .filter((r) => r.category === category)
      .map((r) => ({ href: `/resources/${r.slug}`, label: r.shortTitle })),
  })),
];

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <SectionShell title="Resources" groups={groups}>
      {children}
    </SectionShell>
  );
}
