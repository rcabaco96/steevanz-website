"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragial, ferragialPrice, ferragialWines } from "@/content/ferragial/facts";
import { Bottle } from "./Bottle";
import { useCart } from "./cart";
import { BasketIcon, CheckIcon, PlusIcon } from "./icons";
import { SplitText } from "./react-bits/SplitText";
import { ferragialSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const bowl = "M22 8C19 66 30 104 60 108C90 104 101 66 98 8Z";

// The online shop: seven wines with their grapes, tasting notes, what to eat with them and the price per bottle
// (without VAT, «+ IVA» beside it — owner's absolute rule). Large screens: one glass stays beside the list and, as each
// wine reaches the middle of the screen, the glass is poured with that wine's colour (its liquid rises and the
// colours cross-fade); the bottles lift as they pass. «Juntar ao cesto» fills the basket (Basket.tsx), which ends in an
// order request by WhatsApp or email — never a payment. Phones: the cards one after the other.
export function Wines({ copy }: { copy: FerragialCopy }) {
  const { wines } = copy;
  const root = useRef<HTMLElement>(null);
  const pour = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const cart = useCart();
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useEffect(() => {
    const el = pour.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        q("[data-wine]").forEach((card, i) => {
          ScrollTrigger.create({ trigger: card, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
        });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        q("[data-bottle]").forEach((bottle) => {
          gsap.fromTo(bottle, { y: 50, rotate: -6 }, { y: -10, rotate: 0, ease: "none", scrollTrigger: { trigger: bottle, start: "top bottom", end: "bottom 35%", scrub: 0.6 } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const current = ferragialWines[active];

  return (
    <section ref={root} id={ferragialSections.wines} aria-labelledby="fg-wines-title" className="relative bg-cal pt-24 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
        <div>
          <p className="fg-label mb-5 flex items-center gap-3 text-barro">
            <span aria-hidden="true" className="h-px w-10 bg-barro/60" />
            {wines.eyebrow}
          </p>
          <h2 id="fg-wines-title" className="font-display text-[clamp(2.8rem,10vw,6.4rem)] leading-[0.92] tracking-[-0.015em]">
            <SplitText text={wines.title} splitType="chars" delay={30} className="block" />
            <span className="block text-tinto">{wines.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1.04rem] leading-[1.75] text-pedra">{wines.intro}</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[22rem] overflow-hidden rounded-full bg-black lg:mx-0 lg:ml-auto">
          {/* eslint-disable-next-line @next/next/no-img-element -- a still for reduced motion; the film is decorative */}
          <img src={ferragial.media.pourPoster} alt={wines.pourAlt} width={720} height={720} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          {motionOk ? (
            <video ref={pour} src={ferragial.media.pour} poster={ferragial.media.pourPoster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[90rem] px-5 sm:px-8">
        <p className="text-sm font-semibold text-tinta">{wines.vatNote}</p>
        <p className="mt-1 text-sm text-pedra">
          {wines.demoNote} {wines.adultsOnly}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-[90rem] gap-10 px-5 sm:px-8 lg:mt-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        {/* The glass that follows the list (large screens). */}
        <div aria-hidden="true" className="hidden lg:block">
          <div className="sticky top-[max(6rem,calc(50svh-17rem))] flex flex-col items-center">
            <svg viewBox="0 0 120 222" className="h-[min(28rem,58svh)] w-auto overflow-visible">
              <defs>
                <clipPath id="fg-bowl">
                  <path d={bowl} />
                </clipPath>
              </defs>
              <g clipPath="url(#fg-bowl)">
                <g key={active} className="animate-[fg-pour_1.1s_cubic-bezier(0.22,1,0.36,1)_both]">
                  {ferragialWines.map((wine, i) => (
                    <path
                      key={wine.id}
                      d="M0 56C20 50 40 62 60 56S100 50 120 56V120H0Z"
                      fill={wine.glass}
                      className="transition-opacity duration-700"
                      style={{ opacity: i === active ? 1 : 0 }}
                    />
                  ))}
                </g>
              </g>
              <path d={bowl} fill="rgb(255 255 255 / 0.25)" stroke="#241c1b" strokeOpacity="0.55" strokeWidth="1.2" />
              <path d="M30 18C29 50 34 78 46 92" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M58.5 108h3v84h-3z" fill="#241c1b" fillOpacity="0.5" />
              <ellipse cx="60" cy="196" rx="30" ry="5" fill="none" stroke="#241c1b" strokeOpacity="0.55" strokeWidth="1.2" />
            </svg>
            <p className="fg-label mt-6 text-pedra">{current.kind}</p>
            <p className="mt-2 text-center font-display text-3xl">
              {current.name} <span className="text-barro">{current.vintage}</span>
            </p>
          </div>
        </div>

        <ol className="flex flex-col gap-5 sm:gap-6">
          {ferragialWines.map((wine) => {
            const qty = cart.items[wine.id] ?? 0;
            return (
              <li key={wine.id} data-wine>
                <article
                  aria-labelledby={`fg-wine-${wine.id}`}
                  className="grid grid-cols-[4.5rem_1fr] gap-x-5 gap-y-5 rounded-[1.25rem] bg-white/60 p-5 ring-1 ring-tinta/8 sm:grid-cols-[7rem_1fr] sm:gap-x-8 sm:p-8"
                >
                  <div className="row-span-2 flex items-start justify-center pt-2 sm:row-span-1">
                    <div data-bottle className="will-change-transform">
                      <Bottle wine={wine} className={wine.box ? "h-40 w-auto sm:h-56" : "h-40 w-auto sm:h-56"} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="fg-label flex flex-wrap items-center gap-x-3 gap-y-1 text-barro">
                      {wine.kind}
                      {wine.talha ? <span className="rounded-full bg-barro/12 px-2 py-0.5 text-[0.6rem] tracking-[0.18em] text-barro">{wines.talha}</span> : null}
                    </p>
                    <h3 id={`fg-wine-${wine.id}`} className="mt-2 font-display text-[clamp(1.7rem,5vw,2.4rem)] leading-[1.02]">
                      {wine.name} <span className="text-pedra">{wine.vintage}</span>
                    </h3>
                    <p className="mt-3 text-[0.95rem] text-tinta">
                      <span className="text-pedra">{wine.box ? "Inclui" : wines.grapes}: </span>
                      {wine.grapes.join(" · ")}
                    </p>
                    <dl className="mt-4 hidden gap-3 text-[0.95rem] leading-relaxed sm:grid">
                      <div>
                        <dt className="fg-label text-[0.62rem] text-pedra">{wines.notes}</dt>
                        <dd className="mt-1">{wine.notes}</dd>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="fg-label text-[0.62rem] text-pedra">{wines.pairing}</dt>
                          <dd className="mt-1">{wine.pairing}</dd>
                        </div>
                        <div>
                          <dt className="fg-label text-[0.62rem] text-pedra">{wines.serve}</dt>
                          <dd className="mt-1">{wine.serve}</dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                  {/* Phones: the notes under the bottle, full width. */}
                  <dl className="col-span-2 grid gap-3 text-[0.95rem] leading-relaxed sm:hidden">
                    <div>
                      <dt className="fg-label text-[0.62rem] text-pedra">{wines.notes}</dt>
                      <dd className="mt-1">{wine.notes}</dd>
                    </div>
                    <div>
                      <dt className="fg-label text-[0.62rem] text-pedra">{wines.pairing}</dt>
                      <dd className="mt-1">
                        {wine.pairing} <span className="text-pedra">· {wines.serve.toLowerCase()} {wine.serve}</span>
                      </dd>
                    </div>
                  </dl>
                  <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-tinta/10 pt-5 sm:col-start-2 sm:col-span-1">
                    <p>
                      <span className="font-display text-[1.9rem] leading-none tabular-nums">{ferragialPrice(wine.price)}</span>
                      <span className="ml-2 text-[0.72rem] font-semibold tracking-[0.12em] text-pedra uppercase">{wines.plusVat}</span>
                      <span className="block text-xs text-pedra">{wine.unit}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => cart.add(wine.id)}
                      className={`inline-flex h-12 items-center gap-2.5 rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase transition-colors ${
                        qty ? "bg-esteva text-cal hover:bg-tinto" : "bg-tinto text-cal hover:bg-mosto"
                      }`}
                    >
                      {qty ? <CheckIcon width={17} height={17} /> : <PlusIcon width={17} height={17} />}
                      {qty ? `${wines.added} · ${qty}` : wines.add}
                      <span className="sr-only">: {wine.name}</span>
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mx-auto mt-10 flex max-w-[90rem] justify-center px-5 sm:px-8 lg:justify-end">
        <button
          type="button"
          onClick={() => cart.setOpen(true)}
          className="inline-flex h-14 items-center gap-3 rounded-full bg-xisto px-7 text-[0.8rem] font-semibold tracking-[0.14em] text-cal uppercase transition-colors hover:bg-tinto"
        >
          <BasketIcon />
          {copy.basket.open}
          {cart.bottles ? <span className="rounded-full bg-palha px-2 py-0.5 text-xisto tabular-nums">{cart.bottles}</span> : null}
        </button>
      </div>
    </section>
  );
}
