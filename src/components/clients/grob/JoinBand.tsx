"use client";

import Image from "next/image";
import { useRef } from "react";
import { grob, grobPhotos, type GrobPhotoId } from "@/content/grob/facts";
import { openContact } from "./contact-bus";
import { useScrollScene } from "./scroll-scene";
import { grobSections } from "./sections";

/** Atletas de várias modalidades (fotografias do site do clube). */
const strip: { id: GrobPhotoId; alt: string }[] = [
  { id: "futsalSenioresConducao", alt: "Futsal, seniores: um jogador do GROB em condução" },
  { id: "tenisDeMesaJovensJogo", alt: "Ténis de mesa: jovens a jogar na sede" },
  { id: "futsalSub15Remate", alt: "Futsal, sub-15: remate num jogo do Nacional" },
  { id: "zumba", alt: "Uma aula de zumba" },
  { id: "futsalTraquinasFestejo", alt: "Futsal: os traquinas a festejar" },
  { id: "tenisDeMesaSenioresSede", alt: "Ténis de mesa: um sénior a servir" },
  { id: "futsalSub19FestejoGolo", alt: "Futsal, sub-19: festejo de golo" },
  { id: "futsalSub10Lance", alt: "Futsal, sub-10: um drible" },
  { id: "futsalSub15GritoDeEquipa", alt: "Futsal, sub-15: a equipa de braços no ar" },
  { id: "futsalSub17Remate", alt: "Futsal, sub-17: remate" },
];

// «Venha jogar connosco»: uma faixa curta e com força (dono, 2026-11-02: nada de bloco verde liso). Uma tira
// inclinada de fotografias de atletas de várias modalidades atravessa a faixa e desliza para o lado com o scroll
// (GSAP scrub, só transform), passando por trás do título; o emblema enorme em marca de água anda mais devagar
// (parallax); o verde tem grão. O botão, ao pé do texto, é magnético e abre a gaveta da inscrição.
export function JoinBand() {
  const root = useRef<HTMLElement>(null);

  useScrollScene(root, (gsap) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root.current);
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(q("[data-strip]"), { xPercent: 0 }, { xPercent: -16, ease: "none", scrollTrigger: st });
      gsap.fromTo(q("[data-crest]"), { yPercent: 18, rotate: -8 }, { yPercent: -18, rotate: 4, ease: "none", scrollTrigger: st });
    });
    return () => mm.revert();
  });

  return (
    <section
      ref={root}
      id={grobSections.signup}
      aria-labelledby="gb-join-title"
      className="gb-grain-dark relative isolate overflow-hidden bg-[linear-gradient(115deg,#0b6b33_0%,#10a24b_55%,#2fb35a_100%)] text-giz"
    >
      {/* O emblema, enorme e quase apagado, a subir devagar. */}
      <div aria-hidden="true" data-crest className="pointer-events-none absolute -top-16 -left-24 z-[1] w-[24rem] opacity-[0.08] grayscale md:-left-6 md:w-[26rem]">
        <Image src={grob.media.emblemSmall} alt="" width={439} height={560} className="h-auto w-full" />
      </div>

      {/* A tira de atletas, inclinada, a passar por trás do título. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 h-[11rem] md:top-1/2 md:bottom-auto md:h-[13rem] md:-translate-y-1/2">
        <div className="absolute inset-y-0 -right-[10%] left-[-10%] -rotate-[6deg] md:left-[36%]">
          <ul data-strip className="flex h-full w-max gap-3 md:gap-4">
            {[...strip, ...strip.slice(0, 4)].map(({ id }, i) => {
              const photo = grobPhotos[id];
              return (
                <li key={`${id}-${i}`} className="relative h-full w-[9.5rem] shrink-0 overflow-hidden rounded-[1rem] ring-2 ring-giz/80 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)] md:w-[11.5rem]">
                  <Image src={photo.src} alt="" width={photo.width} height={photo.height} quality={85} sizes={`(min-width: 768px) ${Math.ceil(208 * Math.max(0.9, photo.width / photo.height))}px, ${Math.ceil(176 * Math.max(0.9, photo.width / photo.height))}px`} className="h-full w-full object-cover" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* O verde por trás do texto, para o ler bem quando a tira passa. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(11_107_51/0.96)_0%,rgb(11_107_51/0.85)_48%,transparent_62%)] md:bg-[linear-gradient(90deg,rgb(11_107_51/0.97)_0%,rgb(11_107_51/0.9)_34%,rgb(11_107_51/0.2)_52%,transparent_62%)]" />
      <ul className="sr-only">
        {strip.map(({ id, alt }) => (
          <li key={id}>{alt}</li>
        ))}
      </ul>

      <div className="relative z-[2] gb-container pt-12 pb-[14rem] md:py-14">
        <div className="max-w-[30rem] md:max-w-[34rem]">
          <p className="gb-eyebrow text-giz/85">Inscrições e captações</p>
          <h2 id="gb-join-title" className="gb-display mt-3 text-[clamp(2.4rem,6.4vw,4rem)] [text-shadow:0_6px_30px_rgb(6_38_21/0.45)]">
            Venha jogar <span className="text-amarelo">connosco</span>
          </h2>
          <p className="mt-3 max-w-[26rem] text-[0.98rem] leading-relaxed text-giz/90 [text-shadow:0_2px_14px_rgb(6_38_21/0.5)]">
            Escolha a modalidade e deixe os dados do atleta. Informações pelo{" "}
            <a href={grob.phoneSportHref} className="font-semibold whitespace-nowrap underline underline-offset-4 hover:text-amarelo">
              {grob.phoneSport}
            </a>
            .
          </p>
          <div className="mt-6">
                          <button
                type="button"
                onClick={() => openContact({ reason: "inscricao" })}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-giz pr-2 pl-6 text-[0.86rem] font-bold whitespace-nowrap text-pavilhao shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] transition-colors hover:bg-amarelo"
              >
                Fazer a inscrição
                <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-pavilhao text-giz transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-rotate-45">
                  →
                </span>
              </button>
                      </div>
        </div>
      </div>
    </section>
  );
}
