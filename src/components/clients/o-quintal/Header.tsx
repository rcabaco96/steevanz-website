"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { oQuintal } from "@/content/o-quintal/facts";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { cartCount } from "@/lib/o-quintal/cart";
import { useOQuintalCart } from "./cart-store";
import { BasketIcon, CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";

// Always on screen (owner, 2026-10-23: never hidden on scroll). Kraft with a blur; the basket carries the cart's
// count. Phones: a full-screen menu on a solid green panel. It is rendered into <body> through a portal: inside the
// header, whose backdrop-filter makes it the containing block of fixed children, it was clipped to the header's
// height and the page showed through (owner, 2026-10-25, Instagram on iPhone). Page scroll is locked while open
// (Lenis stopped too), Escape and every link close it.
function Brand() {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <span className="flex items-center gap-2">
      {!logoFailed ? (
        <Image src={oQuintal.logo} alt="" width={40} height={40} onError={() => setLogoFailed(true)} className="h-9 w-9 rounded-full object-contain sm:h-10 sm:w-10" />
      ) : null}
      <Wordmark className={logoFailed ? "" : "[&_svg]:hidden"} />
    </span>
  );
}

export function Header({ mode }: { mode: OQuintalMode }) {
  const [open, setOpen] = useState(false);
  const lines = useOQuintalCart();
  const count = cartCount(lines);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    html.classList.add("lenis-stopped");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      html.style.overflow = previous.html;
      document.body.style.overflow = previous.body;
      html.classList.remove("lenis-stopped");
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

  const menu = (
    <div id="oq-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[90] flex flex-col overflow-y-auto overscroll-contain bg-folha-deep text-giz lg:hidden">
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <span className="font-display text-[1.45rem]">{oQuintal.name}</span>
        <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-giz/10" aria-label="Fechar menu">
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <nav aria-label="Menu" className="flex flex-1 flex-col justify-center px-6 py-6">
        <ul className="divide-y divide-giz/15 border-y border-giz/15">
          {links.map((link, i) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                autoFocus={i === 0}
                className="flex min-h-14 items-center justify-between py-3 font-display text-[1.9rem] leading-none transition-colors hover:text-limao"
              >
                {link.label}
                <span aria-hidden="true" className="text-xl text-limao">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={oQuintalHref(mode, { kind: "cart" })}
          onClick={() => setOpen(false)}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-limao px-6 font-semibold text-ardosia"
        >
          <BasketIcon className="h-5 w-5" /> Ver o carrinho{count ? ` (${count})` : ""}
        </Link>
        <a href={oQuintal.phoneHref} className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-giz/30 px-6 font-semibold">
          <PhoneIcon className="h-4 w-4" /> {oQuintal.phoneDisplay}
        </a>
        <p className="mt-2 text-center text-xs text-giz/55">{oQuintal.phoneNote}</p>
      </nav>
    </div>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ardosia/10 bg-kraft/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8">
          <Link href={oQuintalHref(mode, { kind: "home" })} className="text-[1.4rem] text-ardosia sm:text-[1.6rem]" aria-label="O Quintal — início">
            <Brand />
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
      </header>
      {/* `open` only turns true after a tap, so document exists here. */}
      {open ? createPortal(menu, document.body) : null}
    </>
  );
}
