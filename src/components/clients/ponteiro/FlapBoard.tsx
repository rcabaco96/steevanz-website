"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";

const noop = () => () => {};
const letters = "ABCDEFGHIJLMNOPQRSTUVXZÀÉÍÓÚÇ";

/** Splits a line into the cells of the board (upper case, one character per cell). */
const cells = (text: string) => Array.from(text.toLocaleUpperCase("pt-PT"));

// The «prato do dia» on a split-flap board, like an old station's departures: today's weekday and dish (read in the
// visitor's browser; the server never guesses the day). The first time it comes into view every cell rattles through
// a few letters before landing (only the text and a small fold of each cell move). The whole week is listed under it,
// in the HTML, for anyone (and any reader) who wants to plan ahead. Reduced motion: no rattle.
export function FlapBoard({ copy }: { copy: PonteiroCopy }) {
  const { prato } = copy;
  const weekday = useSyncExternalStore(noop, () => new Date().getDay(), () => null);
  const board = useRef<HTMLDivElement>(null);
  const today = weekday === null ? null : prato.week.find((d) => d.weekday === weekday) ?? null;
  const line1 = weekday === null ? "" : today ? `${prato.todayIs} ${today.day}` : prato.closed.split(".")[0];
  const line2 = weekday === null ? "" : today ? today.dish : "Até amanhã";

  useEffect(() => {
    const el = board.current;
    if (!el || weekday === null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-cell]"));
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        spans.forEach((span, i) => {
          const final = span.dataset.cell ?? "";
          let n = 6 + (i % 9);
          const tick = () => {
            n -= 1;
            span.textContent = n > 0 ? letters[Math.floor(Math.random() * letters.length)] : final;
            span.animate([{ transform: "rotateX(70deg)" }, { transform: "rotateX(0deg)" }], { duration: 70, easing: "ease-out" });
            if (n > 0) timers.push(window.setTimeout(tick, 70));
          };
          timers.push(window.setTimeout(tick, i * 22));
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [weekday, line1, line2]);

  // One word = one group of cells; the words wrap as a whole on narrow screens.
  const row = (text: string, size: string) => (
    <div className="flex flex-wrap gap-x-3 gap-y-[3px] [perspective:400px]" aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <span key={w} className="flex gap-[3px]">
          {cells(word).map((ch, i) => (
            <span key={i} className={`pn-flap font-sans font-semibold ${size}`}>
              <span data-cell={ch} className="inline-block">
                {ch}
              </span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <div className="pn-on-dark rounded-[1.4rem] bg-noite p-4 text-papel shadow-[0_30px_60px_-35px_rgb(27_24_56/0.8)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="pn-label text-gema">{prato.label}</p>
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-gema" />
          <span className="size-2 rounded-full bg-ginja" />
        </span>
      </div>
      <div ref={board} className="grid gap-2">
        {weekday === null ? (
          <div aria-hidden="true" className="grid gap-2">
            <div className="h-7 animate-pulse rounded bg-noite-2" />
            <div className="h-9 animate-pulse rounded bg-noite-2" />
          </div>
        ) : (
          <>
            {row(line1, "h-7 w-[1.1rem] text-[0.8rem] sm:h-8 sm:w-6 sm:text-base")}
            {row(line2, "h-9 w-[1.3rem] text-[1.02rem] sm:h-11 sm:w-7 sm:text-xl")}
            <p className="sr-only" aria-live="polite">
              {today ? `${prato.label}: ${today.day}, ${today.dish}.` : prato.closed}
            </p>
          </>
        )}
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1 border-t border-papel/12 pt-4 text-[0.85rem] min-[420px]:grid-cols-2">
        {prato.week.map((d) => (
          <li key={d.day} className={`flex justify-between gap-3 ${today?.day === d.day ? "text-gema" : "text-papel/70"}`}>
            <span>{d.day}</span>
            <span className="text-right">{d.dish}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-papel/55">{prato.note}</p>
    </div>
  );
}
