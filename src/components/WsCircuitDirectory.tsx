// Server-rendered directory of every North American tournament with a posted
// World Schools division. Data: src/lib/ws-circuit.ts. Used by
// /world-schools-debate-tournaments (the standalone SEO page).
import {
  expectedTournaments,
  formatRange,
  groupByMonth,
  isCompetitive,
  modeLabel,
  postedTournaments,
  tagLabels,
  tierLabel,
  tocBidsWithoutTabroomPage,
  type TocTier,
} from '@/lib/ws-circuit';

export function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-signal-500 hover:text-signal-600">
      {children}
    </a>
  );
}

export function Badge({ children, tone = 'navy' }: { children: React.ReactNode; tone?: 'navy' | 'signal' | 'soft' }) {
  const cls = tone === 'signal' ? 'bg-signal-500 text-white' : tone === 'soft' ? 'bg-navy-50 text-navy-600' : 'bg-navy-900 text-white';
  return <span className={`inline-block whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>;
}

export const competitive = postedTournaments.filter(isCompetitive);
export const byMonth = groupByMonth(competitive, (t) => t.startDate);
export const springboard = postedTournaments.filter((t) => t.tags.includes('nsda-springboard-scrimmage'));
export const weeknight = postedTournaments.filter((t) => t.tags.includes('weeknight-online-series'));
export const middleSchool = postedTournaments.filter((t) => t.tags.includes('middle-school'));
export const expectedByMonth = groupByMonth(expectedTournaments, (t) => t.projectedStart);
/** Bid tournaments hosted outside North America (Asia, the Gulf, and TOC Asia's online events). */
const OUTSIDE_NA = /shanghai|shenzhen|taipei|taiwan|viet ?nam|ha ?noi|sharjah|emirates|uae|awcs/i;
export const abroadBids = tocBidsWithoutTabroomPage.filter((b) => OUTSIDE_NA.test(`${b.name} ${b.location}`));
/** North American bid tournaments whose 2026-27 Tabroom page does not exist yet. */
export const unpostedBids = tocBidsWithoutTabroomPage.filter((b) => !OUTSIDE_NA.test(`${b.name} ${b.location}`));

function Where({ city, state, stateLabel, mode }: { city: string; state: string; stateLabel: string; mode: 'in-person' | 'online' | 'hybrid' }) {
  if (stateLabel === 'Online') {
    return (
      <>
        Online <Badge tone="soft">Online</Badge>
      </>
    );
  }
  return (
    <>
      {[city, state].filter(Boolean).join(', ')}
      {mode !== 'in-person' && (
        <span className="ml-2">
          <Badge tone="soft">{modeLabel(mode)}</Badge>
        </span>
      )}
    </>
  );
}

/** Month-by-month tables of every posted, open World Schools division. */
export function PostedByMonth() {
  return (
    <>
      {byMonth.map((group) => (
        <div key={group.key} className="mt-8">
          <h3 className="font-display text-lg font-bold text-signal-500">{group.label}</h3>
          <div className="mt-3 overflow-x-auto rounded-lg border border-navy-100">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-navy-900 text-left text-white">
                <tr>
                  <th className="px-3 py-2 font-semibold">Dates</th>
                  <th className="px-3 py-2 font-semibold">Tournament</th>
                  <th className="px-3 py-2 font-semibold">Where</th>
                  <th className="px-3 py-2 font-semibold">World Schools division(s)</th>
                  <th className="px-3 py-2 font-semibold">TOC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                {group.items.map((t) => (
                  <tr key={t.tourn_id}>
                    <td className="whitespace-nowrap px-3 py-2 align-top">
                      <time dateTime={t.startDate}>{formatRange(t.startDate, t.endDate)}</time>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Ext href={t.url}>{t.name}</Ext>
                      {tagLabels(t.tags).map((l) => (
                        <span key={l} className="ml-2">
                          <Badge tone="soft">{l}</Badge>
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Where city={t.city} state={t.state} stateLabel={t.stateLabel} mode={t.mode} />
                    </td>
                    <td className="px-3 py-2 align-top text-xs leading-snug text-navy-600">{t.ws_events.join(' · ')}</td>
                    <td className="whitespace-nowrap px-3 py-2 align-top">{t.toc_tier ? <Badge tone="signal">{tierLabel(t.toc_tier)}</Badge> : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}

/** Free NSDA Springboard scrimmages, the weeknight online series, middle-school meets. */
export function SideLists() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <div className="border border-navy-100 bg-white p-5">
        <h3 className="font-display text-lg font-bold text-navy-900">Free NSDA Springboard scrimmages</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          Weekday-evening online WS scrimmages on NSDA Campus with an Open and a Rising Stars division. No membership required.
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {springboard.map((t) => (
            <li key={t.tourn_id}>
              <time dateTime={t.startDate} className="text-navy-500">{formatRange(t.startDate, t.endDate)}</time> <Ext href={t.url}>{t.name}</Ext>
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-navy-100 bg-white p-5">
        <h3 className="font-display text-lg font-bold text-navy-900">Weeknight online series and middle school</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          A recurring single-evening online series with prepared and impromptu WS, and the middle-school meets that run a World Schools division.
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {[...weeknight, ...middleSchool]
            .sort((a, b) => a.startDate.localeCompare(b.startDate))
            .map((t) => (
              <li key={t.tourn_id}>
                <time dateTime={t.startDate} className="text-navy-500">{formatRange(t.startDate, t.endDate)}</time> <Ext href={t.url}>{t.name}</Ext>
                {t.tags.includes('middle-school') && (
                  <span className="ml-2">
                    <Badge tone="soft">Middle school</Badge>
                  </span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

/** Prior-season hosts with no 2026-27 page yet. */
export function ExpectedTable() {
  return (
    <>
      {unpostedBids.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-navy-600">
          On the official bid list but without a Tabroom page yet:{' '}
          {unpostedBids
            .map((b) => `${b.name} (${tierLabel(b.tier as TocTier)}${b.dates ? `, ${b.dates.replace(/\.\s?/g, ' ').replace(/,\s?2026$/, ', 2027')}` : ''})`)
            .join('; ')}
          .
        </p>
      )}
      <div className="mt-4 overflow-x-auto rounded-lg border border-navy-100">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-navy-50 text-left text-navy-700">
            <tr>
              <th className="px-3 py-2 font-semibold">Likely dates</th>
              <th className="px-3 py-2 font-semibold">Tournament (last season’s page)</th>
              <th className="px-3 py-2 font-semibold">Where</th>
              <th className="px-3 py-2 font-semibold">TOC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
            {expectedByMonth.flatMap((g) =>
              g.items.map((t) => (
                <tr key={t.tourn_id_prev}>
                  <td className="whitespace-nowrap px-3 py-2 align-top text-navy-500">{formatRange(t.projectedStart, t.projectedEnd)}</td>
                  <td className="px-3 py-2 align-top">
                    <Ext href={t.url_prev}>{t.name}</Ext>
                    {tagLabels(t.tags).map((l) => (
                      <span key={l} className="ml-2">
                        <Badge tone="soft">{l}</Badge>
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <Where city={t.city} state={t.state} stateLabel={t.stateLabel} mode={t.mode} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 align-top">{t.toc_tier ? <Badge tone="signal">{tierLabel(t.toc_tier)}</Badge> : ''}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
