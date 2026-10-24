// Ponteiro — a FICTIONAL café, kitchen and bar in Porto, invented by Steevanz (owner, 2026-10-24) as a showcase site
// for selling websites to restaurants, cafés, pastelarias and bars. Nothing here describes a real business: the
// name, the logo, the team, the address, the hours, the dishes and their prices are made up for the demo. The
// contacts are deliberately unusable placeholders (no real person answers them). No ratings, no reviews, no customer
// numbers, no legal ids.
// Media: free stock from Pixabay (Pixabay Content License), see public/media/clients/ponteiro/LICENCAS.txt.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/ponteiro";

export const ponteiro = {name: "Ponteiro",fullName: "Ponteiro · Café, cozinha e bar",/** A made-up address in a real Porto parish (the street does not exist). */street: "Travessa das Horas, 24",neighbourhood: "Bonfim",postalCode: "4300-000",locality: "Porto",/** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's calls. */phoneDisplay: "+351 900 000 000",phoneHref: "tel:+351900000000",
  whatsappDisplay: "+351 900 000 000",
  whatsappNumber: "351900000000",
  email: "ola@ponteiro.example",
  /** Directions: the parish (the street is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Bonfim%2C+Porto",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Bonfim%2C+Porto",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /**
   * The Steevanz demo «Menu digital» shown in the phone and opened by its button (a Steevanz demonstration menu of
   * another fictional business: Ponteiro has no menu of its own in the database).
   */
  menuDemo: "https://www.steevanz.com/menu/marisqueira-do-cais",
  /** Opening hours (fictional). Closed on Monday. */
  hours: [
    { days: "Terça a quinta", opens: "07:30", closes: "00:00" },
    { days: "Sexta e sábado", opens: "07:30", closes: "02:00" },
    { days: "Domingo", opens: "08:30", closes: "16:00" },
  ],
  closed: "Segunda-feira",
  /** Weekday numbers (0 = Sunday) and the meals served, for the reservation request. */
  mealsByWeekday: {
    0: ["almoco"],
    2: ["almoco", "jantar"],
    3: ["almoco", "jantar"],
    4: ["almoco", "jantar"],
    5: ["almoco", "jantar"],
    6: ["almoco", "jantar"],
  } as Record<number, readonly ("almoco" | "jantar")[]>,
  /** The first and last table of each meal (every half hour). */
  mealSlots: {
    almoco: ["12:00", "14:30"],
    jantar: ["19:30", "22:30"],
  } as Record<"almoco" | "jantar", [string, string]>,
  media: {
    mark: `${media}/icon.svg`,
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
    forno: `${media}/forno.mp4`,
    fornoPoster: `${media}/forno-poster.webp`,
    noite: `${media}/noite.mp4`,
    noitePoster: `${media}/noite-poster.webp`,
    balcao: `${media}/balcao.mp4`,
    balcaoPoster: `${media}/balcao-poster.webp`,
    menuPhone: `${media}/menu-telemovel.mp4`,
    menuPhonePoster: `${media}/menu-telemovel-poster.webp`,
  },
} as const;

export type PonteiroPhotoId =
  | "nataTabuleiro"
  | "nataMontra"
  | "nataPires"
  | "nataMacro"
  | "croissants"
  | "croissantPrato"
  | "chocolateQuente"
  | "bras"
  | "polvo"
  | "boloChocolateNatas"
  | "boloChocolate"
  | "boloLaranja"
  | "cocktail"
  | "gin"
  | "neon";

const wide = { width: 1200, height: 800 };

/** The photos (Pixabay, see LICENCAS.txt) and their real sizes. */
export const ponteiroPhotos: Record<PonteiroPhotoId, { src: string; width: number; height: number }> = {
  nataTabuleiro: { src: `${media}/nata-tabuleiro.webp`, width: 1200, height: 900 },
  nataMontra: { src: `${media}/nata-montra.webp`, ...wide },
  nataPires: { src: `${media}/nata-pires.webp`, width: 1200, height: 803 },
  nataMacro: { src: `${media}/nata-macro.webp`, width: 1200, height: 900 },
  croissants: { src: `${media}/croissants.webp`, width: 1200, height: 674 },
  croissantPrato: { src: `${media}/croissant-prato.webp`, width: 801, height: 1200 },
  chocolateQuente: { src: `${media}/chocolate-quente.webp`, width: 1200, height: 799 },
  bras: { src: `${media}/bras.webp`, ...wide },
  polvo: { src: `${media}/polvo.webp`, ...wide },
  boloChocolateNatas: { src: `${media}/bolo-chocolate-natas.webp`, width: 1200, height: 740 },
  boloChocolate: { src: `${media}/bolo-chocolate.webp`, width: 1200, height: 801 },
  boloLaranja: { src: `${media}/bolo-laranja.webp`, ...wide },
  cocktail: { src: `${media}/cocktail.webp`, ...wide },
  gin: { src: `${media}/gin.webp`, ...wide },
  neon: { src: `${media}/neon.webp`, ...wide },
};

/** The WhatsApp link, with an optional message already written. */
export function ponteiroWhatsappHref(text?: string): string {
  const base = `https://wa.me/${ponteiro.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** «1,20 €» — prices are always without VAT (owner's absolute rule); the «+ IVA» is shown next to them. */
export function ponteiroPrice(euros: number): string {
  return `${euros.toLocaleString("pt-PT", { minimumFractionDigits: Number.isInteger(euros) ? 0 : 2, maximumFractionDigits: 2 })} €`;
}

/** Minutes since midnight → «07:30». */
export function ponteiroHhmm(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
