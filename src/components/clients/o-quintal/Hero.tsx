"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { oQuintal } from "@/content/o-quintal/facts";
import { findOQuintalProduct } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { SplitText } from "../o-ermita/react-bits/SplitText";
import { ArrowIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 1 — «A banca abre». A stall of the business's real photos (its home-page banners and product photos from
// its own store) sits behind the sign; the crate's slats lift one by one to reveal it. On scroll the section holds
// (pin + scrub): the photos drift apart in parallax and the sign rises, until the slats close again into a lid.
// Phones: the sign first, then the photo stall under it (mobile order: text, media, buttons).
// Reduced motion / no JavaScript: everything in place.
const stall = [
  { key: "cabazes", src: oQuintal.banners.cabazes, alt: "Cabazes de frutas e legumes", tilt: -3 },
  { key: "pera", src: findOQuintalProduct("3-kg-pera-rocha-oeste")?.sourceImage ?? null, alt: "Pera Rocha", tilt: 2 },
  { key: "sopas", src: oQuintal.banners.sopas, alt: "Preparados para sopas", tilt: 3 },
  { key: "alheira", src: oQuintal.banners.alheira, alt: "Cabaz Alheira de Mirandela", tilt: -2 },
  { key: "ovos", src: oQuintal.banners.ovos, alt: "Caixas de 5 dúzias de ovos", tilt: 2 },
  { key: "tamara", src: findOQuintalProduct("tamara-medjool")?.sourceImage ?? null, alt: "Tâmara Medjool", tilt: -3 },
] as const;

function StallPhoto({ src, alt, sizes, preload }: { src: string | null; alt: string; sizes: string; preload: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1rem] bg-kraft-2 shadow-[0_24px_50px_-28px_rgb(38_42_43/0.65)]">
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center p-3 text-center font-display text-sm text-terra/45">
        {alt}
      </span>
      {src && !failed ? <Image src={src} alt={alt} fill sizes={sizes} preload={preload} onError={() => setFailed(true)} className="object-cover" /> : null}
    </div>
  );
}

export function Hero({ mode }: { mode: OQuintalMode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const height = () => (root.current?.offsetHeight ?? window.innerHeight) + 8;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-intro]"), { opacity: 1 });
        gsap
          .timeline({ defaults: { ease: "power4.inOut" } })
          // Each slat leaves by the whole section's height (a percentage would only move it by its own height).
          .fromTo(q("[data-slat]"), { y: 0 }, { y: () => -height(), duration: 1.1, stagger: { each: 0.07, from: "center" } })
          .set(q("[data-slat]"), { autoAlpha: 0 })
          .from(q("[data-photo]"), { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, "-=0.7")
          .from(q("[data-sub]"), { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "-=0.8");
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", pin: true, scrub: 0.7, anticipatePin: 1 } })
          .to(q("[data-sign]"), { yPercent: -10, opacity: 0.4, ease: "none" }, 0)
          .to(q("[data-photo]"), { yPercent: (i) => (i % 2 ? -26 : -12), ease: "none" }, 0)
          .fromTo(q("[data-lid]"), { y: height }, { y: 0, ease: "power2.in", stagger: { each: 0.05, from: "edges" } }, 0.2);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const slats = Array.from({ length: 7 });
  return (
    <section ref={root} aria-labelledby="oq-hero-title" className="relative isolate overflow-hidden bg-kraft lg:h-svh lg:min-h-[40rem]">
      <div className="relative z-10 mx-auto grid max-w-[84rem] gap-10 px-4 pt-24 pb-14 sm:px-8 lg:h-full lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-20 lg:pb-0">
        <div data-sign>
          <p data-sub data-intro className="oq-stamp flex items-center gap-3 text-folha">
            <span aria-hidden="true" className="h-px w-8 bg-folha/60" />
            {oQuintal.area}
          </p>
          <h1 id="oq-hero-title" className="mt-5 font-display text-[clamp(2.3rem,min(9.6vw,9svh),5.6rem)] leading-[1] text-ardosia">
            <SplitText text="Frescos e cuidadosamente" splitType="words" delay={70} className="block" />
            <span className="block text-tomate">selecionados para si.</span>
          </h1>
          <p data-sub data-intro className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-terra sm:text-lg">
            Cabazes de fruta e legumes, fruta da boa, legumes para a sopa de todos os dias e os sabores de sempre: mel, marmelada e alheira de Mirandela. Entregamos em casa, em {oQuintal.area}.
          </p>
          <div data-sub data-intro className="mt-7 hidden flex-wrap gap-3 lg:flex">
            <HeroButtons mode={mode} />
          </div>
        </div>

        {/* The stall: real photos from the business's own store, in a loose grid of tilted crates. */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5" aria-label="Da nossa banca">
          {stall.map((photo, i) => (
            // GSAP animates the outer box; the tilt and the stagger live on the inner one (GSAP resets
            // the CSS rotate/translate properties of what it animates).
            <div key={photo.key} data-photo data-intro className="aspect-[4/5]">
              <div style={{ transform: `rotate(${photo.tilt}deg) translateY(${i % 2 ? "1.25rem" : "0"})` }} className="h-full w-full">
                <StallPhoto src={photo.src} alt={photo.alt} preload={i < 3} sizes="(min-width: 1024px) 15vw, 31vw" />
              </div>
            </div>
          ))}
        </div>

        <div data-sub data-intro className="flex flex-wrap gap-3 pt-4 lg:hidden">
          <HeroButtons mode={mode} />
        </div>
      </div>

      {/* The crate's slats over the stall at first (they lift), and the lid that closes on scroll (large screens). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden flex-col [html.oq-anim_&]:flex">
        {slats.map((_, i) => (
          <span key={i} data-slat className="block flex-1 [background-image:linear-gradient(180deg,#c29360,#a87a46)] shadow-[inset_0_-6px_0_rgb(60_38_18/0.8)]" />
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden flex-col lg:flex">
        {slats.map((_, i) => (
          <span key={i} data-lid className="block flex-1 translate-y-[110svh] [background-image:linear-gradient(180deg,#c29360,#a87a46)] shadow-[inset_0_-6px_0_rgb(60_38_18/0.8)]" />
        ))}
      </div>
    </section>
  );
}

function HeroButtons({ mode }: { mode: OQuintalMode }) {
  return (
    <>
      <Link
        href={oQuintalHref(mode, { kind: "shop", category: "cabazes" })}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-folha px-6 font-semibold text-giz transition-transform hover:scale-[1.03]"
      >
        Ver os cabazes <ArrowIcon className="h-4 w-4" />
      </Link>
      <Link
        href={oQuintalHref(mode, { kind: "shop", category: null })}
        className="inline-flex min-h-12 items-center rounded-full border-2 border-ardosia/80 px-6 font-semibold text-ardosia transition-colors hover:bg-ardosia hover:text-giz"
      >
        Toda a loja
      </Link>
    </>
  );
}
