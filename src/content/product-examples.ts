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
    },
  },
  // The owner's alojamento-template demos (2026-10-12): fictional brand, no reviews (an empty state). Until
  // 2026-10-20 they were on the holiday rentals sector page.
  website: {
    items: [
      { href: "https://alojamento-template.vercel.app/vista-bb5622", label: { pt: "Modelo 1", en: "Model 1" }, external: true },
      { href: "https://alojamento-template.vercel.app/vista-df3246", label: { pt: "Modelo 2", en: "Model 2" }, external: true },
      { href: "https://alojamento-template.vercel.app/vista-b3438b", label: { pt: "Modelo 3", en: "Model 3" }, external: true },
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
    },
  },
};
