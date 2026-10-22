// Texts of Lobo do Mar's website, in European Portuguese and English. Every fact comes from a source listed in
// ./facts.ts: the restaurant's own site, the chalkboard by its door and the line on its wall. No ratings, no
// reviews, no prices, no invented dishes.

import type { LoboLocale } from "./routes";

export type LoboImage =
  | "bar"
  | "barTall"
  | "wall"
  | "board"
  | "squid"
  | "bream"
  | "grilledFish"
  | "salmon"
  | "stew"
  | "cuttlefish"
  | "mixedGrill"
  | "pot"
  | "cutlet"
  | "seabass";

export interface LoboTide {
  index: string;
  title: string;
  dishes: string[];
  image: LoboImage;
  alt: string;
}

export interface LoboCopy {
  htmlLang: string;
  ogLocale: string;
  meta: { title: string; description: string };
  skip: string;
  newTab: string;
  langLabel: string;
  logoLabel: string;
  nav: { tides: string; board: string; gallery: string; visit: string; book: string; open: string; close: string; label: string };
  hero: { kicker: string; titleTop: string; titleBottom: string; lead: string; call: string; board: string; scroll: string; alts: string[] };
  tides: { eyebrow: string; title: string; items: LoboTide[] };
  board: {
    eyebrow: string;
    title: string;
    intro: string;
    columns: { name: string; dishes: string[] }[];
    bubbles: string[];
    alt: string;
    note: string;
  };
  wall: { eyebrow: string; line: string; source: string; alt: string };
  services: { eyebrow: string; items: { title: string; text: string }[] };
  gallery: { eyebrow: string; title: string; hint: string; photos: { image: LoboImage; caption: string; alt: string }[] };
  marquee: string[];
  visit: {
    eyebrow: string;
    title: string;
    addressLabel: string;
    hoursLabel: string;
    days: { label: string; hours: string | null }[];
    closed: string;
    phoneLabel: string;
    phoneNote: string;
    emailLabel: string;
    takeaway: string;
    directions: string;
    mapButton: string;
    mapNote: string;
    mapTitle: string;
  };
  booking: { eyebrow: string; title: string; text: string; call: string; email: string };
  footer: { tagline: string; complaints: string; credit: string; rights: string; follow: string };
  notFound: { title: string; text: string; back: string };
}

const pt: LoboCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Lobo do Mar · Tapas e Petiscos em Armação de Pêra",
    description:
      "Peixe grelhado, arroz de marisco, cataplana de polvo e petiscos em Armação de Pêra. De terça a domingo, almoço e jantar. Esplanada, ar condicionado e take-away.",
  },
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  langLabel: "Português",
  logoLabel: "Lobo do Mar, restaurante",
  nav: {
    tides: "Cozinha",
    board: "O quadro",
    gallery: "Pratos",
    visit: "Visitar",
    book: "Reservar",
    open: "Abrir menu",
    close: "Fechar menu",
    label: "Navegação principal",
  },
  hero: {
    kicker: "Tapas e Petiscos · Armação de Pêra",
    titleTop: "Lobo",
    titleBottom: "do Mar",
    lead: "Peixe grelhado, mariscos, arrozes e petiscos, feitos no momento.",
    call: "Ligar para reservar",
    board: "Ver o quadro",
    scroll: "Descer",
    alts: [
      "Peixe inteiro grelhado com batatas, salada e limão",
      "Tacho com marisco, mexilhão e pimento",
      "Lulas grelhadas com batata cozida e salada",
    ],
  },
  tides: {
    eyebrow: "A cozinha",
    title: "Três marés",
    items: [
      {
        index: "01",
        title: "Peixe na grelha",
        dishes: ["Dourada", "Robalo", "Linguado", "Sargos", "Salmão"],
        image: "seabass",
        alt: "Peixe inteiro grelhado com batatas, salada e limão",
      },
      {
        index: "02",
        title: "Arrozes e tachos",
        dishes: ["Arroz de marisco", "Arroz de tamboril", "Arroz de lingueirão", "Cataplana de polvo", "Feijoada de chocos"],
        image: "stew",
        alt: "Tacho com marisco, mexilhão e pimento",
      },
      {
        index: "03",
        title: "Tapas e petiscos",
        dishes: ["Choquinhos fritos", "Polvo à lagareiro", "Saladas de polvo e ovas", "Camarão à Lobo do Mar", "Mariscos variados"],
        image: "cuttlefish",
        alt: "Choquinhos fritos com batata frita e pão",
      },
    ],
  },
  board: {
    eyebrow: "O quadro",
    title: "Escrito a giz, à porta",
    intro: "Os pratos do quadro do restaurante.",
    columns: [
      { name: "Peixes", dishes: ["Bacalhau à casa", "Moqueca de camarão", "Dourada", "Robalo", "Salmão", "Choquinhos fritos", "Polvo à lagareiro", "Linguado", "Sargos"] },
      { name: "Carnes", dishes: ["Bife à portuguesa", "Bife pimenta", "Lagartos de porco preto"] },
      { name: "Especialidades", dishes: ["Arroz de marisco", "Arroz de tamboril", "Arroz de lingueirão", "Cataplana de polvo", "Feijoada de chocos"] },
    ],
    bubbles: ["Mariscos variados", "Tapas & petiscos", "Saladas de polvo e ovas", "Camarão à Lobo do Mar"],
    alt: "O quadro de ardósia do restaurante, escrito a giz, com os peixes, as carnes e as especialidades",
    note: "Preços e prato do dia: pergunte à mesa ou pelo telefone.",
  },
  wall: {
    eyebrow: "Na parede",
    line: "A melhor rede social ainda é uma mesa rodeada de amigos!",
    source: "Escrito na parede do Lobo do Mar",
    alt: "Parede do restaurante com três copos de vinho desenhados e a frase escrita, por cima de uma mesa de madeira",
  },
  services: {
    eyebrow: "A casa",
    items: [
      { title: "Esplanada", text: "Mesas cá fora, quando está calor." },
      { title: "Ar condicionado", text: "Fresco lá dentro, todo o ano." },
      { title: "Take-away", text: "Encomende para levar, pelo telefone." },
      { title: "Wi-Fi grátis", text: "Para partilhar a mesa com quem não veio." },
    ],
  },
  gallery: {
    eyebrow: "Pratos",
    title: "Da cozinha do Lobo",
    hint: "Deslize para ver mais",
    photos: [
      { image: "squid", caption: "Lulas grelhadas", alt: "Lulas grelhadas com batata cozida, salada e limão" },
      { image: "bream", caption: "Peixe aberto na grelha", alt: "Peixe aberto e grelhado numa travessa, com batatas e salada" },
      { image: "stew", caption: "Tacho de marisco", alt: "Tacho com marisco, mexilhão e pimento" },
      { image: "cuttlefish", caption: "Choquinhos fritos", alt: "Choquinhos fritos com batata frita e pão" },
      { image: "seabass", caption: "Peixe grelhado", alt: "Peixe inteiro grelhado com batatas, salada e limão" },
      { image: "mixedGrill", caption: "Carne na grelha", alt: "Carne grelhada com batata frita, salada e limão" },
      { image: "grilledFish", caption: "Posta grelhada", alt: "Posta de peixe grelhada com batatas, salada e limão" },
      { image: "pot", caption: "Saído do tacho", alt: "Tacho de barro com o prato e uma taça de arroz ao lado" },
      { image: "bar", caption: "O balcão", alt: "O balcão do restaurante com a placa Lobo do Mar e as garrafas" },
    ],
  },
  marquee: ["Tapas", "Petiscos", "Peixe grelhado", "Mariscos", "Armação de Pêra"],
  visit: {
    eyebrow: "Visitar",
    title: "Em Armação de Pêra",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    days: [
      { label: "Segunda", hours: null },
      { label: "Terça a domingo", hours: "10:00 – 15:00 · 18:00 – 22:30" },
    ],
    closed: "Encerrado",
    phoneLabel: "Telefone",
    phoneNote: "Chamada para a rede móvel nacional",
    emailLabel: "E-mail",
    takeaway: "Encomendas para levar: ligue-nos dentro do horário.",
    directions: "Como chegar",
    mapButton: "Ver mapa",
    mapNote: "O mapa do Google só carrega quando carregar no botão.",
    mapTitle: "Mapa: Lobo do Mar, Armação de Pêra",
  },
  booking: {
    eyebrow: "Reservas",
    title: "Guarde a sua mesa",
    text: "De terça a domingo, ao almoço e ao jantar.",
    call: "Ligar",
    email: "Enviar e-mail",
  },
  footer: {
    tagline: "Tapas e petiscos em Armação de Pêra.",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    rights: "Todos os direitos reservados.",
    follow: "Siga no Instagram",
  },
  notFound: {
    title: "Esta página não existe",
    text: "A ligação pode estar errada ou a página mudou de sítio.",
    back: "Voltar ao início",
  },
};

const en: LoboCopy = {
  htmlLang: "en",
  ogLocale: "en_GB",
  meta: {
    title: "Lobo do Mar · Tapas and Petiscos in Armação de Pêra",
    description:
      "Grilled fish, seafood rice, octopus cataplana and petiscos in Armação de Pêra. Tuesday to Sunday, lunch and dinner. Terrace, air conditioning and takeaway.",
  },
  skip: "Skip to content",
  newTab: "(opens in a new tab)",
  langLabel: "English",
  logoLabel: "Lobo do Mar, restaurant",
  nav: {
    tides: "Cooking",
    board: "The board",
    gallery: "Dishes",
    visit: "Visit",
    book: "Book",
    open: "Open menu",
    close: "Close menu",
    label: "Main navigation",
  },
  hero: {
    kicker: "Tapas and Petiscos · Armação de Pêra",
    titleTop: "Lobo",
    titleBottom: "do Mar",
    lead: "Grilled fish, seafood, rice dishes and petiscos, cooked to order.",
    call: "Call to book",
    board: "See the board",
    scroll: "Scroll",
    alts: [
      "Whole grilled fish with potatoes, salad and lemon",
      "Pot of seafood with mussels and peppers",
      "Grilled squid with boiled potatoes and salad",
    ],
  },
  tides: {
    eyebrow: "The cooking",
    title: "Three tides",
    items: [
      {
        index: "01",
        title: "Fish on the grill",
        dishes: ["Gilthead bream", "Sea bass", "Sole", "White seabream", "Salmon"],
        image: "seabass",
        alt: "Whole grilled fish with potatoes, salad and lemon",
      },
      {
        index: "02",
        title: "Rice and pots",
        dishes: ["Seafood rice", "Monkfish rice", "Razor clam rice", "Octopus cataplana", "Cuttlefish bean stew"],
        image: "stew",
        alt: "Pot of seafood with mussels and peppers",
      },
      {
        index: "03",
        title: "Tapas and petiscos",
        dishes: ["Fried baby cuttlefish", "Octopus à lagareiro", "Octopus and roe salads", "Prawns à Lobo do Mar", "Assorted seafood"],
        image: "cuttlefish",
        alt: "Fried baby cuttlefish with chips and bread",
      },
    ],
  },
  board: {
    eyebrow: "The board",
    title: "Written in chalk, at the door",
    intro: "The dishes on the restaurant's board.",
    columns: [
      { name: "Fish", dishes: ["House salt cod", "Prawn moqueca", "Gilthead bream", "Sea bass", "Salmon", "Fried baby cuttlefish", "Octopus à lagareiro", "Sole", "White seabream"] },
      { name: "Meat", dishes: ["Portuguese-style steak", "Pepper steak", "Black pork lagartos"] },
      { name: "Specialities", dishes: ["Seafood rice", "Monkfish rice", "Razor clam rice", "Octopus cataplana", "Cuttlefish bean stew"] },
    ],
    bubbles: ["Assorted seafood", "Tapas & petiscos", "Octopus and roe salads", "Prawns à Lobo do Mar"],
    alt: "The restaurant's slate board, written in chalk, with the fish, the meat and the specialities",
    note: "Prices and the dish of the day: ask at the table or by phone.",
  },
  wall: {
    eyebrow: "On the wall",
    line: "The best social network is still a table full of friends!",
    source: "Written on the wall of Lobo do Mar (translated)",
    alt: "The restaurant's wall with three drawn wine glasses and the line written above a wooden table",
  },
  services: {
    eyebrow: "The house",
    items: [
      { title: "Terrace", text: "Tables outside when it's warm." },
      { title: "Air conditioning", text: "Cool inside, all year round." },
      { title: "Takeaway", text: "Order to take away, by phone." },
      { title: "Free Wi-Fi", text: "To share the table with those who didn't come." },
    ],
  },
  gallery: {
    eyebrow: "Dishes",
    title: "From Lobo's kitchen",
    hint: "Swipe to see more",
    photos: [
      { image: "squid", caption: "Grilled squid", alt: "Grilled squid with boiled potatoes, salad and lemon" },
      { image: "bream", caption: "Butterflied fish on the grill", alt: "Butterflied grilled fish on a platter, with potatoes and salad" },
      { image: "stew", caption: "Seafood pot", alt: "Pot of seafood with mussels and peppers" },
      { image: "cuttlefish", caption: "Fried baby cuttlefish", alt: "Fried baby cuttlefish with chips and bread" },
      { image: "seabass", caption: "Grilled fish", alt: "Whole grilled fish with potatoes, salad and lemon" },
      { image: "mixedGrill", caption: "Meat on the grill", alt: "Grilled meat with chips, salad and lemon" },
      { image: "grilledFish", caption: "Grilled fish steak", alt: "Grilled fish steak with potatoes, salad and lemon" },
      { image: "pot", caption: "Straight from the pot", alt: "Clay pot with the dish and a bowl of rice beside it" },
      { image: "bar", caption: "The bar", alt: "The restaurant's bar with the Lobo do Mar sign and the bottles" },
    ],
  },
  marquee: ["Tapas", "Petiscos", "Grilled fish", "Seafood", "Armação de Pêra"],
  visit: {
    eyebrow: "Visit",
    title: "In Armação de Pêra",
    addressLabel: "Address",
    hoursLabel: "Opening hours",
    days: [
      { label: "Monday", hours: null },
      { label: "Tuesday to Sunday", hours: "10:00 – 15:00 · 18:00 – 22:30" },
    ],
    closed: "Closed",
    phoneLabel: "Phone",
    phoneNote: "Call to a Portuguese mobile number",
    emailLabel: "E-mail",
    takeaway: "Takeaway orders: call us during opening hours.",
    directions: "Directions",
    mapButton: "Show map",
    mapNote: "The Google map only loads when you press the button.",
    mapTitle: "Map: Lobo do Mar, Armação de Pêra",
  },
  booking: {
    eyebrow: "Bookings",
    title: "Save your table",
    text: "Tuesday to Sunday, lunch and dinner.",
    call: "Call",
    email: "Send an e-mail",
  },
  footer: {
    tagline: "Tapas and petiscos in Armação de Pêra.",
    complaints: "Complaints book",
    credit: "Website by Steevanz",
    rights: "All rights reserved.",
    follow: "Follow on Instagram",
  },
  notFound: {
    title: "This page doesn't exist",
    text: "The link may be wrong, or the page has moved.",
    back: "Back to the start",
  },
};

export const loboCopy: Record<LoboLocale, LoboCopy> = { pt, en };
