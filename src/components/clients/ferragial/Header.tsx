"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragial } from "@/content/ferragial/facts";
import { useCart } from "./cart";
import { BasketIcon, CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Logo } from "./Logo";
import { ferragialSections } from "./sections";

// Transparent over the film, then lime-wash white with a blur once the page scrolls. It always stays on screen
// (owner, 2026-10-23: never hide it on scroll). The basket shows how many bottles it holds. Small screens: a
// full-screen menu in schist that opens out of the horizon line (top and bottom edges parting), links in Gloock.
export function Header({ copy, homeHref }: { copy: FerragialCopy; homeHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const cart = useCart();

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
    { id: ferragialSections.wines, label: copy.nav.wines },
    { id: ferragialSections.visits, label: copy.nav.visits },
    { id: ferragialSections.talha, label: copy.nav.talha },
    { id: ferragialSections.year, label: copy.nav.year },
    { id: ferragialSections.club, label: copy.nav.club },
  ];
  const count = cart.bottles;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-cal/90 text-tinta shadow-[0_1px_0_rgb(36_28_27/0.12)] backdrop-blur-md" : "bg-transparent text-cal"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-2 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 flex h-11 shrink-0 items-center" aria-label={copy.logoLabel}>
          <Logo label={copy.logoLabel} size="sm" wordClassName="max-[389px]:hidden" sun={solid ? "var(--color-barro)" : "var(--color-palha)"} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center px-4 text-[0.95rem]">
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-4 bottom-2 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${solid ? "bg-barro" : "bg-palha"}`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              cart.setOpen(true);
            }}
            aria-label={`${copy.basket.open}${count ? ` (${count === 1 ? copy.basket.item : copy.basket.items.replace("{n}", String(count))})` : ""}`}
            className={`relative grid size-11 place-items-center rounded-full transition-colors ${
              solid ? "ring-1 ring-tinta/20 hover:bg-cal-2" : open ? "bg-cal text-xisto" : "ring-1 ring-cal/50 hover:bg-cal/10"
            }`}
          >
            <BasketIcon />
            {count ? (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-barro px-1 text-[0.7rem] font-semibold text-cal tabular-nums">
                {count}
              </span>
            ) : null}
          </button>
          <a
            href={`#${ferragialSections.book}`}
            onClick={() => setOpen(false)}
            className={`inline-flex h-11 items-center rounded-full px-4 text-[0.78rem] font-semibold tracking-[0.14em] uppercase transition-colors sm:px-5 ${
              solid || open ? "bg-tinto text-cal hover:bg-mosto" : "bg-cal text-xisto hover:bg-white"
            }`}
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="fg-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-cal text-xisto" : solid ? "ring-1 ring-tinta/20" : "ring-1 ring-cal/50"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="fg-mobile-nav"
            key="overlay"
            initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(50% 0% 50% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.75, ease: [0.65, 0, 0.2, 1] }}
            className="fg-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-xisto text-cal lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-palha/25" />
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center px-6 pt-24 pb-6">
              {[...nav, { id: ferragialSections.visit, label: "Como chegar" }].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.2 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline justify-between gap-4 border-b border-cal/12 py-3.5 font-display text-[clamp(2rem,9vw,3.2rem)] leading-none"
                >
                  {item.label}
                  <span className="fg-label text-[0.6rem] text-palha/80">0{i + 1}</span>
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10">
              <a href={ferragial.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-cal font-medium text-xisto">
                <PhoneIcon /> {ferragial.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-cal/60">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
