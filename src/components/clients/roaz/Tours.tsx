"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { RoazCopy, RoazReveal, RoazTour } from "@/content/roaz/copy";
import { roaz, roazDuration, roazPhotos, roazPrice } from "@/content/roaz/facts";
import { AutoVideo } from "./AutoVideo";
import { ArrowIcon, CheckIcon } from "./icons";
import { SplitText } from "./react-bits/SplitText";
import { pickTourEvent, roazSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** What covers each trip's film before it opens (all drawn in a 100 × 100 box, sliced to cover the frame). */
function Cover({ reveal }: { reveal: RoazReveal }) {
  if (reveal === "gruta") {
    // Inside a sea cave looking out: warm rock all round, the mouth of the cave open to the sea.
    return (
      <svg data-cover aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="rz-cover absolute inset-0 h-full w-full origin-[50%_58%] will-change-transform">
        <defs>
          <radialGradient id="rz-rock" cx="50%" cy="60%" r="70%">
            <stop offset="0.25" stopColor="#f0b860" />
            <stop offset="0.7" stopColor="#b8712a" />
            <stop offset="1" stopColor="#5e3412" />
          </radialGradient>
          <mask id="rz-cave-mouth">
            <rect x="-50" y="-50" width="200" height="200" fill="white" />
            <path d="M33 78C31 66 33 55 38 47C42 41 46 38 50 37.5C55 37 60 40 63.5 46C67.5 53 69 63 67 78C61 80 40 80 33 78Z" fill="black" />
          </mask>
        </defs>
        <rect x="-50" y="-50" width="200" height="200" fill="url(#rz-rock)" mask="url(#rz-cave-mouth)" />
        <g fill="none" stroke="#6b3b14" strokeWidth="0.35" opacity="0.5" mask="url(#rz-cave-mouth)">
          <path d="M-10 20C20 16 40 22 60 18S90 14 110 20" />
          <path d="M-10 30C15 27 35 31 55 29S90 24 110 30" />
          <path d="M-10 88C20 84 45 90 70 86S95 84 110 88" />
        </g>
      </svg>
    );
  }
  if (reveal === "binoculos") {
    // The view through binoculars: two round lenses in the dark.
    return (
      <svg data-cover aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="rz-cover absolute inset-0 h-full w-full origin-center will-change-transform">
        <defs>
          <mask id="rz-binoculars">
            <rect x="-50" y="-50" width="200" height="200" fill="white" />
            <circle cx="39" cy="50" r="15" fill="black" />
            <circle cx="61" cy="50" r="15" fill="black" />
          </mask>
        </defs>
        <rect x="-50" y="-50" width="200" height="200" fill="var(--color-fundo)" mask="url(#rz-binoculars)" />
      </svg>
    );
  }
  return null;
}

function TourMedia({ tour, index }: { tour: RoazTour; index: number }) {
  const poster = roazPhotos[tour.poster];
  return (
    <div
      data-media
      data-reveal={tour.reveal}
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-fundo sm:aspect-[16/11] lg:aspect-[4/5] ${index % 2 ? "lg:col-start-1" : "lg:col-start-2"} lg:row-span-2 lg:row-start-1`}
    >
      <div data-film className="absolute inset-0 will-change-transform">
        <AutoVideo src={roaz.media[tour.video]} poster={poster} alt={tour.alt} sizes="(min-width: 1024px) 46vw, 92vw" />
      </div>
      {tour.reveal === "horizonte" ? (
        <span data-sun aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 block size-24 -translate-x-1/2 rounded-full bg-falesia opacity-0 mix-blend-screen blur-[2px] will-change-transform sm:size-32" />
      ) : null}
      <Cover reveal={tour.reveal} />
      <span className="absolute top-4 left-4 rounded-full bg-fundo/70 px-3 py-1.5 font-stencil text-sm tracking-[0.2em] text-sal backdrop-blur-sm">{tour.number}</span>
    </div>
  );
}

// THE TRIPS. Four chapters, and each film opens in the way that trip is seen from the boat (the scroll drives it):
// the caves open from inside a sea cave, its mouth growing until we are out on the water; the dolphins through
// binoculars, the two lenses widening into the whole frame; the sunset from the horizon line outwards while the sun
// sinks; kayak and SUP inside a wake, a V opening behind the paddlers. Prices per person, without VAT, «+ IVA»
// beside each (owner's absolute rule). Reduced motion or no JavaScript: the films' stills, already open.
export function Tours({ copy }: { copy: RoazCopy }) {
  const { tours } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        q("[data-media]").forEach((media) => {
          const reveal = media.getAttribute("data-reveal");
          const film = media.querySelector("[data-film]");
          const st = { trigger: media, start: "top 88%", end: "center 45%", scrub: 0.7 };
          const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st });
          if (film) tl.fromTo(film, { scale: 1.25 }, { scale: 1, duration: 1 }, 0);
          const cover = media.querySelector("[data-cover]");
          if (cover) tl.fromTo(cover, { scale: 1 }, { scale: 9, ease: "power2.in", duration: 1 }, 0).to(cover, { opacity: 0, duration: 0.1 }, 0.9);
          if (reveal === "horizonte") {
            tl.fromTo(media, { clipPath: "inset(49% 0% 49% 0% round 1.75rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", ease: "power2.inOut", duration: 0.8 }, 0);
            const sun = media.querySelector("[data-sun]");
            if (sun) tl.fromTo(sun, { yPercent: 40, opacity: 0.9 }, { yPercent: 260, opacity: 0, duration: 1 }, 0);
          }
          if (reveal === "esteira") {
            tl.fromTo(
              media,
              { clipPath: "polygon(50% -5%, 50% -5%, 50% -5%)" },
              { clipPath: "polygon(50% -5%, 260% 160%, -160% 160%)", ease: "power1.in", duration: 0.9 },
              0,
            );
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pick = (id: string) => window.dispatchEvent(new CustomEvent(pickTourEvent, { detail: id }));
  const term = "rz-label mb-1.5 block text-[0.72rem] text-ocre";

  return (
    <section ref={root} id={roazSections.tours} aria-labelledby="rz-tours-title" className="relative bg-sal pt-24 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="rz-label mb-5 text-ocre">{tours.eyebrow}</p>
            <h2 id="rz-tours-title" className="rz-title text-[clamp(3rem,11vw,7.6rem)] text-fundo">
              <SplitText text={tours.title} splitType="chars" delay={26} className="block" />
              <span className="block text-falesia-deep">{tours.titleLine}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[1.05rem] leading-[1.75] text-pedra">{tours.intro}</p>
            <p className="mt-5 text-sm font-semibold text-tinta">{tours.vatNote}</p>
            <p className="mt-1 text-sm text-pedra">{tours.demoNote}</p>
          </div>
        </div>

        <nav aria-label={tours.eyebrow} className="-mx-5 mt-10 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {tours.list.map((tour) => (
              <li key={tour.id}>
                <a
                  href={`#saida-${tour.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-areia px-4 font-display text-[1.1rem] font-semibold whitespace-nowrap uppercase transition-colors hover:bg-areia-2"
                >
                  <span className="font-stencil text-sm text-ocre">{tour.number}</span>
                  {tour.name} {tour.nameLine}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ol className="mx-auto mt-14 flex max-w-[84rem] flex-col gap-20 px-5 sm:mt-20 sm:gap-28 sm:px-8 lg:gap-36">
        {tours.list.map((tour, i) => (
          <li key={tour.id} id={`saida-${tour.id}`} className="scroll-mt-24">
            <article aria-labelledby={`rz-tour-${tour.id}`} className="grid gap-7 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8">
              <header className={`lg:row-start-1 lg:self-end ${i % 2 ? "lg:col-start-2" : "lg:col-start-1"}`}>
                <p className="font-stencil text-[clamp(3rem,10vw,5.5rem)] leading-none text-falesia">{tour.number}</p>
                <h3 id={`rz-tour-${tour.id}`} className="rz-title mt-2 text-[clamp(2.5rem,9vw,5rem)] text-fundo">
                  {tour.name} <span className="block text-falesia-deep">{tour.nameLine}</span>
                </h3>
                <p className="mt-5 max-w-xl text-[1.05rem] leading-[1.75] text-pedra">{tour.intro}</p>
              </header>

              <TourMedia tour={tour} index={i} />

              <div className={`lg:row-start-2 ${i % 2 ? "lg:col-start-2" : "lg:col-start-1"}`}>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-tinta/12 pt-6">
                  <div>
                    <dt className={term}>{tours.durationLabel}</dt>
                    <dd className="font-stencil text-[1.9rem] leading-none font-bold text-fundo">{roazDuration(tour.minutes)}</dd>
                  </div>
                  <div>
                    <dt className={term}>{tours.fromLabel}</dt>
                    <dd className="leading-snug font-medium">{tour.from}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className={term}>{tours.departuresLabel}</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-2">
                        {tour.departures.map((time) => (
                          <li key={time} className="rounded-full bg-areia px-3 py-1 font-stencil text-[1.05rem] font-bold tabular-nums">
                            {time}
                          </li>
                        ))}
                      </ul>
                      {tour.departureNote ? <p className="mt-2 text-[0.85rem] text-pedra">{tour.departureNote}</p> : null}
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className={term}>{tours.includesLabel}</dt>
                    <dd>
                      <ul className="grid gap-1.5">
                        {tour.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[0.96rem] leading-snug">
                            <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-falesia-deep" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className={term}>{tours.suitsLabel}</dt>
                    <dd className="text-[0.96rem] leading-snug">{tour.suits}</dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-col gap-5 rounded-[1.5rem] bg-fundo p-5 text-sal sm:flex-row sm:items-end sm:justify-between sm:p-6">
                  <div className="grid gap-3">
                    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="font-stencil text-[3rem] leading-none font-bold whitespace-nowrap">{roazPrice(tour.adult)}</span>
                      <span className="rz-label text-[0.72rem] text-falesia">{tours.plusVat}</span>
                      <span className="text-sm text-sal/70">
                        {tours.perPerson} · {tours.adultLabel.toLowerCase()}
                      </span>
                    </p>
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sal/85">
                      <span className="text-sm">{tour.childLabel}</span>
                      <span className="font-stencil text-[1.4rem] leading-none font-bold whitespace-nowrap">{roazPrice(tour.child)}</span>
                      <span className="rz-label text-[0.66rem] text-falesia">{tours.plusVat}</span>
                    </p>
                  </div>
                  <a
                    href={`#${roazSections.book}`}
                    onClick={() => pick(tour.id)}
                    className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-3 rounded-full bg-falesia px-5 font-display text-[1.05rem] whitespace-nowrap sm:w-auto sm:px-6 sm:text-[1.1rem] font-bold tracking-[0.08em] text-fundo uppercase transition-colors hover:bg-falesia-deep"
                  >
                    {tours.book}
                    <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-24 max-w-[84rem] px-5 sm:mt-32 sm:px-8">
        <h3 className="rz-title text-[clamp(2.2rem,7vw,3.6rem)] text-fundo">{tours.extras.title}</h3>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-[1.5rem] bg-tinta/10 sm:grid-cols-2">
          {tours.extras.items.map((item) => (
            <li key={item.name} className="flex items-start justify-between gap-5 bg-sal p-5 sm:p-6">
              <span className="min-w-0">
                <span className="block font-display text-[1.45rem] leading-tight font-bold uppercase">{item.name}</span>
                <span className="mt-1 block text-[0.94rem] leading-snug text-pedra">{item.text}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-stencil text-[1.7rem] leading-none font-bold whitespace-nowrap">{roazPrice(item.price)}</span>
                <span className="rz-label mt-1 block text-[0.66rem] text-ocre">{tours.plusVat}</span>
                <span className="mt-0.5 block text-xs text-pedra">{item.unit}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-pedra">
          {tours.vatNote} {tours.demoNote}
        </p>
      </div>
    </section>
  );
}
