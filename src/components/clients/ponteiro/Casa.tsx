"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro } from "@/content/ponteiro/facts";
import { Reveal } from "./Reveal";
import { ponteiroSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// The house and the people who keep its clock going, over a film of the long counter against the window light. The
// film drifts slower than the page (scrub), and a yolk-yellow thread runs down the team's hours as they pass, each
// person at the time their day starts. No faces: the team is fictional, and the page says so.
export function Casa({ copy }: { copy: PonteiroCopy }) {
  const { casa } = copy;
  const root = useRef<HTMLElement>(null);
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

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(q("[data-film]"), { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        const list = q("[data-team]")[0];
        gsap.fromTo(q("[data-team-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: 0.5 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={ponteiroSections.casa} aria-labelledby="pn-casa-title" className="pn-on-dark relative isolate overflow-hidden bg-noite text-papel">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-film className="absolute inset-x-0 -inset-y-[12%] will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element -- the film's first frame, under the film */}
          <img src={ponteiro.media.balcaoPoster} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {motionOk ? (
            <video ref={film} src={ponteiro.media.balcao} poster={ponteiro.media.balcaoPoster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(27_24_56/0.5),rgb(27_24_56/0.82)_45%,rgb(27_24_56/0.96))]" />
      </div>
      <p className="sr-only">{casa.filmAlt}</p>

      <div className="mx-auto grid max-w-[84rem] gap-14 px-5 py-24 sm:px-8 sm:py-36 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="pn-label mb-5 flex items-center gap-4 text-gema">
            <span aria-hidden="true" className="h-px w-10 bg-gema/60" />
            {casa.eyebrow}
          </p>
          <h2 id="pn-casa-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.92]">
            {casa.title} <span className="text-gema italic">{casa.titleItalic}</span>
          </h2>
          <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed text-papel/80">{casa.text}</p>
        </Reveal>

        <div>
          <ol data-team className="relative grid gap-10 pl-10">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[9px] w-px bg-papel/15">
              <span data-team-line className="block h-full w-full origin-top bg-gema" />
            </span>
            {casa.team.map((person) => (
              <li key={person.name} className="relative">
                <span aria-hidden="true" className="absolute top-1 -left-10 grid size-5 place-items-center rounded-full bg-noite ring-2 ring-gema">
                  <span className="size-1.5 rounded-full bg-gema" />
                </span>
                <Reveal>
                  <p className="pn-label text-gema tabular-nums">{person.time}</p>
                  <h3 className="mt-2 font-display text-[2.2rem] leading-none">
                    {person.name} <span className="font-sans text-[0.95rem] text-papel/60">· {person.role}</span>
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-papel/75">{person.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-xs text-papel/55">{casa.note}</p>
        </div>
      </div>
    </section>
  );
}
