"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

const tones = {
  brand: "bg-[var(--brand)] text-[var(--brand-text)] shadow-[0_16px_32px_-18px_var(--brand)] hover:brightness-110",
  soft: "border border-line-strong bg-surface text-text hover:bg-surface-2",
  gold: "bg-gold-soft text-gold-text ring-1 ring-gold/40 hover:brightness-105",
  quiet: "text-muted hover:bg-surface-2 hover:text-text",
  danger: "text-danger hover:bg-danger-soft",
} as const;

const sizes = {
  xl: "min-h-20 w-full rounded-[1.75rem] px-6 text-xl",
  lg: "min-h-14 w-full rounded-2xl px-5 text-base",
  md: "h-11 rounded-2xl px-4 text-sm",
  sm: "h-9 rounded-xl px-3 text-sm",
} as const;

/** The counter's buttons: big, in the space's colour, and busy while the server answers. */
export function CounterSubmit({
  children,
  pendingLabel,
  tone = "brand",
  size = "md",
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  pendingLabel?: string;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  className?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label={ariaLabel}
      className={`inline-flex select-none items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[filter,transform,background-color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {pending ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
