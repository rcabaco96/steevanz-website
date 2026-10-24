"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import {
  seteChavesPhotos,
  type SeteChavesPhotoId,
} from "@/content/sete-chaves/facts";
import { seteChavesSections } from "./sections";
import { TagRing } from "./TagRing";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The sky of each hour, from the Atlantic mist of the morning to the night over the valley. */
const skies = [
  "linear-gradient(180deg,#c3d1d6 0%,#e7e9e2 55%,#f5f1e8 100%)",
  "linear-gradient(180deg,#9fbcc8 0%,#dbe6e6 60%,#f3efe6 100%)",
  "linear-gradient(180deg,#86aabb 0%,#d9dccf 55%,#f2e2c2 100%)",
  "linear-gradient(180deg,#34405a 0%,#8a5a5e 50%,#e09a5e 100%)",
  "linear-gradient(180deg,#0f1319 0%,#1b2129 60%,#262c33 100%)",
];
/** From the sunset on, the words turn light. */
const darkFrom = 3;

// A DAY HERE, as one sky. The scene is held (GSAP pin + scrub) while the sun crosses the screen on an arc, from the
// breakfast on the porch to the stars over the valley: the sky changes hour by hour (stacked gradients that cross-fade:
// opacity only), each moment's photo comes in the key-tag frame and its words take the place of the last. Phones
// too (it fits a 360×640 screen). Reduced motion, short screens and no JavaScript: a plain list of the five moments.
export function Day() {
  const { day } = copy;
  const root = useRef<HTMLElement>(null);
  const n = day.moments.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(
        "(min-height: 560px) and (prefers-reduced-motion: no-preference)",
        () => {
          el.classList.add("sc-day-on");
          const moments = q("[data-moment]");
          const skyLayers = q("[data-sky]");
          const sun = q("[data-sun]")[0];
          gsap.set(moments.slice(1), { autoAlpha: 0 });
          gsap.set(skyLayers.slice(1), { opacity: 0 });
          const arc = { t: 0 };
          const placeSun = () => {
            const w = el.clientWidth;
            const h = el.clientHeight;
            const x = w * (0.06 + arc.t * 0.88);
            const y =
              h * 0.62 -
              Math.sin(Math.PI * Math.min(1, arc.t * 1.08)) * h * 0.5;
            gsap.set(sun, { x, y });
          };
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${(n - 1) * window.innerHeight * 0.8}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: placeSun,
            },
          });
          tl.to(arc, { t: 1, duration: n - 1 + 0.2, onUpdate: placeSun }, 0);
          tl.to(sun, { opacity: 0, duration: 0.4 }, n - 1.5);
          for (let i = 1; i < n; i++) {
            const at = i - 1 + 0.3;
            tl.to(skyLayers[i], { opacity: 1, duration: 0.6 }, at)
              .to(
                moments[i - 1],
                { autoAlpha: 0, y: -24, duration: 0.3, ease: "power1.in" },
                at,
              )
              .fromTo(
                moments[i],
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
                at + 0.3,
              )
              .fromTo(
                q(`[data-moment-photo="${i}"]`),
                {
                  clipPath: "inset(100% 0% 0% 0% round 999px 999px 22px 22px)",
                },
                {
                  clipPath: "inset(0% 0% 0% 0% round 999px 999px 22px 22px)",
                  duration: 0.5,
                  ease: "power2.out",
                },
                at + 0.25,
              );
          }
          tl.fromTo(
            q("[data-stars]"),
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            n - 1.6,
          );
          tl.to({}, { duration: 0.2 });
          placeSun();
          return () => el.classList.remove("sc-day-on");
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id={seteChavesSections.day}
      aria-labelledby="sc-day-title"
      className="relative overflow-hidden bg-cal"
    >
      {/* The skies and the sun only show while the scene is held. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden [.sc-day-on_&]:block"
      >
        {skies.map((sky, i) => (
          <div
            key={sky}
            data-sky
            className="absolute inset-0"
            style={{ background: sky, opacity: i === 0 ? 1 : 0 }}
          />
        ))}
        <div
          data-stars
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 18%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 28% 42%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 44% 12%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 63% 30%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 78% 16%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 88% 38%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 35% 24%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 55% 48%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 8% 52%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 94% 8%,#fff 50%,transparent 51%)",
          }}
        />
        <div
          data-sun
          className="absolute top-0 left-0 -mt-9 -ml-9 size-18 rounded-full bg-[#fbe7b5] shadow-[0_0_80px_30px_rgb(251_231_181/0.45)] will-change-transform"
        />
        {/* The ridge of the serra, in front of the sun. */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-[16vh] w-full"
        >
          <path
            d="M0 120C160 90 260 140 420 110S700 40 860 80 1180 150 1440 96V200H0Z"
            fill="rgb(38 44 51 / 0.22)"
          />
          <path
            d="M0 160C200 130 330 170 520 150S880 110 1060 140 1300 170 1440 150V200H0Z"
            fill="rgb(38 44 51 / 0.35)"
          />
        </svg>
      </div>

      <div className="sc-day-stage relative mx-auto max-w-[84rem] px-5 py-24 sm:px-8 [.sc-day-on_&]:py-0">
        <h2
          id="sc-day-title"
          className="relative z-10 font-display text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.98] tracking-[-0.02em] [.sc-day-on_&]:absolute [.sc-day-on_&]:top-20 [.sc-day-on_&]:left-5 [.sc-day-on_&]:sm:left-8 [.sc-day-on_&]:sm:top-24"
        >
          <span className="sc-label mb-3 block text-latao-deep [.sc-day-on_&]:text-[0.66rem]">
            {day.eyebrow}
          </span>
          <span className="[.sc-day-on_&]:sr-only">{day.title}</span>
        </h2>

        <ol className="mt-12 grid gap-20 [.sc-day-on_&]:mt-0 [.sc-day-on_&]:block [.sc-day-on_&]:h-full">
          {day.moments.map((moment, i) => {
            const photo = seteChavesPhotos[moment.photo as SeteChavesPhotoId];
            const light = i >= darkFrom;
            return (
              <li
                key={moment.time}
                data-moment
                className={`sc-moment flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-16 [.sc-day-on_&]:justify-center [.sc-day-on_&]:gap-4 [.sc-day-on_&]:px-5 [.sc-day-on_&]:pt-32 [.sc-day-on_&]:pb-[13vh] lg:[.sc-day-on_&]:pt-24 sm:[.sc-day-on_&]:px-8 ${
                  light ? "[.sc-day-on_&]:text-cal" : ""
                }`}
              >
                <div className="lg:order-1">
                  <p
                    className={`font-display text-[clamp(3rem,11vw,7.5rem)] leading-none tracking-[-0.03em] ${light ? "text-latao-deep [.sc-day-on_&]:text-latao-claro" : "text-latao-deep"}`}
                  >
                    {moment.time}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.6rem,5vw,2.6rem)] leading-tight">
                    {moment.title}
                  </h3>
                  <p
                    className={`mt-3 hidden max-w-md leading-relaxed lg:block ${light ? "text-tinta/80 [.sc-day-on_&]:text-cal/80" : "text-tinta/80"}`}
                  >
                    {moment.text}
                  </p>
                </div>
                <div className="relative mx-auto mt-[12%] aspect-[3/4] w-[min(62vw,19rem)] lg:order-2 lg:w-[min(30vw,24rem)] [.sc-day-on_&]:w-[min(38vw,14rem,23vh)] lg:[.sc-day-on_&]:w-[min(28vw,22rem,44vh)]">
                  <TagRing />
                  <div
                    data-moment-photo={i}
                    className="sc-fob relative h-full w-full overflow-hidden bg-linho shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]"
                  >
                    <Image
                      src={photo.src}
                      alt={moment.alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, 62vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-[6%] left-1/2 block size-[11%] -translate-x-1/2 rounded-full bg-cal/90 shadow-[inset_0_2px_4px_rgb(0_0_0/0.3)]"
                    />
                  </div>
                </div>
                <p
                  className={`max-w-md leading-relaxed lg:hidden ${light ? "text-tinta/80 [.sc-day-on_&]:text-cal/85" : "text-tinta/80"}`}
                >
                  {moment.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
