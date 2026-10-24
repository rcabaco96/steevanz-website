"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragial } from "@/content/ferragial/facts";
import { ArrowIcon, PhoneIcon, PinIcon } from "./icons";
import { ferragialSections } from "./sections";

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Opening hours as a small definition list (also used in the footer). */
export function HoursList({ dark = false }: { dark?: boolean }) {
  return (
    <dl className="grid gap-1.5">
      {ferragial.hours.map((h) => (
        <div key={h.days} className="flex justify-between gap-6">
          <dt className={dark ? "text-cal/70" : "text-pedra"}>{h.days}</dt>
          <dd className="tabular-nums">{h.time}</dd>
        </div>
      ))}
    </dl>
  );
}

// How to get there: a sunset over the plain plays behind (a time-lapse, only while on screen; the still frame with
// reduced motion), and on it a lime-wash card with the address, the hours, the times by car and the pick-up of
// online orders. Phones: heading, then the film, then the card (the mobile order of every section with media).
export function Visit({ copy }: { copy: FerragialCopy }) {
  const { visit } = copy;
  const film = useRef<HTMLVideoElement>(null);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useEffect(() => {
    const el = film.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  return (
    <section id={ferragialSections.visit} aria-labelledby="fg-visit-title" className="fg-dark relative isolate overflow-hidden bg-xisto">
      <div className="relative z-10 mx-auto max-w-[90rem] px-5 pt-24 text-cal sm:px-8 lg:pt-28">
        <p className="fg-label mb-4 text-palha">{visit.eyebrow}</p>
        <h2 id="fg-visit-title" className="font-display text-[clamp(2.6rem,9vw,5.4rem)] leading-[0.95]">
          {visit.title} <span className="text-palha">{visit.titleAccent}</span>
        </h2>
      </div>
      <div className="relative mt-8 aspect-[16/10] w-full lg:absolute lg:inset-0 lg:-z-10 lg:mt-0 lg:aspect-auto">
        {/* eslint-disable-next-line @next/next/no-img-element -- the time-lapse's still frame */}
        <img src={ferragial.media.duskPoster} alt={visit.alt} width={1280} height={720} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        {motionOk ? (
          <video ref={film} src={ferragial.media.dusk} poster={ferragial.media.duskPoster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(30_26_25/0.6),rgb(30_26_25/0.1)_65%)] max-lg:hidden" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 pb-20 sm:px-8 lg:pt-10 lg:pb-28">
        <div className="relative -mt-12 grid gap-8 rounded-[1.5rem] bg-cal p-6 text-tinta sm:p-9 lg:mt-0 lg:max-w-[46rem] lg:grid-cols-2">
          <div>
            <p className="fg-label text-barro">{visit.addressLabel}</p>
            <address className="mt-3 leading-relaxed not-italic">
              {ferragial.fullName}
              <br />
              {ferragial.street}
              <br />
              {ferragial.postalCode} {ferragial.locality}, {ferragial.region}
            </address>
            <a
              href={ferragial.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-xisto px-5 text-[0.76rem] font-semibold tracking-[0.1em] text-cal uppercase hover:bg-tinto"
            >
              <PinIcon width={17} height={17} />
              {visit.directions}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
            <p className="fg-label mt-7 text-barro">{visit.fromLabel}</p>
            <dl className="mt-3 grid gap-1.5">
              {visit.from.map((f) => (
                <div key={f.place} className="flex justify-between gap-6">
                  <dt className="text-pedra">{f.place}</dt>
                  <dd>{f.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="fg-label text-barro">{visit.hoursLabel}</p>
            <div className="mt-3">
              <HoursList />
            </div>
            <p className="fg-label mt-7 text-barro">{visit.phoneLabel}</p>
            <a href={ferragial.phoneHref} className="mt-2 inline-flex min-h-11 items-center gap-2 font-display text-[1.45rem] whitespace-nowrap hover:text-tinto">
              <PhoneIcon width={18} height={18} />
              {ferragial.phoneDisplay}
            </a>
            <p className="text-xs text-pedra">{visit.phoneNote}</p>
          </div>
          <div className="border-t border-tinta/10 pt-6 lg:col-span-2">
            <p className="leading-relaxed text-pedra">{visit.parking}</p>
            <p className="mt-4 font-semibold">{visit.pickupTitle}</p>
            <p className="mt-1 leading-relaxed text-pedra">{visit.pickupText}</p>
            <a href={`#${ferragialSections.wines}`} className="group mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-tinto underline-offset-4 hover:underline">
              {copy.nav.wines}
              <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
