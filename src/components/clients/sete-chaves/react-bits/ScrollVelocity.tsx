"use client";

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, type ReactNode } from "react";

// A strip of words that drifts sideways and speeds up (or turns back) with the scroll.
// Adapted from React Bits' ScrollVelocity (MIT + Commons Clause, © David Haz; licence in ./LICENSE.md).
// With reduced motion the strip stands still.

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

interface ScrollVelocityProps {
  children: ReactNode;
  /** Percent of one copy per second. Negative = to the right. */
  baseVelocity?: number;
  className?: string;
  copies?: number;
}

export function ScrollVelocity({
  children,
  baseVelocity = 3,
  className = "",
  copies = 4,
}: ScrollVelocityProps) {
  const reduced = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-100 / copies, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move =
      direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(f));
    base.set(base.get() - move / copies);
  });

  return (
    <div className={`overflow-hidden ${className}`}>
      <m.div
        className="flex w-max flex-nowrap whitespace-nowrap will-change-transform"
        style={{ x }}
      >
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {children}
          </div>
        ))}
      </m.div>
    </div>
  );
}
