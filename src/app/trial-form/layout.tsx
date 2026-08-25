import type { Metadata } from 'next';

// `absolute` sidesteps the root layout's "| WSDC Prep" title template so the
// tab reads exactly "Your Trial Class | WSDC Prep" (no double suffix).
export const metadata: Metadata = {
  title: { absolute: 'Your Trial Class | WSDC Prep' },
  description: 'A few details before your child’s free trial class.',
  robots: { index: false, follow: false },
};

export default function TrialFormLayout({ children }: { children: React.ReactNode }) {
  return children;
}
