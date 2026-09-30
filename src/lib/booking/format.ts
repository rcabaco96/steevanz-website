import type { Locale } from "@/lib/i18n";

const intlLocale: Record<Locale, string> = { pt: "pt-PT", en: "en-GB" };

export function formatSlotDate(iso: string, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

export function formatSlotTime(iso: string, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export function formatSlotRange(startIso: string, endIso: string, locale: Locale, timeZone: string): string {
  const date = formatSlotDate(startIso, locale, timeZone);
  return `${date}, ${formatSlotTime(startIso, locale, timeZone)}–${formatSlotTime(endIso, locale, timeZone)}`;
}

export function formatMonth(date: string, locale: Locale): string {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function formatLongDate(date: string, locale: Locale): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
