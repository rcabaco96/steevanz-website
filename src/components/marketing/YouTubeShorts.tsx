"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ShortVideo {
  id: string;
  title: string;
}

/**
 * Hidden by the box: the top and bottom strips of YouTube's player, where it shows the title and its
 * logo. The frame is that much taller than the 9:16 box, so the vertical video fits its width with
 * these strips above and below it, outside the box.
 */
const chromeStrip = 64;

const command = (frame: HTMLIFrameElement | null, func: string) =>
  frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

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
 * One Short in a 9:16 box: YouTube's own thumbnail until the player has drawn. The player is created
 * once `load` is true and plays while `active` (muted unless `sound`); YouTube's controls stay out of
 * reach under whatever the parent puts on top.
 */
function ShortPlayer({ video, load, active, sound }: { video: ShortVideo; load: boolean; active: boolean; sound: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [created, setCreated] = useState(load);
  const [ready, setReady] = useState(false);
  if (load && !created) setCreated(true);

  useEffect(() => {
    if (!ready) return;
    command(frame.current, sound ? "unMute" : "mute");
    command(frame.current, active ? "playVideo" : "pauseVideo");
  }, [ready, active, sound]);

  return (
    <div className="relative isolate h-full w-full overflow-hidden bg-black">
      {/* YouTube's own thumbnail; the 4:3 picture holds the vertical frame in its middle. Served by YouTube as is (no image optimisation spent on it). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {created ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?${playerParams(video.id)}`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => window.setTimeout(() => setReady(true), 900)}
          className="pointer-events-none absolute left-0 w-full border-0"
          style={{ top: -chromeStrip, height: `calc(100% + ${chromeStrip * 2}px)`, maxWidth: "none" }}
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

/** A card of the grid: plays muted while mostly on screen; a tap opens the collection full screen. */
function ShortCard({ video, channel, paused, onOpen }: { video: ShortVideo; channel: string; paused: boolean; onOpen: () => void }) {
  const holder = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <li className="card flex flex-col gap-3 p-3">
      <div ref={holder} className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl" style={{ clipPath: "inset(0 round 1rem)" }}>
        <ShortPlayer video={video} load={inView} active={inView && !paused} sound={false} />
        <button type="button" onClick={onOpen} aria-label={`Ver em ecrã inteiro: ${video.title}`} className="absolute inset-0 flex items-end justify-end p-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-0.5 px-1 pb-1">
        <span className="line-clamp-2 font-semibold text-text">{video.title}</span>
        <a href={`https://www.youtube.com/shorts/${video.id}`} target="_blank" rel="noopener" className="text-sm font-semibold text-accent-text hover:underline">
          {channel} no YouTube
        </a>
      </div>
    </li>
  );
}

/**
 * Full screen, one video per screen: swipe (or scroll, or the arrow keys) to the next or previous
 * one. Only the video on screen plays; it and its neighbours are loaded. The sound, once on, stays on
 * from video to video. Closes with ✕, Esc or the phone's back button.
 */
function ShortsViewer({ videos, channel, start, onClose }: { videos: ShortVideo[]; channel: string; start: number; onClose: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(start);
  const [sound, setSound] = useState(false);

  const goTo = useCallback((index: number) => {
    const element = scroller.current;
    if (!element) return;
    element.scrollTo({ top: Math.max(0, Math.min(videos.length - 1, index)) * element.clientHeight, behavior: "smooth" });
  }, [videos.length]);

  // Open on the tapped video; lock the page behind; Esc, the arrows and «back» work.
  useEffect(() => {
    const element = scroller.current;
    if (element) element.scrollTop = start * element.clientHeight;
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
    <div role="dialog" aria-modal="true" aria-label={`Vídeos de ${channel}`} className="fixed inset-0 z-[90] bg-black text-white">
      <div
        ref={scroller}
        onScroll={(event) => {
          const element = event.currentTarget;
          const index = Math.round(element.scrollTop / Math.max(1, element.clientHeight));
          if (index !== current) setCurrent(index);
        }}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none]"
      >
        {videos.map((video, index) => (
          <section key={video.id} aria-label={`${index + 1} de ${videos.length}: ${video.title}`} className="relative grid h-[100dvh] snap-start snap-always place-items-center">
            <div className="relative aspect-[9/16] h-auto max-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] overflow-hidden sm:rounded-2xl">
              <ShortPlayer video={video} load={Math.abs(index - current) <= 1} active={index === current} sound={sound} />
              {/* Over the player: a tap turns the sound on or off. */}
              <button type="button" onClick={() => setSound(!sound)} aria-label={sound ? "Tirar o som" : "Ligar o som"} className="absolute inset-0" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent px-5 pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <span className="text-xs font-semibold tracking-wide text-white/70">
                {index + 1} / {videos.length}
              </span>
              <span className="line-clamp-2 text-base font-semibold">{video.title}</span>
              <a href={`https://www.youtube.com/shorts/${video.id}`} target="_blank" rel="noopener" className="pointer-events-auto self-start text-sm font-semibold text-white/85 underline-offset-4 hover:underline">
                {channel} no YouTube
              </a>
            </div>
          </section>
        ))}
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

/** A collection (one YouTube playlist): the grid of cards, and the full-screen viewer when one is tapped. */
export function ShortsCollection({ videos, channel }: { videos: ShortVideo[]; channel: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, index) => (
          <ShortCard key={video.id} video={video} channel={channel} paused={open !== null} onOpen={() => setOpen(index)} />
        ))}
      </ul>
      {open !== null ? <ShortsViewer videos={videos} channel={channel} start={open} onClose={close} /> : null}
    </>
  );
}
