"use client";

import { useState, useSyncExternalStore } from "react";
import { menuText, type MenuLanguage } from "@/lib/video-menus/i18n";

// The only piece of ordering in the menu's own bundle: the «Adicionar» buttons and the little store
// that links them to the ordering code (loaded only on a table's page or a demo menu's link with demo
// orders, ordering/TableOrdering). Each
// button reads its own dish's count, so a change in the cart redraws only the buttons whose count
// changed, never the cards (their videos) around them.

/** What a table's page passes to the menu to turn ordering on. */
export interface TableOrderingConfig {
  /** The table's link secret (/m/<token>), sent with every change. */
  token: string;
  tableName: string;
  /** The table's Realtime Broadcast channel. */
  channel: string;
  /** Supabase's public URL and anon key, for Realtime only (null: the phones just fetch now and then). */
  realtime: { url: string; key: string } | null;
}

/**
 * What a demo menu's public link passes instead (hasPublicDemoOrdering): an order of the visitor's
 * own, kept in their tab only (demo-ordering), never sent to the server nor shared with anyone.
 */
export interface DemoOrderingConfig {
  demo: true;
  /** The menu's slug (its demo session's key in the tab). */
  slug: string;
}

export type MenuOrderingConfig = TableOrderingConfig | DemoOrderingConfig;

export function isDemoOrdering(config: MenuOrderingConfig): config is DemoOrderingConfig {
  return "demo" in config && config.demo === true;
}

let counts: Record<string, number> = {};
const listeners = new Set<() => void>();
let handler: ((dish: string) => void) | null = null;
/** Taps before the ordering code arrived: sent once it does. */
const queued: string[] = [];

export const orderBridge = {
  setCounts(next: Record<string, number>) {
    counts = next;
    for (const listener of listeners) listener();
  },
  /** The ordering code takes the taps; returns the function that lets them go. */
  register(next: (dish: string) => void) {
    handler = next;
    for (const dish of queued.splice(0)) next(dish);
    return () => {
      if (handler === next) handler = null;
    };
  },
  add(dish: string) {
    if (handler) handler(dish);
    else if (queued.length < 10) queued.push(dish);
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDishCount(dish: string): number {
  return useSyncExternalStore(
    subscribe,
    () => counts[dish] ?? 0,
    () => 0,
  );
}

function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * «Adicionar»: one more of this dish in the table's order, at once (the count on the button and a
 * little bounce), without leaving the page. `dark`: over the full-screen video.
 */
export function AddToOrder({ dish, name, tone = "light", language = "pt" }: { dish: string; name: string; tone?: "light" | "dark"; language?: MenuLanguage }) {
  const text = menuText[language];
  const count = useDishCount(dish);
  const [taps, setTaps] = useState(0);
  const dark = tone === "dark";
  return (
    <button
      type="button"
      onClick={() => {
        orderBridge.add(dish);
        setTaps((value) => value + 1);
        try {
          navigator.vibrate?.(8);
        } catch {
          // not on this phone
        }
      }}
      aria-label={count ? text.addMoreAria(name, count) : text.addAria(name)}
      className={`relative inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-semibold text-white transition-transform active:scale-95 ${
        dark ? "h-12 px-5 text-base shadow-[0_8px_24px_rgba(0,0,0,0.35)]" : "h-11 w-full px-3 text-sm"
      }`}
      style={{ background: "var(--menu-accent)" }}
    >
      <span key={taps} className={taps ? "menu-add-pop inline-flex min-w-0 items-center gap-1.5" : "inline-flex min-w-0 items-center gap-1.5"}>
        <PlusIcon size={dark ? 20 : 18} />
        <span className="truncate">{text.add}</span>
      </span>
      {count ? (
        <span
          key={`count-${count}`}
          aria-hidden="true"
          className="menu-add-pop absolute -top-1.5 -right-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold tabular-nums shadow-md ring-2"
          style={{ color: "var(--menu-accent)", ["--tw-ring-color" as string]: "var(--menu-accent)" }}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
