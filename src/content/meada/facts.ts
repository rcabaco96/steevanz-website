// Meada — a FICTIONAL concept store of home and Portuguese crafts in Guimarães, invented by Steevanz (owner,
// 2026-10-24) as a showcase site for selling websites, online shops and the digital customer card to shops. Nothing
// here describes a real business: the name, the logo, the team, the address, the hours, the products and their
// prices are made up for the demo. The contacts are deliberately unusable placeholders (no real person answers them).
// No ratings, no reviews, no customer numbers, no legal ids.
// Media: free stock (Mixkit Stock Video Free License, Pixabay Content License), see
// public/media/clients/meada/LICENCAS.txt. Kept free of imports so the unit tests can load it directly.

const media = "/media/clients/meada";

export const meada = {
  name: "Meada",
  fullName: "Meada · Casa & Ofícios",
  /** A made-up address in the historic centre of a real city (the square does not exist). */
  street: "Largo das Tecedeiras, 12",
  neighbourhood: "Centro Histórico",
  postalCode: "4810-000",
  locality: "Guimarães",
  /** Placeholder contacts: a number range not given to anyone, so no stranger gets the demo's calls. */
  phoneDisplay: "+351 900 000 000",
  phoneHref: "tel:+351900000000",
  whatsappDisplay: "+351 900 000 000",
  whatsappNumber: "351900000000",
  email: "ola@meada.example",
  /** Directions: the historic centre (the square is fictional). */
  directions: "https://www.google.com/maps/search/?api=1&query=Centro+Hist%C3%B3rico+de+Guimar%C3%A3es",
  /** Where the «leave a review» button would point for a real business (its Google review link). */
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=Centro+Hist%C3%B3rico+de+Guimar%C3%A3es",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Opening hours (fictional). */
  hours: [
    { days: "Segunda a sexta", opens: "10:00", closes: "19:30" },
    { days: "Sábado", opens: "10:00", closes: "19:00" },
  ],
  closed: "Domingo",
  media: {
    logoSvg: `${media}/logo.svg`,
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
    barro: `${media}/barro.mp4`,
    barroPoster: `${media}/barro-poster.webp`,
    bordado: `${media}/bordado.mp4`,
    bordadoPoster: `${media}/bordado-poster.webp`,
  },
} as const;

export type MeadaPhotoId =
  | "jarro"
  | "tacas"
  | "canecas"
  | "pratos"
  | "guardanapos"
  | "panoBordado"
  | "mantaLa"
  | "mantaTear"
  | "cestoVime"
  | "cestosPalha"
  | "velas"
  | "sabonete"
  | "etiqueta"
  | "embrulho"
  | "lojaParede"
  | "barroCru"
  | "vimeTrama"
  | "agulha"
  | "chavenas"
  | "lavanda";

/** The photos (Pixabay, see LICENCAS.txt) and their real sizes. */
export const meadaPhotos: Record<MeadaPhotoId, { src: string; width: number; height: number }> = {
  jarro: { src: `${media}/p-jarro.webp`, width: 900, height: 600 },
  tacas: { src: `${media}/p-tacas.webp`, width: 900, height: 598 },
  canecas: { src: `${media}/p-canecas.webp`, width: 900, height: 600 },
  pratos: { src: `${media}/p-pratos.webp`, width: 900, height: 490 },
  guardanapos: { src: `${media}/p-guardanapos.webp`, width: 900, height: 563 },
  panoBordado: { src: `${media}/p-pano-bordado.webp`, width: 900, height: 788 },
  mantaLa: { src: `${media}/p-manta-la.webp`, width: 900, height: 505 },
  mantaTear: { src: `${media}/p-manta-tear.webp`, width: 900, height: 600 },
  cestoVime: { src: `${media}/p-cesto-vime.webp`, width: 900, height: 675 },
  cestosPalha: { src: `${media}/p-cestos-palha.webp`, width: 900, height: 600 },
  velas: { src: `${media}/p-velas.webp`, width: 807, height: 900 },
  sabonete: { src: `${media}/p-sabonete.webp`, width: 600, height: 900 },
  etiqueta: { src: `${media}/etiqueta.webp`, width: 960, height: 1280 },
  embrulho: { src: `${media}/embrulho.webp`, width: 1280, height: 853 },
  lojaParede: { src: `${media}/loja-parede.webp`, width: 1280, height: 853 },
  barroCru: { src: `${media}/barro-cru.webp`, width: 1280, height: 719 },
  vimeTrama: { src: `${media}/vime-trama.webp`, width: 1280, height: 853 },
  agulha: { src: `${media}/agulha.webp`, width: 1280, height: 960 },
  chavenas: { src: `${media}/chavenas.webp`, width: 1280, height: 853 },
  lavanda: { src: `${media}/lavanda.webp`, width: 1280, height: 854 },
};

/** The WhatsApp link, with an optional message already written. */
export function meadaWhatsappHref(text?: string): string {
  const base = `https://wa.me/${meada.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** «34 €», «6,50 €» — prices are always without VAT (owner's absolute rule); the «+ IVA» is shown next to them. */
export function meadaPrice(euros: number): string {
  return `${euros.toLocaleString("pt-PT", { minimumFractionDigits: Number.isInteger(euros) ? 0 : 2, maximumFractionDigits: 2 })} €`;
}
