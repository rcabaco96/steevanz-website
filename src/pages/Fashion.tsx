import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import AccentScene from "../components/AccentScene";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";

const MERCH = [
  { n: "01", title: "Hoodie da família", body: "Quente como um almoço de domingo no Alentejo. Bordado com o emblema Steevanz." },
  { n: "02", title: "T-shirt #ITRUNSINTHEFAMILY", body: "Para usar com orgulho — no escritório, no café Orquídea, ou em qualquer lado." },
  { n: "03", title: "Caderno & caneta de circuito", body: "Para anotar a próxima ideia genial à mesa de família. Capa com o padrão dourado da marca." },
];

export default function Fashion() {
  return (
    <PageShell>
      {/* INTRO */}
      <section className="relative overflow-hidden pt-44 pb-10">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50% 45% at 80% 10%, rgba(214,168,92,0.16), transparent 70%)" }}
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <Eyebrow>Steevanz Fashion · Moda dos Steevanz</Eyebrow>
            <h1 className="mt-7 max-w-2xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-6xl">
              "It is better to fail in <span className="italic text-(--color-gold)">originality</span> than to succeed in imitation."
            </h1>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-(--color-fog)">
              — Herman Melville, Moby Dick
            </p>
            <div className="mt-8 max-w-xl space-y-5 text-balance leading-relaxed text-(--color-fog)">
              <p>
                Fashion is what you buy. Style is what you do IT. Aqui não vendemos
                roupa — vendemos uma forma de estar. Genuína, à boa maneira
                Steevanz, com um sorriso nos lábios.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative h-80 sm:h-96">
              <AccentScene variant="sphere" color="#cfa563" className="h-full [&_canvas]:!h-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* MERCH */}
      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <Reveal>
          <Eyebrow>A coleção</Eyebrow>
          <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
            Estilo que se veste. <span className="italic text-(--color-gold)">Família</span> que se mostra.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-3">
          {MERCH.map((m) => (
            <motion.div
              key={m.n}
              variants={revealItem}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-surface)/50"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-(--color-violet-900)/60 to-(--color-surface-2)">
                <div
                  className="absolute inset-0 opacity-50 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(214,168,92,0.28), transparent 70%)" }}
                />
                <span className="relative font-display text-5xl italic text-(--color-gold-bright)/70">S</span>
              </div>
              <div className="p-7">
                <span className="font-mono text-xs text-(--color-gold)">{m.n}</span>
                <h3 className="mt-3 font-display text-xl tracking-tight text-(--color-bone)">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">{m.body}</p>
                <span className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-fog)/70">
                  Brevemente
                </span>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-(--color-line) bg-gradient-to-br from-(--color-surface) to-(--color-violet-900)/40 px-8 py-20 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(214,168,92,0.20), transparent 70%)" }}
            />
            <div className="relative">
              <Eyebrow>Quer ser o primeiro a saber?</Eyebrow>
              <h2 className="mx-auto mt-7 max-w-2xl text-balance font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
                A coleção está a chegar. <span className="italic text-(--color-gold)">Avisamos-te.</span>
              </h2>
              <div className="mt-10 flex justify-center">
                <MagneticButton to="/reach-out" variant="solid">
                  Deixa o teu contacto
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
