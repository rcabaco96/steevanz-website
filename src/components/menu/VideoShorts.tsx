"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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
 * Hidden by the box: the top and bottom strips of YouTube's player, where it shows the title and its
 * logo. The frame is that much taller than the 9:16 box, so the vertical video fits its width with
 * these strips above and below it, outside the box.
 */
const chromeStrip = 64;
/**
 * The player always gets a phone's width and is scaled to the box: in small players (the grid's cards)
 * YouTube adds its Shorts overlay (likes, channel) over the video; at a phone's width it doesn't
 * (seen on 2026-10-14).
 */
const playerWidth = 360;
const playerHeight = (playerWidth * 16) / 9;
/** In full screen, the next video is prepared only once the current one has been on screen this long (ms). */
const preloadAfter = 900;

const command = (frame: HTMLIFrameElement | null, func: string, args: unknown[] = []) =>
  frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");

/**
 * Where each video was last seen playing (seconds), from the players' own reports: opening the full
 * screen carries on from there instead of starting the video again (owner, 2026-10-14).
 */
const positions = new Map<string, number>();
export const lastPosition = (video: string) => positions.get(video) ?? 0;

const playerParams = (id: string) =>
  new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    enablejsapi: "1",
  });

/**
 * One Short in a 9:16 box: YouTube's own thumbnail until the player has drawn. The player exists only
 * while `load` is true and plays while `active` (muted unless `sound`), from `startAt` seconds when
 * given; YouTube's controls stay out of reach under whatever the parent puts on top. Players are
 * removed again when `load` goes false: kept, a dozen of them made an iPhone reload the page while
 * swiping (owner, 2026-10-14).
 */
export function ShortPlayer({
  video,
  title,
  load,
  active,
  sound,
  startAt = 0,
}: {
  video: string;
  title: string;
  load: boolean;
  active: boolean;
  sound: boolean;
  startAt?: number;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  /** The time to jump to as soon as YouTube's player answers (its API isn't up at the frame's load). */
  const pendingSeek = useRef(0);
  /** What the player was last told (it starts playing, muted, by itself): commands only on a change. */
  const told = useRef<{ active: boolean; sound: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  // A removed player starts over (thumbnail first) when it comes back.
  if (!load && ready) setReady(false);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / playerWidth || 1));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The player reports its time once we listen (YouTube's iframe protocol): kept for the full screen.
  useEffect(() => {
    if (!load) return;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || typeof event.data !== "string") return;
      try {
        const data = JSON.parse(event.data) as { event?: string; info?: { currentTime?: number } };
        if ((data.event === "onReady" || data.event === "infoDelivery") && pendingSeek.current > 0) {
          command(frame.current, "seekTo", [pendingSeek.current, true]);
          pendingSeek.current = 0;
          return;
        }
        if (data.event === "infoDelivery" && typeof data.info?.currentTime === "number") positions.set(video, data.info.currentTime);
      } catch {
        // Not one of YouTube's messages.
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [load, video]);

  // Every command makes YouTube flash its controls (⏮ ⏸ ⏭) over the video: only real changes are sent.
  useEffect(() => {
    if (!ready) {
      told.current = null;
      return;
    }
    const before = told.current ?? { active: true, sound: false };
    if (sound !== before.sound) command(frame.current, sound ? "unMute" : "mute");
    if (active !== before.active) command(frame.current, active ? "playVideo" : "pauseVideo");
    told.current = { active, sound };
  }, [ready, active, sound]);

  return (
    <div ref={box} className="relative isolate h-full w-full overflow-hidden bg-black">
      {/* YouTube's own thumbnail; the 4:3 picture holds the vertical frame in its middle. Served by YouTube as is (no image optimisation spent on it). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${video}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {load ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${video}?${playerParams(video)}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          // YouTube refuses embeds that don't say which site they're on («Error 153»); the public pages'
          // layout sends no referrer (their links carry personal tokens), so this frame sends our origin.
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            pendingSeek.current = startAt > 0.5 ? startAt : 0;
            frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: video, channel: "widget" }), "*");
            window.setTimeout(() => setReady(true), 900);
          }}
          className="pointer-events-none absolute top-0 left-0 border-0"
          style={{
            width: playerWidth,
            height: playerHeight + chromeStrip * 2,
            maxWidth: "none",
            transform: `translateY(${-chromeStrip * scale}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        />
      ) : null}
    </div>
  );
}

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
 * one. Only the video on screen plays; the next one is prepared once the current one has stayed on
 * screen a moment (at most 2 players). The tapped video carries on from `startAt`. The sound, once
 * on, stays on from video to video. A carousel both ways (owner, 2026-10-14): after the last video
 * comes the first, and above the first comes the last. Copies of the last and of the first sit before
 * and after the list; landing on one jumps to the real video. Closes with ✕, Esc or the phone's back
 * button.
 */
export function ShortsViewer({ items, start, startAt = 0, label, onClose }: { items: ShortItem[]; start: number; startAt?: number; label: string; onClose: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(start);
  const [settledOn, setSettledOn] = useState<number | null>(null);
  const [leftStart, setLeftStart] = useState(false);
  const [sound, setSound] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      const element = scroller.current;
      if (!element) return;
      // Slide 0 is the copy of the last video and slide items.length + 1 the copy of the first (carousel).
      const loop = items.length > 1;
      const slide = Math.max(loop ? 0 : 1, Math.min(loop ? items.length + 1 : items.length, index + 1));
      element.scrollTo({ top: slide * element.clientHeight, behavior: "smooth" });
    },
    [items.length],
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
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("popstate", onPop);
    };
  }, [start, onClose]);

  // The next video is prepared only when the viewer stays on this one (fast swipes create nothing).
  useEffect(() => {
    const timer = window.setTimeout(() => setSettledOn(current), preloadAfter);
    return () => window.clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.history.back();
      if (event.key === "ArrowDown") goTo(current + 1);
      if (event.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[90] bg-black text-white">
      <div
        ref={scroller}
        onScroll={(event) => {
          const element = event.currentTarget;
          const height = Math.max(1, element.clientHeight);
          // Settled on a copy: on to the real video it shows, without a visible jump.
          if (items.length > 1 && Math.abs(element.scrollTop - (items.length + 1) * height) < 2) {
            element.scrollTop = height;
            setCurrent(0);
            setLeftStart(true);
            return;
          }
          if (items.length > 1 && element.scrollTop < 2) {
            element.scrollTop = items.length * height;
            setCurrent(items.length - 1);
            setLeftStart(true);
            return;
          }
          const index = Math.max(0, Math.min(items.length - 1, Math.round(element.scrollTop / height) - 1));
          if (index !== current) {
            setCurrent(index);
            if (index !== start) setLeftStart(true);
          }
        }}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]"
      >
        {items.length > 1 ? (
          // The copy of the last video before the first one (carousel): its thumbnail only, no player.
          <section aria-hidden="true" className="relative grid h-[100dvh] snap-start snap-always place-items-center">
            <div className="relative aspect-[9/16] h-auto max-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] overflow-hidden sm:rounded-2xl">
              <ShortPlayer video={items[items.length - 1].video} title={items[items.length - 1].title} load={false} active={false} sound={false} />
            </div>
          </section>
        ) : null}
        {items.map((item, index) => (
          <section key={item.key} aria-label={`${index + 1} de ${items.length}: ${item.title}`} className="relative grid h-[100dvh] snap-start snap-always place-items-center">
            <div className="relative aspect-[9/16] h-auto max-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] overflow-hidden sm:rounded-2xl">
              <ShortPlayer
                video={item.video}
                title={item.title}
                load={index === current || (index === current + 1 && settledOn === current)}
                active={index === current}
                sound={sound}
                startAt={index === start && !leftStart ? startAt : 0}
              />
              {/* Over the player: a tap turns the sound on or off. */}
              <button type="button" onClick={() => setSound(!sound)} aria-label={sound ? "Tirar o som" : "Ligar o som"} className="absolute inset-0" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-20 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <span className="text-xs font-semibold tracking-wide text-white/70">
                {index + 1} / {items.length}
              </span>
              <span className="line-clamp-2 text-lg font-semibold">{item.title}</span>
              {item.details ? <div className="text-sm text-white/85">{item.details}</div> : null}
            </div>
          </section>
        ))}
        {items.length > 1 ? (
          // The copy of the first video after the last one (carousel): its thumbnail only, no player.
          <section aria-hidden="true" className="relative grid h-[100dvh] snap-start snap-always place-items-center">
            <div className="relative aspect-[9/16] h-auto max-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] overflow-hidden sm:rounded-2xl">
              <ShortPlayer video={items[0].video} title={items[0].title} load={false} active={false} sound={false} />
            </div>
          </section>
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button type="button" onClick={() => window.history.back()} aria-label="Fechar" className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <button type="button" onClick={() => setSound(!sound)} aria-label={sound ? "Tirar o som" : "Ligar o som"} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-black/50 backdrop-blur-sm">
          <SoundIcon on={sound} />
        </button>
      </div>
    </div>
  );
}
