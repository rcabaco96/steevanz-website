"use client";

import { animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GrobGalleryItem } from "@/content/grob/gallery";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/** Altura da faixa: no telemóvel em vw, a partir de 640 px em px fixos (o `sizes` de cada fotografia sai daqui). */
const heights = {
  md: { mobileVw: 58, desktopPx: 340, className: "h-[58vw] sm:h-[340px]" },
  sm: { mobileVw: 44, desktopPx: 250, className: "h-[44vw] sm:h-[250px]" },
} as const;

// Uma faixa de fotografias sem fim, de ponta a ponta do ecrã (dono, 2026-11-02: «a tira aparece sempre a sair
// para os cantos»): as fotografias repetem-se e a faixa dá a volta, por isso há sempre uma cortada à esquerda e
// outra à direita, e nunca se vê o fim. Arrasta-se com o rato e com o dedo, com inércia; anda com as setas e com o
// deslize horizontal do trackpad (ou Shift + roda). Nunca prende o scroll da página (dono, 2026-11-02): sem pin, a
// roda vertical desce a página e, no toque, o deslize vertical também (touch-action: pan-y). Sem botão de pausa
// (não corre sozinha). Só transform. Cada fotografia abre em ecrã inteiro (onOpen).
export function LoopStrip({
  items,
  label,
  onOpen,
  size = "md",
  start = 0.45,
  showArrows = true,
}: {
  items: GrobGalleryItem[];
  label: string;
  onOpen: (index: number) => void;
  size?: keyof typeof heights;
  /** Quanto da primeira fotografia começa cortado pela esquerda (fração da sua largura). */
  start?: number;
  showArrows?: boolean;
}) {
  const track = useRef<HTMLUListElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const raw = useMotionValue(0);
  const [period, setPeriod] = useState(0);
  const x = useTransform(raw, (v) => (period > 0 ? (((v % period) + period) % period) - period : v));
  const drag = useRef({ active: false, moved: false, startX: 0, startRaw: 0, lastX: 0, lastT: 0, v: 0, id: -1 });
  const inertia = useRef(0);
  const placed = useRef(false);
  const h = heights[size];

  const measure = useCallback(() => {
    const list = track.current;
    if (!list) return;
    const first = list.children[0] as HTMLElement | undefined;
    const twin = list.children[items.length] as HTMLElement | undefined;
    if (!first || !twin) return;
    if (!placed.current) {
      placed.current = true;
      raw.set(-first.offsetWidth * start);
    }
    setPeriod(twin.offsetLeft - first.offsetLeft);
  }, [items.length, raw, start]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [measure]);

  const stopInertia = () => cancelAnimationFrame(inertia.current);
  const glide = (velocity: number) => {
    stopInertia();
    if (reduced) return;
    let v = velocity;
    let last = -1;
    const step = (now: number) => {
      if (last < 0) {
        last = now;
        inertia.current = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      raw.set(raw.get() + v * dt);
      v *= Math.exp(-dt / 0.33);
      if (Math.abs(v) > 12) inertia.current = requestAnimationFrame(step);
    };
    inertia.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(inertia.current), []);

  const slideBy = (delta: number) => {
    stopInertia();
    animate(raw, raw.get() + delta, reduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 32 });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopInertia();
    const d = drag.current;
    d.active = true;
    d.moved = false;
    d.id = event.pointerId;
    d.startX = d.lastX = event.clientX;
    d.startRaw = raw.get();
    d.lastT = event.timeStamp;
    d.v = 0;
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || event.pointerId !== d.id) return;
    const dx = event.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!d.moved) return;
    const now = event.timeStamp;
    const dt = Math.max(1, now - d.lastT);
    d.v = 0.7 * ((event.clientX - d.lastX) / dt) * 1000 + 0.3 * d.v;
    d.lastX = event.clientX;
    d.lastT = now;
    raw.set(d.startRaw + dx);
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || event.pointerId !== d.id) return;
    d.active = false;
    if (d.moved) glide(event.timeStamp - d.lastT > 80 ? 0 : d.v);
  };

  // Só o deslize horizontal (trackpad) e Shift + roda mexem a faixa; a roda vertical é sempre da página.
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontal && !event.shiftKey) return;
      event.preventDefault();
      event.stopPropagation();
      stopInertia();
      raw.set(raw.get() - (horizontal ? event.deltaX : event.deltaY));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [raw]);

  const step = () => (viewport.current ? viewport.current.clientWidth * 0.7 : 600);
  const doubled = [...items, ...items];

  return (
    <div className="relative">
      <div
        ref={viewport}
        role="region"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
      >
        <m.ul ref={track} style={{ x }} className="flex w-max gap-2.5 sm:gap-4">
          {doubled.map((item, i) => {
            const ratio = Math.min(1.6, Math.max(0.68, item.width / item.height));
            const twin = i >= items.length;
            return (
              <li key={`${item.src}-${i}`} className={`relative shrink-0 overflow-hidden rounded-[1rem] bg-pavilhao ${h.className}`} style={{ aspectRatio: ratio }} aria-hidden={twin || undefined}>
                <button
                  type="button"
                  tabIndex={twin ? -1 : 0}
                  onClick={() => onOpen(i % items.length)}
                  onFocus={(event) => {
                    const v = viewport.current;
                    if (!v) return;
                    const li = event.currentTarget.parentElement as HTMLElement;
                    const left = li.offsetLeft + x.get();
                    if (left < 0 || left + li.offsetWidth > v.clientWidth) slideBy(v.clientWidth * 0.1 - left);
                  }}
                  aria-label={`Ver em grande: ${item.alt}`}
                  className="group block h-full w-full cursor-zoom-in"
                >
                  <Image
                    src={item.src}
                    alt={twin ? "" : item.alt}
                    width={item.width}
                    height={item.height}
                    quality={85}
                    sizes={`(min-width: 640px) ${Math.ceil(h.desktopPx * ratio)}px, ${Math.ceil(h.mobileVw * ratio)}vw`}
                    draggable={false}
                    className="pointer-events-none h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </button>
              </li>
            );
          })}
        </m.ul>
      </div>
      {showArrows ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 left-0 hidden items-center justify-between px-4 sm:flex">
          <button type="button" onClick={() => slideBy(step())} aria-label="Fotografias anteriores" className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-giz/90 text-tinta shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-colors hover:bg-amarelo">
            <Arrow dir="prev" />
          </button>
          <button type="button" onClick={() => slideBy(-step())} aria-label="Fotografias seguintes" className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-giz/90 text-tinta shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-colors hover:bg-amarelo">
            <Arrow dir="next" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
