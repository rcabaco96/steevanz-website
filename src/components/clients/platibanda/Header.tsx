"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda } from "@/content/platibanda/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Logo } from "./Logo";
import { platibandaSections } from "./sections";

// Transparent over the film, then whitewash with a blur once the page scrolls (always whitewash on a property page).
// It always stays on screen (owner, 2026-10-23: never hide it on scroll). Small screens: a full-screen menu in the
// teal of the ria, opening from the button like a door swinging, the links in Young Serif.
export function Header({ copy, homeHref, onHome }: { copy: PlatibandaCopy; homeHref: string; onHome: boolean }) {
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

  const solid = (scrolled || !onHome) && !open;
  const anchor = (id: string) => (onHome ? `#${id}` : `${homeHref}#${id}`);
  const nav = [
    { id: platibandaSections.listings, label: copy.nav.listings },
    { id: platibandaSections.sell, label: copy.nav.sell },
    { id: platibandaSections.holidays, label: copy.nav.holidays },
    { id: platibandaSections.team, label: copy.nav.team },
    { id: platibandaSections.contact, label: copy.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-cal/90 text-ria shadow-[0_1px_0_rgb(19_48_46/0.12)] backdrop-blur-md" : "bg-transparent text-cal"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 flex h-11 shrink-0 items-center text-[0.95rem] sm:text-[1.05rem]" aria-label={copy.logoLabel}>
          <Logo emblemClassName="w-8 sm:w-9" onDark={!solid} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={anchor(item.id)} className="group relative flex h-11 items-center px-3.5 text-[0.95rem] font-medium">
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3.5 bottom-2 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${solid ? "bg-ocre" : "bg-ocre"}`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={anchor(platibandaSections.listings)}
            onClick={() => setOpen(false)}
            className={`inline-flex h-11 items-center rounded-full px-4 text-[0.85rem] font-semibold transition-colors min-[380px]:px-5 ${
              solid || open ? "bg-telha text-cal hover:bg-telha-deep" : "bg-cal text-ria hover:bg-white"
            }`}
          >
            {copy.nav.listings}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="pb-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-cal text-ria" : solid ? "text-ria ring-1 ring-ria/25" : "text-cal ring-1 ring-cal/50"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="pb-mobile-nav"
            key="overlay"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pb-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-ria text-cal lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-2.5 bg-ocre" />
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 px-7 pt-24 pb-8">
              {nav.map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={anchor(item.id)}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.12 + i * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-4 border-b border-cal/12 py-3.5 font-display text-[clamp(2rem,9vw,3rem)] leading-none"
                >
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-ocre">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-7 pb-10">
              <a href={platibanda.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-cal font-semibold text-ria">
                <PhoneIcon /> {platibanda.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-cal/65">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
