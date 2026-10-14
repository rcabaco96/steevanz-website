"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
  /** Plays (else loaded and paused, e.g. the next video, prepared). */
  play: boolean;
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
/** 4: the grid plays every dish on screen (two rows of two, owner 2026-10-14); full screen uses 2. */
const poolSize = 4;
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
  shift = { px: 0, glide: false },
}: {
  targets: PoolTarget[];
  sound: boolean;
  enabled: boolean;
  /** The full screen dragged sideways: its players (fixed) move with it, gliding or following the finger. */
  shift?: { px: number; glide: boolean };
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
      // A player made for a box that plays starts by itself: a «play» command would make YouTube
      // show its ⏸ over the video for a few seconds.
      if (target?.play) {
        player.target = target.key;
        player.playing = true;
      }
      return embedSrc(player.video, origin, Boolean(target?.play));
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
      send(free, target.play ? "loadVideoById" : "cueVideoById", [target.video, 0]);
    }
    pool.forEach((player, index) => {
      const target = targets.find((candidate) => assignment.get(candidate.key) === index) ?? null;
      player.target = target?.key ?? null;
      const play = Boolean(target?.play);
      if (play !== player.playing || (play && player.state === 2)) send(index, play ? "playVideo" : "pauseVideo");
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
          shown: target.visible && target.play && player.video === target.video && player.showing === target.video,
        };
      });
    // Only a real change re-renders (this runs after every render).
    setPlacements((previous) => (previous.every((spot, index) => samePlacement(spot, next[index])) ? previous : next));
  }, []);

  useLayoutEffect(() => {
    place();
  });

  useEffect(() => {
    const observer = new ResizeObserver(() => place());
    for (const target of targets) if (target.element) observer.observe(target.element);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [targets, place]);

  if (!sources) return <div ref={root} aria-hidden="true" className="pointer-events-none absolute top-0 left-0" />;
  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute top-0 left-0">
      {sources.map((src, index) => {
        const spot = placements[index];
        const scale = spot ? spot.width / playerWidth : 1;
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
              borderRadius: spot?.fixed ? 0 : 12,
              transform: spot?.fixed && shift.px ? `translateX(${shift.px}px)` : undefined,
              transition: shift.glide ? "opacity 200ms, transform 250ms cubic-bezier(0.32, 0.72, 0, 1)" : "opacity 200ms",
              clipPath: spot?.fixed ? undefined : "inset(0 round 12px)",
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
