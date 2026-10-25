"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { oQuintal } from "@/content/o-quintal/facts";
import { SplitText } from "../o-ermita/react-bits/SplitText";
import { MailIcon, PhoneIcon, TruckIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 5 — «A volta da carrinha». The six councils the business delivers to (its /zonas-de-entrega page) are
// stamped one after another along a road that draws itself with the scroll, the van riding along it (pin + scrub on
// large screens; on phones the stamps land as they enter). The two ways to receive the order come from its terms.
export function Delivery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const wrap = q("[data-road-wrap]")[0];
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: "center center", end: "+=120%", pin: wrap, scrub: 0.6 } });
        tl.fromTo(q("[data-road]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0)
          .fromTo(q("[data-van]"), { left: "0%" }, { left: "100%", ease: "none", duration: 1 }, 0)
          .fromTo(q("[data-stop]"), { scale: 0.4, opacity: 0, rotate: -12 }, { scale: 1, opacity: 1, rotate: (i) => (i % 2 ? 4 : -4), ease: "back.out(2.4)", stagger: 0.15, duration: 0.25 }, 0.05);
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-stop]").forEach((stop, i) => {
          gsap.fromTo(stop, { scale: 0.5, opacity: 0, rotate: -10 }, { scale: 1, opacity: 1, rotate: i % 2 ? 3 : -3, ease: "back.out(2)", duration: 0.6, scrollTrigger: { trigger: stop, start: "top 90%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="entregas" aria-labelledby="oq-delivery-title" className="relative overflow-hidden bg-folha text-giz">
      <div className="mx-auto max-w-[84rem] px-4 pt-24 sm:px-8 sm:pt-32">
        <p className="oq-stamp text-limao">Entregas</p>
        <h2 id="oq-delivery-title" className="mt-4 max-w-[18ch] font-display text-[clamp(2.3rem,7.5vw,4.4rem)] leading-[1.03]">
          <SplitText text="Levamos à sua porta," splitType="words" delay={80} className="block" />
          <span className="block text-limao">em {oQuintal.area}.</span>
        </h2>
        <p className="mt-5 max-w-xl text-lg text-giz/80">{oQuintal.deliveryNote}</p>
      </div>

      <div data-road-wrap className="mx-auto flex max-w-[84rem] flex-col justify-center px-4 py-16 sm:px-8 lg:min-h-[60svh]">
        <div className="relative hidden h-24 lg:block" aria-hidden="true">
          <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-giz/15" />
          <div data-road className="absolute inset-x-0 top-1/2 h-[6px] origin-left -translate-y-1/2 rounded-full bg-limao [background-image:repeating-linear-gradient(90deg,transparent_0_18px,rgb(28_50_32/0.9)_18px_30px)]" />
          <span data-van className="absolute top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-tomate text-giz shadow-lg">
            <TruckIcon className="h-7 w-7" />
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-6 lg:grid-cols-6 lg:gap-4">
          {oQuintal.deliveryCouncils.map((council) => (
            <li key={council} data-stop className="rounded-xl border-2 border-dashed border-limao/70 px-3 py-4 text-center font-display text-[1.25rem] text-giz sm:text-[1.4rem]">
              {council}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-[84rem] gap-4 px-4 pb-24 sm:grid-cols-2 sm:px-8 sm:pb-32">
        <div className="rounded-2xl bg-folha-deep p-6">
          <p className="oq-stamp text-limao">Como recebe</p>
          <ul className="mt-4 space-y-2 text-lg">
            <li>{oQuintal.fulfilment.delivery}</li>
            <li>{oQuintal.fulfilment.pickup}</li>
          </ul>
          <p className="mt-4 text-sm text-giz/65">O custo de entrega é confirmado pela O Quintal depois da encomenda.</p>
        </div>
        <div className="rounded-2xl bg-folha-deep p-6">
          <p className="oq-stamp text-limao">A sua zona não aparece?</p>
          <p className="mt-4 text-lg">Fale connosco antes de encomendar.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={oQuintal.phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-limao px-5 font-semibold text-ardosia">
              <PhoneIcon className="h-4 w-4" /> {oQuintal.phoneDisplay}
            </a>
            <a href={`mailto:${oQuintal.email}`} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-giz/50 px-5 font-semibold">
              <MailIcon className="h-4 w-4" /> Email
            </a>
          </div>
          <p className="mt-3 text-xs text-giz/55">{oQuintal.phoneNote}</p>
        </div>
      </div>
    </section>
  );
}
