"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { oQuintalCategories } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { cartCount } from "@/lib/o-quintal/cart";
import { useOQuintalCart } from "./cart-store";
import { BasketIcon, CloseIcon, MenuIcon } from "./icons";
import { Wordmark } from "./Logo";

// Always on screen (owner, 2026-10-23: never hidden on scroll). Kraft with a blur; the basket button carries the
// cart's count in a tomato badge. Phones: a full-screen menu in fig-leaf green.
export function Header({ mode }: { mode: OQuintalMode }) {
  const [open, setOpen] = useState(false);
  const lines = useOQuintalCart();
  const count = cartCount(lines);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
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

  const links = [
    { href: oQuintalHref(mode, { kind: "shop", category: null }), label: "Loja" },
    { href: oQuintalHref(mode, { kind: "shop", category: "cabazes" }), label: "Cabazes" },
    { href: oQuintalHref(mode, { kind: "shop", category: "fruta" }), label: "Fruta" },
    { href: oQuintalHref(mode, { kind: "shop", category: "legumes" }), label: "Legumes" },
    { href: `${oQuintalHref(mode, { kind: "home" })}#entregas`, label: "Entregas" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ardosia/10 bg-kraft/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
        <Link href={oQuintalHref(mode, { kind: "home" })} className="text-[1.45rem] text-ardosia sm:text-[1.6rem]" aria-label="O Quintal — início">
          <Wordmark />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="oq-stamp rounded-full px-4 py-3 text-ardosia/80 transition-colors hover:bg-ardosia/5 hover:text-ardosia">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href={oQuintalHref(mode, { kind: "cart" })}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-folha text-giz transition-transform hover:scale-105"
            aria-label={count ? `Carrinho, ${count} ${count === 1 ? "artigo" : "artigos"}` : "Carrinho, vazio"}
          >
            <BasketIcon className="h-5 w-5" />
            {count ? (
              <span aria-hidden="true" className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-tomate px-1 text-[0.7rem] font-bold text-giz">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full text-ardosia lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="oq-menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open ? (
        <div id="oq-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col bg-folha-deep text-giz lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-[1.45rem] [&_.text-folha]:text-limao [&_.text-tomate]:text-limao">
              <Wordmark />
            </span>
            <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full" aria-label="Fechar menu">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Menu" className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16">
            {links.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                autoFocus={i === 0}
                className="font-display text-[clamp(2.2rem,11vw,3.4rem)] leading-tight transition-colors hover:text-limao"
              >
                {link.label}
              </Link>
            ))}
            <p className="oq-stamp mt-8 text-giz/55">{oQuintalCategories.length} secções na loja</p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
