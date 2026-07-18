import Stripe from 'stripe';

let cached: Stripe | null = null;

/**
 * Server-only Stripe client. Reads STRIPE_SECRET_KEY from the environment.
 * Never import from a client component.
 */
export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'Stripe env var missing: set STRIPE_SECRET_KEY in .env.local (or the host dashboard in production)',
    );
  }

  cached = new Stripe(key);
  return cached;
}
