"use client";

import { useEffect, useRef, useState } from "react";
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
 * ...and is let go only beyond this one (three screens): letting a video go and loading it again stalls
 * an iPhone's scroll for an instant (owner, 2026-10-16: «repara nos breaks do scroll»).
 */
const keepMargin = "300% 0px";

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
}: {
  id: string;
  /** Its small picture's file name. */
  thumbnail?: string;
  playing?: boolean;
  /** One of the first cards: on an iPhone it starts loading with the page (bunnyEarlyScript). */
  early?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls | null>(null);
  // The first cards start on screen (one started early must not be let go before the observers report).
  const [near, setNear] = useState(early);
  const [kept, setKept] = useState(true);
  const [seen, setSeen] = useState(early);
  const [shown, setShown] = useState(false);
  const [ahead, setAhead] = useState(false);
  // Full screen: the card's frame (shown until this video is there) and where to carry on from.
  const frame = useRef<HTMLCanvasElement>(null);
  const resume = useRef<{ at: number; since: number } | null>(null);
  const full = playing !== undefined;
  const active = full ? playing : seen;
  // On screen (or full screen): at once. Near in the grid: once those on screen have started.
  const load = active || (near && (full || ahead));
  // A loaded video stays loaded while within three screens.
  const keep = active || near || kept;
  const base = `https://${pullZone}.b-cdn.net/${id}`;

  // Near the screen (loads), and half on it (a grid card plays).
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const nearby = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: nearMargin });
    const within = new IntersectionObserver(([entry]) => setKept(entry.isIntersecting), { rootMargin: keepMargin });
    const onScreen = new IntersectionObserver(([entry]) => setSeen(entry.intersectionRatio >= playAtRatio), { threshold: [0, playAtRatio, 1] });
    nearby.observe(element);
    within.observe(element);
    onScreen.observe(element);
    return () => {
      nearby.disconnect();
      within.disconnect();
      onScreen.disconnect();
    };
  }, []);

  // A grid card: full screen finds it.
  useEffect(() => {
    const element = video.current;
    if (!element || full) return;
    cardVideos.set(id, element);
    return () => {
      if (cardVideos.get(id) === element) cardVideos.delete(id);
    };
  }, [id, full]);

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
    const attached = Boolean(element.getAttribute("src") || hls.current);
    if (attached && !keep) {
      hls.current?.destroy();
      hls.current = null;
      element.removeAttribute("src");
      element.style.removeProperty("opacity");
      element.load();
      setShown(false);
      return;
    }
    if (attached || !load) return;
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
      const { default: HlsPlayer } = await import("hls.js");
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
      const player = new HlsPlayer(
        full
          ? { capLevelToPlayerSize: true, startLevel: -1, maxBufferLength: 12, startPosition: at ? at.at + (performance.now() - at.since) / 1000 : -1 }
          : { maxBufferLength: 4, maxMaxBufferLength: 8 },
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
  }, [load, keep, full, base]);

  // Plays while active (once the source is there), pauses otherwise.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!active) {
      element.pause();
      return;
    }
    const play = () => void element.play().catch(() => {});
    play();
    // The source may only just be attaching (hls.js loads first): play once it can.
    element.addEventListener("canplay", play);
    return () => element.removeEventListener("canplay", play);
  }, [active, load]);

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
      <img src={`${base}/${thumbnail || "thumbnail.jpg"}`} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {full ? <canvas ref={frame} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" /> : null}
      <video
        ref={video}
        data-bunny-early={early ? base : undefined}
        muted
        loop
        playsInline
        preload={active ? "auto" : "metadata"}
        disablePictureInPicture
        onTimeUpdate={(event) => {
          // Not while seeking (full screen carrying on from its card): its frames aren't there yet.
          if (!shown && event.currentTarget.currentTime > 0 && !event.currentTarget.seeking) setShown(true);
        }}
        onError={(event) => {
          // The browser's own HLS failed: the MP4 instead (that one failing too leaves the picture).
          const element = event.currentTarget;
          if (!element.getAttribute("src")?.endsWith(".m3u8")) return;
          element.src = `${base}/play_720p.mp4`;
          if (active) void element.play().catch(() => {});
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${shown ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
