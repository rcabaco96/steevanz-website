"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dolci, type DolciCopy } from "@/content/dolci-salati";
import { InstagramIcon } from "./icons";

// The bar on top: see-through over the hero, frosted once the page moves.

export function HeaderBar({ copy }: { copy: DolciCopy }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled ? "bg-[color-mix(in_oklab,var(--dz-bg)_78%,transparent)] shadow-[0_1px_0_var(--dz-line)] backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <a href="#inicio" className="flex min-w-0 items-center gap-2.5">
          <Image src={dolci.logo} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full bg-white shadow-sm" />
          <span className="display truncate text-[1.3rem] leading-none text-[var(--dz-ink)]">
            dolci <span className="display-italic text-[var(--dz-berry)]">e</span> salati<span className="text-[var(--dz-berry)]">.</span>
          </span>
        </a>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label={dolci.name}>
          <Link
            href={copy.langSwitch.href}
            hrefLang={copy.langSwitch.short === "EN" ? "en" : "pt-PT"}
            aria-label={copy.langSwitch.label}
            className="grid h-10 min-w-10 place-items-center rounded-full px-2 text-xs font-bold tracking-widest text-[var(--dz-ink)] transition-colors hover:bg-[var(--dz-line)]"
          >
            {copy.langSwitch.short}
          </Link>
          <a
            href={dolci.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${copy.header.instagram} (${copy.newTab})`}
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--dz-ink)] transition-colors hover:bg-[var(--dz-line)]"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <Link
            href={dolci.menu}
            className="ml-1 hidden min-h-10 items-center rounded-full bg-[var(--dz-cta-bg)] px-4 text-sm font-semibold text-[var(--dz-cta-fg)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            {copy.header.menu}
          </Link>
        </nav>
      </div>
    </header>
  );
}
