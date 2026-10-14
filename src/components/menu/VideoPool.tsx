"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ViewerMotion } from "./VideoShorts";

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
  /** Plays (else paused). */
  play: boolean;
  /**
   * Not playing, but primed: loaded and played until its first frames are on, then paused there, so
   * it shows a real frame (not the thumbnail) and starts at once when it plays (the next video in
   * full screen, the rows around the grid's).
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
 * 8: the grid plays the dishes on screen (two rows of two) and has the row below and the row above
 * already playing, hidden, so they play as they appear (owner, 2026-10-14); full screen uses 2. Each
 * player is a whole YouTube page (memory): one per dish would make an iPhone reload the page.
 */
const poolSize = 8;
/**
 * A player shows over the thumbnail only once its own video (by the id YouTube reports) has played
 * this far (s): at YouTube's first «playing» the video hasn't drawn a frame yet (a black break), and
 * after a video change the old video's reports still arrive for a moment.
 */
const shownAfterSeconds = 0.3;
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
  /** The video YouTube says it has, and how far it has played (s). */
  reported: string | null;
  time: number;
  /** The video it has really started showing frames of: stays so through its loops. */
  showing: string | null;
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
  sound,
  enabled,
  motion,
  onReady,
}: {
  targets: PoolTarget[];
  sound: boolean;
  enabled: boolean;
  /** The full screen dragged to close: its player (fixed) moves, shrinks and rounds with it. */
  motion?: ViewerMotion;
  /** The targets whose player is showing their video (e.g. a new collection is ready). */
  onReady?: (keys: string[]) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLIFrameElement | null)[]>([]);
  const players = useRef<Player[]>(
    Array.from({ length: poolSize }, () => ({ video: null, target: null, ready: false, state: -1, queue: [], playing: false, reported: null, time: 0, showing: null })),
  );
  const [sources, setSources] = useState<string[] | null>(null);
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
      // YouTube show its ⏸ over the video for a few seconds. A primed one pauses on its first frames.
      if (target?.play || target?.prime) {
        player.target = target.key;
        player.playing = Boolean(target.play);
      }
      return embedSrc(player.video, origin, Boolean(target?.play || target?.prime));
    });
    setSources(initial);
  }, [enabled, sources, targets]);

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
      if (player.reported === player.video && player.state === 1 && player.time >= shownAfterSeconds) player.showing = player.video;
      // A primed player stops on its first frames.
      if (player.showing !== showing && !player.playing) frames.current[index]?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
      const state = data.event === "onStateChange" && typeof data.info === "number" ? data.info : typeof info.playerState === "number" ? info.playerState : null;
      if (state === null || state === player.state) {
        if (player.showing !== showing) setTick((tick) => tick + 1);
        return;
      }
      player.state = state;
      // Each video loops on its own (YouTube's loop parameter would bring back the first video).
      if (state === 0 && player.playing) {
        frames.current[index]?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [0, true] }), "*");
        frames.current[index]?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
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
      player.video = target.video;
      player.state = -1;
      player.showing = null;
      send(free, target.play || target.prime ? "loadVideoById" : "cueVideoById", [target.video, 0]);
    }
    pool.forEach((player, index) => {
      const target = targets.find((candidate) => assignment.get(candidate.key) === index) ?? null;
      player.target = target?.key ?? null;
      const play = Boolean(target?.play);
      // A primed player still loading must not be paused yet (it pauses itself on its first frames).
      const priming = !play && target?.prime && player.showing !== player.video;
      if (!priming && (play !== player.playing || (play && player.state === 2))) send(index, play ? "playVideo" : "pauseVideo");
      player.playing = play;
    });
  }, [targets, sources, send]);

  // Sound: only on the full screen's playing video; everything else stays muted.
  useEffect(() => {
    if (!sources) return;
    players.current.forEach((player, index) => {
      const target = targets.find((candidate) => candidate.key === player.target);
      send(index, sound && target?.fixed && target.play ? "unMute" : "mute");
    });
  }, [sound, targets, sources, send]);

  // Where each player sits: over its target's box (page or viewport coordinates).
  const place = useCallback(() => {
    const origin = root.current?.getBoundingClientRect();
    if (!origin) return;
    const current = targetsRef.current;
    const next = players.current.map((player): Placement | null => {
        const target = current.find((candidate) => candidate.key === player.target);
        const rect = target?.element?.getBoundingClientRect();
        if (!target || !rect) return null;
        return {
          top: target.fixed ? rect.top : rect.top - origin.top,
          left: target.fixed ? rect.left : rect.left - origin.left,
          width: rect.width,
          height: rect.height,
          fixed: target.fixed,
          // Not while YouTube buffers (state 3): its loading circle would show over the video; the thumbnail does instead.
          shown: target.visible && player.video === target.video && player.showing === target.video && player.state !== 3,
        };
      });
    // Only a real change re-renders (this runs after every render).
    setPlacements((previous) => (previous.every((spot, index) => samePlacement(spot, next[index])) ? previous : next));
    const showing = players.current
      .map((player) => (player.target && player.video && player.showing === player.video ? player.target : null))
      .filter((key): key is string => key !== null)
      .sort()
      .join(",");
    if (showing !== reported.current) {
      reported.current = showing;
      onReadyRef.current?.(showing ? showing.split(",") : []);
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
        // Dragged to close (full screen only): radius as seen, so divided by the shrink.
        const moved = Boolean(motion && (motion.x || motion.y || motion.scale !== 1 || motion.glide));
        const radius = motion ? motion.radius / motion.scale : 0;
        return (
          <div
            key={index}
            className="overflow-hidden transition-opacity duration-200"
            style={{
              position: spot?.fixed ? "fixed" : "absolute",
              top: spot?.top ?? -10000,
              left: spot?.left ?? 0,
              width: spot?.width ?? playerWidth,
              height: spot?.height ?? playerHeight,
              opacity: spot?.shown ? 1 : 0,
              zIndex: spot?.fixed ? 95 : 30,
              borderRadius: spot?.fixed ? (moved ? radius : 0) : 12,
              clipPath: spot?.fixed ? (moved ? `inset(0 round ${radius}px)` : undefined) : "inset(0 round 12px)",
              transform: spot?.fixed && moved && motion ? `translate(${motion.x}px, ${motion.y}px) scale(${motion.scale})` : undefined,
              transition: spot?.fixed && motion?.glide ? "opacity 200ms, transform 320ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 320ms, clip-path 320ms" : "opacity 200ms",
            }}
          >
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
          </div>
        );
      })}
    </div>
  );
}
