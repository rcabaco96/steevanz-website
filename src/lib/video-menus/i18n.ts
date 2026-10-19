// Video menus in six languages (owner, 2026-10-19): Portuguese is the source and the default; the
// customer picks another in the menu's bar. What isn't translated shows in Portuguese, silently. Pure
// module (no server or browser APIs): the menu, the admin and the tests share it.

import type { VideoMenuData } from "./rules.ts";

export const menuLanguages = ["pt", "en", "es", "fr", "de", "it"] as const;
export type MenuLanguage = (typeof menuLanguages)[number];
/** The languages a translation is written in (Portuguese is the dish's own name and description). */
export type TranslatedLanguage = Exclude<MenuLanguage, "pt">;
export const translatedLanguages: TranslatedLanguage[] = ["en", "es", "fr", "de", "it"];
export const defaultMenuLanguage: MenuLanguage = "pt";

/** Each language in its own name (the menu's list). */
export const languageNames: Record<MenuLanguage, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

/** Each language in Portuguese (the admin and the staff's page): «inglês». */
export const languageNamesPt: Record<MenuLanguage, string> = {
  pt: "português",
  en: "inglês",
  es: "espanhol",
  fr: "francês",
  de: "alemão",
  it: "italiano",
};

/** The page's lang attribute and the numbers' locale (English as in Britain: 24 h, €10.50). */
export const languageLocales: Record<MenuLanguage, string> = {
  pt: "pt-PT",
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

export function isMenuLanguage(value: unknown): value is MenuLanguage {
  return typeof value === "string" && (menuLanguages as readonly string[]).includes(value);
}

/** A language tag ("en-GB", "pt_BR", "DE") as one of the menu's languages; null when it isn't one. */
export function menuLanguageOf(tag: string | null | undefined): MenuLanguage | null {
  if (!tag) return null;
  const base = tag.trim().toLowerCase().split(/[-_]/)[0];
  return isMenuLanguage(base) ? base : null;
}

/** The query parameter that picks the language (QR plates per language): /menu/x?lang=en. */
export const languageParam = "lang";
/** Where the customer's choice is kept on the phone. */
export const languageStorageKey = "steevanz-menu-lang";

/**
 * The language the menu opens in: ?lang= in the address, else the one the customer chose before on
 * this phone, else the first of the phone's languages the menu has, else Portuguese.
 */
export function pickMenuLanguage({ search, stored, browser }: { search?: string | null; stored?: string | null; browser?: readonly string[] | null }): MenuLanguage {
  if (search) {
    const fromUrl = menuLanguageOf(new URLSearchParams(search).get(languageParam));
    if (fromUrl) return fromUrl;
  }
  if (isMenuLanguage(stored)) return stored;
  for (const tag of browser ?? []) {
    const language = menuLanguageOf(tag);
    if (language) return language;
  }
  return defaultMenuLanguage;
}

// Translations of the menu's own texts ----------------------------------------------------------------

export type DishTranslations = Partial<Record<TranslatedLanguage, { name?: string; description?: string }>>;
export type CollectionTranslations = Partial<Record<TranslatedLanguage, { name?: string }>>;

/** The database's limits for the Portuguese texts, the same for their translations. */
export const translationLimits = { dishName: 80, dishDescription: 300, collectionName: 60 } as const;

/**
 * Translations as they are kept and sent to the menu: only the five languages and the given fields,
 * as trimmed strings within `limits`, without empty ones or ones equal to the Portuguese `original`
 * (it shows anyway). Anything else in the database's JSON is dropped.
 */
export function cleanTranslations<Field extends string>(
  raw: unknown,
  limits: Record<Field, number>,
  original: NoInfer<Partial<Record<Field, string>>> = {},
): Partial<Record<TranslatedLanguage, Partial<Record<Field, string>>>> {
  const result: Partial<Record<TranslatedLanguage, Partial<Record<Field, string>>>> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return result;
  for (const language of translatedLanguages) {
    const entry = (raw as Record<string, unknown>)[language];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const fields: Partial<Record<Field, string>> = {};
    for (const field of Object.keys(limits) as Field[]) {
      const value = (entry as Record<string, unknown>)[field];
      if (typeof value !== "string") continue;
      const text = value.replace(/\s+/g, " ").trim().slice(0, limits[field]);
      if (text && text !== original[field]?.trim()) fields[field] = text;
    }
    if (Object.keys(fields).length) result[language] = fields;
  }
  return result;
}

/** The languages with something written (the admin's flags). */
export function filledLanguages(translations: Partial<Record<TranslatedLanguage, Record<string, string | undefined>>> | null | undefined): TranslatedLanguage[] {
  return translatedLanguages.filter((language) => Object.values(translations?.[language] ?? {}).some((value) => typeof value === "string" && value.trim()));
}

/** A text in `language`, or the Portuguese one when it has no translation. */
export function translated<Field extends string>(
  original: string,
  translations: Partial<Record<TranslatedLanguage, Partial<Record<Field, string>>>> | undefined,
  language: MenuLanguage,
  field: Field,
): string {
  if (language === "pt") return original;
  return translations?.[language]?.[field] || original;
}

/** "Mesa 3" as the customer reads it ("Table 3"); any other table name as it is. */
export function tableLabel(name: string, language: MenuLanguage): string {
  const match = /^mesa\s+(\S.*)$/i.exec(name.trim());
  return match ? `${menuText[language].table} ${match[1]}` : name;
}

// The menu's own words --------------------------------------------------------------------------------

export interface MenuText {
  /** The section count under a section's name. */
  dishes: (count: number) => string;
  /** The bar without a named section. */
  menu: string;
  otherDishes: string;
  sectionAria: (name: string) => string;
  openMenu: string;
  closeMenu: string;
  sections: string;
  instagram: (handle: string) => string;
  fullScreen: (dish: string) => string;
  demo: string;
  add: string;
  addAria: (dish: string) => string;
  addMoreAria: (dish: string, count: number) => string;
  close: string;
  slideAria: (index: number, total: number, dish: string) => string;
  language: string;
  languageAria: (name: string) => string;
  table: string;
}

export const menuText: Record<MenuLanguage, MenuText> = {
  pt: {
    dishes: (count) => `${count} ${count === 1 ? "prato" : "pratos"}`,
    menu: "Menu",
    otherDishes: "outros pratos",
    sectionAria: (name) => `Secção: ${name}. Ver as secções do menu`,
    openMenu: "Abrir o menu",
    closeMenu: "Fechar o menu",
    sections: "Secções do menu",
    instagram: (handle) => `@${handle} no Instagram`,
    fullScreen: (dish) => `Ver em ecrã inteiro: ${dish}`,
    demo: "Menu de demonstração: vídeos de banco de imagens e preços de exemplo.",
    add: "Adicionar",
    addAria: (dish) => `Adicionar ao pedido: ${dish}`,
    addMoreAria: (dish, count) => `Adicionar mais um: ${dish} (${count} no pedido)`,
    close: "Fechar",
    slideAria: (index, total, dish) => `${index} de ${total}: ${dish}`,
    language: "Idioma",
    languageAria: (name) => `Idioma: ${name}. Mudar de idioma`,
    table: "Mesa",
  },
  en: {
    dishes: (count) => `${count} ${count === 1 ? "dish" : "dishes"}`,
    menu: "Menu",
    otherDishes: "more dishes",
    sectionAria: (name) => `Section: ${name}. See the menu's sections`,
    openMenu: "Open the menu",
    closeMenu: "Close the menu",
    sections: "Menu sections",
    instagram: (handle) => `@${handle} on Instagram`,
    fullScreen: (dish) => `View full screen: ${dish}`,
    demo: "Demo menu: stock videos and sample prices.",
    add: "Add",
    addAria: (dish) => `Add to the order: ${dish}`,
    addMoreAria: (dish, count) => `Add one more: ${dish} (${count} in the order)`,
    close: "Close",
    slideAria: (index, total, dish) => `${index} of ${total}: ${dish}`,
    language: "Language",
    languageAria: (name) => `Language: ${name}. Change language`,
    table: "Table",
  },
  es: {
    dishes: (count) => `${count} ${count === 1 ? "plato" : "platos"}`,
    menu: "Carta",
    otherDishes: "más platos",
    sectionAria: (name) => `Sección: ${name}. Ver las secciones de la carta`,
    openMenu: "Abrir la carta",
    closeMenu: "Cerrar la carta",
    sections: "Secciones de la carta",
    instagram: (handle) => `@${handle} en Instagram`,
    fullScreen: (dish) => `Ver en pantalla completa: ${dish}`,
    demo: "Carta de demostración: vídeos de banco de imágenes y precios de ejemplo.",
    add: "Añadir",
    addAria: (dish) => `Añadir al pedido: ${dish}`,
    addMoreAria: (dish, count) => `Añadir uno más: ${dish} (${count} en el pedido)`,
    close: "Cerrar",
    slideAria: (index, total, dish) => `${index} de ${total}: ${dish}`,
    language: "Idioma",
    languageAria: (name) => `Idioma: ${name}. Cambiar de idioma`,
    table: "Mesa",
  },
  fr: {
    dishes: (count) => `${count} ${count === 1 ? "plat" : "plats"}`,
    menu: "Carte",
    otherDishes: "autres plats",
    sectionAria: (name) => `Rubrique : ${name}. Voir les rubriques de la carte`,
    openMenu: "Ouvrir la carte",
    closeMenu: "Fermer la carte",
    sections: "Rubriques de la carte",
    instagram: (handle) => `@${handle} sur Instagram`,
    fullScreen: (dish) => `Voir en plein écran : ${dish}`,
    demo: "Carte de démonstration : vidéos de banque d’images et prix d’exemple.",
    add: "Ajouter",
    addAria: (dish) => `Ajouter à la commande : ${dish}`,
    addMoreAria: (dish, count) => `En ajouter un : ${dish} (${count} dans la commande)`,
    close: "Fermer",
    slideAria: (index, total, dish) => `${index} sur ${total} : ${dish}`,
    language: "Langue",
    languageAria: (name) => `Langue : ${name}. Changer de langue`,
    table: "Table",
  },
  de: {
    dishes: (count) => `${count} ${count === 1 ? "Gericht" : "Gerichte"}`,
    menu: "Speisekarte",
    otherDishes: "weitere Gerichte",
    sectionAria: (name) => `Rubrik: ${name}. Rubriken der Speisekarte ansehen`,
    openMenu: "Speisekarte öffnen",
    closeMenu: "Speisekarte schließen",
    sections: "Rubriken der Speisekarte",
    instagram: (handle) => `@${handle} auf Instagram`,
    fullScreen: (dish) => `Im Vollbild ansehen: ${dish}`,
    demo: "Demo-Speisekarte: Archivvideos und Beispielpreise.",
    add: "Hinzufügen",
    addAria: (dish) => `Zur Bestellung hinzufügen: ${dish}`,
    addMoreAria: (dish, count) => `Noch eins hinzufügen: ${dish} (${count} in der Bestellung)`,
    close: "Schließen",
    slideAria: (index, total, dish) => `${index} von ${total}: ${dish}`,
    language: "Sprache",
    languageAria: (name) => `Sprache: ${name}. Sprache ändern`,
    table: "Tisch",
  },
  it: {
    dishes: (count) => `${count} ${count === 1 ? "piatto" : "piatti"}`,
    menu: "Menù",
    otherDishes: "altri piatti",
    sectionAria: (name) => `Sezione: ${name}. Vedi le sezioni del menù`,
    openMenu: "Apri il menù",
    closeMenu: "Chiudi il menù",
    sections: "Sezioni del menù",
    instagram: (handle) => `@${handle} su Instagram`,
    fullScreen: (dish) => `Guarda a schermo intero: ${dish}`,
    demo: "Menù dimostrativo: video d’archivio e prezzi d’esempio.",
    add: "Aggiungi",
    addAria: (dish) => `Aggiungi all’ordine: ${dish}`,
    addMoreAria: (dish, count) => `Aggiungine un altro: ${dish} (${count} nell’ordine)`,
    close: "Chiudi",
    slideAria: (index, total, dish) => `${index} di ${total}: ${dish}`,
    language: "Lingua",
    languageAria: (name) => `Lingua: ${name}. Cambia lingua`,
    table: "Tavolo",
  },
};

const priceFormats = new Map<MenuLanguage, Intl.NumberFormat>();
/** Euros as the language writes them: "10,50 €", "€10.50", "10,50 €"… (always euros, same amount). */
export function formatMenuPrice(euros: number, language: MenuLanguage): string {
  let format = priceFormats.get(language);
  if (!format) {
    format = new Intl.NumberFormat(languageLocales[language], { style: "currency", currency: "EUR" });
    priceFormats.set(language, format);
  }
  return format.format(euros);
}

// The menu in one language ---------------------------------------------------------------------------

/**
 * The menu with its dishes' names and descriptions and its sections' names in `language` (each one
 * without a translation stays in Portuguese). The same object for Portuguese; the dishes keep their
 * keys, videos and prices, so nothing on the page is rebuilt but the words.
 */
export function localizeMenu(menu: VideoMenuData, language: MenuLanguage): VideoMenuData {
  if (language === "pt") return menu;
  const dishes: VideoMenuData["dishes"] = {};
  for (const [key, dish] of Object.entries(menu.dishes)) {
    const words = dish.translations?.[language];
    dishes[key] = words?.name || words?.description ? { ...dish, name: words.name || dish.name, description: words.description || dish.description } : dish;
  }
  const collections = menu.collections.map((collection) => {
    const name = collection.name ? collection.translations?.[language]?.name : undefined;
    return name ? { ...collection, name } : collection;
  });
  return { ...menu, dishes, collections };
}
