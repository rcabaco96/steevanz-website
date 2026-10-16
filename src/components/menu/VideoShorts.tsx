"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type TouchEvent, type WheelEvent } from "react";
import { BunnyVideo, hasBunnyVideo } from "./BunnyVideo";

/** A dish's vertical video with what is shown over it. */
export interface ShortItem {
  /** Unique within the list. */
  key: string;
  /** Its video on Bunny Stream: played by a plain <video> in its slide. */
  bunny: string;
  /** That video's small picture (file name on Bunny). */
  bunnyThumbnail?: string;
  title: string;
  /** Shown under the title (e.g. the price and the description of a dish). */
  details?: ReactNode;
}

/**
 * A slide's height: the scroller's own, to the fraction of a pixel. The slides are exactly as tall
 * (h-full); with 100dvh slides and the rounded clientHeight, Android's fractional difference added up
 * slide after slide and the previous video showed as a strip at the top (owner, 2026-10-16, slide 19).
 */
const slideHeight = (element: HTMLElement) => Math.max(1, element.getBoundingClientRect().height);
/** A swipe moves to the next or previous video past this share of the screen, or this fast (px/ms). */
const swipeShare = 0.18;
const swipeSpeed = 0.35;
/** One video per wheel gesture (ms between moves). */
const wheelGap = 450;
/** A gesture's direction is decided after this many px: vertical changes video, left-to-right closes. */
const axisAfter = 8;
/** The full screen closes when dragged right past this share of its width, or this fast (px/ms). */
const closeShare = 0.25;
const closeSpeed = 0.5;
/** The full screen sliding out, or back (ms; the collections panel's). */
const closeMs = 260;
const glideEase = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * How far the full screen is dragged to the right to close it, like the collections panel (owner,
 * 2026-10-14: the shrink back into the card was dropped).
 */
interface ViewerMotion {
  x: number;
  /** Glides there (release) instead of following the finger. */
  glide: boolean;
}

const restingMotion: ViewerMotion = { x: 0, glide: false };


/**
 * Full screen, one video per screen: swipe (or scroll, or the arrow keys) to the next or previous
 * one (no CSS snapping: the moves are ours and land exactly on a slide). Each slide plays its dish's
 * own video (BunnyVideo) while it is the one on screen. A carousel both ways (owner, 2026-10-14):
 * copies of the last and of the first sit before and after the list, and landing on one jumps to the
 * real video. Always silent. Closes with ✕, Esc, the phone's back button,
 * or dragging it to the right: it slides out with the finger, like the collections panel.
 */
export function ShortsViewer({
  items,
  start,
  label,
  onClose,
}: {
  items: ShortItem[];
  start: number;
  label: string;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  // The carousel's copies (of the last video, before the list; of the first, after it).
  const copyBefore = useRef<HTMLDivElement | null>(null);
  const copyAfter = useRef<HTMLDivElement | null>(null);
  const gesture = useRef<{ x: number; y: number; dx: number; dy: number; top: number; at: number; axis: "vertical" | "close" | null } | null>(null);
  const [motion, moveTo] = useState<ViewerMotion>(restingMotion);
  const lastWheel = useRef(0);
  const [current, setCurrent] = useState(start);
  const loop = items.length > 1;

  const goTo = useCallback(
    (index: number) => {
      const element = scroller.current;
      if (!element) return;
      // Slide 0 is the copy of the last video and slide items.length + 1 the copy of the first (carousel).
      const slide = Math.max(loop ? 0 : 1, Math.min(loop ? items.length + 1 : items.length, index + 1));
      element.scrollTo({ top: slide * slideHeight(element), behavior: "smooth" });
    },
    [items.length, loop],
  );

  // Open on the tapped video; lock the page behind; «back» closes.
  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = (start + 1) * slideHeight(element);
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.history.pushState({ shortsViewer: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("popstate", onPop);
    };
  }, [start, onClose]);

  // Turned or resized: back onto the video on screen (the slides change height).
  const currentRef = useRef(current);
  useLayoutEffect(() => {
    currentRef.current = current;
  });
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollTop = (currentRef.current + 1) * slideHeight(element);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.history.back();
      if (event.key === "ArrowDown") goTo(current + 1);
      if (event.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  const slide = (item: ShortItem, index: number | "before" | "after") => (
    <div
      ref={(box) => {
        if (index === "before") copyBefore.current = box;
        else if (index === "after") copyAfter.current = box;
        else boxes.current[index] = box;
      }}
      className="relative aspect-[9/16] h-full w-auto max-w-none overflow-hidden"
    >
      {hasBunnyVideo(item.bunny) ? <BunnyVideo id={item.bunny} thumbnail={item.bunnyThumbnail} playing={index === current} /> : null}
    </div>
  );

  /*
   * The gestures are ours, on a layer above everything (owner, 2026-10-14: swiping stopped working on
   * an iPhone, when YouTube's frames sat over the slides). A vertical drag moves the list with the finger and, on release, to the next
   * or previous video (or back); a left-to-right drag moves the whole full screen with the finger and,
   * on release, closes it (or slides it back).
   */
  const onGestureStart = (event: TouchEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const element = scroller.current;
    if (!element) return;
    const touch = event.touches[0];
    gesture.current = { x: touch.clientX, y: touch.clientY, dx: 0, dy: 0, top: element.scrollTop, at: performance.now(), axis: null };
  };
  const onGestureMove = (event: TouchEvent) => {
    const start = gesture.current;
    const element = scroller.current;
    if (!start || !element) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    start.dx = dx;
    start.dy = dy;
    if (!start.axis && Math.max(Math.abs(dx), Math.abs(dy)) > axisAfter) start.axis = Math.abs(dx) > Math.abs(dy) && dx > 0 ? "close" : "vertical";
    if (start.axis === "vertical") element.scrollTop = start.top - dy;
    // The whole full screen follows the finger to the right; the menu (still playing) shows behind.
    if (start.axis === "close") moveTo({ x: Math.max(0, dx), glide: false });
  };
  const onGestureEnd = () => {
    const start = gesture.current;
    const element = scroller.current;
    gesture.current = null;
    if (!start || !element || !start.axis) return;
    if (start.axis === "close") {
      const width = Math.max(1, window.innerWidth);
      if (start.dx > width * closeShare || start.dx / Math.max(1, performance.now() - start.at) > closeSpeed) {
        moveTo({ x: width, glide: true });
        window.setTimeout(() => window.history.back(), closeMs);
      } else {
        moveTo({ x: 0, glide: true });
      }
      return;
    }
    const height = slideHeight(element);
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
  const item = items[current];
  const slid = { transform: `translateX(${motion.x}px)`, transition: motion.glide ? `transform ${closeMs}ms ${glideEase}` : "none" };

  return (
    <div role="dialog" aria-modal="true" aria-label={label}>
      <div className="fixed inset-0 z-[90] bg-black" style={slid}>
        <div
          ref={scroller}
          onScroll={(event) => {
            const element = event.currentTarget;
            const height = slideHeight(element);
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
          className="absolute inset-0 overflow-y-auto overscroll-none [scrollbar-width:none]"
        >
          {loop ? (
            <section aria-hidden="true" className="grid h-full place-items-center overflow-hidden">
              {slide(items[items.length - 1], "before")}
            </section>
          ) : null}
          {items.map((entry, index) => (
            <section key={entry.key} aria-label={`${index + 1} de ${items.length}: ${entry.title}`} className="grid h-full place-items-center overflow-hidden">
              {slide(entry, index)}
            </section>
          ))}
          {loop ? (
            <section aria-hidden="true" className="grid h-full place-items-center overflow-hidden">
              {slide(items[0], "after")}
            </section>
          ) : null}
        </div>
      </div>
      {/* Above the slides: the gestures, the buttons and what the dish on screen is. */}
      <div
        onTouchStart={onGestureStart}
        onTouchMove={onGestureMove}
        onTouchEnd={onGestureEnd}
        onTouchCancel={onGestureEnd}
        onWheel={onGestureWheel}
        className="fixed inset-0 z-[96] flex touch-none flex-col justify-between text-white select-none"
        style={slid}
      >
        <div className="pointer-events-none flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <button type="button" onClick={() => window.history.back()} aria-label="Fechar" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        {item ? (
          <div
            className={`pointer-events-none flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-20 pb-[max(1.25rem,env(safe-area-inset-bottom))]`}
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
