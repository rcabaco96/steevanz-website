// Copy for the «Menu digital» band of /novo-ultra (MenuShowcase). Pure data: value imports use explicit
// .ts extensions so `node --test` can load it. Prices come from products.ts, never typed here.
// The dish clips and screens are the stock demo menu («O seu restaurante»): never caption them as a
// client's dishes.
import { cleanQualifier, euros, product } from "./shared.ts";

const menu = product("digital-menu");
const pack = menu.packs?.[0];

/** Keeps «30 €» together on one line, like euros() does. */
const tieEuro = (text: string) => text.replace(/(\d) €/g, "$1 €");

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** «Desde 20 € por placa + 30 €/mês pelo menu em vídeo · 15 € por placa a partir de 10 · + IVA». */
export const menuPriceLine = capitalise(
  [
    `desde ${euros(menu.priceFrom)} ${tieEuro(cleanQualifier(menu.priceQualifier.pt))}`,
    pack ? `${euros(pack.unitPrice)} por placa a partir de ${pack.quantity}` : null,
    "+ IVA",
  ]
    .filter(Boolean)
    .join(" · "),
);

export type MenuTabId = "ecra" | "mesa" | "equipa";

export interface MenuTab {
  id: MenuTabId;
  label: string;
  text: string;
  /** Accessible name of the in-phone play button (Save-Data / reduced motion). */
  playLabel: string;
}

export const menuShowcase = {
  title: "Cada prato no seu *vídeo*.",
  lead: "O cliente toca na placa da mesa ou lê o QR, desliza pelos pratos como nos Reels e vê o que vai comer antes de pedir. Sem app. Nós montamos o menu e alojamos os vídeos.",
  tabsLabel: "O que o Menu digital faz",
  pause: "Pausar demonstração",
  resume: "Retomar demonstração",
  cta: { label: "Conhecer o Menu digital", href: `/produtos/${menu.slug.pt}` },
  tabs: [
    {
      id: "ecra",
      label: "Ecrã inteiro",
      text: "Um toque abre o prato em ecrã inteiro. Desliza-se para ver o seguinte, com nome, preço e descrição.",
      playLabel: "Ver o vídeo do prato em ecrã inteiro",
    },
    {
      id: "mesa",
      label: "Pedido da mesa",
      text: "Todos os telemóveis da mesa partilham o mesmo pedido, em tempo real, com uma nota por prato, como “sem cebola”.",
      playLabel: "Ver o pedido da mesa",
    },
    {
      id: "equipa",
      label: "Confirmado pela equipa",
      text: "“Fazer pedido” mostra um QR. O funcionário lê-o com a câmara do telemóvel, sem app, e a mesa vê logo “Pedido confirmado ✓”.",
      playLabel: "Ver o pedido a ser confirmado",
    },
  ] satisfies readonly MenuTab[],
  /** The shared-order code screen (tab 2). */
  order: {
    add: "Adicionar",
    bar: "Pedido da mesa",
    dishes: "pratos",
    see: "Ver",
    flyChip: "+1",
  },
} as const;
