"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";
import { prumo } from "@/content/prumo/facts";
import { ArrowIcon, CheckIcon } from "./icons";
import { Bob, Wordmark } from "./Logo";
import { pickServiceEvent, prumoSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const list = window.matchMedia(reducedQuery);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

const slats = 9;
const stamps = 10;

// The pilates studio. The film of a reformer class is seen through the slats of a blind that open one by one as the
// page scrolls (GSAP scrub; each slat folds away, transform only), the picture easing back from close. Then the
// «Cartão de cliente digital»: a card on the phone where each class leaves a brass stamp — ten bobs filling in with
// the scroll until the reward appears (an example rule). Reduced motion: the blind open, the card full, no film.
export function Studio({ copy }: { copy: PrumoCopy }) {
  const { studio } = copy;
  const { card } = studio;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useEffect(() => {
    const el = film.current;
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
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const blind = q("[data-blind]")[0];
        gsap.fromTo(
          q("[data-slat]"),
          { scaleY: 1 },
          { scaleY: 0, ease: "power2.inOut", stagger: { each: 0.08, from: "start" }, scrollTrigger: { trigger: blind, start: "top 80%", end: "top 20%", scrub: 0.6 } },
        );
        gsap.fromTo(q("[data-studio-film]"), { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: blind, start: "top bottom", end: "bottom top", scrub: true } });

        const cardEl = q("[data-card]")[0];
        const count = q("[data-count]")[0];
        const state = { n: 0 };
        const tl = gsap.timeline({ scrollTrigger: { trigger: cardEl, start: "top 80%", end: "bottom 45%", scrub: 0.6 } });
        tl.fromTo(q("[data-stamp]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: "back.out(2)", stagger: 0.1, duration: 0.2 }, 0)
          .fromTo(
            state,
            { n: 0 },
            {
              n: stamps,
              ease: "none",
              duration: 0.1 * (stamps - 1) + 0.2,
              onUpdate: () => {
                if (count) count.textContent = String(Math.round(state.n));
              },
            },
            0,
          )
          .fromTo(q("[data-reward]"), { opacity: 0.25, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, ">-0.05");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pickClass = () => window.dispatchEvent(new CustomEvent(pickServiceEvent, { detail: "pilates-grupo" }));

  return (
    <section ref={root} id={prumoSections.studio} aria-labelledby="pr-studio-title" className="relative bg-cal pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="pr-label mb-6 flex items-center gap-4 text-latao-fundo">
              <span aria-hidden="true" className="h-px w-10 bg-latao" />
              {studio.eyebrow}
            </p>
            <h2 id="pr-studio-title" className="font-display text-[clamp(2.7rem,9.5vw,5.6rem)] leading-[0.98] tracking-[-0.015em]">
              {studio.title} <span className="block text-latao-fundo italic">{studio.titleItalic}</span>
            </h2>
          </div>
          <p className="max-w-lg text-[1.02rem] leading-[1.75] text-pedra">{studio.intro}</p>
        </div>
      </div>

      <div data-blind className="relative mx-auto mt-12 aspect-[4/5] w-full max-w-[96rem] overflow-hidden bg-ardosia sm:aspect-[16/9] sm:w-[calc(100%-4rem)] sm:rounded-[2rem] lg:mt-16">
        <div data-studio-film className="absolute inset-0 will-change-transform">
          <Image src={prumo.media.studioPoster} alt={studio.alt} width={1280} height={720} sizes="(min-width: 640px) 90vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          {motionOk ? (
            <video
              ref={film}
              src={prumo.media.studio}
              poster={prumo.media.studioPoster}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>
        {/* The blind: slats that fold away. Without JavaScript or with reduced motion they are already open. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col motion-reduce:hidden">
          {Array.from({ length: slats }, (_, i) => (
            <span key={i} data-slat className="block flex-1 origin-top bg-cal will-change-transform" style={{ transform: "scaleY(0)" }} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-[84rem] gap-14 px-5 sm:px-8 lg:mt-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <ul className="flex flex-col gap-3">
            {studio.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[1.05rem] leading-snug">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ardosia text-cal">
                  <CheckIcon width={14} height={14} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <a
            href={`#${prumoSections.book}`}
            onClick={pickClass}
            className="group mt-8 inline-flex h-13 items-center gap-3 rounded-full bg-ardosia px-6 text-[0.98rem] font-semibold text-cal transition-colors hover:bg-ardosia-3"
          >
            {copy.disciplines.book} · {copy.disciplines.list.find((d) => d.id === "pilates")?.title}
            <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="rounded-[2rem] bg-anca p-6 sm:p-9">
          <p className="pr-label text-latao-fundo">{card.eyebrow}</p>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,6vw,2.6rem)] leading-tight">{card.title}</h3>
          <p className="mt-3 max-w-md leading-relaxed text-pedra">{card.text}</p>

          <div data-card className="mt-7 rounded-[1.6rem] bg-ardosia p-5 text-cal shadow-[0_30px_60px_-35px_rgb(29_39_48/0.8)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Wordmark short className="w-20" ink="var(--color-cal)" />
                <p className="mt-2 text-[0.8rem] text-cal/70">
                  {card.cardName} · {card.cardLine}
                </p>
              </div>
              <p className="text-right">
                <span data-count className="font-display text-4xl leading-none tabular-nums">
                  {stamps}
                </span>
                <span className="text-cal/60">/{stamps}</span>
                <span className="block text-[0.68rem] font-semibold tracking-[0.14em] text-cal/60 uppercase">{card.stampsLabel}</span>
              </p>
            </div>
            <ol aria-hidden="true" className="mt-5 grid grid-cols-5 gap-2.5">
              {Array.from({ length: stamps }, (_, i) => (
                <li key={i} className="relative grid aspect-square place-items-center rounded-full ring-1 ring-cal/20">
                  <span data-stamp className="grid size-full place-items-center rounded-full bg-cal/10">
                    <Bob className="h-[52%] w-auto" color="var(--color-latao-claro)" />
                  </span>
                </li>
              ))}
            </ol>
            <p data-reward className="mt-5 rounded-xl bg-latao-claro px-4 py-3 text-[0.92rem] font-semibold text-ardosia">
              {card.rewardShort}
            </p>
          </div>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-tinta">{card.reward}</p>
          <p className="mt-1 text-sm text-pedra">{card.example}</p>
        </div>
      </div>
    </section>
  );
}
