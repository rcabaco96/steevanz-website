// Live examples shown on a product's own page, lower down and as a secondary link (owner, 2026-10-20: the home,
// sector pages and product cards always go to the product page with «Conhecer …»; only the product page may
// link to a demo). Only demos made by Steevanz, with fictional brands, and said to be demos.

import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ProductExamples {
  /** `href` is a path on this site, or an external address opened in a new tab. */
  items: { href: string; label: Localized<string>; external?: boolean }[];
  copy: Localized<{ eyebrow: string; title: string; lead: string; open: string; note: string }>;
}

export const productExamples: Partial<Record<ProductId, ProductExamples>> = {
  // The Steevanz demo menu the Menu digital ad shows (lib/video-menus/rules.ts: a demo menu).
  "digital-menu": {
    items: [{ href: "/menu/trattoria-da-nonna", label: { pt: "Trattoria da Nonna", en: "Trattoria da Nonna" } }],
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
        title: "Guardate un Menù digitale in funzione",
        lead: "Un menù dimostrativo, con i piatti in video. Apritelo sullo smartphone, come un cliente seduto al tavolo.",
        open: "Vedi un esempio",
        note: "Menù dimostrativo: il ristorante, i piatti e i prezzi sono di fantasia.",
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
        lead: "Tre modelli di sito per case vacanza, con ricerca per date e prenotazione diretta. Apriteli sullo smartphone o sul computer: adattiamo quello che scegliete alla vostra attività, alle vostre foto e ai vostri colori.",
        open: "Vedi un esempio",
        note: "Siti dimostrativi: il marchio «Maré Alta», le case e i contatti sono di fantasia.",
      },
    },
  },
};
