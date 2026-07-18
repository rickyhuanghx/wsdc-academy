'use client';

// Client-only cart persisted in localStorage. Each cart line is one program
// enrollment for one student — the same program can appear on multiple lines
// (e.g. two siblings both joining Foundations), which is why lines carry a
// unique lineId instead of being keyed by program.

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { type Program } from '@/data/programs';

export interface StudentInfo {
  name: string;
  gradeLevel: string;
  school: string;
}

export const emptyStudentInfo = (): StudentInfo => ({ name: '', gradeLevel: '', school: '' });

export interface CartItem {
  lineId: string;
  programId: string;
  programName: string;
  unitLabel: string;
  amount: number; // USD
  studentInfo: StudentInfo;
  // 1-on-1 variant lines (diagnostic / hourly / package). Absent on fixed programs.
  variantId?: string;
  quantity?: number; // hours, for the hourly 1-on-1 variant
  // Enrollment selections the buyer makes at checkout (option ids). Kept off
  // studentInfo so the "same student for all" mirror doesn't copy program-
  // specific option ids across lines.
  ageGroup?: string;
  timeSlot?: string;
}

// What a 1-on-1 variant "Add" button hands to the cart.
export interface VariantLine {
  variantId: string;
  quantity?: number;
  unitLabel: string;
  amount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (program: Program) => void;
  addVariantItem: (program: Program, variant: VariantLine) => void;
  removeItem: (lineId: string) => void;
  updateStudentInfo: (lineId: string, info: StudentInfo) => void;
  updateLineSelection: (lineId: string, patch: { ageGroup?: string; timeSlot?: string }) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  countInCart: (programId: string) => number;
  countVariantInCart: (programId: string, variantId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'wsdc-academy-cart';

function isValidItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false;
  const it = item as Record<string, unknown>;
  return (
    typeof it.lineId === 'string' &&
    typeof it.programId === 'string' &&
    typeof it.programName === 'string' &&
    typeof it.unitLabel === 'string' &&
    typeof it.amount === 'number' &&
    !!it.studentInfo &&
    typeof it.studentInfo === 'object'
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // localStorage isn't available during SSR, so hydrate from inside an effect.
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed.filter(isValidItem));
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = useCallback((program: Program) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: `${program.id}-${crypto.randomUUID()}`,
        programId: program.id,
        programName: program.name,
        unitLabel: program.enrollment.unitLabel,
        amount: program.enrollment.amount,
        studentInfo: emptyStudentInfo(),
      },
    ]);
  }, []);

  const addVariantItem = useCallback((program: Program, variant: VariantLine) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: `${program.id}-${variant.variantId}-${crypto.randomUUID()}`,
        programId: program.id,
        programName: program.name,
        unitLabel: variant.unitLabel,
        amount: variant.amount,
        variantId: variant.variantId,
        quantity: variant.quantity,
        studentInfo: emptyStudentInfo(),
      },
    ]);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const updateStudentInfo = useCallback((lineId: string, info: StudentInfo) => {
    setItems((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, studentInfo: info } : item)),
    );
  }, []);

  const updateLineSelection = useCallback(
    (lineId: string, patch: { ageGroup?: string; timeSlot?: string }) => {
      setItems((prev) =>
        prev.map((item) => (item.lineId === lineId ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getSubtotal = () => items.reduce((total, item) => total + item.amount, 0);
  const getItemCount = () => items.length;
  const countInCart = (programId: string) =>
    items.filter((item) => item.programId === programId).length;
  const countVariantInCart = (programId: string, variantId: string) =>
    items.filter((item) => item.programId === programId && item.variantId === variantId).length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addVariantItem,
        removeItem,
        updateStudentInfo,
        updateLineSelection,
        clearCart,
        getSubtotal,
        getItemCount,
        countInCart,
        countVariantInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
