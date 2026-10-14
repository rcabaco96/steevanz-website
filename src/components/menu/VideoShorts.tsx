"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode, type TouchEvent, type WheelEvent } from "react";
import type { PoolTarget } from "./VideoPool";

/** A vertical YouTube video (Short) with what is shown over it. */
export interface ShortItem {
  /** Unique within the list. */
  key: string;
  /** YouTube video id. */
  video: string;
  title: string;
  /** Shown under the title (e.g. the price and the description of a dish). */
  details?: ReactNode;
}

/**
 * The video's own thumbnail (YouTube's, the 4:3 picture holds the vertical frame in its middle): the
 * box shows it until one of the pool's players covers it with the video playing (VideoPool).
 */
export function ShortCover({ video }: { video: string }) {
  return (
    // Served by YouTube as is (no image optimisation spent on it).
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`https://i.ytimg.com/vi/${video}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
  );
}

/**
 * In full screen, a video's player shows only once the viewer has stopped on it this long (ms); the
 * next one is prepared (loaded, paused) after \`preloadAfter\`. While swiping, the thumbnails slide.
 */
const showAfter = 250;
const preloadAfter = 900;
/** No scroll event for this long: the swipe has ended. */
const scrollRest = 140;
/** A swipe moves to the next or previous video past this share of the screen, or this fast (px/ms). */
const swipeShare = 0.18;
const swipeSpeed = 0.35;
/** One video per wheel gesture (ms between moves). */
const wheelGap = 450;
/** A gesture's direction is decided after this many px: vertical changes video, left-to-right closes. */
const axisAfter = 8;
/** The full screen closes when dragged right past this share of its width, or this fast (px/ms). */
const closeShare = 0.3;
const closeSpeed = 0.5;
const slideOutMs = 250;

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m22 9-6 6M16 9l6 6" />}
    </svg>
  );
}

/**
 * Full screen, one video per screen: swipe (or scroll, or the arrow keys) to the next or previous
 * one (no CSS snapping: the moves are ours and land exactly on a slide). The slides hold thumbnails; the pool's players (VideoPool) cover the one on screen once the
 * swipe has ended, and the next video is prepared in another player. A carousel both ways (owner,
 * 2026-10-14): copies of the last and of the first sit before and after the list, and landing on one
 * jumps to the real video. The sound, once on, stays on. Closes with ✕, Esc or the phone's back button.
 */
export function ShortsViewer({
  items,
  start,
  label,
  sound,
  onSound,
  onTargets,
  onShift,
  onClose,
}: {
  items: ShortItem[];
  start: number;
  label: string;
  sound: boolean;
  onSound: () => void;
  onTargets: (targets: PoolTarget[]) => void;
  /** How far the full screen is dragged to the right (the pool's players follow it), and whether it glides there. */
  onShift: (px: number, glide: boolean) => void;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const restTimer = useRef<number | undefined>(undefined);
  const gesture = useRef<{ x: number; y: number; top: number; at: number; axis: "vertical" | "close" | null } | null>(null);
  // Dragged to the right to close (owner, 2026-10-14: like the collections panel, following the finger).
  const [shift, setShift] = useState({ px: 0, glide: false });
  const moveTo = useCallback(
    (px: number, glide: boolean) => {
      setShift({ px, glide });
      onShift(px, glide);
    },
    [onShift],
  );
  const lastWheel = useRef(0);
  const [current, setCurrent] = useState(start);
  // The tapped video shows at once: its player is the one that was playing it in the grid.
  const [shownOn, setShownOn] = useState<number | null>(start);
  const [settledOn, setSettledOn] = useState<number | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const loop = items.length > 1;

  const goTo = useCallback(
    (index: number) => {
      const element = scroller.current;
      if (!element) return;
      // Slide 0 is the copy of the last video and slide items.length + 1 the copy of the first (carousel).
      const slide = Math.max(loop ? 0 : 1, Math.min(loop ? items.length + 1 : items.length, index + 1));
      element.scrollTo({ top: slide * element.clientHeight, behavior: "smooth" });
    },
    [items.length, loop],
  );

  // Open on the tapped video; lock the page behind; «back» closes.
  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = (start + 1) * element.clientHeight;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.history.pushState({ shortsViewer: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    const timer = restTimer;
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(timer.current);
    };
  }, [start, onClose]);

  useEffect(() => {
    const show = window.setTimeout(() => setShownOn(current), showAfter);
    const preload = window.setTimeout(() => setSettledOn(current), preloadAfter);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(preload);
    };
  }, [current]);

  // What the pool should play: the video on screen (shown once the swipe rests), and the next one prepared.
  useEffect(() => {
    const targets: PoolTarget[] = [];
    if (shownOn !== null && items[shownOn]) {
      targets.push({ key: "viewer-current", video: items[shownOn].video, element: boxes.current[shownOn], fixed: true, play: true, visible: shownOn === current && !scrolling });
    }
    if (settledOn === current && items.length > 1) {
      const next = (current + 1) % items.length;
      targets.push({ key: "viewer-next", video: items[next].video, element: boxes.current[next], fixed: true, play: false, visible: false });
    }
    onTargets(targets);
  }, [items, current, shownOn, settledOn, scrolling, onTargets]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.history.back();
      if (event.key === "ArrowDown") goTo(current + 1);
      if (event.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  const slide = (item: ShortItem, index: number | null) => (
    <div
      ref={
        index === null
          ? undefined
          : (box) => {
              boxes.current[index] = box;
            }
      }
      className="relative aspect-[9/16] h-auto max-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] overflow-hidden"
    >
      <ShortCover video={item.video} />
    </div>
  );

  /*
   * The gestures are ours, on a layer above everything (owner, 2026-10-14: swiping stopped working on
   * an iPhone): YouTube's frames sit over the slides and an iPhone can give them the touch even when
   * they let taps through. A vertical drag moves the list with the finger and, on release, to the next
   * or previous video (or back); a left-to-right drag moves the whole full screen with the finger and,
   * on release, closes it (or slides it back); a tap without moving turns the sound on or off.
   */
  const onGestureStart = (event: TouchEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const element = scroller.current;
    if (!element) return;
    const touch = event.touches[0];
    gesture.current = { x: touch.clientX, y: touch.clientY, top: element.scrollTop, at: performance.now(), axis: null };
  };
  const onGestureMove = (event: TouchEvent) => {
    const start = gesture.current;
    const element = scroller.current;
    if (!start || !element) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (!start.axis && Math.max(Math.abs(dx), Math.abs(dy)) > axisAfter) start.axis = Math.abs(dx) > Math.abs(dy) && dx > 0 ? "close" : "vertical";
    if (start.axis === "vertical") element.scrollTop = start.top - dy;
    if (start.axis === "close") moveTo(Math.max(0, dx), false);
  };
  const onGestureEnd = (event: TouchEvent) => {
    const start = gesture.current;
    const element = scroller.current;
    gesture.current = null;
    if (!start || !element || !start.axis) return;
    if (start.axis === "close") {
      const dx = Math.max(0, (event.changedTouches[0]?.clientX ?? start.x) - start.x);
      const width = Math.max(1, window.innerWidth);
      if (dx > width * closeShare || dx / Math.max(1, performance.now() - start.at) > closeSpeed) {
        moveTo(width, true);
        window.setTimeout(() => window.history.back(), slideOutMs);
      } else {
        moveTo(0, true);
      }
      return;
    }
    const height = Math.max(1, element.clientHeight);
    const moved = element.scrollTop - start.top;
    const speed = moved / Math.max(1, performance.now() - start.at);
    let target = Math.round(start.top / height);
    if (moved > height * swipeShare || speed > swipeSpeed) target += 1;
    else if (moved < -height * swipeShare || speed < -swipeSpeed) target -= 1;
    target = Math.max(loop ? 0 : 1, Math.min(loop ? items.length + 1 : items.length, target));
    element.scrollTo({ top: target * height, behavior: "smooth" });
  };
  const onGestureWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaY) < 12 || performance.now() - lastWheel.current < wheelGap) return;
    lastWheel.current = performance.now();
    goTo(current + (event.deltaY > 0 ? 1 : -1));
  };
  const onGestureTap = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    onSound();
  };
  const item = items[current];

  return (
    <div role="dialog" aria-modal="true" aria-label={label}>
      <div
        className="fixed inset-0 z-[90] bg-black"
        style={{ transform: `translateX(${shift.px}px)`, transition: shift.glide ? `transform ${slideOutMs}ms cubic-bezier(0.32, 0.72, 0, 1)` : "none" }}
      >
        <div
          ref={scroller}
          onScroll={(event) => {
            const element = event.currentTarget;
            setScrolling(true);
            window.clearTimeout(restTimer.current);
            restTimer.current = window.setTimeout(() => setScrolling(false), scrollRest);
            const height = Math.max(1, element.clientHeight);
            if (gesture.current) {
              const index = Math.max(0, Math.min(items.length - 1, Math.round(element.scrollTop / height) - 1));
              if (index !== current) setCurrent(index);
              return;
            }
            // Settled on a copy: on to the real video it shows, without a visible jump.
            if (loop && Math.abs(element.scrollTop - (items.length + 1) * height) < 2) {
              element.scrollTop = height;
              setCurrent(0);
              return;
            }
            if (loop && element.scrollTop < 2) {
              element.scrollTop = items.length * height;
              setCurrent(items.length - 1);
              return;
            }
            const index = Math.max(0, Math.min(items.length - 1, Math.round(element.scrollTop / height) - 1));
            if (index !== current) setCurrent(index);
          }}
          className="h-full overflow-y-auto overscroll-none [scrollbar-width:none]"
        >
          {loop ? (
            <section aria-hidden="true" className="grid h-[100dvh] place-items-center">
              {slide(items[items.length - 1], null)}
            </section>
          ) : null}
          {items.map((entry, index) => (
            <section key={entry.key} aria-label={`${index + 1} de ${items.length}: ${entry.title}`} className="grid h-[100dvh] place-items-center">
              {slide(entry, index)}
            </section>
          ))}
          {loop ? (
            <section aria-hidden="true" className="grid h-[100dvh] place-items-center">
              {slide(items[0], null)}
            </section>
          ) : null}
        </div>
      </div>
      {/* Above the pool's players (z 95): the gestures, the buttons and what the dish on screen is. */}
      <div
        onTouchStart={onGestureStart}
        onTouchMove={onGestureMove}
        onTouchEnd={onGestureEnd}
        onTouchCancel={onGestureEnd}
        onWheel={onGestureWheel}
        onClick={onGestureTap}
        className="fixed inset-0 z-[96] flex touch-none flex-col justify-between text-white select-none"
        style={{ transform: `translateX(${shift.px}px)`, transition: shift.glide ? `transform ${slideOutMs}ms cubic-bezier(0.32, 0.72, 0, 1)` : "none" }}
      >
        <div className="pointer-events-none flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <button type="button" onClick={() => window.history.back()} aria-label="Fechar" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <button type="button" onClick={onSound} aria-label={sound ? "Tirar o som" : "Ligar o som"} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur-sm">
            <SoundIcon on={sound} />
          </button>
        </div>
        {item ? (
          <div
            className={`pointer-events-none flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-20 pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-opacity duration-200 ${scrolling ? "opacity-0" : "opacity-100"}`}
          >
            <span className="text-xs font-semibold tracking-wide text-white/70">
              {current + 1} / {items.length}
            </span>
            <span className="line-clamp-2 text-lg font-semibold">{item.title}</span>
            {item.details ? <div className="text-sm text-white/85">{item.details}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
