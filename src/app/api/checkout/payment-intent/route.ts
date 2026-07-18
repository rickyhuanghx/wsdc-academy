// Creates the Stripe PaymentIntent for /checkout. Prices are always
// re-resolved from src/data/programs.ts — client-sent amounts are never
// trusted. Buyer + per-student info ride along as intent metadata; the
// webhook turns them into the Supabase orders row after payment succeeds.

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getProgramById, GRADE_LEVELS } from '@/data/programs';
import { isRateLimited, getClientIp, isValidEmail, HONEYPOT_FIELD } from '@/lib/leads';

export const runtime = 'nodejs';

const MAX_ITEMS = 12;
const VALID_GRADES = new Set<string>(GRADE_LEVELS);

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

function sanitize(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function isNonEmptyString(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

type IncomingItem = { programId?: unknown; studentInfo?: unknown };
type StudentInfoIn = { name?: unknown; gradeLevel?: unknown; school?: unknown };

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

  const { items, buyer } = body as { items?: IncomingItem[]; buyer?: Record<string, unknown> };

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

  // Resolve each cart line server-side.
  type LineItem = {
    programId: string;
    programName: string;
    unitLabel: string;
    amount: number; // USD
    studentName: string;
    studentGrade: string;
    studentSchool: string;
  };
  const resolved: LineItem[] = [];
  for (const item of items) {
    if (typeof item.programId !== 'string') return jsonError(400, 'Invalid cart item');
    const program = getProgramById(item.programId);
    if (!program) return jsonError(400, `Unknown program: ${item.programId}`);
    if (program.invitationOnly) {
      return jsonError(400, `${program.name} is invitation only and not available for online checkout`);
    }

    const si = (item.studentInfo || {}) as StudentInfoIn;
    if (!isNonEmptyString(si.name, 200)) {
      return jsonError(400, `Student name is required for ${program.name}`);
    }
    if (typeof si.gradeLevel !== 'string' || !VALID_GRADES.has(si.gradeLevel)) {
      return jsonError(400, `Student grade is required for ${program.name}`);
    }
    if (!isNonEmptyString(si.school, 200)) {
      return jsonError(400, `Student school is required for ${program.name}`);
    }

    resolved.push({
      programId: program.id,
      programName: program.name,
      unitLabel: program.enrollment.unitLabel,
      amount: program.enrollment.amount,
      studentName: sanitize(si.name, 200),
      studentGrade: si.gradeLevel,
      studentSchool: sanitize(si.school, 200),
    });
  }

  const totalMinor = resolved.reduce((sum, r) => sum + Math.round(r.amount * 100), 0);

  // Per-student metadata keys (student_0, student_1, …): each Stripe metadata
  // value caps at 500 chars, so one key per line avoids truncating multi-kid
  // carts the way a single JSON blob would.
  const metadata: Record<string, string> = {
    // Central CRM attribution keys: every brand checkout stamps these.
    brand: 'wsdc',
    course_id: resolved.map((r) => r.programId).join(','),
    parentName: sanitize(parentName, 200),
    phone: typeof phone === 'string' ? sanitize(phone, 50) : '',
    programIds: resolved.map((r) => r.programId).join(','),
    programNames: resolved
      .map((r) => r.programName)
      .join(' | ')
      .slice(0, 500),
  };
  resolved.forEach((r, i) => {
    metadata[`student_${i}`] = JSON.stringify({
      name: r.studentName,
      gradeLevel: r.studentGrade,
      school: r.studentSchool,
      programId: r.programId,
    }).slice(0, 500);
  });

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: totalMinor,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: sanitize(email, 254).toLowerCase(),
      description: resolved.map((r) => r.programName).join(', ').slice(0, 500),
      metadata,
    });

    if (!intent.client_secret) {
      console.error('[payment-intent] stripe returned no client_secret:', intent.id);
      return jsonError(500, 'Could not start checkout. Please try again.');
    }

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e) {
    console.error('[payment-intent] stripe error:', e);
    return jsonError(500, 'Could not start checkout. Please try again.');
  }
}
