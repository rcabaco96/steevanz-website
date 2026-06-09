import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scrub-tied clip-path/scale reveal: content unmasks from an inset frame as it
 * settles into the viewport — pairs with PageShell's section-snap so the cut
 * resolves right as the section comes to rest.
 */
export function ScrollReveal({
  children,
  className = "",
  from = 22,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 48%"],
  });

  const inset = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [from * 0.9, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% round ${radius}px)`;
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ clipPath, scale, opacity }}>
      {children}
    </motion.div>
  );
}
