"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { GoalDemo } from "@/content/home-ultra/goals";
import { missingVideoMs, stampDemo } from "@/content/home-ultra/goals";
import type { GoalId } from "@/content/home-ultra/shared";
import { stillsOnly } from "../../shared/env";
import { LoopVideo } from "../../shared/LoopVideo";
import { PhoneFrame, PhoneStage, Satellite } from "../../shared/PhoneFrame";
import { useInView } from "../../shared/useInView";
import { videoDirector } from "../../shared/videoDirector";
import s from "../../shared/ultra.module.css";
import st from "../Goals.module.css";
import { GoalsStampScreen } from "./GoalsStampScreen";

// The interactive part of «O que quer melhorar?»: five equal goal tabs, one big phone playing the real
// product for the selected goal, and the goal's panel (line, products, price).
//
// Auto-advance (never under reduced motion / Save-Data):
// - runs only while the stage is ≥50% on screen, the tab is visible, nothing inside is hovered or
//   keyboard-focused, and the visitor has not paused it or picked a tab;
// - a picked tab hands control to the visitor until the section leaves the view and comes back;
// - a recording advances when it ends (its remaining length drives the gold progress bar); a code
//   screen advances on its own timer; a missing recording on `missingVideoMs`.
// One clock (setTimeout + remaining ms) and the bar's CSS animation pause and resume together.

export interface GoalStageItem {
  id: GoalId;
  title: string;
  demo: GoalDemo;
}

interface Step {
  active: number;
  token: number;
  /** Total length of the step (ms), and how much of it had already passed when it was set. */
  d: number;
  offset: number;
  source: "timer" | "video";
}

const subscribeNoop = () => () => {};
const now = () => performance.now();
const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const pageVisible = () => document.visibilityState === "visible";

function stepFor(goals: GoalStageItem[], active: number, token: number): Step {
  const demo = goals[active].demo;
  // A recording starts on the "missing file" timer and switches to its real length once it plays.
  const d = demo.kind === "video" ? missingVideoMs : demo.durationMs;
  return { active, token, d, offset: 0, source: "timer" };
}

export function GoalsStage({
  heading,
  goals,
  panels,
  fallbacks,
  flowScreen,
  labels,
}: {
  heading: ReactNode;
  goals: GoalStageItem[];
  /** Server-rendered panel bodies, same order as `goals`. */
  panels: ReactNode[];
  /** CSS mini demos shown while a recording's files are missing. */
  fallbacks: Partial<Record<GoalId, ReactNode>>;
  flowScreen: ReactNode;
  labels: { tablist: string; pause: string; resume: string };
}) {
  const baseId = useId();
  const count = goals.length;
  const still = useSyncExternalStore(subscribeNoop, stillsOnly, () => false);
  const docVisible = useSyncExternalStore(subscribeVisibility, pageVisible, () => true);

  const [step, setStep] = useState<Step>(() => stepFor(goals, 0, 0));
  const [inView, setInView] = useState(false);
  const [autoOff, setAutoOff] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusHold, setFocusHold] = useState(false);
  const [landed, setLanded] = useState(-1);
  const [heights, setHeights] = useState<number[]>([]);

  const running = !still && inView && docVisible && !autoOff && !userPaused && !hover && !focusHold;
  const paused = userPaused || autoOff;

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const clock = useRef({ key: "", remaining: 0, startedAt: 0, ticking: false });
  const live = useRef({ step, running, autoOff, userPaused });
  useEffect(() => {
    live.current = { step, running, autoOff, userPaused };
  });

  const stageRef = useInView<HTMLDivElement>({
    threshold: 0.5,
    onChange: (visible) => {
      setInView(visible);
      // Leaving the view gives auto-advance back after a manual choice.
      if (!visible) setAutoOff(false);
    },
  });

  const select = useCallback(
    (index: number) => setStep((prev) => stepFor(goals, index, prev.token + 1)),
    [goals],
  );
  const next = useCallback(
    (token: number) =>
      setStep((prev) => (prev.token === token ? stepFor(goals, (prev.active + 1) % goals.length, prev.token + 1) : prev)),
    [goals],
  );

  // The clock: counts the step down only while running; pausing keeps what is left.
  useEffect(() => {
    const c = clock.current;
    const key = `${step.token}:${step.d}:${step.offset}`;
    if (c.key !== key) {
      c.key = key;
      c.remaining = Math.max(0, step.d - step.offset);
    }
    if (!running) return;
    const token = step.token;
    c.startedAt = now();
    c.ticking = true;
    const timer = window.setTimeout(() => next(token), c.remaining);
    return () => {
      window.clearTimeout(timer);
      c.remaining = Math.max(0, c.remaining - (now() - c.startedAt));
      c.ticking = false;
    };
  }, [running, step.token, step.d, step.offset, next]);

  // Desktop: the rows under the open one slide down by exactly its panel's height (transform only); the
  // list reserves the tallest panel, so nothing below it moves. Phones ignore these values.
  useEffect(() => {
    const els = panelRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!els.length || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => {
      const next = els.map((el) => Math.ceil(el.offsetHeight));
      setHeights((prev) => (prev.length === next.length && prev.every((h, i) => h === next[i]) ? prev : next));
    });
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  const listVars = {
    "--active": step.active,
    ...(heights.length && heights[step.active]
      ? { "--P": `${heights[step.active]}px`, "--Pmax": `${Math.max(...heights)}px` }
      : {}),
  } as CSSProperties;

  const videoOf = (index: number) => layerRefs.current[index]?.querySelector("video") ?? null;

  // A recording restarts from the top whenever its goal is selected.
  useEffect(() => {
    const video = layerRefs.current[step.active]?.querySelector("video");
    if (video && video.currentTime > 0) video.currentTime = 0;
  }, [step.active, step.token]);

  // Keep the selected pill in view on the phone rail (horizontal scroll only, never the page).
  useEffect(() => {
    const rail = railRef.current;
    const tab = tabRefs.current[step.active];
    if (!rail || !tab || rail.scrollWidth <= rail.clientWidth + 1) return;
    const left = tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: still ? "auto" : "smooth" });
  }, [step.active, still]);

  // «Fazer voltar»: the fourth stamp lands 600ms after the card shows (on screen only).
  const stampsActive = goals[step.active].demo.kind === "stamps";
  useEffect(() => {
    if (!stampsActive || still || !inView) return;
    const token = step.token;
    const timer = window.setTimeout(() => setLanded(token), 600);
    return () => window.clearTimeout(timer);
  }, [stampsActive, still, inView, step.token]);
  const stamps = still || landed === step.token ? stampDemo.after : stampDemo.before;

  const onPlaying = (index: number) => {
    const { step: s } = live.current;
    if (index !== s.active || s.source === "video") return;
    const video = videoOf(index);
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const c = clock.current;
    const elapsed = s.d - c.remaining + (c.ticking ? now() - c.startedAt : 0);
    const left = Math.max(1200, (video.duration - video.currentTime) * 1000);
    // Continue the bar from where it is, now paced by the real recording.
    setStep((prev) =>
      prev.token === s.token ? { ...prev, d: Math.round(elapsed + left), offset: Math.round(elapsed), source: "video" } : prev,
    );
  };

  const onEnded = (index: number) => {
    const { step: s, running: run, autoOff: off, userPaused: held } = live.current;
    if (index !== s.active) return;
    if (run) {
      next(s.token);
      return;
    }
    // Visitor in control: replay the recording after a short hold.
    if (off && !held) {
      const token = s.token;
      window.setTimeout(() => {
        const now = live.current;
        const video = videoOf(index);
        if (now.step.token !== token || !now.autoOff || now.userPaused || !video) return;
        if (!videoDirector.isCurrent(video)) return;
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 1400);
    }
  };

  const choose = (index: number) => {
    setAutoOff(true);
    if (index !== step.active) select(index);
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let target: number | null = null;
    if (event.key in moves) target = (index + moves[event.key] + count) % count;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = count - 1;
    if (target === null) return;
    event.preventDefault();
    choose(target);
    tabRefs.current[target]?.focus();
  };

  const togglePause = () => {
    if (paused) {
      setUserPaused(false);
      setAutoOff(false);
    } else {
      setUserPaused(true);
    }
  };

  const onFocusIn = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    setFocusHold(target !== pauseRef.current && target.matches(":focus-visible"));
  };
  const onFocusOut = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusHold(false);
  };
  const hoverOn = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setHover(true);
  };
  const hoverOff = () => setHover(false);

  const showBar = !still && !autoOff;

  return (
    <div
      ref={stageRef}
      className={st.stage}
      data-running={running ? "" : undefined}
      data-hold={userPaused ? "" : undefined}
      data-hu-bar-avoid=""
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <div className={st.head}>{heading}</div>

      <div className={st.list} style={listVars}>
        <div className={st.tabsRow}>
          <div ref={railRef} className={`${s.rail} ${st.rail}`}>
            <div role="tablist" aria-label={labels.tablist} className={st.tablist}>
              {goals.map((goal, index) => {
                const selected = index === step.active;
                return (
                  <button
                    key={goal.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${goal.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel-${goal.id}`}
                    tabIndex={selected ? 0 : -1}
                    data-after={index > step.active ? "" : undefined}
                    className={st.tab}
                    onClick={() => choose(index)}
                    onKeyDown={(event) => onTabKey(event, index)}
                  >
                    <span className={st.tabLabel}>{goal.title}</span>
                    {selected && showBar ? (
                      <span
                        key={`${step.token}:${step.d}`}
                        aria-hidden="true"
                        className={st.bar}
                        style={{ "--d": `${step.d}ms`, "--o": `-${step.offset}ms` } as CSSProperties}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            ref={pauseRef}
            type="button"
            className={st.pause}
            aria-label={paused ? labels.resume : labels.pause}
            title={paused ? labels.resume : labels.pause}
            onClick={togglePause}
            data-still={still ? "" : undefined}
          >
            {paused ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        <div className={st.panels} onPointerEnter={hoverOn} onPointerLeave={hoverOff}>
          {goals.map((goal, index) => {
            const selected = index === step.active;
            return (
              <div
                key={goal.id}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                role="tabpanel"
                id={`${baseId}-panel-${goal.id}`}
                aria-labelledby={`${baseId}-tab-${goal.id}`}
                aria-hidden={selected ? undefined : true}
                inert={!selected}
                data-active={selected ? "" : undefined}
                className={st.panel}
                style={{ "--i": index } as CSSProperties}
              >
                {panels[index]}
              </div>
            );
          })}
        </div>
      </div>

      <div className={st.phoneArea} onPointerEnter={hoverOn} onPointerLeave={hoverOff}>
        <PhoneStage straighten="view" pointer pose={{ rx: "6deg", ry: "-16deg", rz: "-2deg" }}>
          <PhoneFrame width="var(--goals-phone-w)" screenBg="#fbf7f1" shadow>
            {goals.map((goal, index) => {
              const selected = index === step.active;
              const demo = goal.demo;
              return (
                <div
                  key={goal.id}
                  ref={(el) => {
                    layerRefs.current[index] = el;
                  }}
                  className={st.layer}
                  data-active={selected ? "" : undefined}
                >
                  {demo.kind === "video" ? (
                    <LoopVideo
                      src={demo.src}
                      src720={demo.src720}
                      poster={demo.poster}
                      sizes="(min-width: 1024px) 300px, 66vw"
                      loop={false}
                      restartOnActive={false}
                      active={selected && !userPaused}
                      priority={2}
                      onPlaying={() => onPlaying(index)}
                      onEnded={() => onEnded(index)}
                      playLabel={demo.playLabel}
                      fallback={fallbacks[goal.id]}
                    />
                  ) : demo.kind === "stamps" ? (
                    <GoalsStampScreen stamps={selected ? stamps : stampDemo.before} />
                  ) : (
                    flowScreen
                  )}
                </div>
              );
            })}
          </PhoneFrame>
          <Satellite z={70} className={st.caption}>
            {goals.map((goal, index) => (
              <span key={goal.id} className={st.captionItem} data-active={index === step.active ? "" : undefined}>
                <span className={st.captionDot} />
                {goal.demo.caption}
              </span>
            ))}
          </Satellite>
        </PhoneStage>
      </div>
    </div>
  );
}
