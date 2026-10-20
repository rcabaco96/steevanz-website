import { notFound } from "next/navigation";
import { isPrefixedLocale, prefixedLocales, type PrefixedLocale } from "./i18n";

// The routes of the prefixed languages, app/(intl)/[lang]: /en, /es, /fr, /de and /it share one tree
// (Portuguese, without a prefix, lives in app/(pt)).

export type LangParams = Promise<{ lang: string }>;

/** The static params of the [lang] segment. */
export function langStaticParams(): { lang: PrefixedLocale }[] {
  return prefixedLocales.map((lang) => ({ lang }));
}

/** The page's language from its params (404 for anything that isn't one of the five). */
export async function localeOf(params: LangParams): Promise<PrefixedLocale> {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return lang;
}

/** The language of a nested generateStaticParams' parent params (none for an unknown one). */
export function staticLocale(params: { lang: string }): PrefixedLocale | null {
  return isPrefixedLocale(params.lang) ? params.lang : null;
}
