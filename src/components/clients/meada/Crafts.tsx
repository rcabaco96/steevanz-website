"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useEffect, useRef, useSyncExternalStore } from "react";
import type { MeadaCopy, MeadaCraft } from "@/content/meada/copy";
import { meada, meadaPhotos } from "@/content/meada/facts";
import { meadaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Number of weft threads (strips) a picture is woven in with. */
const WEFT = 8;
const pinnedMedia = "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";

/** The strips of one picture: odd ones come from the left, even ones from the right, like a shuttle going back and forth. */
function Weft({ id, shown }: { id: string; shown: boolean }) {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        {Array.from({ length: WEFT }, (_, i) => (
          <rect key={i} data-weft data-side={i % 2 ? "right" : "left"} x={shown || i % 2 === 0 ? 0 : 1} y={i / WEFT - 0.002} width={shown ? 1 : 0} height={1 / WEFT + 0.004} />
        ))}
      </clipPath>
    </svg>
  );
}

// The four crafts as a loom. Large screens: the scene holds still (GSAP pin + scrub) and each craft is woven over the
// one before — its picture comes in as eight weft threads, one from the left, the next from the right, while a red
// shuttle thread runs down the warp; the index, the name and the words change with it. Phones and short screens: one
// craft after the other, each picture woven in as it scrolls into view. The clay and the embroidery play short films.
// Reduced motion: everything in place, no weaving.
export function Crafts({ copy }: { copy: MeadaCopy }) {
  const { crafts } = copy;
  const root = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);
  const count = crafts.list.length;

  useEffect(() => {
    if (!motionOk) return;
    const list = videos.current.filter((v): v is HTMLVideoElement => Boolean(v));
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const v = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      }
    });
    list.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [motionOk]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      const weave = (clip: Element, tl: gsap.core.Timeline, at: number, span: number) => {
        const rects = clip.querySelectorAll("rect");
        rects.forEach((rect, i) => {
          const right = rect.getAttribute("data-side") === "right";
          tl.fromTo(
            rect,
            { attr: { width: 0, x: right ? 1 : 0 } },
            { attr: { width: 1, x: 0 }, duration: span * 0.55, ease: "power2.inOut" },
            at + (i / rects.length) * span * 0.45,
          );
        });
      };

      mm.add(pinnedMedia, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: `+=${count * 85}%`, pin: true, scrub: 0.7, anticipatePin: 1 },
        });
        const texts = q("[data-lg-text]");
        const marks = q("[data-lg-mark]");
        gsap.set(texts.slice(1), { opacity: 0, y: 30 });
        for (let i = 1; i < count; i++) {
          const at = i - 1 + 0.25;
          const clip = el.querySelector(`#md-weave-lg-${i}`);
          if (clip) weave(clip, tl, at, 0.7);
          tl.fromTo(q("[data-shuttle]"), { yPercent: 0, opacity: 1 }, { yPercent: 100 * (WEFT - 1), duration: 0.7, ease: "none" }, at)
            .set(q("[data-shuttle]"), { opacity: 0 }, at + 0.7)
            .to(texts[i - 1], { opacity: 0, y: -30, duration: 0.25 }, at)
            .to(texts[i], { opacity: 1, y: 0, duration: 0.3 }, at + 0.35)
            .to(marks[i - 1], { opacity: 0.35, duration: 0.2 }, at + 0.3)
            .fromTo(marks[i], { opacity: 0.35 }, { opacity: 1, duration: 0.2 }, at + 0.3)
            .to(q("[data-counter]"), { textContent: i + 1, snap: { textContent: 1 }, duration: 0.01 }, at + 0.35);
        }
        tl.to({}, { duration: 0.3 });
        gsap.set(marks.slice(1), { opacity: 0.35 });
      });

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 679px) and (prefers-reduced-motion: no-preference)",
        () => {
          q("[data-sm-frame]").forEach((frame, i) => {
            const clip = el.querySelector(`#md-weave-sm-${i}`);
            if (!clip) return;
            const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 88%", end: "top 30%", scrub: 0.5 } });
            weave(clip, tl, 0, 1);
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const media = (craft: MeadaCraft, key: number, sizes: string, eager = false) =>
    craft.media.kind === "video" ? (
      <>
        <Image
          src={craft.media.video === "barro" ? meada.media.barroPoster : meada.media.bordadoPoster}
          alt={craft.alt}
          width={720}
          height={720}
          sizes={sizes}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {motionOk ? (
          <video
            ref={(node) => {
              videos.current[key] = node;
            }}
            src={craft.media.video === "barro" ? meada.media.barro : meada.media.bordado}
            poster={craft.media.video === "barro" ? meada.media.barroPoster : meada.media.bordadoPoster}
            muted
            loop
            playsInline
            preload={eager ? "metadata" : "none"}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </>
    ) : (
      <Image
        src={meadaPhotos[craft.media.image].src}
        alt={craft.alt}
        width={meadaPhotos[craft.media.image].width}
        height={meadaPhotos[craft.media.image].height}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );

  const heading = (
    <>
      <p className="md-label mb-5 flex items-center gap-3 text-kraft">
        <span aria-hidden="true" className="md-stitch md-stitch-light w-10" />
        {crafts.eyebrow}
      </p>
      <h2 id="md-crafts-title" className="font-display text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.96]">
        {crafts.title} <span className="text-kraft">{crafts.titleItalic}</span>
      </h2>
    </>
  );

  return (
    <section ref={root} id={meadaSections.crafts} aria-labelledby="md-crafts-title" className="md-on-dark relative overflow-hidden bg-grafite text-algodao">
      {/* Large screens: the loom. */}
      <div className={`relative mx-auto hidden h-svh w-full max-w-[86rem] items-center gap-14 px-8 [@media(min-width:1024px)_and_(min-height:680px)_and_(prefers-reduced-motion:no-preference)]:flex`}>
        <div className="flex w-[44%] flex-col">
          {heading}
          <p className="mt-5 max-w-md leading-relaxed text-algodao/70">{crafts.intro}</p>
          <ol className="mt-10 flex gap-6 font-mono text-[0.78rem] tracking-[0.14em] uppercase" aria-hidden="true">
            {crafts.list.map((craft) => (
              <li key={craft.id} data-lg-mark className="flex items-center gap-2">
                <span className="text-fio">✕</span>
                {craft.name}
              </li>
            ))}
          </ol>
          <div className="relative mt-8 min-h-[11rem]">
            {crafts.list.map((craft) => (
              <div key={craft.id} data-lg-text className="absolute inset-x-0 top-0">
                <h3 className="font-display text-[2.4rem] leading-tight">
                  {craft.name} <span className="text-kraft">{craft.nameItalic}</span>
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-algodao/80">{craft.text}</p>
                <p className="md-label mt-4 text-kraft">{craft.maker}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-algodao/50">{crafts.note}</p>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative aspect-square w-[min(100%,74svh)] overflow-hidden bg-grafite-2">
            {crafts.list.map((craft, i) => (
              <Fragment key={craft.id}>
                {i ? <Weft id={`md-weave-lg-${i}`} shown={false} /> : null}
                <div className="absolute inset-0" style={{ clipPath: i ? `url(#md-weave-lg-${i})` : undefined }}>
                  {media(craft, i, "(min-width: 1024px) 50vw, 1px", i === 0)}
                </div>
              </Fragment>
            ))}
            {/* The warp, and the shuttle's red thread. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(244_241_234/0.07)_0_1px,transparent_1px_22px)]" />
            <span data-shuttle aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 block opacity-0" style={{ height: `${100 / WEFT}%` }}>
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-fio" />
            </span>
            <p className="absolute right-4 bottom-4 rounded-full bg-grafite/70 px-3 py-1.5 font-mono text-xs tracking-[0.14em] text-algodao" aria-hidden="true">
              <span data-counter>1</span> / {count}
            </p>
          </div>
        </div>
      </div>

      {/* Phones, short screens and reduced motion: one craft after the other. */}
      <div className="relative mx-auto max-w-[44rem] px-5 py-24 sm:px-8 sm:py-32 [@media(min-width:1024px)_and_(min-height:680px)_and_(prefers-reduced-motion:no-preference)]:hidden">
        {heading}
        <p className="mt-5 leading-relaxed text-algodao/70">{crafts.intro}</p>
        <ol className="mt-14 flex flex-col gap-16">
          {crafts.list.map((craft, i) => (
            <li key={craft.id}>
              <h3 className="flex items-baseline gap-3 font-display text-[2rem] leading-tight">
                <span className="font-mono text-xs tracking-[0.16em] text-fio">0{i + 1}</span>
                <span>
                  {craft.name} <span className="text-kraft">{craft.nameItalic}</span>
                </span>
              </h3>
              <p className="mt-3 leading-relaxed text-algodao/80">{craft.text}</p>
              <Weft id={`md-weave-sm-${i}`} shown />
              <div data-sm-frame className="relative mt-6 aspect-[4/3] w-full overflow-hidden bg-grafite-2" style={{ clipPath: `url(#md-weave-sm-${i})` }}>
                {media(craft, count + i, "(max-width: 1023px) 92vw, 44rem")}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgb(244_241_234/0.06)_0_1px,transparent_1px_18px)]" />
              </div>
              <p className="md-label mt-4 text-kraft">{craft.maker}</p>
            </li>
          ))}
        </ol>
        <p className="mt-14 text-xs text-algodao/50">{crafts.note}</p>
      </div>
    </section>
  );
}
