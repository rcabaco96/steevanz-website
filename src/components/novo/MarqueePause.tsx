"use client";

import { useState } from "react";

// The client marquee's pause button (WCAG 2.2.2: anything that moves for more than five seconds can be paused).
// It sets data-paused on its section; the CSS stops the animation there.

export function MarqueePause({ pauseLabel, playLabel, className }: { pauseLabel: string; playLabel: string; className?: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className={className}
      aria-label={paused ? playLabel : pauseLabel}
      title={paused ? playLabel : pauseLabel}
      onClick={(event) => {
        const next = !paused;
        setPaused(next);
        event.currentTarget.closest("section")?.toggleAttribute("data-paused", next);
      }}
    >
      {paused ? (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="3" y="2.5" width="2.75" height="9" rx="0.8" fill="currentColor" />
          <rect x="8.25" y="2.5" width="2.75" height="9" rx="0.8" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
