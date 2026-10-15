"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

// Three reels standing like phones in 3D, fanning open as the band scrolls into view: a hint of the video
// menu behind the «Ver o menu» button. Decorative (the button carries the meaning).

export function PhoneFan({ images }: { images: readonly [string, string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const leftX = useTransform(p, [0, 1], ["0%", "-62%"]);
  const rightX = useTransform(p, [0, 1], ["0%", "62%"]);
  const leftR = useTransform(p, [0, 1], [0, -14]);
  const rightR = useTransform(p, [0, 1], [0, 14]);
  const tilt = useTransform(p, [0, 1], [28, 8]);

  const card = "absolute inset-0 overflow-hidden rounded-[1.4rem] bg-[var(--dz-surface)] ring-[5px] ring-[var(--dz-surface)] shadow-[0_30px_50px_-28px_rgb(0_0_0/0.6)]";
  const still = reduced ?? false;
  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} aria-hidden="true" className="relative mx-auto aspect-[9/16] w-[38%] max-w-[190px] [perspective:1000px]">
        <m.div className="absolute inset-0 [transform-style:preserve-3d]" style={still ? undefined : { rotateX: tilt }}>
          <m.div className={card} style={still ? { x: "-62%", rotate: -14 } : { x: leftX, rotate: leftR, z: -60 }}>
            <Image src={images[0]} alt="" fill sizes="190px" className="object-cover" />
          </m.div>
          <m.div className={card} style={still ? { x: "62%", rotate: 14 } : { x: rightX, rotate: rightR, z: -60 }}>
            <Image src={images[2]} alt="" fill sizes="190px" className="object-cover" />
          </m.div>
          <m.div className={card} style={{ z: 40 }}>
            <Image src={images[1]} alt="" fill sizes="190px" className="object-cover" />
          </m.div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
