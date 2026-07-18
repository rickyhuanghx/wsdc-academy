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
}

interface CartContextType {
  items: CartItem[];
  addItem: (program: Program) => void;
  removeItem: (lineId: string) => void;
  updateStudentInfo: (lineId: string, info: StudentInfo) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  countInCart: (programId: string) => number;
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

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const updateStudentInfo = useCallback((lineId: string, info: StudentInfo) => {
    setItems((prev) =>
      prev.map((item) => (item.lineId === lineId ? { ...item, studentInfo: info } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getSubtotal = () => items.reduce((total, item) => total + item.amount, 0);
  const getItemCount = () => items.length;
  const countInCart = (programId: string) =>
    items.filter((item) => item.programId === programId).length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateStudentInfo,
        clearCart,
        getSubtotal,
        getItemCount,
        countInCart,
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
