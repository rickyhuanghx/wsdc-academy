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
  // Date of birth (YYYY-MM-DD). Collected only for tournament entries, where
  // the organiser's age rules apply; absent on program lines.
  dob?: string;
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
  // Tournament entries (src/lib/tournaments.ts) share the cart but are priced
  // by the ClassDesk API, not programs.ts. Absent (= 'program') on class lines.
  // Writing-competition packages (src/lib/competitions.ts) are also ClassDesk-
  // priced but behave like class lines everywhere else (they may share a cart
  // with programs, take the returning-families code where eligible, and are
  // fulfilled by our own webhook emails).
  kind?: 'program' | 'tournament' | 'writing';
  tournamentSlug?: string;
  /** % off for families already enrolled with us (tournament lines) */
  existingStudentDiscountPct?: number;
  /** Writing lines: the ClassDesk package sku (also the tail of programId). */
  sku?: string;
  competitionSlug?: string;
  /** Writing lines: whether RETURNER27 applies (journals and 1-on-1 packages do not). Display only; the server re-derives it. */
  promoEligible?: boolean;
}

// What a writing-competition "Add to cart" control hands to the cart.
export interface WritingLine {
  sku: string;
  competitionSlug: string;
  competitionName: string;
  packageLabel: string;
  hours: number;
  amountUsd: number;
  promoEligible?: boolean;
}

// What a tournament "Register" button hands to the cart.
export interface TournamentLine {
  slug: string;
  name: string;
  amountUsd: number;
  studentName?: string;
  existingStudentDiscountPct?: number;
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
  // True once localStorage has been read; effects that add lines on mount
  // (checkout ?tournament= prefill) must wait for it or hydration overwrites them.
  isHydrated: boolean;
  addItem: (program: Program, selection?: { ageGroup?: string; timeSlot?: string }) => void;
  addVariantItem: (program: Program, variant: VariantLine) => void;
  addTournamentItem: (line: TournamentLine) => void;
  addWritingItem: (line: WritingLine) => void;
  removeItem: (lineId: string) => void;
  updateStudentInfo: (lineId: string, info: StudentInfo) => void;
  updateLineSelection: (lineId: string, patch: { ageGroup?: string; timeSlot?: string }) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  countInCart: (programId: string) => number;
  countVariantInCart: (programId: string, variantId: string) => number;
  hasTournamentItems: () => boolean;
}

export const TOURNAMENT_ID_PREFIX = 'tournament:';
export const isTournamentItem = (item: CartItem) =>
  item.kind === 'tournament' || item.programId.startsWith(TOURNAMENT_ID_PREFIX);

export const WRITING_ID_PREFIX = 'writing:';
export const isWritingItem = (item: CartItem) =>
  item.kind === 'writing' || item.programId.startsWith(WRITING_ID_PREFIX);

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

  const addItem = useCallback(
    (program: Program, selection?: { ageGroup?: string; timeSlot?: string }) => {
      setItems((prev) => [
        ...prev,
        {
          lineId: `${program.id}-${crypto.randomUUID()}`,
          programId: program.id,
          programName: program.name,
          unitLabel: program.enrollment.unitLabel,
          amount: program.enrollment.amount,
          studentInfo: emptyStudentInfo(),
          ageGroup: selection?.ageGroup,
          timeSlot: selection?.timeSlot,
        },
      ]);
    },
    [],
  );

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

  const addTournamentItem = useCallback((line: TournamentLine) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: `${TOURNAMENT_ID_PREFIX}${line.slug}-${crypto.randomUUID()}`,
        programId: `${TOURNAMENT_ID_PREFIX}${line.slug}`,
        programName: line.name,
        unitLabel: 'Tournament entry',
        amount: line.amountUsd,
        kind: 'tournament',
        tournamentSlug: line.slug,
        existingStudentDiscountPct: line.existingStudentDiscountPct ?? 0,
        studentInfo: { name: line.studentName ?? '', gradeLevel: '', school: '', dob: '' },
      },
    ]);
  }, []);

  const addWritingItem = useCallback((line: WritingLine) => {
    setItems((prev) => [
      ...prev,
      {
        lineId: `${WRITING_ID_PREFIX}${line.sku}-${crypto.randomUUID()}`,
        programId: `${WRITING_ID_PREFIX}${line.sku}`,
        programName: `${line.competitionName} · ${line.packageLabel}`,
        unitLabel: 'Enrolment',
        amount: line.amountUsd,
        kind: 'writing',
        sku: line.sku,
        competitionSlug: line.competitionSlug,
        promoEligible: line.promoEligible ?? false,
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
  const hasTournamentItems = () => items.some(isTournamentItem);

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        addItem,
        addVariantItem,
        addTournamentItem,
        addWritingItem,
        removeItem,
        updateStudentInfo,
        updateLineSelection,
        clearCart,
        getSubtotal,
        getItemCount,
        countInCart,
        countVariantInCart,
        hasTournamentItems,
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
