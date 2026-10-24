"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { RiscaCopy } from "@/content/risca/copy";
import { risca } from "@/content/risca/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";
import { riscaSections } from "./sections";

// Transparent over the film, then chalk paper with a hairline once the page scrolls. It always stays on screen
// (owner, 2026-10-23: never hide it on scroll). Small screens: a full-screen menu in ink that drops in behind a
// slanted edge (the angle of the cut), the links in condensed capitals.
export function Header({ copy, homeHref }: { copy: RiscaCopy; homeHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    { id: riscaSections.services, label: copy.nav.services },
    { id: riscaSections.queue, label: copy.nav.barber },
    { id: riscaSections.colour, label: copy.nav.colour },
    { id: riscaSections.team, label: copy.nav.team },
    { id: riscaSections.visit, label: copy.nav.visit },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-gesso/92 text-tinta shadow-[0_1px_0_rgb(18_17_16/0.14)] backdrop-blur-md" : "bg-transparent text-gesso"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 grid h-11 shrink-0 place-items-center" aria-label={copy.logoLabel}>
          <Wordmark id="rc-mark-header" className="w-[5.6rem] sm:w-[6.6rem]" />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center lg:flex">
          {nav.map((item, i) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center gap-2 px-4 text-[0.92rem] font-medium">
              <span className={`text-[0.65rem] tabular-nums ${solid ? "text-cinza" : "text-gesso/60"}`}>0{i + 1}</span>
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-4 bottom-2 h-[2px] origin-left -rotate-3 scale-x-0 bg-vermelhao transition-transform duration-500 ease-[var(--ease-saida)] group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={`#${riscaSections.book}`}
            onClick={() => setOpen(false)}
            className="rc-slant inline-flex h-11 items-center bg-vermelhao pr-7 pl-5 text-[0.8rem] font-bold tracking-[0.16em] text-tinta uppercase transition-colors hover:bg-gesso"
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="rc-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center transition-colors lg:hidden ${
              open ? "bg-gesso text-tinta" : solid ? "text-tinta ring-1 ring-tinta/25" : "text-gesso ring-1 ring-gesso/50"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="rc-mobile-nav"
            key="overlay"
            initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
            animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 125%)" }}
            exit={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="rc-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-tinta text-gesso lg:hidden"
          >
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center px-5 pt-24 pb-6">
              {[...nav, { id: riscaSections.book, label: copy.nav.book }].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.18 + i * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="rc-display flex items-baseline gap-4 border-b border-gesso/12 py-3 text-[clamp(2.6rem,13vw,4rem)]"
                >
                  <span className="rc-label text-vermelhao">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-5 pb-10">
              <a href={risca.phoneHref} className="flex h-14 items-center justify-center gap-2 bg-gesso font-semibold text-tinta">
                <PhoneIcon /> {risca.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-gesso/60">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
