import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import AccentScene from "../components/AccentScene";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";
import { useLanguage } from "../i18n/LanguageContext";

export default function Networking() {
  const { c } = useLanguage();
  const n = c.networking;

  return (
    <PageShell>
      {/* INTRO */}
      <section className="relative overflow-hidden pt-44 pb-10">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50% 45% at 80% 10%, rgba(155,95,214,0.16), transparent 70%)" }}
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <Eyebrow>{n.hero.eyebrow}</Eyebrow>
            <h1 className="mt-7 max-w-2xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-6xl">
              {n.hero.titlePre} <span className="italic text-(--color-gold)">{n.hero.titleEm}</span> {n.hero.titlePost}
            </h1>
            <div className="mt-8 max-w-xl space-y-5 text-balance leading-relaxed text-(--color-fog)">
              <p>{n.hero.p1}</p>
              <p>{n.hero.p2}</p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative h-80 sm:h-96">
              <AccentScene variant="spiral" color="#d97bb0" className="h-full [&_canvas]:!h-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CHARACTERS */}
      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <Reveal>
          <Eyebrow>{n.characters.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
            {n.characters.titlePre} <span className="italic text-(--color-gold)">{n.characters.titleEm}</span> {n.characters.titlePost}
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
          {n.characters.list.map((char, i) => (
            <motion.div
              key={char.name}
              variants={revealItem}
              className="group relative bg-(--color-surface)/60 p-8 transition-colors duration-500 hover:bg-(--color-surface-2)"
            >
              <span className="font-mono text-xs text-(--color-gold)">0{i + 1}</span>
              <h3 className="mt-5 font-display text-xl tracking-tight text-(--color-bone)">{char.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">{char.role}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-y border-(--color-line)/60 bg-(--color-ink) py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>{n.philosophy.col1.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-tight text-(--color-bone) sm:text-4xl">
                {n.philosophy.col1.titlePre} <span className="italic text-(--color-gold)">{n.philosophy.col1.titleEm}</span>{n.philosophy.col1.titlePost}
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-(--color-fog)">
                <p>{n.philosophy.col1.p1}</p>
                <p>{n.philosophy.col1.p2}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Eyebrow>{n.philosophy.col2.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-tight text-(--color-bone) sm:text-4xl">
                {n.philosophy.col2.titlePre} <span className="italic text-(--color-gold)">{n.philosophy.col2.titleEm}</span>{n.philosophy.col2.titlePost}
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-(--color-fog)">
                <p>{n.philosophy.col2.p1}</p>
                <p className="font-display text-xl italic leading-snug text-(--color-bone)">
                  {n.philosophy.col2.quote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-(--color-line) bg-gradient-to-br from-(--color-surface) to-(--color-violet-900)/40 px-8 py-20 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(232,146,196,0.18), transparent 70%)" }}
            />
            <div className="relative">
              <Eyebrow>{n.cta.eyebrow}</Eyebrow>
              <h2 className="mx-auto mt-7 max-w-2xl text-balance font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
                {n.cta.titlePre} <span className="italic text-(--color-gold)">{n.cta.titleEm}</span>{n.cta.titlePost}
              </h2>
              <p className="mx-auto mt-6 max-w-md text-(--color-fog)">
                {n.cta.body}
              </p>
              <div className="mt-10 flex justify-center">
                <MagneticButton to="/reach-out" variant="solid">
                  {n.cta.cta}
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
