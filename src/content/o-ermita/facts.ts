// O Ermita: the facts of the restaurant, each from a source (2026-10-22). Nothing here is invented: no ratings,
// no review counts, no prices.
//  - Name, address, phone, type, opening hours (as shown), accessibility: its Google Business profile.
//  - WhatsApp for bookings and the directions link: its own page (oermita.my.canva.site).
//  - Opening hours every day and no weekly closing: visitalentejo.pt and lifecooler.com («Não encerra»).
//  - Address with the road and km: visitalentejo.pt. Coordinates: Google.
//  - History, the Capela do Bispo, dishes, chef and sommelier: the hotel's own site (hotelconventosaopaulo.com).
// The restaurant's menu (Canva → Adobe Express → Google Drive) is private, so there is no menu link.

const media = "/media/clients/o-ermita";

export const ermita = {
  name: "O Ermita",
  hotel: "Hotel Convento de São Paulo",
  hotelUrl: "https://www.hotelconventosaopaulo.com/",
  street: "Estrada Nacional 381, km 10",
  village: "Aldeia da Serra",
  postalCode: "7170-120",
  locality: "Redondo",
  region: "Évora",
  country: "PT",
  latitude: 38.72591,
  longitude: -7.5785608,
  phoneDisplay: "+351 266 989 160",
  phoneShort: "266 989 160",
  phoneHref: "tel:+351266989160",
  whatsappDisplay: "+351 961 762 481",
  whatsappHref: "https://wa.me/351961762481",
  /** The directions link of the restaurant's own page. */
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Hotel+Convento+de+Sao+Paulo%2C+Aldeia+da+Serra%2C+7170-120+Redondo%2C+Portugal",
  maps: "https://www.google.com/maps/search/?api=1&query=O+Ermita%2C+Hotel+Convento+de+S%C3%A3o+Paulo%2C+7170-120+Redondo",
  mapsEmbed:
    "https://www.google.com/maps?q=O+Ermita,+Hotel+Convento+de+S%C3%A3o+Paulo,+Aldeia+da+Serra,+7170-120+Redondo&output=embed",
  complaints: "https://www.livroreclamacoes.pt/Inicio/",
  /** Lunch and dinner, every day (Google; visitalentejo: «Não encerra»). */
  services: [
    { opens: "12:30", closes: "15:00" },
    { opens: "19:30", closes: "22:00" },
  ],
  openDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  media: {
    skyline: `${media}/skyline.svg`,
    wordmark: `${media}/wordmark.svg`,
    restaurante: `${media}/restaurante.svg`,
    logoPng: `${media}/logo.png`,
    portal: `${media}/portal.webp`,
    vault: `${media}/sala-abobadada.webp`,
    vaultTall: `${media}/sala-vertical.webp`,
    tiles: `${media}/sala-azulejos.webp`,
    cellar: `${media}/garrafeira.webp`,
    entrance: `${media}/entrada.webp`,
    og: `${media}/og.jpg`,
    icon192: `${media}/icon-192.png`,
    icon512: `${media}/icon-512.png`,
    appleIcon: `${media}/apple-icon.png`,
    favicon: `${media}/favicon.ico`,
  },
} as const;

/** The image sizes (px), for next/image and layout without shifts. */
export const ermitaImageSize = {
  wide: { width: 2000, height: 1333 },
  tall: { width: 1333, height: 2000 },
} as const;

/** The proportions of the traced logo files (viewBox width / height). */
export const ermitaLogoRatio = { skyline: 611 / 72, wordmark: 649 / 80, restaurante: 193 / 16 } as const;
