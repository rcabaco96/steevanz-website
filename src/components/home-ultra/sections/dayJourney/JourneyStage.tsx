"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { TapPlate } from "@/components/visuals/TapPlate";
import { dayJourney } from "@/content/home-ultra/dayJourney";
import { PhoneFrame } from "../../shared/PhoneFrame";
import { useInView } from "../../shared/useInView";
import s from "../../shared/ultra.module.css";
import d from "../DayJourney.module.css";
import { JourneyScreenView, screenHasImage } from "./JourneyScreens";

// The interactive part of «Um dia no seu negócio».
// Phones (<1024px): a story phone. The active story bar fills over 4.5s (CSS animation) and its
// animationend moves to the next step, looping inside the sector. It pauses when the phone is under 50% in
// view, the tab is hidden, the phone is pressed for more than 250ms, or the pause button is on. Left 35% of
// the screen = previous step, right 65% = next step. Reduced motion: no auto-advance, static bars.
// Desktop (≥1024px): sticky phone on the left, the five steps as a list on the right; the step crossing the
// middle of the viewport (IntersectionObserver, rootMargin -45%) becomes active. No scroll-jacking.

const { sectors, controls, plates } = dayJourney;
const STEPS = 5;
const HOLD_MS = 250;
const EXIT_MS = 260;

type Change = "none" | "step" | "sector";

/* ---------- External stores (no setState in effects) ---------- */

function mediaStore(query: string) {
  return {
    subscribe(callback: () => void) {
      const list = window.matchMedia(query);
      list.addEventListener("change", callback);
      return () => list.removeEventListener("change", callback);
    },
    get: () => window.matchMedia(query).matches,
  };
}
const reducedStore = mediaStore("(prefers-reduced-motion: reduce)");
const desktopStore = mediaStore("(min-width: 1024px)");
const serverFalse = () => false;

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
const pageHidden = () => document.visibilityState === "hidden";

/* ---------- Icons ---------- */

function PauseGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <rect x="6.5" y="5" width="3.6" height="14" rx="1.2" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1.2" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l10.6-6.8a.8.8 0 0 0 0-1.4L9.2 4.5a.8.8 0 0 0-1.2.7Z" />
    </svg>
  );
}

/* ---------- Component ---------- */

export function JourneyStage() {
  const [sector, setSector] = useState(0);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const [change, setChange] = useState<Change>("none");
  const [leaving, setLeaving] = useState<{ sector: number; step: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [inView, setInView] = useState(false);

  const reduced = useSyncExternalStore(reducedStore.subscribe, reducedStore.get, serverFalse);
  const desktop = useSyncExternalStore(desktopStore.subscribe, desktopStore.get, serverFalse);
  const hidden = useSyncExternalStore(subscribeVisibility, pageHidden, serverFalse);

  const running = !desktop && !reduced && inView && !hidden && !paused && !holding;

  const phoneRef = useInView<HTMLDivElement>({ attr: null, threshold: 0.5, onChange: (visible) => setInView(visible) });
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const holdTimer = useRef<number | undefined>(undefined);
  const held = useRef(false);

  const goToStep = useCallback(
    (next: number) => {
      if (next === step) {
        setRun((value) => value + 1);
        return;
      }
      setLeaving({ sector, step });
      setChange("step");
      setStep(next);
      setRun((value) => value + 1);
    },
    [sector, step],
  );

  // The outgoing screen fades for 250ms, then unmounts.
  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [leaving]);

  // Desktop: the step in the middle band of the viewport is the active one.
  const goRef = useRef(goToStep);
  useEffect(() => {
    goRef.current = goToStep;
  });
  useEffect(() => {
    if (!desktop || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) goRef.current(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [desktop]);

  // Keep the chosen pill visible inside the rail (never scrolls the page).
  useEffect(() => {
    const rail = railRef.current;
    const pill = pillRefs.current[sector];
    if (!rail || !pill || rail.scrollWidth <= rail.clientWidth) return;
    const left = pill.offsetLeft - rail.offsetLeft;
    const right = left + pill.offsetWidth;
    if (left >= rail.scrollLeft && right <= rail.scrollLeft + rail.clientWidth) return;
    rail.scrollTo({ left: Math.max(0, left - 20), behavior: reduced ? "auto" : "smooth" });
  }, [sector, reduced]);

  const pickSector = (index: number) => {
    if (index === sector) return;
    setSector(index);
    setLeaving(null);
    setChange("sector");
    // Phones restart the story; on desktop the step stays the one in view (scroll position decides).
    if (!desktop) setStep(0);
    setRun((value) => value + 1);
  };

  const onRailKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: sector + 1,
      ArrowDown: sector + 1,
      ArrowLeft: sector - 1,
      ArrowUp: sector - 1,
      Home: 0,
      End: sectors.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + sectors.length) % sectors.length;
    pickSector(next);
    pillRefs.current[next]?.focus();
  };

  const onFillEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget || !running) return;
    goToStep((step + 1) % STEPS);
  };

  /* Press and hold pauses (like stories); the release after a hold does not change step. */
  const endHold = () => {
    window.clearTimeout(holdTimer.current);
    if (held.current) {
      setHolding(false);
      window.setTimeout(() => {
        held.current = false;
      }, 60);
    }
  };
  const onZone = (delta: 1 | -1) => {
    if (held.current) return;
    goToStep(delta === 1 ? (step + 1) % STEPS : Math.max(0, step - 1));
  };

  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  const current = sectors[sector];
  const activeStep = current.steps[step];
  const kind = activeStep.screen.kind;

  // Screen layers: the outgoing one, the next one when it has an image (so it is loaded before its turn,
  // and the same keyed element becomes current) and the current one.
  const layers: { sector: number; step: number; state: "leaving" | "next" | "current" }[] = [];
  if (leaving) layers.push({ ...leaving, state: "leaving" });
  const nextIndex = (step + 1) % STEPS;
  const nextIsLeaving = leaving && leaving.sector === sector && leaving.step === nextIndex;
  if (screenHasImage(current.steps[nextIndex].screen) && !nextIsLeaving) {
    layers.push({ sector, step: nextIndex, state: "next" });
  }
  layers.push({ sector, step, state: "current" });

  return (
    <div className={d.stage} data-running={running ? "" : undefined} data-hu-bar-avoid="">
      <div
        ref={railRef}
        className={`${d.switcher} ${s.rail}`}
        role="radiogroup"
        aria-label={dayJourney.switcherLabel}
        onKeyDown={onRailKey}
      >
        {sectors.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              pillRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={index === sector}
            tabIndex={index === sector ? 0 : -1}
            className={d.pill}
            onClick={() => pickSector(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={d.grid}>
        <div className={d.phoneCol}>
          <div className={d.sticky}>
            <div
              ref={phoneRef}
              className={d.phoneWrap}
              onPointerDown={() => {
                held.current = false;
                window.clearTimeout(holdTimer.current);
                holdTimer.current = window.setTimeout(() => {
                  held.current = true;
                  setHolding(true);
                }, HOLD_MS);
              }}
              onPointerUp={endHold}
              onPointerCancel={endHold}
              onPointerLeave={endHold}
              onContextMenu={(event) => event.preventDefault()}
            >
              <PhoneFrame width="var(--dj-phone-w)" screenBg="#fbf7f1" shadow>
                <div className={d.layers} aria-hidden="true">
                  {layers.map((layer) => {
                    const item = sectors[layer.sector].steps[layer.step];
                    return (
                      <div
                        key={`${sectors[layer.sector].id}-${layer.step}`}
                        className={d.layer}
                        data-state={layer.state}
                        data-change={layer.state === "current" ? change : undefined}
                      >
                        <JourneyScreenView screen={item.screen} time={item.time} />
                      </div>
                    );
                  })}
                </div>
                <div className={d.bars} aria-hidden="true">
                  {current.steps.map((_, index) => (
                    <span key={index} className={d.bar}>
                      <span
                        key={index === step ? `run-${run}` : `bar-${index}`}
                        className={d.fill}
                        data-state={index < step ? "done" : index === step ? "active" : "todo"}
                        onAnimationEnd={index === step ? onFillEnd : undefined}
                      />
                    </span>
                  ))}
                </div>
                <button type="button" className={`${d.zone} ${d.zonePrev}`} aria-label={controls.previous} onClick={() => onZone(-1)} />
                <button type="button" className={`${d.zone} ${d.zoneNext}`} aria-label={controls.next} onClick={() => onZone(1)} />
              </PhoneFrame>
              <div className={d.plate} data-show={kind === "review" ? "" : undefined} aria-hidden="true">
                <TapPlate variant="stand" finish="black" symbol="stars" line1={plates.review.line1} line2={plates.review.line2} className={d.plateSvg} />
              </div>
              <div className={d.plate} data-show={kind === "stamp" ? "" : undefined} aria-hidden="true">
                <TapPlate variant="stand" finish="black" symbol="stamps" line1={plates.stamp.line1} line2={plates.stamp.line2} className={d.plateSvg} />
              </div>
            </div>

            <div className={d.controls}>
              <button
                type="button"
                className={d.pause}
                aria-label={paused ? controls.play : controls.pause}
                aria-pressed={paused}
                data-off={reduced ? "" : undefined}
                tabIndex={reduced ? -1 : undefined}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? <PlayGlyph /> : <PauseGlyph />}
              </button>
              <p className={`${s.subtle} ${d.note}`}>{dayJourney.note}</p>
            </div>

            {/* Phones: every caption of every sector shares one grid cell, so the box never changes height. */}
            <div className={d.caption} data-change={change} aria-live={running ? "off" : "polite"}>
              {sectors.map((item, sectorIndex) =>
                item.steps.map((entry, index) => {
                  const active = sectorIndex === sector && index === step;
                  return (
                    <div key={`${item.id}-${index}`} className={d.captionItem} data-active={active ? "" : undefined} aria-hidden={active ? undefined : true}>
                      <p className={d.timeRow}>
                        <span className={`${s.price} ${d.time}`}>{entry.time}</span>
                        <span className={`${s.subtle} ${d.count}`}>{controls.stepOf(index + 1, STEPS)}</span>
                      </p>
                      <h3 className={`${s.h3} ${d.captionTitle}`}>{entry.title}</h3>
                      <p className={`${s.body} ${d.captionText}`}>{entry.text}</p>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        <ol className={d.steps}>
          {current.steps.map((entry, index) => (
            <li
              key={index}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-step={index}
              data-active={index === step ? "" : undefined}
              className={d.step}
              style={{ "--i": index } as CSSProperties}
            >
              <div key={current.id} className={d.stepIn} data-change={change}>
                <p className={`${s.price} ${d.time}`}>{entry.time}</p>
                <h3 className={`${s.h3} ${d.stepTitle}`}>{entry.title}</h3>
                <p className={`${s.body} ${s.muted} ${d.stepText}`}>{entry.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
