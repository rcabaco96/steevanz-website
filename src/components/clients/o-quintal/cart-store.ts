"use client";

import { useSyncExternalStore } from "react";
import { addToCart, cartStorageKey, clampCartQuantity, sanitizeCart, type OQuintalCartLine } from "@/lib/o-quintal/cart";

// The cart's store for the shop's pages: localStorage (every access wrapped, it may be blocked), shared between
// tabs through the «storage» event. The server snapshot is always empty, so the first paint matches.
const empty: OQuintalCartLine[] = [];
const listeners = new Set<() => void>();
let cached: OQuintalCartLine[] | null = null;

function read(): OQuintalCartLine[] {
  try {
    const raw = localStorage.getItem(cartStorageKey);
    return raw ? sanitizeCart(JSON.parse(raw)) : empty;
  } catch {
    return empty;
  }
}

function write(next: OQuintalCartLine[]) {
  cached = next;
  try {
    if (next.length) localStorage.setItem(cartStorageKey, JSON.stringify(next));
    else localStorage.removeItem(cartStorageKey);
  } catch {}
  listeners.forEach((listener) => listener());
}

function snapshot(): OQuintalCartLine[] {
  if (cached === null) cached = read();
  return cached;
}

function onStorage(event: StorageEvent) {
  if (event.key !== cartStorageKey) return;
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

export function useOQuintalCart(): OQuintalCartLine[] {
  return useSyncExternalStore(subscribe, snapshot, () => empty);
}

export const oQuintalCart = {
  add(id: string, choice: string | null, quantity = 1) {
    write(addToCart(snapshot(), id, choice, quantity));
  },
  setQuantity(id: string, choice: string | null, quantity: number) {
    write(snapshot().map((line) => (line.id === id && line.choice === choice ? { ...line, quantity: clampCartQuantity(quantity) } : line)));
  },
  remove(id: string, choice: string | null) {
    write(snapshot().filter((line) => !(line.id === id && line.choice === choice)));
  },
  clear() {
    write([]);
  },
};
