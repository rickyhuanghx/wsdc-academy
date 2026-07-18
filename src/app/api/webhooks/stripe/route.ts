// Stripe webhook — the fulfillment side of checkout. On payment_intent.succeeded:
// 1. Insert an orders row in Supabase (idempotent: stripe_payment_intent_id is
//    UNIQUE, duplicate Stripe deliveries no-op on 23505).
// 2. Send buyer confirmation + admin notification via Resend.
// Email failures are logged but never fail the webhook — the order row is the
// source of truth. Signature verification needs the raw body: keep req.text().

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin, type OrderStudent } from '@/lib/supabase';
import { sendEmail } from '@/lib/leads';
import { orderUserEmail, orderAdminEmail, type OrderEmailItem } from '@/lib/email-templates';
import { getProgramById } from '@/data/programs';

export const runtime = 'nodejs';

function parseStudents(metadata: Record<string, string>): OrderStudent[] {
  // Students live in per-item keys student_0, student_1, … (see payment-intent route).
  const students: OrderStudent[] = [];
  for (let i = 0; metadata[`student_${i}`] !== undefined; i++) {
    try {
      const s = JSON.parse(metadata[`student_${i}`]);
      if (
        s &&
        typeof s.name === 'string' &&
        typeof s.gradeLevel === 'string' &&
        typeof s.school === 'string' &&
        typeof s.programId === 'string'
      ) {
        students.push(s);
      }
    } catch {
      // Skip malformed entries; the order row still saves with what parsed.
    }
  }
  return students;
}

async function handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
  const metadata = intent.metadata || {};
  const receiptEmail = intent.receipt_email;
  if (!receiptEmail) {
    console.error('[stripe-webhook] payment_intent.succeeded missing receipt_email:', intent.id);
    return;
  }

  const students = parseStudents(metadata);
  const items: OrderEmailItem[] = students.map((s) => {
    const program = getProgramById(s.programId);
    return {
      programName: program?.name || s.programId,
      unitLabel: program?.enrollment.unitLabel || '',
      studentName: s.name,
      studentGrade: s.gradeLevel,
      studentSchool: s.school,
    };
  });

  const supabase = getSupabaseAdmin();
  const { error: dbError } = await supabase.from('orders').insert({
    stripe_payment_intent_id: intent.id,
    amount_total: intent.amount,
    currency: intent.currency,
    status: 'paid',
    receipt_email: receiptEmail,
    parent_name: metadata.parentName || '',
    parent_phone: metadata.phone || null,
    program_ids: metadata.programIds || '',
    program_names: metadata.programNames || '',
    students,
  });

  // 23505 = unique_violation → this intent was already processed (order saved
  // and emails sent on the first delivery). Treat as no-op success.
  if (dbError && dbError.code !== '23505') {
    console.error('[stripe-webhook] orders insert failed:', dbError);
    throw new Error('Order persistence failed');
  }
  if (dbError?.code === '23505') return;

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const emailData = {
    email: receiptEmail,
    parentName: metadata.parentName || '',
    amountTotal: intent.amount,
    currency: intent.currency,
    paymentIntentId: intent.id,
    items,
  };
  const userTpl = orderUserEmail(emailData);
  const adminTpl = orderAdminEmail(emailData);

  await Promise.all([
    sendEmail({
      to: receiptEmail,
      replyTo: adminEmail,
      subject: userTpl.subject,
      html: userTpl.html,
      text: userTpl.text,
    }),
    adminEmail
      ? sendEmail({
          to: adminEmail,
          replyTo: receiptEmail,
          subject: adminTpl.subject,
          html: adminTpl.html,
          text: adminTpl.text,
        })
      : Promise.resolve(),
  ]);
}

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (e) {
    console.error('[stripe-webhook] signature verification failed:', e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      default:
        // Ignore other events; Stripe still expects a 200 so it doesn't retry.
        break;
    }
  } catch (e) {
    console.error('[stripe-webhook] handler error:', e);
    // 500 so Stripe retries delivery.
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
