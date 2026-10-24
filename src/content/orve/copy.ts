// Texts of Orvé's website, in the six languages of the Steevanz site (owner, 2026-10-24): pt (European Portuguese,
// the default), en, es («usted»), fr («vous»), de («Sie»), it (formal «Lei»). Orvé is a FICTIONAL business (see
// ./facts.ts): the treatments, durations, prices (always without VAT, with «+ IVA» / «+ VAT» / «+ TVA» /
// «zzgl. MwSt.») and the team are made up for the demo. No ratings, no reviews, no testimonials, no customer numbers,
// no results promised.
// The numbers (minutes, prices), pictures and names are written once, here; each language file (copy.<lang>.ts) only
// holds words, in the same order. Kept free of path aliases so the unit tests can load it directly.

import type { OrvePhotoId } from "./facts";
import { de } from "./copy.de.ts";
import { en } from "./copy.en.ts";
import { es } from "./copy.es.ts";
import { fr } from "./copy.fr.ts";
import { it } from "./copy.it.ts";
import { pt } from "./copy.pt.ts";
import { orveHtmlLang, type OrveLocale } from "./routes.ts";

export interface OrveTreatment {
  name: string;
  note?: string;
  minutes: number;
  /** Euros, without VAT. */
  price: number;
}

export interface OrveRitual {
  id: string;
  number: string;
  title: string;
  titleItalic: string;
  intro: string;
  image: OrvePhotoId;
  alt: string;
  treatments: OrveTreatment[];
}

export interface OrveStep {
  title: string;
  text: string;
  minutes: number;
  image: OrvePhotoId | "vaporVideo";
  alt: string;
}

export interface OrvePerson {
  /** Where the picture is centred inside the drop (CSS object-position). */
  focus?: string;
  name: string;
  role: string;
  text: string;
  image: OrvePhotoId;
  alt: string;
}

export interface OrveFaq {
  q: string;
  a: string;
}

/** The words of one language. Lists follow the order of the shared data below. */
export interface OrveTexts {
  ogLocale: string;
  meta: { title: string; description: string };
  ogAlt: string;
  skip: string;
  newTab: string;
  logoLabel: string;
  /** The small line under the logo (footer, 404). */
  logoLine: string;
  /** The line of the opening drop. */
  tagline: string;
  demo: string;
  lang: { label: string; current: string };
  nav: { label: string; rituals: string; ritual: string; house: string; team: string; book: string; open: string; close: string };
  hero: { kicker: string; title: string; lead: string; book: string; prices: string; scroll: string; alt: string; lens: string; ring: string };
  manifesto: { eyebrow: string; text: string };
  rituals: {
    eyebrow: string;
    title: string;
    titleItalic: string;
    intro: string;
    vatNote: string;
    demoNote: string;
    plusVat: string;
    book: string;
    jump: string;
    list: { title: string; titleItalic: string; intro: string; alt: string; treatments: { name: string; note?: string }[] }[];
  };
  journey: {
    eyebrow: string;
    title: string;
    titleItalic: string;
    intro: string;
    counter: string;
    steps: { title: string; text: string; alt: string }[];
  };
  house: { eyebrow: string; title: string; titleItalic: string; text: string; alt: string };
  team: { eyebrow: string; title: string; titleItalic: string; intro: string; note: string; people: { role: string; text: string; alt: string }[] };
  gallery: { eyebrow: string; title: string; titleItalic: string; alts: string[] };
  marquee: string[];
  booking: {
    eyebrow: string;
    title: string;
    titleItalic: string;
    intro: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    namePlaceholder: string;
    nameOptional: string;
    summary: string;
    /** «{dia}, às {hora}» under the summary. */
    summaryWhen: string;
    send: string;
    call: string;
    pending: string;
    closedNote: string;
    demoNote: string;
    /**
     * The WhatsApp message (it reaches Steevanz: owner, 2026-10-24, it must say it is a test of the demo site).
     * {nome} is `messageName` or nothing; {ritual}, {dia}, {hora} the choices. Plain text.
     */
    message: string;
    messageName: string;
  };
  visit: {
    addressLabel: string;
    hoursLabel: string;
    /** The days of each row of `orve.hours`, in order. */
    hoursDays: string[];
    closedDays: string;
    closedLabel: string;
    phoneLabel: string;
    phoneNote: string;
    whatsappLabel: string;
    directions: string;
    mapLabel: string;
  };
  review: { title: string; text: string; button: string };
  faq: { eyebrow: string; title: string; titleItalic: string; items: OrveFaq[] };
  footer: { tagline: string; hours: string; contacts: string; rights: string; fictional: string; complaints: string; credit: string; credits: string };
  notFound: { title: string; text: string; back: string };
}

/** The six families of treatments: ids, pictures, minutes and prices (euros, without VAT). */
const rituals: { id: string; number: string; image: OrvePhotoId; treatments: { minutes: number; price: number }[] }[] = [
  {
    id: "rosto",
    number: "01",
    image: "rosto",
    treatments: [
      { minutes: 60, price: 48 },
      { minutes: 75, price: 55 },
      { minutes: 45, price: 42 },
      { minutes: 45, price: 40 },
      { minutes: 20, price: 15 },
    ],
  },
  {
    id: "corpo",
    number: "02",
    image: "corpo",
    treatments: [
      { minutes: 50, price: 45 },
      { minutes: 75, price: 62 },
      { minutes: 60, price: 50 },
      { minutes: 60, price: 52 },
    ],
  },
  {
    id: "maos",
    number: "03",
    image: "maos",
    treatments: [
      { minutes: 40, price: 15 },
      { minutes: 60, price: 24 },
      { minutes: 60, price: 28 },
      { minutes: 20, price: 8 },
    ],
  },
  {
    id: "olhar",
    number: "04",
    image: "olhar",
    treatments: [
      { minutes: 30, price: 14 },
      { minutes: 45, price: 32 },
      { minutes: 60, price: 38 },
      { minutes: 15, price: 9 },
    ],
  },
  {
    id: "depilacao",
    number: "05",
    image: "pele",
    treatments: [
      { minutes: 10, price: 5 },
      { minutes: 15, price: 8 },
      { minutes: 25, price: 14 },
      { minutes: 40, price: 22 },
      { minutes: 30, price: 18 },
    ],
  },
  {
    id: "maquilhagem",
    number: "06",
    image: "maquilhagem",
    treatments: [
      { minutes: 45, price: 30 },
      { minutes: 60, price: 45 },
      { minutes: 150, price: 140 },
    ],
  },
];

/** The house ritual («Orvalho», the first treatment of the first family) in four times: 60 minutes. */
const steps: { minutes: number; image: OrveStep["image"] }[] = [
  { minutes: 5, image: "esfera" },
  { minutes: 15, image: "vaporVideo" },
  { minutes: 30, image: "hidratacao" },
  { minutes: 10, image: "lifting" },
];

/** The (fictional) team: names and pictures. */
const people: { name: string; image: OrvePhotoId; focus?: string }[] = [
  { name: "Inês Carvalhal", image: "lifting" },
  { name: "Beatriz Moura", image: "costas", focus: "45% 8%" },
  { name: "Joana Teles", image: "maosMassagem" },
];

const galleryImages: OrvePhotoId[] = ["hidratacao", "led", "maos", "altaFrequencia", "mascara", "limpeza", "olhar", "costas"];

function same(what: string, words: number, data: number) {
  if (words !== data) throw new Error(`Orvé copy: ${what} has ${words} texts for ${data} entries`);
}

function build(locale: OrveLocale, t: OrveTexts) {
  same(`${locale} rituals`, t.rituals.list.length, rituals.length);
  same(`${locale} steps`, t.journey.steps.length, steps.length);
  same(`${locale} team`, t.team.people.length, people.length);
  same(`${locale} gallery`, t.gallery.alts.length, galleryImages.length);
  return {
    ...t,
    locale,
    htmlLang: orveHtmlLang[locale],
    rituals: {
      ...t.rituals,
      list: rituals.map((r, i): OrveRitual => {
        const text = t.rituals.list[i];
        same(`${locale} ${r.id}`, text.treatments.length, r.treatments.length);
        return { ...text, id: r.id, number: r.number, image: r.image, treatments: r.treatments.map((n, j) => ({ ...text.treatments[j], ...n })) };
      }),
    },
    journey: { ...t.journey, steps: steps.map((s, i): OrveStep => ({ ...t.journey.steps[i], ...s })) },
    team: { ...t.team, people: people.map((p, i): OrvePerson => ({ ...t.team.people[i], ...p })) },
    gallery: { ...t.gallery, photos: galleryImages.map((image, i) => ({ image, alt: t.gallery.alts[i] })) },
  };
}

export type OrveCopy = ReturnType<typeof build>;

export const orveCopy: Record<OrveLocale, OrveCopy> = {
  pt: build("pt", pt),
  en: build("en", en),
  es: build("es", es),
  fr: build("fr", fr),
  de: build("de", de),
  it: build("it", it),
};
