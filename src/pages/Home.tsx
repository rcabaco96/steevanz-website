import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/gsap";
import PageShell from "../components/PageShell";
import HeroScene from "../components/HeroScene";
import Manifesto from "../components/Manifesto";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { useLanguage } from "../i18n/LanguageContext";

export default function Home() {
  const { c } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(heroContentRef.current, {
        opacity: 0,
        scale: 0.92,
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageShell>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20"
      >
        <HeroScene className="absolute inset-0 -z-10 [&>div]:h-full [&_canvas]:!h-full" />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 38%, rgba(155,95,214,0.18), transparent 70%), linear-gradient(180deg, rgba(22,12,34,0.2) 0%, rgba(22,12,34,0.85) 78%, rgba(22,12,34,1) 100%)",
          }}
        />

        <div
          ref={heroContentRef}
          className="mx-auto w-full max-w-7xl px-6 sm:px-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Eyebrow>{c.home.hero.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-4xl font-display text-[13vw] leading-[0.96] tracking-tight text-(--color-bone) sm:text-7xl lg:text-[6.4rem]"
          >
            {c.home.hero.titleLine1}
            <br />
            <span className="italic text-(--color-gold)">
              {c.home.hero.titleLine2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-(--color-fog)"
          >
            {c.home.hero.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <MagneticButton to="/pricing" variant="solid">
              {c.home.hero.ctaPrimary}
            </MagneticButton>
            <MagneticButton to="/reach-out" variant="ghost">
              {c.home.hero.ctaSecondary}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--color-fog)/70">
            {c.home.hero.scroll}
          </span>
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-9 w-px bg-gradient-to-b from-(--color-gold) to-transparent"
          />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-(--color-line)/60 bg-(--color-ink) py-7">
        <Marquee duration={32}>
          {c.home.stack.map((s, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className="font-display text-3xl italic tracking-tight text-(--color-fog)/60 transition-colors hover:text-(--color-gold-bright)">
                {s}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-gold)/50" />
            </span>
          ))}
        </Marquee>
      </section>

      <Manifesto />

      {/* PURPOSE */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <ScrollReveal
          className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center"
          from={18}
        >
          <Reveal>
            <Eyebrow>{c.home.purpose.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.1] tracking-tight text-(--color-bone) sm:text-5xl">
              {c.home.purpose.title}{" "}
              <span className="italic text-(--color-gold)">
                {c.home.purpose.titleEm}
              </span>{" "}
              {c.home.purpose.titleRest}
            </h2>
            <div className="mt-7 max-w-lg space-y-4 text-balance leading-relaxed text-(--color-fog)">
              <p>{c.home.purpose.p1}</p>
              <p>{c.home.purpose.p2}</p>
            </div>
            <p className="mt-8 max-w-md text-balance font-display text-2xl italic leading-snug text-(--color-bone)">
              {c.home.purpose.quote}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-[2rem] border border-(--color-line) bg-(--color-surface)/50 p-10">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 60% at 80% 10%, rgba(214,168,92,0.14), transparent 70%)",
                }}
              />
              <div className="relative">
                <Eyebrow>{c.home.purpose.valuesEyebrow}</Eyebrow>
                <RevealGroup className="mt-6 flex flex-wrap gap-2.5">
                  {c.home.purpose.values.map((v) => (
                    <motion.span
                      key={v}
                      variants={revealItem}
                      className="rounded-full border border-(--color-line) bg-(--color-surface-2)/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-(--color-fog) transition-colors duration-300 hover:border-(--color-gold)/50 hover:text-(--color-bone)"
                    >
                      {v}
                    </motion.span>
                  ))}
                </RevealGroup>
              </div>
            </div>
          </Reveal>
        </ScrollReveal>
      </section>

      {/* HIGHLIGHTS — the rest of the house */}
      <section className="relative overflow-hidden border-y border-(--color-line)/60 bg-(--color-ink) py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 50% at 80% 10%, rgba(232,146,196,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <Eyebrow>{c.home.highlights.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
              {c.home.highlights.titlePre}{" "}
              <span className="italic text-(--color-gold)">
                {c.home.highlights.titleEm}
              </span>{" "}
              {c.home.highlights.titlePost}
            </h2>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.home.highlights.cards.map((h) => (
              <motion.div key={h.n} variants={revealItem}>
                <Link
                  to={h.to}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-surface)/50 p-8 transition-colors duration-500 hover:border-(--color-gold)/40 hover:bg-(--color-surface-2)"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-(--color-gold)/0 blur-3xl transition-all duration-700 group-hover:bg-(--color-gold)/15" />
                  <span className="font-mono text-xs text-(--color-gold)">
                    {h.n}
                  </span>
                  <h3 className="mt-5 font-display text-2xl tracking-tight text-(--color-bone)">
                    {h.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-(--color-fog)">
                    {h.body}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-gold-bright)">
                    {h.cta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-(--color-line) bg-gradient-to-br from-(--color-surface) to-(--color-violet-900)/40 px-8 py-20 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 70% at 50% 0%, rgba(214,168,92,0.22), transparent 70%)",
              }}
            />
            <div className="relative">
              <Eyebrow>{c.home.cta.eyebrow}</Eyebrow>
              <h2 className="mx-auto mt-7 max-w-2xl text-balance font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
                {c.home.cta.titlePre}{" "}
                <span className="italic text-(--color-gold)">
                  {c.home.cta.titleEm}
                </span>
                {c.home.cta.titlePost}
              </h2>
              <p className="mx-auto mt-6 max-w-md text-(--color-fog)">
                {c.home.cta.body}
              </p>
              <div className="mt-10 flex justify-center">
                <MagneticButton to="/reach-out" variant="solid">
                  {c.home.cta.cta}
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
