import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import HeroScene from "../components/HeroScene";
import Manifesto from "../components/Manifesto";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";
import { ScrollMask } from "../components/ui/ScrollMask";

const STACK = [
  "Software à Medida",
  "E-Commerce",
  "Aplicações",
  "Networking",
  "Infraestruturas",
  "Cloud",
  "Silky Software",
  "Bom Tinto",
];

const HIGHLIGHTS = [
  {
    n: "02",
    to: "/quem-somos",
    title: "Quem Somos",
    body: "Uma equipa de nerds, geeks, genuínos e de carne e osso. Leais, revolucionários, criativos e empáticos — só assim faz sentido haver negócio.",
    cta: "Saber mais",
  },
  {
    n: "03",
    to: "/silky-software",
    title: "Silky Software with Human Touch",
    body: "Software à medida, e-commerce e aplicações — React, Angular, Vue, .NET, Python e mais. A tecnologia corre nas nossas veias, e temos a mania de a simplificar.",
    cta: "Ver a tecnologia",
  },
  {
    n: "04",
    to: "/networking",
    title: "Mingle with the Steevanz",
    body: "O networking é o nosso principal impulsionador de negócio. Não temos concorrentes, temos parceiros. Queres juntar-te à família?",
    cta: "Vamos conversar",
  },
  {
    n: "05",
    to: "/neighbourhood",
    title: "The Neighbourhood",
    body: "Sporting Clube de Portugal, Vinha, Aubay, Efficient Safe — alguns dos vizinhos com quem já adubámos negócio.",
    cta: "Ver o bairro",
  },
  {
    n: "06",
    to: "/fashion",
    title: "Steevanz Fashion",
    body: "“It is better to fail in originality than to succeed in imitation.” Moda, estilo e merch à boa maneira Steevanz.",
    cta: "Ver a coleção",
  },
  {
    n: "07",
    to: "/reach-out",
    title: "Reach Out",
    body: "“Skill is fine, and genius is splendid, but the right contacts are more valuable than either.” Diz-nos olá.",
    cta: "Falar com a família",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);

  return (
    <PageShell>
      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20">
        <HeroScene className="absolute inset-0 -z-10 [&>div]:h-full [&_canvas]:!h-full" />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 38%, rgba(155,95,214,0.18), transparent 70%), linear-gradient(180deg, rgba(22,12,34,0.2) 0%, rgba(22,12,34,0.85) 78%, rgba(22,12,34,1) 100%)",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="mx-auto w-full max-w-7xl px-6 sm:px-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Eyebrow>Herdade alentejana de IT · CBD Lisboeta · Família desde 04.02.2021</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-4xl font-display text-[13vw] leading-[0.96] tracking-tight text-(--color-bone) sm:text-7xl lg:text-[6.4rem]"
          >
            Steevanz.
            <br />
            <span className="italic text-(--color-gold)">It runs in the family.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-(--color-fog)"
          >
            Uma equipa de nerds, geeks, genuínos e de carne e osso. Leais,
            revolucionários, criativos e empáticos — aqui entregamos a tecnologia
            do amanhã, com os bons modos do antigamente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <MagneticButton to="/quem-somos" variant="solid">
              Conhecer a família
            </MagneticButton>
            <MagneticButton to="/reach-out" variant="ghost">
              Vamos conversar
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-(--color-fog)/70">Scroll</span>
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
          {STACK.map((s, i) => (
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
        <ScrollMask className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center" from={18}>
          <Reveal>
            <Eyebrow>A maneira Steevanz de trabalhar</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.1] tracking-tight text-(--color-bone) sm:text-5xl">
              É nosso propósito tornar a tecnologia <span className="italic text-(--color-gold)">empática</span> e realmente acessível a todos.
            </h2>
            <div className="mt-7 max-w-lg space-y-4 text-balance leading-relaxed text-(--color-fog)">
              <p>Da avó ao neto. Com carácter humano, enquanto produto e serviço.</p>
              <p>
                Aqui não tem de fingir saber o que é um front end. É a tecnologia
                que se adapta a si e ao seu negócio — com leveza, naturalidade e
                um sorriso nos lábios.
              </p>
            </div>
            <p className="mt-8 max-w-md text-balance font-display text-2xl italic leading-snug text-(--color-bone)">
              "Vamos simplificar a tecnologia e adaptá-la às necessidades da sua empresa."
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-[2rem] border border-(--color-line) bg-(--color-surface)/50 p-10">
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(60% 60% at 80% 10%, rgba(214,168,92,0.14), transparent 70%)" }}
              />
              <div className="relative">
                <Eyebrow>Ser Steevanz é ser</Eyebrow>
                <RevealGroup className="mt-6 flex flex-wrap gap-2.5">
                  {["Excelente", "Relevante", "Eficiente", "Conectado", "Fácil", "Empático", "Cordial", "Leal"].map((v) => (
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
        </ScrollMask>
      </section>

      {/* HIGHLIGHTS — the rest of the house */}
      <section className="relative overflow-hidden border-y border-(--color-line)/60 bg-(--color-ink) py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(50% 50% at 80% 10%, rgba(232,146,196,0.10), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <Eyebrow>O resto da casa</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
              Seis portas. <span className="italic text-(--color-gold)">Uma</span> casa de software.
            </h2>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <motion.div key={h.n} variants={revealItem}>
                <Link
                  to={h.to}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-surface)/50 p-8 transition-colors duration-500 hover:border-(--color-gold)/40 hover:bg-(--color-surface-2)"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-(--color-gold)/0 blur-3xl transition-all duration-700 group-hover:bg-(--color-gold)/15" />
                  <span className="font-mono text-xs text-(--color-gold)">{h.n}</span>
                  <h3 className="mt-5 font-display text-2xl tracking-tight text-(--color-bone)">{h.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-(--color-fog)">{h.body}</p>
                  <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-gold-bright)">
                    {h.cta}
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
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
              style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(214,168,92,0.22), transparent 70%)" }}
            />
            <div className="relative">
              <Eyebrow>Reach Out</Eyebrow>
              <h2 className="mx-auto mt-7 max-w-2xl text-balance font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
                Tens um negócio para levar do ponto A ao <span className="italic text-(--color-gold)">B, C ou Z</span>?
              </h2>
              <p className="mx-auto mt-6 max-w-md text-(--color-fog)">
                Deixa-nos os teus contactos — temos todo o gosto em chegar até ti.
                Sem fingir, sem pop-ups, sem amadorismo. Prometido por um Steevanz.
              </p>
              <div className="mt-10 flex justify-center">
                <MagneticButton to="/reach-out" variant="solid">
                  Vamos conversar
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
