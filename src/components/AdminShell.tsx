import Link from 'next/link';

// Shared chrome for the coach desk (/admin/*). No login, by the owner's
// decision: the unlisted, noindexed URL is the gate.

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-navy-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">
            <Link href="/admin/self-reports" className="hover:underline">
              Coach desk
            </Link>
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900">{title}</h1>
        </div>
        {children}
      </div>
    </section>
  );
}
