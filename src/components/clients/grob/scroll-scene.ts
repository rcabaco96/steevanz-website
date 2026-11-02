"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

// O GSAP e o ScrollTrigger num pedaço à parte, carregados depois da primeira pintura (não pesam na hidratação).
// Cada cena pede-os com useScrollScene: corre o seu setup dentro de um gsap.context (tudo é desfeito ao sair) e
// só com movimento (o setup decide com gsap.matchMedia).
// Pins: só com rato e por transform (o Lenis move a página no mesmo fotograma; um pin «fixed» contava como mudança
// de layout, CLS ≈ 1 por cena). No toque, as cenas do placar e da sede não ficam presas.
type GsapModule = typeof import("gsap");
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger");
export type Gsap = GsapModule["gsap"];
export type ScrollTriggerType = ScrollTriggerModule["ScrollTrigger"];

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType }> | null = null;
let refreshTimer = 0;

/** As cenas nascem em momentos diferentes: depois de cada uma, uma só recontagem, por ordem da página. */
function scheduleRefresh(ScrollTrigger: ScrollTriggerType) {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 60);
}

export function loadGsap() {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    // Só recalcula nos eventos que mudam mesmo a página (não a cada barra do browser no telemóvel).
    ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
    return { gsap, ScrollTrigger };
  });
  return loading;
}

export function useScrollScene(
  root: RefObject<HTMLElement | null>,
  setup: (gsap: Gsap, ScrollTrigger: ScrollTriggerType, el: HTMLElement) => void | (() => void),
) {
  const run = useEffectEvent(setup);
  useEffect(() => {
    let cancelled = false;
    let revert = () => {};
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      const el = root.current;
      if (cancelled || !el) return;
      let cleanup: void | (() => void);
      const ctx = gsap.context(() => {
        cleanup = run(gsap, ScrollTrigger, el);
      }, el);
      scheduleRefresh(ScrollTrigger);
      revert = () => {
        if (typeof cleanup === "function") cleanup();
        ctx.revert();
      };
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, [root]);
}
