"use client";

import { useEffect, useRef, useState } from "react";
import adStyles from "./AdVideo.module.css";
import styles from "./AdVideoDialog.module.css";

// The button and the window of AdVideoModalButton. The window is a native <dialog> opened with
// showModal(): the page behind is inert (focus stays inside), Escape and a tap outside the video close
// it, and focus goes back to the button. The page doesn't scroll behind it. The <video> has no source
// until the button is pressed; then, inside that tap, it gets its source and plays with sound. If the
// browser refuses sound, it plays muted with «Ver com som». Closing stops it and drops the source,
// so nothing keeps downloading.

export interface AdVideoDialogProps {
  src: string;
  poster: string;
  seconds: number;
  /** «Ver o vídeo»; the length is added after it. */
  label: string;
  /** What the ad shows, for screen readers. */
  videoLabel: string;
  copy: { soundOn: string; close: string };
  className?: string;
}

export function AdVideoDialog({ src, poster, seconds, label, videoLabel, copy, className }: AdVideoDialogProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  // No page scroll behind the window (the scrollbar's width is kept, so nothing shifts).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const before = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = before.overflow;
      root.style.paddingRight = before.paddingRight;
    };
  }, [open]);

  const show = () => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video || dialog.open) return;
    video.setAttribute("poster", poster);
    video.setAttribute("src", src);
    video.muted = false;
    setMuted(false);
    dialog.showModal();
    setOpen(true);
    // Still inside the tap, so most browsers allow sound; if not, muted with «Ver com som».
    video.play().catch((error: unknown) => {
      if (!dialog.open || (error instanceof DOMException && error.name !== "NotAllowedError")) return;
      video.muted = true;
      setMuted(true);
      video.play().catch(() => {});
    });
  };

  const onClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.removeAttribute("poster");
      video.load();
    }
    setOpen(false);
    setMuted(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const withSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    setMuted(false);
    video.play().catch(() => {});
  };

  return (
    <>
      <button ref={triggerRef} type="button" className={`${styles.trigger} ${className ?? ""}`} aria-haspopup="dialog" onClick={show}>
        <span className={styles.triggerIcon} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path d="M7 4.5v15L20 12z" fill="currentColor" />
          </svg>
        </span>
        <span>
          {label} <span className={styles.length}>({seconds}&nbsp;s)</span>
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={label}
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <button type="button" className={styles.close} aria-label={copy.close} onClick={() => dialogRef.current?.close()}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className={styles.stage}>
          <video
            ref={videoRef}
            className={styles.video}
            aria-label={videoLabel}
            playsInline
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            preload="none"
            onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          />
          {open && muted ? (
            <button type="button" className={`${adStyles.sound} ${styles.sound}`} onClick={withSound} aria-pressed={false}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
                <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />
              </svg>
              {copy.soundOn}
            </button>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
