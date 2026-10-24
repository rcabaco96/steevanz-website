// The property listings of Platibanda's website. Every listing is FICTIONAL (an example of what a real agency would
// publish): the houses, their areas, features and prices are made up, and the photos only illustrate them (Pexels
// stock, not the buildings described). The page marks each one «Imóvel fictício (exemplo)».
// Property prices (sale, monthly rent, nightly rate) are plain prices; the agency's own service fees live in copy.ts,
// always «+ IVA». Kept free of imports (type imports are erased) so the unit tests can load it directly.

import type { PlatibandaPhotoId } from "./facts";

export type Deal = "venda" | "arrendamento" | "ferias";
export type Kind = "moradia" | "apartamento" | "campo";
export type ZoneId = "tavira" | "cabanas" | "santa-luzia" | "conceicao" | "santa-catarina" | "fuseta" | "olhao";

export const zones: Record<ZoneId, string> = {
  tavira: "Tavira",
  cabanas: "Cabanas de Tavira",
  "santa-luzia": "Santa Luzia",
  conceicao: "Conceição de Tavira",
  "santa-catarina": "Santa Catarina da Fonte do Bispo",
  fuseta: "Fuseta",
  olhao: "Olhão",
};

export const deals: Record<Deal, { label: string; filter: string; unit: string }> = {
  venda: { label: "Venda", filter: "Comprar", unit: "" },
  arrendamento: { label: "Arrendamento", filter: "Arrendar", unit: "/mês" },
  ferias: { label: "Férias", filter: "Férias", unit: "/noite" },
};

export const kinds: Record<Kind, string> = {
  moradia: "Moradia",
  apartamento: "Apartamento",
  campo: "Casa de campo",
};

export interface Listing {
  slug: string;
  /** The agency's own reference, quoted in the visit request. */
  ref: string;
  deal: Deal;
  kind: Kind;
  /** «T2» for flats, «V3» for houses, as Algarve listings write it. */
  typology: string;
  bedrooms: number;
  bathrooms: number;
  /** Gross private area, m². */
  area: number;
  /** Land, m² (houses with a plot). */
  plot?: number;
  zone: ZoneId;
  /** A short line under the zone («Centro histórico», «A 5 minutos da ria»). */
  spot: string;
  title: string;
  lead: string;
  description: string[];
  features: string[];
  energy: string;
  /** Euros: the sale price, the monthly rent or the nightly rate from. */
  price: number;
  /** Holiday rentals: guests and minimum stay. */
  guests?: number;
  minNights?: number;
  /** The colour of the painted band around the door on its card (the site's signature motif). */
  barra: "ocre" | "telha" | "anil" | "sal";
  photos: { id: PlatibandaPhotoId; alt: string }[];
}

export const listings: Listing[] = [
  {
    slug: "moradia-v3-centro-historico-tavira",
    ref: "PB-101",
    deal: "venda",
    kind: "moradia",
    typology: "V3",
    bedrooms: 3,
    bathrooms: 2,
    area: 168,
    zone: "tavira",
    spot: "Centro histórico",
    title: "Moradia V3 com portadas ocre",
    lead: "Casa de rua no centro histórico, a duas ruas do rio, com pátio interior e açoteia.",
    description: [
      "Casa de dois pisos com a fachada caiada e as portadas pintadas de ocre, numa rua calma do centro histórico. O rés-do-chão abre-se numa sala comprida com tetos de madeira e uma cozinha com saída para um pátio interior.",
      "No primeiro piso ficam três quartos, um deles com varanda de ferro forjado sobre a rua. Uma escada exterior sobe à açoteia, de onde se veem os telhados de Tavira.",
    ],
    features: ["Pátio interior", "Açoteia", "Tetos de madeira", "Varanda de ferro forjado", "A pé do rio e do mercado"],
    energy: "C",
    price: 485000,
    barra: "ocre",
    photos: [
      { id: "barraOcreFachada", alt: "Fachada branca com portadas ocre e uma varanda de ferro forjado." },
      { id: "barraOcreSala", alt: "Sala ampla com tetos de madeira, sofás claros e uma lareira ao fundo." },
      { id: "barraOcreCozinha", alt: "Cozinha com armários brancos e azulejos decorados atrás do fogão." },
      { id: "barraOcreQuarto", alt: "Quarto claro com uma cama de lençóis brancos e uma cabeceira de madeira antiga." },
    ],
  },
  {
    slug: "apartamento-t2-junto-a-ria-tavira",
    ref: "PB-102",
    deal: "venda",
    kind: "apartamento",
    typology: "T2",
    bedrooms: 2,
    bathrooms: 2,
    area: 96,
    zone: "tavira",
    spot: "Junto à ria",
    title: "Apartamento T2 com varanda para a água",
    lead: "Segundo andar com elevador, varanda corrida e luz o dia todo, a cinco minutos a pé da ria.",
    description: [
      "Apartamento de dois quartos num prédio pequeno, com elevador e lugar de garagem. A sala dá para uma varanda corrida virada a sul, com vista larga até à água.",
      "Os dois quartos têm roupeiros embutidos e um deles casa de banho privativa. Entrega com cozinha equipada.",
    ],
    features: ["Varanda virada a sul", "Elevador", "Lugar de garagem", "Cozinha equipada", "Suite"],
    energy: "B",
    price: 365000,
    barra: "anil",
    photos: [
      { id: "riaVaranda", alt: "Varanda com guarda de vidro sobre o mar azul." },
      { id: "riaSala", alt: "Sala com janelas em arco, sofás claros e árvores do lado de fora." },
      { id: "riaQuarto", alt: "Quarto branco com uma cama de colcha clara e chapéus pendurados na parede." },
    ],
  },
  {
    slug: "casa-de-campo-v2-santa-catarina",
    ref: "PB-103",
    deal: "venda",
    kind: "campo",
    typology: "V2",
    bedrooms: 2,
    bathrooms: 1,
    area: 110,
    plot: 4200,
    zone: "santa-catarina",
    spot: "Barrocal, a 15 minutos de Tavira",
    title: "Monte V2 com piscina e alfarrobeiras",
    lead: "Casa térrea de pedra, um terreno com alfarrobeiras e oliveiras, e uma piscina entre buganvílias.",
    description: [
      "Monte algarvio recuperado, com paredes grossas de pedra que guardam o fresco no verão e uma lareira para o inverno. A cozinha tem um forno de lenha antigo, mantido a funcionar.",
      "O terreno estende-se em socalcos, com alfarrobeiras, oliveiras e uma piscina rodeada de buganvílias. Acesso por estrada alcatroada até à porta.",
    ],
    features: ["Terreno de 4200 m²", "Piscina", "Lareira", "Forno de lenha", "Acesso alcatroado"],
    energy: "D",
    price: 298000,
    barra: "telha",
    photos: [
      { id: "monteExterior", alt: "Casa caiada entre buganvílias, um muro de pedra e uma piscina ao lado." },
      { id: "monteLareira", alt: "Recanto com uma lareira branca, almofadas e prateleiras de madeira." },
      { id: "monteCozinha", alt: "Cozinha antiga com bancada de madeira, frascos e utensílios pendurados." },
      { id: "monteQuarto", alt: "Quarto de paredes de cal com uma janela de madeira aberta para o verde." },
    ],
  },
  {
    slug: "moradia-v4-piscina-cabanas",
    ref: "PB-104",
    deal: "venda",
    kind: "moradia",
    typology: "V4",
    bedrooms: 4,
    bathrooms: 4,
    area: 285,
    plot: 900,
    zone: "cabanas",
    spot: "A 800 m da praia",
    title: "Moradia V4 com piscina e jardim",
    lead: "Quatro suites, salas abertas para o jardim e uma piscina com escadaria de pedra.",
    description: [
      "Moradia de dois pisos num lote de esquina, com uma sala de estar e jantar que se abre por inteiro para o jardim e a piscina. Os quatro quartos são suites, dois deles com varanda.",
      "Inclui garagem para dois carros, rega automática e painéis solares para a água quente. A praia e a ria ficam a um passeio de distância.",
    ],
    features: ["Piscina", "Quatro suites", "Garagem para dois carros", "Painéis solares", "Jardim com rega automática"],
    energy: "A",
    price: 890000,
    barra: "ocre",
    photos: [
      { id: "cabanasPiscina", alt: "Piscina azul ao pé de uma escadaria de pedra com balaústres brancos." },
      { id: "cabanasSala", alt: "Sala comprida com chão claro, sofás brancos e portas de vidro para o exterior." },
      { id: "cabanasQuarto", alt: "Quarto com portas de madeira abertas para uma varanda sobre o mar ao fim da tarde." },
    ],
  },
  {
    slug: "apartamento-t1-acoteia-olhao",
    ref: "PB-201",
    deal: "arrendamento",
    kind: "apartamento",
    typology: "T1",
    bedrooms: 1,
    bathrooms: 1,
    area: 58,
    zone: "olhao",
    spot: "Bairro da Barreta",
    title: "T1 com açoteia, mobilado",
    lead: "Arrendamento de longa duração num prédio de azulejo, com açoteia partilhada e vista de telhados.",
    description: [
      "Apartamento de um quarto, mobilado e equipado, num prédio antigo revestido a azulejo. Sala e cozinha em espaço aberto, quarto virado para o interior do quarteirão, sossegado.",
      "Contrato de longa duração, com uma renda de caução. Água, luz e internet por conta do inquilino.",
    ],
    features: ["Mobilado", "Açoteia partilhada", "Cozinha equipada", "Longa duração"],
    energy: "C",
    price: 950,
    barra: "anil",
    photos: [
      { id: "olhaoFachada", alt: "Fachada revestida a azulejo azul e branco com janelas altas e uma varanda." },
      { id: "olhaoSala", alt: "Sala branca com uma lareira, cadeirões e portadas azuis." },
      { id: "olhaoQuarto", alt: "Quarto com um dossel branco e uma parede de azulejos." },
    ],
  },
  {
    slug: "moradia-v3-santa-luzia",
    ref: "PB-202",
    deal: "arrendamento",
    kind: "moradia",
    typology: "V3",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    plot: 320,
    zone: "santa-luzia",
    spot: "A 5 minutos da ria",
    title: "Moradia V3 de telha, com quintal",
    lead: "Casa de família para arrendar todo o ano, com quintal, telheiro e lugar para dois carros.",
    description: [
      "Moradia de telhado de telha e paredes caiadas, num bairro tranquilo à entrada de Santa Luzia. Três quartos, sala com lareira e uma cozinha grande com mesa para seis.",
      "O quintal tem um telheiro para refeições ao ar livre e lugar para dois carros. Arrendamento de longa duração, sem mobília ou mobilado, a combinar.",
    ],
    features: ["Quintal com telheiro", "Lareira", "Estacionamento para dois carros", "Longa duração"],
    energy: "C",
    price: 1600,
    barra: "telha",
    photos: [
      { id: "santaLuziaExterior", alt: "Moradia branca com telhado de telha vermelha e um portão de madeira." },
      { id: "santaLuziaCozinha", alt: "Cozinha com uma mesa redonda escura, cadeiras e um armário antigo de madeira." },
      { id: "santaLuziaQuarto", alt: "Quarto de tons quentes com uma cama baixa e um candeeiro de verga." },
    ],
  },
  {
    slug: "casa-de-ferias-t2-fuseta",
    ref: "PB-301",
    deal: "ferias",
    kind: "moradia",
    typology: "T2",
    bedrooms: 2,
    bathrooms: 1,
    area: 74,
    zone: "fuseta",
    spot: "A 3 minutos do cais",
    title: "Casa da Ria, para férias",
    lead: "Casinha de janelas azuis, terraço com piscina de mergulho e o barco para as ilhas a três minutos a pé.",
    description: [
      "Casa térrea para férias, com dois quartos, sala com sofá-cama e um terraço com uma pequena piscina de mergulho e uma cama de dia à sombra. As janelas azuis abrem para um jardim pequeno.",
      "Gerida por nós: check-in à chegada, limpeza e roupa de cama entre estadias, e um guia digital dentro da casa com o WiFi, as regras e as nossas sugestões.",
    ],
    features: ["Até 4 hóspedes", "Piscina de mergulho", "Ar condicionado", "Guia digital na casa", "Barco para as ilhas a pé"],
    energy: "C",
    price: 140,
    guests: 4,
    minNights: 3,
    barra: "anil",
    photos: [
      { id: "fusetaExterior", alt: "Casa branca de telhado de telha, com uma janela de caixilhos azuis entre plantas." },
      { id: "fusetaTerraco", alt: "Cama de dia com uma cortina branca ao pé da piscina de mergulho." },
      { id: "fusetaVaranda", alt: "Terraço branco de chão claro com vista para o mar e um céu azul." },
    ],
  },
  {
    slug: "villa-v3-piscina-conceicao",
    ref: "PB-302",
    deal: "ferias",
    kind: "moradia",
    typology: "V3",
    bedrooms: 3,
    bathrooms: 3,
    area: 190,
    plot: 1500,
    zone: "conceicao",
    spot: "Campo, a 10 minutos da praia",
    title: "Villa das Buganvílias, para férias",
    lead: "Três suites, piscina privada e um alpendre de madeira para os fins de tarde.",
    description: [
      "Villa de férias no campo, entre alfarrobeiras, com três suites e uma sala de pé-direito alto. O alpendre de madeira dá para uma piscina privada com espreguiçadeiras.",
      "Gerida por nós de ponta a ponta: limpeza, roupa, manutenção da piscina e um guia digital na casa, em quatro línguas, com tudo o que os hóspedes precisam de saber.",
    ],
    features: ["Até 6 hóspedes", "Piscina privada", "Três suites", "Alpendre", "Guia digital na casa"],
    energy: "B",
    price: 290,
    guests: 6,
    minNights: 5,
    barra: "sal",
    photos: [
      { id: "buganviliasExterior", alt: "Casa branca com varanda de ferro, uma pérgula vermelha e buganvílias em flor." },
      { id: "buganviliasPiscina", alt: "Alpendre de madeira e pedra com espreguiçadeiras à beira de uma piscina." },
      { id: "buganviliasSala", alt: "Sala com janelas altas rendilhadas, sofás vermelhos e vista para a serra." },
    ],
  },
];

export interface ListingFilters {
  deal: Deal | "todos";
  kind: Kind | "todos";
  zone: ZoneId | "todas";
  /** Minimum bedrooms (0 = any). */
  bedrooms: number;
  /** Maximum price for the chosen deal (null = any). Only applies with a deal chosen. */
  maxPrice: number | null;
}

export const defaultFilters: ListingFilters = { deal: "todos", kind: "todos", zone: "todas", bedrooms: 0, maxPrice: null };

/** The price ceilings offered for each deal. */
export const priceSteps: Record<Deal, number[]> = {
  venda: [300000, 400000, 500000, 1000000],
  arrendamento: [1000, 1500, 2000],
  ferias: [150, 200, 300],
};

export function filterListings(all: readonly Listing[], f: ListingFilters): Listing[] {
  return all.filter(
    (l) =>
      (f.deal === "todos" || l.deal === f.deal) &&
      (f.kind === "todos" || l.kind === f.kind) &&
      (f.zone === "todas" || l.zone === f.zone) &&
      l.bedrooms >= f.bedrooms &&
      (f.maxPrice === null || f.deal === "todos" || l.price <= f.maxPrice),
  );
}

export function findListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

/** «485 000 €», «950 €/mês», «desde 140 €/noite». */
export function listingPrice(l: Pick<Listing, "deal" | "price">): string {
  const digits = String(Math.round(l.price)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const amount = `${digits} €${deals[l.deal].unit}`;
  return l.deal === "ferias" ? `desde ${amount}` : amount;
}

/** The message a visit request (or, for a holiday home, an availability request) opens in WhatsApp with. */
export function visitMessage(l: Pick<Listing, "ref" | "title" | "deal">, extra?: string): string {
  const base =
    l.deal === "ferias"
      ? `Olá! Gostava de saber a disponibilidade de ${l.title} (${l.ref}).`
      : `Olá! Gostava de visitar o imóvel ${l.ref} (${l.title}).`;
  return extra ? `${base} ${extra}` : base;
}
