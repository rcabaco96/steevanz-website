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

/* ---------- «Um dia no seu negócio» ---------- */

export type DaySectorId = "cafe" | "salon" | "clinic" | "lodging";
export type MomentId = "found" | "sees" | "books" | "review" | "returns";

export interface DaySector {
  id: DaySectorId;
  tab: string;
  business: string;
  search: string;
  /** Real photo used on the website screen (from public/media/photos, Pexels licence). */
  photo: string;
  /** The café shows the real Menu digital; the others their website. */
  sees: "menu" | "site";
  booking: { title: string; detail: string; confirm: string };
  returns: "stamps" | "reminder" | "guide";
  moments: Record<MomentId, { title: string; body: string }>;
}

export const dayCopy = {
  title: "Um dia no seu negócio",
  lead: "Do Google à próxima visita: o que o cliente vê no telemóvel, passo a passo.",
  switchLabel: "Escolha o tipo de negócio",
};

export const daySectors: DaySector[] = [
  {
    id: "cafe",
    tab: "Café",
    business: "O seu café",
    search: "café perto de mim",
    photo: "/media/photos/cafe-counter.jpg",
    sees: "menu",
    booking: { title: "Mesa 4", detail: "2 galões · 2 tostas mistas", confirm: "Pedido #12 enviado" },
    returns: "stamps",
    moments: {
      found: { title: "Encontra-o no Google", body: "Procura um café perto e o seu aparece, com website, horário e caminho." },
      sees: { title: "Vê os pratos em vídeo", body: "Senta-se, um toque na placa e o Menu digital abre, com preços." },
      books: { title: "Pede à mesa", body: "Escolhe no telemóvel e a equipa confirma o pedido no seu ecrã." },
      review: { title: "Deixa a review com um toque", body: "À saída, a placa abre logo o formulário de review do seu perfil no Google." },
      returns: { title: "Ganha um carimbo", body: "O cartão de cliente fica no telemóvel. Ninguém o esquece em casa." },
    },
  },
  {
    id: "salon",
    tab: "Cabeleireiro",
    business: "O seu salão",
    search: "cabeleireiro perto de mim",
    photo: "/media/photos/salon-chair.jpg",
    sees: "site",
    booking: { title: "Corte e brushing", detail: "Sáb, 16 · com a Ana", confirm: "Marcação confirmada · 10:30" },
    returns: "stamps",
    moments: {
      found: { title: "Encontra-o no Google", body: "Procura um cabeleireiro perto e o seu salão aparece, com website e horário." },
      sees: { title: "Conhece o salão", body: "O website mostra os serviços, os preços e o espaço, no telemóvel." },
      books: { title: "Marca sozinho", body: "Escolhe o serviço, a pessoa e a hora. Recebe lembrete antes da marcação." },
      review: { title: "Deixa a review com um toque", body: "Junto ao espelho ou à caixa, a placa abre o formulário de review no Google." },
      returns: { title: "Ganha um carimbo", body: "Cada visita soma no cartão de cliente, sem papel nem app." },
    },
  },
  {
    id: "clinic",
    tab: "Clínica",
    business: "A sua clínica",
    search: "clínica dentária perto de mim",
    photo: "/media/photos/clinic.jpg",
    sees: "site",
    booking: { title: "Consulta de rotina", detail: "Qui, 14 · Dr.ª Marta", confirm: "Consulta marcada · 09:30" },
    returns: "reminder",
    moments: {
      found: { title: "Encontra-a no Google", body: "Procura uma clínica perto e a sua aparece, com website, horário e contacto." },
      sees: { title: "Conhece a clínica", body: "O website mostra as especialidades, a equipa e como chegar." },
      books: { title: "Marca a consulta", body: "Por tipo de consulta e profissional, a qualquer hora, sem esperar ao telefone." },
      review: { title: "Deixa a review com um toque", body: "Na receção, a placa abre o formulário de review do perfil da clínica no Google." },
      returns: { title: "Volta na data certa", body: "Um lembrete chega antes da próxima consulta, para não haver faltas." },
    },
  },
  {
    id: "lodging",
    tab: "Alojamento",
    business: "A sua casa",
    search: "alojamento local Algarve",
    photo: "/media/photos/holiday-rental.jpg",
    sees: "site",
    booking: { title: "Reserva direta", detail: "12 a 15 de agosto · 2 hóspedes", confirm: "Reserva confirmada" },
    returns: "guide",
    moments: {
      found: { title: "Encontra-a online", body: "No Google ou no Instagram, chega ao website da casa." },
      sees: { title: "Vê a casa", body: "Fotos, comodidades e datas livres, num website com reserva direta." },
      books: { title: "Reserva sem comissões", body: "Escolhe as datas e reserva diretamente consigo." },
      review: { title: "Deixa a review com um toque", body: "Em hostels e guest houses com perfil no Google, a placa abre o formulário de review." },
      returns: { title: "Tem o guia da casa", body: "Wi-Fi, check-out e recomendações em quatro línguas, num toque na placa." },
    },
  },
];

export const momentOrder: MomentId[] = ["found", "sees", "books", "review", "returns"];

/* ---------- Como trabalhamos ---------- */

export const howCopy = {
  title: "Como trabalhamos",
  steps: [
    { title: "Uma conversa de 20 minutos", body: "Numa demonstração online ou por telefone percebemos o seu negócio e mostramos tudo a funcionar." },
    { title: "Nós configuramos", body: "Tratamos da configuração, dos textos e das placas, e testamos em iPhone e Android." },
    { title: "Começa a usar", body: "Recebe tudo pronto a usar, com uma explicação simples para a equipa." },
    { title: "Acompanhamos", body: "Suporte por WhatsApp e e-mail, em português, por pessoas." },
  ],
};

/* ---------- Setores, preços e perguntas ---------- */

export const sectorsCopy = {
  title: "Soluções por setor",
  lead: "As combinações que mais fazem a diferença em cada tipo de negócio.",
  together: "Juntos, desde",
  see: "Ver a solução para",
};

export const pricesCopy = {
  title: "Preços à vista",
  lead: "Sem surpresas: os valores de partida de cada produto. Valores sem IVA, confirmados na proposta.",
  all: "Ver todos os produtos",
  faqTitle: "Perguntas frequentes",
};

/** The key prices, in the order shown. */
export const keyPrices: ProductId[] = ["google-review-plates", "digital-menu", "loyalty", "bookings", "ai-chatbot", "landing-page", "website", "online-shop"];

/**
 * The monthly part of a one-off product's price, read from its priceQualifier in products.ts
 * (the website's hosting, the video menu's 30 €/month, …): 0 when there is none.
 */
export function monthlyExtra(product: { priceBilling: string; priceQualifier: { pt: string } }): number {
  if (product.priceBilling === "monthly") return 0;
  const match = product.priceQualifier.pt.match(/(\d+(?:,\d+)?)\s*€\/mês/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}
