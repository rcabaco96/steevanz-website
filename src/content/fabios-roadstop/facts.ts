// Fabio's Roadstop: the facts of the restaurant (owner, 2026-10-21, and the client's old site
// www.fabiosroadstop.pt: address, phone, email, opening hours, links). Nothing here is invented: no ratings,
// no review counts, no prices (prices live in the video menu only).

const media = "/media/clients/fabios-roadstop";

export const fabios = {
  name: "Fabio's Roadstop",
  street: "Edifício Mar Salgado, R. Dr. Manuel Arriaga, lote 1, loja E",
  postalCode: "8365-140",
  locality: "Armação de Pêra",
  region: "Faro",
  country: "PT",
  phoneDisplay: "+351 282 317 025",
  phoneShort: "282 317 025",
  phoneHref: "tel:+351282317025",
  email: "geral@fabiosroadstop.pt",
  instagram: "https://www.instagram.com/fabiosroadstop/",
  instagramHandle: "@fabiosroadstop",
  facebook: "https://www.facebook.com/fabiosroadstop.fb/",
  tripadvisor:
    "https://www.tripadvisor.pt/Restaurant_Review-g189113-d17755337-Reviews-Fabio_s_RoadStop-Armacao_de_Pera_Faro_District_Algarve.html",
  maps: "https://goo.gl/maps/MWw1d6hQhcEirR7t7",
  mapsEmbed:
    "https://www.google.com/maps?q=Fabio%27s+Roadstop,+R.+Dr.+Manuel+Arriaga,+8365-140+Arma%C3%A7%C3%A3o+de+P%C3%AAra&output=embed",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** The Steevanz video menu (src/app/(publico)/menu/[slug]). */
  menuPath: "/menu/fabios-roadstop",
  menuUrl: "https://www.steevanz.com/menu/fabios-roadstop",
  /** Opening hours of the old site: closed on Mondays, Tuesday to Sunday 10:00–23:00. */
  opens: "10:00",
  closes: "23:00",
  openDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  media: {
    /**
     * The client's film, trimmed to 2 s – 30.4 s (no white end card) and upscaled 2× frame by frame (Real-ESRGAN
     * general-x4v3, same frames and timing; owner approved 2026-10-21): 1440×812, 2.9 MB, faststart.
     */
    video: `${media}/hero-loop-hd.mp4`,
    /** The first frame of the hero video. */
    poster: `${media}/hero-loop-hd-poster.webp`,
    logo: `${media}/logo.webp`,
    logoPng: `${media}/logo.png`,
    sign: `${media}/placa-poste.webp`,
    car: `${media}/carro.webp`,
    interior: `${media}/interior.webp`,
    lemonades: `${media}/limonadas.webp`,
    facade: `${media}/fachada.webp`,
    menuArt: `${media}/menu-cadillac.webp`,
    burgers: `${media}/hamburgueres.webp`,
    eating: `${media}/a-comer.webp`,
    toast: `${media}/brinde.webp`,
    drinksTray: `${media}/bebidas-tabuleiro.webp`,
    og: `${media}/og.jpg`,
    icon192: `${media}/icon-192.png`,
    icon512: `${media}/icon-512.png`,
    appleIcon: `${media}/apple-icon.png`,
    favicon: `${media}/favicon.ico`,
  },
} as const;

/** The image sizes (px), for next/image and layout without shifts. */
export const fabiosImageSize = {
  poster: { width: 1440, height: 812 },
  still: { width: 720, height: 328 },
  logo: { width: 900, height: 593 },
  sign: { width: 900, height: 900 },
  car: { width: 611, height: 193 },
  interior: { width: 1476, height: 777 },
  lemonades: { width: 1387, height: 815 },
} as const;
