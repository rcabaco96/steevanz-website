"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiroHhmm, ponteiroPhotos } from "@/content/ponteiro/facts";
import { Reveal } from "./Reveal";
import { ponteiroSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type Moment = PonteiroCopy["day"]["moments"][number];

/** A 24-hour dial: midnight at the top, noon at the bottom. */
const angleOf = (minutes: number) => (minutes / 1440) * 360;

/** Background and text of each hour of the day (morning yolk, marble noon, cinnamon tea-time, midnight indigo). */
const tones = [
  { bg: "bg-gema-soft", dark: false },
  { bg: "bg-marmore", dark: false },
  { bg: "bg-canela", dark: false },
  { bg: "bg-noite", dark: true },
];

function MomentText({ moment, dark }: { moment: Moment; dark: boolean }) {
  return (
    <>
      <p className={`pn-label flex items-center gap-3 ${dark ? "text-gema" : "text-ginja"}`}>
        <span className="tabular-nums">{ponteiroHhmm(moment.minutes)}</span>
        <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-gema/60" : "bg-ginja/50"}`} />
        {moment.name}
      </p>
      <h3 className="mt-3 font-display text-[clamp(1.9rem,6.4vw,3.6rem)] leading-[1] [@media(max-height:700px)]:text-[clamp(1.7rem,5.6vw,2.6rem)]">{moment.title}</h3>
      <p className={`mt-3 max-w-md text-[0.98rem] leading-relaxed sm:text-[1.05rem] ${dark ? "text-papel/80" : "text-tinta/75"}`}>{moment.text}</p>
      <ul className="mt-4 flex flex-wrap gap-2 [@media(max-height:760px)]:hidden">
        {moment.serves.map((item) => (
          <li key={item} className={`rounded-full px-3 py-1 text-[0.82rem] ring-1 ${dark ? "text-papel/85 ring-papel/25" : "text-tinta/80 ring-tinta/20"}`}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

// The hours of the house as a 24-hour clock with a single hand. Wide and tall enough screens (and phones) hold the
// scene still (GSAP pin + scrub): the hand sweeps from half past seven in the morning to ten at night, the hour in the
// middle of the dial counting with it; each moment's picture sits on the dial at its own hour and swells when the hand
// reaches it, while its words take over and the room behind changes light — egg-yolk morning, marble noon, cinnamon
// tea-time, indigo night. Reduced motion (and before JavaScript): the four moments one after the other.
export function DayDial({ copy }: { copy: PonteiroCopy }) {
  const { day } = copy;
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);
  return (
    <section id={ponteiroSections.day} aria-labelledby="pn-day-title" className="relative bg-gema-soft">
      <div className="mx-auto max-w-[84rem] px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <p className="pn-label mb-5 flex items-center gap-4 text-ginja">
          <span aria-hidden="true" className="h-px w-10 bg-ginja/50" />
          {day.eyebrow}
        </p>
        <h2 id="pn-day-title" className="font-display text-[clamp(2.8rem,10vw,6.4rem)] leading-[0.92]">
          {day.title} <span className="text-ginja italic">{day.titleItalic}</span>
        </h2>
        <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-tinta/75">{day.intro}</p>
      </div>
      {motionOk ? <DialStage moments={day.moments} /> : <MomentList moments={day.moments} />}
    </section>
  );
}

function MomentList({ moments }: { moments: Moment[] }) {
  return (
    <ol className="mx-auto grid max-w-[84rem] gap-6 px-5 pb-24 sm:px-8 md:grid-cols-2">
      {moments.map((moment, i) => {
        const photo = ponteiroPhotos[moment.image];
        const dark = tones[i].dark;
        return (
          <li key={moment.id} className={`overflow-hidden rounded-[1.6rem] ${tones[i].bg} ${dark ? "text-papel" : "text-tinta"} ring-1 ring-tinta/8`}>
            <Reveal>
              <div className="relative aspect-[16/10]">
                <Image src={photo.src} alt={moment.alt} width={photo.width} height={photo.height} sizes="(min-width: 768px) 45vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <MomentText moment={moment} dark={dark} />
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

function DialStage({ moments }: { moments: Moment[] }) {
  const root = useRef<HTMLDivElement>(null);
  const angles = moments.map((mo) => angleOf(mo.minutes));

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const hand = q("[data-dial-hand]")[0] as HTMLElement;
      const hourEl = q("[data-dial-hour]")[0] as HTMLElement;
      const photos = q("[data-dial-photo]") as HTMLElement[];
      const panels = q("[data-dial-panel]") as HTMLElement[];
      const layers = q("[data-dial-tone]") as HTMLElement[];
      let active = -1;
      const show = (n: number) => {
        if (n === active) return;
        active = n;
        photos.forEach((p, i) => gsap.to(p, { scale: i === n ? 1.55 : 0.82, opacity: i === n ? 1 : 0.55, duration: 0.6, ease: "power3.out", overwrite: true }));
        panels.forEach((p, i) => gsap.to(p, { autoAlpha: i === n ? 1 : 0, y: i === n ? 0 : i < n ? -24 : 24, duration: 0.5, ease: "power2.out", overwrite: true }));
        layers.forEach((l, i) => gsap.to(l, { opacity: i <= n ? 1 : 0, duration: 0.7, ease: "power1.inOut", overwrite: true }));
        el.classList.toggle("is-dark", tones[n].dark);
      };
      const state = { a: angles[0] };
      const render = () => {
        gsap.set(hand, { rotate: state.a });
        hourEl.textContent = ponteiroHhmm(Math.round(((state.a / 360) * 1440) / 5) * 5);
        // The moment whose hour the hand has reached (or is closest to).
        let n = 0;
        angles.forEach((a, i) => {
          if (state.a >= a - 18) n = i;
        });
        show(n);
      };
      gsap.set(panels, { autoAlpha: 0 });
      render();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=320%", pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
      });
      // Rest on each hour a little, then sweep on to the next.
      tl.to({}, { duration: 0.35 });
      for (let i = 1; i < angles.length; i++) {
        tl.to(state, { a: angles[i], duration: 1, ease: "power2.inOut", onUpdate: render }).to({}, { duration: 0.35 });
      }
      // This scene mounts after the others (it needs the browser to know about reduced motion) and its pin makes the
      // page taller: put the scenes back in page order and measure them all again.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="group/dial relative h-svh min-h-[560px] overflow-hidden text-tinta [&.is-dark]:text-papel">
      {/* The light of the hour, one layer per moment (only their opacity changes). */}
      {tones.map((t, i) => (
        <div key={t.bg} data-dial-tone aria-hidden="true" className={`absolute inset-0 ${t.bg}`} style={{ opacity: i === 0 ? 1 : 0 }} />
      ))}

      <div className="relative mx-auto grid h-full max-w-[84rem] grid-rows-[auto_1fr] gap-4 px-5 pt-20 pb-6 sm:px-8 lg:grid-cols-[1fr_1fr] lg:grid-rows-1 lg:items-center lg:gap-10 lg:pt-16">
        {/* The dial. */}
        <div className="relative mx-auto aspect-square w-[min(80vw,44svh)] lg:order-2 lg:w-[min(42vw,74svh)]">
          <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full overflow-visible text-gema-deep">
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
            {Array.from({ length: 96 }, (_, i) => {
              const big = i % 4 === 0;
              const a = (i / 96) * Math.PI * 2;
              const r1 = big ? 84 : 88;
              return (
                <line
                  key={i}
                  x1={100 + Math.sin(a) * r1}
                  y1={100 - Math.cos(a) * r1}
                  x2={100 + Math.sin(a) * 92}
                  y2={100 - Math.cos(a) * 92}
                  stroke="currentColor"
                  strokeWidth={big ? 1 : 0.4}
                />
              );
            })}
            {[0, 6, 12, 18].map((h) => {
              const a = (h / 24) * Math.PI * 2;
              return (
                <text key={h} x={100 + Math.sin(a) * 76} y={100 - Math.cos(a) * 76 + 3} textAnchor="middle" className="fill-current font-sans text-[7px] font-semibold">
                  {String(h).padStart(2, "0")}
                </text>
              );
            })}
          </svg>

          {/* The single hand. */}
          <div data-dial-hand aria-hidden="true" className="absolute inset-0 will-change-transform" style={{ transform: `rotate(${angles[0]}deg)` }}>
            <span className="absolute top-[9%] left-1/2 h-[41%] w-[3px] -translate-x-1/2 rounded-full bg-ginja group-[.is-dark]/dial:bg-gema" />
          </div>
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 grid size-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-papel text-tinta shadow-[0_20px_50px_-25px_rgb(26_23_20/0.6)]">
            <span data-dial-hour className="font-display text-[clamp(1.6rem,6.5vw,3.6rem)] leading-none tabular-nums">
              {ponteiroHhmm(moments[0].minutes)}
            </span>
          </div>

          {/* Each moment's picture, on the dial at its own hour. */}
          {moments.map((moment, i) => {
            const a = (angles[i] * Math.PI) / 180;
            const photo = ponteiroPhotos[moment.image];
            return (
              <div
                key={moment.id}
                data-dial-photo
                aria-hidden="true"
                className="absolute size-[24%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-papel ring-4 ring-papel will-change-transform"
                style={{ left: `${50 + Math.sin(a) * 46}%`, top: `${50 - Math.cos(a) * 46}%` }}
              >
                <Image src={photo.src} alt="" width={photo.width} height={photo.height} sizes="(min-width: 1024px) 16vw, 30vw" className="h-full w-full object-cover" />
              </div>
            );
          })}
        </div>

        {/* The words of the moment the hand has reached. */}
        <div className="grid self-start lg:order-1 lg:self-center [&>*]:col-start-1 [&>*]:row-start-1">
          {moments.map((moment, i) => (
            <div key={moment.id} data-dial-panel className={tones[i].dark ? "text-papel" : "text-tinta"}>
              <MomentText moment={moment} dark={tones[i].dark} />
              <span className="sr-only">{moment.alt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
