// O estado da cena do emblema, partilhado entre a timeline GSAP (que o anima com o scroll) e a cena 3D (que o
// lê em cada fotograma). Um objeto simples, mutável: nada de estado React a cada fotograma.
export interface EmblemState {
  /** Rotação de base (radianos). */
  rotX: number;
  rotY: number;
  /** Uma volta inteira de moeda, somada à rotação em Y. */
  spin: number;
  /** 0 = montado; 1 = desmontado em camadas. */
  explode: number;
  /** Altura do emblema em fração da altura visível (0–1). */
  fit: number;
  /** Posição do centro, em fração de meia largura / meia altura visível (-1…1). */
  x: number;
  y: number;
  /** O rato, -1…1 (só em ecrãs com rato). */
  pointerX: number;
  pointerY: number;
  /** Acorda a cena 3D (frameloop «demand»): chamado pela timeline e pelo rato. Posto pela própria cena. */
  wake?: () => void;
}

export function createEmblemState(): EmblemState {
  return { rotX: 0.16, rotY: -0.62, spin: 0, explode: 0, fit: 0.6, x: 0, y: 0, pointerX: 0, pointerY: 0 };
}

/**
 * Ficheiros do emblema 3D (lidos pela cena em EmblemCanvas.tsx). Ficam aqui, fora do pedaço do three.js, para o
 * EmblemHero os pré-carregar logo no <head>, em paralelo com o resto da página, em vez de só depois do three.js.
 */
const media = "/media/clients/grob";
export const emblemColorUrls = [`${media}/emblema-textura.webp`, `${media}/emblema-textura-base.webp`, `${media}/emblema-textura-campo.webp`];
export const emblemNormalUrl = `${media}/emblema-relevo-normal.webp`;
export const emblemReliefUrl = `${media}/emblema-relevo.bin`;
