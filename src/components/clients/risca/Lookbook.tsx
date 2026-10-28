"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { RiscaCopy } from "@/content/risca/copy";
import { risca, riscaPhotos, type RiscaPhotoId } from "@/content/risca/facts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tile = { photo: RiscaPhotoId; ratio: string } | { video: true; ratio: string };

const columns: Tile[][] = [
  [
    { photo: "comprido", ratio: "aspect-[3/4]" },
    { photo: "homem", ratio: "aspect-[4/5]" },
    { photo: "apanhado", ratio: "aspect-square" },
    { photo: "ondas", ratio: "aspect-[4/5]" },
  ],
  [
    { video: true, ratio: "aspect-[7/9]" },
    { photo: "brushing", ratio: "aspect-square" },
    { photo: "nuca", ratio: "aspect-[3/4]" },
    { photo: "caracois2", ratio: "aspect-[4/5]" },
  ],
  [
    { photo: "caracois", ratio: "aspect-[3/4]" },
    { photo: "estudio", ratio: "aspect-[4/5]" },
    { photo: "ferramentas", ratio: "aspect-square" },
    { photo: "olhar", ratio: "aspect-[4/5]" },
  ],
];

/** Each column's drift while the gallery crosses the screen (in % of its own height): the middle one goes the other way. */
const drift: [number, number][] = [
  [6, -10],
  [-14, 8],
  [10, -16],
];

function Film({ alt }: { alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={risca.media.movement}
      poster={risca.media.movementPoster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

// The lookbook: three columns of pictures that drift past each other at different speeds as the page scrolls (GSAP
// scrub), the middle one against the others, with one moving picture among the stills. Phones: two columns.
// Stock images, and the page says so. Reduced motion: still columns.
export function Lookbook({ copy }: { copy: RiscaCopy }) {
  const { lookbook } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        gsap.utils.toArray<HTMLElement>("[data-column]", el).forEach((col, i) => {
          const [from, to] = drift[i % drift.length];
          gsap.fromTo(col, { yPercent: from }, { yPercent: to, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="rc-lookbook-title" className="relative overflow-hidden bg-gesso py-24 sm:py-32">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao-escuro">
              <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
              {lookbook.eyebrow}
            </p>
            <h2 id="rc-lookbook-title" className="text-[clamp(3rem,11vw,7.4rem)] leading-[0.86]">
              <span className="rc-display block">{lookbook.title}</span>
              <span className="rc-serif block text-[0.86em]">{lookbook.titleSerif}</span>
            </h2>
          </div>
          <p className="text-[0.8rem] text-cinza">{lookbook.note}</p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:mt-20">
          {columns.map((tiles, c) => (
            <div key={c} data-column className={`grid content-start gap-3 sm:gap-5 ${c === 2 ? "hidden md:grid" : ""} ${c === 1 ? "pt-16 sm:pt-24" : ""}`}>
              {tiles.map((tile, t) => {
                const alt = "video" in tile ? lookbook.alts.movimento : lookbook.alts[tile.photo as keyof typeof lookbook.alts];
                return (
                  <figure key={t} className={`group relative overflow-hidden bg-papel ${tile.ratio}`}>
                    {"video" in tile ? (
                      <Film alt={alt} />
                    ) : (
                      <Image
                        src={riscaPhotos[tile.photo].src}
                        alt={alt}
                        fill
                        sizes="(min-width: 768px) 30vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-saida)] group-hover:scale-[1.04]"
                      />
                    )}
                  </figure>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
