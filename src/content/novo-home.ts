// Copy for the home page («/», pt; the English home is still components/pages/HomePage). Facts only: every price comes from
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

/** The approved Menu digital ad, web version (720×1280, H.264 + AAC, with music; licences in public/home/LICENCAS.txt). */
export const menuAd = {
  src: "/home/menu-digital-anuncio-720.mp4",
  poster: "/home/menu-digital-anuncio-720.jpg",
  label: "Anúncio do Menu digital da Steevanz: os pratos em vídeo no telemóvel e o pedido feito à mesa.",
  copy: { soundOn: "Ver com som", soundOff: "Tirar o som", play: "Ver o vídeo" },
};

export const novoCopy = {
  metaTitle: "Steevanz | Os seus clientes encontram, escolhem e voltam",
  metaDescription:
    "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas.",
  hero: {
    eyebrow: "Tecnologia para negócios locais",
    titleStart: "Os seus clientes",
    titleAccent: "encontram, escolhem e voltam.",
    subtitle:
      "Websites, reservas, Menu digital, reviews no Google, cartão de cliente e assistentes com IA. Nós fazemos, configuramos e ficamos por perto.",
    primary: "Agendar demonstração",
    secondary: "Falar connosco",
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
  },
  /** The two-line brand line (owner, 2026-10-18): always both sentences, in this order. */
  brandLine: ["Tecnologia do futuro.", "Com os bons modos de antigamente."] as const,
  bar: {
    book: "Agendar demo",
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

/* ---------- Como trabalhamos ---------- */

export const howCopy = {
  title: "Como trabalhamos",
  // Owner, 2026-10-20: steps 1 to 3 are his words; step 4 is our proposal (one line to change).
  steps: [
    { title: "Queixe-se", body: "Conte-nos o que o incomoda no seu negócio: mesas vazias, poucas reviews, clientes que não voltam." },
    { title: "Oiça soluções", body: "Mostramos-lhe o que faz sentido, já a funcionar, com os preços à vista." },
    { title: "Escolha a sua", body: "Só o que precisa. Sem pacotes forçados." },
    { title: "Nós tratamos do resto", body: "Montamos, configuramos e ensinamos. E continuamos por perto." },
  ],
};

/* ---------- Placas de reviews do Google (banner) ---------- */

/**
 * The plates banner. The price is never written here: it is read from products.ts
 * («google-review-plates»: priceFrom and the packs) and always shown without VAT, with «+ IVA».
 * The animation beside it is components/visuals/HeroTapScene (texts in content/home.ts → scene).
 */
export const platesCopy = {
  eyebrow: "Placas de reviews do Google",
  titleStart: "Mais reviews no Google,",
  titleAccent: "com um toque.",
  body: "O cliente encosta o telemóvel à placa, ou lê o QR, e abre logo o formulário de review do seu negócio no Google. Sem instalar nada, sem procurar.",
  points: ["No balcão, na mesa, na montra ou na parede", "Com o seu texto e, se quiser, o seu logótipo", "Configurada por nós, pronta a usar"],
  from: "desde",
  perPlate: "por placa",
  vat: "+ IVA",
  cta: "Conhecer as placas",
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
