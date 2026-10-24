"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragialDuration, ferragialExperiences, ferragialPhotos, ferragialPrice, type FerragialExperience } from "@/content/ferragial/facts";
import { BookingForm } from "./BookingForm";
import { ArrowIcon } from "./icons";
import { ferragialSections, pickExperienceEvent } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function Media({ exp, motionOk }: { exp: FerragialExperience; motionOk: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);
  if (exp.media.kind === "photo") {
    const photo = ferragialPhotos[exp.media.id];
    return <Image src={photo.src} alt="" width={photo.width} height={photo.height} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />;
  }
  return (
    <>
      <Image src={exp.media.poster} alt="" width={exp.media.portrait ? 540 : 960} height={exp.media.portrait ? 960 : 540} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" className="absolute inset-0 h-full w-full object-cover" />
      {motionOk ? <video ref={ref} src={exp.media.src} poster={exp.media.poster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" /> : null}
    </>
  );
}

// Visits and tastings, with the online booking (the Steevanz «Sistema de reservas online» woven into the winery's
// own site). Four experiences as tall cards whose pictures open out of their horizon line as they arrive (clip-path,
// scrubbed); «Escolher esta» takes the visitor to the booking form with that experience chosen. Prices per person,
// without VAT, «+ IVA» beside them.
export function Visits({ copy }: { copy: FerragialCopy }) {
  const { visits } = copy;
  const root = useRef<HTMLElement>(null);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-exp-frame]", root.current).forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(46% 0% 46% 0% round 1rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 1rem)", ease: "power2.out", scrollTrigger: { trigger: frame, start: "top 95%", end: "top 45%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pick = (id: string) => window.dispatchEvent(new CustomEvent(pickExperienceEvent, { detail: id }));

  return (
    <section ref={root} id={ferragialSections.visits} aria-labelledby="fg-visits-title" className="fg-cal relative pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="fg-label mb-5 flex items-center gap-3 text-barro">
              <span aria-hidden="true" className="h-px w-10 bg-barro/60" />
              {visits.eyebrow}
            </p>
            <h2 id="fg-visits-title" className="font-display text-[clamp(2.8rem,10vw,6.2rem)] leading-[0.92] tracking-[-0.015em]">
              {visits.title} <span className="text-tinto">{visits.titleAccent}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[1.04rem] leading-[1.75] text-pedra">{visits.intro}</p>
            <p className="mt-4 text-sm font-semibold">{visits.vatNote}</p>
            <p className="mt-1 text-sm text-pedra">
              {visits.demoNote} {visits.adults}
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {ferragialExperiences.map((exp) => (
            <li key={exp.id}>
              <article aria-labelledby={`fg-exp-${exp.id}`} className="flex h-full flex-col">
                <div data-exp-frame className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-xisto">
                  <Media exp={exp} motionOk={motionOk} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(30_26_25/0.75))]" />
                  <p className="absolute inset-x-4 bottom-4 flex items-baseline justify-between gap-3 text-cal">
                    <span className="fg-label text-[0.65rem]">{ferragialDuration(exp.minutes)}</span>
                    <span>
                      <span className="font-display text-[1.7rem] leading-none tabular-nums">{ferragialPrice(exp.price)}</span>
                      <span className="ml-1.5 text-[0.65rem] font-semibold tracking-[0.12em] uppercase">{visits.plusVat}</span>
                    </span>
                  </p>
                </div>
                <h3 id={`fg-exp-${exp.id}`} className="mt-5 font-display text-[1.75rem] leading-tight">
                  {exp.name}
                </h3>
                <p className="mt-1 text-xs tracking-[0.08em] text-pedra uppercase">{visits.perPerson}</p>
                <p className="mt-3 leading-relaxed text-pedra">{exp.short}</p>
                <ul className="mt-3 grid gap-1 text-[0.92rem]">
                  {exp.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-barro" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`#${ferragialSections.book}`}
                  onClick={() => pick(exp.id)}
                  className="group mt-5 inline-flex h-12 w-fit items-center gap-3 rounded-full bg-xisto px-5 text-[0.76rem] font-semibold tracking-[0.12em] text-cal uppercase transition-colors hover:bg-tinto"
                >
                  {visits.choose}
                  <span className="sr-only">: {exp.name}</span>
                  <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </article>
            </li>
          ))}
        </ul>

        <div id={ferragialSections.book} className="mt-20 scroll-mt-20 lg:mt-28">
          <BookingForm copy={copy} />
        </div>
      </div>
    </section>
  );
}
