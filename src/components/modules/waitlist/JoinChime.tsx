"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { playChime, unlockAlerts } from "@/components/public/waitlist/alerts";

const key = "fila:som-entradas";
const changed = "fila:som-entradas-mudou";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changed, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changed, callback);
  };
}

function readOn(): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/**
 * A sound on the team's phone each time someone joins the queue. Browsers only allow sound after
 * a tap, so it is switched on once (and remembered on this device).
 */
export function JoinChime({ latest }: { latest: string | null }) {
  const on = useSyncExternalStore(subscribe, readOn, () => false);
  const previous = useRef(latest);

  useEffect(() => {
    if (on && latest && latest !== previous.current) playChime();
    previous.current = latest;
  }, [latest, on]);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        if (!on) {
          unlockAlerts();
          playChime();
        }
        try {
          window.localStorage.setItem(key, on ? "0" : "1");
        } catch {
          // Not remembered on this device: fine.
        }
        window.dispatchEvent(new Event(changed));
      }}
      className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors ${on ? "bg-accent-soft text-accent-text" : "border border-line text-muted hover:text-text"}`}
    >
      <svg aria-hidden="true" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        {on ? null : <path d="m2 2 20 20" />}
      </svg>
      {on ? "Som ligado" : "Som de novas entradas"}
    </button>
  );
}
