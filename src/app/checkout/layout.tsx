import type { Metadata } from 'next';

// Checkout is transactional — keep it (and /checkout/confirmation) out of the
// index. robots.ts also disallows /checkout/.
export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
