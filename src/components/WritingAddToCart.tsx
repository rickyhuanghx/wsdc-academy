'use client';

// Per-competition purchase control for the homepage writing-competitions
// section. The server component hands it the packages already resolved for
// today (effectiveOffer), so it never needs to talk to ClassDesk itself: it
// adds a `writing` cart line and the payment-intent route re-prices the sku.
// Multi-package competitions (HIR, John Locke, the journals) get a select;
// single-package ones (IPPF, Concord Review) get one button with the price.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export interface WritingPackageOption {
  sku: string;
  label: string;
  hours: number;
  amountUsd: number;
  priceLabel: string;
  promoEligible: boolean;
}

type Props = {
  competitionSlug: string;
  competitionName: string;
  packages: WritingPackageOption[];
};

const ADDED_MS = 2500;

const selectClass =
  'w-full rounded-sm border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 focus:border-signal-500 focus:outline-none sm:w-auto sm:min-w-[16rem]';
const buttonClass =
  'inline-flex items-center justify-center rounded-sm bg-signal-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]';

export function WritingAddToCart({ competitionSlug, competitionName, packages }: Props) {
  const { addWritingItem } = useCart();
  const [sku, setSku] = useState(packages[0]?.sku ?? '');
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  if (packages.length === 0) return null;
  const chosen = packages.find((p) => p.sku === sku) ?? packages[0];

  const add = () => {
    addWritingItem({
      sku: chosen.sku,
      competitionSlug,
      competitionName,
      packageLabel: chosen.label,
      hours: chosen.hours,
      amountUsd: chosen.amountUsd,
      promoEligible: chosen.promoEligible,
    });
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), ADDED_MS);
  };

  const selectId = `writing-pkg-${competitionSlug}`;

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      {packages.length > 1 && (
        <>
          <label htmlFor={selectId} className="sr-only">
            Package for {competitionName}
          </label>
          <select id={selectId} value={chosen.sku} onChange={(e) => setSku(e.target.value)} className={selectClass}>
            {packages.map((p) => (
              <option key={p.sku} value={p.sku}>
                {p.label} · {p.priceLabel}
              </option>
            ))}
          </select>
        </>
      )}
      <button type="button" onClick={add} className={buttonClass} aria-label={`Add ${competitionName}, ${chosen.label}, to cart`}>
        {packages.length > 1 ? 'Add to cart' : `Add to cart · ${chosen.priceLabel}`}
      </button>
      <span className="text-sm text-navy-600" role="status" aria-live="polite">
        {added ? (
          <>
            Added.{' '}
            <Link href="/checkout" className="font-semibold text-navy-900 underline decoration-signal-400 underline-offset-4 hover:text-signal-600">
              Go to checkout
            </Link>
          </>
        ) : null}
      </span>
    </div>
  );
}

/**
 * Fallback for competitions whose registration has closed for this season:
 * jumps to the interest form below the list with that competition ticked.
 */
export function WritingInterestButton({ competitionSlug, label }: { competitionSlug: string; label: string }) {
  const go = () => {
    const form = document.getElementById('writing-interest-form');
    const box = form?.querySelector<HTMLInputElement>(`input[name="competitions"][value="${competitionSlug}"]`);
    if (box && !box.checked) box.checked = true;
    form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    (box ?? form?.querySelector<HTMLElement>('input, select, button'))?.focus({ preventScroll: true });
  };
  return (
    <button
      type="button"
      onClick={go}
      className="mt-3 inline-flex items-center rounded-sm border border-navy-900 px-5 py-2 text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
    >
      {label}
    </button>
  );
}
