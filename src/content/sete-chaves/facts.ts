// Sete Chaves — a FICTIONAL guest house in the countryside of Aljezur (Costa Vicentina, Algarve), invented by Steevanz
// (owner, 2026-10-24) as a showcase site for selling websites to holiday apartments, guest houses, small hotels and
// rural stays. Nothing here describes a real business: the name, the logo, the hosts, the address, the rooms, the
// rules and every price are made up for the demo («valores de exemplo»). The contacts are deliberately unusable
// placeholders (a number range not given to anyone, a .example email). No ratings, no reviews, no customer numbers,
// no legal ids (no invented registration number).
// The places nearby are real (Arrifana, Amoreira, Monte Clérigo, Odeceixe, Bordeira, Sagres); their distances are
// approximate, by road, from the village of Aljezur.
// Media: free stock (Pixabay Content License, Mixkit Stock Video Free License), see
// public/media/clients/sete-chaves/LICENCAS.txt. Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/sete-chaves";

export const seteChaves = {
  name: "Sete Chaves",
  fullName: "Sete Chaves · Casa de campo em Aljezur",
  /** A made-up address in the countryside of a real village (the path does not exist). */
  street: "Caminho das Estevas, s/n",
  place: "Vale da Ribeira",
  postalCode: "8670-000",
  locality: "Aljezur",
  /** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's messages. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappNumber: "351900000000",
  email: "reservas@setechaves.example",
  /** Directions: the village (the house and its path are fictional). */
  directions:
    "https://www.google.com/maps/search/?api=1&query=Aljezur%2C+Portugal",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl:
    "https://www.google.com/maps/search/?api=1&query=Aljezur%2C+Portugal",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  checkIn: { from: "15:00", to: "20:00" },
  checkOut: "11:00",
  breakfast: { from: "08:30", to: "10:30" },
  quiet: { from: "22:00", to: "08:30" },
  /** Minimum nights: two, four in July and August. */
  minNights: 2,
  minNightsPeak: 4,
  media: {
    logoSvg: `${media}/logo.svg`,
    logoPng: `${media}/logo.png`,
    favicon: `${media}/favicon.ico`,
    icon192: `${media}/icon-192.png`,
    icon512: `${media}/icon-512.png`,
    appleIcon: `${media}/apple-icon.png`,
    og: `${media}/og.jpg`,
    hero: `${media}/hero.mp4`,
    heroPortrait: `${media}/hero-retrato.mp4`,
    heroPoster: `${media}/hero-poster.webp`,
    heroPortraitPoster: `${media}/hero-retrato-poster.webp`,
    sea: `${media}/mar.mp4`,
    seaPoster: `${media}/mar-poster.webp`,
  },
} as const;

export type SeteChavesPhotoId =
  | "esteva"
  | "rosmaninho"
  | "medronhoQuarto"
  | "alfarroba"
  | "figueira"
  | "forno"
  | "palheiro"
  | "banheira"
  | "pequenoAlmoco"
  | "pequenoAlmocoJardim"
  | "quadroChaves"
  | "molhoChaves"
  | "flor"
  | "medronho"
  | "janela"
  | "linho"
  | "piscina"
  | "jardim"
  | "arrifana"
  | "ribeira"
  | "surf"
  | "falesias"
  | "cabo"
  | "sagres"
  | "passadico"
  | "estrelas";

const p = (file: string, width: number, height: number) => ({
  src: `${media}/${file}.webp`,
  width,
  height,
});

/** The stills (see LICENCAS.txt) and their real sizes. */
export const seteChavesPhotos: Record<
  SeteChavesPhotoId,
  { src: string; width: number; height: number }
> = {
  esteva: p("quarto-esteva", 1093, 1280),
  rosmaninho: p("quarto-rosmaninho", 1280, 853),
  medronhoQuarto: p("quarto-medronho", 1280, 853),
  alfarroba: p("quarto-alfarroba", 1280, 970),
  figueira: p("suite-figueira", 1280, 720),
  forno: p("casa-do-forno", 1280, 800),
  palheiro: p("palheiro", 1280, 853),
  banheira: p("banheira", 1280, 853),
  pequenoAlmoco: p("pequeno-almoco", 1280, 720),
  pequenoAlmocoJardim: p("pequeno-almoco-jardim", 1280, 853),
  quadroChaves: p("quadro-chaves", 1280, 960),
  molhoChaves: p("molho-chaves", 960, 1280),
  flor: p("esteva", 1280, 853),
  medronho: p("medronho", 1280, 960),
  janela: p("janela", 853, 1280),
  linho: p("linho", 1280, 853),
  piscina: p("piscina", 1280, 720),
  jardim: p("jardim", 1280, 720),
  arrifana: p("arrifana", 1280, 960),
  ribeira: p("ribeira", 1280, 853),
  surf: p("surf", 1280, 960),
  falesias: p("falesias", 1280, 721),
  cabo: p("cabo", 1280, 839),
  sagres: p("sagres", 1280, 853),
  passadico: p("passadico", 1280, 853),
  estrelas: p("estrelas", 1280, 854),
};

export interface SeteChavesUnit {
  /** The number on the key fob, 1 to 7. */
  key: number;
  id: string;
  name: string;
  kind: string;
  /** Most guests the unit takes (a cot for the family room is extra, see `extra`). */
  guests: number;
  beds: string;
  size: string;
  /** Example prices per night, without VAT: October to May, June to September. */
  priceLow: number;
  pricePeak: number;
  breakfast: "incluído" | "opcional";
  text: string;
  amenities: string[];
  extra?: string;
  photo: SeteChavesPhotoId;
  alt: string;
}

/** The seven keys: five rooms in the old house and two small houses in the garden. Invented, example prices. */
export const seteChavesUnits: SeteChavesUnit[] = [
  {
    key: 1,
    id: "esteva",
    name: "Esteva",
    kind: "Quarto duplo",
    guests: 2,
    beds: "Cama de casal (160 cm)",
    size: "16 m²",
    priceLow: 85,
    pricePeak: 120,
    breakfast: "incluído",
    text: "Paredes caiadas, um arco antigo e a janela para o pátio onde as estevas florescem em abril.",
    amenities: [
      "Casa de banho com duche",
      "Janela para o pátio",
      "Ventoinha de teto",
      "Roupa de linho",
    ],
    photo: "esteva",
    alt: "Quarto branco com arco caiado, cama baixa e cortina de linho",
  },
  {
    key: 2,
    id: "rosmaninho",
    name: "Rosmaninho",
    kind: "Quarto duplo ou twin",
    guests: 2,
    beds: "Casal ou duas camas individuais",
    size: "15 m²",
    priceLow: 85,
    pricePeak: 120,
    breakfast: "incluído",
    text: "O quarto mais calmo da casa, virado a nascente: acorda com a luz e com o cheiro do rosmaninho.",
    amenities: [
      "Casa de banho com duche",
      "Virado a nascente",
      "Secretária",
      "Roupa de linho",
    ],
    photo: "rosmaninho",
    alt: "Quarto claro com cama de madeira, candeeiro e janela com estores",
  },
  {
    key: 3,
    id: "medronho",
    name: "Medronho",
    kind: "Quarto com terraço",
    guests: 2,
    beds: "Cama de casal (160 cm)",
    size: "18 m² + terraço",
    priceLow: 105,
    pricePeak: 145,
    breakfast: "incluído",
    text: "Portas de vidro para um terraço privado virado a poente, com duas cadeiras para o fim da tarde.",
    amenities: [
      "Terraço privado",
      "Casa de banho com duche",
      "Vista para o vale",
      "Roupa de linho",
    ],
    photo: "medronhoQuarto",
    alt: "Quarto com cama de casal e portas de vidro abertas para um terraço",
  },
  {
    key: 4,
    id: "alfarroba",
    name: "Alfarroba",
    kind: "Quarto família",
    guests: 3,
    beds: "Cama de casal e sofá-cama individual",
    size: "22 m²",
    priceLow: 115,
    pricePeak: 160,
    breakfast: "incluído",
    text: "O maior quarto da casa velha, com uma sala pequena: cabe uma família de três e um berço.",
    amenities: [
      "Sofá-cama individual",
      "Berço a pedido, sem custo",
      "Casa de banho com banheira",
      "Roupa de linho",
    ],
    extra: "Berço a pedido",
    photo: "alfarroba",
    alt: "Quarto amplo e branco com cama, cómoda de madeira e sofá junto à janela",
  },
  {
    key: 5,
    id: "figueira",
    name: "Figueira",
    kind: "Suite",
    guests: 2,
    beds: "Cama de casal (180 cm)",
    size: "26 m²",
    priceLow: 135,
    pricePeak: 185,
    breakfast: "incluído",
    text: "A suite do primeiro andar, com chão de barro, banheira de pés e a varanda sobre a figueira velha.",
    amenities: [
      "Banheira de pés",
      "Varanda",
      "Chão de barro",
      "Roupão e chinelos",
    ],
    photo: "figueira",
    alt: "Suite com cabeceira branca em leque, chão de barro e janela para a serra",
  },
  {
    key: 6,
    id: "casa-do-forno",
    name: "Casa do Forno",
    kind: "Casinha no jardim",
    guests: 3,
    beds: "Cama de casal e sofá-cama",
    size: "32 m² + alpendre",
    priceLow: 140,
    pricePeak: 195,
    breakfast: "opcional",
    text: "O antigo forno do pão, agora uma casinha com cozinha pequena e um alpendre com parreira.",
    amenities: [
      "Kitchenette",
      "Alpendre com parreira",
      "Entrada independente",
      "Animais a pedido",
    ],
    photo: "forno",
    alt: "Casinha com portas de vidro abertas para o jardim e uma cadeira antiga à entrada",
  },
  {
    key: 7,
    id: "palheiro",
    name: "Palheiro",
    kind: "Casinha T2",
    guests: 4,
    beds: "Dois quartos: casal e duas individuais",
    size: "58 m²",
    priceLow: 190,
    pricePeak: 260,
    breakfast: "opcional",
    text: "O palheiro de pedra ganhou dois quartos, uma sala com lareira e uma cozinha completa.",
    amenities: [
      "Cozinha completa",
      "Sala com lareira",
      "Máquina de lavar roupa",
      "Animais a pedido",
    ],
    photo: "palheiro",
    alt: "Quarto luminoso com cama de casal, manta cor de laranja e candeeiro de pé",
  },
];

/** Breakfast basket for the two small houses (example value, per person and day, without VAT). */
export const breakfastBasketPrice = 12;

/** July and August ask for longer stays; June to September have the peak prices (months counted from 0). */
export const peakMonths = [5, 6, 7, 8] as const;
const longStayMonths = [6, 7];

export function isPeak(date: Date): boolean {
  return (peakMonths as readonly number[]).includes(date.getMonth());
}

/** The example price of one night (the night that starts on `date`), without VAT. */
export function nightPrice(unit: SeteChavesUnit, date: Date): number {
  return isPeak(date) ? unit.pricePeak : unit.priceLow;
}

/** Minimum nights for a stay that starts on `date`. */
export function minNightsFor(date: Date): number {
  return longStayMonths.includes(date.getMonth())
    ? seteChaves.minNightsPeak
    : seteChaves.minNights;
}

/** Days since 1970-01-01 of a local date (no time zone surprises: built from its year, month and day). */
export function dayNumber(date: Date): number {
  return Math.round(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
}

/**
 * Availability shown ONLY as a demo: a fixed, made-up pattern of «occupied» nights per unit (stays of a few nights),
 * the same for everyone. Nothing is booked or checked anywhere.
 */
export function isDemoOccupied(unit: SeteChavesUnit, date: Date): boolean {
  const block = Math.floor((dayNumber(date) + unit.key * 5) / 3);
  return ((block * 2654435761 + unit.key * 97) >>> 0) % 5 === 0;
}

/** «85 €» — prices are always without VAT (owner's absolute rule); «+ IVA» is shown beside them. */
export function seteChavesPrice(euros: number): string {
  return `${euros.toLocaleString("pt-PT", { maximumFractionDigits: 0 })} €`;
}

/** The WhatsApp link, with an optional message already written. */
export function seteChavesWhatsappHref(text?: string): string {
  const base = `https://wa.me/${seteChaves.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** The email link, with an optional subject and message. */
export function seteChavesMailHref(subject?: string, body?: string): string {
  const params = [
    subject ? `subject=${encodeURIComponent(subject)}` : "",
    body ? `body=${encodeURIComponent(body)}` : "",
  ].filter(Boolean);
  return `mailto:${seteChaves.email}${params.length ? `?${params.join("&")}` : ""}`;
}
