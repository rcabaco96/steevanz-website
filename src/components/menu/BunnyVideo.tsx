"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import type Hls from "hls.js";

/** The pull zone that serves the dishes' own videos (Bunny Stream). */
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;

/** Bunny can serve this dish's own video (its id and a pull zone are known). */
export const hasBunnyVideo = (bunny?: string): bunny is string => Boolean(bunny && pullZone);

/** A card plays once this much of it is on screen. */
const playAtRatio = 0.5;
/** A video loads once it's within this distance of the screen (a screen ahead)... */
const nearMargin = "100% 0px";
/**
 * ...and is let go only beyond this one. On an iPhone, three screens: letting a video go and loading it
 * again stalls its scroll for an instant (owner, 2026-10-16: «repara nos breaks do scroll»; then «muito
 * clean»). Elsewhere (hls.js), a screen and a half, and only once the page rests: three screens kept
 * up to 24 players at once, and an Android slowed down («agora está mais lento no android»).
 */
const keepMargin = () => (playsHlsItself() ? "300% 0px" : "150% 0px");

let nativeHls: boolean | undefined;
/**
 * This browser plays HLS itself: an iPhone (Safari, and every iOS browser: all WebKit). Not Chrome or
 * Edge: they answer «maybe» too, but refused their own HLS (ERR_BLOCKED_BY_ORB, 2026-10-15).
 */
function playsHlsItself() {
  if (typeof window === "undefined") return false;
  nativeHls ??= /Apple/.test(navigator.vendor) && document.createElement("video").canPlayType("application/vnd.apple.mpegurl") !== "";
  return nativeHls;
}

/**
 * The page's scroll, for the grid with hls.js (an iPhone is left as it is): «fast» while it flies (a
 * fling), «moving», or «still» once it has rested `stillAfterMs`. A fling starts no video (loading or
 * decoding one stalls a phone's scroll); a slower scroll starts one at a time, `attachGapMs` apart;
 * videos are let go only when still.
 */
type Pace = "still" | "moving" | "fast";
/** px per second: above it the scroll is a fling, and it stays one until below the second. */
const fastScroll = 1600;
const slowScroll = 900;
const stillAfterMs = 160;
const attachGapMs = 120;
let pace: Pace = "still";
let paceSpeed = 0;
let paceY = 0;
let paceAt = 0;
let paceTimer: number | undefined;
let lastAttach = 0;
const paceListeners = new Set<() => void>();
function setPace(next: Pace) {
  if (next === pace) return;
  pace = next;
  for (const listener of paceListeners) listener();
}
function onPageScroll() {
  const now = performance.now();
  const y = window.scrollY;
  // Smoothed over a few frames (each scroll event is one frame's step).
  if (paceAt) paceSpeed = paceSpeed * 0.6 + ((Math.abs(y - paceY) / Math.max(1, now - paceAt)) * 1000) * 0.4;
  paceY = y;
  paceAt = now;
  setPace(paceSpeed > fastScroll || (pace === "fast" && paceSpeed > slowScroll) ? "fast" : "moving");
  window.clearTimeout(paceTimer);
  paceTimer = window.setTimeout(() => {
    paceAt = 0;
    paceSpeed = 0;
    setPace("still");
  }, stillAfterMs);
}
function subscribePace(listener: () => void) {
  // An iPhone: no work as it scrolls (it stays «still»).
  if (playsHlsItself()) return () => {};
  if (!paceListeners.size) window.addEventListener("scroll", onPageScroll, { passive: true });
  paceListeners.add(listener);
  return () => {
    paceListeners.delete(listener);
    if (paceListeners.size) return;
    window.removeEventListener("scroll", onPageScroll);
    window.clearTimeout(paceTimer);
    pace = "still";
  };
}

/**
 * hls.js's own worker (copied into public/ when the site is built: scripts/hls-worker.mjs), so the
 * cards' video is unpacked off the page's thread: the module build of hls.js has no worker of its own
 * and unpacked every card's video on it (Android, 2026-10-16). Missing, hls.js unpacks it on the page.
 */
const hlsWorker = (version: string) => `/hls/${version}/hls.worker.js`;

/**
 * With hls.js, its code and its worker load as soon as the menu's code runs, not when the first card
 * asks for them: the worker came only after the first piece of video (~0.3 s on the first frames of an
 * Android, 2026-10-16). An iPhone loads neither.
 */
if (typeof window !== "undefined" && !playsHlsItself()) {
  void import("hls.js/light")
    .then(({ default: HlsPlayer }) => {
      if (HlsPlayer.isSupported()) return fetch(hlsWorker(HlsPlayer.version));
    })
    .catch(() => {});
}

/**
 * Three observers for every video (near, kept, on screen), not three each: the browser works out every
 * observer's targets on each frame of a scroll (1.3 s of a mid-range Android's 30 s of scrolling with
 * three per card, 2026-10-16).
 */
type Watch = (entry: IntersectionObserverEntry) => void;
const watchers = new Map<string, { observer: IntersectionObserver; callbacks: Map<Element, Watch> }>();
function watch(element: Element, options: { rootMargin?: string; threshold?: number[] }, callback: Watch) {
  const key = `${options.rootMargin ?? ""}|${options.threshold ?? ""}`;
  let watcher = watchers.get(key);
  if (!watcher) {
    const callbacks = new Map<Element, Watch>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) callbacks.get(entry.target)?.(entry);
    }, options);
    watcher = { observer, callbacks };
    watchers.set(key, watcher);
  }
  const { observer, callbacks } = watcher;
  callbacks.set(element, callback);
  observer.observe(element);
  return () => {
    observer.unobserve(element);
    callbacks.delete(element);
  };
}

/**
 * On an iPhone, the first cards' videos start loading with the page, before its code (owner,
 * 2026-10-16: «não podem começar logo os vídeos?»; ~1 s earlier): this runs in the page's HTML right
 * after the grid, on the videos marked data-bunny-early, picks the card's rendition like
 * cardRendition, and shows the video once it has frames. Anywhere else (Android, computers: their HLS
 * needs hls.js) it does nothing. A failure takes the source off again, and the card loads as usual.
 */
export const bunnyEarlyScript = `(function(){var v=document.querySelectorAll("video[data-bunny-early]");if(!v.length||!/Apple/.test(navigator.vendor)||!v[0].canPlayType("application/vnd.apple.mpegurl"))return;for(var i=0;i<v.length;i++)(function(e){var w=e.clientWidth*(window.devicePixelRatio||1),r=w<=540?"480p":w<=800?"720p":"1080p";e.addEventListener("error",function(){e.removeAttribute("src");e.style.removeProperty("opacity");e.load()},{once:true});e.addEventListener("timeupdate",function t(){if(e.currentTime>0){e.style.opacity="1";e.removeEventListener("timeupdate",t)}});e.src=e.getAttribute("data-bunny-early")+"/"+r+"/video.m3u8";var p=e.play();if(p&&p.catch)p.catch(function(){})})(v[i])})();`;

/**
 * Videos on screen still waiting for their first frames: the ones near but off screen wait for them
 * before loading (2026-10-16: those off screen were ready before the ones on it), at most this long (ms).
 */
const starting = new Set<HTMLVideoElement>();
const whenStarted = new Set<() => void>();
const aheadWaitMs = 2500;
function markStarting(element: HTMLVideoElement, on: boolean) {
  if (on) starting.add(element);
  else if (starting.delete(element) && !starting.size) for (const go of whenStarted) go();
}

/**
 * The grid cards' videos by Bunny id: full screen carries on from where its card is (owner,
 * 2026-10-16: «quando abri em fullscreen o vídeo recomeça, não devia»).
 */
const cardVideos = new Map<string, HTMLVideoElement>();

/**
 * A card's quality: Bunny's rendition that fills its box on this screen (its width × the screen's
 * density), 480p on a phone. One fixed rendition, small segments: it starts at once.
 */
function cardRendition(element: HTMLElement): string {
  const pixels = element.clientWidth * (window.devicePixelRatio || 1);
  return pixels <= 540 ? "480p" : pixels <= 800 ? "720p" : "1080p";
}

/**
 * A dish's own video from Bunny Stream. In the grid, the one rendition that fills the card (480p on a
 * phone; owner's iPhone, 2026-10-16: «há alguns que não chegam a carregar»: each card on Bunny's adaptive
 * stream took 1080p or 4K, and an iPhone gave up decoding several at once; the 720p MP4 was too heavy for
 * four cards at once). Full screen, Bunny's adaptive stream (HLS) up to the library's best resolution (owner: «quero
 * tipo 4k»): natively on an iPhone, hls.js elsewhere (loaded only then), capped to the screen's size.
 * Each video loads a screen ahead and is let go a screen behind (the phone never holds dozens of them);
 * its picture stays under it until it has frames playing, then it fades in (owner: «aparece só a imagem e
 * depois o vídeo», «pára com os flashes»). Silent, looping, inline: in the grid while half on screen, in
 * full screen when `playing` (its neighbours load ahead).
 */
export function BunnyVideo({
  id,
  thumbnail,
  playing,
  early = false,
  onShown,
}: {
  id: string;
  /** Its small picture's file name. */
  thumbnail?: string;
  playing?: boolean;
  /** One of the first cards: on an iPhone it starts loading with the page (bunnyEarlyScript). */
  early?: boolean;
  /** Its video shows, playing (once each time it starts). */
  onShown?: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  const hls = useRef<Hls | null>(null);
  // The first cards start on screen (one started early must not be let go before the observers report).
  const [near, setNear] = useState(early);
  const [kept, setKept] = useState(true);
  const [seen, setSeen] = useState(early);
  // It has a source (until let go).
  const [live, setLive] = useState(early);
  const [shown, setShown] = useState(false);
  const [ahead, setAhead] = useState(false);
  // A video started while the scroll moves waits its turn (attachGapMs).
  const [turn, setTurn] = useState(0);
  const [scroll, setScroll] = useState<Pace>("still");
  // Full screen: the card's frame (shown until this video is there) and where to carry on from.
  const frame = useRef<HTMLCanvasElement>(null);
  const resume = useRef<{ at: number; since: number } | null>(null);
  const full = playing !== undefined;
  const active = full ? playing : seen;
  // With hls.js, a grid card's video starts, and is let go, only as the scroll allows (an iPhone's
  // scroll stays «still»: subscribePace).
  const flying = !full && scroll === "fast";
  // On screen (or full screen): at once. Near in the grid: once those on screen have started.
  const load = !flying && (active || (near && (full || ahead)));
  // A loaded video stays loaded while within keepMargin (in the grid with hls.js, until the page rests).
  const keep = active || near || kept || (!full && scroll !== "still");
  // With hls.js, a grid card has its <video> only around the screen (or while it holds a source): the
  // browser tracks every video element on each frame of a scroll, and a menu has dozens. An iPhone keeps
  // them all, as before (all of them are in the page's HTML: the first cards start there).
  const mounted = full || active || near || kept || live || playsHlsItself();
  const base = `https://${pullZone}.b-cdn.net/${id}`;

  // The scroll's pace, for a grid card with its video element (the others start nothing). A transition:
  // dozens of cards drawn again at once in one go stalled a slow Android's scroll (50–70 ms).
  useEffect(() => {
    if (full || !mounted) return;
    const update = () => startTransition(() => setScroll(pace));
    const stop = subscribePace(update);
    update();
    return () => {
      stop();
      startTransition(() => setScroll("still"));
    };
  }, [full, mounted]);

  // Near the screen (loads), and half on it (a grid card plays): its picture, always there.
  useEffect(() => {
    const element = picture.current;
    if (!element) return;
    const stops = [
      watch(element, { rootMargin: nearMargin }, (entry) => setNear(entry.isIntersecting)),
      watch(element, { rootMargin: keepMargin() }, (entry) => setKept(entry.isIntersecting)),
      watch(element, { threshold: [0, playAtRatio, 1] }, (entry) => setSeen(entry.intersectionRatio >= playAtRatio)),
    ];
    return () => stops.forEach((stop) => stop());
  }, []);

  // A grid card: full screen finds it.
  useEffect(() => {
    const element = video.current;
    if (!element || full) return;
    cardVideos.set(id, element);
    return () => {
      if (cardVideos.get(id) === element) cardVideos.delete(id);
    };
  }, [id, full, mounted]);

  // Full screen, now playing: carries on from its card (the card's frame shown meanwhile).
  useEffect(() => {
    const element = video.current;
    const card = cardVideos.get(id);
    if (!element || !full || !playing || !card || card.readyState < 2 || card.currentTime <= 0) return;
    resume.current = { at: card.currentTime, since: performance.now() };
    const canvas = frame.current;
    if (canvas && !shown) {
      canvas.width = card.videoWidth;
      canvas.height = card.videoHeight;
      try {
        canvas.getContext("2d")?.drawImage(card, 0, 0);
      } catch {
        // A frame that can't be copied: the picture under it shows instead.
      }
    }
    const seek = () => {
      const at = resume.current;
      if (!at || !element.duration) return;
      resume.current = null;
      element.currentTime = (at.at + (performance.now() - at.since) / 1000) % element.duration;
    };
    if (element.readyState >= 1) seek();
    element.addEventListener("loadedmetadata", seek);
    return () => element.removeEventListener("loadedmetadata", seek);
    // Once per opening: not again when this video starts showing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, playing, id]);

  // A card near the screen loads ahead once the cards on screen have their first frames.
  useEffect(() => {
    if (!near || full || ahead) return;
    const go = () => setAhead(true);
    if (!starting.size) return go();
    whenStarted.add(go);
    const timer = window.setTimeout(go, aheadWaitMs);
    return () => {
      whenStarted.delete(go);
      window.clearTimeout(timer);
    };
  }, [near, full, ahead]);

  // On screen and not playing yet: the cards off screen wait for it.
  useEffect(() => {
    const element = video.current;
    if (!element || !active || shown) return;
    markStarting(element, true);
    return () => markStarting(element, false);
  }, [active, shown]);

  // Loads the source when near, lets it go when far.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const mp4 = `${base}/play_720p.mp4`;
    // A player left on a video element that is gone (never expected): dropped.
    if (hls.current && hls.current.media !== element) {
      hls.current.destroy();
      hls.current = null;
    }
    const attached = Boolean(element.getAttribute("src") || hls.current);
    if (attached && !keep) {
      hls.current?.destroy();
      hls.current = null;
      element.removeAttribute("src");
      element.style.removeProperty("opacity");
      element.load();
      setShown(false);
      setLive(false);
      return;
    }
    if (attached || !load) return;
    // The scroll moving: one video started at a time.
    if (!full && scroll !== "still") {
      const wait = lastAttach + attachGapMs - performance.now();
      if (wait > 0) {
        const timer = window.setTimeout(() => setTurn((count) => count + 1), wait);
        return () => window.clearTimeout(timer);
      }
    }
    lastAttach = performance.now();
    let cancelled = false;
    // Full screen: the adaptive stream (every rendition); a card: its one rendition.
    const stream = full ? `${base}/playlist.m3u8` : `${base}/${cardRendition(element)}/video.m3u8`;
    const attach = async () => {
      // An iPhone (Safari, and every iOS browser: all WebKit) plays HLS itself. Not Chrome or Edge:
      // they answer «maybe» too, but refused their own HLS (ERR_BLOCKED_BY_ORB, 2026-10-15).
      const canNative = element.canPlayType("application/vnd.apple.mpegurl") !== "";
      if (/Apple/.test(navigator.vendor) && canNative) {
        element.src = stream;
        return;
      }
      // The light build: no subtitles, other audio tracks or DRM (Bunny's streams here are video only).
      const { default: HlsPlayer } = await import("hls.js/light");
      if (cancelled) return;
      if (!HlsPlayer.isSupported()) {
        element.src = canNative ? stream : mp4;
        return;
      }
      // A card buffers one segment ahead (4 s): the cards waiting off screen hold only their start, not
      // the whole clip each (7.6 MB in the first seconds, 2026-10-16).
      // Full screen carrying on from its card: hls.js starts there (a seek before its first segment stalled it).
      const at = full ? resume.current : null;
      if (at) resume.current = null;
      const workerPath = hlsWorker(HlsPlayer.version);
      const player = new HlsPlayer(
        full
          ? { workerPath, capLevelToPlayerSize: true, startLevel: -1, maxBufferLength: 12, startPosition: at ? at.at + (performance.now() - at.since) / 1000 : -1 }
          : { workerPath, maxBufferLength: 4, maxMaxBufferLength: 8 },
      );
      hls.current = player;
      player.on(HlsPlayer.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        player.destroy();
        hls.current = null;
        element.src = mp4;
      });
      player.loadSource(stream);
      player.attachMedia(element);
    };
    void attach();
    return () => {
      cancelled = true;
    };
    // `scroll` and `turn`: a video waiting its turn starts once the scroll allows.
  }, [load, keep, full, base, scroll, turn, mounted]);

  // Plays while active (once the source is there), pauses otherwise; a fling starts none (those
  // already playing go on).
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!active) {
      // Only one that plays: every card's effect runs again as the scroll changes pace.
      if (!element.paused) element.pause();
      return;
    }
    if (flying) return;
    const play = () => {
      if (element.paused) void element.play().catch(() => {});
    };
    play();
    // The source may only just be attaching (hls.js loads first): play once it can.
    element.addEventListener("canplay", play);
    return () => element.removeEventListener("canplay", play);
  }, [active, load, flying]);

  useEffect(
    () => () => {
      hls.current?.destroy();
      hls.current = null;
    },
    [],
  );

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- Bunny's own picture of the video */}
      <img ref={picture} src={`${base}/${thumbnail || "thumbnail.jpg"}`} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {full ? <canvas ref={frame} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" /> : null}
      {mounted ? (
        <video
          ref={video}
          data-bunny-early={early ? base : undefined}
          muted
          loop
          playsInline
          preload={active ? "auto" : "metadata"}
          disablePictureInPicture
          // It has a source now: it stays until let go.
          onLoadStart={live || playsHlsItself() ? undefined : () => setLive(true)}
          onTimeUpdate={
            shown
              ? undefined
              : (event) => {
                  // Not while seeking (full screen carrying on from its card): its frames aren't there yet.
                  if (event.currentTarget.currentTime <= 0 || event.currentTarget.seeking) return;
                  setShown(true);
                  onShown?.();
                }
          }
          onError={(event) => {
            // The browser's own HLS failed: the MP4 instead (that one failing too leaves the picture).
            const element = event.currentTarget;
            if (!element.getAttribute("src")?.endsWith(".m3u8")) return;
            element.src = `${base}/play_720p.mp4`;
            if (active) void element.play().catch(() => {});
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
        />
      ) : null}
    </>
  );
}
