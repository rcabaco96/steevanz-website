"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
 * one. The slides hold thumbnails; the pool's players (VideoPool) cover the one on screen once the
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
  onClose,
}: {
  items: ShortItem[];
  start: number;
  label: string;
  sound: boolean;
  onSound: () => void;
  onTargets: (targets: PoolTarget[]) => void;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const restTimer = useRef<number | undefined>(undefined);
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
      {/* Under the player (which lets taps through): a tap turns the sound on or off. */}
      <button type="button" onClick={onSound} aria-label={sound ? "Tirar o som" : "Ligar o som"} className="absolute inset-0" />
    </div>
  );
  const item = items[current];

  return (
    <div role="dialog" aria-modal="true" aria-label={label}>
      <div className="fixed inset-0 z-[90] bg-black">
        <div
          ref={scroller}
          onScroll={(event) => {
            const element = event.currentTarget;
            setScrolling(true);
            window.clearTimeout(restTimer.current);
            restTimer.current = window.setTimeout(() => setScrolling(false), scrollRest);
            const height = Math.max(1, element.clientHeight);
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
          className="h-full snap-y snap-mandatory overflow-y-auto overscroll-none [scrollbar-width:none]"
        >
          {loop ? (
            <section aria-hidden="true" className="grid h-[100dvh] snap-start snap-always place-items-center">
              {slide(items[items.length - 1], null)}
            </section>
          ) : null}
          {items.map((entry, index) => (
            <section key={entry.key} aria-label={`${index + 1} de ${items.length}: ${entry.title}`} className="grid h-[100dvh] snap-start snap-always place-items-center">
              {slide(entry, index)}
            </section>
          ))}
          {loop ? (
            <section aria-hidden="true" className="grid h-[100dvh] snap-start snap-always place-items-center">
              {slide(items[0], null)}
            </section>
          ) : null}
        </div>
      </div>
      {/* Above the pool's players (z 95): the buttons and what the dish on screen is. */}
      <div className="pointer-events-none fixed inset-0 z-[96] flex flex-col justify-between text-white">
        <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
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
            className={`flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-20 pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-opacity duration-200 ${scrolling ? "opacity-0" : "opacity-100"}`}
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
