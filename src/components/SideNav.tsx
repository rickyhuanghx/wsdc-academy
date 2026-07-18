'use client';

// Left-rail navigator for content clusters (blog, resources, guides): lists the sibling pages
// in the section with the current page highlighted. Styled to match the site — Inter UI text,
// navy links, a scarlet active segment on a thin left rail. Client-only for the active state.

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type SideNavGroup = {
  label?: string;
  items: { href: string; label: string }[];
};

export function SideNav({ title, groups }: { title: string; groups: SideNavGroup[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label={title} className="text-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-signal-500">{title}</p>

      {groups.map((group, i) => (
        <div key={group.label ?? `g${i}`} className="mt-6 first:mt-4">
          {group.label && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy-400">
              {group.label}
            </p>
          )}
          <ul className="border-l border-navy-100">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors ${
                      active
                        ? 'border-signal-500 font-semibold text-signal-500'
                        : 'border-transparent text-navy-600 hover:border-navy-300 hover:text-navy-900'
                    }`}
                  >
                    <span className="line-clamp-2">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
