"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import { seteChaves } from "@/content/sete-chaves/facts";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { FobMark, Wordmark } from "./Logo";
import { seteChavesSections } from "./sections";

// Transparent over the light film, then lime-white with a blur once the page scrolls. It always stays on screen
// (owner, 2026-10-23: never hide it on scroll). Small screens: a full-screen menu on schist, each link hanging from a
// numbered key tag like the board at the entrance.
export function Header({ homeHref }: { homeHref: string }) {
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
    { id: seteChavesSections.rooms, label: copy.nav.rooms },
    { id: seteChavesSections.day, label: copy.nav.day },
    { id: seteChavesSections.around, label: copy.nav.around },
    { id: seteChavesSections.guide, label: copy.nav.guide },
    { id: seteChavesSections.rules, label: copy.nav.rules },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
        open
          ? "bg-transparent"
          : scrolled
            ? "bg-cal/90 shadow-[0_1px_0_rgb(38_44_51/0.12)] backdrop-blur-md"
            : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <a
          href={homeHref}
          className="relative z-10 flex h-12 shrink-0 items-center"
          aria-label={copy.logoLabel}
        >
          <Wordmark
            tone={open ? "light" : "dark"}
            line={copy.logoLine}
            className="[&_.sc-label]:hidden min-[400px]:[&_.sc-label]:block"
          />
        </a>

        <nav
          aria-label={copy.nav.label}
          className="hidden items-center gap-1 lg:flex"
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group relative flex h-11 items-center px-3.5 text-[0.95rem] text-tinta xl:px-4"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-3.5 bottom-2 h-px origin-left scale-x-0 bg-latao transition-transform duration-500 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-1.5 min-[400px]:gap-2">
          <a
            href={`#${seteChavesSections.book}`}
            onClick={() => setOpen(false)}
            className="sc-brass inline-flex h-11 items-center rounded-full px-3.5 text-[0.74rem] min-[400px]:px-5 min-[400px]:text-[0.8rem] font-semibold tracking-[0.06em] min-[400px]:tracking-[0.12em] text-tinta uppercase shadow-[inset_0_-2px_0_rgb(0_0_0/0.15)] transition-[filter] hover:brightness-110"
          >
            {copy.nav.book}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="sc-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${open ? "bg-cal text-xisto" : "bg-cal/70 text-tinta ring-1 ring-tinta/15 backdrop-blur-sm"}`}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="sc-mobile-nav"
            key="overlay"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: reduced ? 0 : 0.6,
              ease: [0.2, 0.9, 0.25, 1],
            }}
            className="sc-on-dark fixed inset-0 z-0 flex flex-col overflow-y-auto bg-xisto text-cal lg:hidden"
          >
            <nav
              aria-label={copy.nav.label}
              className="relative flex flex-1 flex-col justify-center px-6 pt-24 pb-6"
            >
              {[
                ...nav,
                { id: seteChavesSections.book, label: copy.nav.book },
              ].map((item, i) => (
                <m.a
                  key={item.id}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={reduced ? false : { y: -16, opacity: 0, rotate: -4 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.12 + i * 0.05,
                    duration: 0.6,
                    ease: [0.2, 0.9, 0.25, 1],
                  }}
                  className="flex min-h-14 items-center gap-4 border-b border-cal/10 py-2.5 font-display text-[clamp(1.9rem,8.5vw,2.8rem)] leading-none"
                  style={{ transformOrigin: "0 0" }}
                >
                  <FobMark
                    number={i + 1}
                    ring={false}
                    gradientId={`sc-brass-nav-${i}`}
                    className="h-9 w-auto shrink-0"
                    style={{ ["--sc-hole" as string]: "var(--color-xisto)" }}
                  />
                  {item.label}
                </m.a>
              ))}
            </nav>
            <div className="relative px-6 pb-10">
              <a
                href={seteChaves.phoneHref}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-cal font-medium text-xisto"
              >
                <PhoneIcon /> {seteChaves.phoneDisplay}
              </a>
              <p className="mt-4 text-center text-xs text-cal/60">
                {copy.demo}
              </p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
