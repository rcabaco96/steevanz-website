"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { fabios } from "@/content/fabios-roadstop/facts";

interface HeroVideoProps {
  label: string;
  pauseLabel: string;
  playLabel: string;
}

// The restaurant's own film behind the hero, playing from the first moment (owner, 2026-10-21: «o vídeo tem de
// começar logo»). The file is already trimmed (2 s – 30.4 s of the original, without the white end card) and
// small (1.3 MB, faststart), so it loops natively with no seek. The <video> is written as plain HTML so the
// browser sees autoplay + muted before React loads (React doesn't put `muted` in server HTML, and without it
// autoplay is blocked). Its poster is the first frame. With reduced motion it stops and only the poster stays;
// it pauses off screen and in hidden tabs, and has a pause button.
const videoHtml =
  `<video src="${fabios.media.video}" poster="${fabios.media.poster}" autoplay muted loop playsinline ` +
  `preload="auto" disablepictureinpicture disableremoteplayback ` +
  `class="absolute inset-0 h-full w-full scale-[1.04] object-cover lg:blur-[1.2px] motion-reduce:hidden"></video>`;

export function HeroVideo({ label, pauseLabel, playLabel }: HeroVideoProps) {
  const holder = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = holder.current?.querySelector("video");
    if (!video) return;
    video.setAttribute("aria-label", label);
    if (reduced) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      return;
    }
    video.muted = true;
    const play = () => {
      if (!userPaused.current && document.visibilityState === "visible") void video.play().catch(() => {});
    };
    play();
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : video.pause()));
    observer.observe(video);
    const onVisibility = () => (document.visibilityState === "visible" ? play() : video.pause());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [label, reduced]);

  const toggle = () => {
    const video = holder.current?.querySelector("video");
    if (!video) return;
    userPaused.current = !video.paused;
    setPaused(userPaused.current);
    if (userPaused.current) video.pause();
    else void video.play().catch(() => {});
  };

  return (
    <>
      <div ref={holder} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: videoHtml }} />
      <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className="absolute right-4 bottom-[5.4rem] z-20 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-cream ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-black/55 motion-reduce:hidden sm:right-8"
          aria-label={paused ? playLabel : pauseLabel}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 4l15 8-15 8z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          )}
        </button>
    </>
  );
}
