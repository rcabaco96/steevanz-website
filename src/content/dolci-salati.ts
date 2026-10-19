// Dolci e Salati's landing page (/dolci-salati, /dolci-salati/en). Every word, link and picture comes from
// the client's own site (dolci-e-salati-website.vercel.app, 2026-10-15) and its Instagram reels: no
// invented facts, numbers or reviews. The quotes are the verbatim excerpts that site shows, with their
// sources. Opening hours and phone are not published there, so the page sends visitors to Instagram.

export type DolciLocale = "pt" | "en";

const media = "/media/clients/dolci-salati";

export const dolci = {
  name: "Dolci e Salati",
  logo: "/media/clients/dolci-e-salati-logo.png",
  cup: `${media}/gelato-cup.webp`,
  terrace: `${media}/esplanada.jpg`,
  interior: `${media}/interior.jpg`,
  instagram: "https://www.instagram.com/dolciesalati.ap/",
  instagramHandle: "@dolciesalati.ap",
  menu: "/menu/dolci-salati",
  address: ["Av. do Rio 3", "8365-102 Armação de Pêra"],
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Dolci%20e%20Salati%2C%20Av.%20do%20Rio%203%2C%20Arma%C3%A7%C3%A3o%20de%20P%C3%AAra%2C%20Portugal",
  maps: "https://www.google.com/maps/place/Dolci+e+Salati,+Avenida+do+Rio,+Arma%C3%A7%C3%A3o+de+P%C3%AAra/@37.1027164,-8.356288,17z/data=!4m5!3m4!1s0xd1ad1efa6d9ef33:0x91014b55be9f002!8m2!3d37.1027164!4d-8.356288?entry=ttu",
  googleReviews: "https://www.google.com/maps?cid=653044715132416002",
} as const;

/** Flavours named on the client's site and reels: they tint the hero's moving background. */
export const flavours = [
  { id: "morango", pt: "Morango", en: "Strawberry", colors: ["#f7c6d3", "#ef6f94", "#c8325f"] },
  { id: "pistacio", pt: "Pistácio", en: "Pistachio", colors: ["#e7efcf", "#b5ca91", "#6f8f3e"] },
  { id: "menta", pt: "Menta", en: "Mint", colors: ["#dcf3ea", "#93d6bd", "#3d9c7c"] },
  { id: "frutos", pt: "Frutos do bosque", en: "Forest fruits", colors: ["#efd2e4", "#b65a8f", "#6d2352"] },
] as const;

export type Flavour = (typeof flavours)[number];

/** The client's Instagram reels, with the names and lines its video menu gives them. */
export const reels = [
  { id: "DNF6fL8uN2r", kind: { pt: "Gelados", en: "Gelato" }, title: { pt: "Gelado de pistácio", en: "Pistachio gelato" }, text: { pt: "Por trás das câmaras, o nosso gelado artesanal.", en: "Behind the scenes with our handmade gelato." }, alt: { pt: "Tabuleiro de gelado de pistácio decorado com pistácios.", en: "A tray of pistachio gelato topped with pistachios." } },
  { id: "CvCeJOzoWuC", kind: { pt: "Gelados", en: "Gelato" }, title: { pt: "Sabores à escolha", en: "Find your flavour" }, text: { pt: "Menta, pistácio e frutos do bosque, em movimento.", en: "Mint, pistachio and forest fruits, in motion." }, alt: { pt: "Cones de gelado de menta, pistácio e frutos do bosque.", en: "Mint, pistachio and forest fruit gelato cones." } },
  { id: "CwJIfVcoTpA", kind: { pt: "Doces", en: "Sweet treats" }, title: { pt: "Cheesecake de morango", en: "Strawberry cheesecake" }, text: { pt: "O lado doce de uma pausa à mesa.", en: "The sweet side of a moment at the table." }, alt: { pt: "Cheesecake coberto com morango, servido num prato.", en: "A strawberry-topped cheesecake on a plate." } },
  { id: "DM-lbCEOei_", kind: { pt: "Bebidas", en: "Drinks" }, title: { pt: "Batido de framboesa", en: "Raspberry milkshake" }, text: { pt: "Vê o nosso batido de framboesa ganhar forma.", en: "Watch our raspberry milkshake come together." }, alt: { pt: "Preparação de um batido de framboesa no balcão de gelados.", en: "A raspberry milkshake being made at the gelato counter." } },
  { id: "DMYAiwcoUIy", kind: { pt: "À mesa", en: "At the table" }, title: { pt: "Hambúrguer da casa", en: "House burger" }, text: { pt: "Uma pausa salgada, servida à mesa.", en: "A savoury pause, served at the table." }, alt: { pt: "Hambúrguer com queijo e alface numa tábua, acompanhado por batatas.", en: "A burger with cheese and lettuce on a board, with fries." } },
  { id: "DMSk-0-IlQE", kind: { pt: "Gelados", en: "Gelato" }, title: { pt: "Gelado no cone", en: "Gelato cone" }, text: { pt: "Uma colher, um cone e o teu sabor favorito.", en: "A scoop, a cone and your favourite flavour." }, alt: { pt: "Uma bola de gelado num cone, diante da vitrine de gelados.", en: "A scoop of gelato in a cone in front of the gelato display." } },
  { id: "DNtBG5sUCOr", kind: { pt: "Bebidas", en: "Drinks" }, title: { pt: "Sumo de laranja", en: "Orange juice" }, text: { pt: "Uma pausa fresca, com sabor a laranja.", en: "A refreshing pause with a taste of orange." }, alt: { pt: "Copo de sumo de laranja com uma rodela de laranja, diante de uma parede verde.", en: "A glass of orange juice with an orange slice against a leafy green wall." } },
  { id: "DMdyAaOILFK", kind: { pt: "Gelados", en: "Gelato" }, title: { pt: "Sabores da vitrine", en: "Flavours on display" }, text: { pt: "Um passeio pelos sabores do Dolci e Salati.", en: "A look at the flavours of Dolci e Salati." }, alt: { pt: "Vitrine com vários tabuleiros de gelados coloridos.", en: "A display with many trays of colourful gelato." } },
  { id: "DMSlccII1RE", kind: { pt: "Gelados", en: "Gelato" }, title: { pt: "Gelados artesanais", en: "Artisan gelato" }, text: { pt: "Para quem gosta de descobrir mais um sabor.", en: "For those who love finding one more flavour." }, alt: { pt: "Pormenor dos gelados artesanais na vitrine.", en: "A close look at the artisan gelato on display." } },
] as const;

export type Reel = (typeof reels)[number];

export const reelImage = (id: string) => `${media}/reels/${id}.jpg`;
export const reelLink = (id: string) => `https://www.instagram.com/dolciesalati.ap/reel/${id}/`;

/** Verbatim excerpts shown on the client's site (Tripadvisor), in the language they were written in. */
export const quotes = [
  { quote: "Um local lindo e instagramável, com uns gelados e crepes fantásticos", author: "Laura", date: "2025-08-20", source: "Tripadvisor", href: "https://www.tripadvisor.pt/ShowUserReviews-g189113-d26587776-r1025601097-Dolci_e_Salati-Armacao_de_Pera_Faro_District_Algarve.html" },
  { quote: "Sanduíches e café muito bons por um preço incrível.", author: "Marina S", date: "2025-08-26", source: "Tripadvisor", href: "https://www.tripadvisor.pt/ShowUserReviews-g189113-d26587776-r1026820823-Dolci_e_Salati-Armacao_de_Pera_Faro_District_Algarve.html" },
  { quote: "Atendimento muito bom", author: "Ana f", date: "2026-07-11", source: "Tripadvisor", href: "https://www.tripadvisor.pt/ShowUserReviews-g189113-d26587776-r1067925483-Dolci_e_Salati-Armacao_de_Pera_Faro_District_Algarve.html" },
] as const;

const pt = {
  htmlLang: "pt-PT",
  title: "Dolci e Salati — Café e gelataria em Armação de Pêra",
  description: "Gelados artesanais, crepes, bolos, café e salgados na Avenida do Rio, em Armação de Pêra. Entre o doce e o salgado, há sempre uma boa pausa.",
  skip: "Saltar para o conteúdo",
  langSwitch: { label: "English", short: "EN", href: "/dolci-salati/en" },
  place: "Armação de Pêra",
  header: { menu: "Ver o menu", instagram: "Instagram do Dolci e Salati" },
  hero: {
    eyebrow: "Café · Gelataria · Pastelaria",
    location: "Armação de Pêra, Algarve",
    tagline: "Entre o doce e o salgado, há sempre uma boa pausa.",
    note: "Um bocadinho de dolce vita.",
    menu: "Ver o menu",
    menuHint: "Menu digital em vídeo",
    directions: "Como chegar",
    ring: "Gelados artesanais · Armação de Pêra · Est. 2023 · ",
    flavourLabel: "O teu gelado. Toca num sabor.",
    cupAlt: "Copo de gelado Dolci e Salati com gelado de morango",
  },
  marquee: ["Gelados", "Crepes", "Waffles", "Bolos", "Café", "Tostas", "Sanduíches", "Batidos"],
  intro: {
    label: "01 / A nossa pausa",
    lines: "Há dias que pedem um café. Outros, mais uma colher de gelado.",
    emphasis: "O melhor é não ter de escolher.",
    text: "Em Armação de Pêra, o Dolci e Salati é um convite a parar. Para um café, um gelado ou qualquer coisa entre o doce e o salgado. Entra. A pausa é tua.",
  },
  dual: {
    label: "02 / Dois lados. A mesma pausa.",
    question: "Hoje apetece-te…",
    sweet: { tab: "Algo doce", word: "dolci", title: "A vida à colher.", text: "Gelados, crepes e bolos. Para os dias em que uma pausa pede um lado mais doce.", tags: ["Gelados", "Crepes", "Bolos"] },
    savory: { tab: "Algo salgado", word: "salati", title: "Uma pausa à mesa.", text: "Sanduíches e tostas, com espaço para um café. Para quando a vontade é de ficar à mesa.", tags: ["Sanduíches", "Tostas", "Café"] },
    note: "A seleção pode variar. Descobre as opções do dia no café.",
  },
  products: {
    label: "03 / Pequenos prazeres",
    title: "Cada pausa, o seu sabor.",
    intro: "Uma colher, uma chávena, uma conversa. Escolhe por onde começar.",
    watch: "Ver no Instagram",
    swipe: "Desliza para ver mais",
    prev: "Reels anteriores",
    next: "Mais reels",
  },
  menuBand: {
    label: "A carta, ao teu ritmo",
    title: "A vontade muda. A escolha é tua.",
    text: "Gelados, crepes, café e salgados. Descobre os nossos sabores em movimento.",
    cta: "Ver o menu",
  },
  placeSection: {
    label: "04 / O nosso lugar",
    title: "Dentro. Ou lá fora.",
    text: "A esplanada na Avenida do Rio. Lá dentro, luz, plantas e mesas para uma pausa entre o doce e o salgado.",
    terrace: "01 / A esplanada",
    terraceAlt: "Esplanada Dolci e Salati com guarda-sóis, mesas ocupadas e o letreiro na fachada",
    inside: "02 / Lá dentro",
    insideAlt: "Interior Dolci e Salati com balcão de madeira, plantas e candeeiros suspensos",
  },
  reviews: {
    label: "Avaliações reais · excertos",
    title: "Opiniões dos clientes.",
    source: "Ver na fonte",
    google: "Ler avaliações no Google Maps",
    original: "",
  },
  brunch: {
    label: "Um novo capítulo · 2027",
    ring: "Um novo capítulo à mesa · 2027 · ",
    name: "Brunch",
    status: "Previsto para 2027",
    title: "As manhãs vão pedir mais tempo.",
    text: "Data de estreia e carta a anunciar.",
    cta: "Acompanhar a estreia",
  },
  visit: {
    label: "05 / Vem até cá",
    title: "A próxima pausa é aqui.",
    addressLabel: "Encontra-nos",
    hoursLabel: "Antes de vires",
    hours: "Confirma o horário no Instagram antes da tua visita.",
    hoursCta: "Consultar o Instagram",
    directions: "Como chegar",
    maps: "Abrir no Google Maps",
    socialLabel: "Fica por perto",
    socialText: "Novidades, sabores e reels, no Instagram.",
    follow: "Seguir no Instagram",
  },
  footer: {
    line: "Até à próxima colher.",
    rights: "Todos os direitos reservados.",
    madeBy: "Feito por Steevanz",
    top: "Voltar ao início",
  },
  floatingMenu: "Ver o menu",
  newTab: "abre numa nova janela",
};

const en: typeof pt = {
  htmlLang: "en",
  title: "Dolci e Salati — Café & gelato in Armação de Pêra",
  description: "Artisan gelato, crepes, cakes, coffee and savoury bites on Avenida do Rio, Armação de Pêra. Between sweet and savoury, there’s always time for a pause.",
  skip: "Skip to content",
  langSwitch: { label: "Português", short: "PT", href: "/dolci-salati" },
  place: "Armação de Pêra",
  header: { menu: "See the menu", instagram: "Dolci e Salati on Instagram" },
  hero: {
    eyebrow: "Café · Gelato · Pastries",
    location: "Armação de Pêra, Algarve",
    tagline: "Between sweet and savoury, there’s always time for a pause.",
    note: "A little taste of dolce vita.",
    menu: "See the menu",
    menuHint: "Digital video menu",
    directions: "Get directions",
    ring: "Artisan gelato · Armação de Pêra · Est. 2023 · ",
    flavourLabel: "Your gelato. Tap a flavour.",
    cupAlt: "Dolci e Salati gelato cup with strawberry gelato",
  },
  marquee: ["Gelato", "Crepes", "Waffles", "Cakes", "Coffee", "Toasties", "Sandwiches", "Milkshakes"],
  intro: {
    label: "01 / A little pause",
    lines: "Some days call for coffee. Others, one more spoonful of gelato.",
    emphasis: "The lovely part? You can have both.",
    text: "In Armação de Pêra, Dolci e Salati is an invitation to stop for a moment. For a coffee, a gelato, or something sweet or savoury. Come in. Make the moment yours.",
  },
  dual: {
    label: "02 / Two sides. One little pause.",
    question: "In the mood for…",
    sweet: { tab: "Something sweet", word: "dolci", title: "Life by the spoonful.", text: "Gelato, crepes and cakes. For the days when your pause calls for something sweet.", tags: ["Gelato", "Crepes", "Cakes"] },
    savory: { tab: "Something savoury", word: "salati", title: "A moment at the table.", text: "Sandwiches and toasties, with room for a coffee. For when you feel like staying a little longer.", tags: ["Sandwiches", "Toasties", "Coffee"] },
    note: "The selection may vary. Ask in the café about today’s options.",
  },
  products: {
    label: "03 / Little pleasures",
    title: "Every pause, its own flavour.",
    intro: "A spoonful, a cup, a conversation. Choose where to begin.",
    watch: "Watch on Instagram",
    swipe: "Swipe to see more",
    prev: "Previous reels",
    next: "More reels",
  },
  menuBand: {
    label: "The menu, at your own pace",
    title: "Your mood changes. The choice is yours.",
    text: "Gelato, crepes, coffee and savoury bites. Discover our flavours in motion.",
    cta: "See the menu",
  },
  placeSection: {
    label: "04 / Our little place",
    title: "Inside. Or out.",
    text: "The terrace on Avenida do Rio. Inside, light, plants and tables for a pause between sweet and savoury.",
    terrace: "01 / The terrace",
    terraceAlt: "Dolci e Salati terrace with parasols, occupied tables and the sign on the facade",
    inside: "02 / Inside",
    insideAlt: "Dolci e Salati interior with a wood counter, plants and pendant lights",
  },
  reviews: {
    label: "Real reviews · excerpts",
    title: "What guests say.",
    source: "See the source",
    google: "Read reviews on Google Maps",
    original: "Original review in Portuguese",
  },
  brunch: {
    label: "A new chapter · 2027",
    ring: "A new chapter at the table · 2027 · ",
    name: "Brunch",
    status: "Planned for 2027",
    title: "Mornings will ask you to stay.",
    text: "Opening date and menu to be announced.",
    cta: "Follow the launch",
  },
  visit: {
    label: "05 / Come find us",
    title: "Your next pause starts here.",
    addressLabel: "Find us",
    hoursLabel: "Before you visit",
    hours: "Check our opening hours on Instagram before visiting.",
    hoursCta: "Open Instagram",
    directions: "Get directions",
    maps: "Open in Google Maps",
    socialLabel: "Stay close",
    socialText: "News, flavours and reels, on Instagram.",
    follow: "Follow on Instagram",
  },
  footer: {
    line: "Until the next spoonful.",
    rights: "All rights reserved.",
    madeBy: "Made by Steevanz",
    top: "Back to the top",
  },
  floatingMenu: "See the menu",
  newTab: "opens in a new window",
};

export const dolciCopy = { pt, en };
export type DolciCopy = typeof pt;

/** «agosto de 2025» / «August 2025». */
export function quoteDate(iso: string, locale: DolciLocale): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
