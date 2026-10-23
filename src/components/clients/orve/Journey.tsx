"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orve, orvePhotos } from "@/content/orve/facts";
import { orveSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The wave the drop travels along (viewBox 1000 × 200), and the drop's height on it at a given progress. */
const waveY = (p: number) => 100 - 64 * Math.sin(4 * Math.PI * p);
const wavePath = Array.from({ length: 101 }, (_, i) => `${i === 0 ? "M" : "L"}${i * 10} ${waveY(i / 100).toFixed(2)}`).join(" ");

// The house ritual in four times (60 minutes in all). Large screens: the scene holds still while a copper wave is
// drawn and a drop travels along it; as the drop reaches each crest, that step lights up, its picture opening out of
// a point, and the minutes count up. Phones: the steps go down a thread that fills, the drop riding its end. The
// steam step plays a short film. Reduced motion: everything in place, the full 60 minutes shown.
export function Journey({ copy }: { copy: OrveCopy }) {
  const { journey } = copy;
  const root = useRef<HTMLElement>(null);
  const steamRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);
  const cumulative = journey.steps.reduce<number[]>((acc, s) => [...acc, (acc.at(-1) ?? 0) + s.minutes], []);
  const total = cumulative.at(-1) ?? 0;

  useEffect(() => {
    if (!motionOk) return;
    const videos = steamRefs.current.filter((v): v is HTMLVideoElement => Boolean(v));
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const v = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      }
    });
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [motionOk]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const counterEls = q("[data-counter]") as HTMLElement[];
      const shown = { v: 0 };
      let reached = -2;
      const reach = (n: number) => {
        if (n === reached) return;
        reached = n;
        const target = n < 0 ? 0 : cumulative[n];
        gsap.to(shown, {
          v: target,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => counterEls.forEach((c) => (c.textContent = String(Math.round(shown.v)))),
        });
        q("[data-step]").forEach((step) => step.classList.toggle("is-on", Number(step.dataset.index) <= n));
      };

      mm.add("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)", () => {
        reach(-1);
        el.classList.add("is-armed");
        const band = q("[data-band]")[0] as HTMLElement;
        const drop = q("[data-wave-drop]")[0] as HTMLElement;
        const frames = q("[data-lg-frame]");
        gsap.set(frames, { clipPath: "circle(0% at 50% 50%)" });
        const proxy = { p: 0 };
        const place = () => {
          const w = band.clientWidth;
          const h = band.clientHeight;
          gsap.set(drop, { x: proxy.p * w, y: (waveY(proxy.p) / 200) * h });
          const n = Math.floor(proxy.p * 4 - 0.5 + 1e-6);
          reach(Math.min(3, n));
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(q("[data-wave]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0).fromTo(proxy, { p: 0 }, { p: 1, duration: 1, onUpdate: place }, 0);
        frames.forEach((frame, i) => {
          tl.to(frame, { clipPath: "circle(71% at 50% 50%)", duration: 0.12, ease: "power2.out" }, (i + 0.5) / 4 - 0.02);
        });
        tl.to({}, { duration: 0.08 });
        place();
        return () => el.classList.remove("is-armed");
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 639px) and (prefers-reduced-motion: no-preference)", () => {
        reach(-1);
        const list = q("[data-list]")[0] as HTMLElement;
        gsap.fromTo(q("[data-thread]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.5 } });
        gsap.fromTo(
          q("[data-thread-drop]"),
          { y: 0 },
          { y: () => list.clientHeight, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.5, invalidateOnRefresh: true } },
        );
        q("[data-sm-frame]").forEach((frame, i) => {
          gsap.fromTo(
            frame,
            { clipPath: "circle(8% at 50% 50%)" },
            {
              clipPath: "circle(71% at 50% 50%)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 85%",
                end: "top 45%",
                scrub: 0.5,
                onEnter: () => reach(i),
                onLeaveBack: () => reach(i - 1),
              },
            },
          );
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => reach(3));
      return () => mm.revert();
    },
    { scope: root },
  );

  const media = (step: (typeof journey.steps)[number], i: number, sizes: string) =>
    step.image === "vaporVideo" ? (
      <>
        <Image src={orve.media.vaporPoster} alt={step.alt} width={720} height={720} sizes={sizes} className="absolute inset-0 h-full w-full object-cover" />
        {motionOk ? (
          <video
            ref={(node) => {
              steamRefs.current[i] = node;
            }}
            src={orve.media.vapor}
            poster={orve.media.vaporPoster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </>
    ) : (
      <Image
        src={orvePhotos[step.image].src}
        alt={step.alt}
        width={orvePhotos[step.image].width}
        height={orvePhotos[step.image].height}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );

  return (
    <section ref={root} id={orveSections.ritual} aria-labelledby="or-journey-title" className="or-on-dark relative overflow-hidden bg-cacau text-nacar lg:flex lg:h-svh lg:min-h-[640px] lg:flex-col">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_10%,rgb(154_74_46/0.25),transparent_70%)]" />
      <div className="relative mx-auto w-full max-w-[84rem] px-5 pt-24 sm:px-8 sm:pt-32 lg:pt-[max(6rem,12svh)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="or-label mb-5 flex items-center gap-4 text-argila">
              <span aria-hidden="true" className="h-px w-10 bg-argila/60" />
              {journey.eyebrow}
            </p>
            <h2 id="or-journey-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.95]">
              {journey.title} <span className="text-argila italic">{journey.titleItalic}</span>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-nacar/75">{journey.intro}</p>
          </div>
          <p className="flex items-baseline gap-3" aria-label={`${total} ${journey.counter}`}>
            <span aria-hidden="true" data-counter className="font-display text-[clamp(4rem,12vw,7.5rem)] leading-none text-argila tabular-nums">
              {total}
            </span>
            <span aria-hidden="true" className="or-label text-nacar/70">
              / {total} {journey.counter}
            </span>
          </p>
        </div>
      </div>

      {/* Large screens: the wave, the drop and the four steps in a row. */}
      <div className="relative mx-auto hidden w-full max-w-[84rem] flex-1 flex-col justify-center px-8 pb-10 [@media(min-width:1024px)_and_(min-height:640px)]:flex">
        <div data-band aria-hidden="true" className="relative h-[clamp(5rem,13svh,8rem)] w-full">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <path d={wavePath} fill="none" stroke="rgb(245 239 232 / 0.14)" strokeWidth="1.5" />
            <path data-wave d={wavePath} fill="none" stroke="var(--color-argila)" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
          </svg>
          <span data-wave-drop className="absolute top-0 left-0 -mt-[11px] -ml-[8px] block h-[22px] w-4 will-change-transform">
            <svg viewBox="0 0 24 30" className="size-full text-argila">
              <path d="M12 0c5 7 9 12 9 18a9 9 0 1 1-18 0c0-6 4-11 9-18Z" fill="currentColor" />
            </svg>
          </span>
        </div>
        <ol className="mt-8 grid grid-cols-4 gap-8">
          {journey.steps.map((step, i) => (
            <li key={step.title} data-step data-index={i} className="transition-opacity duration-500 [.is-armed_&:not(.is-on)]:opacity-40">
              <div data-lg-frame className="or-bead relative mx-auto aspect-square w-[min(100%,28svh)] overflow-hidden rounded-full bg-cacau-2">
                {media(step, i, "(min-width: 1024px) 20vw, 1px")}
              </div>
              <h3 className="mt-6 flex items-baseline gap-3 font-display text-[1.7rem] leading-tight">
                <span className="font-sans text-xs tracking-[0.2em] text-argila">0{i + 1}</span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-argila">{step.minutes} min</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-nacar/75">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Phones, short screens and reduced motion: the steps down a thread. */}
      <div className="relative mx-auto w-full max-w-[40rem] px-5 pt-14 pb-24 sm:px-8 [@media(min-width:1024px)_and_(min-height:640px)]:hidden">
        <ol data-list className="relative flex flex-col gap-16 pl-10">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[11px] w-px bg-nacar/15">
            <span data-thread className="block h-full w-full origin-top bg-argila" />
          </span>
          <span data-thread-drop aria-hidden="true" className="absolute top-0 left-[4px] -mt-3 block h-[22px] w-4 will-change-transform motion-reduce:hidden">
            <svg viewBox="0 0 24 30" className="size-full text-argila">
              <path d="M12 0c5 7 9 12 9 18a9 9 0 1 1-18 0c0-6 4-11 9-18Z" fill="currentColor" />
            </svg>
          </span>
          {journey.steps.map((step, i) => (
            <li key={step.title} data-step data-index={i} className="relative">
              <h3 className="flex items-baseline gap-3 font-display text-[1.9rem] leading-tight">
                <span className="font-sans text-xs tracking-[0.2em] text-argila">0{i + 1}</span>
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-argila">{step.minutes} min</p>
              <div data-sm-frame className="or-bead relative mt-5 aspect-square w-[min(72vw,20rem)] overflow-hidden rounded-full bg-cacau-2">
                {media(step, i + 4, "(max-width: 1023px) 72vw, 1px")}
              </div>
              <p className="mt-5 leading-relaxed text-nacar/75">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-14 font-display text-xl text-nacar/90 italic">
          {journey.price} <span className="font-sans text-xs tracking-[0.12em] text-nacar/60 not-italic">{copy.rituals.plusVat}</span>
        </p>
      </div>
    </section>
  );
}
