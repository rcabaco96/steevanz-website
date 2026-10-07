"use client";

import { useEffect, useRef, useState } from "react";
import { playChime, unlockAlerts } from "./alerts";

/**
 * Sound on the call screen: rings every time a new number is called. Browsers only allow sound
 * after a tap, so the screen shows "Ativar som" once (whoever sets up the TV taps it).
 */
export function ScreenChime({ latestCall }: { latestCall: string | null }) {
  const [enabled, setEnabled] = useState(false);
  const previous = useRef(latestCall);

  useEffect(() => {
    if (latestCall && latestCall !== previous.current && enabled) playChime();
    previous.current = latestCall;
  }, [latestCall, enabled]);

  if (enabled) return null;
  return (
    <button
      type="button"
      onClick={() => {
        unlockAlerts();
        playChime();
        setEnabled(true);
      }}
      className="rounded-full border border-white/25 px-4 py-2 text-[clamp(0.8rem,1vw,1.1rem)] font-semibold text-white/80 hover:bg-white/10"
    >
      Ativar som das chamadas
    </button>
  );
}
