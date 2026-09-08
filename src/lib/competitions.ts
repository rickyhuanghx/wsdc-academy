// Writing competitions (essay contests + student journals): server-side client
// for the ClassDesk public competitions API, with a bundled seed as fallback.
//
// SERVER ONLY. Import from server components and route handlers, never from a
// 'use client' file: the CSP connect-src allowlist in next.config.ts blocks
// browser fetches to classroomdesk.com. Mirrors src/lib/tournaments.ts, with
// one difference: when the API fails or returns nothing, the reader falls back
// to src/data/competitions.seed.json instead of [] so the homepage section
// always has the seven competitions to show.

import seed from '@/data/competitions.seed.json';

export const COMPETITION_BRAND = 'wsdc';

const API_BASE = (process.env.CLASSDESK_API_URL || 'https://www.classroomdesk.com/api/public').replace(
  /\/+$/,
  '',
);

export const COMPETITION_REVALIDATE_SECONDS = 300;

export type CompetitionKind = 'essay' | 'journal';
export type CompetitionCadence = 'annual' | 'multi_cycle' | 'quarterly' | 'windowed' | 'rolling';
export type CycleStatus = 'projected' | 'announced' | 'open' | 'closed' | 'results' | 'cancelled';
export type MilestoneKey =
  | 'announcement'
  | 'reg_opens'
  | 'reg_closes'
  | 'submission_due'
  | 'shortlist'
  | 'event'
  | 'results'
  | 'window_opens'
  | 'window_closes';
export type OfferType = 'course' | 'package' | 'interest' | 'external' | 'none';

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'faq';
  text?: string;
  title?: string;
  items?: string[];
  q?: string;
  a?: string;
}

export interface Milestone {
  key: MilestoneKey;
  at: string; // ISO date YYYY-MM-DD, organiser-local
  endAt?: string | null;
  tz: string | null;
  confirmed: boolean;
  label: string | null;
  url: string | null;
}

export interface NextMilestone {
  key: MilestoneKey;
  at: string;
  confirmed: boolean;
  label: string | null;
  /** Cycle the milestone belongs to, e.g. '2027' or 'Fall/Winter 2026'. */
  cycleLabel: string;
}

export interface PublicCycle {
  id: string;
  label: string;
  status: CycleStatus;
  milestones: Milestone[];
  nextMilestone?: { key: MilestoneKey; at: string; confirmed: boolean; label: string | null } | null;
}

export interface PublicPackage {
  /** ClassDesk course slug; doubles as the cart/metadata id for the line. */
  sku: string;
  /** Short buyer-facing name, e.g. "Junior package 1 (22 h)"; null when the API sends none. */
  label: string | null;
  hours: number;
  priceMinor: number;
  currency: string;
  href: string;
}

export interface PublicOffer {
  type: OfferType;
  href: string | null;
  ctaLabel: string;
  blurb: string | null;
  startsAt: string | null;
  closesAt: string | null;
  packages: PublicPackage[];
  priceFrom: { amountMinor: number; currency: string } | null;
  cycleId: string | null;
}

export interface PublicCompetition {
  slug: string;
  name: string;
  shortName: string;
  kind: CompetitionKind;
  cadence: CompetitionCadence;
  organiserName: string | null;
  organiserUrl: string | null;
  subjects: string[];
  eligibility: { min_age?: number; max_age?: number; min_grade?: number; max_grade?: number };
  eligibilityNote: string | null;
  entry: {
    wordLimit?: string;
    feeNote?: string;
    teamSize?: { min: number; max: number };
    reviewTime?: string;
    submissionUrl?: string;
  };
  blurb: string | null;
  content: ContentBlock[];
  heroImageUrl: string | null;
  cycles: PublicCycle[];
  offer: PublicOffer | null;
  verifiedAt: string | null;
  preview: boolean;
}

type FetchOpts = { preview?: string; noStore?: boolean };

// Only a well-formed token goes to the API; anything else is treated as "no preview".
export function cleanPreviewToken(raw: unknown): string | undefined {
  if (typeof raw === 'string') {
    const v = raw.trim();
    if (/^[A-Za-z0-9_-]{8,200}$/.test(v)) return v;
  }
  if (process.env.NODE_ENV !== 'production') {
    const dev = process.env.TOURNAMENT_PREVIEW_TOKEN?.trim();
    if (dev && /^[A-Za-z0-9_-]{8,200}$/.test(dev)) return dev;
  }
  return undefined;
}

function url(path: string, preview?: string): string {
  const u = new URL(`${API_BASE}${path}`);
  u.searchParams.set('brand', COMPETITION_BRAND);
  if (preview) u.searchParams.set('preview', preview);
  return u.toString();
}

function cacheOptions(opts: FetchOpts): RequestInit {
  return opts.noStore || opts.preview
    ? { cache: 'no-store' }
    : { next: { revalidate: COMPETITION_REVALIDATE_SECONDS } };
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const KINDS = new Set<string>(['essay', 'journal']);
const CADENCES = new Set<string>(['annual', 'multi_cycle', 'quarterly', 'windowed', 'rolling']);

function isCompetition(value: unknown): value is PublicCompetition {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.slug === 'string' &&
    /^[a-z0-9][a-z0-9-]{0,120}$/i.test(c.slug) &&
    typeof c.name === 'string' &&
    typeof c.kind === 'string' &&
    KINDS.has(c.kind)
  );
}

function normalizeMilestone(m: unknown): Milestone | null {
  if (!m || typeof m !== 'object') return null;
  const r = m as Record<string, unknown>;
  if (typeof r.key !== 'string' || typeof r.at !== 'string' || !ISO_DATE_RE.test(r.at)) return null;
  return {
    key: r.key as MilestoneKey,
    at: r.at,
    endAt: typeof r.endAt === 'string' ? r.endAt : null,
    tz: typeof r.tz === 'string' ? r.tz : null,
    confirmed: r.confirmed !== false,
    label: typeof r.label === 'string' && r.label.trim() ? r.label.trim() : null,
    url: typeof r.url === 'string' ? r.url : null,
  };
}

function normalizeCycle(c: unknown): PublicCycle | null {
  if (!c || typeof c !== 'object') return null;
  const r = c as Record<string, unknown>;
  if (typeof r.id !== 'string') return null;
  const milestones = Array.isArray(r.milestones)
    ? r.milestones.map(normalizeMilestone).filter((m): m is Milestone => m !== null)
    : [];
  return {
    id: r.id,
    label: typeof r.label === 'string' ? r.label : '',
    status: (typeof r.status === 'string' ? r.status : 'announced') as CycleStatus,
    milestones,
    nextMilestone:
      r.nextMilestone && typeof r.nextMilestone === 'object'
        ? (r.nextMilestone as PublicCycle['nextMilestone'])
        : null,
  };
}

const SKU_RE = /^[a-z0-9][a-z0-9-]{0,120}$/i;

function normalizePackage(p: unknown): PublicPackage | null {
  if (!p || typeof p !== 'object') return null;
  const r = p as Record<string, unknown>;
  if (typeof r.sku !== 'string' || !SKU_RE.test(r.sku)) return null;
  if (typeof r.priceMinor !== 'number' || !Number.isFinite(r.priceMinor) || r.priceMinor <= 0) return null;
  return {
    sku: r.sku,
    label: typeof r.label === 'string' && r.label.trim() ? r.label.trim() : null,
    hours: typeof r.hours === 'number' && Number.isFinite(r.hours) ? r.hours : 0,
    priceMinor: Math.round(r.priceMinor),
    currency: typeof r.currency === 'string' && r.currency ? r.currency.toLowerCase() : 'usd',
    href: typeof r.href === 'string' ? r.href : '#writing-competitions',
  };
}

function normalizeOffer(o: unknown): PublicOffer | null {
  if (!o || typeof o !== 'object') return null;
  const r = o as Record<string, unknown>;
  if (typeof r.type !== 'string') return null;
  return {
    type: r.type as OfferType,
    href: typeof r.href === 'string' && r.href.trim() ? r.href.trim() : null,
    ctaLabel: typeof r.ctaLabel === 'string' ? r.ctaLabel : 'Tell me more',
    blurb: typeof r.blurb === 'string' && r.blurb.trim() ? r.blurb.trim() : null,
    startsAt: typeof r.startsAt === 'string' && ISO_DATE_RE.test(r.startsAt) ? r.startsAt : null,
    closesAt: typeof r.closesAt === 'string' && ISO_DATE_RE.test(r.closesAt) ? r.closesAt : null,
    packages: Array.isArray(r.packages)
      ? r.packages.map(normalizePackage).filter((p): p is PublicPackage => p !== null)
      : [],
    priceFrom:
      r.priceFrom && typeof r.priceFrom === 'object' ? (r.priceFrom as PublicOffer['priceFrom']) : null,
    cycleId: typeof r.cycleId === 'string' ? r.cycleId : null,
  };
}

// Fill in the optional shape so page code can rely on every field existing.
function normalize(c: PublicCompetition): PublicCompetition {
  const raw = c as unknown as Record<string, unknown>;
  return {
    slug: c.slug,
    name: c.name,
    shortName: typeof c.shortName === 'string' && c.shortName.trim() ? c.shortName : c.name,
    kind: c.kind,
    cadence: typeof c.cadence === 'string' && CADENCES.has(c.cadence) ? c.cadence : 'annual',
    organiserName: c.organiserName ?? null,
    organiserUrl: c.organiserUrl ?? null,
    subjects: Array.isArray(c.subjects) ? c.subjects.filter((s) => typeof s === 'string') : [],
    eligibility: c.eligibility && typeof c.eligibility === 'object' ? c.eligibility : {},
    eligibilityNote:
      typeof c.eligibilityNote === 'string' && c.eligibilityNote.trim() ? c.eligibilityNote.trim() : null,
    entry: c.entry && typeof c.entry === 'object' ? c.entry : {},
    blurb: typeof c.blurb === 'string' && c.blurb.trim() ? c.blurb.trim() : null,
    content: Array.isArray(c.content) ? c.content : [],
    heroImageUrl: c.heroImageUrl ?? null,
    cycles: Array.isArray(c.cycles)
      ? c.cycles.map(normalizeCycle).filter((cy): cy is PublicCycle => cy !== null)
      : [],
    offer: normalizeOffer(raw.offer),
    verifiedAt: typeof c.verifiedAt === 'string' ? c.verifiedAt : null,
    preview: Boolean(c.preview),
  };
}

/** The bundled catalogue, already resolved to this brand's offer. */
export const SEED_COMPETITIONS: PublicCompetition[] = (seed.competitions as unknown[])
  .filter(isCompetition)
  .map(normalize);

export const SEED_SLUGS: ReadonlySet<string> = new Set(SEED_COMPETITIONS.map((c) => c.slug));

/**
 * Public listing for this brand. Any failure (network, non-OK, bad JSON) or an
 * empty list falls back to the bundled seed, so callers always get something
 * to render. Log lines say which happened.
 */
export async function getCompetitions(opts: FetchOpts = {}): Promise<PublicCompetition[]> {
  const live = await fetchCatalogue(opts);
  if (live === null) return SEED_COMPETITIONS;
  return live.length > 0 ? live : SEED_COMPETITIONS;
}

/**
 * The live catalogue only: null when the API cannot be read (network, non-OK,
 * bad JSON). Checkout uses this so a ClassDesk outage refuses the sale rather
 * than charging a price from the bundled seed.
 */
export async function fetchCatalogue(opts: FetchOpts = {}): Promise<PublicCompetition[] | null> {
  try {
    const res = await fetch(url('/competitions', opts.preview), cacheOptions(opts));
    if (!res.ok) {
      console.error('[competitions] list failed:', res.status);
      return null;
    }
    const data = (await res.json()) as { competitions?: unknown };
    if (!Array.isArray(data.competitions)) return null;
    return data.competitions.filter(isCompetition).map(normalize);
  } catch (e) {
    console.error('[competitions] list error:', e instanceof Error ? e.message : e);
    return null;
  }
}

/** One competition by slug. 404 / failure → null. */
export async function getCompetition(
  slug: string,
  opts: FetchOpts = {},
): Promise<PublicCompetition | null> {
  if (!SKU_RE.test(slug)) return null;
  try {
    const res = await fetch(url(`/competitions/${encodeURIComponent(slug)}`, opts.preview), cacheOptions(opts));
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error('[competitions] detail failed:', slug, res.status);
      return null;
    }
    const data = (await res.json()) as { competition?: unknown };
    return isCompetition(data.competition) ? normalize(data.competition) : null;
  } catch (e) {
    console.error('[competitions] detail error:', slug, e instanceof Error ? e.message : e);
    return null;
  }
}

export interface WritingPackageMatch {
  competition: PublicCompetition;
  package: PublicPackage;
}

/**
 * Server-side price source for a writing package in the cart. Reads the live
 * wsdc catalogue uncached (or the caller's preloaded copy) and returns the
 * competition + package whose sku matches, honouring effectiveOffer: once our
 * own registration close date has passed the package is gone and this returns
 * null, so a stale cart line cannot be paid for.
 */
export async function resolveWritingPackage(
  sku: string,
  opts: { catalogue?: PublicCompetition[] | null; today?: string } = {},
): Promise<WritingPackageMatch | null> {
  if (!SKU_RE.test(sku)) return null;
  const catalogue = opts.catalogue === undefined ? await fetchCatalogue({ noStore: true }) : opts.catalogue;
  if (!catalogue) return null;
  const today = opts.today ?? todayIso();
  for (const competition of catalogue) {
    const offer = effectiveOffer(competition, today);
    const pkg = offer?.packages.find((p) => p.sku === sku);
    if (pkg) return { competition, package: pkg };
  }
  return null;
}

/** True when the sku is listed on a competition regardless of the close date (for a "closed" message). */
export function isListedWritingSku(catalogue: PublicCompetition[], sku: string): PublicCompetition | null {
  return catalogue.find((c) => c.offer?.packages.some((p) => p.sku === sku)) ?? null;
}

export interface InterestPayload {
  competitionSlugs: string[];
  cycleId?: string;
  parentName?: string;
  parentEmail: string;
  parentPhone?: string;
  studentName?: string;
  grade?: string;
  source: string;
  attribution?: Record<string, string>;
}

export type InterestResult =
  | { ok: true; ids: string[] }
  | { ok: false; status: number; error: string };

/** Forward an interest registration. Never throws; status 0 = network failure. */
export async function registerInterest(payload: InterestPayload): Promise<InterestResult> {
  try {
    const res = await fetch(`${API_BASE}/competitions/interest`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand: COMPETITION_BRAND, ...payload }),
    });
    const data = (await res.json().catch(() => ({}))) as { ids?: unknown; error?: unknown };
    if (res.ok) {
      return { ok: true, ids: Array.isArray(data.ids) ? data.ids.filter((v): v is string => typeof v === 'string') : [] };
    }
    return { ok: false, status: res.status, error: typeof data.error === 'string' ? data.error : 'unknown' };
  } catch (e) {
    console.error('[competitions] interest error:', e instanceof Error ? e.message : e);
    return { ok: false, status: 0, error: 'network' };
  }
}

// ---- Presentation helpers (pure) ----

/** Today as an ISO date in UTC. Deadlines are date-level so this is close enough. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** "25 Oct 2026", plus " (expected)" when the organiser has not confirmed it. */
export function formatCompetitionDate(iso: string, confirmed = true): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  const text = d.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return confirmed ? text : `${text} (expected)`;
}

const LIVE_CYCLE_STATUSES = new Set<CycleStatus>(['projected', 'announced', 'open']);

/**
 * The next milestone a family can still act on: the earliest one on or after
 * today, preferring cycles that are still live (a closed cycle's Defense Day
 * is not a reason to sign up). Null for rolling journals and past catalogues.
 */
export function nextMilestone(c: PublicCompetition, today = todayIso()): NextMilestone | null {
  const candidates: NextMilestone[] = [];
  const fallback: NextMilestone[] = [];
  for (const cycle of c.cycles) {
    if (cycle.status === 'cancelled') continue;
    const bucket = LIVE_CYCLE_STATUSES.has(cycle.status) ? candidates : fallback;
    const source: { key: MilestoneKey; at: string; confirmed: boolean; label: string | null }[] =
      cycle.milestones.length > 0 ? cycle.milestones : cycle.nextMilestone ? [cycle.nextMilestone] : [];
    for (const m of source) {
      if (m.at >= today) bucket.push({ key: m.key, at: m.at, confirmed: m.confirmed, label: m.label, cycleLabel: cycle.label });
    }
  }
  const pool = candidates.length > 0 ? candidates : fallback;
  if (pool.length === 0) return null;
  pool.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  return pool[0];
}

const DEFAULT_MILESTONE_LABELS: Record<MilestoneKey, string> = {
  announcement: 'Questions released',
  reg_opens: 'Registration opens',
  reg_closes: 'Registration closes',
  submission_due: 'Submission due',
  shortlist: 'Shortlist announced',
  event: 'Event',
  results: 'Results',
  window_opens: 'Submissions open',
  window_closes: 'Submissions close',
};

const CLOSING_KEYS = new Set<MilestoneKey>(['reg_closes', 'submission_due', 'window_closes']);

/**
 * One line for the list: "Register with HIR by 25 Oct 2026", "2027 dates
 * expected", "Rolling submissions".
 */
export function milestoneLine(c: PublicCompetition, today = todayIso()): string {
  const next = nextMilestone(c, today);
  if (!next) return c.cadence === 'rolling' ? 'Rolling submissions' : 'Next dates to be announced';
  if (!next.confirmed) {
    const label = next.cycleLabel.trim();
    return label ? `${label} dates expected` : 'Next dates expected';
  }
  const label = next.label || DEFAULT_MILESTONE_LABELS[next.key] || 'Next date';
  const date = formatCompetitionDate(next.at, true);
  if (CLOSING_KEYS.has(next.key) && !/\b(due|deadline)$/i.test(label)) return `${label} by ${date}`;
  return `${label} ${date}`;
}

export const NEXT_SEASON_CTA = 'Tell me about the next season';

/**
 * The offer as a family should see it today. Once our own registration close
 * date has passed, the course link is replaced by an interest offer so the
 * section never sends a click to a course that no longer takes sign-ups.
 */
export function effectiveOffer(c: PublicCompetition, today = todayIso()): PublicOffer | null {
  const o = c.offer;
  if (!o) return null;
  if (o.closesAt && o.closesAt < today) {
    return {
      type: 'interest',
      href: null,
      ctaLabel: NEXT_SEASON_CTA,
      blurb: o.blurb,
      startsAt: null,
      closesAt: null,
      packages: [],
      priceFrom: null,
      cycleId: o.cycleId,
    };
  }
  return o;
}

/** "$1,200" from minor units. */
export function formatPackagePrice(p: Pick<PublicPackage, 'priceMinor'>): string {
  const usd = p.priceMinor / 100;
  return `$${usd.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(usd) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Cart/metadata display name for a package line: "The Schola · 10 hours". */
export function writingLineName(c: Pick<PublicCompetition, 'name'>, p: Pick<PublicPackage, 'label' | 'hours'>): string {
  const label = p.label ?? (p.hours > 0 ? `${p.hours} hours` : 'Package');
  return `${c.name} · ${label}`;
}

export type KindTag = 'Essay' | 'Journal' | 'Team';

/** Small tag for the list: team competitions read as "Team" whatever their kind. */
export function kindTag(c: PublicCompetition): KindTag {
  if (c.entry?.teamSize) return 'Team';
  return c.kind === 'journal' ? 'Journal' : 'Essay';
}

/** First sentence of the blurb, for a one-line list row. */
export function oneLineBlurb(c: PublicCompetition): string | null {
  if (!c.blurb) return null;
  const m = c.blurb.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : c.blurb).trim();
}
