"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** "⋯" on a row: the exceptions, out of the way until needed. Closes on a choice, a tap outside or Esc. */
export function More({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: Event) => {
      const details = ref.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !details.contains(event.target as Node)) details.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <details
      ref={ref}
      className="group/more relative shrink-0"
      onSubmit={() => {
        if (ref.current) ref.current.open = false;
      }}
    >
      <summary
        aria-label={label}
        className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-2xl text-xl leading-none text-muted transition-colors hover:bg-surface-2 hover:text-text group-open/more:bg-surface-2 group-open/more:text-text [&::-webkit-details-marker]:hidden"
      >
        <svg aria-hidden="true" width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </summary>
      <div className="absolute right-0 z-20 mt-2 flex w-60 flex-col gap-1 rounded-2xl border border-line bg-surface p-2 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.45)]">{children}</div>
    </details>
  );
}
