// Text helpers for matching customer messages without any paid service: lower case, no accents,
// words only. Pure module (tested in tests/chatbot.test.mjs).

/** "Olá! Qual é a password do Wi-Fi?" → "ola qual e a password do wi fi". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function words(text: string): string[] {
  const normalized = normalize(text);
  return normalized ? normalized.split(" ") : [];
}

/**
 * Words that carry no meaning for search, in the six languages (already normalized). Kept short on
 * purpose: words like «onde», «quanto» or «where» stay, because intents use them.
 */
const stopwords = new Set(
  (
    "a o as os um uma uns umas de do da dos das no na nos nas em e ou que se por para com ao aos " +
    "ja la lhe me te eu tu ele ela nos vos eles elas meu minha seu sua isto isso esse essa este esta " +
    "the an of to in on at for by and or is are be it this that with my your our i you we me us do does " +
    "el la los las un una unos unas del al en y o es son lo le mi tu su con por para " +
    "le la les un une des du de et ou est sont ce cette mon ton son je tu il elle nous vous au aux " +
    "der die das ein eine einen dem den des und oder ist sind ich du er sie es wir ihr mit fur von zu im am " +
    "il lo la gli le un uno una di del della e o sono io tu lui lei noi voi con per al alla nel " +
    // Portuguese contractions («num degradê», «duma vez»).
    "num numa nuns numas dum duma duns dumas"
  ).split(" "),
);

export function isStopword(word: string): boolean {
  return stopwords.has(word);
}

/** Words worth searching with: normalized, without stopwords and one-letter words. */
export function searchWords(text: string): string[] {
  return words(text).filter((word) => word.length > 1 && !stopwords.has(word));
}

/** A light stem so «reservas»/«reserva», «pratos»/«prato» and «cães»/«cão» meet: drops a plural ending. */
export function stem(word: string): string {
  // Portuguese plurals in «-ães»/«-ões» (cães → cão, botões → botão; accents already removed).
  if (word.length > 3 && (word.endsWith("aes") || word.endsWith("oes"))) return `${word.slice(0, -3)}ao`;
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/** Two words are the same for search when their stems match or share a long beginning. */
export function sameWord(a: string, b: string): boolean {
  if (a === b) return true;
  const sa = stem(a);
  const sb = stem(b);
  if (sa === sb) return true;
  const shortest = Math.min(sa.length, sb.length);
  return shortest >= 5 && sa.slice(0, 5) === sb.slice(0, 5) && Math.abs(sa.length - sb.length) <= 4;
}

/**
 * Whether a normalized text contains a keyword. A keyword is one or more words; a word ending in
 * "*" matches any word starting with it ("reserv*" → reserva, reservation, reservieren).
 */
export function hasKeyword(normalizedText: string, keyword: string): boolean {
  const textWords = normalizedText ? normalizedText.split(" ") : [];
  const parts = keyword.split(" ").filter(Boolean);
  if (!parts.length || parts.length > textWords.length) return false;
  const matches = (word: string, part: string) => (part.endsWith("*") ? word.startsWith(part.slice(0, -1)) : word === part);
  for (let start = 0; start + parts.length <= textWords.length; start++) {
    if (parts.every((part, offset) => matches(textWords[start + offset], part))) return true;
  }
  return false;
}

export function hasAnyKeyword(normalizedText: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => hasKeyword(normalizedText, keyword));
}

/** Money as people read it in the chat: "12,50 €" (pt, es, fr, de, it) or "€12.50" (en). */
export function formatPrice(cents: number, language: string): string {
  const euros = cents / 100;
  const whole = Number.isInteger(euros);
  const locale = { pt: "pt-PT", en: "en-IE", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT" }[language] ?? "pt-PT";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(euros);
}

/** Cuts a text for previews and summaries without breaking a word. */
export function shorten(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
