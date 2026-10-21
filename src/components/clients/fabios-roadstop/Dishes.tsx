"use client";

import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy, FabiosDish } from "@/content/fabios-roadstop/copy";
import { ArrowIcon, ArrowUpRightIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { SplitText } from "./react-bits/SplitText";

function dishImage(dish: FabiosDish): string | null {
  return dish.image ? fabios.media[dish.image] : null;
}

// «What we serve» as a diner wall menu: four huge lines. With a mouse, the dish's photo follows the pointer
// over the list; on phones each line shows its photo.
export function Dishes({ copy, menuHref }: { copy: FabiosCopy; menuHref: string }) {
  const { dishes } = copy;
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.7 });

  const onMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const activeDish = active === null ? null : dishes.items[active];
  const activeSrc = activeDish ? dishImage(activeDish) : null;

  return (
    <section id="o-que-servimos" aria-labelledby="fr-dishes-title" className="relative overflow-hidden bg-cream py-24 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-booth/50 blur-3xl" />
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.3em] text-cherry uppercase sm:text-sm">
              <span aria-hidden="true" className="h-0.5 w-10 bg-cherry" />
              {dishes.eyebrow}
            </p>
            <h2 id="fr-dishes-title" className="font-display text-[clamp(2.9rem,10vw,7.5rem)] leading-[0.88] uppercase">
              <SplitText text={dishes.title} className="block" />{" "}
              <span className="mt-1 block -rotate-2 font-script text-[0.62em] leading-[1.15] text-cherry normal-case">
                {dishes.titleScript}
              </span>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted lg:justify-self-end lg:pb-4">{dishes.intro}</p>
        </div>

        <ul
          className="relative mt-14 border-b border-ink/15 sm:mt-20"
          onPointerMove={onMove}
          onPointerLeave={() => setActive(null)}
        >
          {dishes.items.map((dish, i) => {
            const src = dishImage(dish);
            return (
              <li key={dish.id} className="border-t border-ink/15">
                <a
                  href={menuHref}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 py-6 sm:gap-x-8 sm:py-8 lg:py-10"
                >
                  <span className="self-start pt-2 font-sans text-xs font-bold tracking-widest text-cherry tabular-nums sm:pt-4 sm:text-sm">
                    0{i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[clamp(2.7rem,12.5vw,9.5rem)] leading-[0.9] uppercase transition-[color,transform] duration-500 ease-[var(--ease-diner)] group-hover:translate-x-3 group-hover:text-cherry-bright group-focus-visible:text-cherry-bright">
                      {dish.name}
                    </span>
                    <span className="mt-2 block max-w-md text-base leading-snug text-muted sm:text-lg">{dish.line}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 text-ink transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-cherry group-hover:bg-cherry group-hover:text-cream sm:h-16 sm:w-16"
                  >
                    <ArrowIcon />
                  </span>
                  {src ? (
                    <span className="col-span-3 block overflow-hidden rounded-2xl lg:hidden">
                      <Image
                        src={src}
                        alt={dish.alt}
                        width={fabiosImageSize.still.width}
                        height={fabiosImageSize.still.height}
                        sizes="(min-width: 640px) 90vw, 100vw"
                        className="h-auto w-full object-cover"
                      />
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}

          {/* The floating photo (mouse only). */}
          <m.div
            aria-hidden="true"
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute top-0 left-0 z-10 hidden lg:block"
          >
            <AnimatePresence>
              {activeSrc ? (
                <m.div
                  key={activeSrc}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: -5 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="fr-polaroid absolute -top-40 -left-48 w-[24rem]"
                >
                  <Image
                    src={activeSrc}
                    alt=""
                    width={fabiosImageSize.still.width}
                    height={fabiosImageSize.still.height}
                    sizes="384px"
                    className="h-auto w-full"
                  />
                  <span className="absolute bottom-2.5 left-4 font-script text-2xl text-ink">{activeDish?.name}</span>
                </m.div>
              ) : null}
            </AnimatePresence>
          </m.div>
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-4 sm:mt-16">
          <Magnet>
            <a
              href={menuHref}
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink pr-2 pl-7 text-lg font-bold text-cream transition-colors hover:bg-cherry"
            >
              {dishes.cta}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sun text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRightIcon />
              </span>
            </a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
