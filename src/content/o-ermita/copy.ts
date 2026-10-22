// Texts of O Ermita's website, in European Portuguese and English. Every fact comes from a source listed in
// ./facts.ts: the restaurant's own page and Google profile, the hotel's site, visitalentejo.pt and
// lifecooler.com. No ratings, no reviews, no prices, no invented dishes.

import type { ErmitaLocale } from "./routes";

export interface ErmitaCourse {
  name: string;
  dishes: string[];
}

export type ErmitaImage =
  | "portal"
  | "vault"
  | "vaultTall"
  | "tiles"
  | "cellar"
  | "entrance"
  | "salaFresco"
  | "painel"
  | "fonte"
  | "capelaExterior"
  | "terraco";

export interface ErmitaChapter {
  mark: string;
  title: string;
  text: string;
  image: ErmitaImage;
  alt: string;
}

export interface ErmitaPhoto {
  image: ErmitaImage;
  caption: string;
  alt: string;
}

export interface ErmitaCopy {
  htmlLang: string;
  ogLocale: string;
  meta: { title: string; description: string };
  skip: string;
  newTab: string;
  langLabel: string;
  otherLang: string;
  logoLabel: string;
  nav: { house: string; cuisine: string; gallery: string; visit: string; book: string; open: string; close: string; label: string };
  hero: { kicker: string; title: string; lead: string; whatsapp: string; call: string; directions: string; scroll: string; alt: string };
  manifesto: { eyebrow: string; text: string };
  timeline: { eyebrow: string; title: string; titleItalic: string; hint: string; chapters: ErmitaChapter[] };
  azulejos: { value: number; label: string; line: string; source: string };
  sala: { eyebrow: string; title: string; titleItalic: string; text: string; alt: string };
  marquee: string[];
  cuisine: {
    eyebrow: string;
    title: string;
    titleItalic: string;
    intro: string;
    menuTitle: string;
    courses: ErmitaCourse[];
    menuNote: string;
    imageAlt: string;
    people: { role: string; name: string; initials: string; text: string }[];
  };
  gallery: { eyebrow: string; title: string; titleItalic: string; hint: string; photos: ErmitaPhoto[] };
  visit: {
    eyebrow: string;
    title: string;
    titleItalic: string;
    intro: string;
    addressLabel: string;
    hoursLabel: string;
    everyDay: string;
    lunch: string;
    dinner: string;
    bookingNote: string;
    phoneLabel: string;
    phoneNote: string;
    whatsappLabel: string;
    whatsappNote: string;
    accessLabel: string;
    access: string;
    directions: string;
    mapButton: string;
    mapNote: string;
    mapTitle: string;
    entranceAlt: string;
  };
  booking: { eyebrow: string; title: string; text: string; whatsapp: string; call: string };
  footer: { tagline: string; hotel: string; complaints: string; credit: string; rights: string; contacts: string; hours: string };
  notFound: { title: string; text: string; back: string };
}

const pt: ErmitaCopy = {
  htmlLang: "pt-PT",
  ogLocale: "pt_PT",
  meta: {
    title: "O Ermita · Restaurante no Convento de São Paulo, Redondo",
    description:
      "Sabores do Alentejo num convento histórico: o restaurante do Hotel Convento de São Paulo, na antiga Capela do Bispo, na Serra d'Ossa. Almoço e jantar todos os dias. Reservas por WhatsApp ou telefone.",
  },
  skip: "Saltar para o conteúdo",
  newTab: "(abre num novo separador)",
  langLabel: "Português",
  otherLang: "English",
  logoLabel: "O Ermita, restaurante",
  nav: {
    house: "A casa",
    cuisine: "Cozinha",
    gallery: "Galeria",
    visit: "Visitar",
    book: "Reservar",
    open: "Abrir menu",
    close: "Fechar menu",
    label: "Navegação principal",
  },
  hero: {
    kicker: "Restaurante · Hotel Convento de São Paulo",
    title: "Sabores do Alentejo num convento histórico",
    lead: "Na antiga Capela do Bispo, na Serra d'Ossa, entre Estremoz e Redondo.",
    whatsapp: "Reservar por WhatsApp",
    call: "Ligar",
    directions: "Como chegar",
    scroll: "Descer",
    alt: "Vista aérea do Convento de São Paulo, caiado e com telhados de telha, entre o arvoredo da Serra d'Ossa",
  },
  manifesto: {
    eyebrow: "Desde 1182",
    text: "Em 1182, os Monges Ermitas de São Paulo ergueram um convento na Serra d'Ossa. Mais de oito séculos depois, na antiga Capela do Bispo, é o Alentejo que se senta à mesa.",
  },
  timeline: {
    eyebrow: "A casa",
    title: "Oito séculos",
    titleItalic: "numa só sala",
    hint: "Deslize para ver mais",
    chapters: [
      {
        mark: "1182",
        title: "A fundação",
        text: "A Ordem dos Monges Ermitas de São Paulo constrói o convento na Serra d'Ossa, entre Estremoz e Redondo.",
        image: "capelaExterior",
        alt: "Pequena capela caiada no fim de um caminho de calçada, entre árvores, na Serra d'Ossa",
      },
      {
        mark: "Reis e rainhas",
        title: "Hóspedes da casa",
        text: "Pelas salas do convento passaram D. Sebastião, D. João IV e D. Catarina de Bragança.",
        image: "fonte",
        alt: "Fonte barroca de mármore com um tanque de água verde, ao lado de um muro caiado e de um telhado",
      },
      {
        mark: "Séc. XVIII",
        title: "A Capela do Bispo",
        text: "Construída na primeira década do século XVIII: uma abóbada de berço com pinturas de brutesco. É aqui que fica o restaurante.",
        image: "salaFresco",
        alt: "A sala do restaurante sob a abóbada pintada, com mesas postas, cadeiras estofadas e chão de pedra",
      },
      {
        mark: "D. João V · D. José I",
        title: "O azul-cobalto",
        text: "Os azulejos que revestem os corredores vêm destes dois reinados. Os da capela são assinados por António de Oliveira Bernardes.",
        image: "painel",
        alt: "Painel de azulejo azul e branco com um monge e figuras diante de um convento, atrás de uma mesa posta",
      },
      {
        mark: "Hoje",
        title: "O Ermita",
        text: "O restaurante do Hotel Convento de São Paulo. Almoço e jantar, todos os dias.",
        image: "vault",
        alt: "Sala comprida com tecto abobadado, mesas postas e chão em xadrez preto e branco",
      },
    ],
  },
  azulejos: {
    value: 54000,
    label: "azulejos nas paredes do convento",
    line: "O azul-cobalto que reveste os corredores do convento vem dos reinados de D. João V e D. José I.",
    source: "Convento de São Paulo, Serra d'Ossa",
  },
  sala: {
    eyebrow: "A sala",
    title: "Sob a abóbada",
    titleItalic: "da Capela do Bispo",
    text: "Uma sala coberta por uma abóbada de berço, com azulejos assinados por António de Oliveira Bernardes e pinturas de brutesco na abóbada.",
    alt: "A sala do restaurante sob a abóbada pintada, com mesas postas, cadeiras estofadas e chão de pedra",
  },
  marquee: ["Reserve a sua mesa", "Almoço e jantar", "Todos os dias", "Serra d'Ossa"],
  cuisine: {
    eyebrow: "A cozinha",
    title: "Uma viagem pela",
    titleItalic: "gastronomia alentejana",
    intro:
      "Os produtos do Alentejo numa leitura nova, a doçaria conventual e uma escolha cuidada de vinhos da vasta garrafeira da casa.",
    menuTitle: "Da ementa",
    courses: [
      { name: "Para começar", dishes: ["Croquetes do chefe", "Tábua de enchidos regionais", "Queijos"] },
      { name: "À mesa", dishes: ["Sopa de tomate", "Bacalhau à Ermita", "Bochechas de porco com migas de espargos salteados"] },
      { name: "Para terminar", dishes: ["Marquise de chocolate", "Doces conventuais"] },
    ],
    menuNote: "Alguns dos pratos que se destacam na ementa.",
    imageAlt: "Garrafeira e mesas postas junto a painéis de azulejo, com a luz da tarde a entrar pela janela",
    people: [
      {
        role: "O chefe",
        name: "Luciano Soares",
        initials: "LS",
        text: "Começou a formação no Brasil e especializou-se em cozinha internacional em Vigo. No Alentejo, dá nova vida aos ingredientes da região com técnicas contemporâneas.",
      },
      {
        role: "O escanção",
        name: "Fábio Nico",
        initials: "FN",
        text: "Já trabalhava no Ermita quando, em 2017, se especializou no Wine & Spirit Education Trust. Aconselhe-se com ele: há um vinho para cada prato.",
      },
    ],
  },
  gallery: {
    eyebrow: "Galeria",
    title: "A casa",
    titleItalic: "por dentro",
    hint: "Deslize para ver mais",
    photos: [
      { image: "salaFresco", caption: "A abóbada pintada", alt: "A sala do restaurante sob a abóbada pintada, com mesas postas e chão de pedra" },
      { image: "vault", caption: "A sala", alt: "Sala comprida com tecto abobadado, mesas postas e chão em xadrez preto e branco" },
      { image: "tiles", caption: "Os azulejos", alt: "Mesas postas junto a um painel de azulejo azul e branco com cenas de figuras" },
      { image: "vaultTall", caption: "Luz das arcadas", alt: "A sala abobadada vista de frente, com a luz quente das arcadas e a mesa de serviço" },
      { image: "portal", caption: "O portal", alt: "Portal de mármore com uma cruz, entre dois lavabos de pedra com azulejos" },
      { image: "cellar", caption: "A garrafeira", alt: "Garrafas de vinho, um candeeiro aceso e mesas junto aos azulejos" },
      { image: "terraco", caption: "O terraço", alt: "Terraço caiado com oliveiras em vasos e um muro de pedra, com a serra ao fundo" },
      { image: "entrance", caption: "A entrada", alt: "Entrada do restaurante numa parede caiada, com a placa O Ermita e dois candeeiros" },
    ],
  },
  visit: {
    eyebrow: "Visitar",
    title: "Na Serra d'Ossa,",
    titleItalic: "entre Estremoz e Redondo",
    intro: "O Ermita fica dentro do Hotel Convento de São Paulo, em Aldeia da Serra.",
    addressLabel: "Morada",
    hoursLabel: "Horário",
    everyDay: "Todos os dias",
    lunch: "Almoço",
    dinner: "Jantar",
    bookingNote: "Recomendamos reserva.",
    phoneLabel: "Telefone",
    phoneNote: "Chamada para a rede fixa nacional",
    whatsappLabel: "WhatsApp",
    whatsappNote: "Reservas por mensagem · número da rede móvel nacional",
    accessLabel: "Acessibilidade",
    access: "Estacionamento, lugares e casa de banho acessíveis a cadeiras de rodas.",
    directions: "Como chegar",
    mapButton: "Ver mapa",
    mapNote: "O mapa do Google só carrega quando carregar no botão.",
    mapTitle: "Mapa: O Ermita, Hotel Convento de São Paulo",
    entranceAlt: "Entrada do restaurante numa parede caiada, com a placa O Ermita",
  },
  booking: {
    eyebrow: "Reservas",
    title: "Reserve a sua mesa",
    text: "Por WhatsApp ou por telefone. Almoço e jantar, todos os dias.",
    whatsapp: "Reservar por WhatsApp",
    call: "Ligar",
  },
  footer: {
    tagline: "O restaurante do Hotel Convento de São Paulo, na Serra d'Ossa.",
    hotel: "Hotel Convento de São Paulo",
    complaints: "Livro de Reclamações",
    credit: "Site por Steevanz",
    rights: "Todos os direitos reservados.",
    contacts: "Contactos",
    hours: "Horário",
  },
  notFound: {
    title: "Esta página não existe",
    text: "A ligação pode estar errada ou a página mudou de sítio.",
    back: "Voltar ao início",
  },
};

const en: ErmitaCopy = {
  htmlLang: "en",
  ogLocale: "en_GB",
  meta: {
    title: "O Ermita · Restaurant at the Convento de São Paulo, Redondo",
    description:
      "Flavours of the Alentejo in a historic convent: the restaurant of the Hotel Convento de São Paulo, in the old Bishop's Chapel, in the Serra d'Ossa. Lunch and dinner every day. Book by WhatsApp or phone.",
  },
  skip: "Skip to content",
  newTab: "(opens in a new tab)",
  langLabel: "English",
  otherLang: "Português",
  logoLabel: "O Ermita, restaurant",
  nav: {
    house: "The house",
    cuisine: "Cuisine",
    gallery: "Gallery",
    visit: "Visit",
    book: "Book",
    open: "Open menu",
    close: "Close menu",
    label: "Main navigation",
  },
  hero: {
    kicker: "Restaurant · Hotel Convento de São Paulo",
    title: "Flavours of the Alentejo in a historic convent",
    lead: "In the old Bishop's Chapel, in the Serra d'Ossa, between Estremoz and Redondo.",
    whatsapp: "Book on WhatsApp",
    call: "Call",
    directions: "Directions",
    scroll: "Scroll",
    alt: "Aerial view of the whitewashed Convento de São Paulo with its tiled roofs, among the trees of the Serra d'Ossa",
  },
  manifesto: {
    eyebrow: "Since 1182",
    text: "In 1182, the Hermit Monks of Saint Paul raised a convent in the Serra d'Ossa. More than eight centuries later, in the old Bishop's Chapel, it is the Alentejo that sits down at the table.",
  },
  timeline: {
    eyebrow: "The house",
    title: "Eight centuries",
    titleItalic: "in a single room",
    hint: "Swipe to see more",
    chapters: [
      {
        mark: "1182",
        title: "The founding",
        text: "The Order of the Hermit Monks of Saint Paul builds the convent in the Serra d'Ossa, between Estremoz and Redondo.",
        image: "capelaExterior",
        alt: "Small whitewashed chapel at the end of a cobbled path, among trees, in the Serra d'Ossa",
      },
      {
        mark: "Kings and queens",
        title: "Guests of the house",
        text: "King Sebastian, King John IV and Catherine of Braganza all passed through the convent's halls.",
        image: "fonte",
        alt: "Baroque marble fountain with a green water tank, beside a whitewashed wall and a tiled roof",
      },
      {
        mark: "18th c.",
        title: "The Bishop's Chapel",
        text: "Built in the first decade of the 18th century: a barrel vault with brutesco paintings. This is where the restaurant is.",
        image: "salaFresco",
        alt: "The restaurant's dining room under the painted vault, with laid tables, upholstered chairs and a stone floor",
      },
      {
        mark: "John V · Joseph I",
        title: "Cobalt blue",
        text: "The tiles lining the corridors date from these two reigns. Those in the chapel are signed by António de Oliveira Bernardes.",
        image: "painel",
        alt: "Blue and white tile panel with a monk and figures before a convent, behind a laid table",
      },
      {
        mark: "Today",
        title: "O Ermita",
        text: "The restaurant of the Hotel Convento de São Paulo. Lunch and dinner, every day.",
        image: "vault",
        alt: "Long room with a vaulted ceiling, laid tables and a black and white chequered floor",
      },
    ],
  },
  azulejos: {
    value: 54000,
    label: "tiles on the convent's walls",
    line: "The cobalt blue lining the convent's corridors dates from the reigns of King John V and King Joseph I.",
    source: "Convento de São Paulo, Serra d'Ossa",
  },
  sala: {
    eyebrow: "The dining room",
    title: "Under the vault",
    titleItalic: "of the Bishop's Chapel",
    text: "A room under a barrel vault, with tiles signed by António de Oliveira Bernardes and brutesco paintings on the vault.",
    alt: "The restaurant's dining room under the painted vault, with laid tables, upholstered chairs and a stone floor",
  },
  marquee: ["Book your table", "Lunch and dinner", "Every day", "Serra d'Ossa"],
  cuisine: {
    eyebrow: "The cuisine",
    title: "A journey through",
    titleItalic: "Alentejo cooking",
    intro:
      "The produce of the Alentejo seen afresh, convent sweets, and a careful choice of wines from the house's large cellar.",
    menuTitle: "From the menu",
    courses: [
      { name: "To start", dishes: ["Chef's croquettes", "Board of regional cured sausages", "Cheeses"] },
      { name: "Mains", dishes: ["Tomato soup", "Bacalhau à Ermita (salt cod)", "Pork cheeks with sautéed asparagus migas"] },
      { name: "To finish", dishes: ["Chocolate marquise", "Convent sweets"] },
    ],
    menuNote: "Some of the dishes that stand out on the menu.",
    imageAlt: "Wine cellar and laid tables beside tile panels, with afternoon light coming through the window",
    people: [
      {
        role: "The chef",
        name: "Luciano Soares",
        initials: "LS",
        text: "He began his training in Brazil and specialised in international cuisine in Vigo. In the Alentejo, he brings the region's ingredients new life with contemporary techniques.",
      },
      {
        role: "The sommelier",
        name: "Fábio Nico",
        initials: "FN",
        text: "He was already working at O Ermita when, in 2017, he trained with the Wine & Spirit Education Trust. Ask him: there is a wine for every dish.",
      },
    ],
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Inside",
    titleItalic: "the house",
    hint: "Swipe to see more",
    photos: [
      { image: "salaFresco", caption: "The painted vault", alt: "The restaurant's dining room under the painted vault, with laid tables and a stone floor" },
      { image: "vault", caption: "The dining room", alt: "Long room with a vaulted ceiling, laid tables and a black and white chequered floor" },
      { image: "tiles", caption: "The tiles", alt: "Laid tables beside a blue and white tile panel with figure scenes" },
      { image: "vaultTall", caption: "Light under the arches", alt: "The vaulted room seen head-on, with warm light along the arches and the service table" },
      { image: "portal", caption: "The doorway", alt: "Marble doorway with a cross, between two stone basins with tiles" },
      { image: "cellar", caption: "The cellar", alt: "Wine bottles, a lit lamp and tables beside the tiles" },
      { image: "terraco", caption: "The terrace", alt: "Whitewashed terrace with potted olive trees and a stone wall, the hills beyond" },
      { image: "entrance", caption: "The entrance", alt: "The restaurant's entrance in a whitewashed wall, with the O Ermita sign and two lanterns" },
    ],
  },
  visit: {
    eyebrow: "Visit",
    title: "In the Serra d'Ossa,",
    titleItalic: "between Estremoz and Redondo",
    intro: "O Ermita is inside the Hotel Convento de São Paulo, in Aldeia da Serra.",
    addressLabel: "Address",
    hoursLabel: "Opening hours",
    everyDay: "Every day",
    lunch: "Lunch",
    dinner: "Dinner",
    bookingNote: "Booking is recommended.",
    phoneLabel: "Phone",
    phoneNote: "Call to a Portuguese landline",
    whatsappLabel: "WhatsApp",
    whatsappNote: "Bookings by message · Portuguese mobile number",
    accessLabel: "Accessibility",
    access: "Wheelchair-accessible parking, seating and toilet.",
    directions: "Directions",
    mapButton: "Show map",
    mapNote: "The Google map only loads when you press the button.",
    mapTitle: "Map: O Ermita, Hotel Convento de São Paulo",
    entranceAlt: "The restaurant's entrance in a whitewashed wall, with the O Ermita sign",
  },
  booking: {
    eyebrow: "Bookings",
    title: "Book your table",
    text: "On WhatsApp or by phone. Lunch and dinner, every day.",
    whatsapp: "Book on WhatsApp",
    call: "Call",
  },
  footer: {
    tagline: "The restaurant of the Hotel Convento de São Paulo, in the Serra d'Ossa.",
    hotel: "Hotel Convento de São Paulo",
    complaints: "Complaints book",
    credit: "Website by Steevanz",
    rights: "All rights reserved.",
    contacts: "Contacts",
    hours: "Opening hours",
  },
  notFound: {
    title: "This page doesn't exist",
    text: "The link may be wrong, or the page has moved.",
    back: "Back to the start",
  },
};

export const ermitaCopy: Record<ErmitaLocale, ErmitaCopy> = { pt, en };
