import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";

export default function Manifesto() {
  const { c } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: contentProgress } = useScroll({
    target: sectionRef,
    offset: ["start 88%", "start 28%"],
  });
  const opacity = useTransform(contentProgress, [0, 1], [0, 1]);
  const scale = useTransform(contentProgress, [0, 1], [0.86, 1]);
  const blur = useTransform(contentProgress, [0, 1], [16, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const inset = useTransform(contentProgress, [0, 1], [30, 0]);
  const radius = useTransform(contentProgress, [0, 1], [32, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% round ${radius}px)`;

  const { scrollYProgress: glowProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const glowOpacity = useTransform(glowProgress, [0, 1], [0.05, 0.28]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden border-y border-(--color-line)/60 bg-(--color-ink)"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(46% 46% at 50% 52%, rgba(207,165,99,1), transparent 72%)",
        }}
      />
      <motion.div
        className="relative mx-auto max-w-4xl px-6 text-center sm:px-10"
        style={{ opacity, scale, filter, clipPath }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-(--color-gold)">{c.home.manifesto.eyebrow}</span>
        <p className="mt-8 text-balance font-display text-[9vw] leading-[1.08] tracking-tight text-(--color-bone) sm:text-6xl lg:text-7xl">
          {c.home.manifesto.line1} <span className="italic text-(--color-gold)">{c.home.manifesto.em1}</span>{c.home.manifesto.mid} <span className="italic text-(--color-gold)">{c.home.manifesto.em2}</span>
        </p>
      </motion.div>
    </section>
  );
}
