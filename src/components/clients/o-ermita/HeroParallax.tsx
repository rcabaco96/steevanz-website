"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

// The hero as the page scrolls away: the photo sinks slower than the page (parallax) and the words drift up
// and fade. Transforms and opacity only; nothing moves with reduced motion.
export function HeroParallax({ media, children, className = "" }: { media: ReactNode; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-14%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);
  return (
    <div ref={ref} className="relative flex min-h-[max(100svh,620px)] flex-col">
      <m.div style={{ y: mediaY }} className="absolute inset-0 -z-10 overflow-hidden will-change-transform">
        {media}
      </m.div>
      <m.div style={{ y: textY, opacity }} className={className}>
        {children}
      </m.div>
    </div>
  );
}
