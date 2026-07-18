// Shared chrome for the legal pages (/privacy, /terms, /refund):
// navy header band + narrow prose column, matching the guide pages.

import { ReactNode } from 'react';

export function LegalPage({
  kicker = 'Legal',
  title,
  lastUpdated,
  intro,
  children,
}: {
  kicker?: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-navy-900 py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-signal-400">{kicker}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-navy-200">Last updated: {lastUpdated}</p>
          {intro && <p className="mt-4 text-lg leading-relaxed text-navy-100">{intro}</p>}
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">{children}</section>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-navy-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_h3]:mt-5 [&_h3]:font-bold [&_h3]:text-navy-900 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </section>
  );
}
