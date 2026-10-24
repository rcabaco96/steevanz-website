"use client";

import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

// A number that counts up from zero the first time it scrolls into view.
// Adapted from React Bits' CountUp (MIT + Commons Clause, © David Haz; licence in ./LICENSE.md): the final value is
// in the HTML (readable without JavaScript and with reduced motion); the spring only runs when it comes into view.

interface CountUpProps {
  to: number;
  /** Seconds, roughly. */
  duration?: number;
  className?: string;
}

export function CountUp({ to, duration = 1.6, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const value = useMotionValue(0);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const spring = useSpring(value, { damping, stiffness });
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    if (!reduced && inView) value.set(to);
  }, [inView, reduced, to, value]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) ref.current.textContent = String(Math.round(latest));
      }),
    [spring],
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {to}
    </span>
  );
}
