"use client";

import { useEffect, useState } from "react";

/** The time in the space's time zone, as on a wall clock (updates every few seconds). */
export function Clock({ timeZone, initial }: { timeZone: string; initial: number }) {
  const [now, setNow] = useState(initial);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 10_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <time className="display text-xl tabular-nums text-text" dateTime={new Date(now).toISOString()}>
      {new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(now))}
    </time>
  );
}
