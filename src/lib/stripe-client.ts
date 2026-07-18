import { loadStripe, type Stripe } from '@stripe/stripe-js';

let cached: Promise<Stripe | null> | null = null;

/**
 * Memoized loadStripe call. Reads NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY at first use.
 * Safe to call from client components; the promise resolves once Stripe.js is loaded.
 */
export function getStripeClient(): Promise<Stripe | null> {
  if (cached) return cached;
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      'Stripe env var missing: set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local',
    );
  }
  cached = loadStripe(key);
  return cached;
}
