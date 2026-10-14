"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hidden by the card: the top and bottom strips of YouTube's player, where it shows the title and its
 * logo. The frame is that much taller than the 9:16 card, so the vertical video fits its width with
 * these strips above and below it, outside the card.
 */
const chromeStrip = 64;

const command = (frame: HTMLIFrameElement | null, func: string) =>
  frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

/**
 * A YouTube Short in a Steevanz card: YouTube's own thumbnail first; once the card is mostly on
 * screen the player starts muted and looping (like a feed), and pauses when it leaves. A tap turns
 * the sound on or off (YouTube's controls stay hidden).
 */
export function YouTubeReel({ id, title }: { id: string; title: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          command(frame.current, "playVideo");
        } else {
          command(frame.current, "pauseVideo");
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const params = new URLSearchParams({
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

  return (
    <div ref={holder} className="relative isolate aspect-[9/16] w-full overflow-hidden rounded-2xl bg-surface-inverse" style={{ clipPath: "inset(0 round 1rem)" }}>
      {/* YouTube's own thumbnail; the 4:3 picture holds the vertical frame in its middle. Served by YouTube as is (no image optimisation spent on it). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {started ? (
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => window.setTimeout(() => setReady(true), 900)}
          className="absolute left-0 w-full border-0"
          style={{ top: -chromeStrip, height: `calc(100% + ${chromeStrip * 2}px)`, maxWidth: "none" }}
        />
      ) : null}
      {/* Over the player: YouTube's own controls stay out of reach; a tap is ours (sound on/off). */}
      <button
        type="button"
        onClick={() => {
          setStarted(true);
          command(frame.current, sound ? "mute" : "unMute");
          command(frame.current, "playVideo");
          setSound(!sound);
        }}
        aria-label={sound ? `Tirar o som: ${title}` : `Ligar o som: ${title}`}
        className="absolute inset-0 flex items-end justify-end p-3"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4z" />
            {sound ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m22 9-6 6M16 9l6 6" />}
          </svg>
        </span>
      </button>
    </div>
  );
}
