'use client';

// CTA block for a tournament page. Mirrors EnrollButton for the open state
// (adds one entry line per student and routes to /checkout); the other
// statuses render the waitlist form or a disabled explanation instead.

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { WaitlistForm } from './WaitlistForm';

type Props = {
  slug: string;
  name: string;
  status: 'draft' | 'upcoming' | 'open' | 'full' | 'closed' | 'cancelled' | 'completed';
  amountUsd: number;
  priceLabel: string;
  /** Pre-formatted opening date for the upcoming state, when the organiser has published one. */
  opensLabel?: string;
  className?: string;
};

const disabledClass =
  'w-full cursor-not-allowed rounded-md border border-navy-200 bg-navy-50 px-7 py-3.5 text-center font-semibold text-navy-400 sm:w-auto';

export function TournamentEnrollButton({ slug, name, status, amountUsd, priceLabel, opensLabel, className = '' }: Props) {
  const { addTournamentItem, countInCart } = useCart();
  const router = useRouter();
  const count = countInCart(`tournament:${slug}`);

  if (status === 'open') {
    return (
      <div className={className}>
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
            addTournamentItem({ slug, name, amountUsd });
            router.push('/checkout');
          }}
          className="w-full rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] sm:w-auto"
        >
          {count === 0 ? `Register · ${priceLabel}` : 'Register another student'}
        </button>
        <p className="mt-3 text-sm text-navy-500">
          One entry per student. Registering more than one child? Click again for each.
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

  if (status === 'upcoming') {
    return (
      <div className={className}>
        <button type="button" disabled className={disabledClass}>
          {opensLabel ? `Registration opens ${opensLabel}` : 'Registration opens soon'}
        </button>
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
