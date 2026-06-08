import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import AccentScene from "../components/AccentScene";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";

const PILLARS = [
  {
    n: "01",
    tag: "Desenvolvimento de Software",
    color: "#ad5fb0",
    variant: "sphere" as const,
    headline: "A tecnologia corre nas nossas veias.",
    body: "Desenvolver software é o nosso talento — e temos a mania de o simplificar. Devs que decifram o código, à boa maneira Da Vinci, e o traduzem em produtos que fazem sentido para gente de carne e osso.",
    bullets: ["Software à medida, do wireframe ao deploy", "Angular · React · Vue.js · React Native · Flutter", ".NET · C# · Python · Node — backend robusto", "Azure · AWS · PostgreSQL · MongoDB · SQL Server"],
  },
  {
    n: "02",
    tag: "E-Commerce",
    color: "#cfa563",
    variant: "spiral" as const,
    headline: "Já viram algum Steevanz pobre, feio ou cheio de pop-ups?",
    body: "Já conheceram algum Steevanz amador? Bem nos pareceu. Tornamos a tecnologia acessível para todos e trazemos prosperidade ao teu negócio — lojas online limpas, rápidas e que vendem, com backoffice à medida.",
    bullets: ["Lojas online com backoffice e analytics", "Integrações de pagamento e logística", "SEO e performance que convertem", "Catálogos, promoções e gestão de stock"],
  },
  {
    n: "03",
    tag: "Aplicações",
    color: "#d97bb0",
    variant: "field" as const,
    headline: "Se fosse uma pessoa, uma aplicação seria certamente uma Steevanz.",
    body: "Damos à luz tecnologia única, inovadora e evolutiva. Parecida contigo na maneira de ser — apps mobile e web pensadas para acompanhar o crescimento do teu negócio, não para o travar.",
    bullets: ["Apps mobile nativas e híbridas", "Plataformas internas e de gestão", "Plugins e módulos de acesso à medida", "Infraestrutura, redes e suporte contínuo"],
  },
];

export default function Services() {
  return (
    <PageShell>
      <section className="relative overflow-hidden pt-44 pb-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(55% 45% at 50% 0%, rgba(155,95,214,0.18), transparent 70%)" }}
        />
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <Eyebrow>Silky Software with Human Touch</Eyebrow>
            <h1 className="mt-7 max-w-3xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-7xl">
              Tecnologia Steevanz: <span className="italic text-(--color-gold)">à medida, com alma.</span>
            </h1>
            <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-(--color-fog)">
              Software, e-commerce e aplicações — três pilares, uma só forma de
              trabalhar: direta, simples e principalmente mais humana. A tecnologia
              corre nas nossas veias, mas falamos a tua língua.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="space-y-px overflow-hidden rounded-[2rem] border border-(--color-line) bg-(--color-line)">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} className="block">
              <div className="grid items-center gap-10 bg-(--color-surface)/60 p-8 sm:p-12 lg:grid-cols-[1fr_1.3fr]">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-(--color-gold)">{p.n}</span>
                    <span className="h-px flex-1 bg-(--color-line)" />
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{ borderColor: `${p.color}55`, color: p.color }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <h2 className="mt-6 font-display text-3xl leading-[1.1] tracking-tight text-(--color-bone) sm:text-4xl">
                    {p.headline}
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-(--color-fog)">{p.body}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-(--color-fog)">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.color }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 font-display text-lg italic leading-snug text-(--color-bone)">
                    Deixa-nos os teus contactos, temos todo o gosto em chegar até ti.
                  </p>
                </div>

                <div className={`relative h-72 sm:h-80 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <AccentScene variant={p.variant} color={p.color} className="h-full [&_canvas]:!h-full" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* USP STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <Reveal>
          <Eyebrow>A nossa promessa</Eyebrow>
          <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
            Tecnologia que <span className="italic text-(--color-gold)">se adapta</span> a ti — não o contrário.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Software à medida", body: "Cada projeto é único e não repetível, ímpar e não perecível." },
            { title: "Networking ativo", body: "Um braço tecnológico, outro de networking — negócio que puxa negócio." },
            { title: "Infraestrutura & Cloud", body: "Azure, AWS, redes e suporte — a casa toda em ordem, por trás do ecrã." },
            { title: "Devs com mania da simplicidade", body: "Traduzimos termos escanifobéticos para linguagem de gente." },
            { title: "Backoffices que dão gosto usar", body: "Gestão, analytics e SEO — sem amadorismo, sem pop-ups, sem fingimento." },
            { title: "Acompanhamento contínuo", body: "Não desaparecemos depois do deploy. Ficamos à mesa." },
          ].map((a) => (
            <motion.div
              key={a.title}
              variants={revealItem}
              whileHover={{ backgroundColor: "rgba(50,33,63,0.9)" }}
              className="group bg-(--color-surface)/50 p-8 transition-colors"
            >
              <span className="block h-9 w-9 rounded-lg bg-gradient-to-br from-(--color-gold)/30 to-(--color-violet-500)/20 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mt-6 font-display text-xl tracking-tight text-(--color-bone)">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">{a.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-(--color-line) bg-(--color-surface)/50 p-10 sm:flex-row sm:items-center sm:p-14">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-(--color-bone) sm:text-4xl">
                Não sabes bem por onde começar?
              </h2>
              <p className="mt-3 max-w-md text-sm text-(--color-fog)">
                Conta-nos o que tens em mente — recomendamos o âmbito certo, a
                equipa certa e a tecnologia certa para o trabalho.
              </p>
            </div>
            <MagneticButton to="/reach-out" variant="solid" className="shrink-0">
              Falar com a família
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
