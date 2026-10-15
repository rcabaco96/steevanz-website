"use client";

import { useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, m, LazyMotion, domAnimation } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

// Two rows of words that drift sideways and speed up (or turn back) with the scroll.
// Adapted from React Bits' ScrollVelocity (MIT + Commons Clause, © David Haz).

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function Row({ items, baseVelocity, className }: { items: readonly string[]; baseVelocity: number; className: string }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const copyRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  const direction = useRef(1);

  useLayoutEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const measure = () => setCopyWidth(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const x = useTransform(baseX, (v) => (copyWidth ? `${wrap(-copyWidth, 0, v)}px` : "0px"));

  useAnimationFrame((_, delta) => {
    if (reduced || !copyWidth) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  const copy = (key: string, ref?: React.Ref<HTMLDivElement>) => (
    <div key={key} ref={ref} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className={className}>{item}</span>
          <span aria-hidden="true" className="mx-5 inline-block h-2.5 w-2.5 rounded-full bg-[var(--dz-cone)] sm:mx-8" />
        </span>
      ))}
    </div>
  );

  return (
    <m.div className="flex w-max whitespace-nowrap will-change-transform" style={{ x }}>
      {copy("a", copyRef)}
      {copy("b")}
      {copy("c")}
    </m.div>
  );
}

export function ScrollVelocity({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative overflow-hidden py-8 sm:py-12 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" aria-label={label} role="img">
        <div aria-hidden="true" className="flex flex-col gap-2 sm:gap-4">
          <Row items={items} baseVelocity={-40} className="display text-5xl text-[var(--dz-ink)] sm:text-7xl" />
          <Row items={[...items].reverse()} baseVelocity={40} className="display-italic text-5xl text-[var(--dz-berry)] sm:text-7xl" />
        </div>
      </div>
    </LazyMotion>
  );
}
