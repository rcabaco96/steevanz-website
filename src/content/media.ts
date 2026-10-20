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
      es: "Grupo de amigos charlando en la mesa de una cafetería, con pizza y cafés",
      fr: "Groupe d'amis discutant à la table d'un café, autour d'une pizza et de cafés",
      de: "Freunde unterhalten sich an einem Cafétisch bei Pizza und Kaffee",
      it: "Gruppo di amici che chiacchierano al tavolo di un bar, con pizza e caffè",
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
      es: "Cliente acercando el móvil a un terminal en la barra de una cafetería",
      fr: "Client approchant son téléphone d'un terminal au comptoir d'un café",
      de: "Kunde hält sein Smartphone an ein Terminal an der Theke eines Cafés",
      it: "Cliente che avvicina lo smartphone a un terminale al banco di un bar",
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
      es: "Barista sonriente atendiendo a un cliente en la barra de una cafetería",
      fr: "Barista souriant servant un client au comptoir d'un café",
      de: "Lächelnder Barista bedient einen Gast an der Theke eines Cafés",
      it: "Barista sorridente che serve un cliente al banco di un bar",
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
      es: "Peluquero cortando el pelo a una clienta mayor en un salón luminoso",
      fr: "Coiffeur coupant les cheveux d'une cliente âgée dans un salon lumineux",
      de: "Friseur schneidet einer älteren Kundin in einem hellen Salon die Haare",
      it: "Parrucchiere che taglia i capelli a una cliente anziana in un salone luminoso",
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
      es: "Restaurante lleno por la noche, con clientes cenando en mesas de madera",
      fr: "Restaurant animé le soir, avec des clients dînant à des tables en bois",
      de: "Gut besuchtes Restaurant am Abend, Gäste essen an Holztischen",
      it: "Ristorante affollato di sera, con clienti a cena su tavoli di legno",
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
      es: "Manos escribiendo un mensaje en un chat en el móvil",
      fr: "Mains tapant un message dans une conversation sur un téléphone",
      de: "Hände tippen eine Nachricht in einem Chat auf dem Smartphone",
      it: "Mani che scrivono un messaggio in una chat sullo smartphone",
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
      es: "Dueña de una floristería atendiendo una llamada mientras toma notas en el mostrador",
      fr: "Fleuriste répondant au téléphone tout en prenant des notes au comptoir",
      de: "Floristin nimmt an der Theke einen Anruf entgegen und macht sich Notizen",
      it: "Titolare di un negozio di fiori che risponde al telefono mentre prende appunti al banco",
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
      es: "Dueño de un pequeño negocio trabajando con el portátil en su tienda, rodeado de paquetes",
      fr: "Commerçant travaillant sur son ordinateur portable dans sa boutique, entouré de colis",
      de: "Inhaber eines kleinen Geschäfts arbeitet in seinem Laden am Laptop, umgeben von Verpackungen",
      it: "Titolare di una piccola attività che lavora al portatile nel suo negozio, tra i pacchi",
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
      es: "Florista sonriente entre flores en su tienda, vista a través del escaparate",
      fr: "Fleuriste souriante parmi les fleurs de sa boutique, vue à travers la vitrine",
      de: "Lächelnde Floristin zwischen Blumen in ihrem Laden, durchs Schaufenster gesehen",
      it: "Fiorista sorridente tra i fiori del suo negozio, vista attraverso la vetrina",
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
      es: "Recepción luminosa y moderna de una clínica dental",
      fr: "Accueil lumineux et moderne d'un cabinet dentaire",
      de: "Heller, moderner Empfang einer Zahnarztpraxis",
      it: "Reception luminosa e moderna di uno studio dentistico",
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
      es: "Manicurista haciendo la manicura a una clienta en un salón de belleza",
      fr: "Prothésiste ongulaire faisant la manucure d'une cliente dans un institut de beauté",
      de: "Nageldesignerin macht einer Kundin im Kosmetikstudio die Maniküre",
      it: "Onicotecnica che fa la manicure a una cliente in un centro estetico",
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
      es: "Comerciante cobrando a un cliente en el mostrador de una pequeña tienda",
      fr: "Commerçant encaissant un client au comptoir d'une petite boutique",
      de: "Ladeninhaber kassiert an der Theke eines kleinen Geschäfts bei einem Kunden",
      it: "Negoziante che incassa il pagamento di un cliente al banco di un piccolo negozio",
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
      es: "Equipo pequeño hablando y riendo en una reunión distendida",
      fr: "Petite équipe qui discute et rit pendant une réunion détendue",
      de: "Kleines Team unterhält sich und lacht in einem entspannten Meeting",
      it: "Piccolo team che parla e ride durante una riunione informale",
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
      es: "Interior acogedor de un restaurante, con decoración de madera y luz cálida",
      fr: "Intérieur chaleureux d'un restaurant, avec un décor en bois et une lumière douce",
      de: "Gemütlicher Restaurantraum mit Holzeinrichtung und warmem Licht",
      it: "Interno accogliente di un ristorante, con arredi in legno e luce calda",
    },
    credit: pexels("Jonathan Borba", "https://www.pexels.com/photo/interior-of-restaurant-14590691/"),
  },
  "holiday-rental": {
    src: "/media/photos/holiday-rental.jpg",
    width: 1600,
    height: 1067,
    alt: {
      pt: "Sala de um apartamento luminoso com sofá, plantas e janelas abertas",
      en: "Bright apartment living room with a sofa, plants and open windows",
      es: "Salón luminoso de un apartamento, con sofá, plantas y ventanas abiertas",
      fr: "Salon lumineux d'un appartement, avec un canapé, des plantes et des fenêtres ouvertes",
      de: "Helles Wohnzimmer einer Ferienwohnung mit Sofa, Pflanzen und offenen Fenstern",
      it: "Soggiorno luminoso di un appartamento, con divano, piante e finestre aperte",
    },
    credit: pexels(
      "Zack Tu Nan",
      "https://www.pexels.com/photo/black-sofa-with-throw-pillows-near-window-8900181/",
    ),
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
      es: "Barista preparando café en la barra de una cafetería",
      fr: "Barista préparant un café au comptoir",
      de: "Barista bereitet an der Theke eines Cafés Kaffee zu",
      it: "Barista che prepara il caffè al banco di un bar",
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
      es: "Peluquero cortando el pelo a una clienta mayor en un salón",
      fr: "Coiffeur coupant les cheveux d'une cliente âgée dans un salon",
      de: "Friseur schneidet einer älteren Kundin im Salon die Haare",
      it: "Parrucchiere che taglia i capelli a una cliente anziana in un salone",
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
      es: "Cliente acercando el móvil a un terminal sin contacto",
      fr: "Client approchant son téléphone d'un terminal sans contact",
      de: "Kunde hält sein Smartphone an ein kontaktloses Terminal",
      it: "Cliente che avvicina lo smartphone a un terminale contactless",
    },
    credit: pexels("Marcus Aurelius", "https://www.pexels.com/video/a-woman-paying-using-smartphone-4109600/"),
  },
} satisfies Record<string, MediaVideo>;

export type VideoId = keyof typeof videos;
