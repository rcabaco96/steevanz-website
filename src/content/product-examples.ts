// Live examples shown on a product's own page, lower down and as a secondary link (owner, 2026-10-20: the home,
// sector pages and product cards always go to the product page with «Conhecer …»; only the product page may
// link to a demo). Only demos made by Steevanz, with fictional brands, and said to be demos.

import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ProductExamples {
  /** `href` is a path on this site, or an external address opened in a new tab. */
  items: { href: string; label: Localized<string>; external?: boolean; /** A small square logo shown beside the name. */ logo?: string }[];
  copy: Localized<{ eyebrow: string; title: string; lead: string; open: string; note: string }>;
}

export const productExamples: Partial<Record<ProductId, ProductExamples>> = {
  // Every Steevanz menu (owner, 2026-10-24: «mete os menus digitais que temos»), the demos first.
  "digital-menu": {
    items: [
      { href: "/menu/trattoria-da-nonna", label: { pt: "Trattoria da Nonna", en: "Trattoria da Nonna" }, logo: "https://odvtklbxrqdugrtzjzye.supabase.co/storage/v1/object/public/menu-logos/abdb3eed-76f7-4757-84fe-bcd1a175932d/-prUEFK68oqq.png" },
      { href: "/menu/sakura-sushi", label: { pt: "Sakura Sushi", en: "Sakura Sushi" }, logo: "https://odvtklbxrqdugrtzjzye.supabase.co/storage/v1/object/public/menu-logos/bb52f2bd-9eba-469e-9515-9ace97316786/xQiqZiSGdb91.png" },
      { href: "/menu/marisqueira-do-cais", label: { pt: "Marisqueira do Cais", en: "Marisqueira do Cais" }, logo: "https://odvtklbxrqdugrtzjzye.supabase.co/storage/v1/object/public/menu-logos/5080ac48-0ccd-42a1-b471-1e18e33192c3/N7L69sAunZUe.png" },
      { href: "/menu/dolci-salati", label: { pt: "Dolci e Salati", en: "Dolci e Salati" }, logo: "/media/clients/dolci-e-salati-logo.png" },
      { href: "/menu/o-ermita", label: { pt: "O Ermita", en: "O Ermita" }, logo: "/media/clients/o-ermita/menu-logo.png" },
      { href: "/menu/lobo-do-mar", label: { pt: "Lobo do Mar", en: "Lobo do Mar" }, logo: "/media/clients/lobo-do-mar/menu-logo-v2.png" },
      { href: "/menu/fabios-roadstop", label: { pt: "Fabio's Roadstop", en: "Fabio's Roadstop" }, logo: "https://odvtklbxrqdugrtzjzye.supabase.co/storage/v1/object/public/menu-logos/6521f54c-e0b2-42c9-87d0-e31b8b1ded03/kBIClrnkYdn_.png" },
    ],
    copy: {
      pt: {
        eyebrow: "Exemplos",
        title: "Veja os nossos Menus digitais a funcionar",
        lead: "Menus feitos pela Steevanz, com os pratos em vídeo. Abra-os no telemóvel, como um cliente à mesa.",
        open: "Ver o menu",
        note: "Alguns são menus de demonstração: os vídeos e os preços podem ser exemplos.",
      },
      en: {
        eyebrow: "Examples",
        title: "See our digital menus in action",
        lead: "Menus made by Steevanz, with the dishes on video. Open them on your phone, just like a customer at the table.",
        open: "See the menu",
        note: "Some are demo menus: the videos and prices may be examples.",
      },
      es: {
        eyebrow: "Ejemplos",
        title: "Vea nuestros Menús digitales en funcionamiento",
        lead: "Menús hechos por Steevanz, con los platos en vídeo. Ábralos en el móvil, como un cliente sentado a la mesa.",
        open: "Ver el menú",
        note: "Algunos son menús de demostración: los vídeos y los precios pueden ser ejemplos.",
      },
      fr: {
        eyebrow: "Exemples",
        title: "Découvrez nos Menus digitaux en action",
        lead: "Des menus réalisés par Steevanz, avec les plats en vidéo. Ouvrez-les sur votre téléphone, comme un client à table.",
        open: "Voir le menu",
        note: "Certains sont des menus de démonstration : les vidéos et les prix peuvent être des exemples.",
      },
      de: {
        eyebrow: "Beispiele",
        title: "Erleben Sie unsere Digitalen Speisekarten in Aktion",
        lead: "Speisekarten von Steevanz, mit den Gerichten im Video. Öffnen Sie sie auf dem Handy, wie ein Gast am Tisch.",
        open: "Speisekarte ansehen",
        note: "Einige sind Demo-Speisekarten: Videos und Preise können Beispiele sein.",
      },
      it: {
        eyebrow: "Esempi",
        title: "Guardi i nostri Menù digitali in funzione",
        lead: "Menù realizzati da Steevanz, con i piatti in video. Li apra sullo smartphone, come un cliente seduto al tavolo.",
        open: "Veda il menù",
        note: "Alcuni sono menù dimostrativi: i video e i prezzi possono essere esempi.",
      },
    },
  },
  // The Steevanz example card (owner, 2026-10-20): a real card, the founder's own contact page.
  "business-card": {
    items: [{ href: "/c/rogerio-cabaco", label: { pt: "Rogério Cabaço, Steevanz", en: "Rogério Cabaço, Steevanz" } }],
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
    items: [
      { href: "https://alojamento-template.vercel.app/vista-bb5622", label: { pt: "Modelo 1", en: "Model 1", es: "Modelo 1", fr: "Modèle 1", de: "Modell 1", it: "Modello 1" }, external: true },
      { href: "https://alojamento-template.vercel.app/vista-df3246", label: { pt: "Modelo 2", en: "Model 2", es: "Modelo 2", fr: "Modèle 2", de: "Modell 2", it: "Modello 2" }, external: true },
      { href: "https://alojamento-template.vercel.app/vista-b3438b", label: { pt: "Modelo 3", en: "Model 3", es: "Modelo 3", fr: "Modèle 3", de: "Modell 3", it: "Modello 3" }, external: true },
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
