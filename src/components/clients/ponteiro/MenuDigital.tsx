"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro } from "@/content/ponteiro/facts";
import { ArrowIcon } from "./icons";
import { ponteiroSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// The «Menu digital» at the table. A phone lies flat on the marble like one put down by a guest; as the page scrolls
// it rises upright, playing a recording of a live Steevanz demo menu (dish videos running), while the sentence that
// explains it lights up word by word (React Bits' ScrollReveal idea, done with GSAP scrub). Wide screens hold the
// scene (pin); phones play it as they pass. Reduced motion: the phone upright, the sentence lit, the still frame.
export function MenuDigital({ copy }: { copy: PonteiroCopy }) {
  const { menu } = copy;
  const root = useRef<HTMLElement>(null);
  const words = menu.sentence.split(" ");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const build = (pin: boolean) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? { trigger: el, start: "top top", end: "+=130%", pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true }
            : { trigger: q("[data-phone-stage]")[0], start: "top 95%", end: "center 45%", scrub: 0.6 },
        });
        tl.fromTo(
          q("[data-phone]"),
          { rotateX: 58, rotateZ: -14, y: 60, scale: 0.86 },
          { rotateX: 0, rotateZ: 0, y: 0, scale: 1, ease: "power2.out", duration: 1 },
          0,
        ).fromTo(q("[data-phone-shadow]"), { opacity: 0.9, scaleY: 1 }, { opacity: 0.35, scaleY: 0.5, duration: 1 }, 0);
        if (pin) {
          tl.fromTo(q("[data-word]"), { opacity: 0.16 }, { opacity: 1, stagger: 0.03, duration: 0.2 }, 0.05).fromTo(
            q("[data-point]"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.25 },
            0.6,
          );
          tl.to({}, { duration: 0.2 });
        } else {
          gsap.fromTo(
            q("[data-word]"),
            { opacity: 0.16 },
            { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: q("[data-sentence]")[0], start: "top 85%", end: "bottom 50%", scrub: 0.5 } },
          );
        }
      };
      mm.add("(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => build(true));
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 679px) and (prefers-reduced-motion: no-preference)", () => build(false));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={ponteiroSections.menu} aria-labelledby="pn-menu-title" className="relative overflow-hidden bg-marmore lg:flex lg:h-svh lg:min-h-[680px] lg:items-center">
      <div className="mx-auto grid w-full max-w-[84rem] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-0">
        <div>
          <p className="pn-label mb-5 flex items-center gap-4 text-ginja">
            <span aria-hidden="true" className="h-px w-10 bg-ginja/50" />
            {menu.eyebrow}
          </p>
          <h2 id="pn-menu-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.92]">
            {menu.title} <span className="text-ginja italic">{menu.titleItalic}</span>
          </h2>
          <p data-sentence className="mt-6 max-w-xl text-[1.2rem] leading-relaxed sm:text-[1.45rem] sm:leading-snug">
            {words.map((word, i) => (
              <span key={i} data-word>
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          {/* Phones: the phone comes right after the words. */}
          <PhoneStage className="mt-12 lg:hidden" label={menu.phoneLabel} />

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {menu.points.map((point) => (
              <li key={point.title} data-point className="border-t border-tinta/15 pt-4">
                <p className="font-semibold">{point.title}</p>
                <p className="mt-1 text-[0.92rem] leading-relaxed text-tinta/70">{point.text}</p>
              </li>
            ))}
          </ul>
          <a
            href={ponteiro.menuDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-tinta px-7 py-3 font-semibold text-papel transition-colors hover:bg-ginja"
          >
            {menu.button}
            <ArrowIcon width={18} height={18} />
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-cinza">{menu.note}</p>
        </div>

        <PhoneStage className="hidden lg:block" label={menu.phoneLabel} />
      </div>
    </section>
  );
}

/** A phone playing the recording of the demo menu (only while on screen; never with reduced motion). */
function PhoneStage({ className, label }: { className: string; label: string }) {
  const media = ponteiro.media;
  const video = useRef<HTMLVideoElement>(null);
  const play = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useEffect(() => {
    const el = video.current;
    if (!el || !play) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    <div data-phone-stage className={`relative mx-auto w-[min(68vw,18.5rem)] [perspective:1100px] lg:w-[min(24vw,21rem)] ${className}`}>
      <div data-phone-shadow aria-hidden="true" className="absolute inset-x-[8%] -bottom-6 h-10 rounded-[50%] bg-tinta/30 blur-xl" />
      <div data-phone className="relative aspect-[9/19] rounded-[2.6rem] bg-tinta p-[9px] shadow-[0_40px_80px_-40px_rgb(26_23_20/0.7)] will-change-transform [transform-style:preserve-3d]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-papel">
          {/* eslint-disable-next-line @next/next/no-img-element -- the recording's first frame, under the film */}
          <img src={media.menuPhonePoster} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          {play ? (
            <video ref={video} src={media.menuPhone} poster={media.menuPhonePoster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <span aria-hidden="true" className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-tinta" />
        </div>
      </div>
    </div>
  );
}
