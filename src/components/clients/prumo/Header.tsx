"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PrumoCopy } from "@/content/prumo/copy";
import { prumo } from "@/content/prumo/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";
import { prumoSections } from "./sections";

// Transparent over the film, then lime-wash white with a blur once the page scrolls. It always stays on screen
// (owner, 2026-10-23: never hide it on scroll). Small screens: a full-screen menu in slate on the posture grid,
// dropping down like a blind, the links in Newsreader.
export function Header({ copy, homeHref }: { copy: PrumoCopy; homeHref: string }) {
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
    { id: prumoSections.disciplines, label: copy.nav.disciplines },
    { id: prumoSections.firstVisit, label: copy.nav.firstVisit },
    { id: prumoSections.studio, label: copy.nav.studio },
    { id: prumoSections.team, label: copy.nav.team },
    { id: prumoSections.visit, label: copy.nav.visit },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-cal/90 text-tinta shadow-[0_1px_0_rgb(29_39_48/0.12)] backdrop-blur-md" : "bg-transparent text-cal"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 grid h-11 shrink-0 place-items-center" aria-label={copy.logoLabel}>
          <Wordmark short className="w-[5.4rem] sm:w-[6.2rem]" bob={solid ? "var(--color-latao)" : "var(--color-latao-claro)"} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center px-3.5 text-[0.95rem] xl:px-4">
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3.5 bottom-2 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 xl:inset-x-4 ${
                  solid ? "bg-latao-fundo" : "bg-latao-claro"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={prumo.phoneHref}
            aria-label={`${copy.visit.contactsLabel}: ${prumo.phoneDisplay}`}
            className={`hidden size-11 place-items-center rounded-full transition-colors sm:grid ${solid ? "ring-1 ring-tinta/20 hover:bg-anca" : "ring-1 ring-cal/45 hover:bg-cal/10"}`}
          >
            <PhoneIcon width={18} height={18} />
          </a>
          <a
            href={`#${prumoSections.book}`}
            onClick={() => setOpen(false)}
            className={`inline-flex h-11 items-center rounded-full px-5 text-[0.9rem] font-semibold transition-colors ${
              solid || open ? "bg-ardosia text-cal hover:bg-ardosia-3" : "bg-cal text-ardosia hover:bg-white"
            }`}
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="pr-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-cal text-ardosia" : solid ? "text-tinta ring-1 ring-tinta/20" : "text-cal ring-1 ring-cal/45"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="pr-mobile-nav"
            key="overlay"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="pr-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-ardosia text-cal lg:hidden"
          >
            <div aria-hidden="true" className="pr-grid pr-grid-dark pointer-events-none absolute inset-0" />
            <span aria-hidden="true" className="pointer-events-none absolute top-0 bottom-0 left-[1.6rem] w-px bg-latao-claro/50" />
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 py-8 pt-24 pr-6 pl-12">
              {[...nav, { id: prumoSections.book, label: copy.nav.book }].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-4 border-b border-cal/12 py-3.5 font-display text-[clamp(2rem,9vw,3.2rem)] leading-none"
                >
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-latao-claro">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10 pl-12">
              <a href={prumo.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-cal font-semibold text-ardosia">
                <PhoneIcon /> {prumo.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-cal/65">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
