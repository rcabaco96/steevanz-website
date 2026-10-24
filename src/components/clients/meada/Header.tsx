"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { MeadaCopy } from "@/content/meada/copy";
import { meada } from "@/content/meada/facts";
import { useCart } from "./cart";
import { BagIcon, CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";
import { meadaSections } from "./sections";

// Transparent over the loom film, then cotton with a stitched line under it once the page scrolls. It always stays
// on screen (owner, 2026-10-23: never hide it on scroll). The basket button carries the number of pieces. Small
// screens: a full-screen menu that drops like a sheet of linen, the links in Young Serif.
export function Header({ copy, homeHref }: { copy: MeadaCopy; homeHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const cart = useCart();
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

  const solid = scrolled || open;
  const nav = [
    { id: meadaSections.shop, label: copy.nav.shop },
    { id: meadaSections.crafts, label: copy.nav.crafts },
    { id: meadaSections.card, label: copy.nav.card },
    { id: meadaSections.visit, label: copy.nav.visit },
  ];
  const bagLabel = `${copy.bag.open}: ${cart.count === 1 ? copy.bag.item : copy.bag.items.replace("{n}", String(cart.count))}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color] duration-500 ${
        solid ? "bg-algodao/92 text-tinta backdrop-blur-md" : "bg-transparent text-algodao"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a href={homeHref} className="relative z-10 grid h-11 shrink-0 place-items-center" aria-label={copy.logoLabel}>
          <Wordmark id="md-mark-header" className="w-[5.2rem] sm:w-[6rem]" thread={solid ? "var(--color-fio)" : "var(--color-kraft)"} />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="group relative flex h-11 items-center px-4 text-[0.95rem]">
              {item.label}
              <span
                aria-hidden="true"
                className={`md-stitch absolute inset-x-4 bottom-2 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${solid ? "" : "md-stitch-light"}`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              cart.setOpen(true);
            }}
            aria-label={bagLabel}
            className={`relative inline-flex h-11 items-center gap-2 rounded-full px-4 font-mono text-[0.78rem] tracking-[0.12em] uppercase transition-colors ${
              solid ? "bg-grafite text-algodao hover:bg-fio" : "bg-algodao text-tinta hover:bg-white"
            }`}
          >
            <BagIcon width={18} height={18} />
            <span className="hidden min-[400px]:inline">{copy.nav.bag}</span>
            <span
              aria-hidden="true"
              className={`grid min-w-6 place-items-center rounded-full px-1.5 text-[0.72rem] leading-6 tabular-nums ${cart.count ? "bg-fio text-algodao" : solid ? "bg-algodao/15" : "bg-tinta/10"}`}
            >
              {cart.count}
            </span>
          </button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="md-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${solid ? "text-tinta ring-1 ring-tinta/20" : "text-algodao ring-1 ring-algodao/50"}`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <div aria-hidden="true" className={`md-stitch mx-4 transition-opacity duration-500 sm:mx-8 ${scrolled && !open ? "opacity-40" : "opacity-0"}`} />

      <AnimatePresence>
        {open ? (
          <m.div
            id="md-mobile-nav"
            key="overlay"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduced ? 0 : 0.65, ease: [0.65, 0, 0.2, 1] }}
            className="md-linen fixed inset-0 z-0 flex flex-col overflow-y-auto text-tinta lg:hidden"
          >
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 px-6 pt-24 pb-8">
              {nav.map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.18 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 border-b border-dashed border-fio/40 py-4 font-display text-[clamp(2rem,9.5vw,3.2rem)] leading-none"
                >
                  <span className="font-mono text-xs tracking-[0.16em] text-fio">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10">
              <a href={meada.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-grafite font-medium text-algodao">
                <PhoneIcon /> {meada.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-cinza">{copy.demo}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
