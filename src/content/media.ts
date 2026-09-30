import type { Localized } from "@/lib/i18n";

export interface MediaCredit {
  author: string;
  sourceUrl: string;
  license: "Pexels License" | "Unsplash License";
}

export interface MediaPhoto {
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
  credit: MediaCredit;
}

export interface MediaVideo {
  mp4: string;
  webm?: string;
  poster: string;
  width: number;
  height: number;
  alt: Localized<string>;
  credit: MediaCredit;
}

const pexels = (author: string, sourceUrl: string): MediaCredit => ({
  author,
  sourceUrl,
  license: "Pexels License",
});

export const photos = {
  "restaurant-table": {
    src: "/media/photos/restaurant-table.jpg",
    width: 1600,
    height: 900,
    alt: {
      pt: "Grupo de amigos a conversar à mesa de um café, com pizza e cafés",
      en: "Group of friends chatting at a café table over pizza and coffee",
    },
    credit: pexels(
      "Vitaly Gariev",
      "https://www.pexels.com/photo/young-friends-enjoying-pizza-and-coffee-in-cafe-36729766/",
    ),
  },
  "phone-tap": {
    src: "/media/photos/phone-tap.jpg",
    width: 1600,
    height: 1068,
    alt: {
      pt: "Cliente a encostar o telemóvel a um terminal ao balcão de um café",
      en: "Customer tapping a smartphone on a terminal at a café counter",
    },
    credit: pexels(
      "Pavel Danilyuk",
      "https://www.pexels.com/photo/a-person-tapping-the-phone-on-a-payment-terminal-6612717/",
    ),
  },
  "cafe-counter": {
    src: "/media/photos/cafe-counter.jpg",
    width: 1600,
    height: 1067,
    alt: {
      pt: "Barista sorridente a atender uma cliente ao balcão de um café",
      en: "Smiling barista serving a customer at a café counter",
    },
    credit: pexels("Andrea Piacquadio", "https://www.pexels.com/photo/woman-paying-with-credit-card-3907306/"),
  },
  "salon-chair": {
    src: "/media/photos/salon-chair.jpg",
    width: 1600,
    height: 1068,
    alt: {
      pt: "Cabeleireira a cortar o cabelo de uma cliente sénior num salão luminoso",
      en: "Hairdresser cutting a senior client's hair in a bright salon",
    },
    credit: pexels(
      "Kampus Production",
      "https://www.pexels.com/photo/woman-cutting-the-hair-of-an-elderly-woman-8834071/",
    ),
  },
  "restaurant-busy": {
    src: "/media/photos/restaurant-busy.jpg",
    width: 1600,
    height: 1052,
    alt: {
      pt: "Restaurante cheio ao fim do dia, com clientes a jantar em mesas de madeira",
      en: "Busy restaurant in the evening with guests dining at wooden tables",
    },
    credit: pexels(
      "Darya Sannikova",
      "https://www.pexels.com/photo/people-sitting-in-front-of-rectangular-wooden-table-2927560/",
    ),
  },
  "phone-chat": {
    src: "/media/photos/phone-chat.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Mãos a escrever uma mensagem numa conversa no telemóvel",
      en: "Hands typing a message in a chat on a smartphone",
    },
    credit: pexels(
      "RDNE Stock project",
      "https://www.pexels.com/photo/close-up-shot-of-a-person-sending-text-message-4921407/",
    ),
  },
  "reception-phone": {
    src: "/media/photos/reception-phone.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Dona de uma florista a atender uma chamada enquanto toma notas ao balcão",
      en: "Florist shop owner taking a phone call while writing notes at the counter",
    },
    credit: pexels(
      "Amina Filkins",
      "https://www.pexels.com/photo/happy-woman-talking-on-smartphone-while-working-5410101/",
    ),
  },
  "owner-laptop": {
    src: "/media/photos/owner-laptop.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Pequeno empresário a trabalhar no portátil na sua loja, rodeado de embalagens",
      en: "Small business owner working on a laptop in his shop, surrounded by packaging",
    },
    credit: pexels(
      "RDNE Stock project",
      "https://www.pexels.com/photo/a-man-looking-at-a-website-on-the-internet-7309483/",
    ),
  },
  "shop-owner": {
    src: "/media/photos/shop-owner.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Florista sorridente entre flores na sua loja, vista através da montra",
      en: "Smiling florist among flowers in her shop, seen through the window",
    },
    credit: pexels(
      "Amina Filkins",
      "https://www.pexels.com/photo/happy-florist-standing-near-window-of-floristry-shop-5414025/",
    ),
  },
  clinic: {
    src: "/media/photos/clinic.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Receção moderna e luminosa de uma clínica dentária",
      en: "Bright, modern dental clinic reception",
    },
    credit: pexels(
      "Marc Chemla",
      "https://www.pexels.com/photo/modern-dental-office-in-beverly-hills-reception-area-38055772/",
    ),
  },
  beauty: {
    src: "/media/photos/beauty.jpg",
    width: 1067,
    height: 1600,
    alt: {
      pt: "Manicure a tratar das unhas de uma cliente num salão de estética",
      en: "Nail technician doing a client's manicure in a beauty salon",
    },
    credit: pexels("Jarib Key", "https://www.pexels.com/photo/beautician-working-by-table-15202934/"),
  },
  retail: {
    src: "/media/photos/retail.jpg",
    width: 1600,
    height: 1068,
    alt: {
      pt: "Lojista a receber o pagamento de um cliente ao balcão de uma pequena loja",
      en: "Shopkeeper taking a customer's payment at the counter of a small shop",
    },
    credit: pexels("Kampus Production", "https://www.pexels.com/photo/customer-paying-in-store-8422734/"),
  },
  "team-meeting": {
    src: "/media/photos/team-meeting.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Pequena equipa a conversar e a rir numa reunião descontraída",
      en: "Small team talking and laughing in a relaxed meeting",
    },
    credit: pexels("Tima Miroshnichenko", "https://www.pexels.com/photo/a-people-working-together-6914645/"),
  },
  "restaurant-hero": {
    src: "/media/photos/restaurant-hero.jpg",
    width: 1600,
    height: 1066,
    alt: {
      pt: "Interior acolhedor de um restaurante com madeira e luz quente",
      en: "Cosy restaurant interior with wooden decor and warm light",
    },
    credit: pexels("Jonathan Borba", "https://www.pexels.com/photo/interior-of-restaurant-14590691/"),
  },
} satisfies Record<string, MediaPhoto>;

export type PhotoId = keyof typeof photos;

export const videos = {
  "cafe-barista": {
    mp4: "/media/videos/cafe-barista.mp4",
    webm: "/media/videos/cafe-barista.webm",
    poster: "/media/videos/cafe-barista-poster.jpg",
    width: 960,
    height: 540,
    alt: {
      pt: "Barista a preparar café ao balcão de uma cafetaria",
      en: "Barista preparing coffee at a café counter",
    },
    credit: pexels("Kampus Production", "https://www.pexels.com/video/woman-working-at-cafeteria-6683741/"),
  },
  "salon-haircut": {
    mp4: "/media/videos/salon-haircut.mp4",
    webm: "/media/videos/salon-haircut.webm",
    poster: "/media/videos/salon-haircut-poster.jpg",
    width: 960,
    height: 540,
    alt: {
      pt: "Cabeleireira a cortar o cabelo de uma cliente sénior num salão",
      en: "Hairdresser cutting a senior client's hair in a salon",
    },
    credit: pexels(
      "Kampus Production",
      "https://www.pexels.com/video/female-hairdresser-cutting-an-elderly-woman-s-hair-8830238/",
    ),
  },
  "phone-tap": {
    mp4: "/media/videos/phone-tap.mp4",
    webm: "/media/videos/phone-tap.webm",
    poster: "/media/videos/phone-tap-poster.jpg",
    width: 960,
    height: 540,
    alt: {
      pt: "Cliente a aproximar o telemóvel de um terminal sem contacto",
      en: "Customer holding a smartphone to a contactless terminal",
    },
    credit: pexels("Marcus Aurelius", "https://www.pexels.com/video/a-woman-paying-using-smartphone-4109600/"),
  },
} satisfies Record<string, MediaVideo>;

export type VideoId = keyof typeof videos;
