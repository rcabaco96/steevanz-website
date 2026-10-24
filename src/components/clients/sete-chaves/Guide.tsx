"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import {
  seteChavesCopy as copy,
  steevanzLinks,
} from "@/content/sete-chaves/copy";
import { ArrowIcon, CheckIcon, WifiIcon } from "./icons";
import { FobMark } from "./Logo";
import { Reveal } from "./Reveal";
import { seteChavesSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** A made-up QR-like pattern for the plate (decoration: it encodes nothing). */
const qrCells = [
  "1110111",
  "1010101",
  "1110111",
  "0001000",
  "1101011",
  "0110110",
  "1011101",
];

function Plate({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="relative w-[9.5rem] rounded-[1rem] bg-xisto p-3.5 text-cal shadow-[0_24px_40px_-20px_rgb(0_0_0/0.6)]">
      <span
        aria-hidden="true"
        className="sc-wave absolute top-3 right-3 block size-9 rounded-full border border-latao-claro/70"
      />
      <span
        aria-hidden="true"
        className="sc-wave absolute top-3 right-3 block size-9 rounded-full border border-latao-claro/70 [animation-delay:1.2s]"
      />
      <svg
        viewBox="0 0 7 7"
        aria-hidden="true"
        className="size-12 rounded-[3px] bg-cal p-1"
        shapeRendering="crispEdges"
      >
        {qrCells.flatMap((row, y) =>
          [...row].map((c, x) =>
            c === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                fill="#1d2227"
              />
            ) : null,
          ),
        )}
      </svg>
      <p className="mt-3 font-display text-lg leading-none">{title}</p>
      <p className="sc-label mt-1.5 text-[0.55rem] text-latao-claro">{sub}</p>
    </div>
  );
}

// THE GUEST GUIDE — the Steevanz «Guia digital» as this house uses it. A phone comes up to the plate on the bedside
// table and the guide opens; as the page scrolls (GSAP scrub, held on large screens) the guide scrolls inside the
// phone: Wi-Fi with a copy button, breakfast, check-out, beaches without signal, the house's tips. The screen is a
// drawing of the guide made for this demo (no real password). Links to the product page with «Conhecer o Guia digital»
// and to the keychain (owner, 2026-10-20: a product's call always goes to its page).
export function Guide() {
  const { guide } = copy;
  const { screen } = guide;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const build = (pin: boolean) => {
        const travel = () => {
          const inner = q("[data-screen-inner]")[0] as HTMLElement | undefined;
          const view = q("[data-screen]")[0] as HTMLElement | undefined;
          return inner && view
            ? -Math.max(0, inner.scrollHeight - view.clientHeight)
            : 0;
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? {
                trigger: el,
                start: "top top",
                end: "+=110%",
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              }
            : {
                trigger: q("[data-phone-wrap]")[0],
                start: "top 85%",
                end: "bottom 15%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
        });
        tl.fromTo(
          q("[data-phone]"),
          { y: 80, rotate: 7 },
          { y: 0, rotate: 0, duration: 0.3, ease: "power2.out" },
          0,
        )
          .fromTo(
            q("[data-screen-glow]"),
            { opacity: 1 },
            { opacity: 0, duration: 0.15 },
            0.22,
          )
          .fromTo(
            q("[data-screen-inner]"),
            { y: 0 },
            { y: travel, duration: 0.7 },
            0.32,
          );
      };
      mm.add(
        "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
        () => build(true),
      );
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 699px) and (prefers-reduced-motion: no-preference)",
        () => build(false),
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={seteChavesSections.guide}
      aria-labelledby="sc-guide-title"
      className="relative overflow-hidden bg-cal"
    >
      <div className="mx-auto grid max-w-[80rem] items-center gap-12 px-5 py-24 sm:px-8 lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20 lg:py-20">
        <div className="lg:order-1">
          <p className="sc-label mb-5 flex items-center gap-3 text-latao-deep">
            <span aria-hidden="true" className="h-px w-8 bg-latao/60" />
            {guide.eyebrow}
          </p>
          <h2
            id="sc-guide-title"
            className="max-w-[15ch] font-display text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.98] tracking-[-0.02em]"
          >
            {guide.title}
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-tinta/80">
            {guide.intro}
          </p>
        </div>

        {/* Phones: heading and intro, then the phone, then the rest (owner's mobile order). */}
        <div
          data-phone-wrap
          className="relative mx-auto flex w-full max-w-[22rem] justify-center pt-4 pb-10 lg:order-2 lg:row-span-2 lg:max-w-none"
        >
          <div
            aria-hidden="true"
            className="absolute top-[18%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-latao/15 blur-3xl"
          />
          <figure
            data-phone
            aria-label={guide.phoneLabel}
            className="relative w-[min(72vw,17rem)] rounded-[2.6rem] bg-tinta p-2.5 shadow-[0_50px_80px_-40px_rgb(38_44_51/0.8)] will-change-transform"
          >
            <div
              data-screen
              className="relative aspect-[9/19] overflow-hidden rounded-[2.1rem] bg-cal"
            >
              <div data-screen-inner className="will-change-transform">
                <div className="flex items-center justify-between bg-xisto px-4 pt-7 pb-3 text-cal">
                  <span className="flex items-center gap-2">
                    <FobMark
                      ring={false}
                      gradientId="sc-brass-phone"
                      className="h-6 w-auto"
                      style={{ ["--sc-hole" as string]: "var(--color-xisto)" }}
                    />
                    <span className="font-display text-[0.95rem] leading-none">
                      {screen.title}
                    </span>
                  </span>
                  <span className="flex gap-1 text-[0.55rem] font-semibold">
                    {["PT", "EN", "FR", "DE"].map((l, i) => (
                      <span
                        key={l}
                        className={`rounded-full px-1.5 py-0.5 ${i === 0 ? "bg-latao text-tinta" : "bg-cal/10"}`}
                      >
                        {l}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="grid gap-2.5 p-3.5">
                  <p className="font-display text-[1.15rem] leading-tight">
                    {screen.hello}
                  </p>
                  <div className="rounded-2xl bg-linho p-3">
                    <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.08em] uppercase">
                      <WifiIcon width={14} height={14} /> {screen.wifi}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] text-pedra">
                      {screen.network}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-cal px-2.5 py-2">
                      <span className="text-[0.75rem] tracking-[0.2em]">
                        ••••••••
                      </span>
                      <span className="rounded-full bg-xisto px-2.5 py-1 text-[0.6rem] font-semibold text-cal">
                        {screen.copy}
                      </span>
                    </div>
                  </div>
                  {screen.sections.map((s) => (
                    <div
                      key={s.title}
                      className="flex items-center justify-between gap-2 rounded-2xl bg-linho/70 px-3 py-2.5"
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.78rem] font-semibold">
                          {s.title}
                        </span>
                        <span className="block text-[0.68rem] leading-snug text-pedra">
                          {s.text}
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-latao-deep">
                        ›
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                data-screen-glow
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-xisto opacity-0"
              />
            </div>
          </figure>
          <div className="absolute bottom-0 left-0 -rotate-6 sm:-left-4 lg:-left-10">
            <Plate title={guide.plate} sub={guide.plateSub} />
          </div>
        </div>

        <Reveal className="lg:order-3">
          <ul className="grid gap-2.5">
            {guide.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckIcon
                  width={18}
                  height={18}
                  className="mt-0.5 shrink-0 text-latao-deep"
                />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl leading-relaxed text-tinta/80">
            {guide.keychain}
          </p>
          <div className="mt-7 rounded-[1.2rem] bg-linho p-5">
            <p className="text-sm text-pedra">{guide.product}</p>
            <div className="mt-4 flex flex-col gap-3 min-[460px]:flex-row min-[460px]:flex-wrap">
              <a
                href={steevanzLinks.guide}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-xisto px-6 text-[0.78rem] font-semibold tracking-[0.12em] text-cal uppercase transition-colors hover:bg-tinta"
              >
                {guide.cta}
                <ArrowIcon width={16} height={16} />
                <span className="sr-only"> {copy.newTab}</span>
              </a>
              <a
                href={steevanzLinks.keychain}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.78rem] font-semibold tracking-[0.12em] uppercase ring-1 ring-tinta/25 transition-colors hover:bg-cal"
              >
                {guide.keychainCta}
                <span className="sr-only"> {copy.newTab}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
