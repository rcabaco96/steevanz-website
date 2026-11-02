"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { grobPhotos } from "@/content/grob/facts";
import { Lightbox } from "./Lightbox";
import { useReveal } from "./use-reveal";
import { useScrollScene } from "./scroll-scene";

/** Das legendas do Instagram do clube e de um post da AF Lisboa em colaboração (ver ig/FONTES.txt). */
const wins = [
  { mark: "Sub-19", title: "Taça Nacional", text: "Conquistada em 2026, com a subida ao Nacional." },
  { mark: "Sub-19", title: "Dobradinha distrital", text: "Sub-19A campeões da 1.ª Divisão e Sub-19B campeões da 3.ª Divisão da AF Lisboa." },
  { mark: "Sub-15", title: "Vice-campeões nacionais", text: "Na Taça Nacional, pela primeira vez na história do clube." },
  { mark: "Sub-17", title: "Entre os 8 melhores", text: "Do país, na estreia no Nacional." },
  { mark: "Gala", title: "Desporto de Odivelas 2026", text: "O GROB distinguido no futsal e no ténis de mesa." },
];

// As conquistas recentes, num momento curto: o título e a lista à esquerda, como um quadro de honra, a entrar
// linha a linha (CSS, transform e opacidade); as fotografias sempre à direita (dono, 2026-11-02), a taça dos Sub-19
// a deslizar devagar (parallax, GSAP scrub). No telemóvel: título, fotografias, lista.
export function Achievements() {
  const root = useRef<HTMLElement>(null);
  const shown = useReveal(root);
  useScrollScene(root, (gsap) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root.current);
      gsap.fromTo(q("[data-trophy]"), { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  });
  const trophy = grobPhotos.trofeuCampeaoSub19;
  const team = grobPhotos.tacaNacionalSub192026;
  const [open, setOpen] = useState<number | null>(null);
  const photos = [
    { id: "tacaNacionalSub192026" as const, ...team, alt: "Os Sub-19 do GROB com a faixa da Taça Nacional, na Covilhã" },
    { id: "trofeuCampeaoSub19" as const, ...trophy, alt: "A taça e as medalhas de campeão dos Sub-19 do GROB" },
  ];

  return (
    <section ref={root} aria-labelledby="gb-wins-title" data-shown={shown} className="gb-grain-dark relative overflow-hidden bg-[#04140b] py-20 text-giz sm:py-24">
      <div className="gb-container grid items-start gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="gb-eyebrow flex items-center gap-3 text-amarelo">
            <span aria-hidden="true" className="h-px w-8 bg-amarelo" />
            Conquistas
          </p>
          <h2 id="gb-wins-title" className="gb-display mt-3 text-[length:var(--text-gb-h2)]">
            O quadro <span className="text-amarelo">de honra</span>
          </h2>
        </div>

        {/* As fotografias, sempre à direita (dono, 2026-11-02), as duas grandes e com o mesmo peso: a equipa dos
            Sub-19 com a faixa da Taça Nacional e a taça com as medalhas. Presas no ecrã enquanto a lista passa; tocar
            abre em ecrã inteiro. Nada de miniaturas sobrepostas. */}
        <div className="grid gap-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <button type="button" onClick={() => setOpen(0)} aria-label={`Ver em grande: ${photos[0].alt}`} className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-gb-lg)] shadow-[var(--shadow-gb-card)]">
            <div data-trophy className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
              <Image src={team.src} alt={photos[0].alt} fill quality={85} sizes="(min-width: 1024px) 44rem, 96vw" className="object-cover object-[50%_45%] transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
          </button>
          <button type="button" onClick={() => setOpen(1)} aria-label={`Ver em grande: ${photos[1].alt}`} className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-gb-lg)] shadow-[var(--shadow-gb-card)]">
            <Image src={trophy.src} alt={photos[1].alt} fill quality={85} sizes="(min-width: 1024px) 44rem, 96vw" className="object-cover object-[50%_50%] transition-transform duration-700 group-hover:scale-[1.03]" />
          </button>
        </div>

        <ol className="divide-y divide-giz/10 border-y border-giz/10 lg:col-start-1 lg:row-start-2">
          {wins.map((win, i) => (
            <li key={win.title} className="gb-reveal grid grid-cols-[4.6rem_1fr] gap-4 py-4" style={{ ["--d" as string]: `${120 + i * 90}ms` }}>
              <span className="gb-display pt-0.5 text-[1.5rem] text-relva-claro">{win.mark}</span>
              <span>
                <span className="gb-display block text-[1.7rem] leading-[0.95]">{win.title}</span>
                <span className="mt-1 block text-[0.92rem] leading-snug text-giz/70">{win.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <Lightbox items={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} label="Conquistas do GROB" />
    </section>
  );
}
