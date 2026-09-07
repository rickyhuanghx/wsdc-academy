// Tournament sign-ups: server-side client for the ClassDesk public API.
//
// SERVER ONLY. Import this from server components and route handlers, never
// from a 'use client' file: the CSP connect-src allowlist in next.config.ts
// would block a browser fetch to classroomdesk.com, and the preview token must
// not leak to the client. Every reader degrades to "nothing listed" on failure
// so the public pages render an honest empty state rather than an error.

import { SITE_URL } from '@/lib/site';

export const TOURNAMENT_BRAND = 'wsdc';

const API_BASE = (process.env.CLASSDESK_API_URL || 'https://www.classroomdesk.com/api/public').replace(
  /\/+$/,
  '',
);

// How long the listing / detail pages may serve a cached API response.
export const TOURNAMENT_REVALIDATE_SECONDS = 300;

export type TournamentFormat = 'wsdc' | 'bp' | 'pf' | 'other';
export type TournamentMode = 'online' | 'in_person';
export type TournamentStatus =
  | 'draft'
  | 'interest'
  | 'invite_only'
  | 'upcoming'
  | 'open'
  | 'full'
  | 'closed'
  | 'cancelled'
  | 'completed';

export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'faq'; q: string; a: string }
  | { type: 'schedule'; rows: { label: string; starts_at: string; ends_at?: string }[] };

export interface TournamentEligibility {
  min_age?: number;
  max_age?: number;
  age_on?: string; // YYYY-MM-DD the age is measured on
  min_grade?: number;
  max_grade?: number;
}

export interface TournamentPrice {
  amountMinor: number;
  currency: string; // lowercase ISO code, e.g. 'usd'
}

export interface PublicTournament {
  slug: string;
  name: string;
  format: TournamentFormat;
  mode: TournamentMode;
  venue: string | null;
  timezone: string; // IANA
  startsAt: string; // ISO
  endsAt: string; // ISO
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  status: TournamentStatus;
  seatsLeft: number | null;
  capacity: number | null;
  price: TournamentPrice;
  /** % off per entry for families already enrolled with any of our brands */
  existingStudentDiscountPct: number;
  blurb: string | null;
  content: ContentBlock[];
  heroImageUrl: string | null;
  eligibility: TournamentEligibility;
  eligibilityNote: string | null;
  teamSize: number;
  organiserName: string | null;
  organiserUrl: string | null;
  preview: boolean;
}

export interface CheckStudentIn {
  dob?: string; // YYYY-MM-DD
  grade?: string;
}

export interface CheckResult {
  status: TournamentStatus;
  closed: boolean;
  seatsLeft: number | null;
  canRegister: boolean;
  waitlistAvailable: boolean;
  students: { eligible: boolean; reasons: string[]; unknown: string[] }[];
  price: TournamentPrice;
  existingStudentDiscountPct?: number;
  /** null when no email was sent; true when the email has an order or enrollment with any brand */
  existingStudent?: boolean | null;
}

export interface WaitlistPayload {
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  students: { name: string; dob?: string; grade?: string; school?: string }[];
  source?: string;
  utm?: Record<string, string>;
}

export type WaitlistResult =
  | { ok: true; entries: { id: string; status: string }[] }
  | { ok: false; status: number; error: string; fields?: string[] };

type FetchOpts = { preview?: string };

// Only a well-formed token goes to the API; anything else is treated as "no preview".
export function cleanPreviewToken(raw: unknown): string | undefined {
  if (typeof raw === 'string') {
    const v = raw.trim();
    if (/^[A-Za-z0-9_-]{8,200}$/.test(v)) return v;
  }
  // Local development only: TOURNAMENT_PREVIEW_TOKEN in .env.local shows the
  // hidden catalogue without a query string. Never applied in production.
  if (process.env.NODE_ENV !== 'production') {
    const dev = process.env.TOURNAMENT_PREVIEW_TOKEN?.trim();
    if (dev && /^[A-Za-z0-9_-]{8,200}$/.test(dev)) return dev;
  }
  return undefined;
}

function url(path: string, preview?: string): string {
  const u = new URL(`${API_BASE}${path}`);
  u.searchParams.set('brand', TOURNAMENT_BRAND);
  if (preview) u.searchParams.set('preview', preview);
  return u.toString();
}

function cacheOptions(preview?: string): RequestInit {
  return preview
    ? { cache: 'no-store' }
    : { next: { revalidate: TOURNAMENT_REVALIDATE_SECONDS } };
}

function isTournament(value: unknown): value is PublicTournament {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.slug === 'string' &&
    typeof t.name === 'string' &&
    typeof t.status === 'string' &&
    typeof t.startsAt === 'string' &&
    typeof t.timezone === 'string' &&
    !!t.price &&
    typeof t.price === 'object'
  );
}

// Fill in the optional shape so page code can rely on every field existing.
function normalize(t: PublicTournament): PublicTournament {
  return {
    ...t,
    venue: t.venue ?? null,
    endsAt: t.endsAt ?? t.startsAt,
    registrationOpensAt: t.registrationOpensAt ?? null,
    registrationClosesAt: t.registrationClosesAt ?? null,
    seatsLeft: typeof t.seatsLeft === 'number' ? t.seatsLeft : null,
    capacity: typeof t.capacity === 'number' ? t.capacity : null,
    blurb: t.blurb ?? null,
    existingStudentDiscountPct: typeof t.existingStudentDiscountPct === 'number' && t.existingStudentDiscountPct > 0 ? Math.min(100, t.existingStudentDiscountPct) : 0,
    content: Array.isArray(t.content) ? t.content : [],
    heroImageUrl: t.heroImageUrl ?? null,
    eligibility: t.eligibility && typeof t.eligibility === 'object' ? t.eligibility : {},
    eligibilityNote: typeof t.eligibilityNote === 'string' && t.eligibilityNote.trim() ? t.eligibilityNote.trim() : null,
    teamSize: typeof t.teamSize === 'number' ? t.teamSize : 1,
    organiserName: t.organiserName ?? null,
    organiserUrl: t.organiserUrl ?? null,
    preview: Boolean(t.preview),
    format: t.format ?? 'other',
    mode: t.mode ?? 'online',
  };
}

/** Public listing. Any failure (network, non-OK, bad JSON) → []. */
export async function getTournaments(opts: FetchOpts = {}): Promise<PublicTournament[]> {
  try {
    const res = await fetch(url('/tournaments', opts.preview), cacheOptions(opts.preview));
    if (!res.ok) {
      console.error('[tournaments] list failed:', res.status);
      return [];
    }
    const data = (await res.json()) as { tournaments?: unknown };
    if (!Array.isArray(data.tournaments)) return [];
    return data.tournaments.filter(isTournament).map(normalize);
  } catch (e) {
    console.error('[tournaments] list error:', e);
    return [];
  }
}

/** One tournament by slug. 404 / failure → null. */
export async function getTournament(
  slug: string,
  opts: FetchOpts & { noStore?: boolean } = {},
): Promise<PublicTournament | null> {
  if (!/^[a-z0-9][a-z0-9-]{0,120}$/i.test(slug)) return null;
  try {
    const res = await fetch(
      url(`/tournaments/${encodeURIComponent(slug)}`, opts.preview),
      opts.noStore ? { cache: 'no-store' } : cacheOptions(opts.preview),
    );
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error('[tournaments] detail failed:', slug, res.status);
      return null;
    }
    const data = (await res.json()) as { tournament?: unknown };
    return isTournament(data.tournament) ? normalize(data.tournament) : null;
  } catch (e) {
    console.error('[tournaments] detail error:', slug, e);
    return null;
  }
}

/**
 * Eligibility + capacity check for a set of students. Always uncached — it is
 * the last word before a PaymentIntent is created. Returns null on failure so
 * the caller can refuse rather than guess.
 */
export async function checkTournament(
  slug: string,
  students: CheckStudentIn[],
  preview?: string,
  parentEmail?: string,
): Promise<CheckResult | null> {
  try {
    const res = await fetch(url(`/tournaments/${encodeURIComponent(slug)}/check`, preview), {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand: TOURNAMENT_BRAND, students, ...(parentEmail ? { parentEmail } : {}) }),
    });
    if (!res.ok) {
      console.error('[tournaments] check failed:', slug, res.status);
      return null;
    }
    const data = (await res.json()) as CheckResult;
    if (typeof data.canRegister !== 'boolean' || !data.price) return null;
    return {
      ...data,
      students: Array.isArray(data.students) ? data.students : [],
    };
  } catch (e) {
    console.error('[tournaments] check error:', slug, e);
    return null;
  }
}

/** Forward a waitlist request. Maps the API's 409/422 onto a typed result. */
export async function joinWaitlist(
  slug: string,
  payload: WaitlistPayload,
  preview?: string,
): Promise<WaitlistResult> {
  try {
    const res = await fetch(url(`/tournaments/${encodeURIComponent(slug)}/waitlist`, preview), {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand: TOURNAMENT_BRAND, ...payload }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      entries?: { id: string; status: string }[];
      error?: string;
      fields?: string[];
    };
    if (res.ok && data.ok) {
      return { ok: true, entries: Array.isArray(data.entries) ? data.entries : [] };
    }
    return {
      ok: false,
      status: res.status,
      error: typeof data.error === 'string' ? data.error : 'unknown',
      fields: Array.isArray(data.fields) ? data.fields : undefined,
    };
  } catch (e) {
    console.error('[tournaments] waitlist error:', slug, e);
    return { ok: false, status: 0, error: 'network' };
  }
}

/** Price in USD major units (the checkout only sells in USD). */
export function priceUsd(t: Pick<PublicTournament, 'price'>): number {
  return Math.round(t.price.amountMinor) / 100;
}

/** Price per student for a family already enrolled with us (0 when no discount). */
export function existingStudentPriceUsd(t: Pick<PublicTournament, 'price' | 'existingStudentDiscountPct'>): number {
  const pct = t.existingStudentDiscountPct || 0;
  if (pct <= 0) return priceUsd(t);
  return Math.round(priceUsd(t) * (1 - pct / 100) * 100) / 100;
}

export function formatTournamentPrice(t: Pick<PublicTournament, 'price'>): string {
  const amount = priceUsd(t);
  if (!(amount > 0)) return 'Fee to be announced';
  const cur = (t.price.currency || 'usd').toUpperCase();
  const num = amount.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return cur === 'USD' ? `$${num}` : `${num} ${cur}`;
}

export const FORMAT_LABELS: Record<TournamentFormat, string> = {
  wsdc: 'World Schools',
  bp: 'British Parliamentary',
  pf: 'Public Forum',
  other: 'Debate',
};

export const STATUS_LABELS: Record<TournamentStatus, string> = {
  draft: 'Draft',
  interest: 'Registration not open',
  invite_only: 'Invitation only',
  upcoming: 'Opening soon',
  open: 'Open',
  full: 'Full',
  closed: 'Closed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

/** "Grades 7–12 · Ages 13–18 (on 1 Jan 2027) · Teams of 3" style sentence parts. */
export function eligibilityParts(t: PublicTournament): string[] {
  const e = t.eligibility || {};
  const parts: string[] = [];
  if (e.min_grade !== undefined || e.max_grade !== undefined) {
    if (e.min_grade !== undefined && e.max_grade !== undefined) {
      parts.push(e.min_grade === e.max_grade ? `Grade ${e.min_grade}` : `Grades ${e.min_grade}–${e.max_grade}`);
    } else if (e.min_grade !== undefined) parts.push(`Grade ${e.min_grade} and up`);
    else parts.push(`Up to grade ${e.max_grade}`);
  }
  if (e.min_age !== undefined || e.max_age !== undefined) {
    let ages: string;
    if (e.min_age !== undefined && e.max_age !== undefined) ages = `Ages ${e.min_age}–${e.max_age}`;
    else if (e.min_age !== undefined) ages = `Ages ${e.min_age} and up`;
    else ages = `Up to age ${e.max_age}`;
    if (e.age_on) {
      const d = new Date(`${e.age_on}T00:00:00Z`);
      if (!Number.isNaN(d.getTime())) {
        ages += ` (age on ${d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })})`;
      }
    }
    parts.push(ages);
  }
  if (t.teamSize > 1) parts.push(`Teams of ${t.teamSize}`);
  return parts;
}

/** Bucket for the listing page. */
export function isListedAsOpen(t: PublicTournament): boolean {
  return t.status === 'open' || t.status === 'full' || t.status === 'upcoming' || t.status === 'interest' || t.status === 'invite_only';
}

export function isPast(t: PublicTournament): boolean {
  return t.status === 'completed';
}

// Description for metadata: blurb, else the first paragraph block, else a stock line.
export function tournamentDescription(t: PublicTournament): string {
  const raw =
    t.blurb?.trim() ||
    (t.content.find((b) => b.type === 'paragraph') as { text: string } | undefined)?.text?.trim() ||
    `${t.name}: ${FORMAT_LABELS[t.format]} debate tournament, ${t.mode === 'online' ? 'online' : t.venue || 'in person'}. Register through WSDC Prep.`;
  return raw.length > 160 ? `${raw.slice(0, 157).trimEnd()}...` : raw;
}

export function tournamentUrl(t: Pick<PublicTournament, 'slug'>): string {
  return `${SITE_URL}/tournaments/${t.slug}`;
}
