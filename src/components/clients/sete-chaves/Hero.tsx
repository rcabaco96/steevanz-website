"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import { seteChaves } from "@/content/sete-chaves/facts";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { seteChavesSections } from "./sections";

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

/** Where the key tag ends up on this screen: its width, height and top-left corner, in px. */
function fobGeometry(width: number, height: number) {
  const w = Math.round(Math.min(width * 0.5, 300, height * 0.36));
  const h = Math.round(w * 1.58);
  const top = Math.round((height - h) / 2 - height * 0.03);
  const left = Math.round((width - w) / 2);
  return { w, h, top, left };
}

// The opening scene: the morning film — a linen curtain moving in the wind, the shadow of a chair on it — full screen
// (the poster frame is the first paint; a portrait cut on phones). Scrolling holds the scene (GSAP pin + scrub) while
// the film closes into the shape of the house's brass key tag, swings a little on its ring, and the line «Sete portas.
// Uma chave para cada uma.» settles under it. Reduced motion: the still frame, no pin. The film only plays on screen.
export function Hero() {
  const { hero } = copy;
  const media = seteChaves.media;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const motionOk = useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(reducedQuery).matches,
    () => false,
  );
  const portrait = useSyncExternalStore(
    subscribePortrait,
    () => window.matchMedia(portraitQuery).matches,
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
  }, [motionOk, portrait]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const geo = () => fobGeometry(window.innerWidth, el.clientHeight);
        const full = () => `inset(0px 0px 0px 0px round 0px 0px 0px 0px)`;
        const fob = () => {
          const { w, h, top, left } = geo();
          const bottom = el.clientHeight - top - h;
          return `inset(${top}px ${left}px ${bottom}px ${left}px round ${w / 2}px ${w / 2}px 22px 22px)`;
        };
        // The ring, the hole and the line under the tag, placed on the tag's final spot.
        const place = () => {
          const { w, h, top, left } = geo();
          gsap.set(q("[data-ghost]"), { width: w, height: h, top, left });
        };
        place();
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: place,
          },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: full },
          { clipPath: fob, ease: "power2.inOut", duration: 0.7 },
          0,
        )
          .fromTo(
            q("[data-film]"),
            { scale: 1 },
            { scale: 1.18, duration: 0.7 },
            0,
          )
          .to(
            q("[data-hero-copy]"),
            { yPercent: -18, opacity: 0, ease: "power1.in", duration: 0.32 },
            0,
          )
          .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.1 }, 0)
          .fromTo(
            q("[data-ring], [data-hole], [data-seven]"),
            { opacity: 0 },
            { opacity: 1, duration: 0.15 },
            0.58,
          )
          .fromTo(
            q("[data-tint]"),
            { opacity: 0 },
            { opacity: 0.62, duration: 0.25 },
            0.45,
          )
          // Once it is a key tag, it swings on its ring.
          .fromTo(
            q("[data-swing]"),
            { rotate: 0 },
            {
              rotate: -7,
              transformOrigin: () =>
                `${window.innerWidth / 2}px ${geo().top + geo().w * 0.3}px`,
              ease: "sine.inOut",
              duration: 0.35,
            },
            0.62,
          )
          .fromTo(
            q("[data-fob-line]"),
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.25 },
            0.7,
          )
          .to({}, { duration: 0.12 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const common = { alt: hero.alt, sizes: "100vw" };
  const {
    props: { srcSet: portraitSet },
  } = getImageProps({
    ...common,
    src: media.heroPortraitPoster,
    width: 720,
    height: 1280,
  });
  const {
    props: { srcSet: wideSet, ...img },
  } = getImageProps({
    ...common,
    src: media.heroPoster,
    width: 1280,
    height: 720,
    fetchPriority: "high",
    loading: "eager",
  });

  return (
    <section
      ref={root}
      aria-labelledby="sc-hero-title"
      className="relative isolate flex h-svh min-h-[580px] flex-col overflow-hidden bg-cal"
    >
      <div data-swing className="absolute inset-0 will-change-transform">
        {/* Behind the film: the key ring waiting above the tag (it shows once the film is a tag). */}
        <div
          data-ghost
          aria-hidden="true"
          className="pointer-events-none absolute"
        >
          <span
            data-ring
            className="absolute left-1/2 block aspect-square w-[62%] -translate-x-1/2 rounded-full border-[3px] border-latao opacity-0"
            style={{ top: "-19%" }}
          />
        </div>

        <div
          data-frame
          className="absolute inset-0 overflow-hidden bg-linho will-change-[clip-path]"
        >
          <div data-film className="absolute inset-0 will-change-transform">
            <picture>
              <source media={portraitQuery} srcSet={portraitSet} />
              <source srcSet={wideSet} />
              <img
                {...img}
                alt={hero.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
            {motionOk ? (
              <video
                key={portrait ? "portrait" : "wide"}
                ref={film}
                src={portrait ? media.heroPortrait : media.hero}
                poster={portrait ? media.heroPortraitPoster : media.heroPoster}
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(245_241_232/0.35)_0%,rgb(245_241_232/0)_30%,rgb(245_241_232/0.15)_55%,rgb(245_241_232/0.92)_100%)]" />
          {/* As it becomes a key tag, the film takes the brass of the tag. */}
          <div data-tint className="sc-brass absolute inset-0 opacity-0" />
        </div>
        {/* The hole for the ring, punched through the tag. */}
        <div
          data-ghost
          aria-hidden="true"
          className="@container pointer-events-none absolute"
        >
          <span
            data-seven
            className="absolute inset-x-0 top-[44%] block text-center font-display text-[62cqw] leading-none text-xisto/85 opacity-0"
          >
            7
          </span>
          <span
            data-hole
            className="absolute left-1/2 block aspect-square w-[22%] -translate-x-1/2 rounded-full bg-cal opacity-0 shadow-[inset_0_2px_3px_rgb(0_0_0/0.25)] ring-1 ring-latao"
            style={{ top: "13%" }}
          />
        </div>
      </div>

      <p
        data-fob-line
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[6%] px-6 text-center opacity-0 [@media(max-height:640px)]:bottom-[3%]"
      >
        <span className="sc-label block text-latao-deep">{hero.fob}</span>
        <span className="mt-2 block font-display text-[clamp(1.35rem,4.6vw,2.2rem)] leading-tight text-tinta">
          {hero.fobLine}
        </span>
      </p>

      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[84rem] flex-1 flex-col justify-end px-5 pt-24 pb-14 sm:px-8 sm:pb-20 [@media(max-height:700px)]:pb-8"
      >
        <p className="sc-label sc-rise text-latao-deep [animation-delay:150ms]">
          {hero.kicker}
        </p>
        <h1
          id="sc-hero-title"
          className="sc-rise mt-4 max-w-[13ch] font-display text-[clamp(2.6rem,10vw,6.4rem)] leading-[0.95] tracking-[-0.02em] text-tinta [animation-delay:300ms]"
        >
          {hero.title}
        </h1>
        <p className="sc-rise mt-5 max-w-md text-[1.02rem] leading-relaxed text-tinta/80 sm:text-[1.1rem] [animation-delay:480ms]">
          {hero.lead}
        </p>
        <div className="sc-rise mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center [animation-delay:640ms] [@media(max-height:700px)]:mt-5">
          <Magnet className="w-full min-[420px]:w-auto">
            <a
              href={`#${seteChavesSections.book}`}
              className="sc-brass inline-flex h-14 w-full items-center justify-center gap-3 rounded-full px-7 text-[0.85rem] font-semibold tracking-[0.12em] text-tinta uppercase shadow-[0_16px_34px_-16px_rgb(38_44_51/0.6),inset_0_-2px_0_rgb(0_0_0/0.15)] transition-[filter] hover:brightness-110 min-[420px]:w-auto"
            >
              {hero.book}
              <ArrowIcon width={18} height={18} />
            </a>
          </Magnet>
          <a
            href={`#${seteChavesSections.rooms}`}
            className="inline-flex h-14 items-center justify-center rounded-full bg-cal/60 px-7 text-[0.85rem] font-semibold tracking-[0.12em] text-tinta uppercase ring-1 ring-tinta/25 backdrop-blur-sm transition-colors hover:bg-cal"
          >
            {hero.rooms}
          </a>
        </div>
        <p className="sc-rise mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-cal/70 px-3 py-1.5 text-[0.72rem] text-tinta/75 [animation-delay:800ms]">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-mancha"
          />
          {copy.demo}
        </p>
      </div>

      <div
        data-hero-cue
        className="pointer-events-none absolute right-6 bottom-8 z-10 hidden sm:block [@media(max-height:820px)]:hidden"
      >
        <a
          href={`#${seteChavesSections.rooms}`}
          className="sc-rise pointer-events-auto flex flex-col items-center gap-2 text-[0.65rem] tracking-[0.3em] text-tinta/70 uppercase [animation-delay:1200ms]"
        >
          {hero.scroll}
          <span
            aria-hidden="true"
            className="relative block h-12 w-px bg-tinta/25"
          >
            <span className="sc-cue absolute -left-[3px] top-0 block h-3 w-[7px] rounded-t-full rounded-b-[2px] bg-latao" />
          </span>
        </a>
      </div>
    </section>
  );
}
