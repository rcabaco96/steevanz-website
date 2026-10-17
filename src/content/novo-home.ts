// Copy for the new home page preview (/novo, pt only for now). Facts only: every price comes from
// products.ts and every client named here is one the owner allowed us to show. No invented numbers,
// reviews or testimonials.

import type { ProductId } from "./types";

export interface PhoneClip {
  src: string;
  poster: string;
  /** What the clip shows, read by screen readers. */
  label: string;
}

const clip = (name: string, label: string): PhoneClip => ({
  src: `/home/${name}.mp4`,
  poster: `/home/${name}.jpg`,
  label,
});

/** Real screen recordings of Steevanz products (480p H.264, no sound). */
export const clips = {
  menuOpening: clip("menu-abertura", "O Menu digital a abrir no telemóvel, com os pratos em mosaico."),
  menuGrid: clip("menu-grelha", "A grelha de pratos do Menu digital, com fotografia, descrição e preço."),
  menuFull: clip("menu-ecra-inteiro", "Um prato do Menu digital em vídeo, em ecrã inteiro."),
  menuOrder: clip("menu-pedido", "O pedido feito à mesa no Menu digital, com o código para a equipa."),
  dolciLanding: clip("dolci-landing", "A landing page da Dolci e Salati, feita pela Steevanz."),
};

export const heroClips: PhoneClip[] = [clips.menuOpening, clips.menuFull, clips.dolciLanding, clips.menuOrder];

export const novoCopy = {
  metaTitle: "Steevanz | Os seus clientes encontram, escolhem e voltam",
  metaDescription:
    "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas.",
  hero: {
    titleStart: "Os seus clientes",
    titleAccent: "encontram, escolhem e voltam.",
    subtitle:
      "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente, feitos e configurados por nós. Com os bons modos de antigamente.",
    primary: "Ver um menu a funcionar",
    secondary: "Falar connosco",
    sectors: "Restaurantes e cafés · Cabeleireiros e estética · Clínicas · Alojamento · Lojas",
  },
  clients: {
    title: "Confiam em nós",
    pause: "Pausar a faixa de clientes",
    play: "Retomar a faixa de clientes",
  },
  goals: {
    title: "O que quer melhorar?",
    lead: "Escolha o objetivo. Mostramos o que resolve, a funcionar, e quanto custa.",
    from: "desde",
    custom: {
      label: "À medida",
      body: "Tarefas repetidas que lhe roubam tempo? Automatizamos o processo, com preço fechado.",
    },
  },
  showcase: {
    title: "O Menu digital que abre o apetite",
    lead: "Os pratos em vídeo, com preços, num toque na mesa. E a mesa pode fazer o pedido ali mesmo.",
    steps: [
      { title: "Um toque na placa", body: "O cliente encosta o telemóvel à placa da mesa. Não instala nada." },
      { title: "Os pratos em vídeo", body: "Cada prato num vídeo curto, com nome, descrição e preço." },
      { title: "Pedir à mesa", body: "Escolhe, acrescenta notas e faz o pedido. A equipa confirma no seu ecrã." },
    ],
    cta: "Ver um menu a funcionar",
    product: "Conhecer o Menu digital",
  },
  dolci: {
    title: "Dolci e Salati, em Armação de Pêra",
    body: "Café, gelataria e pastelaria no Algarve. Fizemos a landing page e o Menu digital em vídeo, com os vídeos da própria casa.",
    landing: "Ver a landing page",
    menu: "Ver o menu em vídeo",
    did: ["Landing page", "Menu digital em vídeo"],
  },
  finalCta: {
    title: "Conte-nos o que quer melhorar.",
    body: "Uma conversa sem compromisso: mostramos tudo a funcionar e dizemos com franqueza o que faz sentido para o seu negócio.",
    primary: "Agendar demonstração",
    secondary: "Falar no WhatsApp",
    line: "com os bons modos de antigamente",
  },
  bar: {
    menu: "Ver um menu",
    talk: "Falar connosco",
  },
};

export type GoalId = "found" | "full" | "sell" | "return";
export type GoalDemo = "website" | "booking" | "menu" | "stamps";

export interface Goal {
  id: GoalId;
  title: string;
  lead: string;
  demo: GoalDemo;
  products: { id: ProductId; label?: string }[];
}

export const goals: Goal[] = [
  {
    id: "found",
    title: "Ser encontrado",
    lead: "Quem procura no Google ou no Instagram chega até si, e gosta do que vê.",
    demo: "website",
    products: [{ id: "website" }, { id: "landing-page" }, { id: "online-shop" }, { id: "google-review-plates" }, { id: "ai-reviews" }],
  },
  {
    id: "full",
    title: "Encher a casa",
    lead: "Reservas a qualquer hora, uma fila sem confusão à porta e o telefone sempre atendido.",
    demo: "booking",
    products: [{ id: "bookings" }, { id: "waitlist" }, { id: "ai-chatbot" }, { id: "ai-voice" }],
  },
  {
    id: "sell",
    title: "Vender mais",
    lead: "Os pratos em vídeo abrem o apetite, e a mesa faz o pedido no telemóvel.",
    demo: "menu",
    products: [{ id: "digital-menu", label: "Menu digital em vídeo + Pedidos à mesa" }, { id: "guest-guide" }],
  },
  {
    id: "return",
    title: "Fazer voltar",
    lead: "Um cartão de carimbos que não fica em casa e um toque para o seguirem nas redes.",
    demo: "stamps",
    products: [{ id: "loyalty" }, { id: "social-plates" }],
  },
];

/**
 * Clients the owner allowed us to name (2026-10-18). The logo files are still to come: each one
 * gets an SVG slot (`logo`), and until then the name is set in type. Never add what was done for a
 * client here without the owner's word.
 */
export interface TrustedClient {
  id: string;
  name: string;
  /** TODO(logos): path to the client's SVG logo in public/home/clients/ once the owner sends it. */
  logo?: { src: string; width: number; height: number };
}

export const trustedClients: TrustedClient[] = [
  { id: "sporting", name: "Sporting" },
  { id: "bmw", name: "BMW" },
  { id: "credito-agricola", name: "Crédito Agrícola" },
  { id: "eic", name: "EIC" },
  { id: "agilflex", name: "Agilflex" },
  { id: "dianaconta", name: "Dianaconta" },
  { id: "dolci-salati", name: "Dolci e Salati" },
];
