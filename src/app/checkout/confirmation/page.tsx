'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart, isWritingItem, type CartItem } from '@/context/CartContext';
import { CONTACT_EMAIL } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

const nextSteps = [
  {
    title: 'Check your email',
    detail: 'We’ve sent a confirmation with your enrollment details and payment receipt.',
  },
  {
    title: 'Welcome call',
    detail:
      'A coach will contact you within 24–48 hours to welcome you, place each student, and confirm the schedule.',
  },
  {
    title: 'First session',
    detail: 'You’ll receive class links and materials before the first session.',
  },
];

// The checkout page stashes the server-side charged amount (after any promo)
// keyed by intent id; use it when it matches, else fall back to the cart sum.
function chargedAmount(paymentIntentId: string | null): number | undefined {
  if (!paymentIntentId) return undefined;
  try {
    const raw = sessionStorage.getItem('wsdc-checkout-charged');
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as { pi?: string; amount?: number };
    return saved.pi === paymentIntentId && typeof saved.amount === 'number' ? saved.amount : undefined;
  } catch {
    return undefined;
  }
}

export default function CheckoutConfirmationPage() {
  const { items, clearCart } = useCart();
  // Snapshot of the lines that were paid for, taken before the cart is cleared,
  // so the page can still list what was bought.
  const [purchased, setPurchased] = useState<CartItem[]>([]);

  // Stripe's return_url appends payment_intent + redirect_status; clear the
  // cart only on success so a failed-payment return preserves it for retry.
  // The purchase event fires before the clear and only while the cart still
  // has lines, so a reload of this page can't double-count the conversion.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect_status') === 'succeeded') {
      if (items.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPurchased(items);
        trackEvent('purchase_completed', {
          transaction_id: params.get('payment_intent') ?? undefined,
          value:
            chargedAmount(params.get('payment_intent')) ??
            items.reduce((total, item) => total + item.amount, 0),
          currency: 'USD',
        });
      }
      clearCart();
    }
  }, [items, clearCart]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-signal-500">
        Enrollment confirmed
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        Welcome to the squad.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-navy-600">
        Your payment went through and your enrollment is saved. Here&apos;s what happens next.
      </p>

      {purchased.length > 0 && (
        <div className="mt-8 rounded-sm border border-navy-200 bg-white p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-signal-500">What you enrolled in</h2>
          <ul className="mt-3 divide-y divide-navy-100">
            {purchased.map((item) => (
              <li key={item.lineId} className="flex justify-between gap-4 py-2 text-sm">
                <span className="text-navy-900">
                  {item.programName}
                  {item.studentInfo.name.trim() && (
                    <span className="text-navy-500"> · {item.studentInfo.name.trim()}</span>
                  )}
                </span>
                <span className="text-navy-500">{item.unitLabel}</span>
              </li>
            ))}
          </ul>
          {purchased.some(isWritingItem) && (
            <p className="mt-3 text-sm leading-relaxed text-navy-600">
              Writing-competition packages are coached by our sister academy, Atlantic Ivy. Class times for
              group courses are confirmed by email after checkout.
            </p>
          )}
        </div>
      )}

      <div className="mt-10">
        {nextSteps.map((s, i) => (
          <div key={s.title} className="flex gap-5 border-t border-navy-100 py-5">
            <span className="font-mono text-sm font-semibold text-signal-500">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h2 className="text-base font-bold text-navy-900">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-navy-600">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-navy-100 pt-8 sm:flex-row">
        <Link
          href="/"
          className="rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
        >
          Back to Home
        </Link>
        <Link
          href="/resources"
          className="rounded-md border border-navy-200 px-7 py-3.5 text-center font-semibold text-navy-700 transition-colors hover:border-navy-400"
        >
          Browse the Resource Library
        </Link>
      </div>

      <p className="mt-8 text-sm text-navy-500">
        Questions? Write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
