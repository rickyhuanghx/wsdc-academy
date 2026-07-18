'use client';

// On-page table of contents for long pages: anchor links to the page's own sections, with the
// current section highlighted as you scroll (IntersectionObserver). Same left-rail styling as the
// section navigator (SideNav), so the two patterns read as one system. Hidden below lg by the
// caller. Each target section needs a matching id and scroll-mt to clear the sticky navbar.

import { useEffect, useState } from 'react';

export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Trip the active state when a section reaches the upper quarter of the viewport,
      // below the sticky navbar.
      { rootMargin: '-88px 0px -65% 0px', threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-signal-500">On this page</p>
      <ul className="mt-4 border-l border-navy-100">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors ${
                  isActive
                    ? 'border-signal-500 font-semibold text-signal-500'
                    : 'border-transparent text-navy-600 hover:border-navy-300 hover:text-navy-900'
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
