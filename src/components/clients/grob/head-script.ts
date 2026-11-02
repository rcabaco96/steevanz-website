// Corre no <head>, antes da primeira pintura (layout do GROB):
//  - «gb-motion» no <html> quando há JavaScript e o visitante não pediu movimento reduzido: as cenas escolhem o
//    seu layout antes de pintar (sem saltos);
//  - o site começa sempre no topo (dono, 2026-11-02): o browser não repõe a posição antiga ao recarregar; um
//    endereço com #secção é respeitado.
export const grobHeadScript = `(function(){var d=document.documentElement;try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("gb-motion")}catch(e){}try{if("scrollRestoration" in history)history.scrollRestoration="manual";if(!location.hash)window.scrollTo(0,0)}catch(e){}})()`;
