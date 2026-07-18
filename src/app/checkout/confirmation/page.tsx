'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CONTACT_EMAIL } from '@/lib/site';

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

export default function CheckoutConfirmationPage() {
  const { clearCart } = useCart();

  // Stripe's return_url appends payment_intent + redirect_status; clear the
  // cart only on success so a failed-payment return preserves it for retry.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect_status') === 'succeeded') {
      clearCart();
    }
  }, [clearCart]);

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
          className="rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-signal-600"
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
