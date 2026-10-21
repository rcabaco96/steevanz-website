"use client";

import { GB, PT } from "country-flag-icons/react/3x2";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import type { FabiosLocale, FabiosPage } from "@/content/fabios-roadstop/routes";
import { ArrowUpRightIcon, BurgerMenuIcon, CloseIcon, PhoneIcon } from "./icons";
import type { FabiosLinks } from "./links";

interface HeaderProps {
  copy: Pick<FabiosCopy, "nav" | "langLabel" | "otherLang" | "logoAlt" | "newTab">;
  links: FabiosLinks;
  locale: FabiosLocale;
  page: FabiosPage;
  tagline: string;
}

function LangSwitch({ links, locale, copy, onDark }: { links: FabiosLinks; locale: FabiosLocale; copy: HeaderProps["copy"]; onDark: boolean }) {
  const flags = { pt: PT, en: GB } as const;
  const order: FabiosLocale[] = ["pt", "en"];
  return (
    <div
      className={`flex items-center gap-0.5 rounded-full p-1 ${onDark ? "bg-black/30 ring-1 ring-white/25" : "bg-ink/5 ring-1 ring-ink/10"}`}
    >
      {order.map((code) => {
        const Flag = flags[code];
        const current = code === locale;
        const label = current ? copy.langLabel : copy.otherLang;
        const content = (
          <>
            <Flag className="h-3.5 w-5 rounded-[3px] shadow-sm" aria-hidden="true" />
            <span className="text-[0.72rem] font-bold uppercase tracking-wider">{code}</span>
          </>
        );
        const cls = `flex h-9 items-center gap-1.5 rounded-full px-2.5 transition-colors ${
          current ? (onDark ? "bg-cream text-ink" : "bg-ink text-cream") : onDark ? "text-cream hover:bg-white/15" : "text-ink hover:bg-ink/10"
        }`;
        return current ? (
          <span key={code} className={cls} aria-current="true" title={label}>
            {content}
            <span className="sr-only">{label}</span>
          </span>
        ) : (
          <a key={code} href={links.otherLocale} hrefLang={code === "pt" ? "pt-PT" : "en"} lang={code === "pt" ? "pt-PT" : "en"} className={cls} title={label}>
            {content}
            <span className="sr-only">{label}</span>
          </a>
        );
      })}
    </div>
  );
}

export function Header({ copy, links, locale, page, tagline }: HeaderProps) {
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
  const onDark = !solid;
  const nav: { key: FabiosPage | "menu"; label: string; href: string; external?: boolean }[] = [
    { key: "menu", label: copy.nav.menu, href: links.menu, external: true },
    { key: "about", label: copy.nav.about, href: links.about },
    { key: "contact", label: copy.nav.contact, href: links.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        solid ? "bg-cream/90 text-ink shadow-[0_1px_0_rgb(28_21_18/0.08)] backdrop-blur-md" : "bg-transparent text-cream"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
        <Link href={links.home} className="relative z-10 shrink-0" aria-label={`${copy.logoAlt} · ${copy.nav.home}`}>
          <Image
            src={fabios.media.logo}
            alt=""
            width={fabiosImageSize.logo.width}
            height={fabiosImageSize.logo.height}
            sizes="128px"
            priority
            className={`h-auto w-[5.6rem] drop-shadow-[0_6px_14px_rgb(0_0_0/0.35)] transition-transform duration-500 sm:w-[7.4rem] ${solid ? "scale-90" : ""}`}
          />
        </Link>

        <nav aria-label={copy.nav.home} className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.key}
              href={item.href}
              aria-current={item.key === page ? "page" : undefined}
              className={`group relative flex h-11 items-center gap-1 rounded-full px-4 text-[0.95rem] font-semibold tracking-wide transition-colors ${
                onDark ? "hover:bg-white/15" : "hover:bg-ink/5"
              }`}
            >
              {item.label}
              {item.external ? <ArrowUpRightIcon width={15} height={15} /> : null}
              <span
                aria-hidden="true"
                className={`absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded bg-cherry-bright transition-transform duration-300 ${
                  item.key === page ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <LangSwitch links={links} locale={locale} copy={copy} onDark={onDark} />
          <a
            href={fabios.phoneHref}
            className="hidden h-11 items-center gap-2 rounded-full bg-cherry px-5 text-[0.95rem] font-bold text-cream shadow-[0_6px_18px_-6px_rgb(200_35_31/0.8)] transition-colors hover:bg-cherry-deep sm:flex"
          >
            <PhoneIcon width={17} height={17} />
            {copy.nav.call}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="fr-mobile-nav"
            aria-label={open ? copy.nav.close : copy.nav.open}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${
              open ? "bg-cream text-ink" : onDark ? "bg-black/30 text-cream ring-1 ring-white/25" : "bg-ink text-cream"
            }`}
          >
            {open ? <CloseIcon /> : <BurgerMenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="fr-mobile-nav"
            key="overlay"
            initial={reduced ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.4rem) 2rem)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 2.4rem) 2rem)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 2.4rem) 2rem)" }}
            transition={{ duration: reduced ? 0.15 : 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-cherry text-cream lg:hidden"
          >
            <div aria-hidden="true" className="fr-checker h-4 w-full shrink-0 [--s:16px] opacity-90" />
            <nav aria-label={copy.nav.home} className="flex flex-1 flex-col justify-center gap-1 px-6 pt-16 pb-8">
              {[{ key: "home" as const, label: copy.nav.home, href: links.home }, ...nav].map((item, i) => (
                <m.a
                  key={item.key}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.key === page ? "page" : undefined}
                  initial={reduced ? false : { y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.18 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between border-b border-cream/20 py-3 font-display text-[clamp(2.6rem,13vw,4.5rem)] leading-none uppercase"
                >
                  {item.label}
                  {"external" in item && item.external ? <ArrowUpRightIcon width={30} height={30} /> : null}
                </m.a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 px-6 pb-10">
              <a
                href={fabios.phoneHref}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-cream text-lg font-bold text-cherry-deep"
              >
                <PhoneIcon /> {copy.nav.call} · {fabios.phoneShort}
              </a>
              <p className="text-center font-script text-2xl text-sun">{tagline}</p>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
