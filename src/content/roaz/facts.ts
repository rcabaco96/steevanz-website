// Roaz — a FICTIONAL boat-trip and sea-activities operator in Ferragudo (Algarve), invented by Steevanz (owner,
// 2026-10-24) as a showcase site for selling websites to boat-trip operators and activity companies. Nothing here
// describes a real business: the name, the logo, the boat, the skipper, the meeting point, the hours, the trips and
// their prices are made up for the demo. The places along the coast (Ferragudo, Carvoeiro, Algar Seco, Alfanzina,
// Benagil, Marinha) are real. The contacts are deliberately unusable placeholders (a number range given to no one).
// No ratings, no reviews, no numbers of guests, no licence numbers (only «(n.º RNAAT)»-style placeholders).
// Media: Pixabay (Pixabay Content License), see public/media/clients/roaz/LICENCAS.txt.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/roaz";

export const roaz = {
  name: "Roaz",
  fullName: "Roaz · Passeios de mar",
  /** A made-up meeting point by the real pier of Ferragudo (the kiosk does not exist). */
  meetingPoint: "Quiosque Roaz, cais de Ferragudo",
  street: "Largo do Cais, quiosque 3",
  postalCode: "8400-000",
  locality: "Ferragudo",
  region: "Lagoa · Algarve",
  /** Ferragudo, at the mouth of the Arade (real coordinates of the village, rounded). */
  coordinates: "37°07′N · 8°31′W",
  /** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's calls. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappDisplay: "+351 900 000 000",
  whatsappNumber: "351900000000",
  email: "ola@roaz.example",
  /** Directions: the village's pier (the kiosk is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Cais+de+Ferragudo%2C+Ferragudo",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Ferragudo%2C+Algarve",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** The kiosk on the pier (fictional hours). */
  hours: [
    { days: "Abril a outubro", time: "Todos os dias, 09:00–19:00" },
    { days: "Novembro a março", time: "Conforme o mar, por marcação" },
  ],
  /** Seats on the boat (fictional), the most the booking demo lets one request take. */
  seats: 12,
  media: {
    logo: `${media}/logo.svg`,
    favicon: `${media}/favicon.ico`,
    icon192: `${media}/icon-192.png`,
    icon512: `${media}/icon-512.png`,
    appleIcon: `${media}/apple-icon.png`,
    og: `${media}/og.jpg`,
    hero: `${media}/hero.mp4`,
    heroPortrait: `${media}/hero-retrato.mp4`,
    heroPoster: `${media}/hero-poster.webp`,
    heroPortraitPoster: `${media}/hero-retrato-poster.webp`,
    grutasVideo: `${media}/grutas.mp4`,
    golfinhosVideo: `${media}/golfinhos.mp4`,
    porDoSolVideo: `${media}/por-do-sol.mp4`,
    kayakVideo: `${media}/kayak.mp4`,
  },
} as const;

export type RoazPhotoId =
  | "grutas"
  | "golfinhos"
  | "porDoSol"
  | "kayak"
  | "esteira"
  | "benagilInterior"
  | "algar"
  | "marinha"
  | "ferragudo"
  | "castelo"
  | "carvoeiro"
  | "praia"
  | "rochedos"
  | "aldeia"
  | "farol"
  | "falesias"
  | "sup";

const wide = { width: 1600, height: 900 };
const photo = { width: 1280, height: 853 };
const photo43 = { width: 1280, height: 960 };

/** The stills (photos and frames of the Pixabay clips, see LICENCAS.txt) and their real sizes. */
export const roazPhotos: Record<RoazPhotoId, { src: string; width: number; height: number }> = {
  grutas: { src: `${media}/grutas.webp`, ...wide },
  golfinhos: { src: `${media}/golfinhos.webp`, ...wide },
  porDoSol: { src: `${media}/por-do-sol.webp`, ...wide },
  kayak: { src: `${media}/kayak.webp`, ...wide },
  esteira: { src: `${media}/esteira.webp`, width: 1600, height: 898 },
  benagilInterior: { src: `${media}/benagil-interior.webp`, width: 1280, height: 730 },
  algar: { src: `${media}/algar.webp`, ...photo },
  marinha: { src: `${media}/marinha.webp`, ...photo43 },
  ferragudo: { src: `${media}/ferragudo.webp`, ...photo43 },
  castelo: { src: `${media}/castelo.webp`, width: 1280, height: 720 },
  carvoeiro: { src: `${media}/carvoeiro.webp`, ...photo },
  praia: { src: `${media}/praia.webp`, ...photo },
  rochedos: { src: `${media}/rochedos.webp`, ...photo43 },
  aldeia: { src: `${media}/aldeia.webp`, ...photo },
  farol: { src: `${media}/farol.webp`, ...wide },
  falesias: { src: `${media}/falesias.webp`, ...wide },
  sup: { src: `${media}/sup.webp`, ...wide },
};

/** The WhatsApp link, with an optional message already written. */
export function roazWhatsappHref(text?: string): string {
  const base = `https://wa.me/${roaz.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** «35 €» — prices are always without VAT (owner's absolute rule); the «+ IVA» is shown next to them. */
export function roazPrice(euros: number): string {
  return `${euros.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
}

/** «45 min», «1 h 30» */
export function roazDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
