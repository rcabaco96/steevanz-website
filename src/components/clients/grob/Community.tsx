"use client";

import Image from "next/image";
import { useState } from "react";
import { grob, grobPress } from "@/content/grob/facts";
import { grobFamilyGallery, grobFamilyPeople, grobFamilyPlay } from "@/content/grob/gallery";
import { Lightbox } from "./Lightbox";
import { LoopStrip } from "./LoopStrip";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";
import { grobSections } from "./sections";

// A comunidade, «o que alimenta a alma do clube» (dono, 2026-11-02): a faixa de palavras que corre com o scroll
// (React Bits ScrollVelocity) e «A família GROB» em duas faixas sem fim, de ponta a ponta do ecrã (LoopStrip): uma
// em jogo, de todos os escalões e modalidades, e outra com as pessoas, as festas e as conquistas (Instagram do
// clube e site atual). Arrastam-se, nunca prendem o scroll, e cada fotografia abre em ecrã inteiro (Lightbox).
// Fecha com a frase do Record sobre o Zicky Té.
export function Community() {
  const [open, setOpen] = useState<number | null>(null);
  const second = grobFamilyPlay.length;

  return (
    <section id={grobSections.community} aria-labelledby="gb-com-title" className="gb-grain-dark relative overflow-hidden bg-pavilhao py-20 text-giz sm:py-28">
      <div aria-hidden="true" className="gb-display text-[clamp(4rem,14vw,10rem)] leading-none">
        <ScrollVelocity baseVelocity={2.2}>
          <span className="px-4">Olival Basto</span>
          <span className="px-4 gb-outline [--gb-outline:var(--color-relva-claro)]">GROB</span>
          <span className="px-4 text-amarelo">1937</span>
          <span className="px-4 gb-outline [--gb-outline:var(--color-relva-claro)]">Odivelas</span>
        </ScrollVelocity>
      </div>

      <div className="relative gb-container mt-14 sm:mt-16">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="gb-eyebrow flex items-center gap-3 text-relva-claro">
              <span aria-hidden="true" className="h-px w-8 bg-relva-claro" />
              Comunidade
            </p>
            <h2 id="gb-com-title" className="gb-display mt-3 text-[clamp(3rem,10vw,6.4rem)] [text-shadow:0_10px_40px_rgb(6_38_21/0.8)]">
              A família <span className="text-relva-claro">{grob.short}</span>
            </h2>
          </div>
          <p className="max-w-[30rem] text-[1rem] leading-relaxed text-giz/80">
            Cerca de {grob.athletes} atletas e centenas de sócios fazem esta história de paixão, dedicação e formação humana, nos pavilhões, na
            bancada e na sede.
          </p>
        </div>


      </div>

      <div className="mt-10 space-y-2.5 sm:mt-12 sm:space-y-4">
        <LoopStrip items={grobFamilyPlay} label="A família GROB: em jogo" onOpen={setOpen} start={0.3} />
        <LoopStrip items={grobFamilyPeople} label="A família GROB: pessoas, festas e conquistas" onOpen={(i) => setOpen(second + i)} size="sm" start={0.62} showArrows={false} />
      </div>
      <p className="gb-container mt-4 text-[0.85rem] text-giz/60">Arraste ou use as setas · toque numa fotografia para a ver em grande</p>

      <figure className="relative mx-auto mt-20 max-w-[60rem] px-5 text-center sm:mt-24 sm:px-8">
        <Image
          src={grob.media.emblemSmall}
          alt=""
          width={439}
          height={560}
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[150%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.05] grayscale"
        />
        <blockquote className="gb-display text-[clamp(1.9rem,5.6vw,3.6rem)] leading-[0.95]">
          <span aria-hidden="true" className="text-amarelo">«</span>
          {grobPress.quote}
          <span aria-hidden="true" className="text-amarelo">»</span>
        </blockquote>
        <figcaption className="mt-6 text-[0.86rem] text-giz/65">
          <a href={grobPress.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amarelo">
            {grobPress.source}
          </a>
          , {grobPress.date} · {grobPress.author}
        </figcaption>
      </figure>

      <Lightbox items={grobFamilyGallery} index={open} onIndex={setOpen} onClose={() => setOpen(null)} label="A família GROB" />
    </section>
  );
}
