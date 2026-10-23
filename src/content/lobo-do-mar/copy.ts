// Texts of Lobo do Mar's website, in European Portuguese and English. Every fact comes from a source listed in
// ./facts.ts: the restaurant's own site, its sign («Marisqueira · Sea Wolf»), its Instagram videos (the showcase,
// the live-seafood tank), the owner's photo with the seafood boat and the line on its wall. No ratings, no reviews,
// no prices on the site (the video menu is a demo and says so).

import type { LoboLocale } from "./routes";

export type LoboImage =
  | "boat"
  | "front"
  | "platter"
  | "skewers"
  | "showcase"
  | "bar"
  | "wall"
  | "squid"
  | "stew"
  | "cuttlefish"
  | "seabass"
  | "bream";

export interface LoboCopy {
  htmlLang: string;
  ogLocale: string;
  meta: { title: string; description: string };
  skip: string;
  newTab: string;
  langLabel: string;
  logoLabel: string;
  nav: { boat: string; menu: string; gallery: string; visit: string; book: string; open: string; close: string; label: string };
  hero: { kicker: string; titleTop: string; titleBottom: string; sub: string; lead: string; book: string; menu: string; scroll: string; clips: string[] };
  tank: { eyebrow: string; title: string; text: string; fishTitle: string; fishText: string };
  boat: { eyebrow: string; title: string; text: string; alt: string; spots: string[] };
  menu: { eyebrow: string; title: string; text: string; button: string; sections: string[] };
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
    frontAlt: string;
  };
  booking: { eyebrow: string; title: string; text: string; call: string; email: string };
  footer: { tagline: string; complaints: string; credit: string; rights: string; follow: string };
  notFound: { title: string; text: string; back: string };
}

const pt: LoboCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "Lobo do Mar · Marisqueira em Armação de Pêra",
    description:
      "Marisqueira em Armação de Pêra: marisco e peixe escolhidos na montra, mariscada no barco, arroz de marisco e cataplana. De terça a domingo, almoço e jantar.",
  },
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  langLabel: "Português",
  logoLabel: "Lobo do Mar, restaurante",
  nav: {
    boat: "O barco",
    menu: "Menu digital",
    gallery: "Pratos",
    visit: "Visitar",
    book: "Reservar",
    open: "Abrir menu",
    close: "Fechar menu",
    label: "Navegação principal",
  },
  hero: {
    kicker: "Marisqueira · Armação de Pêra",
    titleTop: "Lobo",
    titleBottom: "do Mar",
    sub: "Sea Wolf",
    lead: "Marisco e peixe escolhidos na montra, preparados na hora e servidos à mesa.",
    book: "Reservar mesa",
    menu: "Ver o menu digital",
    scroll: "Descer",
    clips: ["A montra", "O viveiro", "O peixe do dia"],
  },
  tank: {
    eyebrow: "O viveiro",
    title: "Marisco vivo, à vista",
    text: "Na sala, o viveiro guarda o marisco vivo até ir para a cozinha.",
    fishTitle: "O peixe do dia",
    fishText: "Mostrado à mesa antes de ir para a grelha.",
  },
  boat: {
    eyebrow: "O barco",
    title: "A mariscada chega num barco",
    text: "Ostras, camarão, lagostins e percebes, servidos num barco à mesa.",
    alt: "O dono do Lobo do Mar com um barco de madeira cheio de marisco: ostras, camarão, lagostins e percebes",
    spots: ["Ostras", "Lagostins", "Percebes", "Camarão"],
  },
  menu: {
    eyebrow: "Menu digital",
    title: "O menu digital",
    text: "Cada prato em vídeo, para ver antes de escolher, na sua língua. E o pedido faz-se à mesa.",
    button: "Abrir o menu digital",
    sections: ["Marisco", "Petiscos", "Peixes", "Especialidades", "Carnes", "Bebidas"],
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
      { title: "Esplanada", text: "Mesas cá fora, debaixo dos chapéus." },
      { title: "Ar condicionado", text: "Fresco lá dentro, todo o ano." },
      { title: "Take-away", text: "Encomende para levar, pelo telefone." },
      { title: "Wi-Fi grátis", text: "Para partilhar a mesa com quem não veio." },
    ],
  },
  gallery: {
    eyebrow: "Pratos",
    title: "Da montra para a mesa",
    hint: "Deslize para ver mais",
    photos: [
      { image: "platter", caption: "Mariscada", alt: "Travessa com sapateira, camarão e marisco variado" },
      { image: "skewers", caption: "Espetada de camarão", alt: "Espetada de camarão e peixe numa tábua, com salada" },
      { image: "seabass", caption: "Peixe grelhado", alt: "Peixe inteiro grelhado com batatas, salada e limão" },
      { image: "stew", caption: "Tacho de marisco", alt: "Tacho com marisco, mexilhão e pimento" },
      { image: "cuttlefish", caption: "Choquinhos fritos", alt: "Choquinhos fritos com batata frita e pão" },
      { image: "squid", caption: "Lulas grelhadas", alt: "Lulas grelhadas com batata cozida, salada e limão" },
      { image: "bream", caption: "Peixe aberto na grelha", alt: "Peixe aberto e grelhado numa travessa, com batatas e salada" },
      { image: "bar", caption: "O balcão", alt: "O balcão do restaurante com a placa Lobo do Mar e as garrafas" },
    ],
  },
  marquee: ["Marisqueira", "Marisco", "Peixe grelhado", "Petiscos", "Armação de Pêra"],
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
    frontAlt: "A esplanada do Lobo do Mar com o letreiro azul «Marisqueira Lobo do Mar · Sea Wolf» e dois chapéus",
  },
  booking: {
    eyebrow: "Reservas",
    title: "Guarde a sua mesa",
    text: "De terça a domingo, ao almoço e ao jantar.",
    call: "Ligar",
    email: "Enviar e-mail",
  },
  footer: {
    tagline: "Marisqueira em Armação de Pêra.",
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
    title: "Lobo do Mar · Seafood restaurant in Armação de Pêra",
    description:
      "Seafood restaurant in Armação de Pêra: seafood and fish chosen from the display, a seafood platter served on a boat, seafood rice and cataplana. Tuesday to Sunday, lunch and dinner.",
  },
  skip: "Skip to content",
  newTab: "(opens in a new tab)",
  langLabel: "English",
  logoLabel: "Lobo do Mar, restaurant",
  nav: {
    boat: "The boat",
    menu: "Digital menu",
    gallery: "Dishes",
    visit: "Visit",
    book: "Book",
    open: "Open menu",
    close: "Close menu",
    label: "Main navigation",
  },
  hero: {
    kicker: "Seafood restaurant · Armação de Pêra",
    titleTop: "Lobo",
    titleBottom: "do Mar",
    sub: "Sea Wolf",
    lead: "Seafood and fish chosen from the display, cooked to order and served at your table.",
    book: "Book a table",
    menu: "See the digital menu",
    scroll: "Scroll",
    clips: ["The display", "The live tank", "Fish of the day"],
  },
  tank: {
    eyebrow: "The live tank",
    title: "Live seafood, in plain sight",
    text: "In the dining room, the tank keeps the seafood alive until it goes to the kitchen.",
    fishTitle: "Fish of the day",
    fishText: "Shown at the table before it goes on the grill.",
  },
  boat: {
    eyebrow: "The boat",
    title: "The seafood platter comes on a boat",
    text: "Oysters, prawns, langoustines and goose barnacles, served on a boat at your table.",
    alt: "Lobo do Mar's owner holding a wooden boat full of seafood: oysters, prawns, langoustines and goose barnacles",
    spots: ["Oysters", "Langoustines", "Goose barnacles", "Prawns"],
  },
  menu: {
    eyebrow: "Digital menu",
    title: "The digital menu",
    text: "Every dish on video, to see before you choose, in your language. And you order at the table.",
    button: "Open the digital menu",
    sections: ["Seafood", "Petiscos", "Fish", "Specialities", "Meat", "Drinks"],
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
      { title: "Terrace", text: "Tables outside, under the umbrellas." },
      { title: "Air conditioning", text: "Cool inside, all year round." },
      { title: "Takeaway", text: "Order to take away, by phone." },
      { title: "Free Wi-Fi", text: "To share the table with those who didn't come." },
    ],
  },
  gallery: {
    eyebrow: "Dishes",
    title: "From the display to the table",
    hint: "Swipe to see more",
    photos: [
      { image: "platter", caption: "Seafood platter", alt: "Platter with brown crab, prawns and assorted seafood" },
      { image: "skewers", caption: "Prawn skewer", alt: "Prawn and fish skewer on a board, with salad" },
      { image: "seabass", caption: "Grilled fish", alt: "Whole grilled fish with potatoes, salad and lemon" },
      { image: "stew", caption: "Seafood pot", alt: "Pot of seafood with mussels and peppers" },
      { image: "cuttlefish", caption: "Fried baby cuttlefish", alt: "Fried baby cuttlefish with chips and bread" },
      { image: "squid", caption: "Grilled squid", alt: "Grilled squid with boiled potatoes, salad and lemon" },
      { image: "bream", caption: "Butterflied fish on the grill", alt: "Butterflied grilled fish on a platter, with potatoes and salad" },
      { image: "bar", caption: "The bar", alt: "The restaurant's bar with the Lobo do Mar sign and the bottles" },
    ],
  },
  marquee: ["Seafood", "Marisqueira", "Grilled fish", "Petiscos", "Armação de Pêra"],
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
    frontAlt: "Lobo do Mar's terrace with the blue sign «Marisqueira Lobo do Mar · Sea Wolf» and two umbrellas",
  },
  booking: {
    eyebrow: "Bookings",
    title: "Save your table",
    text: "Tuesday to Sunday, lunch and dinner.",
    call: "Call",
    email: "Send an e-mail",
  },
  footer: {
    tagline: "Seafood restaurant in Armação de Pêra.",
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
