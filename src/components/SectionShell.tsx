import type { ReactNode } from 'react';
import { SideNav, type SideNavGroup } from './SideNav';

// Two-column shell for content clusters: a sticky sibling-nav rail on the left, the page in the
// content column. Used by the blog / resources / guides section layouts, so cluster pages get the
// navigator without any per-page edits (each page keeps its own container inside the column).
// The rail is hidden below lg — on small screens the top navbar covers section navigation.

export function SectionShell({
  title,
  groups,
  children,
}: {
  title: string;
  groups: SideNavGroup[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl lg:px-8">
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-24 py-16">
            <SideNav title={title} groups={groups} />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
