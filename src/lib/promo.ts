// Promo codes accepted at checkout.
//
// Shared by the checkout page (display only) and the payment-intent route,
// which is authoritative: it re-resolves every line from the data file and
// recomputes the discount, so a client-sent total is never trusted.

export const RETURNER_CODE = 'RETURNER27';
export const RETURNER_PERCENT = 20;
export const RETURNER_NOTICE =
  'As a thank you for your continued support, returning families receive 20% off all online classes (excluding 1-on-1 classes) with the code RETURNER27.';

export type PromoLine = { amount: number; eligible: boolean };

export function normalizePromoCode(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toUpperCase() : '';
}

export function isValidPromoCode(code: string): boolean {
  return normalizePromoCode(code) === RETURNER_CODE;
}

/**
 * Discount in major units (rounded to cents) across the eligible lines.
 * Returns 0 for an invalid code or a cart with nothing eligible.
 */
export function promoDiscount(code: string, lines: PromoLine[]): number {
  if (!isValidPromoCode(code)) return 0;
  const eligible = lines.filter((l) => l.eligible).reduce((sum, l) => sum + l.amount, 0);
  return Math.round(eligible * RETURNER_PERCENT) / 100;
}
