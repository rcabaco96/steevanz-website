// Lobo do Mar: the facts of the restaurant, each from a source (2026-10-22). Nothing here is invented: no ratings,
// no review counts, no prices.
//  - Name, address, phone, e-mail, opening hours, closing day, services (air conditioning, outdoor tables,
//    takeaway, free Wi-Fi), payment in cash and card, the photos: its own site (restaurantelobodomar.metro.rest).
//  - The dishes: the chalkboard by its door (a photo on its own site). «Marisqueira · Sea Wolf»: its sign.
//  - The showcase, the live tank, the fish of the day: clips from its own Instagram reels (@restaurante_lobodomar).
//  - The seafood boat and the sign: photos from the owner (2026-10-22).
//  - «Tapas e Petiscos»: its name on Tripadvisor; Instagram: @restaurante_lobodomar.
//  - The line on its wall («A melhor rede social ainda é uma mesa rodeada de amigos!»): a photo on its own site.

const media = "/media/clients/lobo-do-mar";

export const lobo = {
  name: "Lobo do Mar",
  tagline: "Tapas e Petiscos",
  street: "Av. do Rio, Edifício Almadraba, Loja A",
  postalCode: "8365-102",
  locality: "Armação de Pêra",
  region: "Faro",
  country: "PT",
  phoneDisplay: "+351 918 194 530",
  phoneShort: "918 194 530",
  phoneHref: "tel:+351918194530",
  email: "meridianodastravessuras@gmail.com",
  instagram: "https://www.instagram.com/restaurante_lobodomar/",
  instagramHandle: "@restaurante_lobodomar",
  maps: "https://www.google.com/maps/search/?api=1&query=Lobo+do+Mar+Tapas+e+Petiscos%2C+Av.+do+Rio%2C+Arma%C3%A7%C3%A3o+de+P%C3%AAra",
  directions: "https://www.google.com/maps/dir/?api=1&destination=Lobo+do+Mar%2C+Av.+do+Rio%2C+8365-102+Arma%C3%A7%C3%A3o+de+P%C3%AAra",
  mapsEmbed: "https://www.google.com/maps?q=Lobo+do+Mar,+Av.+do+Rio,+Edif%C3%ADcio+Almadraba,+8365-102+Arma%C3%A7%C3%A3o+de+P%C3%AAra&output=embed",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Tuesday to Sunday; closed on Monday. */
  services: [
    { opens: "10:00", closes: "15:00" },
    { opens: "18:00", closes: "22:30" },
  ],
  openDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  /** The video menu (a demo, with demo orders), on steevanz.com so it keeps working after the domain switch. */
  menu: "https://www.steevanz.com/menu/lobo-do-mar",
  media: {
    boat: `${media}/barco-marisco.webp`,
    front: `${media}/fachada.webp`,
    platter: `${media}/mariscada.webp`,
    skewers: `${media}/espetadas.webp`,
    showcase: `${media}/video-gelo.webp`,
    bar: `${media}/bar.webp`,
    wall: `${media}/parede.webp`,
    squid: `${media}/lulas.webp`,
    bream: `${media}/dourada.webp`,
    stew: `${media}/cataplana.webp`,
    cuttlefish: `${media}/choquinhos.webp`,
    seabass: `${media}/robalo.webp`,
    /** Clips from the restaurant's own Instagram reels (no sound). */
    clipShowcase: `${media}/video-montra.mp4`,
    clipShowcasePoster: `${media}/video-montra.webp`,
    clipTank: `${media}/video-viveiro.mp4`,
    clipTankPoster: `${media}/video-viveiro.webp`,
    clipFish: `${media}/video-peixe.mp4`,
    clipFishPoster: `${media}/video-peixe.webp`,
    /** The display on ice (plays by itself, in a loop). */
    clipIce: `${media}/video-gelo.mp4`,
    menuScreen: `${media}/ementa-ecra.webp`,
    og: `${media}/og-site.jpg`,
    icon192: `${media}/icone-192.png`,
    icon512: `${media}/icone-512.png`,
    appleIcon: `${media}/icone-apple.png`,
    favicon: `${media}/icone.ico`,
  },
} as const;

/** The photos' real sizes (px): the plates are portrait, the bar landscape. */
export const loboPhotoSize = {
  tall: { width: 1100, height: 1467 },
  wide: { width: 1600, height: 1066 },
  boat: { width: 1170, height: 1158 },
  front: { width: 1170, height: 931 },
  platter: { width: 480, height: 640 },
  skewers: { width: 592, height: 640 },
  clip: { width: 720, height: 1280 },
} as const;
