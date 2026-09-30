export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

export type Localized<T> = Record<Locale, T>;

export const defaultLocale: Locale = "pt";

export const htmlLang: Localized<string> = {
  pt: "pt-PT",
  en: "en",
};

export const ogLocale: Localized<string> = {
  pt: "pt_PT",
  en: "en_GB",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
