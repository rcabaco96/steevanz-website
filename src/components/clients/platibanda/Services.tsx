"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibandaPhotos, type PlatibandaPhotoId } from "@/content/platibanda/facts";
import { ArrowIcon } from "./icons";
import { platibandaSections } from "./sections";
import { SplitText } from "./react-bits/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pictures: Record<string, { id: PlatibandaPhotoId; alt: string }> = {
  vender: { id: "fachadaPlatibanda", alt: "Fachada amarela e branca com platibanda decorada e pináculos, em Tavira." },
  arrendar: { id: "taviraPorta", alt: "Porta antiga de madeira verde entre paredes de azulejo, em Tavira." },
  cuidar: { id: "reflexo", alt: "Casa de fachada rosada e janelas brancas refletida num espelho de água." },
};
const barraColour = { ocre: "var(--color-ocre)", telha: "var(--color-telha)", anil: "var(--color-anil)" } as const;

// For owners: selling, renting, looking after a holiday home. Large screens: the three services go down the left
// while, on the right, a window stays in place; as each service reaches the middle of the screen its picture is
// painted over the last one from the bottom up (GSAP scrub on clip-path) and the band round the window takes the
// service's colour, the counter turning with it. Phones: each service with its own picture (heading and text, the
// picture, then the list and the fee); so do large screens with reduced motion. Fees without VAT, «+ IVA».
export function Services({ copy }: { copy: PlatibandaCopy }) {
  const { services } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const layers = q("[data-layer]") as HTMLElement[];
        const panes = q("[data-pane]") as HTMLElement[];
        const counter = q("[data-count]")[0] as HTMLElement;
        layers.forEach((layer, i) => {
          if (i === 0) return;
          gsap.fromTo(
            layer,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: panes[i],
                start: "top 75%",
                end: "top 35%",
                scrub: 0.6,
                onEnter: () => (counter.textContent = `0${i + 1}`),
                onLeaveBack: () => (counter.textContent = `0${i}`),
              },
            },
          );
        });
        panes.forEach((pane) => {
          gsap.fromTo(pane, { opacity: 0.25 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: pane, start: "top 80%", end: "top 45%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id={platibandaSections.sell} ref={root} aria-labelledby="pb-services-title" className="relative bg-cal py-24 sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="pb-label mb-4 flex items-center gap-3 text-ocre-deep">
          <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
          {services.eyebrow}
        </p>
        <h2 id="pb-services-title" className="max-w-[16ch] font-display text-[clamp(2.2rem,7.5vw,4.6rem)] leading-[0.98] text-ria">
          <SplitText text={services.title} splitType="words" delay={60} /> <span className="text-telha">{services.titleItalic}</span>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-pedra">{services.intro}</p>

        <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
          <ol className="flex flex-col gap-20 lg:gap-0">
            {services.list.map((s, i) => {
              const pic = platibandaPhotos[pictures[s.id].id];
              return (
                <li key={s.id} data-pane className="lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center">
                  <h3 className="flex items-baseline gap-4 font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-none text-ria">
                    <span className="font-sans text-sm font-semibold tracking-[0.2em]" style={{ color: barraColour[s.barra] }}>
                      0{i + 1}
                    </span>
                    <span>
                      {s.title} <span className="text-pedra">{s.titleItalic}</span>
                    </span>
                  </h3>
                  <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-tinta/85">{s.text}</p>
                  {/* Phones and tablets: the picture right after the text. */}
                  <div className="relative mt-7 aspect-[4/5] w-full max-w-md overflow-hidden rounded-md bg-areia lg:hidden motion-reduce:lg:block">
                    <Image src={pic.src} alt={pictures[s.id].alt} width={pic.width} height={pic.height} sizes="(max-width: 1023px) 90vw, 1px" className="h-full w-full object-cover" />
                    <span aria-hidden="true" className="pb-barra absolute inset-0 rounded-md [--barra-w:12px]" style={{ ["--barra" as string]: barraColour[s.barra] }} />
                  </div>
                  <ul className="mt-7 grid max-w-lg gap-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[0.98rem]">
                        <span aria-hidden="true" className="mt-2 block h-[3px] w-4 shrink-0" style={{ background: barraColour[s.barra] }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 max-w-lg rounded-2xl bg-areia px-5 py-4 text-[0.98rem] leading-relaxed text-ria">
                    {s.fee}
                    {s.feeVat ? <span className="ml-1.5 font-semibold whitespace-nowrap">{services.plusVat}</span> : null}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Large screens: one window that stays while the services go by. */}
          <div aria-hidden="true" className="hidden lg:block motion-reduce:lg:hidden">
            <div className="sticky top-[max(6rem,calc(50svh-19rem))]">
              <div className="relative aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-md bg-areia">
                {services.list.map((s, i) => {
                  const pic = platibandaPhotos[pictures[s.id].id];
                  return (
                    <div key={s.id} data-layer className="absolute inset-0 will-change-[clip-path]" style={i === 0 ? undefined : { clipPath: "inset(100% 0% 0% 0%)" }}>
                      <Image src={pic.src} alt="" width={pic.width} height={pic.height} sizes="(min-width: 1024px) 30rem, 1px" className="h-full w-full object-cover" />
                      <span className="pb-barra absolute inset-0 rounded-md [--barra-w:16px]" style={{ ["--barra" as string]: barraColour[s.barra] }} />
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 flex items-baseline gap-3 font-display text-ria">
                <span data-count className="text-5xl tabular-nums">
                  01
                </span>
                <span className="text-pedra">/ 0{services.list.length}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-pedra">
            <p>{services.vatNote}</p>
            <p>{services.demoNote}</p>
          </div>
          <a
            href={`#${platibandaSections.contact}`}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-telha px-7 font-semibold text-cal transition-colors hover:bg-telha-deep"
          >
            {services.cta}
            <ArrowIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
