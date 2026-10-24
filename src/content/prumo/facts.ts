// Prumo — a FICTIONAL clinic of physiotherapy, osteopathy and wellness in Coimbra, invented by Steevanz (owner,
// 2026-10-24) as a showcase site for selling websites to clinics, physiotherapy and wellness centres. Nothing here
// describes a real business: the name, the logo, the team, the address, the hours, the services and their prices are
// made up for the demo. The contacts are deliberately unusable placeholders (a number range not given to anyone).
// No ratings, no reviews, no customer numbers, no results, no legal ids (the professional licence numbers and the
// health regulator's registration are shown only as obvious placeholders).
// Media: free stock video from Mixkit (Mixkit Stock Video Free License), see public/media/clients/prumo/LICENCAS.txt.
// Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/prumo";

export const prumo = {
  name: "Prumo",
  fullName: "Prumo · Fisioterapia, osteopatia e bem-estar",
  /** A made-up address in a real Coimbra neighbourhood (the street does not exist). */
  street: "Rua do Fio de Prumo, 12",
  neighbourhood: "Celas",
  postalCode: "3000-000",
  locality: "Coimbra",
  /** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's calls. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappNumber: "351900000000",
  email: "ola@prumo.example",
  /** Directions: the neighbourhood (the street is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Celas%2C+Coimbra",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Celas%2C+Coimbra",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Opening hours (fictional). Closed on Sunday. */
  hours: [
    { days: "Segunda a sexta", opens: "08:00", closes: "20:00" },
    { days: "Sábado", opens: "09:00", closes: "13:00" },
  ],
  closed: "Domingo e feriados",
  /** Weekday numbers (0 = Sunday) and their hours, for the booking demo. */
  openingByWeekday: {
    1: ["08:00", "20:00"],
    2: ["08:00", "20:00"],
    3: ["08:00", "20:00"],
    4: ["08:00", "20:00"],
    5: ["08:00", "20:00"],
    6: ["09:00", "13:00"],
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
    studio: `${media}/estudio-filme.mp4`,
    studioPoster: `${media}/estudio-filme-poster.webp`,
  },
} as const;

export type PrumoPhotoId =
  | "fisioterapia"
  | "osteopatia"
  | "avaliacao"
  | "pilates"
  | "massagem"
  | "massagemCostas"
  | "nutricao"
  | "legumes"
  | "estudio"
  | "ombro"
  | "tratamento"
  | "pescoco"
  | "cervical"
  | "reformer";

const w720 = { width: 1280, height: 720 };

/** The stills (frames of the Mixkit clips, see LICENCAS.txt) and their real sizes. */
export const prumoPhotos: Record<PrumoPhotoId, { src: string; width: number; height: number }> = {
  fisioterapia: { src: `${media}/fisioterapia.webp`, ...w720 },
  osteopatia: { src: `${media}/osteopatia.webp`, ...w720 },
  avaliacao: { src: `${media}/avaliacao.webp`, ...w720 },
  pilates: { src: `${media}/pilates.webp`, ...w720 },
  massagem: { src: `${media}/massagem.webp`, ...w720 },
  massagemCostas: { src: `${media}/massagem-costas.webp`, ...w720 },
  nutricao: { src: `${media}/nutricao.webp`, ...w720 },
  legumes: { src: `${media}/legumes.webp`, ...w720 },
  estudio: { src: `${media}/estudio.webp`, ...w720 },
  ombro: { src: `${media}/ombro.webp`, ...w720 },
  tratamento: { src: `${media}/tratamento.webp`, ...w720 },
  pescoco: { src: `${media}/pescoco.webp`, ...w720 },
  cervical: { src: `${media}/cervical.webp`, ...w720 },
  reformer: { src: `${media}/reformer.webp`, width: 1600, height: 900 },
};

/** The WhatsApp link, with an optional message already written. */
export function prumoWhatsappHref(text?: string): string {
  const base = `https://wa.me/${prumo.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** «35 €», «12,50 €» — prices are always without VAT (owner's absolute rule); «+ IVA» is shown beside them. */
export function prumoPrice(euros: number): string {
  return `${euros.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
}

/** «45 min», «1 h», «1 h 15». */
export function prumoDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
