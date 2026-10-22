"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ermita } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import type { ErmitaLocale } from "@/content/o-ermita/routes";
import { ChatIcon, CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Logo } from "./Logo";
import { ermitaSections } from "./sections";

interface HeaderProps {
  copy: ErmitaCopy;
  locale: ErmitaLocale;
  homeHref: string;
  otherLocaleHref: string;
}

function LangSwitch({ locale, otherLocaleHref, copy, onDark }: Omit<HeaderProps, "homeHref"> & { onDark: boolean }) {
  const order: ErmitaLocale[] = ["pt", "en"];
  return (
    <div className="flex items-center gap-1 text-[0.72rem] font-semibold tracking-[0.2em] uppercase">
      {order.map((code, i) => {
        const current = code === locale;
        const label = current ? copy.langLabel : copy.otherLang;
        return (
          <span key={code} className="flex items-center gap-1">
            {i > 0 ? <span aria-hidden="true" className={onDark ? "text-cal/40" : "text-tinta/30"}>/</span> : null}
            {current ? (
              <span aria-current="true" title={label} className="grid h-10 min-w-10 place-items-center px-1.5">
                <span aria-hidden="true">{code}</span>
                <span className="sr-only">{label}</span>
              </span>
            ) : (
              <a
                href={otherLocaleHref}
                hrefLang={code === "pt" ? "pt-PT" : "en"}
                lang={code === "pt" ? "pt-PT" : "en"}
                title={label}
                className={`grid h-10 min-w-10 place-items-center px-1.5 transition-opacity ${onDark ? "text-cal/60 hover:text-cal" : "text-tinta/50 hover:text-tinta"}`}
              >
                <span aria-hidden="true">{code}</span>
                <span className="sr-only">{label}</span>
              </a>
            )}
          </span>
        );
      })}
    </div>
  );
}

// Transparent over the hero, then lime-white with a blur once the page scrolls. Small screens: a full-screen
// menu in azulejo blue.
export function Header({ copy, locale, homeHref, otherLocaleHref }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
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
  const onDark = !solid;
  // The video menu (on steevanz.com, a new tab) sits with the page's sections.
  const nav = [
    { id: ermitaSections.house, href: `#${ermitaSections.house}`, label: copy.nav.house, external: false },
    { id: ermitaSections.cuisine, href: `#${ermitaSections.cuisine}`, label: copy.nav.cuisine, external: false },
    { id: "ementa", href: ermita.menu, label: copy.nav.menu, external: true },
    { id: ermitaSections.gallery, href: `#${ermitaSections.gallery}`, label: copy.nav.gallery, external: false },
    { id: ermitaSections.visit, href: `#${ermitaSections.visit}`, label: copy.nav.visit, external: false },
  ];
  const externalProps = (external: boolean) => (external ? { target: "_blank", rel: "noopener noreferrer" } : {});

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-cal/90 text-tinta shadow-[0_1px_0_rgb(100_89_57/0.18)] backdrop-blur-md" : "bg-transparent text-cal"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
        <a href={homeHref} className={`relative z-10 shrink-0 ${solid ? "text-oliva" : ""}`} aria-label={copy.logoLabel}>
          <Logo label={copy.logoLabel} compact className="w-[5.8rem] min-[360px]:w-[6.6rem] sm:w-[8.2rem]" />
        </a>

        <nav aria-label={copy.nav.label} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              {...externalProps(item.external)}
              className="group relative flex h-11 items-center px-4 text-[0.74rem] font-semibold tracking-[0.24em] uppercase"
            >
              {item.label}
              {item.external ? <span className="sr-only"> {copy.newTab}</span> : null}
              <span
                aria-hidden="true"
                className={`absolute inset-x-4 bottom-2 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
                  onDark ? "bg-cal" : "bg-oliva"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-1.5 sm:gap-3">
          <div className="hidden sm:block">
            <LangSwitch locale={locale} otherLocaleHref={otherLocaleHref} copy={copy} onDark={onDark} />
          </div>
          <a
            href={ermita.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.72rem] font-semibold tracking-[0.2em] uppercase transition-colors max-[359px]:px-3 max-[359px]:tracking-[0.12em] sm:h-11 sm:px-5 ${
              onDark ? "bg-cal text-azulejo-deep hover:bg-white" : "bg-azulejo text-cal hover:bg-azulejo-deep"
            }`}
          >
            <ChatIcon width={16} height={16} className="max-[359px]:hidden" />
            {copy.nav.book}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="oe-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-cal text-azulejo-deep" : onDark ? "text-cal ring-1 ring-cal/40" : "text-tinta ring-1 ring-tinta/20"
            }`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="oe-mobile-nav"
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-azulejo-deep text-cal lg:hidden"
          >
            <div aria-hidden="true" className="oe-azulejo-dark pointer-events-none absolute inset-0 opacity-[0.07]" />
            <nav aria-label={copy.nav.label} className="relative flex flex-1 flex-col justify-center gap-1 px-6 pt-24 pb-8">
              {nav.map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  {...externalProps(item.external)}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.12 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-baseline gap-4 border-b border-cal/15 py-4 font-serif text-[clamp(2.4rem,11vw,3.6rem)] leading-none"
                >
                  <span className="font-sans text-xs tracking-[0.2em] text-ouro">0{i + 1}</span>
                  {item.label}
                  {item.external ? <span className="sr-only"> {copy.newTab}</span> : null}
                </m.a>
              ))}
            </nav>
            <div className="relative flex flex-col gap-3 px-6 pb-10">
              <a href={ermita.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-full bg-cal font-semibold text-azulejo-deep">
                <PhoneIcon /> {copy.booking.call} · {ermita.phoneShort}
              </a>
              <div className="flex justify-center sm:hidden">
                <LangSwitch locale={locale} otherLocaleHref={otherLocaleHref} copy={copy} onDark />
              </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
