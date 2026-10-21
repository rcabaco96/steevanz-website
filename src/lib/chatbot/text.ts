// Text helpers for matching customer messages without any paid service: lower case, no accents,
// words only. Pure module (tested in tests/chatbot.test.mjs).

/** "Olá! Qual é a password do Wi-Fi?" → "ola qual e a password do wi fi". */
export function normalize(text: string): string {
  return text
    // «lã» / «lãs» (wool) would become «la» / «las», Spanish and French articles: written as the Spanish «lana».
    .replace(/(?<!\p{L})l[ãÃ](s?)(?!\p{L})/giu, "lana$1")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Words written in two parts that mean one thing: «check-in» ≠ «check-out» once «in» (a stopword) is gone. */
const compounds: [RegExp, string][] = [
  [/\bcheck (in|out)\b/g, "check$1"],
  [/\bwi fi\b/g, "wifi"],
  [/\be mail\b/g, "email"],
  [/\bmb way\b/g, "mbway"],
];

export function words(text: string): string[] {
  let normalized = normalize(text);
  for (const [pattern, joined] of compounds) normalized = normalized.replace(pattern, joined);
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
    "num numa nuns numas dum duma duns dumas " +
    // Possessives («o nosso bolo», «notre table»).
    "nosso nossa nossos nossas vosso vossa vossos vossas nuestro nuestra nuestros nuestras notre nos votre vos unser unsere euer eure nostro nostra nostri vostro vostra " +
    // «sem glúten», «sobre nós»: «without» and «about» never say what a message is about (and «sobre» would
    // meet «sobremesas» in the light stemming).
    "sem sobre sin sans ohne senza without"
  ).split(" "),
);

export function isStopword(word: string): boolean {
  return stopwords.has(word);
}

/** Words worth searching with: normalized, without stopwords and one-letter words. */
export function searchWords(text: string): string[] {
  return words(text).filter((word) => word.length > 1 && !stopwords.has(word));
}

/** Irregular Portuguese participles and their verb («já estão abertos» ↔ «por abrir»). */
const participles = new Map(
  Object.entries({ abrir: ["aberto", "aberta", "abertos", "abertas"], cobrir: ["coberto", "coberta", "cobertos", "cobertas"], escrever: ["escrito", "escrita", "escritos", "escritas"] }).flatMap(([verb, forms]) =>
    forms.map((form) => [form, verb] as const),
  ),
);

/** A light stem so «reservas»/«reserva», «pratos»/«prato», «cães»/«cão» and «abertos»/«abrir» meet: drops a plural ending. */
export function stem(word: string): string {
  const verb = participles.get(word);
  if (verb) return verb;
  // Portuguese plurals in «-ães»/«-ões» (cães → cão, botões → botão; accents already removed).
  if (word.length > 3 && (word.endsWith("aes") || word.endsWith("oes"))) return `${word.slice(0, -3)}ao`;
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/** Verb and noun endings of Portuguese and Spanish (accents removed): «avisar», «avisem», «avisaram» and «aviso» share «avis». */
// Not «-a»/«-e» alone: «corte» (a cut) and «cortar» stay apart, so do «porta» and «porto».
const inflections = ["aram", "eram", "amos", "emos", "imos", "ando", "endo", "indo", "ados", "adas", "idos", "idas", "ado", "ada", "ido", "ida", "ar", "er", "ir", "am", "em", "ou", "ei", "o"];

/** A word without its verb or noun ending, when at least 4 letters stay («avisem» → «avis», «chegada» → «cheg»; «porto» stays). */
export function inflectionRoot(word: string): string {
  for (const ending of inflections) if (word.length - ending.length >= 4 && word.endsWith(ending)) return word.slice(0, -ending.length);
  return word;
}

/** Two words are the same for search when their stems or roots match or share a long beginning. */
export function sameWord(a: string, b: string): boolean {
  if (a === b) return true;
  const sa = stem(a);
  const sb = stem(b);
  if (sa === sb) return true;
  // Two forms of a verb («avisar» / «avisem», «fechado» / «fechamos»): both lose an ending and meet («cortar» and «cortes» don't).
  const ra = inflectionRoot(sa);
  const rb = inflectionRoot(sb);
  if (ra !== sa && rb !== sb && ra === rb) return true;
  // A long shared beginning («estacionar» / «estacionamento», «atraso» / «atrasado»), but not one that leaves the
  // shorter word with two letters of its own («checkin» / «checkout»).
  const shortest = Math.min(sa.length, sb.length);
  let shared = 0;
  while (shared < shortest && sa[shared] === sb[shared]) shared++;
  return shared >= Math.max(5, shortest - 1) && Math.abs(sa.length - sb.length) <= 4;
}

/**
 * Whether a normalized text contains a keyword. A keyword is one or more words; a word ending in
 * "*" matches any word starting with it ("reserv*" → reserva, reservation, reservieren).
 */
export function hasKeyword(normalizedText: string, keyword: string): boolean {
  return keywordStarts(normalizedText ? normalizedText.split(" ") : [], keyword, true).length > 0;
}

/** Where a keyword (one or more words, "*" = word beginning) starts in a list of normalized words (all places, or the first). */
export function keywordStarts(textWords: readonly string[], keyword: string, firstOnly = false): number[] {
  const parts = keyword.split(" ").filter(Boolean);
  const starts: number[] = [];
  if (!parts.length || parts.length > textWords.length) return starts;
  const matches = (word: string, part: string) => (part.endsWith("*") ? word.startsWith(part.slice(0, -1)) : word === part);
  for (let start = 0; start + parts.length <= textWords.length; start++) {
    if (parts.every((part, offset) => matches(textWords[start + offset], part))) {
      starts.push(start);
      if (firstOnly) break;
    }
  }
  return starts;
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
