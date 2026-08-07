import type { Metadata } from 'next';

// The root layout's title template appends "| WSDC Prep".
export const metadata: Metadata = {
  title: 'Complete Your Enrollment',
  description: 'Confirm your student details to finalize class placement.',
  robots: { index: false, follow: false },
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
