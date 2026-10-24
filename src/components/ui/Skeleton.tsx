import type { CSSProperties } from "react";

/**
 * Placeholder block shaped like the content that is loading. Size it with classes
 * (e.g. "h-4 w-32", "h-12 w-12 rounded-full"); the shimmer stops for reduced motion.
 */
export function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  // The default corners only when none are given: two rounded-* classes do not override each other by order
  // (rounded-lg would beat rounded-full and rounded-2xl).
  const corners = /(^|\s)rounded(-|\s|$)/.test(className) ? "" : "rounded-lg";
  return (
    <span aria-hidden="true" style={style} className={`relative block overflow-hidden bg-surface-2 ${corners} ${className}`}>
      <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-bg/70 to-transparent" />
    </span>
  );
}
