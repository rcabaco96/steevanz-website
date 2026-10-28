"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

// A button that leans towards the mouse pointer when it comes close.
// Adapted from React Bits' Magnet (MIT + Commons Clause, © David Haz; licence in ./LICENSE.md): springs from
// motion instead of a hand-written loop, only with a real mouse, never with reduced motion.

interface MagnetProps {
  children: ReactNode;
  /** How far around the element the pull starts, in px. */
  padding?: number;
  /** Higher = weaker pull. */
  strength?: number;
  className?: string;
}

export function Magnet({
  children,
  padding = 60,
  strength = 4,
  className = "",
}: MagnetProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 15, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 170, damping: 15, mass: 0.6 });

  useEffect(() => {
    if (
      reduced ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const onMove = (event: globalThis.PointerEvent) => {
      const el = ref.current;
      if (!el || event.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const near =
        Math.abs(event.clientX - cx) < rect.width / 2 + padding &&
        Math.abs(event.clientY - cy) < rect.height / 2 + padding;
      x.set(near ? (event.clientX - cx) / strength : 0);
      y.set(near ? (event.clientY - cy) / strength : 0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, padding, strength, x, y]);

  const reset = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerLeave={reset}
      className={`inline-flex will-change-transform ${className}`}
    >
      {children}
    </m.span>
  );
}
