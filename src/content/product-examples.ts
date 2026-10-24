// Live examples shown on a product's own page, lower down and as a secondary link (owner, 2026-10-20: the home,
// sector pages and product cards always go to the product page with «Conhecer …»; only the product page may
// link to a demo). Only demos made by Steevanz, with fictional brands, and said to be demos.

import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ProductExamples {
  /**
   * `href` is a path on this site, or an external address opened in a new tab. `image` is a 1200×630 picture of
   * what the card opens, really working (owner, 2026-10-24: «Até deveriam ser as imagens dos metadados»): the
   * link preview (og:image) of that page when it has its own, otherwise a capture of the live demo.
   */
  items: { href: string; label: Localized<string>; external?: boolean; image: ExampleImage }[];
  copy: Localized<{ eyebrow: string; title: string; lead: string; open: string; note: string }>;
}

export interface ExampleImage {
  /** A file in /public, 1200×630. */
  src: string;
  alt: Localized<string>;
}

export const productExamples: Partial<Record<ProductId, ProductExamples>> = {
  // The Steevanz demo menu the Menu digital ad shows (lib/video-menus/rules.ts: a demo menu).
  "digital-menu": {
    items: [
      {
        href: "/menu/trattoria-da-nonna",
        label: { pt: "Trattoria da Nonna", en: "Trattoria da Nonna" },
        // Also the menu's own link preview (app/(publico)/menu/[slug]/page.tsx, demoPreviews).
        image: {
          src: "/og/menu-trattoria-da-nonna.jpg",
          alt: {
            pt: "Dois telemóveis com o Menu digital da Trattoria da Nonna aberto: a grelha de antipasti e uma burrata em vídeo no ecrã inteiro.",
            en: "Two phones with the Trattoria da Nonna digital menu open: the antipasti grid and a burrata on video, full screen.",
            es: "Dos móviles con el Menú digital de la Trattoria da Nonna abierto: la cuadrícula de antipasti y una burrata en vídeo a pantalla completa.",
            fr: "Deux téléphones avec le Menu digital de la Trattoria da Nonna ouvert : la grille des antipasti et une burrata en vidéo en plein écran.",
            de: "Zwei Handys mit der geöffneten Digitalen Speisekarte der Trattoria da Nonna: das Antipasti-Raster und eine Burrata im Vollbild-Video.",
            it: "Due smartphone con il Menù digitale della Trattoria da Nonna aperto: la griglia degli antipasti e una burrata in video a schermo intero.",
          },
        },
      },
    ],
    copy: {
      pt: {
        eyebrow: "Exemplo",
        title: "Veja um Menu digital a funcionar",
        lead: "Um menu de demonstração, com os pratos em vídeo. Abra-o no telemóvel, como um cliente à mesa.",
        open: "Ver um exemplo",
        note: "Menu de demonstração: o restaurante, os pratos e os preços são fictícios.",
      },
      en: {
        eyebrow: "Example",
        title: "See a digital menu in action",
        lead: "A demo menu, with the dishes on video. Open it on your phone, just like a customer at the table.",
        open: "See an example",
        note: "Demo menu: the restaurant, the dishes and the prices are fictional.",
      },
      es: {
        eyebrow: "Ejemplo",
        title: "Vea un Menú digital en funcionamiento",
        lead: "Un menú de demostración, con los platos en vídeo. Ábralo en el móvil, como un cliente sentado a la mesa.",
        open: "Ver un ejemplo",
        note: "Menú de demostración: el restaurante, los platos y los precios son ficticios.",
      },
      fr: {
        eyebrow: "Exemple",
        title: "Découvrez un Menu digital en action",
        lead: "Un menu de démonstration, avec les plats en vidéo. Ouvrez-le sur votre téléphone, comme un client à table.",
        open: "Voir un exemple",
        note: "Menu de démonstration : le restaurant, les plats et les prix sont fictifs.",
      },
      de: {
        eyebrow: "Beispiel",
        title: "Erleben Sie eine Digitale Speisekarte in Aktion",
        lead: "Eine Demo-Speisekarte mit den Gerichten im Video. Öffnen Sie sie auf dem Handy, wie ein Gast am Tisch.",
        open: "Beispiel ansehen",
        note: "Demo-Speisekarte: Restaurant, Gerichte und Preise sind erfunden.",
      },
      it: {
        eyebrow: "Esempio",
        title: "Guardi un Menù digitale in funzione",
        lead: "Un menù dimostrativo, con i piatti in video. Lo apra sullo smartphone, come un cliente seduto al tavolo.",
        open: "Veda un esempio",
        note: "Menù dimostrativo: il ristorante, i piatti e i prezzi sono di fantasia.",
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
          alt: {
            pt: "O cartão de visita Steevanz de Rogério Cabaço, frente e verso, e um telemóvel com a página que abre, com o botão «Guardar contacto».",
            en: "Rogério Cabaço's Steevanz business card, front and back, and a phone with the page it opens, with the «Save contact» button.",
            es: "La tarjeta de visita Steevanz de Rogério Cabaço, por delante y por detrás, y un móvil con la página que abre, con el botón «Guardar contacto».",
            fr: "La carte de visite Steevanz de Rogério Cabaço, recto et verso, et un téléphone avec la page qu'elle ouvre et le bouton « Enregistrer le contact ».",
            de: "Die Steevanz-Visitenkarte von Rogério Cabaço, Vorder- und Rückseite, und ein Handy mit der Seite, die sie öffnet, mit der Schaltfläche „Kontakt speichern“.",
            it: "Il biglietto da visita Steevanz di Rogério Cabaço, fronte e retro, e uno smartphone con la pagina che apre, con il pulsante «Salvi il contatto».",
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
  // The owner's alojamento-template demos (2026-10-12): fictional brand, no reviews (an empty state). Until
  // 2026-10-20 they were on the holiday rentals sector page.
  website: {
    // Captures of each live demo (computer and phone); the demos' own og:image is one stock photo for all three.
    items: [
      {
        href: "https://alojamento-template.vercel.app/vista-bb5622",
        label: { pt: "Modelo 1", en: "Model 1", es: "Modelo 1", fr: "Modèle 1", de: "Modell 1", it: "Modello 1" },
        external: true,
        image: {
          src: "/media/examples/alojamento-modelo-1.jpg",
          alt: {
            pt: "O modelo 1 aberto no computador e no telemóvel: claro, com o botão de pesquisa verde-petróleo.",
            en: "Model 1 open on a computer and a phone: light, with a teal search button.",
            es: "El modelo 1 abierto en el ordenador y en el móvil: claro, con el botón de búsqueda verde petróleo.",
            fr: "Le modèle 1 ouvert sur un ordinateur et un téléphone : clair, avec le bouton de recherche vert pétrole.",
            de: "Modell 1 geöffnet am Computer und auf dem Handy: hell, mit petrolgrüner Suchschaltfläche.",
            it: "Il modello 1 aperto sul computer e sullo smartphone: chiaro, con il pulsante di ricerca verde petrolio.",
          },
        },
      },
      {
        href: "https://alojamento-template.vercel.app/vista-df3246",
        label: { pt: "Modelo 2", en: "Model 2", es: "Modelo 2", fr: "Modèle 2", de: "Modell 2", it: "Modello 2" },
        external: true,
        image: {
          src: "/media/examples/alojamento-modelo-2.jpg",
          alt: {
            pt: "O modelo 2 aberto no computador e no telemóvel: escuro, com a foto da casa em fundo e letras finas.",
            en: "Model 2 open on a computer and a phone: dark, with the house photo behind thin lettering.",
            es: "El modelo 2 abierto en el ordenador y en el móvil: oscuro, con la foto de la casa de fondo y letras finas.",
            fr: "Le modèle 2 ouvert sur un ordinateur et un téléphone : sombre, avec la photo de la maison en fond et des lettres fines.",
            de: "Modell 2 geöffnet am Computer und auf dem Handy: dunkel, mit dem Hausfoto im Hintergrund und feiner Schrift.",
            it: "Il modello 2 aperto sul computer e sullo smartphone: scuro, con la foto della casa sullo sfondo e lettere sottili.",
          },
        },
      },
      {
        href: "https://alojamento-template.vercel.app/vista-b3438b",
        label: { pt: "Modelo 3", en: "Model 3", es: "Modelo 3", fr: "Modèle 3", de: "Modell 3", it: "Modello 3" },
        external: true,
        image: {
          src: "/media/examples/alojamento-modelo-3.jpg",
          alt: {
            pt: "O modelo 3 aberto no computador e no telemóvel: verde-sálvia, com a foto num arco e o botão terracota.",
            en: "Model 3 open on a computer and a phone: sage green, with the photo in an arch and a terracotta button.",
            es: "El modelo 3 abierto en el ordenador y en el móvil: verde salvia, con la foto en un arco y el botón terracota.",
            fr: "Le modèle 3 ouvert sur un ordinateur et un téléphone : vert sauge, avec la photo dans une arche et le bouton terre cuite.",
            de: "Modell 3 geöffnet am Computer und auf dem Handy: salbeigrün, mit dem Foto in einem Bogen und terrakottafarbener Schaltfläche.",
            it: "Il modello 3 aperto sul computer e sullo smartphone: verde salvia, con la foto in un arco e il pulsante terracotta.",
          },
        },
      },
    ],
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Websites com reservas diretas, prontos a ver",
        lead: "Três modelos de website para alojamento local, com pesquisa por datas e reserva direta. Abra-os no telemóvel ou no computador: adaptamos o escolhido ao seu negócio, fotos e cores.",
        open: "Ver um exemplo",
        note: "Websites de demonstração: a marca «Maré Alta», as casas e os contactos são fictícios.",
      },
      en: {
        eyebrow: "Examples",
        title: "Direct-booking websites, ready to look at",
        lead: "Three website designs for holiday rentals, with date search and direct booking. Open them on your phone or computer: we adapt the one you pick to your business, photos and colours.",
        open: "See an example",
        note: "Demo websites: the «Maré Alta» brand, the homes and the contact details are fictional.",
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Webs con reserva directa, listas para ver",
        lead: "Tres modelos de web para alojamientos turísticos, con búsqueda por fechas y reserva directa. Ábralos en el móvil o en el ordenador: adaptamos el que elija a su negocio, sus fotos y sus colores.",
        open: "Ver un ejemplo",
        note: "Webs de demostración: la marca «Maré Alta», las casas y los contactos son ficticios.",
      },
      fr: {
        eyebrow: "Exemples",
        title: "Des sites avec réservation directe, prêts à découvrir",
        lead: "Trois modèles de site pour locations de vacances, avec recherche par dates et réservation directe. Ouvrez-les sur votre téléphone ou votre ordinateur : nous adaptons celui que vous choisissez à votre activité, à vos photos et à vos couleurs.",
        open: "Voir un exemple",
        note: "Sites de démonstration : la marque « Maré Alta », les logements et les coordonnées sont fictifs.",
      },
      de: {
        eyebrow: "Beispiele",
        title: "Websites mit Direktbuchung, zum Ansehen bereit",
        lead: "Drei Website-Modelle für Ferienunterkünfte, mit Datumssuche und Direktbuchung. Öffnen Sie sie auf dem Handy oder am Computer: Wir passen das Modell Ihrer Wahl an Ihr Unternehmen, Ihre Fotos und Ihre Farben an.",
        open: "Beispiel ansehen",
        note: "Demo-Websites: die Marke „Maré Alta“, die Unterkünfte und die Kontaktdaten sind erfunden.",
      },
      it: {
        eyebrow: "Esempi",
        title: "Siti con prenotazione diretta, pronti da vedere",
        lead: "Tre modelli di sito per case vacanza, con ricerca per date e prenotazione diretta. Li apra sullo smartphone o sul computer: adattiamo quello che sceglie alla Sua attività, alle Sue foto e ai Suoi colori.",
        open: "Veda un esempio",
        note: "Siti dimostrativi: il marchio «Maré Alta», le case e i contatti sono di fantasia.",
      },
    },
  },
};
