"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { dolci, flavours, type DolciCopy, type DolciLocale } from "@/content/dolci-salati";
import { CircleText } from "./CircleText";
import styles from "./dolci.module.css";

// The first screen. Everything a visitor needs (name, tagline, «Ver o menu») is server-rendered and
// animated in by CSS, so it shows before any JavaScript runs. Once hydrated, the stage tilts in 3D
// (mouse on a computer, the phone's tilt on Android) and the flavour chips recolour the moving
// background, a WebGL swirl that loads only when the page is idle and never with reduced motion.

const GelatoShader = dynamic(() => import("./GelatoShader"), { ssr: false });

const sprinkles = [
  { left: "8%", top: "34%", w: 18, h: 6, color: "var(--dz-berry)", z: 120, rot: -28, d: "0ms" },
  { left: "86%", top: "22%", w: 14, h: 6, color: "var(--dz-pista-deep)", z: 70, rot: 35, d: "900ms" },
  { left: "80%", top: "70%", w: 10, h: 10, color: "var(--dz-cone)", z: 140, rot: 0, d: "1800ms" },
  { left: "16%", top: "74%", w: 9, h: 9, color: "var(--dz-c2)", z: 40, rot: 0, d: "2600ms" },
  { left: "50%", top: "8%", w: 16, h: 5, color: "var(--dz-cone)", z: 20, rot: 70, d: "1300ms" },
];

interface HeroProps {
  copy: DolciCopy;
  locale: DolciLocale;
}

export function Hero({ copy, locale }: HeroProps) {
  const [flavourId, setFlavourId] = useState<string>(flavours[0].id);
  const [shader, setShader] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0, frame: 0 });
  const kickRef = useRef<() => void>(() => {});
  const flavour = flavours.find((item) => item.id === flavourId) ?? flavours[0];

  // The swirl: only when the page is idle, motion is welcome, data isn't being saved and the device isn't tiny.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (reduced || nav.connection?.saveData || (nav.deviceMemory !== undefined && nav.deviceMemory < 2)) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setShader(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setShader(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  // 3D tilt, eased every frame towards the pointer (or the phone's tilt), written straight to the style.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = tilt.current;
    const step = () => {
      state.x += (state.tx - state.x) * 0.08;
      state.y += (state.ty - state.y) * 0.08;
      stage.style.setProperty("--rx", `${state.x.toFixed(2)}deg`);
      stage.style.setProperty("--ry", `${state.y.toFixed(2)}deg`);
      if (Math.abs(state.tx - state.x) > 0.01 || Math.abs(state.ty - state.y) > 0.01) state.frame = requestAnimationFrame(step);
      else state.frame = 0;
    };
    const kick = () => {
      if (!state.frame) state.frame = requestAnimationFrame(step);
    };
    kickRef.current = kick;

    // Android gives the phone's tilt without asking; iPhones ask for permission, so they keep the float.
    let base: { beta: number; gamma: number } | null = null;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      base ??= { beta: event.beta, gamma: event.gamma };
      state.ty = Math.max(-12, Math.min(12, (event.gamma - base.gamma) * 0.5));
      state.tx = Math.max(-10, Math.min(10, -(event.beta - base.beta) * 0.4));
      kick();
    };
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let listening = false;
    const visibility = new IntersectionObserver(([entry]) => {
      if (!coarse) return;
      if (entry.isIntersecting && !listening) {
        window.addEventListener("deviceorientation", onOrientation);
        listening = true;
      } else if (!entry.isIntersecting && listening) {
        window.removeEventListener("deviceorientation", onOrientation);
        listening = false;
      }
    });
    visibility.observe(stage);
    return () => {
      visibility.disconnect();
      window.removeEventListener("deviceorientation", onOrientation);
      cancelAnimationFrame(state.frame);
    };
  }, []);

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    tilt.current.ty = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    tilt.current.tx = -((event.clientY - rect.top) / rect.height - 0.5) * 14;
    kickRef.current();
  };
  const onPointerLeave = () => {
    tilt.current.tx = 0;
    tilt.current.ty = 0;
    kickRef.current();
  };

  const colourVars = { "--dz-c1": flavour.colors[0], "--dz-c2": flavour.colors[1], "--dz-c3": flavour.colors[2] } as CSSProperties;

  return (
    <section id="inicio" aria-labelledby="dz-title" className="relative isolate overflow-hidden" style={colourVars}>
      <div className={`absolute inset-0 -z-10 ${styles.heroBackdrop}`} aria-hidden="true" />
      {shader ? <GelatoShader colors={flavour.colors} className="absolute inset-0 -z-10 h-full w-full" /> : null}
      {/* A cream veil where the text sits, so it reads on any flavour. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-[var(--dz-bg)] via-[color-mix(in_oklab,var(--dz-bg)_55%,transparent)] to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl gap-x-10 px-4 pt-20 pb-10 sm:px-8 sm:pt-24 lg:min-h-[min(100svh,860px)] lg:grid-cols-[1fr_1.15fr] lg:items-center lg:pb-16">
        <p className={`${styles.rise} flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.68rem] font-semibold tracking-[0.18em] text-[var(--dz-ink-2)] uppercase lg:col-start-1 lg:row-start-1 lg:self-end lg:justify-start`}>
          <span>{copy.hero.eyebrow}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dz-berry)]" />
            {copy.hero.location}
          </span>
        </p>

        {/* The 3D stage: the name in two layers with the cup between them. */}
        <div
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mt-4 h-[clamp(270px,44svh,400px)] [perspective:900px] sm:h-[460px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:h-[600px]"
        >
          <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]">
            <h1 id="dz-title" className="display absolute inset-0 m-0 text-[clamp(4.1rem,22vw,7.5rem)] leading-[0.86] tracking-[-0.045em] text-[var(--dz-ink)] [transform-style:preserve-3d] sm:text-[8.5rem] lg:text-[10rem]">
              <span className="absolute top-0 left-0 [transform:translateZ(-30px)]">
                <span className={styles.wordMask}>
                  <span className={styles.wordIn} style={{ "--d": "80ms" } as CSSProperties}>
                    Dolci
                  </span>
                </span>
              </span>
              <span className="display-italic absolute top-[34%] left-[2%] text-[0.36em] text-[var(--dz-berry)] [transform:translateZ(20px)]">
                <span className={styles.rise} style={{ "--d": "420ms" } as CSSProperties}>
                  e
                </span>
              </span>
              <span className="absolute right-0 bottom-0 [transform:translateZ(70px)]">
                <span className={styles.wordMask}>
                  <span className={styles.wordIn} style={{ "--d": "220ms" } as CSSProperties}>
                    Salati<span className="text-[var(--dz-berry)]">.</span>
                  </span>
                </span>
              </span>
            </h1>

            <div className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(84%,330px)] text-[var(--dz-ink)] opacity-45 lg:w-[440px]" style={{ transform: "translate(-50%,-50%) translateZ(10px)" }}>
              <CircleText id="dz-hero-ring" text={copy.hero.ring} className="h-full w-full" />
            </div>

            <div className="absolute top-1/2 left-1/2 w-[min(52%,215px)] lg:w-[290px]" style={{ transform: "translate(-50%,-50%) translateZ(30px)" }}>
              <div className={styles.cupIn}>
                <div className={styles.float}>
                  <Image
                    src={dolci.cup}
                    alt={copy.hero.cupAlt}
                    width={1085}
                    height={1450}
                    sizes="(min-width: 1024px) 290px, (min-width: 640px) 215px, 52vw"
                    loading="eager"
                    fetchPriority="high"
                    className="h-auto w-full drop-shadow-[0_28px_30px_rgb(var(--dz-shadow)/0.28)]"
                  />
                </div>
              </div>
            </div>

            {sprinkles.map((s, i) => (
              <span key={i} aria-hidden="true" className="absolute" style={{ left: s.left, top: s.top, transform: `translateZ(${s.z}px)` }}>
                <span className={styles.sprinkle} style={{ width: s.w, height: s.h, background: s.color, rotate: `${s.rot}deg`, "--d": s.d } as CSSProperties} />
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-4 lg:col-start-1 lg:row-start-2 lg:mt-6">
          <p className={`${styles.rise} display max-w-md text-[1.6rem] leading-[1.12] text-[var(--dz-ink)] sm:text-4xl`} style={{ "--d": "300ms" } as CSSProperties}>
            {copy.hero.tagline}
          </p>
          <p className={`${styles.rise} display-italic mt-2 text-lg text-[var(--dz-berry)]`} style={{ "--d": "380ms" } as CSSProperties}>
            {copy.hero.note}
          </p>

          <div className={`${styles.rise} mt-6 flex flex-wrap items-center gap-3`} style={{ "--d": "460ms" } as CSSProperties}>
            <Link
              href={dolci.menu}
              data-menu-cta
              className={`${styles.shine} group inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--dz-cta-bg)] py-2 pr-6 pl-2 text-[var(--dz-cta-fg)] shadow-[0_18px_40px_-18px_rgb(var(--dz-shadow)/0.6)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.97]`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--dz-dot)] text-[var(--dz-dot-fg)] transition-transform duration-500 group-hover:rotate-[360deg]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                </svg>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-semibold">{copy.hero.menu}</span>
                <span className="text-xs opacity-75">{copy.hero.menuHint}</span>
              </span>
            </Link>
            <a
              href={dolci.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--dz-line)] bg-[color-mix(in_oklab,var(--dz-surface)_70%,transparent)] px-5 text-sm font-semibold text-[var(--dz-ink)] backdrop-blur transition-colors hover:border-[var(--dz-ink)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              {copy.hero.directions}
              <span className="sr-only"> ({copy.newTab})</span>
            </a>
          </div>
        </div>

        <div className={`${styles.rise} relative mt-7 lg:col-start-1 lg:row-start-3 lg:mt-8 lg:self-start`} style={{ "--d": "560ms" } as CSSProperties}>
          <p id="dz-flavours" className="text-[0.68rem] font-semibold tracking-[0.18em] text-[var(--dz-ink-2)] uppercase">
            {copy.hero.flavourLabel}
          </p>
          <div role="group" aria-labelledby="dz-flavours" className="mt-3 flex flex-wrap gap-2">
            {flavours.map((item) => {
              const active = item.id === flavourId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFlavourId(item.id)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
                    active
                      ? "border-transparent bg-[var(--dz-ink)] text-[var(--dz-bg)] shadow-[0_10px_24px_-14px_rgb(var(--dz-shadow)/0.7)]"
                      : "border-[var(--dz-line)] bg-[color-mix(in_oklab,var(--dz-surface)_65%,transparent)] text-[var(--dz-ink)] backdrop-blur hover:-translate-y-0.5"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 rounded-full ring-2 ring-white/70 transition-transform duration-500 ${active ? "scale-125" : ""}`}
                    style={{ background: `radial-gradient(circle at 35% 30%, ${item.colors[0]}, ${item.colors[1]} 55%, ${item.colors[2]})` }}
                  />
                  {item[locale]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
