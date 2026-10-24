// Live examples shown on a product's own page, lower down and as a secondary link (owner, 2026-10-20: the home,
// sector pages and product cards always go to the product page with «Conhecer …»; only the product page may
// link to a demo). Real businesses' pages made by Steevanz first, then Steevanz demos with fictional brands, each
// demo tagged «Demonstração» (owner, 2026-10-24).

import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ExampleImage {
  /**
   * 1200×630, in /public: the link preview (og:image) of what the card opens (owner, 2026-10-24: «Até deveriam ser as
   * imagens dos metadados»), or a capture of the live page when it has none. Shown on the Portuguese page.
   */
  src: string;
  /** The same picture without Portuguese words (English screens, no captions), for the other languages. */
  intl?: string;
  alt: Localized<string>;
}

export interface ExampleItem {
  /** A path on this site or an address (`external`, opened in a new tab). */
  href: string;
  /** Where the other languages go, when the page has an English version. */
  hrefEn?: string;
  external?: boolean;
  label: Localized<string>;
  /** A Steevanz demo with a fictional brand: tagged «Demonstração». */
  demo?: boolean;
  image: ExampleImage;
}

export interface ProductExamples {
  items: ExampleItem[];
  copy: Localized<{ eyebrow: string; title: string; lead: string; open: string; note: string }>;
}

/** The tag on a demo's card. */
export const exampleDemoTag: Localized<string> = {
  pt: "Demonstração",
  en: "Demo",
  es: "Demostración",
  fr: "Démonstration",
  de: "Demo",
  it: "Dimostrazione",
};

const same = (name: string): Localized<string> => ({ pt: name, en: name, es: name, fr: name, de: name, it: name });

/** A menu's picture: two phones with that menu open, the grid of dishes and one dish full screen. */
function menuAlt(name: string): Localized<string> {
  return {
    pt: `${name}: dois telemóveis com o Menu digital aberto, a grelha dos pratos e um prato em vídeo no ecrã inteiro.`,
    en: `${name}: two phones with the digital menu open, the grid of dishes and one dish on video, full screen.`,
    es: `${name}: dos móviles con el Menú digital abierto, la cuadrícula de platos y un plato en vídeo a pantalla completa.`,
    fr: `${name} : deux téléphones avec le Menu digital ouvert, la grille des plats et un plat en vidéo en plein écran.`,
    de: `${name}: zwei Handys mit der geöffneten Digitalen Speisekarte, dem Raster der Gerichte und einem Gericht im Vollbild-Video.`,
    it: `${name}: due smartphone con il Menù digitale aperto, la griglia dei piatti e un piatto in video a schermo intero.`,
  };
}

function menu(slug: string, name: string, src: string, demo = false): ExampleItem {
  return { href: `/menu/${slug}`, label: same(name), demo, image: { src, intl: `/media/examples/menu-${slug}.jpg`, alt: menuAlt(name) } };
}

/** A website's picture: its link preview in Portuguese; elsewhere the site open on a computer and a phone. */
function siteAlt(name: string, pt: string): Localized<string> {
  return {
    pt: `${name}: ${pt}`,
    en: `${name}: the website open on a computer and a phone.`,
    es: `${name}: la web abierta en el ordenador y en el móvil.`,
    fr: `${name} : le site ouvert sur un ordinateur et un téléphone.`,
    de: `${name}: die Website geöffnet am Computer und auf dem Handy.`,
    it: `${name}: il sito aperto sul computer e sullo smartphone.`,
  };
}

/** The demo spaces' pages (scripts/demo-businesses.mjs; their link previews: lib/link-previews.ts). */
const demoSpaces = [
  { slug: "tasca-do-largo", name: "Tasca do Largo" },
  { slug: "navalha-douro", name: "Barbearia Navalha d'Ouro" },
  { slug: "clinica-sorriso", name: "Clínica Sorriso" },
  { slug: "arena-desportiva", name: "Arena Desportiva" },
] as const;

const spacePageWords: Record<"fila" | "reservar" | "cartao", Localized<string>> = {
  fila: { pt: "a página da lista de espera", en: "the waitlist page", es: "la página de la lista de espera", fr: "la page de la liste d'attente", de: "der Seite der Warteliste", it: "la pagina della lista d'attesa" },
  reservar: { pt: "a página de reservas", en: "the booking page", es: "la página de reservas", fr: "la page de réservation", de: "der Buchungsseite", it: "la pagina delle prenotazioni" },
  cartao: { pt: "o cartão de cliente", en: "the loyalty card", es: "la tarjeta de cliente", fr: "la carte de fidélité", de: "der Kundenkarte", it: "la carta fedeltà" },
};

function spaceItems(page: "fila" | "reservar" | "cartao"): ExampleItem[] {
  const words = spacePageWords[page];
  return demoSpaces.map(({ slug, name }) => ({
    href: `/${page}/${slug}`,
    label: same(name),
    demo: true,
    image: {
      src: `/og/${page === "cartao" ? "cartao-cliente" : page}-${slug}.jpg`,
      alt: {
        pt: `${name}: dois telemóveis com ${words.pt}.`,
        en: `${name}: two phones with ${words.en}.`,
        es: `${name}: dos móviles con ${words.es}.`,
        fr: `${name} : deux téléphones avec ${words.fr}.`,
        de: `${name}: zwei Handys mit ${words.de}.`,
        it: `${name}: due smartphone con ${words.it}.`,
      },
    },
  }));
}

/** The note under the demo spaces' cards. */
const demoSpacesNote = {
  pt: "Negócios de demonstração: os nomes, as moradas e os preços são fictícios.",
  en: "Demo businesses: the names, addresses and prices are fictional.",
  es: "Negocios de demostración: los nombres, las direcciones y los precios son ficticios.",
  fr: "Commerces de démonstration : les noms, les adresses et les prix sont fictifs.",
  de: "Demo-Betriebe: Namen, Adressen und Preise sind erfunden.",
  it: "Attività dimostrative: i nomi, gli indirizzi e i prezzi sono di fantasia.",
};

export const productExamples: Partial<Record<ProductId, ProductExamples>> = {
  // Every digital menu on the site (owner, 2026-10-24: «mete todos os menus digitais que temos»): the real restaurants'
  // menus first, then the Steevanz demos (lib/video-menus/rules.ts). Each picture is that menu's own link preview
  // (app/(publico)/menu/[slug]/page.tsx).
  "digital-menu": {
    items: [
      menu("fabios-roadstop", "Fabio's Roadstop", "/media/clients/fabios-roadstop/og-menu-digital.jpg"),
      menu("dolci-salati", "Dolci e Salati", "/media/clients/dolci-salati/og-menu.jpg"),
      menu("o-ermita", "O Ermita", "/media/clients/o-ermita/og-menu-digital.jpg"),
      menu("lobo-do-mar", "Lobo do Mar", "/media/clients/lobo-do-mar/og-menu.jpg"),
      menu("trattoria-da-nonna", "Trattoria da Nonna", "/og/menu-trattoria-da-nonna.jpg", true),
      menu("sakura-sushi", "Sakura Sushi", "/og/menu-sakura-sushi.jpg", true),
      menu("marisqueira-do-cais", "Marisqueira do Cais", "/og/menu-marisqueira-do-cais.jpg", true),
    ],
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Veja Menus digitais a funcionar",
        lead: "Os menus de restaurantes e cafés reais e os nossos menus de demonstração, com os pratos em vídeo. Abra-os no telemóvel, como um cliente à mesa.",
        open: "Abrir o menu",
        note: "Os menus marcados «Demonstração» são de restaurantes fictícios. Nos menus que o dizem no fim, os vídeos são de banco de imagens e os preços de exemplo.",
      },
      en: {
        eyebrow: "Examples",
        title: "See digital menus in action",
        lead: "Menus of real restaurants and cafés and our demo menus, with the dishes on video. Open them on your phone, just like a customer at the table.",
        open: "Open the menu",
        note: "The menus tagged «Demo» belong to fictional restaurants. In the menus that say so at the end, the videos are stock footage and the prices are examples.",
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Vea Menús digitales en funcionamiento",
        lead: "Los menús de restaurantes y cafeterías reales y nuestros menús de demostración, con los platos en vídeo. Ábralos en el móvil, como un cliente sentado a la mesa.",
        open: "Abrir el menú",
        note: "Los menús marcados «Demostración» son de restaurantes ficticios. En los menús que lo indican al final, los vídeos son de banco de imágenes y los precios, de ejemplo.",
      },
      fr: {
        eyebrow: "Exemples",
        title: "Découvrez des Menus digitaux en action",
        lead: "Les menus de vrais restaurants et cafés et nos menus de démonstration, avec les plats en vidéo. Ouvrez-les sur votre téléphone, comme un client à table.",
        open: "Ouvrir le menu",
        note: "Les menus marqués « Démonstration » sont ceux de restaurants fictifs. Dans les menus qui l'indiquent à la fin, les vidéos viennent d'une banque d'images et les prix sont des exemples.",
      },
      de: {
        eyebrow: "Beispiele",
        title: "Erleben Sie Digitale Speisekarten in Aktion",
        lead: "Speisekarten echter Restaurants und Cafés und unsere Demo-Speisekarten, mit den Gerichten im Video. Öffnen Sie sie auf dem Handy, wie ein Gast am Tisch.",
        open: "Speisekarte öffnen",
        note: "Die mit „Demo“ markierten Speisekarten gehören zu erfundenen Restaurants. Wo es am Ende der Speisekarte steht, stammen die Videos aus einer Bilddatenbank und die Preise sind Beispiele.",
      },
      it: {
        eyebrow: "Esempi",
        title: "Guardi i Menù digitali in funzione",
        lead: "I menù di ristoranti e caffè veri e i nostri menù dimostrativi, con i piatti in video. Li apra sullo smartphone, come un cliente seduto al tavolo.",
        open: "Apra il menù",
        note: "I menù contrassegnati «Dimostrazione» sono di ristoranti di fantasia. Nei menù che lo indicano in fondo, i video provengono da una banca di immagini e i prezzi sono d'esempio.",
      },
    },
  },
  // The Steevanz example card (owner, 2026-10-20): a real card, the founder's own contact page.
  "business-card": {
    items: [
      {
        href: "/c/rogerio-cabaco",
        label: { pt: "Rogério Cabaço, Steevanz", en: "Rogério Cabaço, Steevanz" },
        // Also the card page's own link preview (app/(cartao-visita)/c/[slug]/page.tsx, cardPreviews).
        image: {
          src: "/og/cartao-rogerio-cabaco.jpg",
          intl: "/media/examples/cartao-rogerio-cabaco.jpg",
          alt: {
            pt: "O cartão de visita Steevanz de Rogério Cabaço, frente e verso, e um telemóvel com a página que abre, com o botão «Guardar contacto».",
            en: "Rogério Cabaço's Steevanz business card, front and back, and a phone with the page it opens.",
            es: "La tarjeta de visita Steevanz de Rogério Cabaço, por delante y por detrás, y un móvil con la página que abre.",
            fr: "La carte de visite Steevanz de Rogério Cabaço, recto et verso, et un téléphone avec la page qu'elle ouvre.",
            de: "Die Steevanz-Visitenkarte von Rogério Cabaço, Vorder- und Rückseite, und ein Handy mit der Seite, die sie öffnet.",
            it: "Il biglietto da visita Steevanz di Rogério Cabaço, fronte e retro, e uno smartphone con la pagina che apre.",
          },
        },
      },
    ],
    copy: {
      pt: {
        eyebrow: "Exemplo",
        title: "Veja um exemplo",
        lead: "A página que abre com um toque no cartão de visita do fundador da Steevanz. Abra-a no telemóvel e experimente «Guardar contacto».",
        open: "Ver o exemplo",
        note: "Cartão real: os dados são os do fundador da Steevanz.",
      },
      en: {
        eyebrow: "Example",
        title: "See an example",
        lead: "The page that opens with one tap on the Steevanz founder's business card. Open it on your phone and try «Save contact».",
        open: "See the example",
        note: "A real card: the details are those of the Steevanz founder.",
      },
      es: {
        eyebrow: "Ejemplo",
        title: "Vea un ejemplo",
        lead: "La página que se abre con un toque en la tarjeta de visita del fundador de Steevanz. Ábrala en el móvil y pruebe «Guardar contacto».",
        open: "Ver el ejemplo",
        note: "Tarjeta real: los datos son los del fundador de Steevanz.",
      },
      fr: {
        eyebrow: "Exemple",
        title: "Voir un exemple",
        lead: "La page qui s'ouvre d'un simple toucher sur la carte de visite du fondateur de Steevanz. Ouvrez-la sur votre téléphone et essayez « Enregistrer le contact ».",
        open: "Voir l'exemple",
        note: "Une vraie carte : les coordonnées sont celles du fondateur de Steevanz.",
      },
      de: {
        eyebrow: "Beispiel",
        title: "Ein Beispiel ansehen",
        lead: "Die Seite, die sich mit einmal Antippen der Visitenkarte des Steevanz-Gründers öffnet. Öffnen Sie sie auf dem Handy und probieren Sie „Kontakt speichern“.",
        open: "Beispiel ansehen",
        note: "Eine echte Karte: Es sind die Daten des Steevanz-Gründers.",
      },
      it: {
        eyebrow: "Esempio",
        title: "Veda un esempio",
        lead: "La pagina che si apre con un tocco sul biglietto da visita del fondatore di Steevanz. La apra sullo smartphone e provi «Salvi il contatto».",
        open: "Veda l'esempio",
        note: "Un biglietto vero: i dati sono quelli del fondatore di Steevanz.",
      },
    },
  },
  // Fabio's Roadstop's website (several pages, on its own domain), then the owner's alojamento-template demos
  // (2026-10-12): fictional brand, no reviews (an empty state); their own og:image is one stock photo for all three, so
  // their cards show captures of each live demo (computer and phone).
  website: {
    items: [
      {
        href: "https://www.fabiosroadstop.pt",
        hrefEn: "https://www.fabiosroadstop.pt/en",
        external: true,
        label: same("Fabio's Roadstop"),
        image: {
          src: "/media/clients/fabios-roadstop/og.jpg",
          alt: {
            pt: "Fabio's Roadstop: o logótipo do diner sobre a sala, com os bancos vermelhos e o balcão.",
            en: "Fabio's Roadstop: the diner's logo over its dining room, with the red stools and the counter.",
            es: "Fabio's Roadstop: el logotipo del diner sobre la sala, con los taburetes rojos y la barra.",
            fr: "Fabio's Roadstop : le logo du diner sur la salle, avec les tabourets rouges et le comptoir.",
            de: "Fabio's Roadstop: das Logo des Diners über dem Gastraum, mit den roten Hockern und der Theke.",
            it: "Fabio's Roadstop: il logo del diner sulla sala, con gli sgabelli rossi e il bancone.",
          },
        },
      },
      ...[
        { id: "bb5622", n: 1, look: ["claro, com o botão de pesquisa verde-petróleo", "light, with a teal search button", "claro, con el botón de búsqueda verde petróleo", "clair, avec le bouton de recherche vert pétrole", "hell, mit petrolgrüner Suchschaltfläche", "chiaro, con il pulsante di ricerca verde petrolio"] },
        { id: "df3246", n: 2, look: ["escuro, com a foto da casa em fundo e letras finas", "dark, with the house photo behind thin lettering", "oscuro, con la foto de la casa de fondo y letras finas", "sombre, avec la photo de la maison en fond et des lettres fines", "dunkel, mit dem Hausfoto im Hintergrund und feiner Schrift", "scuro, con la foto della casa sullo sfondo e lettere sottili"] },
        { id: "b3438b", n: 3, look: ["verde-sálvia, com a foto num arco e o botão terracota", "sage green, with the photo in an arch and a terracotta button", "verde salvia, con la foto en un arco y el botón terracota", "vert sauge, avec la photo dans une arche et le bouton terre cuite", "salbeigrün, mit dem Foto in einem Bogen und terrakottafarbener Schaltfläche", "verde salvia, con la foto in un arco e il pulsante terracotta"] },
      ].map(({ id, n, look }): ExampleItem => ({
        href: `https://alojamento-template.vercel.app/vista-${id}/pt`,
        hrefEn: `https://alojamento-template.vercel.app/vista-${id}/en`,
        external: true,
        demo: true,
        label: { pt: `Modelo ${n}`, en: `Model ${n}`, es: `Modelo ${n}`, fr: `Modèle ${n}`, de: `Modell ${n}`, it: `Modello ${n}` },
        image: {
          src: `/media/examples/alojamento-modelo-${n}.jpg`,
          alt: {
            pt: `O modelo ${n} aberto no computador e no telemóvel: ${look[0]}.`,
            en: `Model ${n} open on a computer and a phone: ${look[1]}.`,
            es: `El modelo ${n} abierto en el ordenador y en el móvil: ${look[2]}.`,
            fr: `Le modèle ${n} ouvert sur un ordinateur et un téléphone : ${look[3]}.`,
            de: `Modell ${n} geöffnet am Computer und auf dem Handy: ${look[4]}.`,
            it: `Il modello ${n} aperto sul computer e sullo smartphone: ${look[5]}.`,
          },
        },
      })),
    ],
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Websites prontos a ver",
        lead: "O website de um restaurante real e três modelos para alojamento local, com pesquisa por datas e reserva direta. Abra-os no telemóvel ou no computador: adaptamos o escolhido ao seu negócio, fotos e cores.",
        open: "Ver o website",
        note: "Os modelos marcados «Demonstração» usam a marca fictícia «Maré Alta»: as casas e os contactos são fictícios.",
      },
      en: {
        eyebrow: "Examples",
        title: "Websites, ready to look at",
        lead: "A real restaurant's website and three designs for holiday rentals, with date search and direct booking. Open them on your phone or computer: we adapt the one you pick to your business, photos and colours.",
        open: "See the website",
        note: "The designs tagged «Demo» use the fictional «Maré Alta» brand: the homes and the contact details are fictional.",
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Webs listas para ver",
        lead: "La web de un restaurante real y tres modelos para alojamientos turísticos, con búsqueda por fechas y reserva directa. Ábralos en el móvil o en el ordenador: adaptamos el que elija a su negocio, sus fotos y sus colores.",
        open: "Ver la web",
        note: "Los modelos marcados «Demostración» usan la marca ficticia «Maré Alta»: las casas y los contactos son ficticios.",
      },
      fr: {
        eyebrow: "Exemples",
        title: "Des sites prêts à découvrir",
        lead: "Le site d'un vrai restaurant et trois modèles pour locations de vacances, avec recherche par dates et réservation directe. Ouvrez-les sur votre téléphone ou votre ordinateur : nous adaptons celui que vous choisissez à votre activité, à vos photos et à vos couleurs.",
        open: "Voir le site",
        note: "Les modèles marqués « Démonstration » utilisent la marque fictive « Maré Alta » : les logements et les coordonnées sont fictifs.",
      },
      de: {
        eyebrow: "Beispiele",
        title: "Websites zum Ansehen",
        lead: "Die Website eines echten Restaurants und drei Modelle für Ferienunterkünfte, mit Datumssuche und Direktbuchung. Öffnen Sie sie auf dem Handy oder am Computer: Wir passen das Modell Ihrer Wahl an Ihr Unternehmen, Ihre Fotos und Ihre Farben an.",
        open: "Website ansehen",
        note: "Die mit „Demo“ markierten Modelle nutzen die erfundene Marke „Maré Alta“: Unterkünfte und Kontaktdaten sind erfunden.",
      },
      it: {
        eyebrow: "Esempi",
        title: "Siti pronti da vedere",
        lead: "Il sito di un ristorante vero e tre modelli per case vacanza, con ricerca per date e prenotazione diretta. Li apra sullo smartphone o sul computer: adattiamo quello che sceglie alla Sua attività, alle Sue foto e ai Suoi colori.",
        open: "Veda il sito",
        note: "I modelli contrassegnati «Dimostrazione» usano il marchio di fantasia «Maré Alta»: le case e i contatti sono di fantasia.",
      },
    },
  },
  // One-page sites made by Steevanz for real restaurants (pt, with an English version): O Ermita and Lobo do Mar
  // (owner, 2026-10-22) and Dolci e Salati (2026-10-18). Their own link previews in Portuguese; elsewhere the English
  // site open on a computer and a phone (Dolci's preview is a photo, the same everywhere).
  "landing-page": {
    items: [
      {
        href: "/o-ermita",
        hrefEn: "/o-ermita/en",
        label: same("O Ermita"),
        image: {
          src: "/media/clients/o-ermita/og-site.jpg",
          intl: "/media/examples/site-o-ermita.jpg",
          alt: siteAlt("O Ermita", "o convento visto do ar e a sala de abóbada pintada."),
        },
      },
      {
        href: "/lobo-do-mar",
        hrefEn: "/lobo-do-mar/en",
        label: same("Lobo do Mar"),
        image: {
          src: "/media/clients/lobo-do-mar/og-site.jpg",
          intl: "/media/examples/site-lobo-do-mar.jpg",
          alt: siteAlt("Lobo do Mar", "o logótipo, a montra do marisco e uma travessa pronta a servir."),
        },
      },
      {
        href: "/dolci-salati",
        hrefEn: "/dolci-salati/en",
        label: same("Dolci e Salati"),
        image: {
          src: "/media/clients/dolci-salati/esplanada.jpg",
          alt: {
            pt: "Dolci e Salati: a esplanada, com clientes à mesa debaixo dos guarda-sóis.",
            en: "Dolci e Salati: the terrace, with customers at the tables under the parasols.",
            es: "Dolci e Salati: la terraza, con clientes en las mesas bajo las sombrillas.",
            fr: "Dolci e Salati : la terrasse, avec des clients attablés sous les parasols.",
            de: "Dolci e Salati: die Terrasse, mit Gästen an den Tischen unter den Sonnenschirmen.",
            it: "Dolci e Salati: il dehors, con i clienti ai tavoli sotto gli ombrelloni.",
          },
        },
      },
    ],
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Landing pages a funcionar",
        lead: "Páginas que fizemos para restaurantes e cafés reais, em português e em inglês. Abra-as no telemóvel ou no computador.",
        open: "Ver a página",
        note: "Páginas reais, feitas pela Steevanz, com as fotos e os contactos de cada casa.",
      },
      en: {
        eyebrow: "Examples",
        title: "Landing pages in action",
        lead: "Pages we made for real restaurants and cafés, in Portuguese and English. Open them on your phone or computer.",
        open: "See the page",
        note: "Real pages, made by Steevanz, with each place's own photos and contact details.",
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Landing pages en funcionamiento",
        lead: "Páginas que hicimos para restaurantes y cafeterías reales, en portugués y en inglés. Ábralas en el móvil o en el ordenador.",
        open: "Ver la página",
        note: "Páginas reales, hechas por Steevanz, con las fotos y los contactos de cada local.",
      },
      fr: {
        eyebrow: "Exemples",
        title: "Des landing pages en action",
        lead: "Des pages que nous avons créées pour de vrais restaurants et cafés, en portugais et en anglais. Ouvrez-les sur votre téléphone ou votre ordinateur.",
        open: "Voir la page",
        note: "De vraies pages, créées par Steevanz, avec les photos et les coordonnées de chaque établissement.",
      },
      de: {
        eyebrow: "Beispiele",
        title: "Landingpages in Aktion",
        lead: "Seiten, die wir für echte Restaurants und Cafés gemacht haben, auf Portugiesisch und Englisch. Öffnen Sie sie auf dem Handy oder am Computer.",
        open: "Seite ansehen",
        note: "Echte Seiten, von Steevanz erstellt, mit den eigenen Fotos und Kontaktdaten jedes Betriebs.",
      },
      it: {
        eyebrow: "Esempi",
        title: "Landing page in funzione",
        lead: "Pagine che abbiamo realizzato per ristoranti e caffè veri, in portoghese e in inglese. Le apra sullo smartphone o sul computer.",
        open: "Veda la pagina",
        note: "Pagine vere, realizzate da Steevanz, con le foto e i contatti di ogni locale.",
      },
    },
  },
  // The four demo spaces' public pages (a restaurant, a barbershop, a clinic and a sports venue): the queue, the booking
  // page and the loyalty card, as a customer sees them.
  waitlist: {
    items: spaceItems("fila"),
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Veja a Lista de Espera a funcionar",
        lead: "A página onde o cliente entra na fila e acompanha a sua vez, em quatro negócios de demonstração. Abra-a no telemóvel.",
        open: "Ver a lista de espera",
        note: demoSpacesNote.pt,
      },
      en: {
        eyebrow: "Examples",
        title: "See the waitlist in action",
        lead: "The page where customers join the queue and follow their turn, in four demo businesses. Open it on your phone.",
        open: "See the waitlist",
        note: demoSpacesNote.en,
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Vea la Lista de espera en funcionamiento",
        lead: "La página donde el cliente entra en la cola y sigue su turno, en cuatro negocios de demostración. Ábrala en el móvil.",
        open: "Ver la lista de espera",
        note: demoSpacesNote.es,
      },
      fr: {
        eyebrow: "Exemples",
        title: "Découvrez la Liste d'attente en action",
        lead: "La page où le client rejoint la file et suit son tour, dans quatre commerces de démonstration. Ouvrez-la sur votre téléphone.",
        open: "Voir la liste d'attente",
        note: demoSpacesNote.fr,
      },
      de: {
        eyebrow: "Beispiele",
        title: "Erleben Sie die Warteliste in Aktion",
        lead: "Die Seite, auf der sich Kunden in die Warteschlange einreihen und ihre Reihenfolge verfolgen, in vier Demo-Betrieben. Öffnen Sie sie auf dem Handy.",
        open: "Warteliste ansehen",
        note: demoSpacesNote.de,
      },
      it: {
        eyebrow: "Esempi",
        title: "Guardi la Lista d'attesa in funzione",
        lead: "La pagina in cui il cliente entra in coda e segue il suo turno, in quattro attività dimostrative. La apra sullo smartphone.",
        open: "Veda la lista d'attesa",
        note: demoSpacesNote.it,
      },
    },
  },
  bookings: {
    items: spaceItems("reservar"),
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Veja as Reservas Online a funcionar",
        lead: "A página onde o cliente escolhe o serviço, o dia e a hora, em quatro negócios de demonstração: uma mesa, um corte, uma consulta, um campo.",
        open: "Ver as reservas",
        note: demoSpacesNote.pt,
      },
      en: {
        eyebrow: "Examples",
        title: "See online bookings in action",
        lead: "The page where customers pick the service, the day and the time, in four demo businesses: a table, a haircut, an appointment, a court.",
        open: "See the bookings",
        note: demoSpacesNote.en,
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Vea las Reservas online en funcionamiento",
        lead: "La página donde el cliente elige el servicio, el día y la hora, en cuatro negocios de demostración: una mesa, un corte, una consulta, una pista.",
        open: "Ver las reservas",
        note: demoSpacesNote.es,
      },
      fr: {
        eyebrow: "Exemples",
        title: "Découvrez les Réservations en ligne en action",
        lead: "La page où le client choisit le service, le jour et l'heure, dans quatre commerces de démonstration : une table, une coupe, une consultation, un terrain.",
        open: "Voir les réservations",
        note: demoSpacesNote.fr,
      },
      de: {
        eyebrow: "Beispiele",
        title: "Erleben Sie die Online-Reservierung in Aktion",
        lead: "Die Seite, auf der Kunden Leistung, Tag und Uhrzeit wählen, in vier Demo-Betrieben: ein Tisch, ein Haarschnitt, ein Termin, ein Platz.",
        open: "Reservierung ansehen",
        note: demoSpacesNote.de,
      },
      it: {
        eyebrow: "Esempi",
        title: "Guardi le Prenotazioni online in funzione",
        lead: "La pagina in cui il cliente sceglie il servizio, il giorno e l'ora, in quattro attività dimostrative: un tavolo, un taglio, una visita, un campo.",
        open: "Veda le prenotazioni",
        note: demoSpacesNote.it,
      },
    },
  },
  loyalty: {
    items: spaceItems("cartao"),
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Veja o Cartão de Cliente a funcionar",
        lead: "O cartão que fica no telemóvel do cliente, com os carimbos e a oferta, em quatro negócios de demonstração.",
        open: "Ver o cartão",
        note: demoSpacesNote.pt,
      },
      en: {
        eyebrow: "Examples",
        title: "See the loyalty card in action",
        lead: "The card that stays on the customer's phone, with the stamps and the reward, in four demo businesses.",
        open: "See the card",
        note: demoSpacesNote.en,
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Vea la Tarjeta de cliente en funcionamiento",
        lead: "La tarjeta que se queda en el móvil del cliente, con los sellos y el regalo, en cuatro negocios de demostración.",
        open: "Ver la tarjeta",
        note: demoSpacesNote.es,
      },
      fr: {
        eyebrow: "Exemples",
        title: "Découvrez la Carte de fidélité en action",
        lead: "La carte qui reste sur le téléphone du client, avec les tampons et la récompense, dans quatre commerces de démonstration.",
        open: "Voir la carte",
        note: demoSpacesNote.fr,
      },
      de: {
        eyebrow: "Beispiele",
        title: "Erleben Sie die Kundenkarte in Aktion",
        lead: "Die Karte, die auf dem Handy des Kunden bleibt, mit den Stempeln und der Prämie, in vier Demo-Betrieben.",
        open: "Karte ansehen",
        note: demoSpacesNote.de,
      },
      it: {
        eyebrow: "Esempi",
        title: "Guardi la Carta fedeltà in funzione",
        lead: "La carta che resta sullo smartphone del cliente, con i timbri e il premio, in quattro attività dimostrative.",
        open: "Veda la carta",
        note: demoSpacesNote.it,
      },
    },
  },
};
