"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import { NeutralToneMapping } from "three";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  CHAPTER_SPAN,
  STEPS,
  about,
  finale,
  intro,
  modules,
} from "./chapters";
import { smoothstep } from "./flowerAssets";
import { FlowerScene, type ExperienceState } from "./FlowerScene";
import { Loader } from "./Loader";
import { ProductSheet } from "./ProductSheet";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function Words({ lines }: { lines: string[] }) {
  let index = 0;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="lab-line">
          {line.split(" ").map((word) => {
            const i = index++;
            return (
              <span
                key={`${word}-${i}`}
                className="lab-word"
                style={{ "--i": i } as CSSProperties}
              >
                <span className="lab-word-inner">{word}</span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

/** Writes a CSS variable only when its value actually changed (avoids style recalcs). */
function setVar(el: HTMLElement, name: string, value: string) {
  if (el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
}

const ABOUT_STEP = 1;
const FIRST_MODULE_STEP = 2;
const FINALE_STEP = CHAPTER_SPAN;

export function FlowerExperience() {
  const state = useRef<ExperienceState>({
    progress: 0,
    target: 0,
    pointer: { x: 0, y: 0 },
    revealed: false,
    revealAt: -1,
  });
  const [sceneReady, setSceneReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Lighter 3D on phones and small/weak devices; drops further if frames suffer.
  // (Only affects the canvas internals, never the server-rendered markup.)
  const [lite] = useState(
    () => typeof window !== "undefined" && (window.matchMedia("(max-width: 760px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4),
  );
  const [dpr, setDpr] = useState(lite ? 1.25 : 1.5);
  const lenis = useRef<Lenis | null>(null);
  const section = useRef<HTMLElement>(null);
  const stepEls = useRef<(HTMLElement | null)[][]>([]);
  const heroEl = useRef<HTMLDivElement>(null);
  const hintEl = useRef<HTMLDivElement>(null);
  const overlayEl = useRef<HTMLDivElement>(null);
  const indexEls = useRef<(HTMLButtonElement | null)[]>([]);
  const timelineEl = useRef<HTMLElement>(null);

  /** Scroll position (px) of a timeline step inside the pinned section. */
  const stepScroll = useCallback((step: number) => {
    const el = section.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top + (step / CHAPTER_SPAN) * (el.offsetHeight - window.innerHeight);
  }, []);

  const goTo = useCallback(
    (step: number) => {
      lenis.current?.scrollTo(stepScroll(step), {
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    },
    [stepScroll],
  );

  const onSceneReady = useCallback(() => setSceneReady(true), []);

  /** A product page opened over the homepage: pause the page scroll underneath. */
  const onSheetChange = useCallback((open: boolean) => {
    setSheetOpen(open);
    if (open) lenis.current?.stop();
    else lenis.current?.start();
  }, []);

  /** The loader is opening: unlock scrolling and let the bud bloom. */
  const reveal = useCallback(() => {
    state.current.revealed = true;
    setRevealed(true);
    lenis.current?.start();
  }, []);

  const advance = useCallback(() => {
    goTo(Math.min(CHAPTER_SPAN, Math.floor(state.current.target + 0.35) + 1));
  }, [goTo]);

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.13,
      wheelMultiplier: 1,
      anchors: true,
    });
    lenis.current = instance;
    instance.stop();
    window.scrollTo(0, 0);
    let fontsCancelled = false;
    document.fonts.ready.then(() => {
      if (!fontsCancelled) setFontsReady(true);
    });
    const header = document.querySelector<HTMLElement>(".site-header");

    const measure = () => {
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const t = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      state.current.target = t * CHAPTER_SPAN;
      if (header)
        header.dataset.solid =
          rect.bottom < window.innerHeight * 0.6 ? "true" : "false";
    };
    instance.on("scroll", measure);
    window.addEventListener("resize", measure);
    measure();

    const onPointer = (event: PointerEvent) => {
      state.current.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.current.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let frame = 0;
    const loop = (time: number) => {
      instance.raf(time);
      const p = state.current.progress;
      stepEls.current.forEach((els, step) => {
        if (!els || step === 0) return;
        const inP = smoothstep(step - 0.55, step - 0.05, p);
        const outP =
          step === FINALE_STEP ? 1 : 1 - smoothstep(step + 0.3, step + 0.62, p);
        const active = inP * outP > 0.5 ? "true" : "false";
        const inS = inP.toFixed(3);
        const outS = outP.toFixed(3);
        els.forEach((el) => {
          if (!el) return;
          setVar(el, "--in", inS);
          setVar(el, "--out", outS);
          if (el.dataset.active !== active) el.dataset.active = active;
        });
      });
      const heroOut = (1 - smoothstep(0.03, 0.4, p)).toFixed(3);
      if (heroEl.current) setVar(heroEl.current, "--out", heroOut);
      if (hintEl.current) setVar(hintEl.current, "--out", heroOut);
      if (overlayEl.current)
        setVar(overlayEl.current, "--haze", (smoothstep(0.3, 0.9, p) *
          (1 - smoothstep(FINALE_STEP - 0.6, FINALE_STEP - 0.1, p))).toFixed(3));
      const current = Math.round(p);
      indexEls.current.forEach((el, i) => {
        const value = i === current ? "true" : "false";
        if (el && el.dataset.current !== value) el.dataset.current = value;
      });
      if (timelineEl.current) setVar(timelineEl.current, "--progress", (p / CHAPTER_SPAN).toFixed(4));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", measure);
      fontsCancelled = true;
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  return (
    <div className="lab-root" data-ready={revealed} data-sheet={sheetOpen} suppressHydrationWarning>
      <Loader ready={sceneReady && fontsReady} onReveal={reveal} />
      <ProductSheet onOpenChange={onSheetChange} />
      <SiteHeader />

      <section
        ref={section}
        className="home-experience"
        style={{ height: `${(CHAPTER_SPAN + 1) * 100}svh` }}
        aria-label="Steevanz"
      >
        <div className="home-stage">
          <div className="lab-canvas" aria-hidden="true">
            <Canvas
              dpr={dpr}
              shadows="percentage"
              camera={{ position: [0, 0, 6], fov: 32, near: 0.1, far: 40 }}
              gl={{ antialias: true, powerPreference: "high-performance", toneMapping: NeutralToneMapping }}
            >
              <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} flipflops={3} onFallback={() => setDpr(1)} />
              <FlowerScene stateRef={state} onAdvance={advance} onReady={onSceneReady} lite={lite} />
            </Canvas>
          </div>

          <div ref={overlayEl} className="lab-overlay">
            <div ref={heroEl} className="lab-hero-title">
              <p className="lab-hero-kicker">{intro.line}</p>
              <h1 className="lab-wordmark" aria-label={intro.wordmark}>
                {intro.wordmark.split("").map((letter, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    style={{ "--i": i } as CSSProperties}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>
            <div ref={hintEl} className="lab-intro">
              <p className="lab-intro-hint">{intro.hint}</p>
            </div>

            <nav ref={timelineEl} className="home-index" aria-label="Secções">
              {STEPS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  ref={(el) => {
                    indexEls.current[i] = el;
                  }}
                  data-current={i === 0}
                  onClick={() => goTo(i)}
                >
                  <span>{String(i).padStart(2, "0")}</span>
                  {label}
                </button>
              ))}
            </nav>

            <section
              ref={(el) => {
                (stepEls.current[ABOUT_STEP] ??= [])[0] = el;
              }}
              className="lab-chapter home-about"
              data-active="false"
            >
              <p className="lab-kicker">{about.kicker}</p>
              <h2 className="lab-title">
                <Words lines={about.title} />
              </h2>
              <p className="lab-body">{about.body}</p>
              <dl className="home-facts">
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.value}</dt>
                    <dd>{fact.label}</dd>
                  </div>
                ))}
              </dl>
              <a className="lab-link" href={about.cta.href}>
                {about.cta.label} <span aria-hidden="true">→</span>
              </a>
            </section>

            {modules.map((module, k) => {
              const step = FIRST_MODULE_STEP + k;
              return (
                <div key={module.id}>
                  <section
                    ref={(el) => {
                      (stepEls.current[step] ??= [])[0] = el;
                    }}
                    className="lab-chapter home-module"
                    data-active="false"
                  >
                    <p className="lab-kicker">
                      {module.index} / {String(modules.length).padStart(2, "0")}{" "}
                      — {module.label}
                    </p>
                    <h2 className="lab-title">
                      <Words lines={module.title} />
                    </h2>
                    <p className="lab-body">{module.lead}</p>
                    <p className="home-ideal">
                      <span>Ideal para</span> {module.idealFor.join(" · ")}
                    </p>
                    <ul className="home-offers">
                      {module.offers.map((offer) => (
                        <li key={offer.name}>
                          <span>
                            <b>{offer.name}</b>
                            {offer.note ? <small>{offer.note}</small> : null}
                          </span>
                          {offer.price ? <em>{offer.price}</em> : null}
                        </li>
                      ))}
                    </ul>
                    <div className="home-cta-row">
                    <a className="home-cta" href={module.cta.href}>
                      {module.cta.label} <span aria-hidden="true">→</span>
                    </a>
                      <a className="home-cta-secondary" href="/contacto">
                        Falar connosco
                      </a>
                    </div>
                  </section>
                </div>
              );
            })}

            <section
              ref={(el) => {
                (stepEls.current[FINALE_STEP] ??= [])[0] = el;
              }}
              className="lab-chapter lab-finale"
              data-active="false"
            >
              <p className="lab-kicker">{finale.kicker}</p>
              <h2 className="lab-title">
                <Words lines={finale.title} />
              </h2>
              <p className="lab-body">{finale.line}</p>
              <div className="lab-actions">
                <a className="lab-button" href={finale.primary.href}>
                  {finale.primary.label}
                </a>
                <a
                  className="lab-button lab-button-ghost"
                  href={finale.secondary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {finale.secondary.label}
                </a>
              </div>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
