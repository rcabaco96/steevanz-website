"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { MenuTab } from "@/content/home-ultra/menuShowcase";
import { stillsOnly } from "../../shared/env";
import { LoopVideo } from "../../shared/LoopVideo";
import { PhoneFrame } from "../../shared/PhoneFrame";
import m from "../MenuShowcase.module.css";
import { SharedOrderDemo } from "./SharedOrderDemo";

// The Menu digital band's island: the three-phone fan, the tabs (ARIA tabs, automatic activation), the
// tab text and the pause button. The intro (heading, lead, price) and the CTA come in as server slots.
//
// Steps: 0 «Ecrã inteiro» (video, advances when it ends) → 1 «Pedido da mesa» (5s CSS demo) →
// 2 «Confirmado pela equipa» (video, advances when it ends) → 0.
// - Auto-advance only while the band is at least half on screen (or fills half the viewport), not
//   paused, no keyboard focus in the tab row, and not reduced motion / Save-Data.
// - The active tab's underline is the clock: a CSS scaleX over --d. For a video it is re-synced to the
//   video's duration and position on every `playing`; while a video has not started (missing file,
//   still loading) it runs 8s and its animationend advances, so a missing file never stalls the band.
// - Pause freezes everything (videos, demo, underline). Choosing a tab resumes from that tab.

type Props = {
  intro: ReactNode;
  cta: ReactNode;
  tabs: readonly MenuTab[];
  tabsLabel: string;
  pauseLabel: string;
  resumeLabel: string;
};

const DEMO_SECONDS = 5;
const FALLBACK_SECONDS = 8;
const VIDEO_TABS = [0, 2];

function subscribeStill(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type Clock = { n: number; d: number; t: number };
type VideoState = "waiting" | "playing" | "held";

export function MenuTabs({ intro, cta, tabs, tabsLabel, pauseLabel, resumeLabel }: Props) {
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [video, setVideo] = useState<VideoState>("waiting");
  const [clock, setClock] = useState<Clock>({ n: 0, d: FALLBACK_SECONDS, t: 0 });
  const [demoCycle, setDemoCycle] = useState(0);
  const still = useSyncExternalStore(subscribeStill, stillsOnly, () => false);

  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabNow = useRef(0);

  const auto = inView && !paused && !keyboard && !still;
  const isVideoTab = VIDEO_TABS.includes(tab);
  const clockRunning = auto && (!isVideoTab || video !== "held");

  const select = useCallback((next: number) => {
    tabNow.current = next;
    setTab(next);
    setVideo("waiting");
    setClock((c) => ({ n: c.n + 1, d: next === 1 ? DEMO_SECONDS : FALLBACK_SECONDS, t: 0 }));
    if (next === 1) setDemoCycle((c) => c + 1);
  }, []);

  const advance = useCallback(
    (from: number) => {
      if (tabNow.current !== from) return;
      select((from + 1) % tabs.length);
    },
    [select, tabs.length],
  );

  // The band counts as "on screen" at ≥50% visible, or when it fills half the viewport (tall bands
  // on short landscape phones never reach 50%).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const half = entry.intersectionRect.height >= window.innerHeight * 0.5;
        setInView(entry.isIntersecting && (entry.intersectionRatio >= 0.5 || half));
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Latest values for the native video listeners below.
  const advanceRef = useRef(advance);
  const autoRef = useRef(auto);
  useEffect(() => {
    advanceRef.current = advance;
    autoRef.current = auto;
  });

  // Video events of the two video tabs (LoopVideo owns the element; we only listen).
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    VIDEO_TABS.forEach((index) => {
      const el = videoRefs.current[index]?.querySelector("video");
      if (!el) return;
      const onPlaying = () => {
        if (tabNow.current !== index) return;
        const d = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : FALLBACK_SECONDS;
        setVideo("playing");
        setClock((c) => ({ n: c.n + 1, d, t: Math.min(el.currentTime, d) }));
      };
      const onPause = () => {
        if (tabNow.current === index && !el.ended) setVideo("held");
      };
      const onEnded = () => {
        if (stillsOnly() || tabNow.current !== index) return;
        if (autoRef.current) {
          advanceRef.current(index);
        } else {
          // Ended while auto-advance was held (keyboard focus): a short clock moves on once it resumes.
          setVideo("waiting");
          setClock((c) => ({ n: c.n + 1, d: 1.5, t: 0 }));
        }
      };
      el.addEventListener("playing", onPlaying);
      el.addEventListener("pause", onPause);
      el.addEventListener("ended", onEnded);
      cleanups.push(() => {
        el.removeEventListener("playing", onPlaying);
        el.removeEventListener("pause", onPause);
        el.removeEventListener("ended", onEnded);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Keep the active pill in view when the row scrolls (narrow phones). Horizontal only.
  useEffect(() => {
    const row = rowRef.current;
    const btn = tabRefs.current[tab];
    if (!row || !btn || row.scrollWidth <= row.clientWidth + 1) return;
    const left = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: stillsOnly() ? "auto" : "smooth" });
  }, [tab]);

  const onClockEnd = (index: number) => {
    if (!auto || index !== tab) return;
    // Videos advance on `ended`; the clock only advances a video tab that never started.
    if (isVideoTab && video !== "waiting") return;
    advance(index);
  };

  const choose = (index: number) => {
    setPaused(false);
    if (index !== tab) select(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: tab === last ? 0 : tab + 1,
      ArrowLeft: tab === 0 ? last : tab - 1,
      Home: 0,
      End: last,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus();
  };

  const demoRun = inView && !paused && tab === 1;

  return (
    <div ref={rootRef} className={m.grid}>
      <div className={m.intro}>{intro}</div>

      <div className={m.stage} data-tab={tab}>
        <span className={m.floor} aria-hidden="true" />
        <div className={m.fan} data-demo-run={demoRun ? "" : undefined}>
          <div className={`${m.slot} ${m.left}`} aria-hidden="true">
            <PhoneFrame width="var(--hu-side-w)" screenBg="#f4ece1" className={m.phone}>
              <div className={m.layer} data-on={tab !== 1 ? "" : undefined}>
                <Image
                  src="/home-ultra/menu-colecoes.jpg"
                  alt=""
                  width={480}
                  height={1038}
                  sizes="(min-width: 1024px) 200px, 38vw"
                  loading="lazy"
                  className={m.fill}
                />
              </div>
              <div className={m.layer} data-on={tab === 1 ? "" : undefined}>
                <SharedOrderDemo key={`s${demoCycle}`} role="sender" />
              </div>
            </PhoneFrame>
          </div>

          <div className={`${m.slot} ${m.right}`} aria-hidden="true">
            <PhoneFrame width="var(--hu-side-w)" screenBg="#f4ece1" className={m.phone}>
              <Image
                src="/home-ultra/menu-grelha.jpg"
                alt=""
                width={480}
                height={1038}
                sizes="(min-width: 1024px) 200px, 38vw"
                loading="lazy"
                className={m.fill}
              />
            </PhoneFrame>
          </div>

          <div className={`${m.slot} ${m.centre}`}>
            <PhoneFrame width="var(--hu-centre-w)" screenBg="#1d1220" className={m.phone}>
              <div
                className={m.layer}
                data-on={tab === 0 ? "" : undefined}
                inert={tab !== 0}
                ref={(el) => {
                  videoRefs.current[0] = el;
                }}
              >
                <LoopVideo
                  src="/home-ultra/menu-ecra-inteiro.mp4"
                  src720="/home-ultra/menu-ecra-inteiro-720.mp4"
                  poster="/home-ultra/menu-ecra-inteiro.jpg"
                  sizes="(min-width: 1024px) 240px, 46vw"
                  loop={false}
                  restartOnActive={false}
                  active={tab === 0 && !paused}
                  priority={1}
                  playLabel={tabs[0].playLabel}
                  fallback={<span className={m.fallback} />}
                />
              </div>
              <div className={m.layer} data-on={tab === 1 ? "" : undefined} aria-hidden="true">
                <SharedOrderDemo key={`r${demoCycle}`} role="receiver" />
              </div>
              <div
                className={m.layer}
                data-on={tab === 2 ? "" : undefined}
                inert={tab !== 2}
                ref={(el) => {
                  videoRefs.current[2] = el;
                }}
              >
                <LoopVideo
                  src="/home-ultra/menu-pedido.mp4"
                  poster="/home-ultra/menu-pedido.jpg"
                  sizes="(min-width: 1024px) 240px, 46vw"
                  loop={false}
                  restartOnActive={false}
                  active={tab === 2 && !paused}
                  priority={1}
                  playLabel={tabs[2].playLabel}
                  fallback={<span className={m.fallback} />}
                />
              </div>
            </PhoneFrame>
          </div>

          <span
            key={`chip${demoCycle}`}
            className={m.chip}
            data-on={tab === 1 ? "" : undefined}
            aria-hidden="true"
          >
            +1
          </span>
        </div>
      </div>

      <div className={m.controls}>
        <div
          ref={rowRef}
          className={m.tabRow}
          role="tablist"
          aria-label={tabsLabel}
          data-running={clockRunning ? "" : undefined}
          data-still={still ? "" : undefined}
          onFocus={(event) => setKeyboard(event.target.matches(":focus-visible"))}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboard(false);
          }}
        >
          {tabs.map((t, i) => {
            const selected = i === tab;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`menu-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`menu-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                className={m.tab}
                onClick={() => choose(i)}
                onKeyDown={onKeyDown}
              >
                <span>{t.label}</span>
                <span className={m.track} aria-hidden="true">
                  {selected ? (
                    <span
                      key={clock.n}
                      className={m.progress}
                      style={{ "--d": `${clock.d}s`, animationDelay: `-${clock.t}s` } as CSSProperties}
                      onAnimationEnd={() => onClockEnd(i)}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
        {still ? null : (
          <button
            type="button"
            className={m.pause}
            aria-label={paused ? resumeLabel : pauseLabel}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" />
                <rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className={m.panels}>
        {tabs.map((t, i) => (
          <p
            key={t.id}
            role="tabpanel"
            id={`menu-panel-${t.id}`}
            aria-labelledby={`menu-tab-${t.id}`}
            tabIndex={i === tab ? 0 : -1}
            className={m.panel}
            data-on={i === tab ? "" : undefined}
            inert={i !== tab}
          >
            {t.text}
          </p>
        ))}
      </div>

      <div className={m.cta}>{cta}</div>
    </div>
  );
}
