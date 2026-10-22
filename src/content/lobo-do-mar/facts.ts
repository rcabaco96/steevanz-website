// Lobo do Mar: the facts of the restaurant, each from a source (2026-10-22). Nothing here is invented: no ratings,
// no review counts, no prices.
//  - Name, address, phone, e-mail, opening hours, closing day, services (air conditioning, outdoor tables,
//    takeaway, free Wi-Fi), payment in cash and card, the photos: its own site (restaurantelobodomar.metro.rest).
//  - The dishes: the chalkboard by its door (a photo on its own site).
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
  media: {
    bar: `${media}/bar.webp`,
    barTall: `${media}/bar-alto.webp`,
    wall: `${media}/parede.webp`,
    board: `${media}/quadro.webp`,
    squid: `${media}/lulas.webp`,
    bream: `${media}/dourada.webp`,
    grilledFish: `${media}/peixe-grelhado.webp`,
    salmon: `${media}/salmao.webp`,
    stew: `${media}/cataplana.webp`,
    cuttlefish: `${media}/choquinhos.webp`,
    mixedGrill: `${media}/grelhada-mista.webp`,
    pot: `${media}/feijoada.webp`,
    cutlet: `${media}/panado.webp`,
    seabass: `${media}/robalo.webp`,
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
  board: { width: 1080, height: 1350 },
} as const;
