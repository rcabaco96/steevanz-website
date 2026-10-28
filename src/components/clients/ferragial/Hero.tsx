"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragial } from "@/content/ferragial/facts";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { ferragialSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const portraitQuery = "(orientation: portrait) and (max-width: 900px)";
const subscribe = (query: string) => (onChange: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};
const subscribeMotion = subscribe(reducedQuery);
const subscribePortrait = subscribe(portraitQuery);

/** Where the horizon sits in the film (percent of its height): the line the scene closes onto. */
const HORIZON = 62;

// The opening scene: the vineyard at sunrise, full screen (the poster frame is the first paint; a portrait cut on
// phones). Scrolling holds the scene (GSAP pin + scrub) while the film closes from the sky and from the earth onto its
// own horizon — a letterbox narrowing to a single bright line — and on that line, now on lime-wash white, half a sun of
// fired clay rises and one sentence settles under it. The signature of the site: everything opens and closes along
// the horizon. Reduced motion: the still frame, no pin. The film only plays while on screen.
export function Hero({ copy }: { copy: FerragialCopy }) {
  const { hero } = copy;
  const m = ferragial.media;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);
  const portrait = useSyncExternalStore(subscribePortrait, () => window.matchMedia(portraitQuery).matches, () => false);

  useEffect(() => {
    const el = film.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk, portrait]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=120%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: `inset(${HORIZON - 0.35}% 0% ${100 - HORIZON - 0.35}% 0%)`, ease: "power2.inOut", duration: 0.62 },
          0,
        )
          .fromTo(q("[data-film]"), { scale: 1 }, { scale: 1.16, duration: 0.62 }, 0)
          .to(q("[data-hero-copy]"), { y: -60, opacity: 0, ease: "power1.in", duration: 0.32 }, 0)
          .fromTo(q("[data-sun]"), { x: 0, y: 0, xPercent: -50, yPercent: 100 }, { x: 0, y: 0, xPercent: -50, yPercent: 48, ease: "power2.out", duration: 0.35 }, 0.5)
          .fromTo(q("[data-horizon-line]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25 }, 0.68)
          .fromTo(q("[data-horizon-tag]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.62)
          .to({}, { duration: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt: hero.alt, sizes: "100vw" };
  const {
    props: { srcSet: portraitSet },
  } = getImageProps({ ...common, src: m.heroPortraitPoster, width: 540, height: 960 });
  const {
    props: { srcSet: wideSet, ...img },
  } = getImageProps({ ...common, src: m.heroPoster, width: 1600, height: 900, fetchPriority: "high", loading: "eager" });

  return (
    <section ref={root} aria-labelledby="fg-hero-title" className="relative isolate flex h-svh min-h-[580px] flex-col overflow-hidden bg-cal text-cal">
      {/* Behind the film: the horizon on lime-wash, waiting for the sun and the sentence. */}
      <div aria-hidden="true" className="fg-cal pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: `${HORIZON}%` }}>
          <p data-horizon-tag className="fg-label absolute inset-x-0 top-[22%] text-center text-pedra opacity-0">
            {copy.opening.line}
          </p>
          <span
            data-sun
            style={{ transform: "translate(-50%, 100%)" }}
            className="absolute bottom-0 left-1/2 block aspect-square w-[min(46vw,34svh)] rounded-full bg-[radial-gradient(circle_at_50%_30%,var(--color-barro-2),var(--color-barro)_62%)]"
          />
        </div>
        <span className="absolute inset-x-0 block h-px bg-tinta/40" style={{ top: `${HORIZON}%` }} />
        <p
          data-horizon-line
          className="absolute inset-x-0 mx-auto max-w-[22ch] px-6 text-center font-display text-[clamp(1.5rem,5.4vw,2.8rem)] leading-[1.12] text-tinta opacity-0"
          style={{ top: `calc(${HORIZON}% + 1.6rem)` }}
        >
          {hero.horizon}
        </p>
      </div>

      <div data-frame className="absolute inset-0 overflow-hidden bg-xisto will-change-[clip-path]">
        <div data-film className="absolute inset-0 will-change-transform">
          <picture>
            <source media={portraitQuery} srcSet={portraitSet} />
            <source srcSet={wideSet} />
            <img {...img} alt={hero.alt} className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          {motionOk ? (
            <video
              key={portrait ? "portrait" : "wide"}
              ref={film}
              src={portrait ? m.heroPortrait : m.hero}
              poster={portrait ? m.heroPortraitPoster : m.heroPoster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-hidden="true"
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(30_26_25/0.55)_0%,rgb(30_26_25/0.1)_30%,rgb(30_26_25/0.15)_55%,rgb(30_26_25/0.88)_100%)]" />
      </div>

      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pt-24 pb-10 sm:px-8 sm:pb-14 lg:pb-16 [@media(max-height:700px)]:pt-20 [@media(max-height:700px)]:pb-6"
      >
        <p className="fg-label fg-rise mb-auto pt-4 text-cal/90 [animation-delay:150ms] sm:pt-8">{hero.kicker}</p>
        <h1
          id="fg-hero-title"
          className="fg-rise max-w-[13ch] font-display text-[clamp(2.5rem,10.5vw,6.6rem)] leading-[0.98] tracking-[-0.015em] [animation-delay:350ms] [@media(max-height:700px)]:text-[clamp(2.2rem,9vw,4.6rem)]"
        >
          <span className="sr-only">{ferragial.fullName}: </span>
          {hero.title}
        </h1>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between [@media(max-height:700px)]:mt-4">
          <p className="fg-rise max-w-md text-[1rem] leading-relaxed text-cal/88 [animation-delay:550ms] sm:text-[1.08rem]">{hero.lead}</p>
          <div className="fg-rise flex flex-wrap items-center gap-3 [animation-delay:700ms]">
            <Magnet>
              <a
                href={`#${ferragialSections.book}`}
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-barro px-6 text-[0.8rem] font-semibold tracking-[0.12em] text-cal uppercase shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-tinto"
              >
                {hero.book}
                <ArrowIcon width={17} height={17} />
              </a>
            </Magnet>
            <a
              href={`#${ferragialSections.wines}`}
              className="inline-flex h-13 items-center rounded-full px-6 text-[0.8rem] font-semibold tracking-[0.12em] uppercase ring-1 ring-cal/60 backdrop-blur-sm transition-colors hover:bg-cal/10"
            >
              {hero.shop}
            </a>
          </div>
        </div>
        <p className="fg-rise mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-xisto/45 px-3 py-1.5 text-[0.7rem] tracking-[0.06em] text-cal/85 [animation-delay:900ms] [@media(max-height:700px)]:mt-4">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-palha" />
          {copy.demo}
        </p>
      </div>

    </section>
  );
}
