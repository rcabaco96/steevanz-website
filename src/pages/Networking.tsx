import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import AccentScene from "../components/AccentScene";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";

const CHARACTERS = [
  { name: "Mr. Robot", role: "O hacker que muda o mundo de fora para dentro" },
  { name: "Iron Man", role: "O génio que constrói o futuro com as próprias mãos" },
  { name: "Sr. João", role: "Do café Orquídea — conhece toda a gente da rua" },
  { name: "Donatello", role: "Das Tartarugas Ninja — o cérebro por trás da equipa" },
];

export default function Networking() {
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
            <Eyebrow>Mingle with the Steevanz · Networking</Eyebrow>
            <h1 className="mt-7 max-w-2xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-6xl">
              O networking é o nosso <span className="italic text-(--color-gold)">principal impulsionador</span> de negócio.
            </h1>
            <div className="mt-8 max-w-xl space-y-5 text-balance leading-relaxed text-(--color-fog)">
              <p>
                Competimos connosco próprios. Não temos concorrentes, temos
                parceiros. E faltas-nos tu.
              </p>
              <p>
                Pensa em quem admiras: o Mr. Robot, o Iron Man, o senhor João do
                café Orquídea, o Donatello das Tartarugas Ninja. Génios, hackers,
                heróis e gente da terra — todos têm uma coisa em comum: sabem que
                ninguém faz nada sozinho.
              </p>
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
          <Eyebrow>Génios precisam de tribo</Eyebrow>
          <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
            Até os <span className="italic text-(--color-gold)">maiores</span> heróis têm quem lhes bata à porta.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTERS.map((c, i) => (
            <motion.div
              key={c.name}
              variants={revealItem}
              className="group relative bg-(--color-surface)/60 p-8 transition-colors duration-500 hover:bg-(--color-surface-2)"
            >
              <span className="font-mono text-xs text-(--color-gold)">0{i + 1}</span>
              <h3 className="mt-5 font-display text-xl tracking-tight text-(--color-bone)">{c.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">{c.role}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* PHILOSOPHY */}
      <section className="border-y border-(--color-line)/60 bg-(--color-ink) py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Somos a nossa própria apólice de seguros</Eyebrow>
              <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-tight text-(--color-bone) sm:text-4xl">
                Quanto mais gente <span className="italic text-(--color-gold)">conhecemos</span>, mais forte é a casa.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-(--color-fog)">
                <p>
                  Não acreditamos em redes que só puxam para um lado. O networking
                  Steevanz é recíproco: ajudamos quem nos ajuda, recomendamos quem
                  recomendamos, abrimos portas que esperamos ver abertas também
                  para nós.
                </p>
                <p>
                  É essa reciprocidade — mais do que qualquer contrato — que nos
                  protege e nos faz crescer. Por isso dizemos que somos a nossa
                  própria apólice de seguros.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Eyebrow>Faltas-nos tu</Eyebrow>
              <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-tight text-(--color-bone) sm:text-4xl">
                Vem fazer parte da <span className="italic text-(--color-gold)">conversa.</span>
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-(--color-fog)">
                <p>
                  Seja num evento, num café ou numa videochamada — gostamos de
                  conhecer gente nova, trocar ideias, e perceber como podemos ser
                  úteis um ao outro.
                </p>
                <p className="font-display text-xl italic leading-snug text-(--color-bone)">
                  Não temos concorrentes. Temos parceiros à espera de conhecer.
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
              <Eyebrow>Vamos conhecer-nos</Eyebrow>
              <h2 className="mx-auto mt-7 max-w-2xl text-balance font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl">
                Achas que podemos ser <span className="italic text-(--color-gold)">bons parceiros</span>?
              </h2>
              <p className="mx-auto mt-6 max-w-md text-(--color-fog)">
                Deixa-nos os teus contactos — temos todo o gosto em chegar até ti.
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
