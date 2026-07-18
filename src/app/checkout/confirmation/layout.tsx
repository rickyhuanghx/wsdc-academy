import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enrollment Confirmed',
};

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
