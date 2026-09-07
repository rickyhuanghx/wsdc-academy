// Creates the Stripe PaymentIntent for /checkout. Prices are always
// re-resolved server-side — program lines from src/data/programs.ts,
// tournament entries from the ClassDesk public API — client-sent amounts are
// never trusted. Buyer + per-student info ride along as intent metadata; the
// webhook turns them into the Supabase orders row after payment succeeds.

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import {
  getProgramById,
  getEnrollmentOptions,
  labelForEnrollmentIds,
  resolveOneOnOne,
  GRADE_LEVELS,
} from '@/data/programs';
import { isRateLimited, getClientIp, isValidEmail, HONEYPOT_FIELD } from '@/lib/leads';
import { isValidPromoCode, normalizePromoCode, promoDiscount } from '@/lib/promo';
import { checkTournament, cleanPreviewToken, getTournament, priceUsd, type PublicTournament } from '@/lib/tournaments';

export const runtime = 'nodejs';

const MAX_ITEMS = 12;
const VALID_GRADES = new Set<string>(GRADE_LEVELS);
const TOURNAMENT_PREFIX = 'tournament:';
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,120}$/i;
const DOB_RE = /^\d{4}-\d{2}-\d{2}$/;
// Attribution values that may be stamped on the intent (Central CRM contract).
const TAG_RE = /^[A-Za-z0-9_.-]{1,200}$/;

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

function sanitize(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function isNonEmptyString(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

// Whole years between a YYYY-MM-DD date and today (UTC); NaN for an invalid date.
function ageFromDob(dob: string): number {
  const d = new Date(`${dob}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== dob) return NaN;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age -= 1;
  return age;
}

type IncomingItem = {
  programId?: unknown;
  studentInfo?: unknown;
  variantId?: unknown;
  quantity?: unknown;
  ageGroup?: unknown;
  timeSlot?: unknown;
  kind?: unknown;
  tournamentSlug?: unknown;
};
type StudentInfoIn = { name?: unknown; gradeLevel?: unknown; school?: unknown; dob?: unknown };

function tournamentSlugOf(item: IncomingItem): string | null {
  if (typeof item.tournamentSlug === 'string' && item.tournamentSlug) return item.tournamentSlug;
  if (typeof item.programId === 'string' && item.programId.startsWith(TOURNAMENT_PREFIX)) {
    return item.programId.slice(TOURNAMENT_PREFIX.length);
  }
  return null;
}

function isTournamentLine(item: IncomingItem): boolean {
  return item.kind === 'tournament' || tournamentSlugOf(item) !== null;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  // Honeypot: silent success for bots.
  if (typeof body[HONEYPOT_FIELD] === 'string' && (body[HONEYPOT_FIELD] as string).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip, 'payment-intent')) {
    return jsonError(429, 'Too many requests. Please try again shortly.');
  }

  const { items, buyer, promoCode, attribution, preview: previewRaw, existingStudent: existingStudentRaw } = body as {
    items?: IncomingItem[];
    buyer?: Record<string, unknown>;
    promoCode?: unknown;
    attribution?: unknown;
    preview?: unknown;
    existingStudent?: unknown;
  };
  const existingStudentClaimed = existingStudentRaw === true;
  // Preview token (staff testing placeholder tournaments): the API validates it.
  const preview = cleanPreviewToken(previewRaw);

  if (!Array.isArray(items) || items.length === 0) return jsonError(400, 'Cart is empty');
  if (items.length > MAX_ITEMS) return jsonError(400, 'Too many items in cart');
  if (!buyer || typeof buyer !== 'object') return jsonError(400, 'Buyer details are required');

  const { parentName, email, phone } = buyer;
  if (!isNonEmptyString(parentName, 200)) return jsonError(400, 'Parent name is required');
  if (typeof email !== 'string' || !isValidEmail(email) || email.length > 254) {
    return jsonError(400, 'Valid email is required');
  }
  if (phone !== undefined && phone !== null && phone !== '' && !isNonEmptyString(phone, 50)) {
    return jsonError(400, 'Invalid phone');
  }

  // Tournament entries and class enrollments are fulfilled by different
  // systems (ClassDesk vs. our own webhook emails), so one intent = one kind.
  const tournamentLines = items.filter(isTournamentLine).length;
  if (tournamentLines > 0 && tournamentLines < items.length) {
    return jsonError(400, 'Please check out tournament entries separately from classes.');
  }
  const isTournamentCart = tournamentLines > 0;

  // Promo code: optional; if present it must be a code we recognise.
  if (promoCode !== undefined && promoCode !== null && typeof promoCode !== 'string') {
    return jsonError(400, 'Invalid promo code.');
  }
  const promo = normalizePromoCode(promoCode);
  if (promo && !isValidPromoCode(promo)) {
    return jsonError(400, 'That promo code is not valid.');
  }
  if (promo && isTournamentCart) {
    return jsonError(400, 'Promo codes do not apply to tournament entries.');
  }

  // Resolve each cart line server-side.
  type LineItem = {
    programId: string;
    programName: string;
    unitLabel: string;
    amount: number; // USD
    studentName: string;
    studentGrade: string;
    studentSchool: string;
    studentDob?: string;
    tournamentSlug?: string;
    variantId?: string;
    ageGroupLabel?: string;
    timeSlotLabel?: string;
    promoEligible: boolean;
  };
  const resolved: LineItem[] = [];
  let diagnosticCount = 0;
  // One uncached API read per tournament slug, shared across sibling lines.
  const tournamentCache = new Map<string, PublicTournament | null>();

  for (const item of items) {
    const si = (item.studentInfo || {}) as StudentInfoIn;

    if (isTournamentCart) {
      const slug = tournamentSlugOf(item);
      if (!slug || !SLUG_RE.test(slug)) return jsonError(400, 'Invalid tournament entry');
      if (!tournamentCache.has(slug)) {
        tournamentCache.set(slug, await getTournament(slug, { noStore: true, preview }));
      }
      const t = tournamentCache.get(slug);
      if (!t) return jsonError(400, 'That tournament is no longer available.');
      if (t.status !== 'open') {
        return jsonError(
          400,
          t.status === 'full'
            ? `${t.name} is full. You can join the waitlist on the tournament page.`
            : `Registration for ${t.name} is not open.`,
        );
      }
      if ((t.price.currency || '').toLowerCase() !== 'usd') {
        return jsonError(400, `${t.name} is not priced in USD and cannot be paid for here.`);
      }

      if (typeof si.name !== 'string' || si.name.trim().length < 2 || si.name.trim().length > 80) {
        return jsonError(400, `Student full name is required for ${t.name}`);
      }
      if (typeof si.gradeLevel !== 'string' || !VALID_GRADES.has(si.gradeLevel)) {
        return jsonError(400, `Student grade is required for ${t.name}`);
      }
      if (!isNonEmptyString(si.school, 200)) {
        return jsonError(400, `Student school is required for ${t.name}`);
      }
      if (typeof si.dob !== 'string' || !DOB_RE.test(si.dob)) {
        return jsonError(400, `Student date of birth is required for ${t.name}`);
      }
      const age = ageFromDob(si.dob);
      if (!(age >= 4 && age <= 25)) {
        return jsonError(400, `Please check the date of birth for ${sanitize(si.name, 80)}.`);
      }

      resolved.push({
        programId: `${TOURNAMENT_PREFIX}${t.slug}`,
        programName: t.name,
        unitLabel: 'Tournament entry',
        amount: priceUsd(t),
        studentName: sanitize(si.name, 80),
        studentGrade: si.gradeLevel,
        studentSchool: sanitize(si.school, 200),
        studentDob: si.dob,
        tournamentSlug: t.slug,
        promoEligible: false,
      });
      continue;
    }

    if (typeof item.programId !== 'string') return jsonError(400, 'Invalid cart item');
    const program = getProgramById(item.programId);
    if (!program) return jsonError(400, `Unknown program: ${item.programId}`);
    if (program.invitationOnly) {
      return jsonError(400, `${program.name} is invitation only and not available for online checkout`);
    }

    if (!isNonEmptyString(si.name, 200)) {
      return jsonError(400, `Student name is required for ${program.name}`);
    }
    if (typeof si.gradeLevel !== 'string' || !VALID_GRADES.has(si.gradeLevel)) {
      return jsonError(400, `Student grade is required for ${program.name}`);
    }
    if (!isNonEmptyString(si.school, 200)) {
      return jsonError(400, `Student school is required for ${program.name}`);
    }

    // Price + unit label: 1-on-1 sells variants; everything else sells the
    // program's fixed enrollment unit. Prices are always re-resolved here.
    let amount: number;
    let unitLabel: string;
    let variantId: string | undefined;
    let ageGroupLabel: string | undefined;
    let timeSlotLabel: string | undefined;

    if (program.oneOnOne) {
      if (typeof item.variantId !== 'string') {
        return jsonError(400, `A 1-on-1 option is required for ${program.name}`);
      }
      const quantity = typeof item.quantity === 'number' ? item.quantity : undefined;
      const r = resolveOneOnOne(program, item.variantId, quantity);
      if (!r) return jsonError(400, `Invalid 1-on-1 selection for ${program.name}`);
      amount = r.amount;
      unitLabel = r.unitLabel;
      variantId = item.variantId;
      if (item.variantId === program.oneOnOne.diagnostic.id) diagnosticCount += 1;
    } else {
      amount = program.enrollment.amount;
      unitLabel = program.enrollment.unitLabel;
      // Group / bootcamp programs require an age band + time slot choice.
      const opts = getEnrollmentOptions(program);
      if (opts) {
        if (typeof item.ageGroup !== 'string' || typeof item.timeSlot !== 'string') {
          return jsonError(400, `Select an age group and time for ${program.name}`);
        }
        const labels = labelForEnrollmentIds(program, item.ageGroup, item.timeSlot);
        if (!labels) return jsonError(400, `Invalid age or time selection for ${program.name}`);
        ageGroupLabel = labels.ageLabel;
        timeSlotLabel = labels.timeLabel;
      }
    }

    resolved.push({
      programId: program.id,
      programName: program.name,
      unitLabel,
      amount,
      studentName: sanitize(si.name, 200),
      studentGrade: si.gradeLevel,
      studentSchool: sanitize(si.school, 200),
      variantId,
      ageGroupLabel,
      timeSlotLabel,
      // RETURNER27 excludes 1-on-1 coaching; every other line is an online class.
      promoEligible: !program.oneOnOne,
    });
  }

  // The diagnostic 1-on-1 session is a one-time purchase.
  if (diagnosticCount > 1) {
    return jsonError(400, 'The diagnostic session can only be purchased once.');
  }

  // Tournament carts: one tournament per intent (the metadata contract carries a
  // single tournament_id), and the API has the last word on eligibility + seats.
  let tournament: PublicTournament | null = null;
  let existingDiscountMinor = 0;
  let existingPct = 0;
  let existingVerified = false;
  if (isTournamentCart) {
    const slugs = Array.from(new Set(resolved.map((r) => r.tournamentSlug!)));
    if (slugs.length > 1) {
      return jsonError(400, 'Please check out one tournament at a time.');
    }
    tournament = tournamentCache.get(slugs[0]) ?? null;
    if (!tournament) return jsonError(400, 'That tournament is no longer available.');

    const check = await checkTournament(
      slugs[0],
      resolved.map((r) => ({ dob: r.studentDob, grade: r.studentGrade })),
      preview,
    );
    if (!check) {
      return jsonError(500, 'Could not confirm tournament availability. Please try again.');
    }
    if (!check.canRegister) {
      const ineligible = check.students.find((s) => s && s.eligible === false && s.reasons?.length);
      const reason =
        ineligible?.reasons[0] ||
        (check.closed
          ? 'Registration has closed'
          : check.seatsLeft !== null && check.seatsLeft < resolved.length
            ? `Only ${check.seatsLeft} ${check.seatsLeft === 1 ? 'seat' : 'seats'} left`
            : 'Registration is not available right now');
      return jsonError(400, reason);
    }
    if ((check.price.currency || '').toLowerCase() !== 'usd') {
      return jsonError(400, `${tournament.name} is not priced in USD and cannot be paid for here.`);
    }
    // The check response is the freshest price; apply it to every line.
    const amount = Math.round(check.price.amountMinor) / 100;
    for (const r of resolved) r.amount = amount;
    // Existing-student discount: the parent selected it; ClassDesk says whether
    // the email is on file (order or enrollment with any brand). Either way the
    // discount applies; the entry is stamped verified / claimed for the admin.
    const pct = Math.max(0, Math.min(100, check.existingStudentDiscountPct ?? tournament.existingStudentDiscountPct ?? 0));
    if (existingStudentClaimed && pct > 0) {
      existingDiscountMinor = resolved.length * Math.round(check.price.amountMinor * (pct / 100));
      existingPct = pct;
      const verify = await checkTournament(slugs[0], [], preview, sanitize(email, 254).toLowerCase());
      existingVerified = verify?.existingStudent === true;
    }
  }

  const totalMinor = resolved.reduce((sum, r) => sum + Math.round(r.amount * 100), 0);

  // Discount is recomputed here from the resolved lines — never taken from the client.
  const discountMinor = promo
    ? Math.round(
        promoDiscount(promo, resolved.map((r) => ({ amount: r.amount, eligible: r.promoEligible }))) * 100,
      )
    : 0;
  if (promo && discountMinor === 0) {
    return jsonError(400, `${promo} does not apply to anything in this cart (1-on-1 coaching is excluded).`);
  }
  const chargeMinor = totalMinor - discountMinor - existingDiscountMinor;
  if (chargeMinor <= 0) return jsonError(400, 'Nothing to charge.');

  // Per-student metadata keys (student_0, student_1, …): each Stripe metadata
  // value caps at 500 chars, so one key per line avoids truncating multi-kid
  // carts the way a single JSON blob would.
  const metadata: Record<string, string> = {
    // Central CRM attribution keys: every brand checkout stamps these.
    brand: 'wsdc',
    parentName: sanitize(parentName, 200),
    phone: typeof phone === 'string' ? sanitize(phone, 50) : '',
  };
  if (tournament) {
    metadata.tournament_id = tournament.slug;
    metadata.tournament_name = tournament.name.slice(0, 500);
    metadata.source = 'wsdc-site';
    metadata.caller = 'checkout';
  } else {
    metadata.course_id = resolved.map((r) => r.programId).join(',');
    metadata.programIds = resolved.map((r) => r.programId).join(',');
    metadata.programNames = resolved
      .map((r) => r.programName)
      .join(' | ')
      .slice(0, 500);
  }
  if (promo) {
    metadata.promo_code = promo;
    metadata.discount_amount = (discountMinor / 100).toFixed(2);
  }
  if (existingDiscountMinor > 0) {
    metadata.promo_code = `EXISTING${existingPct}`;
    metadata.discount_amount = (existingDiscountMinor / 100).toFixed(2);
    metadata.existing_student = existingVerified ? 'verified' : 'claimed';
  }
  // Ad / campaign attribution from the browser (sessionStorage via analytics.ts).
  // Only well-formed, non-empty values are stamped.
  if (attribution && typeof attribution === 'object') {
    const a = attribution as Record<string, unknown>;
    const pairs: [string, unknown][] = [
      ['utm_source', a.utmSource ?? a.utm_source],
      ['utm_medium', a.utmMedium ?? a.utm_medium],
      ['utm_campaign', a.utmCampaign ?? a.utm_campaign],
      ['gclid', a.gclid],
      ['fbclid', a.fbclid],
    ];
    for (const [key, v] of pairs) {
      if (typeof v === 'string' && TAG_RE.test(v)) metadata[key] = v;
    }
  }
  resolved.forEach((r, i) => {
    metadata[`student_${i}`] = JSON.stringify(
      r.tournamentSlug
        ? {
            name: r.studentName,
            dob: r.studentDob,
            gradeLevel: r.studentGrade,
            school: r.studentSchool,
          }
        : {
            name: r.studentName,
            gradeLevel: r.studentGrade,
            school: r.studentSchool,
            programId: r.programId,
            unitLabel: r.unitLabel,
            ...(r.ageGroupLabel ? { ageGroup: r.ageGroupLabel } : {}),
            ...(r.timeSlotLabel ? { timeSlot: r.timeSlotLabel } : {}),
          },
    ).slice(0, 500);
  });

  const description = tournament
    ? `${tournament.name} — ${resolved.length} ${resolved.length === 1 ? 'entry' : 'entries'}`.slice(0, 500)
    : resolved.map((r) => r.programName).join(', ').slice(0, 500);

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: chargeMinor,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: sanitize(email, 254).toLowerCase(),
      description,
      metadata,
    });

    if (!intent.client_secret) {
      console.error('[payment-intent] stripe returned no client_secret:', intent.id);
      return jsonError(500, 'Could not start checkout. Please try again.');
    }

    // `amount` (major units) lets the confirmation page report the charged
    // figure — not the undiscounted cart sum — as the purchase conversion value.
    return NextResponse.json({ clientSecret: intent.client_secret, amount: chargeMinor / 100 });
  } catch (e) {
    console.error('[payment-intent] stripe error:', e);
    return jsonError(500, 'Could not start checkout. Please try again.');
  }
}
