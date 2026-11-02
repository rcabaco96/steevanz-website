"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { grob, grobPhotos, grobPlaces, grobSede } from "@/content/grob/facts";
import { grobSedeGallery } from "@/content/grob/gallery";
import { openContact } from "./contact-bus";
import { CourtLines } from "./CourtLines";
import { PinIcon } from "./icons";
import { Lightbox } from "./Lightbox";
import { LoopStrip } from "./LoopStrip";
import { useScrollScene } from "./scroll-scene";
import { grobSections } from "./sections";

// A sede, renovada em 2026. A cena fica presa e entra-se na fachada pelo «V» do escudo: uma máscara com o V
// recortado cresce até o V engolir o ecrã (GSAP pin + scrub; só transform e opacidade, nada de clip-path a pintar
// cada fotograma). Depois, os dois pisos como uma planta (as medidas da página Sede), o aluguer para eventos com os
// horários, e a galeria da sede: uma faixa sem fim de ponta a ponta, que se arrasta, com setas e ecrã inteiro
// (LoopStrip + Lightbox), sem nunca prender o scroll da página.
export function Sede() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useScrollScene(root, (gsap) => {
    const mm = gsap.matchMedia();
    // Só com rato: no toque a fachada é uma fotografia normal, sem pin (ver grob.css, pointer: coarse).
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const q = gsap.utils.selector(root.current);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q("[data-sede-stage]")[0], start: "top top", end: "+=110%", pin: true, pinType: "transform", scrub: 0.4 },
      });
      tl.fromTo(q("[data-sede-mask]"), { scale: 1 }, { scale: 22, duration: 1, ease: "power2.in" }, 0)
        .to(q("[data-sede-mask]"), { opacity: 0, duration: 0.15 }, 0.85)
        .fromTo(q("[data-sede-photo]"), { scale: 1.25 }, { scale: 1, duration: 1.15 }, 0)
        .to(q("[data-sede-intro]"), { opacity: 0, y: -40, duration: 0.35 }, 0.05)
        .fromTo(q("[data-sede-over]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, 0.85)
        .to({}, { duration: 0.25 }, 1.2);
    });
    return () => mm.revert();
  });

  const sede = grobPlaces[0];
  const facade = grobPhotos.sedeFachada;

  return (
    <section ref={root} id={grobSections.sede} aria-labelledby="gb-sede-title" className="relative bg-betao text-tinta">
      <div data-sede-stage className="relative overflow-hidden motion-on:h-svh motion-on:min-h-[560px]">
        <div data-sede-frame className="relative mt-24 aspect-[4/3] overflow-hidden bg-pavilhao motion-on:absolute motion-on:inset-0 motion-on:mt-0 motion-on:aspect-auto">
          <Image
            data-sede-photo
            src={facade.src}
            alt={`A fachada da sede do ${grob.short}, branca, na ${sede.street}, em ${sede.locality}`}
            width={facade.width}
            height={facade.height}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_38_21/0.1)_30%,rgb(6_38_21/0.85))]" />
          <div data-sede-over className="absolute inset-x-0 bottom-0 gb-container pb-8 text-giz sm:pb-14 motion-off:hidden">
            <p className="gb-display text-[clamp(2.4rem,8vw,5.2rem)]">
              Renovada <span className="text-amarelo">em {grobSede.renovatedYear}</span>
            </p>
            <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-relaxed text-giz/85 sm:text-[1.05rem]">
              Inaugurada a {grobSede.inaugurated} por {grobSede.inauguratedBy}, sendo presidente do {grob.short} {grobSede.clubPresident}.
            </p>
          </div>
        </div>

        {/* A máscara: o betão da página com o V do escudo recortado; cresce até o V ocupar o ecrã. */}
        <div data-sede-mask aria-hidden="true" className="pointer-events-none absolute inset-0 hidden origin-[50%_64%] motion-on:block">
          <CourtLines aria-hidden="true" className="absolute top-1/2 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 text-giz opacity-[0.08]" />
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <path
              fill="var(--color-pavilhao)"
              fillRule="evenodd"
              d="M-400 -400H500V500H-400Z M30 36H41L50 62L59 36H70L50 92Z"
            />
          </svg>
        </div>

        <div data-sede-intro className="relative z-10 gb-container pt-24 sm:pt-28 motion-on:absolute motion-on:inset-x-0 motion-on:top-0">
          <p className="gb-eyebrow flex items-center gap-3 text-relva-escuro">
            <span aria-hidden="true" className="h-px w-8 bg-relva-escuro" />A sede
          </p>
          <h2 id="gb-sede-title" className="gb-display mt-3 text-[clamp(2.6rem,8vw,5rem)]">
            A casa <span className="text-relva">do clube</span>
          </h2>
          <p className="mt-3 hidden max-w-[22rem] text-[0.95rem] text-cinza motion-on:block">Desça para entrar pelo V.</p>
        </div>
      </div>

      <div className="pt-20 sm:pt-24">
        <div className="gb-container mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h3 className="gb-display text-[clamp(2.2rem,6vw,3.4rem)]">
            Por dentro <span className="text-relva">e por fora</span>
          </h3>
          <p className="text-[0.85rem] text-cinza">Arraste ou use as setas · toque numa fotografia para a ver em grande</p>
        </div>
        <LoopStrip items={grobSedeGallery} label="Fotografias da sede" onOpen={setOpen} />
        <Lightbox items={grobSedeGallery} index={open} onIndex={setOpen} onClose={() => setOpen(null)} label="Fotografias da sede" />
      </div>
      <div className="gb-container py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-end">
          <p className="max-w-[36rem] text-[1.1rem] leading-[1.7] text-tinta/85 sm:text-[1.2rem]">
            <span className="motion-on:hidden">
              Renovada em {grobSede.renovatedYear} e inaugurada a {grobSede.inaugurated}.{" "}
            </span>
            Estética moderna, branco e cinza betão: um espaço neutro, elegante e versátil, com{" "}
            <strong className="font-semibold">{grobSede.area} m² em dois pisos de {grobSede.floorArea} m²</strong>, pensado para as modalidades
            desportivas, eventos de empresas e celebrações privadas.
          </p>
          <p aria-hidden="true" className="gb-display text-right text-[clamp(5rem,16vw,11rem)] leading-[0.8] gb-outline [--gb-outline:var(--color-relva)]">
            {grobSede.area} m²
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.92rem] lg:col-span-2">
            <span className="font-semibold">
              {sede.street}, {sede.postalCode} {sede.locality}
            </span>
            <span aria-hidden="true" className="text-cinza">·</span>
            <span className="flex flex-wrap gap-2">
              <a href={sede.maps} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 font-semibold text-relva-escuro ring-1 ring-tinta/10 transition-colors hover:ring-relva">
                <PinIcon width={16} height={16} /> Ver no mapa<span className="sr-only"> (abre o Google Maps)</span>
              </a>
              <a href={sede.directions} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 font-semibold text-relva-escuro ring-1 ring-tinta/10 transition-colors hover:ring-relva">
                Como chegar<span className="sr-only"> (abre o Google Maps)</span>
              </a>
            </span>
          </div>
        </div>

        {/* Os dois pisos, desenhados como uma planta: uma folha de betão com a grelha e as cotas. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {grobSede.floors.map((floor, i) => (
            <article key={floor.name} className="relative overflow-hidden rounded-[1.4rem] bg-white p-6 ring-1 ring-tinta/8 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgb(16_162_75/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(16_162_75/0.08)_1px,transparent_1px)] [background-size:24px_24px]"
              />
              <p aria-hidden="true" className="gb-display pointer-events-none absolute -right-2 -bottom-6 text-[9rem] leading-none gb-outline [--gb-outline:rgb(16_162_75/0.25)]">
                {i}
              </p>
              <div className="relative flex items-baseline justify-between gap-4">
                <h3 className="gb-display text-[2.6rem]">{floor.name}</h3>
                <p className="gb-display text-[2.4rem] text-relva">
                  {grobSede.floorArea}
                  <span className="text-[1.2rem]"> m²</span>
                </p>
              </div>
              <ul className="relative mt-5 divide-y divide-tinta/8 border-t border-tinta/8">
                {floor.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-2.5 text-[0.98rem]">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-relva" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="gb-grain-dark relative mt-6 grid gap-6 overflow-hidden rounded-[1.4rem] bg-pavilhao p-6 text-giz sm:mt-8 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <Image
            src={grobPhotos.sedeTerraco.src}
            alt=""
            width={grobPhotos.sedeTerraco.width}
            height={grobPhotos.sedeTerraco.height}
            sizes="50vw"
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-1/2 object-cover opacity-25 [mask-image:linear-gradient(90deg,transparent,black_60%)] lg:block"
          />
          <div>
            <p className="gb-eyebrow text-relva-claro">Eventos e aluguer</p>
            <h3 className="gb-display mt-3 text-[clamp(2.2rem,6vw,3.4rem)]">Faça a festa na sede</h3>
            <p className="mt-4 max-w-[30rem] text-[0.98rem] leading-relaxed text-giz/80">{grobSede.rental}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={grob.phoneEventsHref}
                className="inline-flex h-12 items-center justify-center rounded-full bg-giz px-6 text-[0.84rem] font-bold whitespace-nowrap text-pavilhao transition-colors hover:bg-amarelo"
              >
                Ligar · {grob.phoneEvents}
              </a>
              <button
                type="button"
                onClick={() => openContact({ reason: "aluguer" })}
                className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[0.84rem] font-bold ring-1 ring-giz/40 transition-colors hover:bg-giz/10"
              >
                Pedir a sede
              </button>
            </div>
          </div>
          <dl className="grid gap-5 text-[0.95rem]">
            <div>
              <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-giz/55 uppercase">Eventos, dias úteis</dt>
              <dd className="mt-1">{grobSede.hoursEventsWeekdays.replace("Dias úteis, d", "D")}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-giz/55 uppercase">Eventos, fins de semana</dt>
              <dd className="mt-1 space-y-0.5">
                {grobSede.hoursEventsWeekend.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-[0.7rem] font-bold tracking-[0.16em] text-giz/55 uppercase">Modalidades desportivas</dt>
              <dd className="mt-1">{grobSede.hoursSport}</dd>
            </div>
          </dl>
        </div>
      </div>

    </section>
  );
}
