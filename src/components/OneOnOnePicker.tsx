'use client';

// Pricing selector for 1-on-1 coaching. Unlike the fixed-price programs, 1-on-1
// sells four variants (diagnostic / hourly / two packages). Each "Add" pushes a
// variant line to the cart and routes to checkout. Prices shown here are always
// re-resolved server-side in the payment-intent route.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { EARLY_BIRD_PERCENT, type Program } from '@/data/programs';

function usd(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

// The struck "original" that makes the fixed early-bird label read true.
function compareAt(amount: number): number {
  return Math.round(amount / (1 - EARLY_BIRD_PERCENT / 100));
}

function PriceTag({ amount }: { amount: number }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-navy-400 line-through">{usd(compareAt(amount))}</span>{' '}
      <span className="font-bold text-navy-900">{usd(amount)}</span>
    </span>
  );
}

export function OneOnOnePicker({ program }: { program: Program }) {
  const oo = program.oneOnOne;
  const { addVariantItem, countVariantInCart } = useCart();
  const router = useRouter();
  const [hours, setHours] = useState(1);

  if (!oo) return null;

  const add = (variant: { variantId: string; quantity?: number; unitLabel: string; amount: number }) => {
    addVariantItem(program, variant);
    router.push('/checkout');
  };

  const diagnosticAdded = countVariantInCart(program.id, oo.diagnostic.id) > 0;
  const hourlyAmount = oo.hourly.rate * hours;
  const hourOptions = Array.from(
    { length: oo.hourly.maxHours - oo.hourly.minHours + 1 },
    (_, i) => oo.hourly.minHours + i,
  );

  const rowClass =
    'flex flex-col gap-3 border-t border-navy-100 py-5 sm:flex-row sm:items-center sm:justify-between';
  const addClass =
    'rounded-md bg-signal-500 px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-600 disabled:opacity-50';

  return (
    <div id="pricing" className="scroll-mt-24 rounded-xl border border-navy-100 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold text-navy-900">Choose your hours</h2>
        <span className="rounded-full bg-signal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-signal-600">
          {EARLY_BIRD_PERCENT}% off early-bird
        </span>
      </div>
      <p className="mt-2 text-sm text-navy-600">
        Start with a diagnostic, then buy hours as you need them. {oo.validityNote}
      </p>

      <div className="mt-5">
        {/* Diagnostic */}
        <div className={rowClass}>
          <div>
            <h3 className="font-bold text-navy-900">{oo.diagnostic.label}</h3>
            <p className="mt-0.5 text-sm text-navy-600">
              A first session that maps the student’s level. One-time purchase.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <PriceTag amount={oo.diagnostic.amount} />
            <button
              type="button"
              onClick={() =>
                add({
                  variantId: oo.diagnostic.id,
                  unitLabel: oo.diagnostic.label,
                  amount: oo.diagnostic.amount,
                })
              }
              disabled={diagnosticAdded}
              className={addClass}
            >
              {diagnosticAdded ? 'In cart' : 'Add'}
            </button>
          </div>
        </div>

        {/* Hourly */}
        <div className={rowClass}>
          <div>
            <h3 className="font-bold text-navy-900">Hourly coaching</h3>
            <p className="mt-0.5 text-sm text-navy-600">
              {usd(oo.hourly.rate)} per 60-minute session, from {oo.hourly.minHours} to{' '}
              {oo.hourly.maxHours} hours.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="sr-only" htmlFor="hourly-qty">
              Number of hours
            </label>
            <select
              id="hourly-qty"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="rounded-md border border-navy-200 bg-cream px-3 py-2 text-sm font-medium text-navy-900 focus:border-signal-500 focus:outline-none"
            >
              {hourOptions.map((h) => (
                <option key={h} value={h}>
                  {h} {h === 1 ? 'hour' : 'hours'}
                </option>
              ))}
            </select>
            <PriceTag amount={hourlyAmount} />
            <button
              type="button"
              onClick={() =>
                add({
                  variantId: oo.hourly.id,
                  quantity: hours,
                  unitLabel: `${hours} hour${hours > 1 ? 's' : ''} of 1-on-1 coaching`,
                  amount: hourlyAmount,
                })
              }
              className={addClass}
            >
              Add
            </button>
          </div>
        </div>

        {/* Packages */}
        {oo.packages.map((pack) => (
          <div key={pack.id} className={rowClass}>
            <div>
              <h3 className="font-bold text-navy-900">{pack.label}</h3>
              <p className="mt-0.5 text-sm text-navy-600">
                {pack.hours} hours of coaching, {usd(Math.round(pack.amount / pack.hours))} an hour.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <PriceTag amount={pack.amount} />
              <button
                type="button"
                onClick={() =>
                  add({ variantId: pack.id, unitLabel: pack.label, amount: pack.amount })
                }
                className={addClass}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
