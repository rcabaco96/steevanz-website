// Risca — a FICTIONAL hair salon in Porto, invented by Steevanz (owner, 2026-10-24) as a showcase site for selling
// websites to hair salons. Nothing here describes a real business: the name, the logo, the team, the address, the
// hours, the services and their prices are made up for the demo. The contacts are deliberately unusable placeholders
// (no real person answers them). No ratings, no reviews, no customer numbers, no legal ids.
// Media: free stock video from Mixkit (Mixkit Stock Video Free License), see public/media/clients/risca/LICENCAS.txt.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/risca";

export const risca = {
  name: "Risca",
  fullName: "Risca · Cabeleireiro e barbearia",
  /** A made-up address in a real Porto neighbourhood (the street does not exist). */
  street: "Rua da Risca, 21",
  neighbourhood: "Cedofeita",
  postalCode: "4050-000",
  locality: "Porto",
  /** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's calls. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappDisplay: "+351 900 000 000",
  whatsappNumber: "351900000000",
  email: "ola@risca.example",
  /** Directions: the neighbourhood (the street is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Cedofeita%2C+Porto",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Cedofeita%2C+Porto",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Opening hours (fictional). Closed on Sunday and Monday. */
  hours: [
    { days: "Terça a sexta", opens: "10:00", closes: "20:00" },
    { days: "Sábado", opens: "09:00", closes: "18:00" },
  ],
  closed: "Domingo e segunda",
  /** Barbershop without an appointment (the walk-in queue), fictional. */
  walkIn: "Terça a sábado, durante todo o horário",
  /** Weekday numbers (0 = Sunday) and their hours, for the booking demo. */
  openingByWeekday: {
    2: ["10:00", "20:00"],
    3: ["10:00", "20:00"],
    4: ["10:00", "20:00"],
    5: ["10:00", "20:00"],
    6: ["09:00", "18:00"],
  } as Record<number, [string, string]>,
  media: {
    wordmark: `${media}/logo.svg`,
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
    movement: `${media}/movimento.mp4`,
    movementPoster: `${media}/movimento-poster.webp`,
    barbershop: `${media}/barbearia.mp4`,
    barbershopPoster: `${media}/barbearia-poster.webp`,
  },
} as const;

export type RiscaPhotoId =
  | "corte"
  | "cor"
  | "corPincel"
  | "lavagem"
  | "noiva"
  | "noivaFlores"
  | "homem"
  | "tesoura"
  | "ferramentas"
  | "vento"
  | "comprido"
  | "caracois"
  | "caracois2"
  | "apanhado"
  | "ondas"
  | "brushing"
  | "estudio"
  | "pente"
  | "olhar"
  | "navalha"
  | "maquina"
  | "nuca";

const wide = { width: 1280, height: 720 };

/** The stills (frames of the Mixkit clips, see LICENCAS.txt) and their real sizes. */
export const riscaPhotos: Record<RiscaPhotoId, { src: string; width: number; height: number }> = {
  corte: { src: `${media}/corte.webp`, ...wide },
  cor: { src: `${media}/cor.webp`, ...wide },
  corPincel: { src: `${media}/cor-pincel.webp`, ...wide },
  lavagem: { src: `${media}/lavagem.webp`, ...wide },
  noiva: { src: `${media}/noiva.webp`, ...wide },
  noivaFlores: { src: `${media}/noiva-flores.webp`, width: 720, height: 1280 },
  homem: { src: `${media}/homem.webp`, ...wide },
  tesoura: { src: `${media}/tesoura.webp`, ...wide },
  ferramentas: { src: `${media}/ferramentas.webp`, ...wide },
  vento: { src: `${media}/vento.webp`, ...wide },
  comprido: { src: `${media}/comprido.webp`, ...wide },
  caracois: { src: `${media}/caracois.webp`, ...wide },
  caracois2: { src: `${media}/caracois-2.webp`, ...wide },
  apanhado: { src: `${media}/apanhado.webp`, ...wide },
  ondas: { src: `${media}/ondas.webp`, ...wide },
  brushing: { src: `${media}/brushing.webp`, ...wide },
  estudio: { src: `${media}/estudio.webp`, ...wide },
  pente: { src: `${media}/pente.webp`, ...wide },
  olhar: { src: `${media}/olhar.webp`, ...wide },
  navalha: { src: `${media}/navalha.webp`, ...wide },
  maquina: { src: `${media}/maquina.webp`, ...wide },
  nuca: { src: `${media}/nuca.webp`, width: 720, height: 1280 },
};

/** The WhatsApp link, with an optional message already written. */
export function riscaWhatsappHref(text?: string): string {
  const base = `https://wa.me/${risca.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** «32 €» — prices are always without VAT (owner's absolute rule); the «+ IVA» is shown next to them. */
export function riscaPrice(euros: number): string {
  return `${euros.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
}

/** «45 min», «1 h 30» */
export function riscaDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
