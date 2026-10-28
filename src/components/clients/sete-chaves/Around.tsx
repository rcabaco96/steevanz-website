"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import {
  seteChaves,
  seteChavesPhotos,
  type SeteChavesPhotoId,
} from "@/content/sete-chaves/facts";
import { FobMark } from "./Logo";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";
import { seteChavesSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const list = window.matchMedia(reducedQuery);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};

/** How each postcard lies on the table before it straightens (degrees, alternating). */
const tilts = [-7, 5, -4, 8, -6, 4];

// THE SURROUNDINGS. The sea opens like a shutter lifted on the horizon — the film of surfers off the Costa Vicentina
// widens from a thin line to the full screen as it scrolls in (scrub, clip-path) — and a strip of the beaches' names
// drifts with the scroll (React Bits' ScrollVelocity). Then the places as postcards thrown on the table, each
// straightening as it comes up. Distances are approximate, by road, from the village (facts.ts).
export function Around() {
  const { around } = copy;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const motionOk = useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(reducedQuery).matches,
    () => false,
  );

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
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-sea]"),
          { clipPath: "inset(48% 0% 48% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-sea-wrap]")[0],
              start: "top 95%",
              end: "center 55%",
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          q("[data-sea-img]"),
          { scale: 1.3 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-sea-wrap]")[0],
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        q("[data-card]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { rotate: tilts[i % tilts.length], y: 70 },
            {
              rotate: tilts[i % tilts.length] / 5,
              y: 0,
              ease: "power1.out",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "top 55%",
                scrub: 0.6,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={seteChavesSections.around}
      aria-labelledby="sc-around-title"
      className="relative overflow-x-clip bg-linho pt-24 pb-28 sm:pt-32"
    >
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="sc-label mb-5 flex items-center gap-3 text-latao-deep">
          <span aria-hidden="true" className="h-px w-8 bg-latao/60" />
          {around.eyebrow}
        </p>
        <h2
          id="sc-around-title"
          className="font-display text-[clamp(2.6rem,8vw,5rem)] leading-[0.95] tracking-[-0.02em]"
        >
          {around.title}
        </h2>
        <p className="mt-5 max-w-lg leading-relaxed text-tinta/75">
          {around.intro}
        </p>
      </div>

      <div
        data-sea-wrap
        className="relative mt-12 h-[62svh] min-h-[340px] sm:mt-16 sm:h-[78svh]"
      >
        <div
          data-sea
          className="sc-on-dark absolute inset-0 overflow-hidden bg-xisto will-change-[clip-path]"
        >
          <div data-sea-img className="absolute inset-0 will-change-transform">
            <Image
              src={seteChaves.media.seaPoster}
              alt={around.seaAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            {motionOk ? (
              <video
                ref={film}
                src={seteChaves.media.sea}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(38_44_51/0.25),transparent_40%,rgb(38_44_51/0.55))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-6 sm:bottom-10"
          >
            <ScrollVelocity baseVelocity={1.6} className="py-2">
              {around.strip.map((name) => (
                <span key={name} className="flex items-center">
                  <span className="px-5 font-display text-[clamp(2rem,7vw,4.6rem)] leading-none text-cal sm:px-8">
                    {name}
                  </span>
                  <FobMark
                    ring={false}
                    fill="var(--color-latao)"
                    className="h-6 w-auto sm:h-9"
                    style={{ ["--sc-hole" as string]: "transparent" }}
                  />
                </span>
              ))}
            </ScrollVelocity>
          </div>
        </div>
      </div>

      <ul className="mx-auto mt-16 grid max-w-[84rem] gap-8 px-5 sm:mt-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:gap-10">
        {around.places.map((place) => {
          const photo = seteChavesPhotos[place.photo as SeteChavesPhotoId];
          return (
            <li
              key={place.name}
              data-card
              className="rounded-[0.6rem] bg-cal p-3 pb-5 shadow-[0_24px_40px_-26px_rgb(38_44_51/0.55)] will-change-transform"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.35rem] bg-areia">
                <Image
                  src={photo.src}
                  alt={place.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-baseline justify-between gap-3 px-2 pt-4">
                <h3 className="font-display text-[1.45rem] leading-tight">
                  {place.name}
                </h3>
                <span className="shrink-0 text-sm font-semibold text-latao-deep">
                  {place.distance}
                </span>
              </div>
              <p className="px-2 pt-1.5 text-[0.95rem] leading-relaxed text-tinta/75">
                {place.text}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
