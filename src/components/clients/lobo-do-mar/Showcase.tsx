"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import { loboSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The display on ice, driven by the scroll: the scene holds still and the restaurant's own film of its display
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
        tl.fromTo(q("[data-frame]"), { clipPath: "inset(12% 18% 12% 18% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 0.25 }, 0);
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
    <section ref={root} id={loboSections.showcase} aria-labelledby="lm-showcase-title" className="relative overflow-hidden bg-areia text-abismo">
      <div className="mx-auto grid min-h-svh max-w-[90rem] items-center gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-10">
        <div className="relative z-10 order-2 lg:order-1">
          <p className="lm-eyebrow text-coral-deep">{showcase.eyebrow}</p>
          <h2 id="lm-showcase-title" className="mt-4 font-display text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.92] uppercase">
            {showcase.title}
          </h2>
          <ol className="relative mt-8 grid min-h-[7.5rem]">
            {showcase.steps.map((step, i) => (
              <li key={step} data-step className="col-start-1 row-start-1 flex gap-4 text-[1.3rem] leading-snug font-semibold sm:text-2xl motion-reduce:relative motion-reduce:row-auto motion-reduce:mb-4">
                <span className="font-display text-coral">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-abismo/10 motion-reduce:hidden">
            <div data-bar className="h-full origin-left scale-x-0 bg-coral" />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div data-frame className="relative mx-auto aspect-[9/16] max-h-[46svh] overflow-hidden rounded-[2rem] bg-abismo lg:max-h-[86svh]">
            {/* eslint-disable-next-line @next/next/no-img-element -- the still frame under the film */}
            <img src={lobo.media.showcase} alt={showcase.alt} className="absolute inset-0 h-full w-full object-cover" />
            <video ref={film} src={lobo.media.clipIce} muted playsInline preload="auto" aria-hidden="true" className="absolute inset-0 hidden h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
