// Adega Ferragial — a FICTIONAL family winery near Vidigueira, in the Alentejo, invented by Steevanz (owner,
// 2026-10-24) as a showcase site for selling websites to wineries with wine tourism. Nothing here describes a real
// business: the name, the logo, the family, the address, the phone, the wines, the visits, the dates and the prices are
// made up («valores de exemplo»). The phone is in the unassigned +351 900 range. No awards, scores, medals, ratings,
// reviews, numbers of visitors or legal ids. Prices are always without VAT, with «+ IVA» beside them.
// The traditions named (vinho de talha, the talhas opened on São Martinho, the grape varieties of Vidigueira) are real.
// Media: Pexels and Pixabay free-licence files, see public/media/clients/ferragial/LICENCAS.txt.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/ferragial";

export const ferragial = {
  name: "Ferragial",
  fullName: "Adega Ferragial",
  line: "Adega de família · Vidigueira",
  /** A made-up address on the Vidigueira plain (the road does not exist). */
  street: "Estrada do Ferragial, km 3",
  postalCode: "7960-000",
  locality: "Vidigueira",
  region: "Alentejo",
  /** Unassigned +351 900 range: it is a demo. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappNumber: "351900000000",
  email: "ola@ferragial.example",
  /** Directions: the town (the road is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Vidigueira%2C+Portugal",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Vidigueira%2C+Portugal",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Shop and tasting room (fictional). 0 = Sunday. Closed on Mondays. */
  hours: [
    { days: "Terça a sábado", time: "10:00 – 18:00" },
    { days: "Domingo", time: "10:00 – 13:00" },
    { days: "Segunda", time: "Fechado" },
  ],
  media: {
    logo: `${media}/logo.svg`,
    icon: `${media}/icon.svg`,
    favicon: `${media}/favicon.ico`,
    icon192: `${media}/icon-192.png`,
    icon512: `${media}/icon-512.png`,
    appleIcon: `${media}/apple-icon.png`,
    og: `${media}/og.jpg`,
    hero: `${media}/hero.mp4`,
    heroPortrait: `${media}/hero-retrato.mp4`,
    heroPoster: `${media}/hero-poster.webp`,
    heroPortraitPoster: `${media}/hero-retrato-poster.webp`,
    pour: `${media}/copo.mp4`,
    pourPoster: `${media}/copo-poster.webp`,
    harvest: `${media}/vindima.mp4`,
    harvestPoster: `${media}/vindima-poster.webp`,
    picnic: `${media}/piquenique.mp4`,
    picnicPoster: `${media}/piquenique-poster.webp`,
    dusk: `${media}/ocaso.mp4`,
    duskPoster: `${media}/ocaso-poster.webp`,
  },
} as const;

export type FerragialPhotoId =
  | "vinhaOcaso"
  | "planicie"
  | "montado"
  | "aldeia"
  | "oliveira"
  | "sobreiro"
  | "cortica"
  | "talha"
  | "talhas"
  | "talhaPorta"
  | "cave"
  | "barricas"
  | "mesa"
  | "copoMesa"
  | "uvasTintas"
  | "copos"
  | "brancoTinto"
  | "rolhas"
  | "uvasMao"
  | "uvasBrancas"
  | "manta"
  | "petiscos";

const w = { width: 1280, height: 853 };

/** The photos (see LICENCAS.txt) and their real sizes. */
export const ferragialPhotos: Record<FerragialPhotoId, { src: string; width: number; height: number }> = {
  vinhaOcaso: { src: `${media}/vinha-ocaso.webp`, ...w },
  planicie: { src: `${media}/planicie.webp`, width: 1280, height: 755 },
  montado: { src: `${media}/montado.webp`, ...w },
  aldeia: { src: `${media}/aldeia.webp`, ...w },
  oliveira: { src: `${media}/oliveira.webp`, ...w },
  sobreiro: { src: `${media}/sobreiro.webp`, width: 1280, height: 857 },
  cortica: { src: `${media}/cortica.webp`, width: 720, height: 1280 },
  talha: { src: `${media}/talha.webp`, ...w },
  talhas: { src: `${media}/talhas.webp`, width: 1280, height: 848 },
  talhaPorta: { src: `${media}/talha-porta.webp`, width: 1280, height: 960 },
  cave: { src: `${media}/cave.webp`, ...w },
  barricas: { src: `${media}/barricas.webp`, ...w },
  mesa: { src: `${media}/mesa.webp`, ...w },
  copoMesa: { src: `${media}/copo-mesa.webp`, ...w },
  uvasTintas: { src: `${media}/uvas-tintas.webp`, ...w },
  copos: { src: `${media}/copos.webp`, ...w },
  brancoTinto: { src: `${media}/branco-tinto.webp`, ...w },
  rolhas: { src: `${media}/rolhas.webp`, width: 1280, height: 604 },
  uvasMao: { src: `${media}/uvas-mao.webp`, width: 960, height: 1280 },
  uvasBrancas: { src: `${media}/uvas-brancas.webp`, ...w },
  manta: { src: `${media}/manta.webp`, ...w },
  petiscos: { src: `${media}/petiscos.webp`, width: 960, height: 1280 },
};

// ——— The wines (the online shop) ———

export interface FerragialWine {
  id: string;
  name: string;
  /** Kind shown on the label. */
  kind: string;
  vintage: string;
  grapes: string[];
  notes: string;
  pairing: string;
  serve: string;
  /** Euros per 75 cl bottle (or per box), without VAT. */
  price: number;
  unit: string;
  /** The wine's colour in the glass, and the label's band. */
  glass: string;
  band: string;
  /** Made in clay talhas (vinho de talha). */
  talha?: boolean;
  /** Several bottles in one box. */
  box?: { bottles: number; contents: string };
}

export const ferragialWines: FerragialWine[] = [
  {
    id: "branco",
    name: "Ferragial Branco",
    kind: "Branco",
    vintage: "2025",
    grapes: ["Antão Vaz", "Roupeiro", "Perrum"],
    notes: "Limão, flor de laranjeira e uma ponta de pedra molhada. Fresco, direito, sem madeira.",
    pairing: "Peixe grelhado, saladas, queijo de ovelha novo.",
    serve: "10 a 12 °C",
    price: 9.5,
    unit: "garrafa 75 cl",
    glass: "#e7cf7c",
    band: "#c9a74a",
  },
  {
    id: "rose",
    name: "Ferragial Rosé",
    kind: "Rosé",
    vintage: "2025",
    grapes: ["Aragonez", "Trincadeira"],
    notes: "Morango silvestre, romã e casca de laranja. Seco, leve, para a mesa de verão.",
    pairing: "Petiscos, arroz de tomate, gaspacho alentejano.",
    serve: "8 a 10 °C",
    price: 8.9,
    unit: "garrafa 75 cl",
    glass: "#e4877a",
    band: "#d0695d",
  },
  {
    id: "tinto",
    name: "Ferragial Tinto",
    kind: "Tinto",
    vintage: "2023",
    grapes: ["Trincadeira", "Aragonez", "Alicante Bouschet"],
    notes: "Amora, ameixa preta e esteva. Taninos macios e um final de especiarias.",
    pairing: "Migas, carne de porco preto, ensopado de borrego.",
    serve: "16 a 17 °C",
    price: 11,
    unit: "garrafa 75 cl",
    glass: "#5e1023",
    band: "#7a1c30",
  },
  {
    id: "talha-branco",
    name: "Ferragial Talha Branco",
    kind: "Vinho de talha · Branco",
    vintage: "2024",
    grapes: ["Antão Vaz", "Manteúdo", "Perrum", "Rabo de Ovelha"],
    notes: "Fermentado com as películas nas talhas de barro. Cor de palha velha, notas de marmelo, frutos secos e barro.",
    pairing: "Bacalhau, cozido de grão, queijo de Serpa.",
    serve: "12 a 14 °C",
    price: 16,
    unit: "garrafa 75 cl",
    glass: "#d6a14a",
    band: "#b4532a",
    talha: true,
  },
  {
    id: "talha-tinto",
    name: "Ferragial Talha Tinto",
    kind: "Vinho de talha · Tinto",
    vintage: "2024",
    grapes: ["Tinta Grossa", "Moreto", "Trincadeira"],
    notes: "Ginja, terra quente e um toque terroso do barro. Leve de corpo, vivo e muito gastronómico.",
    pairing: "Enchidos, caça, sopa de cação.",
    serve: "14 a 16 °C",
    price: 18,
    unit: "garrafa 75 cl",
    glass: "#7a1a2c",
    band: "#b4532a",
    talha: true,
  },
  {
    id: "reserva",
    name: "Reserva da Família",
    kind: "Tinto · Reserva",
    vintage: "2021",
    grapes: ["Alicante Bouschet", "Trincadeira"],
    notes: "Doze meses em barricas usadas na cave. Fruta preta madura, cacau e tabaco. Para guardar ou abrir já, com tempo.",
    pairing: "Carnes assadas, queijos curados, uma conversa longa.",
    serve: "17 a 18 °C",
    price: 24,
    unit: "garrafa 75 cl",
    glass: "#3b0915",
    band: "#1e1a19",
  },
  {
    id: "caixa-prova",
    name: "Caixa de prova",
    kind: "Três garrafas",
    vintage: "Seleção",
    grapes: ["Branco 2025", "Tinto 2023", "Talha Tinto 2024"],
    notes: "Uma garrafa de cada para conhecer a casa à mesa: o branco fresco, o tinto da planície e o tinto de talha.",
    pairing: "Para oferecer ou para um jantar com amigos.",
    serve: "10 a 17 °C",
    price: 34,
    unit: "caixa de 3 garrafas",
    glass: "#8a2a35",
    band: "#7b7d52",
    box: { bottles: 3, contents: "Branco 2025, Tinto 2023 e Talha Tinto 2024" },
  },
];

/** Delivery of an order (example values, without VAT). */
export const ferragialDelivery = {
  /** Shipping in mainland Portugal, per order, without VAT. */
  shipping: 8,
  /** From this many bottles, shipping is free. */
  freeFromBottles: 12,
} as const;

// ——— Visits and tastings (the online booking) ———

export interface FerragialExperience {
  id: string;
  name: string;
  minutes: number;
  /** Euros per person, without VAT. */
  price: number;
  short: string;
  includes: string[];
  /** Start times per weekday (0 = Sunday). */
  slots: Partial<Record<number, string[]>>;
  /** Months it runs (0 = January); all year when absent. */
  months?: number[];
  /** Shown when there is no date soon (outside its months). */
  season?: string;
  maxPeople: number;
  media: { kind: "photo"; id: FerragialPhotoId } | { kind: "video"; src: string; poster: string; portrait?: boolean };
}

const weekdays = (days: number[], times: string[]) => Object.fromEntries(days.map((d) => [d, times]));

export const ferragialExperiences: FerragialExperience[] = [
  {
    id: "casa",
    name: "Visita e prova da casa",
    minutes: 90,
    price: 18,
    short: "A vinha, a adega e a sala das talhas, com três vinhos e pão alentejano no fim.",
    includes: ["Passeio na vinha e na adega", "Prova de 3 vinhos", "Pão, azeite e queijo"],
    slots: { ...weekdays([2, 3, 4, 5, 6], ["10:30", "15:00", "16:30"]), 0: ["10:30"] },
    maxPeople: 12,
    media: { kind: "photo", id: "mesa" },
  },
  {
    id: "talha",
    name: "Prova de talha",
    minutes: 120,
    price: 28,
    short: "Na sala das talhas, cinco vinhos — dois tirados da própria talha — com petiscos da região.",
    includes: ["Sala das talhas", "Prova de 5 vinhos", "Petiscos alentejanos"],
    slots: { ...weekdays([5, 6], ["11:00", "15:30"]), 0: ["10:30"] },
    maxPeople: 10,
    media: { kind: "photo", id: "talhas" },
  },
  {
    id: "piquenique",
    name: "Piquenique na vinha",
    minutes: 180,
    price: 42,
    short: "Uma manta à sombra da azinheira, um cesto alentejano e uma garrafa à escolha. De abril a outubro.",
    includes: ["Cesto com produtos da região", "1 garrafa por cada 2 pessoas", "Manta e copos"],
    slots: { 6: ["12:30", "17:30"] },
    months: [3, 4, 5, 6, 7, 8, 9],
    season: "O piquenique na vinha acontece aos sábados, de abril a outubro.",
    maxPeople: 8,
    media: { kind: "video", src: ferragial.media.picnic, poster: ferragial.media.picnicPoster, portrait: true },
  },
  {
    id: "vindima",
    name: "Vindima em família",
    minutes: 240,
    price: 55,
    short: "Uma manhã de tesoura na mão com a família, a pisa das uvas e o almoço na adega. Só em setembro.",
    includes: ["Colheita com a equipa", "Pisa a pé no lagar", "Almoço na adega"],
    slots: { 6: ["09:00"] },
    months: [8],
    season: "A vindima em família é aos sábados de setembro.",
    maxPeople: 12,
    media: { kind: "video", src: ferragial.media.harvest, poster: ferragial.media.harvestPoster },
  },
];

export const ferragialLanguages = ["Português", "English", "Español", "Français"] as const;

// ——— Helpers ———

const nbsp = " ";

/** «9,50 €», «18 €» — always without VAT (owner's absolute rule); «+ IVA» is written beside it. */
export function ferragialPrice(euros: number): string {
  const amount = euros.toLocaleString("pt-PT", {
    minimumFractionDigits: Number.isInteger(euros) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${amount}${nbsp}€`;
}

/** «1 h 30», «2 h», «45 min». */
export function ferragialDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}${nbsp}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}${nbsp}h${nbsp}${String(m).padStart(2, "0")}` : `${h}${nbsp}h`;
}

/** The WhatsApp link, with an optional message already written. */
export function ferragialWhatsappHref(text?: string): string {
  const base = `https://wa.me/${ferragial.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** The email link, with an optional subject and body. */
export function ferragialMailHref(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${ferragial.email}${query ? `?${query}` : ""}`;
}
