// Platibanda — a FICTIONAL real-estate agency in Tavira (Algarve), invented by Steevanz (owner, 2026-10-24) as a
// showcase site for selling websites to real-estate agencies, holiday-rental agencies and property managers. Nothing
// here describes a real business: the name, the logo, the team, the address, the hours, the properties and their
// prices are made up for the demo. The contacts are deliberately unusable placeholders (no real person answers them).
// No ratings, no reviews, no customer numbers, no legal identifiers: the AMI licence is an obvious placeholder.
// Media: free stock from Pexels (Pexels License), see public/media/clients/platibanda/LICENCAS.txt. The photos
// illustrate the fictional listings; they are not pictures of the buildings described.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/platibanda";

export const platibanda = {
  name: "Platibanda",
  fullName: "Platibanda · Casas do Sotavento",
  /** A made-up address in Tavira (the street does not exist; 8800-000 is not a real postal code). */
  street: "Rua da Platibanda, 12",
  postalCode: "8800-000",
  locality: "Tavira",
  /** The licence every real agency in Portugal must show. Never invented: a placeholder the client fills in. */
  ami: "AMI: (número da licença)",
  /** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's calls. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappDisplay: "+351 900 000 000",
  whatsappNumber: "351900000000",
  email: "ola@platibanda.example",
  /** Directions: the town (the street is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Tavira%2C+Portugal",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Tavira%2C+Portugal",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Opening hours (fictional). */
  hours: [
    { days: "Segunda a sexta", opens: "09:30", closes: "19:00" },
    { days: "Sábado", opens: "10:00", closes: "13:00" },
  ],
  closed: "Domingo",
  media: {
    favicon: `${media}/favicon.ico`,
    icon192: `${media}/icon-192.png`,
    icon512: `${media}/icon-512.png`,
    appleIcon: `${media}/apple-icon.png`,
    logo: `${media}/logo.svg`,
    og: `${media}/og.jpg`,
    hero: `${media}/hero.mp4`,
    heroPortrait: `${media}/hero-retrato.mp4`,
    heroPoster: `${media}/hero-poster.webp`,
    heroPortraitPoster: `${media}/hero-retrato-poster.webp`,
    town: `${media}/tavira-alto.mp4`,
    townPoster: `${media}/tavira-alto-poster.webp`,
    pool: `${media}/piscina.mp4`,
    poolPoster: `${media}/piscina-poster.webp`,
  },
} as const;

export type PlatibandaPhotoId =
  | "fachadaPlatibanda"
  | "barraOcreFachada"
  | "barraOcreSala"
  | "barraOcreCozinha"
  | "barraOcreQuarto"
  | "riaVaranda"
  | "riaSala"
  | "riaQuarto"
  | "monteExterior"
  | "monteLareira"
  | "monteCozinha"
  | "monteQuarto"
  | "cabanasPiscina"
  | "cabanasSala"
  | "cabanasQuarto"
  | "olhaoFachada"
  | "olhaoSala"
  | "olhaoQuarto"
  | "santaLuziaExterior"
  | "santaLuziaCozinha"
  | "santaLuziaQuarto"
  | "fusetaExterior"
  | "fusetaTerraco"
  | "fusetaVaranda"
  | "buganviliasExterior"
  | "buganviliasSala"
  | "buganviliasPiscina"
  | "taviraPraca"
  | "taviraPorta"
  | "reflexo";

const photo = (file: string, width: number, height: number) => ({ src: `${media}/${file}.webp`, width, height });

/** The stills (Pexels photos and one frame of a Pexels clip, see LICENCAS.txt) and their real sizes. */
export const platibandaPhotos: Record<PlatibandaPhotoId, { src: string; width: number; height: number }> = {
  fachadaPlatibanda: photo("fachada-platibanda", 1600, 1066),
  barraOcreFachada: photo("barra-ocre-fachada", 1067, 1600),
  barraOcreSala: photo("barra-ocre-sala", 1600, 1068),
  barraOcreCozinha: photo("barra-ocre-cozinha", 1600, 988),
  barraOcreQuarto: photo("barra-ocre-quarto", 1067, 1600),
  riaVaranda: photo("ria-varanda", 1600, 1066),
  riaSala: photo("ria-sala", 1200, 1600),
  riaQuarto: photo("ria-quarto", 1200, 1600),
  monteExterior: photo("monte-exterior", 1067, 1600),
  monteLareira: photo("monte-lareira", 1067, 1600),
  monteCozinha: photo("monte-cozinha", 1600, 1066),
  monteQuarto: photo("monte-quarto", 1200, 1600),
  cabanasPiscina: photo("cabanas-piscina", 1065, 1600),
  cabanasSala: photo("cabanas-sala", 1600, 1200),
  cabanasQuarto: photo("cabanas-quarto", 1096, 1600),
  olhaoFachada: photo("olhao-fachada", 1067, 1600),
  olhaoSala: photo("olhao-sala", 1067, 1600),
  olhaoQuarto: photo("olhao-quarto", 1165, 1600),
  santaLuziaExterior: photo("santa-luzia-exterior", 1600, 1200),
  santaLuziaCozinha: photo("santa-luzia-cozinha", 1067, 1600),
  santaLuziaQuarto: photo("santa-luzia-quarto", 1067, 1600),
  fusetaExterior: photo("fuseta-exterior", 1067, 1600),
  fusetaTerraco: photo("fuseta-terraco", 1067, 1600),
  fusetaVaranda: photo("fuseta-varanda", 1600, 1067),
  buganviliasExterior: photo("buganvilias-exterior", 1200, 1600),
  buganviliasSala: photo("buganvilias-sala", 1200, 1600),
  buganviliasPiscina: photo("buganvilias-piscina", 1067, 1897),
  taviraPraca: photo("tavira-praca", 1280, 1600),
  taviraPorta: photo("tavira-porta", 1200, 1600),
  reflexo: photo("reflexo", 1072, 1600),
};

/** The WhatsApp link, with an optional message already written. */
export function platibandaWhatsappHref(text?: string): string {
  const base = `https://wa.me/${platibanda.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** «485 000 €» — a plain amount, the way property prices are written in Portugal. */
export function platibandaEuros(euros: number): string {
  const digits = String(Math.round(euros)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${digits} €`;
}
