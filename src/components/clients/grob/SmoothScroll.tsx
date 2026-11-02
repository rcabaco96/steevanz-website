"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { scrollLockEvent } from "./contact-bus";
import { loadGsap } from "./scroll-scene";

type LenisLike = { scrollTo: (target: number, options?: { duration?: number; immediate?: boolean }) => void; stop: () => void; start: () => void };

// Copiado do O Ermita (o mesmo comportamento em todos os sites de clientes); aqui o GSAP e o Lenis só chegam depois
// da primeira pintura (pedaços à parte). Lenis smooths the mouse wheel (touch scrolling stays native) and drives GSAP's ScrollTrigger from the same
// clock, so the scroll scenes never lag behind. Off when the visitor asks for reduced motion.
// Back to the top on every load, reload and route change (owner, 2026-11-02: «o site deve começar no scroll a 0»):
// the head script turns off the browser's scroll restoration, and here the page and Lenis are set to 0 at once.
export function SmoothScroll() {
  const lenisRef = useRef<LenisLike | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let destroyed = false;
    let cleanup = () => {};
    if (!reduced) {
      void Promise.all([import("lenis"), loadGsap()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (destroyed) return;
        const lenis = new Lenis({ autoRaf: false, lerp: 0.11, anchors: { offset: -80 } });
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        lenisRef.current = lenis;
        if (!window.location.hash) lenis.scrollTo(0, { immediate: true });
        // A gaveta, a galeria em ecrã inteiro e o menu prendem o scroll: o Lenis para enquanto estão abertos.
        const onLock = (event: Event) => ((event as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start());
        window.addEventListener(scrollLockEvent, onLock);
        cleanup = () => {
          window.removeEventListener(scrollLockEvent, onLock);
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
    }
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  // O site começa sempre no topo (dono, 2026-11-02), sem deslizar: ao carregar, ao recarregar e ao mudar de
  // rota. Um endereço com #secção é respeitado.
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
