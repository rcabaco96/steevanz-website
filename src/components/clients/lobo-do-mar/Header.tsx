"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { lobo } from "@/content/lobo-do-mar/facts";
import type { LoboCopy } from "@/content/lobo-do-mar/copy";
import type { LoboLocale } from "@/content/lobo-do-mar/routes";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Badge, Wordmark } from "./Logo";
import { loboSections } from "./sections";
import { WaveEdge } from "./WaveEdge";

interface HeaderProps {
  copy: LoboCopy;
  locale: LoboLocale;
  homeHref: string;
  otherLocaleHref: string;
}

// A floating pill, always on screen (owner, 2026-10-23: hiding it on scroll, with the scroll scenes, looked like a
// bug): clear over the opening, frosted deep blue once the page scrolls. Small screens: a full-screen menu in deep blue with the tide's wave.
export function Header({ copy, locale, homeHref, otherLocaleHref }: HeaderProps) {
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

  const nav = [
    { id: loboSections.boat, label: copy.nav.boat },
    { id: loboSections.menu, label: copy.nav.menu },
    { id: loboSections.gallery, label: copy.nav.gallery },
    { id: loboSections.visit, label: copy.nav.visit },
  ];
  const other = locale === "pt" ? "EN" : "PT";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex h-14 max-w-[72rem] items-center justify-between gap-2 rounded-full pr-2 pl-4 text-areia transition-[background-color,box-shadow] duration-500 sm:h-16 sm:pl-6 ${
          scrolled || open ? "bg-abismo/85 shadow-[0_10px_40px_-15px_rgb(0_0_0/0.6)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <a href={homeHref} className="relative z-10 flex items-center gap-2.5" aria-label={copy.logoLabel}>
          <Badge className="h-10 w-10 rounded-full bg-white p-px sm:h-11 sm:w-11" />
          <Wordmark className="text-[0.82rem] sm:text-sm" />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-full px-3.5 py-2.5 text-[0.74rem] font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-areia/10">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-1.5">
          <a
            href={otherLocaleHref}
            hrefLang={locale === "pt" ? "en" : "pt-PT"}
            lang={locale === "pt" ? "en" : "pt-PT"}
            className="hidden h-10 items-center rounded-full px-3 font-display text-[0.66rem] font-bold tracking-[0.2em] transition-colors hover:bg-areia/10 sm:flex"
          >
            {other}
          </a>
          <a
            href={lobo.phoneHref}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-coral px-4 text-[0.72rem] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-coral-deep sm:h-11 sm:px-5"
          >
            <PhoneIcon width={15} height={15} className="max-[359px]:hidden" />
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="lm-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-areia/35 transition-colors hover:bg-areia/10 lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="lm-mobile-nav"
            key="overlay"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.65, 0, 0.2, 1] }}
            className="fixed inset-0 -z-10 flex flex-col bg-abismo text-areia lg:hidden"
          >
            <nav aria-label={copy.nav.label} className="flex flex-1 flex-col justify-center gap-1 px-6 pt-24">
              {nav.map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.2 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-4 border-b border-areia/15 py-4 font-display text-[clamp(1.9rem,9vw,3rem)] leading-none uppercase"
                >
                  <span className="text-xs font-medium tracking-[0.2em] text-coral">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="flex items-center justify-between px-6 pb-6">
              <a href={otherLocaleHref} hrefLang={locale === "pt" ? "en" : "pt-PT"} className="font-display text-sm font-bold tracking-[0.2em]">
                {other}
              </a>
              <a href={lobo.phoneHref} className="font-display text-sm font-bold text-coral">
                {lobo.phoneDisplay}
              </a>
            </div>
            <WaveEdge className="text-azul" />
            <div className="h-8 bg-azul" />
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
