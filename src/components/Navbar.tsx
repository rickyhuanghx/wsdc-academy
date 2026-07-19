'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

type NavChild = { href: string; label: string; desc?: string };
type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
  footerLink?: { href: string; label: string };
};

const nav: NavItem[] = [
  {
    href: '/programs',
    label: 'Programs',
    children: [
      {
        href: '/programs/summer-bootcamp',
        label: 'World Schools Summer Bootcamp',
        desc: '12-hour August intensive for beginners',
      },
      {
        href: '/programs/foundations',
        label: 'World Schools Foundation',
        desc: 'Beginner introduction to WSDC',
      },
      {
        href: '/programs/competition-team',
        label: 'WSDC Competition Team',
        desc: 'Year-round squad training',
      },
      {
        href: '/programs/national-team-sprint',
        label: 'National Team Sprint',
        desc: 'Invitation only',
      },
      {
        href: '/programs/private-coaching',
        label: '1-on-1 Coaching',
        desc: 'One-on-one private coaching',
      },
    ],
    footerLink: { href: '/programs', label: 'View all programs' },
  },
  { href: '/what-is-world-schools-debate', label: 'What is World Schools?' },
  { href: '/coaches', label: 'Our Coaches' },
  {
    href: '/resources',
    label: 'Resources & Blogs',
    children: [
      { href: '/resources', label: 'Resources', desc: 'Cheat sheets, motions, and glossary' },
      { href: '/blog', label: 'Blog', desc: 'Guides and strategy essays' },
    ],
  },
];

function Chevron() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-sm bg-navy-900 font-display text-lg font-semibold text-white">
            W
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-signal-500" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-navy-900">
            WSDC Prep
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 transition-colors group-hover:text-signal-500 group-focus-within:text-signal-500"
                  aria-haspopup="true"
                >
                  {item.label}
                  <Chevron />
                </Link>
                {/* pt-3 bridges the gap so the panel stays open while the cursor travels to it */}
                <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-80 rounded-sm border border-navy-100 bg-white p-2 shadow-xl shadow-navy-900/10">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3 py-2 transition-colors hover:bg-cream"
                      >
                        <span className="block text-sm font-semibold text-navy-900">
                          {child.label}
                        </span>
                        {child.desc && (
                          <span className="mt-0.5 block text-xs leading-snug text-navy-500">
                            {child.desc}
                          </span>
                        )}
                      </Link>
                    ))}
                    {item.footerLink && (
                      <>
                        <div className="my-1 border-t border-navy-100" />
                        <Link
                          href={item.footerLink.href}
                          className="block px-3 py-2 text-sm font-semibold text-signal-500 transition-colors hover:text-signal-600"
                        >
                          {item.footerLink.label} &rarr;
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-signal-500"
              >
                {item.label}
              </Link>
            )
          )}
          {cartCount > 0 && (
            <Link
              href="/checkout"
              className="text-sm font-semibold text-navy-900 underline underline-offset-4 transition-colors hover:text-signal-500"
            >
              Cart ({cartCount})
            </Link>
          )}
          <Link
            href="/consultation"
            className="rounded-sm bg-signal-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden"
          onClick={() => setOpen(!open)}
        >
          <svg className="h-6 w-6 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-100 bg-white px-4 pb-4 lg:hidden">
          {nav.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-sm font-semibold text-navy-900"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-3 border-l border-navy-100 pl-4 pb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 text-sm text-navy-600"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {cartCount > 0 && (
            <Link
              href="/checkout"
              className="block py-3 text-sm font-semibold text-navy-900"
              onClick={() => setOpen(false)}
            >
              Cart ({cartCount})
            </Link>
          )}
          <Link
            href="/consultation"
            className="mt-2 block rounded-sm bg-signal-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Book a Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
