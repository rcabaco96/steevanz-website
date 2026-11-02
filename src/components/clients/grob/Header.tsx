"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { grob } from "@/content/grob/facts";
import { CourtLines } from "./CourtLines";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";
import { lockScroll, openContact } from "./contact-bus";
import { grobSections } from "./sections";

const nav = [
  { href: `#${grobSections.club}`, label: "O clube" },
  { href: `#${grobSections.modalities}`, label: "Modalidades" },
  { href: `#${grobSections.sede}`, label: "Sede" },
  { href: `#${grobSections.community}`, label: "Comunidade" },
  { href: `#${grobSections.members}`, label: "Sócios" },
  { href: `#${grobSections.contacts}`, label: "Contactos" },
];

// A barra do menu está sempre no ecrã (nunca se esconde ao descer): transparente sobre o pavilhão do topo,
// branca com desfoque depois. No telemóvel, o menu abre num ecrã verde com as linhas do campo.
export function Header({ homeHref }: { homeHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Compacta e sólida assim que a página desce (dono, 2026-11-02: barra pequena e sempre visível).
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const compact = scrolled && !open;

  return (
    <header className="gb-nav pointer-events-none fixed inset-x-0 top-3 z-[var(--gb-z-nav)]">
      {/* A barra sai --gb-nav-pad para fora da coluna de conteúdo: o emblema e o botão ficam nas mesmas linhas que
          os títulos e os cartões das secções. */}
      <div className="gb-container pointer-events-auto relative">
        <div
          className={`-mx-[var(--gb-nav-pad)] flex h-14 items-center justify-between gap-3 rounded-full border px-[calc(var(--gb-nav-pad)-1px)] text-tinta [@media(pointer:fine)]:backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-500 ${
            compact ? "border-tinta/10 bg-giz/96 shadow-[0_14px_34px_-14px_rgb(6_38_21/0.45)]" : "border-tinta/6 bg-giz/90 [@media(pointer:fine)]:bg-giz/78 shadow-[0_10px_30px_-16px_rgb(6_38_21/0.3)]"
          }`}
        >
          <a href={homeHref} className="relative z-10 flex min-h-11 shrink-0 items-center gap-2" aria-label={`${grob.name}: início`}>
            <Image data-brand-crest src={grob.media.emblemSmall} alt="" width={439} height={560} priority sizes="40px" className="h-9 w-auto" />
            <span className="flex items-center gap-2">
              <span data-brand-word className="gb-display block text-[1.35rem] leading-none">
                {grob.short}
              </span>
              <span data-brand-sub className="hidden text-[0.56rem] leading-none font-semibold tracking-[0.16em] whitespace-nowrap text-relva-escuro uppercase sm:block">
                Olival Basto · 1937
              </span>
            </span>
          </a>

          <nav aria-label="Secções" className="hidden items-center lg:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="group relative flex h-9 items-center rounded-full px-3 text-[0.875rem] font-semibold transition-colors hover:bg-tinta/5 xl:px-3.5">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openContact({ reason: "inscricao" })}
              className="inline-flex h-11 items-center rounded-full bg-relva px-4 text-[0.84rem] font-semibold text-white transition-colors hover:bg-relva-escuro sm:h-10"
            >
              Inscrever
            </button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="gb-mobile-nav"
              aria-label={open ? "Fechar o menu" : "Abrir o menu"}
              className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors lg:hidden ${open ? "bg-pavilhao text-giz" : "ring-1 ring-tinta/15 hover:bg-tinta/5"}`}
            >
              {open ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <m.div
              id="gb-mobile-nav"
              key="panel"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: reduced ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              data-lenis-prevent
              className="gb-scroll-hidden absolute inset-x-[calc(var(--gb-gutter)-var(--gb-nav-pad))] top-[calc(100%+0.5rem)] max-h-[calc(100svh-6rem)] origin-top overflow-hidden overflow-y-auto rounded-[1.6rem] bg-pavilhao text-giz shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)] lg:hidden"
            >
              <CourtLines vertical aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 h-[120%] w-auto -translate-x-1/2 -translate-y-1/2 text-giz opacity-[0.08]" />
              <nav aria-label="Secções" className="relative flex flex-col px-5 pt-3 pb-2">
                {nav.map((item, i) => (
                  <m.a
                    key={item.href}
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={reduced ? false : { y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: reduced ? 0 : 0.06 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="gb-display flex items-baseline gap-3 border-b border-giz/12 py-2.5 text-[2rem] last:border-b-0"
                  >
                    <span className="font-sans text-[0.68rem] font-bold tracking-[0.18em] text-amarelo">0{i + 1}</span>
                    {item.label}
                  </m.a>
                ))}
              </nav>
              <div className="relative px-5 pt-2 pb-5">
                <a href={grob.phoneSportHref} className="flex h-12 items-center justify-center gap-2 rounded-full bg-giz text-[0.9rem] font-bold text-pavilhao">
                  <PhoneIcon width={18} height={18} /> Desporto · {grob.phoneSport}
                </a>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
