"use client";

import { useEffect, useEffectEvent } from "react";
import { lockScroll } from "./contact-bus";

let open = 0;

// O que todos os ecrãs por cima da página (gaveta do formulário, galeria em ecrã inteiro) fazem ao abrir e fechar,
// num só sítio, para nunca ficar nada preso (dono, 2026-11-02: «não consigo fechar as imagens»):
//  - prende o scroll (e para o Lenis) e marca o <html> com «gb-overlay» (a barra do menu esconde-se);
//  - põe uma entrada no histórico: o botão Voltar do browser fecha o ecrã em vez de sair da página;
//  - ao fechar por outro meio (×, Esc, fundo, deslizar), tira essa entrada, solta o scroll e devolve o foco.
export function useOverlay(active: boolean, onClose: () => void) {
  const close = useEffectEvent(onClose);
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const id = `gb-${Date.now()}`;
    open += 1;
    lockScroll(true);
    document.documentElement.classList.add("gb-overlay");
    window.history.pushState({ gbOverlay: id }, "", window.location.href);
    let poppedByBrowser = false;
    const onPop = () => {
      poppedByBrowser = true;
      close();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      open = Math.max(0, open - 1);
      if (open === 0) {
        document.documentElement.classList.remove("gb-overlay");
        lockScroll(false);
      }
      if (!poppedByBrowser && (window.history.state as { gbOverlay?: string } | null)?.gbOverlay === id) window.history.back();
      opener?.focus({ preventScroll: true });
    };
  }, [active]);
}
