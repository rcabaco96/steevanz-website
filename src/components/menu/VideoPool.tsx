"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { glideEase, type ViewerMotion } from "./VideoShorts";

/**
 * Where a video should be: a box on the page (a grid card, or a full-screen slide) that the pool
 * covers with one of its players.
 */
export interface PoolTarget {
  key: string;
  video: string;
  element: HTMLElement | null;
  /** In the full screen (viewport coordinates, above it); else on the page (scrolls with it). */
  fixed: boolean;
  /** Plays (else ready ahead, or paused). */
  play: boolean;
  /**
   * Ready ahead: playing too (muted), so it is already moving when it comes on screen (the next and
   * previous videos in full screen). Never paused to wait: on an iPhone, YouTube shows its ⏸ over a
   * video that is paused and played again (owner, 2026-10-14).
   */
  prime?: boolean;
  /** Shown (once playing); hidden players keep their video, under the covers. */
  visible: boolean;
}

/**
 * A fixed pool of YouTube players, made once and never destroyed (owner, 2026-10-14: «estamos
 * sempre a apagar e carregar de novo o player? Não faz sentido»). Each YouTube player is a whole page
 * (~56 requests, ~1.9 MB, its memory): creating and dropping them made iPhones reload the page. Here
 * a player changes video with YouTube's own command (loadVideoById, no reload) and moves (CSS only,
 * never re-parented, which would reload it) over whichever box needs it. A box shows its thumbnail
 * until its player reports the video playing, so YouTube's black loading screen never shows. The
 * player that was playing a card is the one that grows to full screen: the video carries on.
 */
/**
 * 6: the dishes on screen in the grid (two rows of two) and the next row (in the scroll's direction)
 * already playing, hidden; in full screen, the video and the ones above and below. 8 made the site
 * slow, 4 left the next row to start as it appeared (owner, 2026-10-14). Each player is a whole
 * YouTube page (memory): one per dish would make an iPhone reload the page.
 */
export const poolSize = 6;
/**
 * A player shows over the thumbnail only once its own video (by the id YouTube reports) has played
 * this far (s): at YouTube's first «playing» the video hasn't drawn a frame yet (a black break), and
 * after a video change the old video's reports still arrive for a moment.
 */
const shownAfterSeconds = 0.3;
/**
 * Players are made in batches of `batchSize`, the dishes on screen first (the top row, then the next),
 * the ones ready ahead last; the next batch once the made ones show their videos, or after
 * `extraPlayersAfterMs`. Each YouTube player costs ~3 s of a mid-range Android's processor to start
 * (measured 2026-10-15: YouTube's code took 11 of 18 s; ours 0.4 s), so 4 at once made every video wait
 * ~17 s; two at a time, the first row shows in about half that (owner: «os vídeos demoram imenso»).
 */
const batchSize = 2;
const extraPlayersAfterMs = 3000;
/**
 * The site's address, for the players written into the page's HTML (`first`): the browser starts
 * loading them while the page's own code is still downloading (owner, 2026-10-15: on an Android the
 * videos took ~25 s; the players only started after ~4.7 s of page start-up). Anywhere else (a preview,
 * dev) the players are made again on the right address once the page runs.
 */
const productionOrigin = "https://www.steevanz.com";

/**
 * YouTube buffering this long (ms) hides the video under its thumbnail (its loading circle would show);
 * shorter stalls stay on the frame.
 */
const bufferGraceMs = 300;
/**
 * A playing player keeps at least this much of itself inside the screen (px), invisible when its box
 * is off it: an iPhone pauses a muted video playing off screen (the full screen's next and previous
 * videos). Paused players without a box wait off screen: an iPhone draws its own video controls (▶,
 * the timeline) over a paused video even when it is invisible (owner's screen recording, 2026-10-14).
 */
const keepInView = 2;
/** Players get a phone's width and are scaled to the box (small YouTube players add a Shorts overlay). */
const playerWidth = 360;
const playerHeight = (playerWidth * 16) / 9;
/** YouTube's title (top) and logo (bottom) strips, kept outside the box. */
const chromeStrip = 64;

interface Player {
  video: string | null;
  target: string | null;
  ready: boolean;
  /** YouTube's state: 1 playing, 2 paused, 3 buffering, 5 cued, 0 ended, -1 unstarted/loading. */
  state: number;
  /** Commands sent before YouTube's API answered. */
  queue: string[];
  playing: boolean;
  /** Told to run (play or prime); else paused, out of sight. */
  running: boolean;
  /** Where its video was (re)started (s): frames count from there. */
  from: number;
  /** The video YouTube says it has, and how far it has played (s). */
  reported: string | null;
  time: number;
  /** The video it has really started showing frames of: stays so through its loops. */
  showing: string | null;
  /** When it last started buffering (performance.now()). */
  bufferingAt: number;
}

interface Placement {
  top: number;
  left: number;
  width: number;
  height: number;
  fixed: boolean;
  shown: boolean;
}

const samePlacement = (a: Placement | null, b: Placement | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5 &&
    a.fixed === b.fixed &&
    a.shown === b.shown);

const embedSrc = (video: string, origin: string, autoplay: boolean) =>
  `https://www.youtube-nocookie.com/embed/${video}?${new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    controls: "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    enablejsapi: "1",
    origin,
  })}`;

export function VideoPool({
  targets,
  enabled,
  motion,
  onReady,
  first,
}: {
  targets: PoolTarget[];
  enabled: boolean;
  /** The videos on screen when the page opens: their players are in the page's HTML, already loading. */
  first?: string[];
  /** The full screen dragged to close: its players (fixed) slide with it. */
  motion?: ViewerMotion;
  /** The targets whose player is showing their video (e.g. a new collection is ready). */
  onReady?: (keys: string[]) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  // The page's first videos: the first batch's players are in the HTML; the others already know their video.
  const opening = (first ?? []).slice(0, poolSize);
  const early = opening.slice(0, batchSize);
  const players = useRef<Player[]>(
    Array.from({ length: poolSize }, (_, index) => ({ video: opening[index] ?? null, target: null, ready: false, state: -1, queue: [], playing: false, running: Boolean(opening[index]), from: 0, reported: null, time: 0, showing: null, bufferingAt: 0 })),
  );
  const [sources, setSources] = useState<(string | null)[] | null>(() => (early.length ? Array.from({ length: poolSize }, (_, index) => (early[index] ? embedSrc(early[index], productionOrigin, true) : null)) : null));
  // How many players exist (made), and how many may (batches × batchSize).
  const made = useRef(early.length);
  const [batches, setBatches] = useState(1);
  // Players from the HTML wait on the screen (unseen) until the grid gives them their cards.
  const [placedOnce, setPlacedOnce] = useState(false);
  // Not on the site's address (a preview, dev): YouTube would answer the wrong page; made again here.
  useEffect(() => {
    if (!early.length || window.location.origin === productionOrigin) return;
    players.current.forEach((player) => Object.assign(player, { video: null, target: null, ready: false, state: -1, queue: [], playing: false, running: false, from: 0, reported: null, time: 0, showing: null }));
    made.current = 0;
    const timer = window.setTimeout(() => setSources(null));
    return () => window.clearTimeout(timer);
    // Only on the first run: the HTML's players.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [placements, setPlacements] = useState<(Placement | null)[]>(() => Array(poolSize).fill(null));
  const [, setTick] = useState(0);
  const targetsRef = useRef(targets);
  const reported = useRef("");
  const onReadyRef = useRef(onReady);
  useLayoutEffect(() => {
    onReadyRef.current = onReady;
  });
  useLayoutEffect(() => {
    targetsRef.current = targets;
  });

  const send = useCallback((index: number, func: string, args: unknown[] = []) => {
    const message = JSON.stringify({ event: "command", func, args });
    const player = players.current[index];
    if (!player.ready) {
      player.queue.push(message);
      return;
    }
    frames.current[index]?.contentWindow?.postMessage(message, "*");
  }, []);

  // The players are made once, as soon as the grid says which videos are on screen (during the
  // opening, so they are already playing when it ends; owner 2026-10-14), each on one of those videos.
  useEffect(() => {
    if (!enabled || sources || !targets.length) return;
    const origin = window.location.origin;
    const start = targets;
    const fallback = start[0]?.video ?? "";
    const initial = players.current.map((player, index) => {
      const target = start[index];
      player.video = target?.video ?? fallback;
      // A player made for a box that plays (or is primed) starts by itself: a «play» command would make
      // YouTube show its ⏸ over the video for a few seconds.
      if (target?.play || target?.prime) {
        player.target = target.key;
        player.playing = Boolean(target.play);
        player.running = true;
      }
      // Only the first batch of dishes on screen now; the rest in later batches.
      return target?.play && index < batchSize ? embedSrc(player.video, origin, true) : null;
    });
    made.current = initial.filter(Boolean).length;
    setSources(initial);
  }, [enabled, sources, targets]);
  // The next batch: once the made players show their videos (place() moves on), or after a while.
  useEffect(() => {
    if (!sources || made.current >= poolSize) return;
    const timer = window.setTimeout(() => setBatches((count) => count + 1), extraPlayersAfterMs);
    return () => window.clearTimeout(timer);
  }, [sources, batches]);
  useEffect(() => {
    if (!sources) return;
    const allowed = Math.min(poolSize, batches * batchSize);
    const missing = sources.map((src, index) => (src ? -1 : index)).filter((index) => index >= 0);
    if (!missing.length || made.current >= allowed) return;
    // The dishes on screen first, then the ones ready ahead.
    const pool = players.current;
    const rank = (index: number) => (pool[index].playing ? 0 : pool[index].running ? 1 : 2);
    const chosen = new Set(missing.sort((a, b) => rank(a) - rank(b) || a - b).slice(0, allowed - made.current));
    made.current += chosen.size;
    const origin = window.location.origin;
    const fallback = pool.find((player) => player.video)?.video ?? "";
    setSources((previous) =>
      previous
        ? previous.map((src, index) => {
            if (src || !chosen.has(index)) return src;
            // Made on whatever video it was given meanwhile (the commands queued for it are dropped).
            const player = players.current[index];
            player.queue = [];
            player.state = -1;
            player.showing = null;
            player.from = 0;
            if (!player.video) player.video = fallback;
            return embedSrc(player.video ?? fallback, origin, player.running);
          })
        : previous,
    );
  }, [batches, sources]);

  // YouTube's messages: ready, state changes, the video looping when it ends.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const index = frames.current.findIndex((frame) => frame && event.source === frame.contentWindow);
      if (index < 0 || typeof event.data !== "string") return;
      let data: { event?: string; info?: unknown };
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      const player = players.current[index];
      if (data.event === "onReady" && !player.ready) {
        player.ready = true;
        for (const message of player.queue.splice(0)) frames.current[index]?.contentWindow?.postMessage(message, "*");
        setTick((tick) => tick + 1);
        return;
      }
      const info = (data.event === "infoDelivery" && data.info && typeof data.info === "object" ? data.info : {}) as {
        playerState?: number;
        currentTime?: number;
        videoData?: { video_id?: string };
      };
      if (typeof info.videoData?.video_id === "string") player.reported = info.videoData.video_id;
      if (typeof info.currentTime === "number") player.time = info.currentTime;
      const showing = player.showing;
      // Frames are on screen: its own video, playing, a moment in.
      if (player.reported === player.video && player.state === 1 && player.time >= player.from + shownAfterSeconds) player.showing = player.video;
      const state = data.event === "onStateChange" && typeof data.info === "number" ? data.info : typeof info.playerState === "number" ? info.playerState : null;
      if (state === null || state === player.state) {
        if (player.showing !== showing) setTick((tick) => tick + 1);
        return;
      }
      player.state = state;
      if (state === 3) {
        player.bufferingAt = performance.now();
        window.setTimeout(() => setTick((tick) => tick + 1), bufferGraceMs + 20);
      }
      // Each video loops on its own (YouTube's loop parameter would bring back the first video); a seek
      // from the end plays on by itself (no «play» command, no ⏸).
      if (state === 0 && player.running) frames.current[index]?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [0, true] }), "*");
      // Paused by the browser or YouTube (not by us): hidden under its thumbnail, and loaded again where it was.
      if (state === 2 && player.running && player.video) {
        player.from = player.time;
        player.showing = null;
        frames.current[index]?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "loadVideoById", args: [player.video, player.time] }), "*");
      }
      setTick((tick) => tick + 1);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Targets → players: a player already on a target's video keeps it (no reload, no restart); the
  // others take a free player and load (or cue) the video; players without a target pause.
  useEffect(() => {
    if (!sources) return;
    const pool = players.current;
    const taken = new Set<number>();
    const assignment = new Map<string, number>();
    for (const target of targets) {
      const same = pool.findIndex((player, index) => !taken.has(index) && player.target === target.key && player.video === target.video);
      const sameVideo = same >= 0 ? same : pool.findIndex((player, index) => !taken.has(index) && player.video === target.video);
      if (sameVideo >= 0) {
        taken.add(sameVideo);
        assignment.set(target.key, sameVideo);
      }
    }
    for (const target of targets) {
      if (assignment.has(target.key)) continue;
      const wanted = new Set(targets.map((candidate) => candidate.key));
      let free = pool.findIndex((player, index) => !taken.has(index) && (!player.target || !wanted.has(player.target)));
      if (free < 0) free = pool.findIndex((_, index) => !taken.has(index));
      if (free < 0) continue;
      taken.add(free);
      assignment.set(target.key, free);
      const player = pool[free];
      const run = Boolean(target.play || target.prime);
      player.video = target.video;
      player.state = -1;
      player.showing = null;
      player.from = 0;
      player.running = run;
      send(free, run ? "loadVideoById" : "cueVideoById", [target.video, 0]);
    }
    pool.forEach((player, index) => {
      const target = targets.find((candidate) => assignment.get(candidate.key) === index) ?? null;
      player.target = target?.key ?? null;
      player.playing = Boolean(target?.play);
      const run = Boolean(target?.play || target?.prime);
      if (run && !player.running && player.video) {
        // Back on from a pause: loaded again where it was (a «play» command would show YouTube's ⏸),
        // under its thumbnail until its frames are on.
        player.from = player.time;
        player.showing = null;
        send(index, "loadVideoById", [player.video, player.time]);
      } else if (!run && player.running) send(index, "pauseVideo");
      player.running = run;
    });
  }, [targets, sources, send]);


  // Where each player sits: over its target's box (page or viewport coordinates).
  const place = useCallback(() => {
    const origin = root.current?.getBoundingClientRect();
    if (!origin) return;
    const current = targetsRef.current;
    const next = players.current.map((player): Placement | null => {
        const target = current.find((candidate) => candidate.key === player.target);
        const rect = target?.element?.getBoundingClientRect();
        if (!target || !rect) return null;
        // A box off the screen (the next video in full screen, the next row in the grid) keeps its player
        // at the screen's edge, unseen.
        const width = window.innerWidth;
        const height = window.innerHeight;
        const inView = rect.bottom > 0 && rect.top < height && rect.right > 0 && rect.left < width;
        const clamp = (value: number, size: number, room: number) => Math.min(Math.max(value, keepInView - size), room - keepInView);
        // Not while YouTube buffers for a while (3: its loading circle) nor paused (2: its ⏸); the thumbnail shows instead.
        const stalled = player.state === 3 && performance.now() - player.bufferingAt >= bufferGraceMs;
        return {
          top: (inView ? rect.top : clamp(rect.top, rect.height, height)) - (target.fixed ? 0 : origin.top),
          left: (inView ? rect.left : clamp(rect.left, rect.width, width)) - (target.fixed ? 0 : origin.left),
          width: rect.width,
          height: rect.height,
          fixed: target.fixed,
          shown: inView && target.visible && player.video === target.video && player.showing === target.video && !stalled && player.state !== 2,
        };
      });
    // Only a real change re-renders (this runs after every render).
    setPlacements((previous) => (previous.every((spot, index) => samePlacement(spot, next[index])) ? previous : next));
    if (next.some(Boolean)) setPlacedOnce(true);
    const showing = players.current
      .map((player) => (player.target && player.video && player.showing === player.video ? player.target : null))
      .filter((key): key is string => key !== null)
      .sort()
      .join(",");
    if (showing !== reported.current) {
      reported.current = showing;
      onReadyRef.current?.(showing ? showing.split(",") : []);
      // Every made player shows its video: the next batch.
      if (made.current < poolSize && showing.split(",").filter(Boolean).length >= made.current) setBatches((count) => Math.max(count, Math.ceil(made.current / batchSize) + 1));
    }
  }, []);

  useLayoutEffect(() => {
    place();
  });

  useEffect(() => {
    const observer = new ResizeObserver(() => place());
    for (const target of targets) if (target.element) observer.observe(target.element);
    window.addEventListener("resize", place);
    // Any scrolling box (the full screen's slides): the players follow their boxes frame by frame.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        place();
      });
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.cancelAnimationFrame(frame);
    };
  }, [targets, place]);

  if (!sources) return <div ref={root} aria-hidden="true" className="pointer-events-none absolute top-0 left-0" />;
  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute top-0 left-0">
      {sources.map((src, index) => {
        const spot = placements[index];
        const scale = spot ? spot.width / playerWidth : 1;
        const slid = Boolean(spot?.fixed && motion && (motion.x || motion.glide));
        // A player from the HTML before the grid places it: on the screen, unseen (a browser slows down
        // or pauses a video playing off screen).
        const waiting = !spot && !placedOnce && Boolean(opening[index]);
        const fixed = Boolean(spot?.fixed) || waiting;
        return (
          <div
            key={index}
            className={src ? "overflow-hidden" : "hidden"}
            style={{
              position: fixed ? "fixed" : "absolute",
              top: spot?.top ?? (waiting ? 0 : -10000),
              left: spot?.left ?? 0,
              width: spot?.width ?? playerWidth,
              height: spot?.height ?? playerHeight,
              opacity: spot?.shown ? 1 : 0,
              zIndex: spot?.fixed ? 95 : 30,
              borderRadius: spot?.fixed ? 0 : 12,
              clipPath: spot && !spot.fixed ? "inset(0 round 12px)" : undefined,
              transform: slid && motion ? `translateX(${motion.x}px)` : undefined,
              // Hidden at once (moving to another card never shows the old dish there), shown with a short
              // fade in the grid; in full screen, both at once (it follows the swipe).
              transition: slid && motion?.glide ? `transform 260ms ${glideEase}` : spot?.shown && !spot.fixed ? "opacity 200ms" : "none",
            }}
          >
            {src ? (
            <iframe
              ref={(frame) => {
                frames.current[index] = frame;
              }}
              src={src}
              title="Vídeo"
              tabIndex={-1}
              allow="autoplay; encrypted-media; picture-in-picture"
              // YouTube refuses embeds that don't say which site they're on («Error 153»); the public pages'
              // layout sends no referrer (their links carry personal tokens), so the frames send our origin.
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => frames.current[index]?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: index, channel: "widget" }), "*")}
              className="absolute top-0 left-0 border-0"
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
      })}
    </div>
  );
}
