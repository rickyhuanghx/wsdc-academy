// Homepage section: "Interested in writing competitions?". Server component.
// Loads the brand's competition catalogue from ClassDesk (seed fallback when the
// API is down) and renders a compact editorial list next to the interest form.

import {
  effectiveOffer,
  getCompetitions,
  kindTag,
  milestoneLine,
  oneLineBlurb,
  todayIso,
} from '@/lib/competitions';
import { WritingInterestForm } from '@/components/WritingInterestForm';

export const ATLANTIC_IVY_CALENDAR_URL =
  'https://atlanticivy.com/competitions?utm_source=wsdcacademy&utm_medium=referral&utm_campaign=writing-interest';

export async function WritingInterestSection() {
  const competitions = await getCompetitions();
  if (competitions.length === 0) return null;
  const today = todayIso();
  const options = competitions.map((c) => ({ slug: c.slug, shortName: c.shortName, tag: kindTag(c) }));

  return (
    <section id="writing-competitions" className="bg-white" aria-labelledby="writing-competitions-heading">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-500">Beyond debate</p>
          <h2
            id="writing-competitions-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl"
          >
            Interested in writing competitions?
          </h2>
          <p className="mt-4 leading-relaxed text-navy-600">
            Our coaches also prepare students for the essay competitions and student journals that
            admissions officers recognise. Preparation runs through our sister academy, Atlantic Ivy, and
            this form tells us which ones your family wants to hear about.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ul className="divide-y divide-navy-100 border-y border-navy-100 lg:col-span-7">
            {competitions.map((c) => {
              const offer = effectiveOffer(c, today);
              const blurb = oneLineBlurb(c);
              return (
                <li key={c.slug} className="flex gap-5 py-5 sm:gap-6">
                  <span className="w-14 shrink-0 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-signal-500">
                    {kindTag(c)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-navy-900">{c.name}</h3>
                    {blurb && <p className="mt-1 text-sm leading-relaxed text-navy-600">{blurb}</p>}
                    <p className="mt-2 text-sm text-navy-900">
                      <span className="font-semibold">{milestoneLine(c, today)}</span>
                      {offer?.type === 'course' && offer.href && (
                        <>
                          <span className="mx-2 text-navy-300" aria-hidden="true">
                            /
                          </span>
                          <a
                            href={offer.href}
                            className="font-semibold underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
                          >
                            {offer.ctaLabel}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-5">
            <WritingInterestForm options={options} />
          </div>
        </div>

        <p className="mt-10 text-sm text-navy-600">
          The full calendar, with every deadline and our preparation options, is on{' '}
          <a
            href={ATLANTIC_IVY_CALENDAR_URL}
            className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600"
          >
            Atlantic Ivy&apos;s competitions page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
