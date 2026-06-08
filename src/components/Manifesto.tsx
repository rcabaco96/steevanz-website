import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const inset = useTransform(scrollYProgress, [0, 0.32], [44, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% round ${v * 1.4}px)`);
  const scale = useTransform(scrollYProgress, [0.66, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.72, 1], [0, 1, 1, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.06, 0.22, 0.06]);
  const glowBg = useTransform(glow, (g) => `radial-gradient(46% 46% at 50% 52%, rgba(207,165,99,${g}), transparent 72%)`);

  return (
    <div ref={ref} className="relative h-[220vh] border-y border-(--color-line)/60 bg-(--color-ink)">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glowBg }} />
        <motion.div style={{ clipPath, scale, opacity }} className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-(--color-gold)">A nossa promessa</span>
          <p className="mt-8 text-balance font-display text-[9vw] leading-[1.08] tracking-tight text-(--color-bone) sm:text-6xl lg:text-7xl">
            Entregamos a tecnologia <span className="italic text-(--color-gold)">do amanhã</span>, com as boas maneiras <span className="italic text-(--color-gold)">do passado.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
