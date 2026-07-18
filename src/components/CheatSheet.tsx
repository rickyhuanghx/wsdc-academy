import type { ReactNode } from 'react';

/* Printable fill-in sheet primitives — server components.
   The .cheat-sheet wrapper gets print-specific treatment in globals.css. */

export function Sheet({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="cheat-sheet border border-navy-300 bg-white">
      <div className="border-b-2 border-navy-900 px-6 py-5 sm:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold text-navy-900">{title}</h2>
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-navy-400 sm:block">
            wsdcacademy.com
          </span>
        </div>
        <p className="mt-1 text-sm text-navy-600">{subtitle}</p>
      </div>
      <div className="divide-y divide-navy-200">{children}</div>
    </div>
  );
}

export function SheetSection({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <section className="px-6 py-5 sm:px-8">
      <h3 className="font-display text-base font-bold text-navy-900">
        {label}
        {hint && <span className="ml-2 font-sans text-xs font-normal normal-case text-navy-500">{hint}</span>}
      </h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function Field({ label, lines = 1 }: { label: string; lines?: number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">{label}</p>
      <div className="mt-1 space-y-4">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="h-5 border-b border-navy-300" />
        ))}
      </div>
    </div>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function SubBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-signal-500 pl-4">
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
}
