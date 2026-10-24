"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

// Fades and lifts its content into place the first time it scrolls into view (motion's whileInView;
// MotionConfig turns it into a plain fade with reduced motion).
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.9,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
