// /world-schools-tournaments.ics — subscribable calendar of every North
// American tournament with a posted World Schools division this season.
// Generated at build time from src/data/ws-circuit-2026-27.json.
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { postedTournaments, tierLabel, modeLabel, CIRCUIT_GENERATED, CIRCUIT_SEASON } from '@/lib/ws-circuit';

export const dynamic = 'force-static';

function icsDate(iso: string): string {
  return iso.replace(/-/g, '');
}

/** Exclusive DTEND for all-day events: the day after the last day. */
function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** RFC 5545 line folding at 75 octets. */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest, 'utf8') > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut), 'utf8') > 75) cut -= 1;
    out.push(rest.slice(0, cut));
    rest = ' ' + rest.slice(cut);
  }
  out.push(rest);
  return out.join('\r\n');
}

export function GET() {
  const stamp = `${icsDate(CIRCUIT_GENERATED)}T000000Z`;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE_NAME}//World Schools tournaments ${CIRCUIT_SEASON}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:World Schools Debate tournaments ${CIRCUIT_SEASON} (${SITE_NAME})`,
    'X-WR-TIMEZONE:America/New_York',
  ];
  for (const t of postedTournaments) {
    const bits = [
      `World Schools division(s): ${t.ws_events.join('; ')}`,
      `Format: ${modeLabel(t.mode)}`,
      t.toc_tier ? `TOC: ${tierLabel(t.toc_tier)}` : '',
      `Tabroom: ${t.url}`,
      `Directory: ${SITE_URL}/world-schools-debate-tournaments`,
    ].filter(Boolean);
    const location = t.stateLabel === 'Online' ? 'Online' : [t.city, t.state].filter(Boolean).join(', ');
    lines.push(
      'BEGIN:VEVENT',
      `UID:tabroom-${t.tourn_id}@wsdcacademy.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(t.startDate)}`,
      `DTEND;VALUE=DATE:${icsDate(nextDay(t.endDate))}`,
      `SUMMARY:${escapeText(t.name)}${t.toc_tier ? escapeText(` (WS ${tierLabel(t.toc_tier)})`) : ' (World Schools)'}`,
      `LOCATION:${escapeText(location)}`,
      `DESCRIPTION:${escapeText(bits.join('\n'))}`,
      `URL:${t.url}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  const body = lines.map(fold).join('\r\n') + '\r\n';
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="world-schools-tournaments-2026-27.ics"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
