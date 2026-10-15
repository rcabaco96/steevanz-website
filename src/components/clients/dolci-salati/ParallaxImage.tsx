"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

// A photo that drifts a little slower than the page as it scrolls by, inside a frame that opens as it
// appears (the frame's reveal is data-reveal="clip", handled by RevealObserver).

interface ParallaxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  /** How far the photo travels, in % of its height. */
  amount?: number;
}

export function ParallaxImage({ src, alt, width, height, sizes, className = "", amount = 8 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={ref} data-reveal="clip" className={`relative overflow-hidden rounded-[2rem] ${className}`}>
        <m.div className="absolute -inset-y-[10%] inset-x-0" style={reduced ? undefined : { y }}>
          <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className="h-full w-full object-cover" />
        </m.div>
      </div>
    </LazyMotion>
  );
}
