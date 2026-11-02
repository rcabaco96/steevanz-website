"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { grob } from "@/content/grob/facts";
import { ContactForm } from "./ContactForm";
import { openContactEvent, type ContactReason, type ContactRequest } from "./contact-bus";
import { useOverlay } from "./overlay";
import { CloseIcon, PhoneIcon } from "./icons";

const titles: Record<ContactReason, string> = {
  inscricao: "Inscrição",
  socio: "Ser sócio",
  aluguer: "Aluguer da sede",
  outro: "Contactar o clube",
};

const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// A gaveta do formulário: abre de lado no computador e em ecrã inteiro, de baixo para cima, no telemóvel, com o
// motivo (e a modalidade) já escolhidos pelo botão que a abriu. Acessível: diálogo modal, o foco fica preso lá
// dentro, Esc fecha e o foco volta ao botão. Só transform e opacidade; o scroll da página para enquanto está aberta.
export function ContactDrawer() {
  const [request, setRequest] = useState<(ContactRequest & { key: number }) | null>(null);
  const [wide, setWide] = useState(true);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  // Sem barra de scroll (dono, 2026-11-02): se houver mais formulário por baixo, um degradê suave no fundo.
  const checkMore = useCallback((el: HTMLDivElement | null) => {
    if (el) setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 6);
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      setWide(window.matchMedia("(min-width: 768px)").matches);
      setRequest({ ...(event as CustomEvent<ContactRequest>).detail, key: Date.now() });
    };
    window.addEventListener(openContactEvent, onOpen);
    return () => window.removeEventListener(openContactEvent, onOpen);
  }, []);

  const open = request !== null;
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useOverlay(open, () => setRequest(null));

  useEffect(() => {
    if (!open) return;
    const first = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRequest(null);
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(focusable)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hidden = wide ? { x: "100%" } : { y: "100%" };
  const shown = wide ? { x: "0%" } : { y: "0%" };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {request ? (
        <div key="drawer" className="fixed inset-0 z-[var(--gb-z-drawer)]" data-lenis-prevent>
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-tinta/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.3 }}
            onClick={() => setRequest(null)}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gb-drawer-title"
            initial={reduced ? { opacity: 0 } : hidden}
            animate={reduced ? { opacity: 1 } : shown}
            exit={reduced ? { opacity: 0 } : hidden}
            transition={{ duration: reduced ? 0.12 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="gb-grain-dark absolute inset-0 flex flex-col bg-[#0b2a17] text-giz will-change-transform md:inset-y-0 md:right-0 md:left-auto md:w-[min(28rem,100vw)] md:shadow-[-30px_0_80px_-30px_rgb(0_0_0/0.6)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-giz/10 px-5 py-3 sm:px-6">
              <div>
                <p className="text-[0.66rem] font-bold tracking-[0.2em] text-relva-claro uppercase">{grob.short}</p>
                <h2 id="gb-drawer-title" className="gb-display text-[1.9rem]">
                  {titles[request.reason]}
                </h2>
              </div>
              <button
                type="button"
                data-autofocus
                onClick={() => setRequest(null)}
                aria-label="Fechar"
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-giz/30 transition-colors hover:bg-giz hover:text-pavilhao"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
            <div
              ref={(el) => {
                checkMore(el);
              }}
              onScroll={(event) => checkMore(event.currentTarget)}
              className="gb-scroll-hidden h-full overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
            >
              <ContactForm key={request.key} tone="dark" initialReason={request.reason} initialModality={request.modality ?? ""} />
              <a
                href={grob.phoneSportHref}
                className="mt-4 flex items-center justify-center gap-2 rounded-full py-2.5 text-[0.85rem] font-semibold text-giz/90 ring-1 ring-giz/15 hover:ring-relva-claro"
              >
                <PhoneIcon width={18} height={18} /> Prefere ligar? {grob.phoneSport}
              </a>
            </div>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(180deg,transparent,#0b2a17)] transition-opacity duration-300 ${more ? "opacity-100" : "opacity-0"}`}
            />
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
