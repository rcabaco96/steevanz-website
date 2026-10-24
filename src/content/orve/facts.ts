// Orvé — a FICTIONAL beauty and aesthetics atelier, invented by Steevanz (owner, 2026-10-23) as a showcase site for
// selling websites to beauty businesses. Nothing here describes a real business: the name, the logo, the team, the
// address, the hours, the treatments and their prices are made up for the demo. The phone and WhatsApp are
// Steevanz's own (owner, 2026-10-24: a prospect trying the demo reaches Steevanz, and the booking message says it is
// a test of the demo site); same numbers as src/lib/site.ts (a unit test keeps them equal). No ratings, no reviews,
// no customer numbers, no legal ids.
// Media: free stock video from Mixkit (Mixkit Stock Video Free License), see public/media/clients/orve/LICENCAS.txt.
// Kept free of imports so the unit tests can load it directly.

import type { OrveLocale } from "./routes";

const media = "/media/clients/orve";

export const orve = {
  name: "Orvé",
  fullName: "Orvé · Atelier de pele e beleza",
  /** A made-up address in a real Lisbon neighbourhood (the street does not exist). */
  street: "Rua do Orvalho, 7",
  neighbourhood: "Príncipe Real",
  postalCode: "1250-000",
  locality: "Lisboa",
  /** Steevanz's phone and WhatsApp (the demo is live for prospects). National format in Portuguese, +351 elsewhere. */
  phoneDisplay: "961 292 679",
  phoneDisplayIntl: "+351 961 292 679",
  phoneHref: "tel:+351961292679",
  whatsappNumber: "351961292679",
  /** Directions: the neighbourhood (the street is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Pr%C3%ADncipe+Real%2C+Lisboa",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Pr%C3%ADncipe+Real%2C+Lisboa",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Opening hours (fictional); each language's copy names the days (visit.hoursDays). Closed Sunday and Monday. */
  hours: [
    { opens: "10:00", closes: "20:00" },
    { opens: "09:30", closes: "18:00" },
  ],
  /** Weekday numbers (0 = Sunday) and their hours, for the booking demo. */
  openingByWeekday: {
    2: ["10:00", "20:00"],
    3: ["10:00", "20:00"],
    4: ["10:00", "20:00"],
    5: ["10:00", "20:00"],
    6: ["09:30", "18:00"],
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
    vapor: `${media}/vapor.mp4`,
    vaporPoster: `${media}/vapor-poster.webp`,
  },
} as const;

export type OrvePhotoId =
  | "rosto"
  | "corpo"
  | "maos"
  | "olhar"
  | "pele"
  | "maquilhagem"
  | "espaco"
  | "led"
  | "altaFrequencia"
  | "hidratacao"
  | "mascara"
  | "costas"
  | "maosMassagem"
  | "lifting"
  | "esfera"
  | "limpeza";

const wide = { width: 1600, height: 900 };
const wide720 = { width: 1280, height: 720 };

/** The stills (frames of the Mixkit clips, see LICENCAS.txt) and their real sizes. */
export const orvePhotos: Record<OrvePhotoId, { src: string; width: number; height: number }> = {
  rosto: { src: `${media}/rosto.webp`, ...wide },
  corpo: { src: `${media}/corpo.webp`, ...wide720 },
  maos: { src: `${media}/maos.webp`, ...wide720 },
  olhar: { src: `${media}/olhar.webp`, ...wide },
  pele: { src: `${media}/pele.webp`, ...wide },
  maquilhagem: { src: `${media}/maquilhagem.webp`, width: 1000, height: 1778 },
  espaco: { src: `${media}/espaco.webp`, ...wide },
  led: { src: `${media}/led.webp`, ...wide },
  altaFrequencia: { src: `${media}/alta-frequencia.webp`, ...wide },
  hidratacao: { src: `${media}/hidratacao.webp`, ...wide },
  mascara: { src: `${media}/mascara.webp`, ...wide },
  costas: { src: `${media}/costas.webp`, ...wide720 },
  maosMassagem: { src: `${media}/maos-massagem.webp`, ...wide720 },
  lifting: { src: `${media}/lifting.webp`, ...wide },
  esfera: { src: `${media}/esfera.webp`, ...wide },
  limpeza: { src: `${media}/limpeza.webp`, ...wide },
};

/** The WhatsApp link, with an optional message already written. */
export function orveWhatsappHref(text?: string): string {
  const base = `https://wa.me/${orve.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** The phone as shown on the page: national format in Portuguese, with +351 in the other languages. */
export function orvePhoneDisplay(locale: OrveLocale): string {
  return locale === "pt" ? orve.phoneDisplay : orve.phoneDisplayIntl;
}

/** «48 €» («€48» in English) — prices are always without VAT (owner's absolute rule); «+ IVA» is shown beside them. */
export function orvePrice(euros: number, locale: OrveLocale = "pt"): string {
  const amount = euros.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return locale === "en" ? `€${amount}` : `${amount} €`;
}

/** «45 min», «1 h 30»; English and German keep minutes («75 min», «75 Min.»), as their price lists usually do. */
export function orveDuration(minutes: number, locale: OrveLocale = "pt"): string {
  if (locale === "de") return `${minutes} Min.`;
  if (minutes < 60 || locale === "en") return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
