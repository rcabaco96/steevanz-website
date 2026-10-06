"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ShieldCheckIcon, verifiedExplanation } from "./verified";

/**
 * «Perfil verificado» badge: `sm` is the shield alone (next to a name, e.g. the competition table),
 * `md` a pill with the words. Either way it is the trigger of an explanation that opens on hover
 * (mouse) or tap, like InfoTip, and closes on Escape or a tap elsewhere.
 */
export function VerifiedBadge({ size = "sm", name, className = "" }: { size?: "sm" | "md"; name?: string; className?: string }) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const pointerType = useRef("");

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

  const trigger =
    size === "md"
      ? "inline-flex h-7 items-center gap-1 rounded-full bg-accent-soft px-2.5 text-xs font-semibold text-accent-text ring-1 ring-accent/25 hover:ring-accent/50"
      : // 16px shield, 36px touch target (negative margin keeps the line height).
        "-m-2.5 grid h-9 w-9 place-items-center rounded-full text-accent-text";

  return (
    <span
      ref={ref}
      className={`relative inline-flex shrink-0 align-middle ${className}`}
      onPointerEnter={(event) => event.pointerType === "mouse" && show()}
      onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={size === "sm" ? "Perfil verificado: o que quer dizer" : undefined}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
        }}
        onClick={() => (open && pointerType.current !== "mouse" ? setOpen(false) : show())}
        onBlur={() => setOpen(false)}
        className={`transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${trigger}`}
      >
        <ShieldCheckIcon size={size === "md" ? 15 : 16} />
        {size === "md" ? "Perfil verificado" : null}
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={`absolute top-full z-30 mt-1 w-[min(18rem,calc(100vw-2.5rem))] rounded-xl border border-line bg-surface p-3 text-left text-xs leading-relaxed font-normal tracking-normal text-muted normal-case shadow-[0_16px_40px_-16px_rgb(var(--shadow-color)/0.45)] ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <span className="mb-1 flex items-center gap-1 font-semibold text-accent-text">
            <ShieldCheckIcon size={14} />
            Perfil verificado
          </span>
          {verifiedExplanation(name)}
        </span>
      ) : null}
    </span>
  );
}
