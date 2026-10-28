"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragialPhotos } from "@/content/ferragial/facts";
import { ferragialSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The year in the vineyard, from pruning to São Martinho, in seven moments. Large screens: the scene holds still
// while the moments slide past sideways (GSAP pin + scrub), a sun travels along an arc over them from one side of the
// sky to the other, and the colour of the whole scene turns with the seasons (layers of colour cross-fading:
// opacity only). Phones, short screens and reduced motion: the moments go down the page, each in its own season's
// colour, each photo opening out of its horizon line as it arrives.
export function Year({ copy }: { copy: FerragialCopy }) {
  const { year } = copy;
  const root = useRef<HTMLElement>(null);
  const moments = year.moments;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)", () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const layers = q("[data-tone]");
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance() + window.innerHeight * 0.4}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(track, { x: 0 }, { x: () => -distance(), duration: 1 }, 0).fromTo(q("[data-arm]"), { rotate: -172 }, { rotate: -8, duration: 1 }, 0);
        const n = moments.length;
        layers.forEach((layer, i) => {
          if (i === 0) return;
          tl.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 0.5 / n }, (i - 0.5) / (n - 1) - 0.25 / n);
        });
        q("[data-lg-photo]").forEach((photo) => {
          gsap.fromTo(photo, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: photo, containerAnimation: tl, start: "left right", end: "right left", scrub: true } });
        });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 639px) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-sm-frame]").forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(48% 0% 48% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 92%", end: "top 40%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const heading = (
    <div>
      <p className="fg-label mb-5 text-palha">{year.eyebrow}</p>
      <h2 id="fg-year-title" className="font-display text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.95]">
        {year.title} <span className="text-palha">{year.titleAccent}</span>
      </h2>
      <p className="mt-5 max-w-md leading-relaxed text-cal/80">{year.intro}</p>
    </div>
  );

  return (
    <section ref={root} id={ferragialSections.year} aria-labelledby="fg-year-title" className="fg-dark relative overflow-hidden bg-xisto text-cal">
      {/* Large screens: the pinned, sideways year. */}
      <div className="relative hidden h-svh flex-col motion-safe:[@media(min-width:1024px)_and_(min-height:640px)]:flex">
        {moments.map((moment, i) => (
          <div key={moment.name} data-tone aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: moment.tone, opacity: i === 0 ? 1 : 0 }} />
        ))}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(255_255_255/0.08),transparent_70%)]" />

        <div className="relative mx-auto flex w-full max-w-[90rem] items-start justify-between gap-10 px-8 pt-[max(5.5rem,11svh)]">
          {heading}
          {/* The sun's path over the plain: an arc, and the sun at the end of an arm that turns with the scroll. */}
          <div aria-hidden="true" className="relative mt-2 h-[min(9rem,16svh)] w-[min(18rem,32svh)] shrink-0 overflow-hidden">
            <svg viewBox="0 0 200 100" className="absolute inset-0 size-full overflow-visible">
              <path d="M6 100A94 94 0 0 1 194 100" fill="none" stroke="rgb(243 238 228 / 0.35)" strokeWidth="1" strokeDasharray="2 5" />
              <path d="M0 99.5H200" stroke="rgb(243 238 228 / 0.6)" strokeWidth="1" />
            </svg>
            <div data-arm className="absolute bottom-0 left-1/2 h-px w-[47%] origin-left will-change-transform" style={{ transform: "rotate(-172deg)" }}>
              <span className="absolute -top-3 right-[-0.75rem] block size-6 rounded-full bg-palha shadow-[0_0_30px_8px_rgb(230_199_122/0.35)]" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center">
          <ol data-track className="flex w-max gap-[6vw] pr-[10vw] pl-8 will-change-transform xl:pl-[max(2rem,calc((100vw-90rem)/2+2rem))]">
            {moments.map((moment, i) => {
              const photo = ferragialPhotos[moment.image];
              return (
                <li key={moment.name} className="grid w-[min(62vw,52rem)] grid-cols-[1.05fr_1fr] items-center gap-10">
                  <div className="relative aspect-[4/3.3] overflow-hidden rounded-[3px] bg-xisto-2">
                    <div data-lg-photo className="absolute -inset-x-[8%] inset-y-0">
                      <Image src={photo.src} alt={moment.alt} width={photo.width} height={photo.height} sizes="36vw" className="h-full w-full object-cover" />
                    </div>
                    <span aria-hidden="true" className="absolute inset-x-0 top-[62%] h-px bg-cal/40" />
                  </div>
                  <div>
                    <p className="fg-label text-palha">
                      <span className="mr-3 text-cal/50">{String(i + 1).padStart(2, "0")}</span>
                      {moment.months}
                    </p>
                    <h3 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-none">{moment.name}</h3>
                    <p className="mt-5 max-w-sm text-[1.05rem] leading-relaxed text-cal/82">{moment.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <div aria-hidden="true" className="relative mx-8 mb-8 h-px bg-cal/25" />
      </div>

      {/* Phones, short screens: the year down the page. */}
      <div className="relative motion-safe:[@media(min-width:1024px)_and_(min-height:640px)]:hidden">
        <div className="px-5 pt-24 pb-12 sm:px-8 sm:pt-32">
          <div className="mx-auto max-w-[40rem]">{heading}</div>
        </div>
        <ol>
          {moments.map((moment, i) => {
            const photo = ferragialPhotos[moment.image];
            return (
              <li key={moment.name} className="px-5 py-12 sm:px-8 sm:py-16" style={{ backgroundColor: moment.tone }}>
                <div className="mx-auto max-w-[40rem]">
                  <p className="fg-label text-palha">
                    <span className="mr-3 text-cal/50">{String(i + 1).padStart(2, "0")}</span>
                    {moment.months}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2.3rem,10vw,3.4rem)] leading-none">{moment.name}</h3>
                  <p className="mt-4 leading-relaxed text-cal/82">{moment.text}</p>
                  <div data-sm-frame className="relative mt-7 aspect-[4/3] overflow-hidden rounded-[3px] bg-xisto-2">
                    <Image src={photo.src} alt={moment.alt} width={photo.width} height={photo.height} sizes="(max-width: 1023px) 92vw, 1px" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
