import { useState } from "react";
import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";

const FILTERS = ["Todos", "Sporting CP", "Vinha", "Aubay", "Efficient Safe"] as const;

const PROJECTS = [
  {
    title: "Sporting CP — Bilhética & Loja Verde",
    category: "Sporting CP",
    year: "2023",
    blurb: "Sistema de bilhética, loja online (lojaverde.sporting.pt) com backoffice, analytics e SEO, e Corporate Matchday com distribuição de bilhetes por QR code.",
    tags: ["E-commerce", "Backoffice", "QR Code"],
    accent: "from-(--color-violet-500)/30 to-(--color-violet-900)/10",
  },
  {
    title: "Sporting CP — Gamebox & App Interna",
    category: "Sporting CP",
    year: "2023",
    blurb: "Plataforma Gamebox (gamebox.sporting.pt) e aplicação interna do clube — duas faces de uma só casa tecnológica.",
    tags: ["Plataforma Web", "Aplicação Interna"],
    accent: "from-(--color-gold)/25 to-(--color-violet-900)/10",
  },
  {
    title: "Vinha — Rebranding & Loja Online",
    category: "Vinha",
    year: "2023",
    blurb: "Rebranding completo, nova loja online e backoffice com integrações à medida — uma marca renovada de raiz à frente da loja.",
    tags: ["Rebranding", "E-commerce", "Integrações"],
    accent: "from-(--color-violet-400)/25 to-(--color-gold)/10",
  },
  {
    title: "Aubay Portugal — Timesheet App",
    category: "Aubay",
    year: "2024",
    blurb: "Aplicação de registo de horas pensada para equipas grandes — simples de usar, fácil de gerir, sem fricção no dia a dia.",
    tags: ["App Interna", ".NET", "React"],
    accent: "from-(--color-violet-500)/30 to-(--color-gold)/15",
  },
  {
    title: "Aubay Portugal — Resource Manager",
    category: "Aubay",
    year: "2024",
    blurb: "Plataforma de gestão de recrutamento e recursos, com formulário internacional para candidaturas além-fronteiras.",
    tags: ["Recrutamento", "Plataforma Web"],
    accent: "from-(--color-gold)/20 to-(--color-violet-400)/15",
  },
  {
    title: "Efficient Safe — App & Backoffice",
    category: "Efficient Safe",
    year: "2024",
    blurb: "App mobile de acesso a documentos de seguros com plugin de gestão de acessos Steevanz, e backoffice de suporte completo.",
    tags: ["Mobile", "Plugin de Acessos", "Backoffice"],
    accent: "from-(--color-violet-600)/25 to-(--color-violet-900)/15",
  },
];

export default function Work() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const visible = filter === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <PageShell>
      <section className="relative overflow-hidden pt-44 pb-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50% 40% at 80% 0%, rgba(214,168,92,0.14), transparent 70%)" }}
        />
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <Eyebrow>The Neighbourhood</Eyebrow>
            <h1 className="mt-7 max-w-3xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-7xl">
              Um bom <span className="italic text-(--color-gold)">bairro</span> valoriza a propriedade.
            </h1>
            <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-(--color-fog)">
              Alguns dos vizinhos com quem já adubámos negócio — Sporting Clube de
              Portugal, Vinha, Aubay Portugal e Efficient Safe. Cada projeto, uma
              história à parte. Juntos, o nosso bairro.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  filter === f
                    ? "border-(--color-gold) text-(--color-bone)"
                    : "border-(--color-line) text-(--color-fog) hover:text-(--color-bone)"
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-(--color-gold)/15"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {f}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" key={filter}>
          {visible.map((p) => (
            <motion.article
              key={p.title}
              variants={revealItem}
              layout
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-surface)/50"
            >
              <div className={`relative flex h-52 items-end overflow-hidden bg-gradient-to-br ${p.accent} p-6`}>
                <div
                  className="absolute inset-0 opacity-40 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 18px)",
                  }}
                />
                <span className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-bone)/70">
                  {p.category} · {p.year}
                </span>
                <span className="absolute right-6 top-6 grid h-9 w-9 place-items-center rounded-full border border-(--color-bone)/25 text-(--color-bone) opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl tracking-tight text-(--color-bone)">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">{p.blurb}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-(--color-line) px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-(--color-fog)">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-(--color-line) bg-gradient-to-br from-(--color-surface) to-(--color-violet-900)/30 p-10 sm:flex-row sm:items-center sm:p-14">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-(--color-bone) sm:text-4xl">
                Queres ser o próximo vizinho?
              </h2>
              <p className="mt-3 max-w-md text-sm text-(--color-fog)">
                Um bom bairro valoriza a propriedade — vamos ver se há lugar
                para o teu negócio aqui ao lado.
              </p>
            </div>
            <MagneticButton to="/reach-out" variant="solid" className="shrink-0">
              Apresenta o teu projeto
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
