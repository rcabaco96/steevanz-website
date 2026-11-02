"use client";

import Image from "next/image";
import { useRef } from "react";
import { grob, grobModalities, grobPhotos, grobSede } from "@/content/grob/facts";
import { useScrollScene } from "./scroll-scene";
import { grobSections } from "./sections";

// O placar do pavilhão. A cena fica presa (pin + scrub) e cada casa do placar vira-se e conta até ao seu número,
// ao ritmo do scroll; todos os números são do site do clube (ou contas sobre eles: os anos desde 1937, os escalões
// listados). Depois, o texto do clube, com a medalha. Movimento reduzido: os números já certos, sem pin.
export function Scoreboard({ age }: { age: number }) {
  const root = useRef<HTMLElement>(null);
  const futsal = grobModalities.find((m) => m.id === "futsal")?.levels.length ?? 0;
  const tableTennis = grobModalities.find((m) => m.id === "tenis-de-mesa")?.levels.length ?? 0;
  const tiles = [
    { label: "Fundação", value: grob.foundedYear, pad: 4, note: grob.foundedLabel },
    { label: "Anos de clube", value: age, pad: 2, note: "e a contar" },
    { label: "Atletas", value: grob.athletes, pad: 3, note: "aproximadamente, ativos" },
    { label: "Escalões de futsal", value: futsal, pad: 2, note: "dos Sub5 aos Seniores" },
    { label: "Escalões de ténis de mesa", value: tableTennis, pad: 2, note: "dos Sub9 aos Veteranos" },
    { label: "m² de sede", value: grobSede.area, pad: 3, note: "em dois pisos" },
  ];

  useScrollScene(root, (gsap) => {
      const mm = gsap.matchMedia();
      // No toque, sem pin (CLS 0 e scroll nativo): as casas entram e contam uma vez quando o placar aparece.
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: coarse)", () => {
        const q = gsap.utils.selector(root.current);
        const tiles = q("[data-tile]");
        gsap.fromTo(tiles, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08, scrollTrigger: { trigger: q("[data-board]")[0], start: "top 85%", once: true } });
        tiles.forEach((tile) => {
          const digits = tile.querySelector<HTMLElement>("[data-value]");
          const to = Number(digits?.dataset.value ?? 0);
          const pad = Number(digits?.dataset.pad ?? 1);
          const counter = { v: 0 };
          gsap.to(counter, {
            v: to,
            duration: 1.2,
            ease: "power1.out",
            scrollTrigger: { trigger: q("[data-board]")[0], start: "top 85%", once: true },
            onUpdate: () => {
              if (digits) digits.textContent = String(Math.round(counter.v)).padStart(pad, "0");
            },
          });
        });
      });
      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const q = gsap.utils.selector(root.current);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q("[data-board-stage]")[0], start: "top top", end: "+=110%", pin: true, pinType: "transform", scrub: 0.4 },
        });
        tl.fromTo(q("[data-board]"), { scale: 0.9, rotateX: 18 }, { scale: 1, rotateX: 0, duration: 1, ease: "power2.out" }, 0);
        q("[data-tile]").forEach((tile, i) => {
          const digits = tile.querySelector<HTMLElement>("[data-value]");
          const to = Number(digits?.dataset.value ?? 0);
          const pad = Number(digits?.dataset.pad ?? 1);
          const counter = { v: 0 };
          const at = 0.3 + i * 0.32;
          tl.fromTo(tile, { rotateX: -70, opacity: 0.35 }, { rotateX: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, at).to(
            counter,
            {
              v: to,
              duration: 0.9,
              ease: "power1.out",
              onUpdate: () => {
                if (digits) digits.textContent = String(Math.round(counter.v)).padStart(pad, "0");
              },
            },
            at + 0.1,
          );
        });
        tl.fromTo(q("[data-board-foot]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 2.2);
        // A fotografia do clube desliza mais devagar do que o cartão de texto.
        gsap.fromTo(q("[data-club-photo]"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: q("[data-club-photo]")[0], start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(q("[data-club-card]"), { y: 60 }, { y: -30, ease: "none", scrollTrigger: { trigger: q("[data-club-card]")[0], start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
  });

  return (
    <section ref={root} id={grobSections.club} aria-labelledby="gb-club-title" className="relative bg-pavilhao-2 text-giz">
      <div data-board-stage className="relative flex flex-col justify-center overflow-hidden py-20 motion-on:min-h-svh motion-on:py-16 [@media(max-height:700px)]:motion-on:py-10">
        <div className="gb-container">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 id="gb-club-title" className="gb-display text-[clamp(2.8rem,11vw,6.5rem)]">
              <span className="block text-relva-claro">O placar</span>
              <span className="block">do {grob.short}</span>
            </h2>
            <p className="max-w-[24rem] text-[0.95rem] leading-relaxed text-giz/70 [@media(max-height:700px)]:hidden">
              Os números do clube, contados como num jogo: tudo o que aqui está vem do próprio clube.
            </p>
          </div>

          <div className="mt-8 [perspective:1400px] sm:mt-10 [@media(max-height:700px)]:mt-5">
            <div
              data-board
              className="rounded-[1.4rem] bg-tinta p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8),inset_0_0_0_1px_rgb(255_255_255/0.07)] sm:p-4 pointer-coarse:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]"
            >
              <ul className="grid grid-cols-2 gap-2.5 [perspective:900px] sm:gap-4 lg:grid-cols-3">
                {tiles.map((tile) => (
                  <li
                    key={tile.label}
                    data-tile
                    className="flex min-h-[7.4rem] origin-top flex-col justify-between rounded-[0.9rem] bg-[#0f1913] p-3.5 ring-1 ring-white/5 sm:min-h-[10rem] sm:p-5 [@media(max-height:700px)]:min-h-[6.4rem] [@media(max-height:700px)]:p-3"
                  >
                    <p className="text-[0.66rem] leading-tight font-bold tracking-[0.18em] text-giz/60 uppercase sm:text-[0.72rem]">{tile.label}</p>
                    <p
                      data-value={tile.value}
                      data-pad={tile.pad}
                      className="gb-display text-[clamp(3rem,15vw,6.4rem)] leading-none text-amarelo tabular-nums pointer-fine:[text-shadow:0_0_24px_rgb(245_230_34/0.35)] [@media(max-height:700px)]:text-[clamp(2.6rem,12vw,4rem)]"
                    >
                      {String(tile.value).padStart(tile.pad, "0")}
                    </p>
                    <p className="text-[0.72rem] text-giz/55 max-[359px]:hidden sm:text-[0.8rem]">{tile.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p data-board-foot className="mt-5 flex items-center gap-3 text-[0.9rem] text-giz/80 sm:mt-7">
            <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amarelo text-[0.9rem] text-tinta">★</span>
            <span>
              <strong className="font-semibold text-giz">{grob.medal}</strong>, atribuída pela Câmara Municipal de Odivelas no 27.º aniversário do Município.
            </span>
          </p>
        </div>
      </div>

      {/* O clube, em composição editorial: o texto num cartão à esquerda, a sobrepor a fotografia da família do clube,
          sempre à direita (dono, 2026-11-02), que desliza mais devagar (parallax, GSAP scrub). O título sobre a
          fotografia mede-se pela largura dela (cqi): nunca corta uma palavra. */}
      <div className="relative gb-container pt-6 pb-24 sm:pb-32">
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="@container relative overflow-hidden rounded-[var(--radius-gb-lg)] lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <div data-club-photo className="relative aspect-[4/3] will-change-transform lg:aspect-[16/11]">
              <Image src={grobPhotos.familia.src} alt="Dezenas de atletas da formação do GROB numa fotografia de grupo no pavilhão" fill sizes="(min-width: 1024px) 56vw, 92vw" className="scale-110 object-cover" />
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(10_54_31/0.85))]" />
            <h3 className="gb-display absolute right-5 bottom-4 left-5 text-[clamp(2rem,10cqi,4.6rem)] pointer-fine:[text-shadow:0_8px_30px_rgb(0_0_0/0.5)] sm:right-7 sm:bottom-6 sm:left-7 lg:left-auto lg:text-right">
              <span className="block">Uma referência</span>
              <span className="block text-amarelo">em Odivelas</span>
            </h3>
          </div>
          <div data-club-card className="relative z-10 rounded-[var(--radius-gb-lg)] bg-pavilhao p-6 pointer-fine:shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)] ring-1 ring-giz/10 sm:p-8 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:-mr-10">
            <div className="space-y-4 text-[1rem] leading-[1.75] text-giz/80">
              <p>
                O {grob.name} é uma associação sem fins lucrativos e uma referência desportiva e cultural no concelho de Odivelas. Fundado a{" "}
                {grob.foundedLabel}, é o clube mais antigo e emblemático da {grob.parish}, e promove há mais de oito décadas o desenvolvimento
                desportivo, social e comunitário.
              </p>
              <p>
                A missão é dar formação desportiva de qualidade, valorizando{" "}
                <strong className="font-semibold text-giz">o respeito, a disciplina, a inclusão e a superação pessoal</strong>. Nas modalidades de
                competição, o clube participa nas respetivas federações, com atletas de todos os níveis de formação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
