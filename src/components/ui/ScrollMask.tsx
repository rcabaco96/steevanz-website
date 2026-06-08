import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * Cinematic clip-path reveal: content unmasks from an inset frame and settles
 * into place as it scrolls through the lower half of the viewport.
 */
export function ScrollMask({
  children,
  className = "",
  from = 30,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.4"] });

  const inset = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% round ${Math.max(0, v * 0.8)}px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <motion.div ref={ref} style={{ clipPath, scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
