'use client';

// "Enroll now" CTA on program pages. Adds one cart line (one student) and goes
// to checkout; enrolling a second child means clicking it again — the label
// switches to make that explicit.

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { type Program } from '@/data/programs';

export function EnrollButton({
  program,
  variant = 'solid',
  size = 'md',
  className = '',
}: {
  program: Program;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'sm';
  className?: string;
}) {
  const { addItem, countInCart } = useCart();
  const router = useRouter();
  const count = countInCart(program.id);

  const sizing = size === 'md' ? 'px-7 py-3.5' : 'px-6 py-3 text-sm';
  const base =
    variant === 'solid'
      ? `rounded-md bg-signal-500 ${sizing} text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]`
      : `rounded-md border border-navy-200 ${sizing} text-center font-semibold text-navy-700 transition-colors hover:border-navy-400`;

  return (
    <button
      type="button"
      onClick={() => {
        addItem(program);
        router.push('/checkout');
      }}
      className={`${base} ${className}`}
    >
      {count === 0
        ? `Enroll now · $${program.enrollment.amount.toLocaleString('en-US')}`
        : 'Enroll another student'}
    </button>
  );
}
