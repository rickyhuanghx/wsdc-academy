'use client';

// CTA block for a tournament page. Mirrors EnrollButton for the open state
// (adds one entry line per student and routes to /checkout); the other
// statuses render the waitlist form or a disabled explanation instead.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { WaitlistForm } from './WaitlistForm';
import { getExistingStudentChoice, setExistingStudentChoice } from '@/lib/existing-student';

type Props = {
  slug: string;
  name: string;
  status: 'draft' | 'interest' | 'invite_only' | 'upcoming' | 'open' | 'full' | 'closed' | 'cancelled' | 'completed';
  amountUsd: number;
  priceLabel: string;
  existingStudentDiscountPct?: number;
  /** Pre-formatted opening date for the upcoming state, when the organiser has published one. */
  opensLabel?: string;
  className?: string;
};

const disabledClass =
  'w-full cursor-not-allowed rounded-md border border-navy-200 bg-navy-50 px-7 py-3.5 text-center font-semibold text-navy-400 sm:w-auto';

export function TournamentEnrollButton({ slug, name, status, amountUsd, priceLabel, existingStudentDiscountPct = 0, opensLabel, className = '' }: Props) {
  const { addTournamentItem, countInCart } = useCart();
  const router = useRouter();
  const count = countInCart(`tournament:${slug}`);
  // Asked before the price: existing families see their discounted price here
  // and checkout starts with the same answer.
  const [existing, setExisting] = useState<boolean | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExisting(getExistingStudentChoice());
  }, []);
  const choose = (v: boolean) => {
    setExisting(v);
    setExistingStudentChoice(v);
  };
  const discounted = Math.round(amountUsd * (1 - existingStudentDiscountPct / 100) * 100) / 100;
  const shownPrice = existing && existingStudentDiscountPct > 0 ? `$${discounted.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : priceLabel;

  if (status === 'open') {
    return (
      <div className={className}>
        {existingStudentDiscountPct > 0 && (
          <fieldset className="mb-4">
            <legend className="text-sm font-semibold text-navy-900">Is your child an existing WSDC Prep or Atlantic Ivy student?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                [false, 'No, first time with us', priceLabel],
                [true, `Yes, existing student (${existingStudentDiscountPct}% off)`, `$${discounted.toLocaleString('en-US', { maximumFractionDigits: 2 })}`],
              ].map(([value, label, price]) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => choose(value as boolean)}
                  aria-pressed={existing === value}
                  className={`rounded-md border px-3 py-2 text-left text-sm transition ${existing === value ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 bg-white text-navy-800 hover:border-navy-400'}`}
                >
                  <span className="block font-medium">{label as string}</span>
                  <span className={`block text-xs ${existing === value ? 'text-navy-200' : 'text-navy-500'}`}>{price as string} per student</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
        <button
          type="button"
          onClick={() => {
            // Staff previewing a hidden tournament: carry the token to checkout
            // so the payment-intent route can see the same listing.
            try {
              const p = new URLSearchParams(window.location.search).get('preview');
              if (p) sessionStorage.setItem('wsdc-tournament-preview', p);
            } catch {
              // storage unavailable — preview simply will not carry over
            }
            addTournamentItem({ slug, name, amountUsd, existingStudentDiscountPct });
            router.push('/checkout');
          }}
          className="w-full rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] sm:w-auto"
        >
          {count === 0 ? `Register · ${shownPrice}` : 'Register another student'}
        </button>
        <p className="mt-3 text-sm text-navy-500">
          One entry per student. Registering more than one child? Click again for each.
          {existingStudentDiscountPct > 0 && existing === null && ' Choose above whether your child is an existing student to see your price.'}
        </p>
      </div>
    );
  }

  if (status === 'full') {
    return (
      <div className={className}>
        <p className="text-sm font-semibold text-navy-900">This tournament is full.</p>
        <p className="mt-1 text-sm text-navy-500">
          Join the waitlist and we will email you if a place opens up.
        </p>
        <div className="mt-5">
          <WaitlistForm slug={slug} tournamentName={name} />
        </div>
      </div>
    );
  }

  if (status === 'interest' || status === 'upcoming') {
    return (
      <div className={className}>
        <p className="text-sm font-semibold text-navy-900">
          {opensLabel ? `Registration opens ${opensLabel}.` : 'Registration is not open yet.'}
        </p>
        <p className="mt-1 text-sm text-navy-500">
          Register your interest and we will email you the moment it opens. No payment now.
        </p>
        <div className="mt-5">
          <WaitlistForm slug={slug} tournamentName={name} mode="interest" />
        </div>
      </div>
    );
  }

  if (status === 'invite_only') {
    return (
      <div className={className}>
        <button type="button" disabled className={disabledClass}>
          Invitation only
        </button>
        <p className="mt-3 text-sm text-navy-500">
          Entry to this tournament is by invitation. Students in our competition programs are put forward by their coach.
        </p>
      </div>
    );
  }

  const label =
    status === 'cancelled'
      ? 'This tournament has been cancelled'
      : status === 'completed'
        ? 'This tournament has finished'
        : 'Registration has closed';

  return (
    <div className={className}>
      <button type="button" disabled className={disabledClass}>
        {label}
      </button>
    </div>
  );
}
