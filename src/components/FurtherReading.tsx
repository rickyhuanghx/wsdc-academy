import Link from 'next/link';

export interface ReadingLink {
  href: string;
  label: string;
  note: string;
}

/**
 * A block of contextual in-body links with descriptive anchors.
 *
 * Added 2026-07-27 after an SEO audit found the commercial and pillar pages
 * linked no deeper than the navbar and footer: the blog and resource library
 * were a closed loop that never passed authority to the pages that convert.
 * Use it where a page has no natural place for links inside its prose; where
 * there IS one, link inline instead — an in-sentence link is worth more.
 */
export function FurtherReading({
  heading = 'Keep reading',
  intro,
  links,
}: {
  heading?: string;
  intro?: string;
  links: ReadingLink[];
}) {
  if (links.length === 0) return null;

  return (
    <section className="mt-14 border-t-2 border-navy-900 pt-8">
      <h2 className="text-2xl font-bold text-navy-900">{heading}</h2>
      {intro && <p className="mt-3 leading-relaxed text-navy-700">{intro}</p>}
      <ul className="mt-6 divide-y divide-navy-100 border-t border-navy-100">
        {links.map((l) => (
          <li key={l.href} className="py-4">
            <Link
              href={l.href}
              className="font-semibold text-navy-900 underline decoration-navy-300 underline-offset-4 hover:text-signal-500 hover:decoration-signal-500"
            >
              {l.label}
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-navy-600">{l.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
