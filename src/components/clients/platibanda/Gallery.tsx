"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { fill, type PlatibandaCopy } from "@/content/platibanda/copy";
import { platibandaPhotos, type PlatibandaPhotoId } from "@/content/platibanda/facts";
import { facadeFlat, facadeIn, polygon } from "./facade";
import { ArrowIcon, ArrowLeftIcon, CloseIcon, ExpandIcon } from "./icons";

gsap.registerPlugin(useGSAP);

/** The house front the photos start in (also set by the stylesheet from the first paint, so nothing jumps). */
const startClip = polygon(facadeIn(4, 0, 96, 100));

// The photos of a property: a strip that snaps photo by photo (swipe on phones, arrows and thumbnails everywhere,
// the arrow keys when it has focus) and a full-screen view in a native <dialog>. On arrival the strip stands inside a
// house front that opens out to the full frame (GSAP, clip-path); reduced motion: open from the start.
export function Gallery({ photos, labels }: { photos: { id: PlatibandaPhotoId; alt: string }[]; labels: PlatibandaCopy["listing"] }) {
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState<number | null>(null);
  const n = photos.length;

  const go = useCallback(
    (i: number) => {
      const el = strip.current;
      if (!el) return;
      const next = (i + n) % n;
      const slide = el.children[next] as HTMLElement | undefined;
      if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    },
    [n],
  );

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (full !== null && !d.open) d.showModal();
    if (full === null && d.open) d.close();
  }, [full]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        gsap.fromTo(
          el,
          { clipPath: startClip },
          { clipPath: polygon(facadeFlat()), ease: "power3.inOut", duration: 1.3, delay: 0.25 },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div>
      <div
        ref={root}
        className="pb-gallery-frame relative overflow-hidden rounded-[1.2rem] bg-areia will-change-[clip-path]"
        style={{ ["--pb-facade" as string]: startClip }}
      >
        <div
          ref={strip}
          tabIndex={0}
          role="group"
          aria-roledescription="carrossel"
          aria-label={labels.gallery}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
          className="pb-snap flex aspect-[4/3] overflow-x-auto sm:aspect-[16/10]"
        >
          {photos.map((p, i) => {
            const img = platibandaPhotos[p.id];
            return (
              <figure key={p.id} aria-label={fill(labels.photoOf, { i: i + 1, n })} className="relative h-full w-full shrink-0">
                <Image
                  src={img.src}
                  alt={p.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  priority={i === 0}
                  className="h-full w-full object-cover"
                />
              </figure>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-ria/75 px-3 py-1.5 text-sm font-semibold text-cal tabular-nums backdrop-blur-sm">
            {index + 1} / {n}
          </span>
          <div className="pointer-events-auto flex gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label={labels.previous} className="grid size-11 place-items-center rounded-full bg-cal/90 text-ria hover:bg-cal">
              <ArrowLeftIcon />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label={labels.next} className="grid size-11 place-items-center rounded-full bg-cal/90 text-ria hover:bg-cal">
              <ArrowIcon />
            </button>
            <button type="button" onClick={() => setFull(index)} aria-label={labels.openPhoto} className="grid size-11 place-items-center rounded-full bg-ria text-cal hover:bg-ria-2">
              <ExpandIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {photos.map((p, i) => {
          const img = platibandaPhotos[p.id];
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => go(i)}
              aria-label={fill(labels.photoOf, { i: i + 1, n })}
              aria-current={i === index ? "true" : undefined}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity sm:h-20 sm:w-28 ${i === index ? "opacity-100 ring-2 ring-ocre ring-offset-2 ring-offset-cal" : "opacity-60 hover:opacity-100"}`}
            >
              <Image src={img.src} alt="" width={img.width} height={img.height} sizes="7rem" className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setFull(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setFull(null);
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-ria/95 p-0 backdrop:bg-ria/80"
        aria-label={labels.gallery}
      >
        {full !== null ? (
          <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-10">
            <Image
              src={platibandaPhotos[photos[full].id].src}
              alt={photos[full].alt}
              width={platibandaPhotos[photos[full].id].width}
              height={platibandaPhotos[photos[full].id].height}
              sizes="100vw"
              className="max-h-full w-auto max-w-full rounded-lg object-contain"
            />
            <button type="button" onClick={() => setFull(null)} aria-label={labels.closePhoto} className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-cal text-ria">
              <CloseIcon />
            </button>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
              <button type="button" onClick={() => setFull((full - 1 + n) % n)} aria-label={labels.previous} className="grid size-12 place-items-center rounded-full bg-cal text-ria">
                <ArrowLeftIcon />
              </button>
              <span className="text-sm font-semibold text-cal tabular-nums">
                {full + 1} / {n}
              </span>
              <button type="button" onClick={() => setFull((full + 1) % n)} aria-label={labels.next} className="grid size-12 place-items-center rounded-full bg-cal text-ria">
                <ArrowIcon />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
