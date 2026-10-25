"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { oQuintal } from "@/content/o-quintal/facts";
import { MailIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 7 — «A caixa abre-se». The business baskets (its /cestas-de-fruta-para-empresas page): a crate whose lid
// (the slats) slides open with the scroll, revealing the offer written inside. «Pedir proposta» opens an email
// (the business's site sends it to its contact page).
export function Business() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-board]"),
          { xPercent: 0 },
          { xPercent: (i) => (i % 2 ? 104 : -104), ease: "power2.inOut", stagger: 0.04, scrollTrigger: { trigger: root.current, start: "top 65%", end: "top 10%", scrub: 0.6 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const subject = encodeURIComponent("Pedido de proposta — cestas de fruta para empresas");
  return (
    <section ref={root} aria-labelledby="oq-business-title" className="bg-kraft-2 px-4 py-24 sm:px-8 sm:py-32">
      <div className="relative mx-auto max-w-[64rem] overflow-hidden rounded-[1.4rem] bg-giz shadow-[0_40px_80px_-50px_rgb(38_42_43/0.7)]">
        <div className="px-6 py-14 text-center sm:px-14 sm:py-20">
          <p className="oq-stamp text-tomate-deep">Para empresas</p>
          <h2 id="oq-business-title" className="mt-4 font-display text-[clamp(2.1rem,6.5vw,3.8rem)] leading-[1.05] text-ardosia">
            {oQuintal.business.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-terra">{oQuintal.business.text}</p>
          <a
            href={`mailto:${oQuintal.email}?subject=${subject}`}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-tomate px-6 font-semibold text-giz transition-transform hover:scale-[1.03]"
          >
            <MailIcon className="h-4 w-4" /> Pedir proposta
          </a>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden flex-col [html.oq-anim_&]:flex">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} data-board className="block flex-1 [background-image:linear-gradient(180deg,#c29360,#a87a46)] shadow-[inset_0_-5px_0_rgb(60_38_18/0.8)]" />
          ))}
        </div>
      </div>
    </section>
  );
}
