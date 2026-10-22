"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { loboSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The display on ice, driven by the scroll (full screen on phones, a tall frame on large screens): the scene holds still and the restaurant's own film of its display
// moves forward and back with the page (every frame is a keyframe, so it follows the finger), while three short
// lines take turns beside it, each staying long enough to read. Reduced motion: the still frame and the three lines.
export function Showcase({ copy }: { copy: LoboCopy }) {
  const { showcase } = copy;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const video = film.current;
        if (video) {
          video.style.display = "block";
          video.load();
        }
        const steps = q("[data-step]");
        gsap.set(steps.slice(1), { opacity: 0, y: 40 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            // iPhones only paint a seeked frame once the film has played: a silent play/pause unlocks it.
            onEnter: () => {
              if (video) void video.play().then(() => video.pause()).catch(() => {});
            },
            onUpdate: (self) => {
              if (video && video.duration) video.currentTime = Math.min(video.duration - 0.05, self.progress * video.duration);
            },
          },
        });
        // Large screens only: the frame opens a little as the scene starts (phones show the film full screen at once).
        if (window.matchMedia("(min-width: 1024px)").matches) {
          tl.fromTo(q("[data-frame]"), { clipPath: "inset(8% 10% 8% 10% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 0.2 }, 0);
        }
        steps.forEach((step, i) => {
          if (i > 0) tl.to(steps[i - 1], { opacity: 0, y: -40, duration: 0.06 }, i * 0.33 - 0.04).to(step, { opacity: 1, y: 0, duration: 0.06 }, i * 0.33);
        });
        tl.to(q("[data-bar]"), { scaleX: 1, duration: 1 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id={loboSections.showcase} aria-labelledby="lm-showcase-title" className="relative overflow-hidden bg-abismo text-white lg:bg-areia lg:text-abismo">
      <div className="relative mx-auto flex min-h-svh max-w-[90rem] flex-col justify-end px-5 pt-24 pb-12 sm:px-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:py-10">
        {/* Phones: the film fills the screen behind the words; large screens: a tall frame on the right. */}
        <div data-frame className="absolute inset-0 overflow-hidden bg-abismo lg:relative lg:inset-auto lg:order-2 lg:mx-auto lg:aspect-[9/16] lg:h-[86svh] lg:rounded-[2rem]">
          {/* eslint-disable-next-line @next/next/no-img-element -- the still frame under the film */}
          <img src={lobo.media.showcase} alt={showcase.alt} className="absolute inset-0 h-full w-full object-cover" />
          <video ref={film} src={lobo.media.clipIce} muted playsInline preload="auto" aria-hidden="true" className="absolute inset-0 hidden h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(18_33_59/0.55)_0%,transparent_30%,transparent_45%,rgb(18_33_59/0.95)_100%)] lg:hidden" />
        </div>
        <div className="relative z-10 lg:order-1">
          <p className="lm-eyebrow text-coral">{showcase.eyebrow}</p>
          <h2 id="lm-showcase-title" className="mt-4 font-display text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.92] uppercase">
            {showcase.title}
          </h2>
          <ol className="relative mt-6 grid min-h-[5.5rem] lg:mt-8 lg:min-h-[7.5rem]">
            {showcase.steps.map((step, i) => (
              <li key={step} data-step className="col-start-1 row-start-1 flex gap-4 text-[1.2rem] leading-snug font-semibold sm:text-2xl motion-reduce:relative motion-reduce:row-auto motion-reduce:mb-4">
                <span className="font-display text-coral">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="mt-5 h-1 w-full max-w-xs overflow-hidden rounded-full bg-current/15 motion-reduce:hidden">
            <div data-bar className="h-full origin-left scale-x-0 bg-coral" />
          </div>
        </div>
      </div>
    </section>
  );
}
