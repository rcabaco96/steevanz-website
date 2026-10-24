"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ferragialDelivery, ferragialWines } from "@/content/ferragial/facts";

export type Delivery = "pickup" | "ship";

interface CartState {
  /** Quantity per wine id. */
  items: Record<string, number>;
  delivery: Delivery;
  open: boolean;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setDelivery: (delivery: Delivery) => void;
  setOpen: (open: boolean) => void;
  /** Number of bottles (a box counts its bottles). */
  bottles: number;
  /** Euros without VAT. */
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartState | null>(null);
const storageKey = "fg-cesto";

// The online shop's basket: kept in this tab only (sessionStorage) and never sent anywhere. Amounts are always
// without VAT (owner's absolute rule): the page writes «+ IVA» beside them and never adds VAT.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as { items?: Record<string, number>; delivery?: Delivery } | null;
      const known = new Set(ferragialWines.map((w) => w.id));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring this tab's basket after hydration
      if (saved?.items) setItems(Object.fromEntries(Object.entries(saved.items).filter(([id, n]) => known.has(id) && n > 0 && n < 100)));
      if (saved?.delivery === "ship" || saved?.delivery === "pickup") setDelivery(saved.delivery);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ items, delivery }));
    } catch {}
  }, [items, delivery, loaded]);

  const add = useCallback((id: string) => setItems((prev) => ({ ...prev, [id]: Math.min(99, (prev[id] ?? 0) + 1) })), []);
  const setQty = useCallback(
    (id: string, qty: number) =>
      setItems((prev) => {
        const next = { ...prev };
        if (qty <= 0) delete next[id];
        else next[id] = Math.min(99, qty);
        return next;
      }),
    [],
  );

  const value = useMemo<CartState>(() => {
    let bottles = 0;
    let subtotal = 0;
    for (const wine of ferragialWines) {
      const qty = items[wine.id] ?? 0;
      bottles += qty * (wine.box?.bottles ?? 1);
      subtotal += qty * wine.price;
    }
    subtotal = Math.round(subtotal * 100) / 100;
    const shipping = delivery === "ship" && bottles > 0 && bottles < ferragialDelivery.freeFromBottles ? ferragialDelivery.shipping : 0;
    return { items, delivery, open, add, setQty, setDelivery, setOpen, bottles, subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 };
  }, [items, delivery, open, add, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart outside CartProvider");
  return cart;
}
