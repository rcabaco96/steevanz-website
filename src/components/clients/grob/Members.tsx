"use client";

import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { grob } from "@/content/grob/facts";
import { openContact } from "./contact-bus";
import { CourtLines } from "./CourtLines";
import { grobSections } from "./sections";
import { useReveal } from "./use-reveal";

// Seja sócio, numa faixa larga e baixa (dono, 2026-11-02: mais na horizontal): o título, a quota da página Sócios
// do clube (1,50 € por mês), o cartão de sócio que se inclina com o rato (à maneira do TiltedCard do React Bits,
// só com rato e sem movimento reduzido) e o botão, que abre a gaveta do formulário no motivo «Ser sócio».
export function Members() {
  const root = useRef<HTMLElement>(null);
  const shown = useReveal(root);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sry = useSpring(ry, { stiffness: 140, damping: 16 });
  const shineBg = useTransform(
    sry,
    (y) =>
      `radial-gradient(60% 80% at ${50 + y * 3}% 20%, rgb(255 255 255 / 0.28), transparent 60%)`,
  );

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    ry.set(((event.clientX - rect.left) / rect.width - 0.5) * 26);
    rx.set(-((event.clientY - rect.top) / rect.height - 0.5) * 20);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <section
      ref={root}
      id={grobSections.members}
      aria-labelledby="gb-members-title"
      data-shown={shown}
      className="gb-container relative bg-giz py-16 text-giz sm:py-20"
    >
      <div className="gb-reveal relative overflow-hidden rounded-[var(--radius-gb-xl)] bg-[linear-gradient(110deg,#062615_0%,#0b6b33_48%,#10a24b_100%)]">
        <CourtLines
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[180%] w-auto -translate-x-1/2 -translate-y-1/2 text-giz opacity-[0.1]"
        />
        <div className="relative grid items-center gap-x-14 gap-y-6 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-12">
          <div>
            <p className="gb-eyebrow text-relva-claro">Sócios</p>
            <h2
              id="gb-members-title"
              className="gb-display mt-3 text-[clamp(2.6rem,8vw,4.8rem)]"
            >
              Faça parte <span className="text-amarelo">desta família</span>
            </h2>
            <p className="mt-3 max-w-[30rem] text-[0.98rem] leading-relaxed text-giz/80">
              Ser sócio é ajudar o clube a continuar a formar atletas em Olival
              Basto.
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-[30rem]">
            <div
              className="[perspective:1100px]"
              onPointerMove={onMove}
              onPointerLeave={onLeave}
            >
              <m.div
                style={{ rotateX: srx, rotateY: sry }}
                className="relative aspect-[1.586/1] w-full max-w-[30rem] overflow-hidden rounded-[1.2rem] bg-[linear-gradient(135deg,#0b6b33_0%,#10a24b_55%,#64ba4c_100%)] p-5 text-giz sm:p-7 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.65)] ring-1 ring-giz/15"
              >
                <m.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: shineBg }}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.62rem] font-bold tracking-[0.24em] uppercase opacity-80 sm:text-[0.7rem]">
                        Cartão de sócio
                      </p>
                      <p className="gb-display mt-1 text-[2.2rem] sm:text-[3rem]">
                        {grob.short}
                      </p>
                    </div>
                    <Image
                      src={grob.media.emblemSmall}
                      alt=""
                      width={439}
                      height={560}
                      className="h-[4.2rem] w-auto drop-shadow-[0_6px_10px_rgb(0_0_0/0.35)] sm:h-[6rem]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-[0.95rem] font-semibold sm:text-[1.15rem]">
                      O seu nome
                    </p>
                    <p className="gb-display text-[1.6rem] text-amarelo sm:text-[2.2rem]">
                      1937
                    </p>
                  </div>
                </div>
              </m.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <p className="flex items-end gap-2">
                <span className="gb-display text-[clamp(3.2rem,10vw,4.4rem)] leading-[0.8]">
                  {grob.memberFee}
                </span>
                <span className="pb-1 text-[0.95rem] font-semibold text-giz/80">
                  por mês
                </span>
              </p>
              <button
                type="button"
                onClick={() => openContact({ reason: "socio" })}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-giz px-6 text-[0.86rem] font-bold whitespace-nowrap text-pavilhao hover:bg-amarelo"
              >
                Quero ser sócio
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[var(--gb-dur)] group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
