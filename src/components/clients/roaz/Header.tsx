"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { roaz } from "@/content/roaz/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";
import { roazSections } from "./sections";

// Transparent over the film, then salt-white with a blur once the page scrolls. It always stays on screen (owner,
// 2026-10-23: never hide it on scroll). Small screens: a full-screen menu in deep sea blue that opens from the menu
// button like a wake (a V widening from the corner), the links in tall capitals.
export function Header({ copy, homeHref }: { copy: RoazCopy; homeHref: string }) {
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
    { id: roazSections.tours, label: copy.nav.tours },
    { id: roazSections.coast, label: copy.nav.coast },
    { id: roazSections.aboard, label: copy.nav.aboard },
    { id: roazSections.faq, label: copy.nav.faq },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-sal/90 text-tinta shadow-[0_1px_0_rgb(13_34_40/0.12)] backdrop-blur-md" : "bg-transparent text-sal"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 grid h-11 shrink-0 place-items-center" aria-label={copy.logoLabel}>
          <Wordmark className="w-[4.6rem] sm:w-[5.4rem]" accent={solid ? "var(--color-falesia-deep)" : "var(--color-falesia)"} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center px-4 font-display text-[1.15rem] font-semibold tracking-[0.06em] uppercase">
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-4 bottom-2 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${solid ? "bg-falesia-deep" : "bg-falesia"}`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a
            href={`#${roazSections.book}`}
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center rounded-full bg-falesia px-5 font-display text-[1.05rem] font-bold tracking-[0.08em] text-fundo uppercase transition-colors hover:bg-falesia-deep"
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="rz-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-sal text-fundo" : solid ? "text-tinta ring-1 ring-tinta/20" : "text-sal ring-1 ring-sal/50"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="rz-mobile-nav"
            key="overlay"
            initial={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 0%)" }}
            animate={{ clipPath: "polygon(100% 0%, -120% 0%, 100% 260%)" }}
            exit={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="rz-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-fundo text-sal lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_10%,rgb(70_198_201/0.18),transparent_70%)]" />
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 px-6 pt-24 pb-8">
              {[...nav, { id: roazSections.book, label: copy.nav.book }].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-4 border-b border-sal/12 py-4 font-display text-[clamp(2.3rem,11vw,3.6rem)] leading-none font-extrabold uppercase"
                >
                  <span className="font-stencil text-base tracking-[0.2em] text-falesia">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10">
              <a href={roaz.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-sal font-semibold text-fundo">
                <PhoneIcon /> {roaz.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-sal/60">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
