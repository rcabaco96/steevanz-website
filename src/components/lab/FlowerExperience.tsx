"use client";

import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { CHAPTER_SPAN, chapters, finale, intro } from "./chapters";
import { smoothstep } from "./flowerAssets";
import { FlowerScene, type ExperienceState } from "./FlowerScene";

function Words({ lines }: { lines: string[] }) {
  let index = 0;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="lab-line">
          {line.split(" ").map((word) => {
            const i = index++;
            return (
              <span key={`${word}-${i}`} className="lab-word" style={{ "--i": i } as CSSProperties}>
                <span className="lab-word-inner">{word}</span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

export function FlowerExperience({ fontFamily, sansFamily }: { fontFamily: string; sansFamily: string }) {
  const state = useRef<ExperienceState>({ progress: 0, target: 0, pointer: { x: 0, y: 0 } });
  const lenis = useRef<Lenis | null>(null);
  const chapterEls = useRef<(HTMLElement | null)[]>([]);
  const introEl = useRef<HTMLDivElement>(null);
  const finaleEl = useRef<HTMLElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const instance = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
    lenis.current = instance;
    instance.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      state.current.target = limit > 0 ? (scroll / limit) * CHAPTER_SPAN : 0;
    });

    const onPointer = (event: PointerEvent) => {
      state.current.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.current.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let frame = 0;
    const loop = (time: number) => {
      instance.raf(time);
      const p = state.current.progress;
      chapterEls.current.forEach((el, k) => {
        if (!el) return;
        const c = k + 1;
        const inP = smoothstep(c - 0.55, c - 0.05, p);
        const outP = 1 - smoothstep(c + 0.3, c + 0.62, p);
        el.style.setProperty("--in", inP.toFixed(4));
        el.style.setProperty("--out", outP.toFixed(4));
        el.dataset.active = inP * outP > 0.5 ? "true" : "false";
      });
      if (introEl.current) introEl.current.style.setProperty("--out", (1 - smoothstep(0.04, 0.38, p)).toFixed(4));
      if (finaleEl.current) {
        const inP = smoothstep(5.4, 5.92, p);
        finaleEl.current.style.setProperty("--in", inP.toFixed(4));
        finaleEl.current.style.setProperty("--out", "1");
        finaleEl.current.dataset.active = inP > 0.5 ? "true" : "false";
      }
      dots.current.forEach((dot, i) => {
        if (dot) dot.dataset.gone = p - i - 0.05 > 0.5 ? "true" : "false";
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  const advance = useCallback(() => {
    const instance = lenis.current;
    if (!instance) return;
    const next = Math.min(CHAPTER_SPAN, Math.floor(state.current.target + 0.35) + 1);
    instance.scrollTo((next / CHAPTER_SPAN) * instance.limit, {
      duration: 1.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }, []);

  return (
    <>
      <div className="lab-canvas" aria-hidden="true">
        <Canvas
          dpr={[1, 1.75]}
          shadows="percentage"
          camera={{ position: [0, 0, 6], fov: 32, near: 0.1, far: 40 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <FlowerScene stateRef={state} onAdvance={advance} wordmark={intro.wordmark} fontFamily={fontFamily} sansFamily={sansFamily} />
        </Canvas>
      </div>

      <header className="lab-header">
        <span className="lab-brand">Steevanz</span>
        <nav className="lab-nav" aria-label="Principal">
          <a href="/sobre">Estúdio</a>
          <a href="/contacto">Contacto</a>
        </nav>
      </header>

      <div className="lab-petals" aria-hidden="true">
        {chapters.map((chapter, i) => (
          <span
            key={chapter.kicker}
            ref={(el) => {
              dots.current[i] = el;
            }}
            className="lab-petal-dot"
          />
        ))}
      </div>

      <main className="lab-overlay">
        <div ref={introEl} className="lab-intro">
          <h1 className="sr-only">{intro.wordmark}</h1>
          <p className="lab-intro-line">{intro.line}</p>
          <p className="lab-intro-hint">{intro.hint}</p>
        </div>

        {chapters.map((chapter, k) => (
          <section
            key={chapter.kicker}
            ref={(el) => {
              chapterEls.current[k] = el;
            }}
            className={k % 2 === 1 ? "lab-chapter lab-chapter-right" : "lab-chapter"}
            data-active="false"
          >
            <p className="lab-kicker">{chapter.kicker}</p>
            <h2 className="lab-title">
              <Words lines={chapter.title} />
            </h2>
            {chapter.body ? <p className="lab-body">{chapter.body}</p> : null}
            {chapter.specs ? (
              <ul className="lab-specs">
                {chapter.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            ) : null}
            {chapter.clients ? (
              <ul className="lab-clients">
                {chapter.clients.map((client) => (
                  <li key={client}>{client}</li>
                ))}
              </ul>
            ) : null}
            {chapter.link ? (
              <a className="lab-link" href={chapter.link.href}>
                {chapter.link.label} <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </section>
        ))}

        <section ref={finaleEl} className="lab-chapter lab-finale" data-active="false">
          <p className="lab-kicker">{finale.kicker}</p>
          <h2 className="lab-title">
            <Words lines={finale.title} />
          </h2>
          <p className="lab-body">{finale.line}</p>
          <div className="lab-actions">
            <a className="lab-button" href={finale.primary.href}>
              {finale.primary.label}
            </a>
            <a className="lab-button lab-button-ghost" href={finale.secondary.href}>
              {finale.secondary.label}
            </a>
          </div>
        </section>
      </main>

      <div className="lab-scroll-space" style={{ height: `${(CHAPTER_SPAN + 1) * 100}svh` }} />
    </>
  );
}
