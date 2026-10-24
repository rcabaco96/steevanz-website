"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// The order basket of the online-shop demo: which pieces and how many, and whether the drawer is open. Kept in the
// page only (nothing is stored or sent anywhere until the visitor sends the WhatsApp message herself).

interface CartState {
  lines: Record<string, number>;
  count: number;
  open: boolean;
  /** The last piece added (and a count of additions, so adding it again is noticed), for the note after «Encomendar». */
  lastAdded: { id: string; n: number } | null;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<{ id: string; n: number } | null>(null);

  const add = useCallback((id: string) => {
    setLines((prev) => ({ ...prev, [id]: Math.min(20, (prev[id] ?? 0) + 1) }));
    setLastAdded((prev) => ({ id, n: (prev?.n ?? 0) + 1 }));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(20, qty);
      return next;
    });
  }, []);

  const value = useMemo<CartState>(() => {
    const count = Object.values(lines).reduce((sum, n) => sum + n, 0);
    return { lines, count, open, lastAdded, add, setQty, setOpen };
  }, [lines, open, lastAdded, add, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart outside CartProvider");
  return cart;
}
