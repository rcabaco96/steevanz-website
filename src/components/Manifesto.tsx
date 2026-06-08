import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useLanguage } from "../i18n/LanguageContext";

export default function Manifesto() {
  const { c } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.86, filter: "blur(16px)", clipPath: "inset(30% round 32px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
            end: "top 28%",
            scrub: 0.45,
          },
        }
      );

      gsap.fromTo(
        glowRef.current,
        { opacity: 0.05 },
        {
          opacity: 0.28,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden border-y border-(--color-line)/60 bg-(--color-ink)"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(46% 46% at 50% 52%, rgba(207,165,99,1), transparent 72%)" }}
      />
      <div ref={contentRef} className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-(--color-gold)">{c.home.manifesto.eyebrow}</span>
        <p className="mt-8 text-balance font-display text-[9vw] leading-[1.08] tracking-tight text-(--color-bone) sm:text-6xl lg:text-7xl">
          {c.home.manifesto.line1} <span className="italic text-(--color-gold)">{c.home.manifesto.em1}</span>{c.home.manifesto.mid} <span className="italic text-(--color-gold)">{c.home.manifesto.em2}</span>
        </p>
      </div>
    </section>
  );
}
