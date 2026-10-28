"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import type { OrveLocale } from "@/content/orve/routes";

export interface OrveLanguage {
  code: OrveLocale;
  /** Its own name («Deutsch»). */
  name: string;
  /** Its <html lang> / hreflang. */
  lang: string;
  href: string;
}

interface SwitchProps {
  languages: OrveLanguage[];
  current: OrveLocale;
  /** «Idioma», «Language»… (the group's name for screen readers). */
  label: string;
  /** «Idioma atual»… (said after the current language). */
  currentLabel: string;
}

const DropMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 30" aria-hidden="true" className={`shrink-0 ${className}`}>
    <path d="M12 0c5 7 9 12 9 18a9 9 0 1 1-18 0c0-6 4-11 9-18Z" fill="currentColor" />
  </svg>
);

// The header's language choice: the current code in a small pill; it opens a mother-of-pearl card with the six
// languages in their own names, a copper drop beside the current one. Closes on Escape, on a click outside and when
// focus leaves it, or once the page scrolls away. Each language is a plain link (a new page, which starts at the top).
export function LanguageMenu({ languages, current, label, currentLabel, onDark }: SwitchProps & { onDark: boolean }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    // Scrolling away closes it too (the header stays on screen, so it would otherwise float over the page).
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 80) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[0.78rem] font-medium tracking-[0.16em] uppercase transition-colors ${
          onDark ? "text-nacar ring-1 ring-nacar/45 hover:bg-nacar/10" : "text-tinta ring-1 ring-tinta/20 hover:bg-tinta/5"
        }`}
      >
        <span className="sr-only">{label}: </span>
        <span aria-hidden="true">{current}</span>
        <span className="sr-only">{languages.find((l) => l.code === current)?.name}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true" className={`size-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open ? (
          <m.div
            key="langs"
            id={listId}
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-52 origin-top-right rounded-[1.4rem] bg-nacar p-2 text-tinta shadow-[0_24px_60px_-28px_rgb(36_24_20/0.55)] ring-1 ring-tinta/10"
          >
            <ul aria-label={label}>
              {languages.map((l) => {
                const isCurrent = l.code === current;
                return (
                  <li key={l.code}>
                    <a
                      href={l.href}
                      hrefLang={l.lang}
                      lang={l.lang}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex min-h-11 items-center justify-between gap-3 rounded-full px-4 text-[0.95rem] transition-colors ${
                        isCurrent ? "bg-linho" : "hover:bg-linho/70"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span aria-hidden="true" className="w-5 text-[0.68rem] font-medium tracking-[0.14em] text-pedra uppercase">
                          {l.code}
                        </span>
                        {l.name}
                      </span>
                      {isCurrent ? (
                        <>
                          <DropMark className="h-2.5 w-2 text-cobre" />
                          <span className="sr-only">({currentLabel})</span>
                        </>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// The six codes in a row (footer, the phone menu): the current one in clay with a drop under it, the others links.
export function LanguageRow({ languages, current, label, currentLabel, className = "" }: SwitchProps & { className?: string }) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="grid grid-cols-6 gap-1 sm:flex sm:flex-wrap sm:gap-1.5">
        {languages.map((l) => {
          const isCurrent = l.code === current;
          return (
            <li key={l.code}>
              <a
                href={l.href}
                hrefLang={l.lang}
                lang={l.lang}
                title={l.name}
                aria-current={isCurrent ? "page" : undefined}
                className={`relative flex h-11 items-center justify-center rounded-full text-[0.78rem] font-medium tracking-[0.16em] uppercase transition-colors sm:min-w-11 sm:px-3 ${
                  isCurrent ? "bg-nacar/10 text-argila" : "text-nacar/70 hover:bg-nacar/10 hover:text-nacar"
                }`}
              >
                <span aria-hidden="true">{l.code}</span>
                <span className="sr-only">
                  {l.name}
                  {isCurrent ? ` (${currentLabel})` : ""}
                </span>
                {isCurrent ? <DropMark className="absolute bottom-1 left-1/2 h-1.5 w-1 -translate-x-1/2 text-argila" /> : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
