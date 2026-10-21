"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { fabios } from "@/content/fabios-roadstop/facts";

interface HeroVideoProps {
  label: string;
}

// The restaurant's own film behind the hero, playing from the first moment (owner, 2026-10-21: «o vídeo tem de
// começar logo»). The file is already trimmed (2 s – 30.4 s of the original, without the white end card) and
// small (1.3 MB, faststart), so it loops natively with no seek. The <video> is written as plain HTML so the
// browser sees autoplay + muted before React loads (React doesn't put `muted` in server HTML, and without it
// autoplay is blocked). Its poster is the first frame. With reduced motion it stops and only the poster stays;
// it pauses off screen and in hidden tabs. No pause button (owner, 2026-10-21).
const videoHtml =
  `<video src="${fabios.media.video}" poster="${fabios.media.poster}" autoplay muted loop playsinline ` +
  `preload="auto" disablepictureinpicture disableremoteplayback ` +
  `class="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"></video>`;

export function HeroVideo({ label }: HeroVideoProps) {
  const holder = useRef<HTMLDivElement>(null);
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
      if (document.visibilityState === "visible") void video.play().catch(() => {});
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

  return <div ref={holder} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: videoHtml }} />;
}
