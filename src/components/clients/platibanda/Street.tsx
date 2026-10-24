"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibandaPhotos } from "@/content/platibanda/facts";
import { deals, listingPrice, zones, type Listing } from "@/content/platibanda/listings";
import { platibandaListingHref, type PlatibandaMode } from "@/content/platibanda/routes";
import { facadeIn, polygon } from "./facade";
import { ArrowIcon } from "./icons";
import { platibandaSections } from "./sections";
import { SplitText } from "./react-bits/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const facadeClip = polygon(facadeIn(0, 0, 100, 100));
const barraColour: Record<Listing["barra"], string> = {
  ocre: "var(--color-ocre)",
  telha: "var(--color-telha)",
  anil: "var(--color-anil)",
  sal: "var(--color-sal)",
};

// A street of house fronts: the scene holds still (GSAP pin + scrub) while the featured houses slide past from right
// to left, each photo drifting inside its façade a little slower than the street (parallax), each house standing on
// a painted plinth in its own colour. Reduced motion: a row that scrolls sideways by hand, snapping house by house.
export function Street({ copy, items, mode }: { copy: PlatibandaCopy; items: Listing[]; mode: PlatibandaMode }) {
  const { street } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => Math.max(0, track.scrollWidth - el.clientWidth);
        el.classList.add("is-armed");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.3}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance(), duration: 1 }, 0)
          .fromTo(q("[data-photo]"), { xPercent: -8 }, { xPercent: 8, duration: 1 }, 0)
          .fromTo(q("[data-sun]"), { x: 0 }, { x: () => -distance() * 0.18, duration: 1 }, 0);
        return () => el.classList.remove("is-armed");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="pb-street-title" className="relative overflow-hidden bg-areia text-ria">
      <div aria-hidden="true" className="pb-grain pointer-events-none absolute inset-0" />
      <div className="relative flex min-h-svh flex-col justify-center py-20 [@media(max-height:700px)]:py-14">
        <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
          <p className="pb-label mb-4 flex items-center gap-3 text-ocre-deep">
            <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
            {street.eyebrow}
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 id="pb-street-title" className="font-display text-[clamp(2.2rem,7.5vw,4.6rem)] leading-[0.98]">
              <SplitText text={street.title} splitType="words" delay={60} /> <span className="text-telha">{street.titleItalic}</span>
            </h2>
            <p className="max-w-sm leading-relaxed text-pedra">{street.intro}</p>
          </div>
        </div>

        <div className="relative mt-10 [@media(max-height:700px)]:mt-6">
          <span
            data-sun
            aria-hidden="true"
            className="pointer-events-none absolute top-[4%] right-[12%] block size-[clamp(5rem,14vw,10rem)] rounded-full bg-ocre/25 will-change-transform"
          />
          <div className="pb-snap overflow-x-auto [.is-armed_&]:overflow-visible">
          <ul data-track className="relative flex w-max gap-5 px-5 pb-2 will-change-transform sm:gap-10 sm:px-8">
            {items.map((l) => {
              const cover = platibandaPhotos[l.photos[0].id];
              return (
                <li key={l.slug} className="w-[min(74vw,22rem)] shrink-0 [@media(max-height:700px)]:w-[min(58vw,17rem)]">
                  <Link href={platibandaListingHref(mode, l.slug)} className="group block">
                    <div className="relative aspect-[4/5] w-full drop-shadow-[0_24px_30px_rgb(19_48_46/0.18)]">
                      <div className="absolute inset-0 overflow-hidden bg-areia-2" style={{ clipPath: facadeClip }}>
                        <div data-photo className="absolute inset-y-0 -inset-x-[10%] will-change-transform">
                          <Image
                            src={cover.src}
                            alt={l.photos[0].alt}
                            width={cover.width}
                            height={cover.height}
                            sizes="(min-width: 640px) 22rem, 74vw"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[7%]" style={{ background: barraColour[l.barra] }} />
                      </div>
                      <span className="pb-label absolute top-[30%] left-4 rounded-full bg-cal/92 px-2.5 py-1 text-[0.62rem] text-ria">
                        {deals[l.deal].label}
                      </span>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-[1.35rem] leading-tight">
                          {l.typology} · {zones[l.zone]}
                        </p>
                        <p className="mt-1 text-sm text-pedra">{l.spot}</p>
                        <p className="mt-2 text-[1.05rem] font-semibold">{listingPrice(l)}</p>
                        <p className="mt-1 text-xs text-pedra">{copy.fictionalListing}</p>
                      </div>
                      <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-ria text-cal transition-transform group-hover:translate-x-1">
                        <ArrowIcon width={18} height={18} />
                        <span className="sr-only">{street.open}</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li className="flex w-[min(60vw,16rem)] shrink-0 items-center">
              <a
                href={`#${platibandaSections.listings}`}
                className="inline-flex min-h-14 items-center gap-3 rounded-full bg-telha px-6 py-3 font-semibold text-cal transition-colors hover:bg-telha-deep"
              >
                {street.all}
                <ArrowIcon width={18} height={18} />
              </a>
            </li>
          </ul>
          </div>
          <div aria-hidden="true" className="mx-5 mt-6 h-px bg-ria/20 sm:mx-8" />
        </div>
      </div>
    </section>
  );
}
