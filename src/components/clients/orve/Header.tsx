"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { OrveCopy } from "@/content/orve/copy";
import { orve } from "@/content/orve/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";
import { orveSections } from "./sections";

// Transparent over the film, then mother-of-pearl with a blur once the page scrolls. It always stays on screen
// (owner, 2026-10-23: never hide it on scroll). Small screens: a full-screen menu in cocoa, the links in Bodoni.
export function Header({ copy, homeHref }: { copy: OrveCopy; homeHref: string }) {
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
    { id: orveSections.rituals, label: copy.nav.rituals },
    { id: orveSections.ritual, label: copy.nav.ritual },
    { id: orveSections.house, label: copy.nav.house },
    { id: orveSections.team, label: copy.nav.team },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-nacar/88 text-tinta shadow-[0_1px_0_rgb(111_90_82/0.16)] backdrop-blur-md" : "bg-transparent text-nacar"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 grid h-11 shrink-0 place-items-center" aria-label={copy.logoLabel}>
          <Wordmark id="or-mark-header" className="w-[4.6rem] sm:w-[5.4rem]" accent={solid ? "var(--color-cobre)" : "var(--color-argila)"} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center px-4 text-[0.95rem] tracking-[0.02em]">
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute bottom-2 left-1/2 size-1.5 -translate-x-1/2 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100 ${
                  solid ? "bg-cobre" : "bg-argila"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={`#${orveSections.book}`}
            onClick={() => setOpen(false)}
            className={`inline-flex h-11 items-center rounded-full px-5 text-[0.82rem] font-medium tracking-[0.14em] uppercase transition-colors ${
              solid || open ? "bg-cobre text-nacar hover:bg-cobre-deep" : "bg-nacar text-cacau hover:bg-white"
            }`}
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="or-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-nacar text-cacau" : solid ? "text-tinta ring-1 ring-tinta/20" : "text-nacar ring-1 ring-nacar/45"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="or-mobile-nav"
            key="overlay"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="or-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-cacau text-nacar lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_10%,rgb(154_74_46/0.3),transparent_70%)]" />
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 px-6 pt-24 pb-8">
              {[...nav, { id: orveSections.book, label: copy.nav.book }].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-4 border-b border-nacar/12 py-4 font-display text-[clamp(2.2rem,10vw,3.4rem)] leading-none italic"
                >
                  <span className="font-sans text-xs tracking-[0.2em] text-argila not-italic">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10">
              <a href={orve.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-nacar font-medium text-cacau">
                <PhoneIcon /> {orve.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-nacar/60">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
