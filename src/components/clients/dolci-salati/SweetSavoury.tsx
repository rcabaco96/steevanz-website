"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { DolciCopy } from "@/content/dolci-salati";
import styles from "./dolci.module.css";

// «Dois lados. A mesma pausa.»: a two-way switch and a card that turns over in 3D, sweet on one face,
// savoury on the other. The section's colour follows the side. CSS transitions only.

interface Side {
  image: string;
  alt: string;
}

interface SweetSavouryProps {
  copy: DolciCopy["dual"];
  sweet: Side;
  savory: Side;
}

export function SweetSavoury({ copy, sweet, savory }: SweetSavouryProps) {
  const [side, setSide] = useState<"sweet" | "savory">("sweet");
  const current = side === "sweet" ? copy.sweet : copy.savory;
  const isSweet = side === "sweet";

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] px-5 py-10 transition-colors duration-700 sm:px-10 sm:py-14"
      style={{ background: isSweet ? "var(--dz-berry-soft)" : "var(--dz-bg-2)" } as CSSProperties}
    >
      {/* The giant word in the background swaps with a slide. */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-3 right-0 left-0 h-[1.1em] overflow-hidden text-center text-[clamp(5rem,30vw,15rem)] leading-none">
        <span className={`display-italic absolute inset-x-0 text-[var(--dz-berry)] opacity-15 transition-all duration-700 ${isSweet ? "translate-y-0" : "-translate-y-full"}`}>{copy.sweet.word}</span>
        <span className={`display-italic absolute inset-x-0 text-[var(--dz-pista-deep)] opacity-20 transition-all duration-700 ${isSweet ? "translate-y-full" : "translate-y-0"}`}>{copy.savory.word}</span>
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 mx-auto w-full max-w-[290px] [perspective:1100px] sm:max-w-[330px] lg:order-1">
          <div
            className="relative aspect-[4/5] w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${isSweet ? 0 : 180}deg) rotateZ(${isSweet ? -2 : 2}deg)` }}
          >
            {[{ face: sweet, back: false }, { face: savory, back: true }].map(({ face, back }) => (
              <div
                key={face.image}
                className="absolute inset-0 overflow-hidden rounded-[1.6rem] bg-[var(--dz-surface)] shadow-[0_30px_60px_-30px_rgb(var(--dz-shadow)/0.55)] ring-4 ring-[var(--dz-surface)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                style={back ? { transform: "rotateY(180deg)" } : undefined}
                aria-hidden={back === isSweet}
              >
                <Image src={face.image} alt={face.alt} fill sizes="(min-width: 640px) 330px, 290px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <p className="text-center text-sm font-medium text-[var(--dz-ink-2)] lg:text-left">{copy.question}</p>
          <div role="group" aria-label={copy.question} className="relative mx-auto mt-3 grid w-full max-w-sm grid-cols-2 rounded-full bg-[var(--dz-surface)] p-1 shadow-[inset_0_0_0_1px_var(--dz-line)] lg:mx-0">
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[var(--dz-ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(${isSweet ? 0 : 100}%)` }}
            />
            {(["sweet", "savory"] as const).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={side === key}
                onClick={() => setSide(key)}
                className={`relative z-10 min-h-11 rounded-full px-1.5 text-[0.8125rem] font-semibold whitespace-nowrap sm:px-3 sm:text-sm transition-colors duration-300 ${side === key ? "text-[var(--dz-bg)]" : "text-[var(--dz-ink)]"}`}
              >
                {copy[key].tab}
              </button>
            ))}
          </div>

          <div aria-live="polite">
            <div key={side} className={`mt-8 text-center lg:text-left ${styles.sideIn}`}>
              <h3 className="display text-4xl text-[var(--dz-ink)] sm:text-5xl">{current.title}</h3>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-[var(--dz-ink-2)] lg:mx-0">{current.text}</p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                {current.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-[var(--dz-line)] bg-[var(--dz-surface)] px-4 py-1.5 text-sm font-medium text-[var(--dz-ink)]">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-[var(--dz-ink-2)] lg:text-left">{copy.note}</p>
        </div>
      </div>
    </div>
  );
}
