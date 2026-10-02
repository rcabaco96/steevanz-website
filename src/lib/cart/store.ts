"use client";

import { useSyncExternalStore } from "react";
import type { ProductId } from "@/content/types";
import {
  clampQuantity,
  defaultOptions,
  maxCartLines,
  sameOptions,
  sanitizeLines,
  sanitizeOptions,
  type CartLine,
  type CartLineOptions,
} from "./pricing";

const storageKey = "steevanz-cart";
const emptyCart: CartLine[] = [];
const listeners = new Set<() => void>();
let cached: CartLine[] | null = null;

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? sanitizeLines(JSON.parse(raw)) : emptyCart;
  } catch {
    return emptyCart;
  }
}

function write(next: CartLine[]) {
  cached = next;
  try {
    if (next.length) localStorage.setItem(storageKey, JSON.stringify(next));
    else localStorage.removeItem(storageKey);
  } catch {}
  listeners.forEach((listener) => listener());
}

function getSnapshot(): CartLine[] {
  if (cached === null) cached = read();
  return cached;
}

function getServerSnapshot(): CartLine[] {
  return emptyCart;
}

function onStorage(event: StorageEvent) {
  if (event.key !== storageKey) return;
  cached = read();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount(productId?: ProductId): number {
  return useCart().reduce((sum, line) => (!productId || line.productId === productId ? sum + line.quantity : sum), 0);
}

function newLineId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function updateLine(lineId: string, update: (line: CartLine) => CartLine) {
  write(getSnapshot().map((line) => (line.id === lineId ? update(line) : line)));
}

export const cart = {
  add(productId: ProductId) {
    const lines = getSnapshot();
    const options = defaultOptions(productId);
    const existing = lines.find((line) => line.productId === productId && sameOptions(line.options, options));
    if (existing) {
      cart.setQuantity(existing.id, existing.quantity + 1);
      return;
    }
    cart.addVariant(productId);
  },
  addVariant(productId: ProductId) {
    const lines = getSnapshot();
    if (lines.length >= maxCartLines) return;
    write([...lines, { id: newLineId(), productId, quantity: 1, options: defaultOptions(productId) }]);
  },
  setQuantity(lineId: string, quantity: number) {
    updateLine(lineId, (line) => ({ ...line, quantity: clampQuantity(quantity) }));
  },
  setOptions(lineId: string, options: Partial<CartLineOptions>) {
    updateLine(lineId, (line) => (line.options ? { ...line, options: sanitizeOptions(line.productId, { ...line.options, ...options }) } : line));
  },
  remove(lineId: string) {
    write(getSnapshot().filter((line) => line.id !== lineId));
  },
  clear() {
    write(emptyCart);
  },
};
