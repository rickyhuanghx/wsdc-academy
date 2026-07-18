'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { useCart, type StudentInfo, type CartItem } from '@/context/CartContext';
import {
  EARLY_BIRD_PERCENT,
  GRADE_LEVELS,
  getProgramById,
  getEnrollmentOptions,
} from '@/data/programs';
import { getStripeClient } from '@/lib/stripe-client';
import { CONTACT_EMAIL } from '@/lib/site';

// Age band + time slot the buyer must choose for group / bootcamp programs.
function enrollOptionsForLine(item: CartItem) {
  const program = getProgramById(item.programId);
  return program ? getEnrollmentOptions(program) : null;
}

// Time slots valid for the line's chosen age band (track programs tie a slot to
// a band via ageId; the bootcamp's slots are shared across ages).
function timesForLine(item: CartItem) {
  const opts = enrollOptionsForLine(item);
  if (!opts) return [];
  const anyTied = opts.times.some((t) => t.ageId);
  if (!anyTied) return opts.times;
  if (!item.ageGroup) return [];
  return opts.times.filter((t) => t.ageId === item.ageGroup);
}

function isPlacementComplete(item: CartItem): boolean {
  const opts = enrollOptionsForLine(item);
  if (!opts) return true; // no selectable options (e.g. 1-on-1)
  if (!item.ageGroup || !item.timeSlot) return false;
  const time = opts.times.find((t) => t.id === item.timeSlot);
  if (!time) return false;
  return !time.ageId || time.ageId === item.ageGroup;
}

type BuyerForm = {
  parentName: string;
  email: string;
  phone: string;
};

function isStudentInfoComplete(info: StudentInfo): boolean {
  return (
    info.name.trim().length > 0 && info.gradeLevel !== '' && info.school.trim().length > 0
  );
}

function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

// Struck "original" for a line: group programs carry a real compareAt in data;
// 1-on-1 variants derive it from the fixed early-bird label (same as OneOnOnePicker).
function compareAtForLine(item: CartItem): number | null {
  const program = getProgramById(item.programId);
  if (!program) return null;
  if (item.variantId) return Math.round(item.amount / (1 - EARLY_BIRD_PERCENT / 100));
  return program.pricing.compareAt ?? null;
}

const inputClass =
  'mt-1.5 w-full rounded-md border border-navy-200 bg-cream px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function PaymentForm({ onError }: { onError: (msg: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    onError('');
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation`,
      },
    });
    // If confirmPayment returns, payment failed (success redirects via return_url).
    if (error) {
      onError(error.message || 'Payment failed. Please check your details and try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full rounded-md bg-emerald-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? 'Processing payment…' : 'Pay now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, removeItem, updateStudentInfo, updateLineSelection, getSubtotal } = useCart();
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  // Off by default: multiple lines usually means multiple kids.
  const [sameStudentForAll, setSameStudentForAll] = useState(false);

  const [formData, setFormData] = useState<BuyerForm>({
    parentName: '',
    email: '',
    phone: '',
  });

  // Only resolve the Stripe.js client once we actually have an intent, and
  // don't crash the page if the publishable key isn't configured yet.
  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!clientSecret) return null;
    try {
      return getStripeClient();
    } catch {
      return null;
    }
  }, [clientSecret]);

  const handleStudentChange = (lineId: string, field: keyof StudentInfo, value: string) => {
    const item = items.find((it) => it.lineId === lineId);
    if (!item) return;
    const next: StudentInfo = { ...item.studentInfo, [field]: value };
    if (sameStudentForAll && items.length > 1) {
      items.forEach((it) => updateStudentInfo(it.lineId, next));
    } else {
      updateStudentInfo(lineId, next);
    }
  };

  const handleAgeChange = (lineId: string, ageId: string) => {
    const item = items.find((it) => it.lineId === lineId);
    if (!item) return;
    // Drop a now-invalid time slot when the age band changes (track programs).
    const opts = enrollOptionsForLine(item);
    const time = opts?.times.find((t) => t.id === item.timeSlot);
    const keepTime = time && (!time.ageId || time.ageId === ageId) ? item.timeSlot : '';
    updateLineSelection(lineId, { ageGroup: ageId, timeSlot: keepTime });
  };

  const isParentComplete =
    formData.parentName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const itemsToValidate = sameStudentForAll && items.length > 1 ? items.slice(0, 1) : items;
  const isStudentsComplete = itemsToValidate.every((it) => isStudentInfoComplete(it.studentInfo));
  // Placement (age + time) is per enrollment line, so validate every line.
  const isPlacementsComplete = items.every(isPlacementComplete);
  const canContinueToPayment = isParentComplete && isStudentsComplete && isPlacementsComplete;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Triggered by Continue-to-payment. Creates the intent on demand and shows
  // the payment element only if the fetch succeeds.
  const goToPayment = async () => {
    if (items.length === 0) return;
    setIntentLoading(true);
    setCheckoutError(null);
    setStep('payment');
    try {
      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            programId: i.programId,
            studentInfo: i.studentInfo,
            variantId: i.variantId,
            quantity: i.quantity,
            ageGroup: i.ageGroup,
            timeSlot: i.timeSlot,
          })),
          buyer: formData,
        }),
      });
      const data: { clientSecret?: string; error?: string } = await res.json();
      if (!res.ok || !data.clientSecret) {
        setCheckoutError(data.error || 'Could not start checkout. Please try again.');
      } else {
        setClientSecret(data.clientSecret);
      }
    } catch {
      setCheckoutError('Network error. Please check your connection and try again.');
    } finally {
      setIntentLoading(false);
    }
  };

  const goBackToDetails = () => {
    setStep('details');
    // Drop the secret so re-entry creates a fresh intent reflecting any edits.
    setClientSecret(null);
    setCheckoutError(null);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wider text-signal-500">Checkout</p>
        <h1 className="mt-3 text-3xl font-bold text-navy-900">Your cart is empty</h1>
        <p className="mt-4 text-navy-600">
          Browse our programs and add an enrollment to get started.
        </p>
        <Link
          href="/programs"
          className="mt-8 inline-block rounded-md bg-signal-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-signal-600"
        >
          Browse Programs
        </Link>
      </div>
    );
  }

  const steps: { id: typeof step; label: string }[] = [
    { id: 'cart', label: 'Cart' },
    { id: 'details', label: 'Details' },
    { id: 'payment', label: 'Payment' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-wider text-signal-500">Checkout</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
        Enrollment
      </h1>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-3 border-b border-navy-100 pb-6 text-sm">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            {i > 0 && <span className="h-px w-8 bg-navy-200" aria-hidden />}
            <span
              className={
                step === s.id ? 'font-semibold text-navy-900' : 'text-navy-400'
              }
            >
              <span className={`font-mono text-xs ${step === s.id ? 'text-signal-500' : ''}`}>
                {String(i + 1).padStart(2, '0')}
              </span>{' '}
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 'cart' && (
            <section>
              <h2 className="text-xl font-bold text-navy-900">
                Your cart ({items.length} {items.length === 1 ? 'enrollment' : 'enrollments'})
              </h2>
              <div className="mt-6">
                {items.map((item) => (
                  <div
                    key={item.lineId}
                    className="flex items-start justify-between gap-4 border-t border-navy-100 py-5"
                  >
                    <div>
                      <h3 className="font-semibold text-navy-900">{item.programName}</h3>
                      <p className="mt-1 text-sm text-navy-500">{item.unitLabel}</p>
                    </div>
                    <div className="text-right">
                      <div className="whitespace-nowrap">
                        {compareAtForLine(item) && (
                          <span className="text-sm text-navy-400 line-through">
                            {formatUsd(compareAtForLine(item)!)}
                          </span>
                        )}{' '}
                        <span className="font-semibold text-navy-900">
                          {formatUsd(item.amount)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        className="mt-1 text-sm text-navy-500 underline underline-offset-2 hover:text-signal-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-navy-100 pt-6">
                <p className="mb-4 text-sm text-navy-500">
                  Enrolling more than one child? Add the program once per student from the{' '}
                  <Link href="/programs" className="underline underline-offset-2">
                    programs page
                  </Link>
                  .
                </p>
                <button
                  onClick={() => setStep('details')}
                  className="w-full rounded-md bg-signal-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-signal-600 sm:w-auto sm:px-10"
                >
                  Continue to details
                </button>
              </div>
            </section>
          )}

          {step === 'details' && (
            <section className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-navy-900">Parent / guardian</h2>
                <div className="mt-5 space-y-5">
                  <div>
                    <label htmlFor="parentName" className={labelClass}>
                      Parent/guardian name <span className="text-signal-500">*</span>
                    </label>
                    <input
                      id="parentName"
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email <span className="text-signal-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-navy-900">Student information</h2>
                  {items.length > 1 && (
                    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-navy-600">
                      <input
                        type="checkbox"
                        checked={sameStudentForAll}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSameStudentForAll(checked);
                          if (checked && items[0]) {
                            items.forEach((it) =>
                              updateStudentInfo(it.lineId, items[0].studentInfo),
                            );
                          }
                        }}
                        className="h-4 w-4 accent-signal-500"
                      />
                      Same student for every enrollment
                    </label>
                  )}
                </div>

                <div className="mt-5 space-y-6">
                  {(sameStudentForAll && items.length > 1 ? items.slice(0, 1) : items).map(
                    (item) => (
                      <div key={item.lineId} className="border-t border-navy-100 pt-5">
                        {items.length > 1 && !sameStudentForAll && (
                          <p className="mb-4 text-sm font-semibold text-navy-900">
                            {item.programName}
                            <span className="font-normal text-navy-500">, {item.unitLabel}</span>
                          </p>
                        )}
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className={labelClass}>
                              Student name <span className="text-signal-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={item.studentInfo.name}
                              onChange={(e) =>
                                handleStudentChange(item.lineId, 'name', e.target.value)
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Grade <span className="text-signal-500">*</span>
                            </label>
                            <select
                              required
                              value={item.studentInfo.gradeLevel}
                              onChange={(e) =>
                                handleStudentChange(item.lineId, 'gradeLevel', e.target.value)
                              }
                              className={inputClass}
                            >
                              <option value="" disabled>
                                Select…
                              </option>
                              {GRADE_LEVELS.map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className={labelClass}>
                            School <span className="text-signal-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={item.studentInfo.school}
                            onChange={(e) =>
                              handleStudentChange(item.lineId, 'school', e.target.value)
                            }
                            placeholder="School name"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {items.some((it) => enrollOptionsForLine(it)) && (
                <div>
                  <h2 className="text-xl font-bold text-navy-900">Class placement</h2>
                  <p className="mt-1 text-sm text-navy-500">
                    Choose an age group and a preferred time for each enrollment. A coach confirms
                    the placement with you after you book.
                  </p>
                  <div className="mt-5 space-y-6">
                    {items.map((item) => {
                      const opts = enrollOptionsForLine(item);
                      if (!opts) return null;
                      const tiedToAge = opts.times.some((t) => t.ageId);
                      const times = timesForLine(item);
                      return (
                        <div key={item.lineId} className="border-t border-navy-100 pt-5">
                          <p className="mb-4 text-sm font-semibold text-navy-900">
                            {item.programName}
                            {item.studentInfo.name.trim() && (
                              <span className="font-normal text-navy-500">
                                , {item.studentInfo.name.trim()}
                              </span>
                            )}
                          </p>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                              <label className={labelClass}>
                                Age group <span className="text-signal-500">*</span>
                              </label>
                              <select
                                required
                                value={item.ageGroup ?? ''}
                                onChange={(e) => handleAgeChange(item.lineId, e.target.value)}
                                className={inputClass}
                              >
                                <option value="" disabled>
                                  Select…
                                </option>
                                {opts.ages.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className={labelClass}>
                                Preferred time <span className="text-signal-500">*</span>
                              </label>
                              <select
                                required
                                value={item.timeSlot ?? ''}
                                disabled={tiedToAge && !item.ageGroup}
                                onChange={(e) =>
                                  updateLineSelection(item.lineId, { timeSlot: e.target.value })
                                }
                                className={`${inputClass} disabled:opacity-60`}
                              >
                                <option value="" disabled>
                                  {tiedToAge && !item.ageGroup
                                    ? 'Choose an age group first'
                                    : 'Select…'}
                                </option>
                                {times.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 border-t border-navy-100 pt-6">
                <button
                  onClick={() => setStep('cart')}
                  className="rounded-md border border-navy-200 px-6 py-3.5 font-semibold text-navy-700 transition-colors hover:border-navy-400"
                >
                  Back
                </button>
                <button
                  onClick={goToPayment}
                  disabled={!canContinueToPayment}
                  className="flex-grow rounded-md bg-signal-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-signal-600 disabled:opacity-60"
                >
                  Continue to payment
                </button>
              </div>
            </section>
          )}

          {step === 'payment' && (
            <section>
              <h2 className="text-xl font-bold text-navy-900">Payment</h2>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-500">
                <LockIcon className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Encrypted by{' '}
                  <a
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-signal-500"
                  >
                    Stripe
                  </a>
                  . We never see your card details.
                </span>
              </p>

              {checkoutError && (
                <div className="mt-6 rounded-md border border-signal-500 bg-signal-500/5 p-4 text-sm text-signal-600">
                  {checkoutError}
                </div>
              )}

              {!clientSecret && intentLoading && (
                <p className="mt-8 text-navy-500">Preparing secure payment…</p>
              )}

              {clientSecret && !stripePromise && (
                <div className="mt-6 rounded-md border border-signal-500 bg-signal-500/5 p-4 text-sm text-signal-600">
                  Payments aren&apos;t available right now. Please email us at {CONTACT_EMAIL}.
                </div>
              )}

              {clientSecret && stripePromise && (
                <div className="mt-8">
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#c8102e',
                          colorText: '#0d2240',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          borderRadius: '6px',
                        },
                      },
                    }}
                  >
                    <PaymentForm onError={(msg) => setCheckoutError(msg || null)} />
                  </Elements>
                </div>
              )}

              <div className="mt-8 border-t border-navy-100 pt-6">
                <button
                  onClick={goBackToDetails}
                  className="rounded-md border border-navy-200 px-6 py-3.5 font-semibold text-navy-700 transition-colors hover:border-navy-400"
                >
                  Back
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Order summary */}
        <aside>
          <div className="sticky top-24 rounded-sm border border-navy-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-navy-900">Order summary</h3>
              <span className="rounded-full bg-signal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-signal-600">
                {EARLY_BIRD_PERCENT}% off early-bird
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const original = compareAtForLine(item);
                return (
                  <div key={item.lineId} className="flex justify-between gap-3 text-sm">
                    <span className="text-navy-600">
                      {item.programName}
                      {item.studentInfo.name.trim() && (
                        <span className="text-navy-400"> · {item.studentInfo.name.trim()}</span>
                      )}
                    </span>
                    <span className="whitespace-nowrap text-right">
                      {original && (
                        <span className="text-navy-400 line-through">{formatUsd(original)}</span>
                      )}{' '}
                      <span className="font-medium text-navy-900">{formatUsd(item.amount)}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            {(() => {
              const subtotal = getSubtotal();
              const originalTotal = items.reduce(
                (t, it) => t + (compareAtForLine(it) ?? it.amount),
                0,
              );
              const savings = originalTotal - subtotal;
              return (
                <div className="mt-5 space-y-2 border-t border-navy-100 pt-4">
                  {savings > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-navy-500">
                        <span>Original price</span>
                        <span className="line-through">{formatUsd(originalTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold text-emerald-700">
                        <span>Early-bird discount</span>
                        <span>&minus;{formatUsd(savings)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="font-semibold text-navy-900">Total</span>
                    <span className="font-bold text-navy-900">{formatUsd(subtotal)}</span>
                  </div>
                </div>
              );
            })()}
            <p className="mt-5 border-t border-navy-100 pt-4 text-xs leading-relaxed text-navy-500">
              By completing this purchase you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/refund" className="underline underline-offset-2">
                Refund Policy
              </Link>
              . After payment, a coach reaches out within 24–48 hours to place each student
              and confirm scheduling. Questions? Write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
