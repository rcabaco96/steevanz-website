"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { PonteiroCopy, PonteiroShelfItem } from "@/content/ponteiro/copy";
import { ponteiroPhotos, ponteiroPrice } from "@/content/ponteiro/facts";
import { Reveal } from "./Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Item({ item, plusVat, hidden }: { item: PonteiroShelfItem; plusVat: string; hidden?: boolean }) {
  const photo = ponteiroPhotos[item.image];
  return (
    <li aria-hidden={hidden || undefined} className="relative w-[min(62vw,17rem)] shrink-0 sm:w-[19rem]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-ginja-deep">
        <Image src={photo.src} alt={hidden ? "" : item.alt} width={photo.width} height={photo.height} sizes="(min-width: 640px) 19rem, 62vw" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.18)_0%,transparent_32%,transparent_70%,rgb(255_255_255/0.08)_100%)]" />
      </div>
      {/* The paper price tag, hanging a little crooked. */}
      <p className="absolute -bottom-4 left-4 -rotate-3 rounded-md bg-papel px-3 py-2 text-tinta shadow-[0_10px_20px_-12px_rgb(0_0_0/0.6)]">
        <span className="block text-[0.85rem] leading-tight font-semibold">{item.name}</span>
        <span className="font-display text-[1.35rem] leading-none tabular-nums">{ponteiroPrice(item.price)}</span>{" "}
        <span className="text-[0.62rem] font-semibold tracking-[0.1em] text-cinza uppercase">{plusVat}</span>
      </p>
    </li>
  );
}

// The pastry counter. Two glass shelves of the morning's baking slide past in opposite directions as the page
// scrolls (GSAP scrub, transform only), each piece with its paper price tag (without VAT, «+ IVA»). Reduced motion:
// the shelves stand still and can be swiped sideways.
export function Vitrine({ copy }: { copy: PonteiroCopy }) {
  const { vitrine } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-shelf]", el);
        rows.forEach((row, i) => {
          const travel = () => Math.max(0, row.scrollWidth - window.innerWidth) * 0.6;
          gsap.fromTo(
            row,
            { x: () => (i % 2 ? -travel() : 0) },
            {
              x: () => (i % 2 ? 0 : -travel()),
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="pn-vitrine-title" className="pn-on-dark relative overflow-hidden bg-ginja py-24 text-papel sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <Reveal>
          <p className="pn-label mb-5 flex items-center gap-4 text-gema">
            <span aria-hidden="true" className="h-px w-10 bg-gema/60" />
            {vitrine.eyebrow}
          </p>
          <h2 id="pn-vitrine-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.92]">
            {vitrine.title} <span className="text-gema italic">{vitrine.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-papel/80">{vitrine.intro}</p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-16 sm:mt-20">
        {vitrine.shelves.map((shelf, i) => (
          <div key={i} className="relative overflow-x-auto [scrollbar-width:none] motion-safe:overflow-x-visible [&::-webkit-scrollbar]:hidden">
            <ul data-shelf className="flex w-max gap-5 px-5 pb-6 will-change-transform sm:gap-8 sm:px-8">
              {[...shelf, ...shelf].map((item, j) => (
                <Item key={j} item={item} plusVat={copy.carta.plusVat} hidden={j >= shelf.length} />
              ))}
            </ul>
            {/* The glass shelf. */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3 bg-[linear-gradient(180deg,rgb(255_255_255/0.35),rgb(255_255_255/0.06))] shadow-[0_12px_24px_-10px_rgb(0_0_0/0.5)]" />
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-[84rem] px-5 text-sm text-papel/60 sm:px-8">
        {copy.carta.vatNote} {copy.carta.demoNote}
      </p>
    </section>
  );
}
