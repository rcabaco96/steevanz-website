// Copy for the home page, in both languages: «/» (pt) and «/en» (en), the same sections in the same order.
// Facts only: every price comes from products.ts (always without VAT, «+ IVA» / «+ VAT») and every client
// named here is one the owner allowed us to show. No invented numbers, reviews or testimonials.

import type { Locale, Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface PhoneClip {
  src: string;
  poster: string;
  /** What the clip shows, read by screen readers. */
  label: string;
}

const clip = (name: string, label: Localized<string>): Localized<PhoneClip> => ({
  pt: { src: `/home/${name}.mp4`, poster: `/home/${name}.jpg`, label: label.pt },
  en: { src: `/home/${name}.mp4`, poster: `/home/${name}.jpg`, label: label.en },
});

/** Real screen recordings of Steevanz products (480p H.264, no sound), shown in the goals. */
export const clips = {
  menuGrid: clip("menu-grelha", {
    pt: "A grelha de pratos do Menu digital, com fotografia, descrição e preço.",
    en: "The digital menu's grid of dishes, with photo, description and price.",
  }),
  dolciLanding: clip("dolci-landing", {
    pt: "A landing page da Dolci e Salati, feita pela Steevanz.",
    en: "Dolci e Salati's landing page, made by Steevanz.",
  }),
};

/** The plate animations (components/visuals/HeroTapScene and ReviewTapScene). */
export interface TapSceneCopy {
  plateLine1: string;
  plateLine2: string;
  screenIdle: string;
  screenTitle: string;
  screenPrompt: string;
  screenButton: string;
  chipNoApp: string;
  chipTap: string;
  ariaLabel: string;
}

export const sceneCopy: Localized<TapSceneCopy> = {
  pt: {
    plateLine1: "Gostou?",
    plateLine2: "Toque para avaliar",
    screenIdle: "Aproxime o telemóvel",
    screenTitle: "O seu restaurante",
    screenPrompt: "Deixe a sua avaliação",
    screenButton: "Publicar",
    chipNoApp: "Sem app",
    chipTap: "Abre em segundos",
    ariaLabel: "Animação: um telemóvel toca numa placa e abre o formulário de review do Google, onde o cliente toca nas estrelas.",
  },
  en: {
    plateLine1: "Enjoyed it?",
    plateLine2: "Tap to review",
    screenIdle: "Hold your phone near",
    screenTitle: "Your restaurant",
    screenPrompt: "Leave a review",
    screenButton: "Post",
    chipNoApp: "No app",
    chipTap: "Opens in seconds",
    ariaLabel: "Animation: a phone taps a plate and opens the Google review form, where the customer taps the stars.",
  },
};

export const novoCopy = {
  pt: {
    metaTitle: "Steevanz | Os seus clientes encontram, compram e voltam",
    metaDescription:
      "Websites, Menu digital em vídeo, reservas, reviews no Google e cartão de cliente para restaurantes, cafés, cabeleireiros, clínicas, alojamentos e lojas.",
    hero: {
      eyebrow: "Tecnologia para negócios locais",
      titleStart: "Os seus clientes",
      titleAccent: "encontram, compram e voltam.",
      subtitle:
        "Websites, reservas, Menu digital, reviews no Google, cartão de cliente e assistentes com IA. Nós fazemos, configuramos e ficamos por perto.",
      primary: "Agendar demonstração",
      secondary: "Falar connosco",
    },
    whatsappMessage: "Olá! Gostava de saber mais sobre as soluções da Steevanz.",
    perMonth: "/mês",
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
        link: "Automação, desde",
      },
      demo: {
        bookingLabel: "Exemplo do ecrã de reservas: escolher o dia e a hora e receber a confirmação.",
        bookingTitle: "Reservar mesa",
        bookingPeople: "4 pessoas",
        days: ["Qui", "Sex", "Sáb", "Dom"],
        bookingConfirmed: "Reserva confirmada · Sáb 20:30",
        cardLabel: "Exemplo do cartão de cliente digital, a ganhar carimbos.",
        cardBrand: "O seu café",
        cardName: "Cartão de cliente",
        cardFoot: "Ao 10.º carimbo, o café é por nossa conta.",
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
      cta: "Conhecer o Menu digital",
      from: "desde",
      vat: "+ IVA",
    },
    finalCta: {
      title: "Conte-nos o que quer melhorar.",
      body: "Uma conversa sem compromisso: mostramos tudo a funcionar e dizemos com franqueza o que faz sentido para o seu negócio.",
      primary: "Agendar demonstração",
      secondary: "Falar no WhatsApp",
    },
    /** The two-line brand line (owner, 2026-10-18): always both sentences, in this order. */
    brandLine: ["Tecnologia do futuro.", "Com os bons modos de antigamente."],
  },
  en: {
    metaTitle: "Steevanz | Your customers find you, buy from you and come back",
    metaDescription:
      "Websites, video digital menus, bookings, Google reviews and digital loyalty cards for restaurants, cafés, salons, clinics, holiday rentals and shops.",
    hero: {
      eyebrow: "Technology for local businesses",
      titleStart: "Your customers",
      titleAccent: "find you, buy from you and come back.",
      subtitle:
        "Websites, bookings, digital menus, Google reviews, loyalty cards and AI assistants. We build it, set it up and stay close by.",
      primary: "Book a demo",
      secondary: "Talk to us",
    },
    whatsappMessage: "Hi! I'd like to know more about Steevanz solutions.",
    perMonth: "/month",
    clients: {
      title: "They trust us",
      pause: "Pause the client strip",
      play: "Play the client strip",
    },
    goals: {
      title: "What would you like to improve?",
      lead: "Pick a goal. We'll show you what solves it, working, and what it costs.",
      from: "from",
      custom: {
        label: "Made to measure",
        body: "Repetitive tasks eating into your time? We automate the process, at a fixed price.",
        link: "Automation, from",
      },
      demo: {
        bookingLabel: "Example of the booking screen: pick the day and time and get the confirmation.",
        bookingTitle: "Book a table",
        bookingPeople: "4 people",
        days: ["Thu", "Fri", "Sat", "Sun"],
        bookingConfirmed: "Booking confirmed · Sat 20:30",
        cardLabel: "Example of the digital loyalty card, collecting stamps.",
        cardBrand: "Your café",
        cardName: "Loyalty card",
        cardFoot: "On the 10th stamp, the coffee's on us.",
      },
    },
    showcase: {
      title: "A digital menu that whets the appetite",
      lead: "Your dishes on video, with prices, one tap away at the table. And the table can order right there.",
      steps: [
        { title: "One tap on the plate", body: "Customers hold their phone to the table plate. Nothing to install." },
        { title: "Dishes on video", body: "Each dish in a short video, with its name, description and price." },
        { title: "Order at the table", body: "They choose, add notes and send the order. Your team confirms it on screen." },
      ],
      cta: "Discover the digital menu",
      from: "from",
      vat: "+ VAT",
    },
    finalCta: {
      title: "Tell us what you'd like to improve.",
      body: "A friendly, no-strings chat: we show you everything working and tell you honestly what makes sense for your business.",
      primary: "Book a demo",
      secondary: "Chat on WhatsApp",
    },
    /** The two-line brand line, in English. */
    brandLine: ["Technology of the future.", "With good old-fashioned manners."],
  },
} satisfies Localized<unknown>;

export type GoalId = "found" | "full" | "sell" | "return";
export type GoalDemo = "website" | "booking" | "menu" | "stamps";

export interface Goal {
  id: GoalId;
  title: string;
  lead: string;
  demo: GoalDemo;
  products: { id: ProductId; label?: string }[];
}

export const goals: Localized<Goal[]> = {
  pt: [
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
  ],
  en: [
    {
      id: "found",
      title: "Get found",
      lead: "People searching on Google or Instagram find you, and like what they see.",
      demo: "website",
      products: [{ id: "website" }, { id: "landing-page" }, { id: "online-shop" }, { id: "google-review-plates" }, { id: "ai-reviews" }],
    },
    {
      id: "full",
      title: "Fill the place",
      lead: "Bookings at any hour, a calm queue at the door and the phone always answered.",
      demo: "booking",
      products: [{ id: "bookings" }, { id: "waitlist" }, { id: "ai-chatbot" }, { id: "ai-voice" }],
    },
    {
      id: "sell",
      title: "Sell more",
      lead: "Dishes on video whet the appetite, and the table orders from their phone.",
      demo: "menu",
      products: [{ id: "digital-menu", label: "Video digital menu + table ordering" }, { id: "guest-guide" }],
    },
    {
      id: "return",
      title: "Bring them back",
      lead: "A stamp card that never gets left at home, and one tap to follow you on social media.",
      demo: "stamps",
      products: [{ id: "loyalty" }, { id: "social-plates" }],
    },
  ],
};

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

export const howCopy: Localized<{ title: string; steps: { title: string; body: string }[] }> = {
  pt: {
    title: "Como trabalhamos",
    // Owner, 2026-10-20: steps 1 to 3 are his words; step 4 is our proposal (one line to change).
    steps: [
      { title: "Queixe-se", body: "Conte-nos o que o incomoda no seu negócio: mesas vazias, poucas reviews, clientes que não voltam." },
      { title: "Oiça soluções", body: "Mostramos-lhe o que faz sentido, já a funcionar, com os preços à vista." },
      { title: "Escolha a sua", body: "Só o que precisa. Sem pacotes forçados." },
      { title: "Nós tratamos do resto", body: "Montamos, configuramos e ensinamos. E continuamos por perto." },
    ],
  },
  en: {
    title: "How we work",
    steps: [
      { title: "Tell us what's wrong", body: "Tell us what bothers you about your business: empty tables, few reviews, customers who don't come back." },
      { title: "Hear the solutions", body: "We show you what makes sense, already working, with the prices in plain sight." },
      { title: "Pick yours", body: "Only what you need. No forced bundles." },
      { title: "We handle the rest", body: "We set it up, configure it and show you how. And we stay close by." },
    ],
  },
};

/* ---------- Cartão de cliente digital (banner) ---------- */

/**
 * The loyalty card band, beside its ad video (content/product-ads.ts). Facts from
 * content/product-copy/loyalty.ts; the price is read from products.ts and shown «/mês + IVA».
 */
export const loyaltyCopy = {
  pt: {
    eyebrow: "Cartão de cliente digital",
    titleStart: "Clientes que voltam,",
    titleAccent: "carimbo a carimbo.",
    body: "O cartão de carimbos passa a viver no telemóvel do cliente: adere com um toque na placa ou pelo QR, sem app. A equipa carimba em segundos e, por exemplo, ao fim de 9 cafés o 10.º é oferecido, sozinho.",
    points: ["Sem app e sem cartões de papel para perder", "Carimbo dado pela equipa, lendo o QR do cartão", "Recompensa automática quando o cartão fica completo"],
    from: "desde",
    vat: "+ IVA",
    cta: "Conhecer o cartão",
  },
  en: {
    eyebrow: "Digital loyalty card",
    titleStart: "Customers who come back,",
    titleAccent: "stamp by stamp.",
    body: "The stamp card now lives on your customer's phone: they join with one tap on the plate or by scanning the QR, no app needed. Your team stamps it in seconds and, say, after 9 coffees the 10th is on the house, all by itself.",
    points: ["No app and no paper cards to lose", "Stamped by your team, by scanning the card's QR", "An automatic reward when the card is full"],
    from: "from",
    vat: "+ VAT",
    cta: "Discover the loyalty card",
  },
} satisfies Localized<unknown>;

/* ---------- Placas de reviews do Google (banner) ---------- */

/**
 * The plates banner. The price is never written here: it is read from products.ts
 * («google-review-plates»: priceFrom and the packs) and always shown without VAT, with «+ IVA».
 * The animation beside it is components/visuals/HeroTapScene (texts in sceneCopy above).
 */
export const platesCopy = {
  pt: {
    eyebrow: "Placas de reviews do Google",
    titleStart: "Mais reviews no Google,",
    titleAccent: "com um toque.",
    body: "O cliente encosta o telemóvel à placa, ou lê o QR, e abre logo o formulário de review do seu negócio no Google. Sem instalar nada, sem procurar.",
    points: ["No balcão, na mesa, na montra ou na parede", "Com o seu texto e, se quiser, o seu logótipo", "Configurada por nós, pronta a usar"],
    from: "desde",
    perPlate: "por placa",
    /** {price} and {quantity} come from the best pack in products.ts. */
    pack: "{price} por placa a partir de {quantity}",
    vat: "+ IVA",
    cta: "Conhecer as placas",
  },
  en: {
    eyebrow: "Google review plates",
    titleStart: "More Google reviews,",
    titleAccent: "with one tap.",
    body: "Customers hold their phone to the plate, or scan the QR, and your business's Google review form opens straight away. Nothing to install, nothing to search for.",
    points: ["On the counter, the table, the window or the wall", "With your wording and, if you like, your logo", "Set up by us, ready to use"],
    from: "from",
    perPlate: "per plate",
    pack: "{price} per plate for {quantity} or more",
    vat: "+ VAT",
    cta: "Discover the plates",
  },
} satisfies Localized<unknown>;

/* ---------- Setores ---------- */

export const sectorsCopy = {
  pt: {
    title: "Soluções por setor",
    lead: "As combinações que mais fazem a diferença em cada tipo de negócio.",
    together: "Juntos, desde",
    pack: "Pack, desde",
    see: "Ver a solução para",
  },
  en: {
    title: "Solutions by sector",
    lead: "The combinations that make the biggest difference in each kind of business.",
    together: "Together, from",
    pack: "Pack, from",
    see: "See the solution for",
  },
} satisfies Localized<unknown>;

/**
 * The monthly part of a one-off product's price, read from its priceQualifier in products.ts
 * (the website's hosting, the video menu's 30 €/month, …): 0 when there is none.
 */
export function monthlyExtra(product: { priceBilling: string; priceQualifier: { pt: string } }): number {
  if (product.priceBilling === "monthly") return 0;
  const match = product.priceQualifier.pt.match(/(\d+(?:,\d+)?)\s*€\/mês/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

/** «/mês» or «/month». */
export function perMonth(locale: Locale): string {
  return novoCopy[locale].perMonth;
}
