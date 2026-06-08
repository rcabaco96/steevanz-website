import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import AccentScene from "../components/AccentScene";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";

const VALUES = [
  { word: "Excelente", en: "Great" },
  { word: "Relevante", en: "Relevant" },
  { word: "Eficiente", en: "Efficient" },
  { word: "Conectado", en: "Connected" },
  { word: "Fácil", en: "Easy" },
  { word: "Empático", en: "Empathetic" },
  { word: "Cordial", en: "Friendly" },
  { word: "Leal", en: "Loyal" },
];

export default function QuemSomos() {
  return (
    <PageShell>
      {/* INTRO */}
      <section className="relative overflow-hidden pt-44 pb-10">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50% 45% at 20% 10%, rgba(155,95,214,0.16), transparent 70%)" }}
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <Eyebrow>Quem Somos · Who the F are Steevanz</Eyebrow>
            <h1 className="mt-7 max-w-2xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-6xl">
              On <span className="italic text-(--color-gold)">February 4, 2021</span>, a new way of doing business was born.
            </h1>
            <div className="mt-8 max-w-xl space-y-5 text-balance leading-relaxed text-(--color-fog)">
              <p>
                Uma equipa de nerds, geeks, genuínos e de carne e osso. Leais,
                revolucionários, criativos e empáticos que procuram, essencialmente,
                ser uma mais-valia para os seus clientes. Só assim faz sentido haver
                negócio.
              </p>
              <p>
                À mesa dos Steevanz serve-se uma forma direta, simples e
                principalmente mais humana de trabalhar tecnologia e software.
                Com um braço tecnológico e outro de networking, este alentejano
                pôs mãos à obra numa herdade alentejana de IT no CBD Lisboeta —
                onde recebemos com honras de estado todos os clientes e fornecedores.
              </p>
              <p className="font-display text-xl italic leading-snug text-(--color-bone)">
                Tecnologia feita à medida. Feita a pensar no futuro, com os modos do antigamente.
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

      {/* PURPOSE */}
      <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>O nosso propósito</Eyebrow>
            <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-tight text-(--color-bone) sm:text-4xl">
              Tornar a tecnologia empática e realmente acessível a todos. <span className="italic text-(--color-gold)">Da avó ao neto.</span>
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-(--color-fog)">
              <p>
                Para empresas S, M, L e XL — com um fraquinho assumido pelos
                empresários em nome individual, micro e médias empresas. Queremos
                chegar aos consumidores de tecnologia em todo o mundo, de todas as
                raças, credos e tamanhos.
              </p>
              <p>
                Vamos tornar a tecnologia mais útil, levando a sua empresa do
                ponto A ao ponto B, C ou Z — simplificando os termos
                escanifobéticos, traduzindo a tecnologia para leigos.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Eyebrow>A nossa conceção</Eyebrow>
            <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-tight text-(--color-bone) sm:text-4xl">
              Trabalhar com a Steevanz será sempre sinónimo de <span className="italic text-(--color-gold)">utilidade, objetividade e diversão.</span>
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-(--color-fog)">
              <p>
                Com transparência e foco na qualidade do serviço prestado a cada
                cliente, cada projeto é único e não repetível, ímpar e não
                perecível. A Steevanz será o ponto de aproximação entre a
                tecnologia e a pessoa de carne e osso.
              </p>
              <p className="font-display text-xl italic leading-snug text-(--color-bone)">
                Trabalhar com a Steevanz será a diferença entre a falha e o sucesso do seu negócio.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-(--color-line)/60 bg-(--color-ink) py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <Eyebrow>Ser Steevanz é ser</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
              Oito palavras que <span className="italic text-(--color-gold)">cabem</span> à mesa de família.
            </h2>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.word}
                variants={revealItem}
                className="group relative bg-(--color-surface)/60 p-8 transition-colors duration-500 hover:bg-(--color-surface-2)"
              >
                <span className="font-mono text-xs text-(--color-gold)">0{i + 1}</span>
                <h3 className="mt-5 font-display text-2xl tracking-tight text-(--color-bone)">{v.word}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-fog)">{v.en}</p>
                <span className="mt-6 block h-px w-8 bg-(--color-gold)/40 transition-all duration-500 group-hover:w-16 group-hover:bg-(--color-gold)" />
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* QUOTE / CTA */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-(--color-line) bg-gradient-to-br from-(--color-surface) to-(--color-violet-900)/40 px-8 py-20 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 70% at 50% 0%, rgba(214,168,92,0.20), transparent 70%)" }}
            />
            <div className="relative">
              <p className="mx-auto max-w-2xl text-balance font-display text-3xl italic leading-[1.3] tracking-tight text-(--color-bone) sm:text-4xl">
                "Aqui não tem de fingir saber o que é um front end. É a tecnologia
                que se adapta a si e ao seu negócio — com leveza, naturalidade e
                um sorriso nos lábios."
              </p>
              <div className="mt-10 flex justify-center">
                <MagneticButton to="/silky-software" variant="solid">
                  Ver a nossa tecnologia
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
