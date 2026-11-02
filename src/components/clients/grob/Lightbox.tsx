"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { GrobGalleryItem } from "@/content/grob/gallery";
import { CloseIcon } from "./icons";
import { useOverlay } from "./overlay";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

const noop = () => () => {};

// A galeria em ecrã inteiro, à prova de ficar preso (dono, 2026-11-02): vive num portal no <body>, acima de tudo
// (z-index dos tokens: acima da barra do menu, que se esconde), com um × grande sempre à vista. Fecha com o ×,
// com Esc, a tocar no fundo fora da fotografia, a deslizar para baixo no telemóvel e com o botão Voltar do
// browser. ←/→ e o deslize para o lado mudam de fotografia. Foco preso nos botões e devolvido à miniatura ao
// fechar; o scroll da página solta-se sem saltos. Mostra o ficheiro original; as vizinhas vêm antes de as pedir.
export function Lightbox({ items, index, onIndex, onClose, label }: { items: GrobGalleryItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void; label: string }) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const [dir, setDir] = useState(1);
  const dragging = useRef(0);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useOverlay(open, onClose);

  const go = (step: number) => {
    if (index === null) return;
    setDir(step);
    onIndex((index + step + items.length) % items.length);
  };
  const goRef = useRef(go);
  const closeRef = useRef(onClose);
  useEffect(() => {
    goRef.current = go;
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const first = window.setTimeout(() => root.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 30);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      else if (event.key === "ArrowRight") goRef.current(1);
      else if (event.key === "ArrowLeft") goRef.current(-1);
      else if (event.key === "Tab" && root.current) {
        const buttons = [...root.current.querySelectorAll<HTMLElement>("button")].filter((b) => b.offsetParent !== null);
        const i = buttons.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        buttons[(i + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Deslizar com o dedo ou arrastar com o rato (pointer events à mão: funciona igual no toque e no rato). Para o
  // lado muda de fotografia; para baixo fecha. A fotografia segue o dedo enquanto se arrasta.
  const swipe = useRef<{ id: number; x: number; y: number; t: number; axis: "" | "x" | "y" } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const setShift = (x: number, y: number, follow = true) => {
    const el = stage.current;
    if (!el) return;
    el.style.transition = follow ? "none" : "";
    el.style.transform = x || y ? `translate3d(${x}px, ${y}px, 0)` : "";
  };
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY, t: event.timeStamp, axis: "" };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    if (!s || s.id !== event.pointerId) return;
    const dx = event.clientX - s.x;
    const dy = event.clientY - s.y;
    if (!s.axis && Math.hypot(dx, dy) > 8) {
      s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (s.axis === "x") setShift(dx, 0);
    else if (s.axis === "y") setShift(0, Math.max(0, dy));
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== event.pointerId) return;
    const dx = event.clientX - s.x;
    const dy = event.clientY - s.y;
    const dt = Math.max(1, event.timeStamp - s.t);
    setShift(0, 0, false);
    if (!s.axis) return;
    dragging.current = event.timeStamp;
    if (s.axis === "y") {
      if (dy > 70 || dy / dt > 0.5) onClose();
      return;
    }
    if (dx < -60 || dx / dt < -0.45) go(1);
    else if (dx > 60 || dx / dt > 0.45) go(-1);
  };

  const item = index !== null ? items[index] : null;
  const neighbours = index !== null ? [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]] : [];

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {item && index !== null ? (
        <m.div
          key="lightbox"
          ref={root}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.25 }}
          onClick={(event) => {
            // Um toque no fundo fecha; o fim de um arrasto não conta como toque.
            if (event.timeStamp - dragging.current < 250) return;
            if ((event.target as HTMLElement).closest("[data-backdrop]") === event.target || event.target === event.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[var(--gb-z-lightbox)] flex flex-col bg-[#040d07]/95 text-giz"
        >
          <div className="flex items-center justify-between gap-4 px-4 pt-3 sm:px-6 sm:pt-4">
            <p className="text-[0.88rem] font-semibold tabular-nums text-giz/80" aria-live="polite">
              {index + 1} / {items.length}
            </p>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Fechar a galeria"
              className="gb-btn grid h-12 w-12 place-items-center rounded-full bg-giz text-tinta shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] hover:bg-amarelo"
            >
              <CloseIcon width={22} height={22} />
            </button>
          </div>
          <div
            data-backdrop
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
          >
            <div ref={stage} data-backdrop className="absolute inset-0 transition-transform duration-200 ease-out">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <m.div
                key={item.src}
                custom={dir}
                variants={{
                  enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * 80 }),
                  center: { opacity: 1, x: 0, y: 0 },
                  exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * -80 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduced ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                data-backdrop
                className="absolute inset-3 flex items-center justify-center sm:inset-x-20 sm:inset-y-4"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  unoptimized
                  draggable={false}
                  className="max-h-full w-auto max-w-full rounded-[var(--radius-gb-sm)] object-contain select-none"
                />
              </m.div>
            </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Fotografia anterior"
              className="gb-btn absolute top-1/2 left-3 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-tinta/70 ring-1 ring-giz/25 hover:bg-giz hover:text-tinta sm:grid"
            >
              <Arrow dir="prev" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Fotografia seguinte"
              className="gb-btn absolute top-1/2 right-3 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-tinta/70 ring-1 ring-giz/25 hover:bg-giz hover:text-tinta sm:grid"
            >
              <Arrow dir="next" />
            </button>
          </div>
          <p data-backdrop className="mx-auto max-w-[44rem] px-5 pt-2 pb-5 text-center text-[0.9rem] leading-snug text-giz/80">
            {item.alt}
            <span className="mt-1 block text-[0.75rem] text-giz/50 sm:hidden">Deslize para o lado para mudar · para baixo para fechar</span>
          </p>
          <div aria-hidden="true" className="hidden">
            {neighbours.map((n) => (
              <Image key={n.src} src={n.src} alt="" width={n.width} height={n.height} unoptimized loading="eager" />
            ))}
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
