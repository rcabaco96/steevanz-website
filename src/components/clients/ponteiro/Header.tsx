"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro, ponteiroHhmm } from "@/content/ponteiro/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Mark } from "./Logo";
import { clockEnd, clockStart, ponteiroSections } from "./sections";

// Transparent over the film, then marble with a blur once the page scrolls. It always stays on screen (owner,
// 2026-10-23: never hide it on scroll). The hand of the logo is the page's clock: 07:30 at the top, two in the morning
// at the footer, the hour written beside it. Small screens: the menu comes down like the shop's shutter, in midnight
// indigo, the links in the display serif.
export function Header({ copy, homeHref }: { copy: PonteiroCopy; homeHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const clockRef = useRef<HTMLAnchorElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / max));
      const minutes = clockStart + p * (clockEnd - clockStart);
      clockRef.current?.style.setProperty("--pn-hand", `${(minutes / 60) * 30}deg`);
      // The hour written beside the hand moves in steps of five minutes, like a clock you glance at.
      if (timeRef.current) timeRef.current.textContent = ponteiroHhmm(Math.floor(minutes / 5) * 5);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const solid = scrolled && !open;
  const nav = [
    { id: ponteiroSections.day, label: copy.nav.day },
    { id: ponteiroSections.carta, label: copy.nav.carta },
    { id: ponteiroSections.menu, label: copy.nav.menu },
    { id: ponteiroSections.casa, label: copy.nav.casa },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-papel/88 text-tinta shadow-[0_1px_0_rgb(26_23_20/0.1)] backdrop-blur-md" : "bg-transparent text-papel"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a ref={clockRef} href={homeHref} className="relative z-10 flex h-11 shrink-0 items-center gap-2.5" aria-label={copy.logoLabel}>
          <Mark className="h-9 w-auto sm:h-10" accent={solid ? "var(--color-ginja)" : "var(--color-gema)"} />
          <span aria-hidden="true" className="font-display text-[1.75rem] leading-none sm:text-[1.95rem]">
            Ponteiro
          </span>
          <span
            ref={timeRef}
            aria-hidden="true"
            title={copy.clock.label}
            className={`hidden rounded-full px-2 py-0.5 font-sans text-[0.72rem] font-semibold tracking-[0.08em] tabular-nums min-[400px]:inline-block ${
              solid ? "bg-tinta/6" : "bg-papel/14"
            }`}
          >
            07:30
          </span>
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center px-4 text-[0.95rem]">
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-4 bottom-2 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${solid ? "bg-ginja" : "bg-gema"}`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={`#${ponteiroSections.book}`}
            onClick={() => setOpen(false)}
            className={`inline-flex h-11 items-center rounded-full px-5 text-[0.9rem] font-semibold transition-colors ${
              solid || open ? "bg-ginja text-papel hover:bg-ginja-deep" : "bg-gema text-tinta hover:bg-gema-soft"
            }`}
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="pn-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-papel text-noite" : solid ? "text-tinta ring-1 ring-tinta/20" : "text-papel ring-1 ring-papel/45"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="pn-mobile-nav"
            key="overlay"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.2, 0.9, 0.25, 1] }}
            className="pn-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-noite text-papel lg:hidden"
          >
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 px-6 pt-24 pb-8">
              {[...nav, { id: ponteiroSections.book, label: copy.nav.book }].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.18 + i * 0.05, duration: 0.5, ease: [0.2, 0.9, 0.25, 1] }}
                  className="flex items-baseline justify-between gap-4 border-b border-papel/12 py-4 font-display text-[clamp(2.2rem,10vw,3.4rem)] leading-none"
                >
                  {item.label}
                  <span className="font-sans text-xs font-semibold tracking-[0.18em] text-gema tabular-nums">{["07:30", "12:30", "16:30", "20:00", "22:30"][i]}</span>
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10">
              <a href={ponteiro.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-gema font-semibold text-tinta">
                <PhoneIcon /> {ponteiro.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-papel/60">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
