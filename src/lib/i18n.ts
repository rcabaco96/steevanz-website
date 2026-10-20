// The site's six languages (owner, 2026-10-20), the same as the video menu's: Portuguese (default, no
// prefix) and English, Spanish, French, German and Italian under /en, /es, /fr, /de and /it.
//
// Every content record has Portuguese and English. Spanish, French, German and Italian are added
// record by record: until a record has its own translation, those languages show the English one
// (`localize`), so every page works in all six from day one. Pure module (no imports): tests run it.

export const locales = ["pt", "en", "es", "fr", "de", "it"] as const;

export type Locale = (typeof locales)[number];

/** The two languages every record must have. */
export type BaseLocale = "pt" | "en";

/** The languages that may still be missing in a record (they fall back to English). */
export type ExtraLocale = Exclude<Locale, BaseLocale>;

export const extraLocales: readonly ExtraLocale[] = ["es", "fr", "de", "it"];

export const defaultLocale = "pt" satisfies Locale;

/** What a missing Spanish, French, German or Italian text shows instead. */
export const fallbackLocale = "en" satisfies BaseLocale;

/** The locales with a URL prefix (/en, /es, …): every one but Portuguese. */
export type PrefixedLocale = Exclude<Locale, "pt">;

export const prefixedLocales: readonly PrefixedLocale[] = ["en", "es", "fr", "de", "it"];

/** A text (or any value) in every language: pt and en always, the others when translated. */
export type Localized<T> = Record<BaseLocale, T> & Partial<Record<ExtraLocale, T>>;

/**
 * Like `Localized`, but a translation may cover only some of the fields (e.g. a product's name and
 * tagline before its whole page is translated): the missing fields come from English.
 */
export type LocalizedPartial<T> = Record<BaseLocale, T> & Partial<Record<ExtraLocale, Partial<T>>>;

/** The value in `locale`, or the English one when that language isn't there yet. */
export function localize<T>(record: Localized<T>, locale: Locale): T {
  return record[locale] ?? record[fallbackLocale];
}

/** The fields translated into `locale` over the English ones. */
export function localizePartial<T extends object>(record: LocalizedPartial<T>, locale: Locale): T {
  if (locale === "pt" || locale === "en") return record[locale];
  const own = record[locale];
  return own ? { ...record[fallbackLocale], ...own } : record[fallbackLocale];
}

/** Whether `locale` has its own value in the record (no fallback). */
export function isTranslated(record: Partial<Record<Locale, unknown>>, locale: Locale): boolean {
  return record[locale] !== undefined;
}

/** pt stays pt; every other language is closest to English (emails, stored rows, Portuguese-or-English data). */
export function baseLocaleOf(locale: Locale): BaseLocale {
  return locale === "pt" ? "pt" : "en";
}

export const htmlLang: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
};

export const ogLocale: Record<Locale, string> = {
  pt: "pt_PT",
  en: "en_GB",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
};

/** For Intl.NumberFormat (prices: «20 €», «€20»). */
export const numberLocale: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en-IE",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

/** For Intl.DateTimeFormat (booking dates). */
export const dateLocale: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

/** Each language in its own words, for the language picker. */
export const nativeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (prefixedLocales as readonly string[]).includes(value);
}
