"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

/**
 * Re-renders the server components of the page every `intervalMs` (and right away when the tab
 * becomes visible again). Client state, open forms and scroll stay as they are.
 *
 * By default it pauses while the tab is hidden. `whileHidden` keeps it going in the background:
 * a customer's ticket must still ring when the phone is locked or another app is open (browsers
 * slow background timers down, but don't stop them while the page is alive).
 */
export function AutoRefresh({ intervalMs, whileHidden = false }: { intervalMs: number; whileHidden?: boolean }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    let timer: number | undefined;
    const refresh = () => startTransition(() => router.refresh());
    const start = () => {
      window.clearInterval(timer);
      if (!whileHidden && document.visibilityState !== "visible") return;
      timer = window.setInterval(refresh, intervalMs);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
      start();
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, whileHidden, router]);

  return null;
}
