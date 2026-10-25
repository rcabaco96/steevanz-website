"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { oQuintalProductsIn } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { SplitText } from "../o-ermita/react-bits/SplitText";
import { ArrowIcon } from "./icons";
import { PriceTag, ProductVisual } from "./ProductVisual";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 3 — «Os cabazes passam no tapete». Large screens: the section holds (pin) and the three baskets of the
// week slide sideways like crates on the stall's counter, each tilting a little as it passes, a crate-wood rail
// filling underneath. Phones: one after another, each crate dropping onto the counter (clip from the top) as it
// enters. Reduced motion: all in place.
export function Crates({ mode }: { mode: OQuintalMode }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const baskets = oQuintalProductsIn("cabazes");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance() + 200}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.fromTo(q("[data-rail]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance() + 200}`, scrub: true } });
        q("[data-crate]").forEach((crate) => {
          gsap.fromTo(crate, { rotate: 4, y: 40 }, { rotate: -2, y: 0, ease: "none", scrollTrigger: { trigger: crate, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-crate]").forEach((crate) => {
          gsap.fromTo(
            crate,
            { clipPath: "inset(0% 0% 100% 0% round 18px)", y: -30 },
            { clipPath: "inset(0% 0% 0% 0% round 18px)", y: 0, ease: "power2.out", scrollTrigger: { trigger: crate, start: "top 92%", end: "top 45%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cabazes" aria-labelledby="oq-crates-title" className="relative overflow-hidden bg-kraft-2 lg:h-svh">
      <div ref={track} className="flex flex-col gap-10 px-4 py-24 sm:px-8 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-12 lg:py-0 lg:pr-[10vw] lg:pl-[max(2rem,calc((100vw-84rem)/2+2rem))] lg:will-change-transform">
        <div className="lg:w-[30rem] lg:shrink-0">
          <p className="oq-stamp text-tomate-deep">Os cabazes da semana</p>
          <h2 id="oq-crates-title" className="mt-4 font-display text-[clamp(2.4rem,8vw,4.6rem)] leading-[1.02] text-ardosia">
            <SplitText text="Tudo junto," splitType="chars" className="block" />
            <span className="block text-folha">numa caixa só.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-terra">A composição muda conforme a época. Escolha o cabaz e nós tratamos do resto.</p>
          <Link href={oQuintalHref(mode, { kind: "shop", category: "cabazes" })} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-ardosia px-6 font-semibold text-giz">
            Ver todos os cabazes <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        {baskets.map((basket) => (
          <Link
            key={basket.id}
            data-crate
            href={oQuintalHref(mode, { kind: "product", id: basket.id })}
            className="group block overflow-hidden rounded-[18px] bg-giz shadow-[0_30px_60px_-35px_rgb(38_42_43/0.6)] lg:w-[min(30rem,38vw)] lg:shrink-0"
          >
            <ProductVisual product={basket} sizes="(min-width: 1024px) 38vw, 100vw" className="aspect-[4/3]" />
            <div className="oq-slats flex items-end justify-between gap-4 px-5 py-5 [--slat:200px]">
              <h3 className="font-display text-[1.45rem] leading-tight text-giz drop-shadow-[0_1px_0_rgb(60_38_18/0.8)]">{basket.name}</h3>
              <PriceTag product={basket} />
            </div>
          </Link>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-3 bg-caixote-deep/25 lg:block">
        <div data-rail className="h-full origin-left bg-caixote-deep" />
      </div>
    </section>
  );
}
