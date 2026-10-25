"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { oQuintal } from "@/content/o-quintal/facts";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { SplitText } from "../o-ermita/react-bits/SplitText";
import { ArrowIcon } from "./icons";
import { Leaf } from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 1 — «A banca abre». The crate's slats cover the screen and lift one by one (staggered, from the middle out)
// to reveal the stall's sign: the tagline in large serif, letters rising (React Bits SplitText). On scroll the
// section holds (pin + scrub) while the sign shrinks back and the slats close again into a crate lid, handing over
// to the next scene. Reduced motion / no JavaScript: the sign, in place, readable.
export function Hero({ mode }: { mode: OQuintalMode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-intro]"), { opacity: 1 });
        const intro = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        intro
          // Each slat leaves by the whole section's height (a percentage would only move it by its own height).
          .fromTo(q("[data-slat]"), { y: 0 }, { y: () => -((root.current?.offsetHeight ?? window.innerHeight) + 8), duration: 1.1, stagger: { each: 0.07, from: "center" } })
          .set(q("[data-slat]"), { autoAlpha: 0 })
          .from(q("[data-sub]"), { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "-=0.45")
          .from(q("[data-leaf]"), { rotate: -40, scale: 0.4, opacity: 0, duration: 1, ease: "back.out(2)" }, "-=0.8");

        const out = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", pin: true, scrub: 0.7, anticipatePin: 1 },
        });
        out
          .to(q("[data-sign]"), { scale: 0.82, yPercent: -6, ease: "none" }, 0)
          .to(q("[data-leaf]"), { rotate: 25, yPercent: -40, ease: "none" }, 0)
          .fromTo(
            q("[data-lid]"),
            { y: () => (root.current?.offsetHeight ?? window.innerHeight) + 8 },
            { y: 0, ease: "power2.in", stagger: { each: 0.05, from: "edges" } },
            0.15,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const slats = Array.from({ length: 7 });
  return (
    <section ref={root} aria-labelledby="oq-hero-title" className="relative isolate h-svh min-h-[34rem] overflow-hidden bg-kraft">
      {/* The stall's sign. */}
      <div data-sign className="relative z-10 mx-auto flex h-full max-w-[84rem] flex-col justify-center px-4 pt-16 sm:px-8">
        <p data-sub data-intro className="oq-stamp flex items-center gap-3 text-folha">
          <span aria-hidden="true" className="h-px w-8 bg-folha/60" />
          Frutas, legumes e cabazes · {oQuintal.area}
        </p>
        <h1 id="oq-hero-title" className="mt-5 max-w-[15ch] font-display text-[clamp(2.1rem,min(10.2vw,11svh),6.6rem)] leading-[0.98] text-ardosia">
          <SplitText text="Frescos e cuidadosamente" splitType="chars" delay={22} className="block" />
          <span className="block text-tomate">selecionados para si.</span>
        </h1>
        <p data-sub data-intro className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-terra sm:text-lg">
          {oQuintal.summary}
        </p>
        <div data-sub data-intro className="mt-8 flex flex-wrap gap-3">
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
        </div>
      </div>
      <Leaf
        // The big leaf on the sign's right, drawn (no photo).
        className="pointer-events-none absolute -right-[12vw] bottom-[6%] z-0 h-[62vw] max-h-[34rem] w-[62vw] max-w-[34rem] text-folha/[0.09] sm:right-[2vw]"
      />
      <span data-leaf data-intro aria-hidden="true" className="absolute top-[22%] right-[8%] z-10 hidden text-limao sm:block">
        <Leaf className="h-16 w-16" />
      </span>

      {/* The crate's slats over the sign at first (they lift), and the lid that closes on scroll. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden flex-col [html.oq-anim_&]:flex">
        {slats.map((_, i) => (
          <span key={i} data-slat className="oq-slats block flex-1 [--slat:999px] [background-image:linear-gradient(180deg,#c29360,#a87a46)] shadow-[inset_0_-6px_0_rgb(60_38_18/0.8)]" />
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex flex-col">
        {slats.map((_, i) => (
          <span key={i} data-lid className="oq-slats block flex-1 translate-y-[110svh] [--slat:999px] [background-image:linear-gradient(180deg,#c29360,#a87a46)] shadow-[inset_0_-6px_0_rgb(60_38_18/0.8)]" />
        ))}
      </div>
    </section>
  );
}
