"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { InfoIcon } from "@/components/icons";

/**
 * Explains how a number or label was calculated. Business rule: every figure built with
 * Steevanz's own criteria gets one. Opens on hover (mouse) and on tap (touch), closes on
 * Escape or a tap elsewhere, and opens towards whichever side has room.
 */
export function InfoTip({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const pointerType = useRef<string>("");

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  function show() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setAlignRight(rect.left > window.innerWidth / 2);
    setOpen(true);
  }

  return (
    <span
      ref={ref}
      className="relative inline-flex align-middle"
      onPointerEnter={(event) => event.pointerType === "mouse" && show()}
      onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Como é calculado: ${label}`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
        }}
        // Mouse users already see it on hover, so a click keeps it open; touch and keyboard toggle.
        onClick={() => (open && pointerType.current !== "mouse" ? setOpen(false) : show())}
        onBlur={() => setOpen(false)}
        className="-m-2 grid h-9 w-9 place-items-center rounded-full text-subtle transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-ring"
      >
        <InfoIcon size={16} />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={`absolute top-full z-30 mt-1 w-[min(18rem,calc(100vw-2.5rem))] rounded-xl border border-line bg-surface p-3 text-left text-xs leading-relaxed font-normal tracking-normal text-muted normal-case shadow-[0_16px_40px_-16px_rgb(var(--shadow-color)/0.45)] ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <span className="mb-1 block font-semibold text-text">{label}</span>
          {children}
        </span>
      ) : null}
    </span>
  );
}
