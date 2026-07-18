'use client';

// Enrollment control for group / bootcamp programs. Makes the buyer pick an age
// group and a time slot *before* adding to the cart, so the selection is always
// captured (the checkout still shows it, pre-filled and editable). Time slots on
// track programs are tied to a band via `ageId`; the bootcamp shares slots across
// ages. The chosen ids ride on the cart line → payment-intent → Supabase.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getEnrollmentOptions, type Program } from '@/data/programs';

const selectClass =
  'mt-1.5 w-full rounded-md border border-navy-200 bg-cream px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';

export function GroupEnrollPicker({ program }: { program: Program }) {
  const opts = getEnrollmentOptions(program);
  const { addItem, countInCart } = useCart();
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  if (!opts) return null;

  const tiedToAge = opts.times.some((t) => t.ageId);
  const times = tiedToAge
    ? ageGroup
      ? opts.times.filter((t) => t.ageId === ageGroup)
      : []
    : opts.times;

  const ready = Boolean(ageGroup && timeSlot);
  const alreadyInCart = countInCart(program.id) > 0;

  const enroll = () => {
    if (!ready) return;
    addItem(program, { ageGroup, timeSlot });
    router.push('/checkout');
  };

  return (
    <div id="enroll" className="scroll-mt-24 space-y-4">
      <div>
        <label className={labelClass} htmlFor={`age-${program.id}`}>
          Age group <span className="text-signal-500">*</span>
        </label>
        <select
          id={`age-${program.id}`}
          value={ageGroup}
          onChange={(e) => {
            setAgeGroup(e.target.value);
            // Reset a now-invalid slot when the band changes (track programs).
            const stillValid = opts.times.find(
              (t) => t.id === timeSlot && (!t.ageId || t.ageId === e.target.value),
            );
            if (!stillValid) setTimeSlot('');
          }}
          className={selectClass}
        >
          <option value="" disabled>
            Select an age group…
          </option>
          {opts.ages.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor={`time-${program.id}`}>
          Preferred time <span className="text-signal-500">*</span>
        </label>
        <select
          id={`time-${program.id}`}
          value={timeSlot}
          disabled={tiedToAge && !ageGroup}
          onChange={(e) => setTimeSlot(e.target.value)}
          className={`${selectClass} disabled:opacity-60`}
        >
          <option value="" disabled>
            {tiedToAge && !ageGroup ? 'Choose an age group first' : 'Select a time…'}
          </option>
          {times.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={enroll}
        disabled={!ready}
        className="block w-full rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-signal-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {alreadyInCart
          ? 'Enroll another student'
          : `Enroll now · $${program.enrollment.amount.toLocaleString('en-US')}`}
      </button>
      <p className="text-center text-xs text-navy-500">
        Times shown in US Eastern. A coach confirms your slot after you book.
      </p>
    </div>
  );
}
