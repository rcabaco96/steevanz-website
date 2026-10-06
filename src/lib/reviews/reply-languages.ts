/**
 * Languages of the replies. Business rule: a review with text is answered in its own language
 * (when we have base sentences in it) and the owner sees the Portuguese translation underneath.
 * Everything is local and free: Google's language code when the review came with one, else a small
 * stopword detector. No translation service: the Portuguese text is the same sentences composed in
 * Portuguese (see reply-translations.ts). Pure module so it can be tested with node --test.
 */
import { normalize, type ThemeId } from "./text.ts";

export const replyLanguages = ["pt", "en", "es", "fr", "de", "it", "nl"] as const;
export type ReplyLanguage = (typeof replyLanguages)[number];
export type ForeignLanguage = Exclude<ReplyLanguage, "pt">;

/** Names as the owner reads them (pt-PT). */
export const languageNames: Record<ReplyLanguage, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  de: "Alemão",
  it: "Italiano",
  nl: "Neerlandês",
};

export const isReplyLanguage = (value: unknown): value is ReplyLanguage => typeof value === "string" && (replyLanguages as readonly string[]).includes(value);

/**
 * Frequent words of each language, without accents (as normalize leaves them). A word listed in
 * several languages counts less (1 / number of languages), so "de" or "que" barely decide anything.
 */
const stopwords: Record<ReplyLanguage, string> = {
  pt:
    "o os as e que de do da dos das em no na nos nas um uma com para muito muita muitos foi estava estavam nao mas bem mais ja tambem sao ao aos pelo pela " +
    "pelos pelas tudo sempre aqui isso isto este esta eu voce obrigado obrigada otimo otima bom boa atendimento comida simpatico simpatica simpaticos " +
    "recomendo voltar voltaremos lugar excelente espaco preco servico ate onde quando porque fomos tem tinha sem so",
  en:
    "the and was were very we our is it with for great staff food really you they had but not this of to in my at be are have has so all here there " +
    "place nice good friendly delicious service would will recommend definitely lovely amazing back an i me which from",
  es:
    "el los las y que de del en un una con para muy fue estaba estaban no pero bien mas ya tambien son al por todo toda todos siempre aqui eso esto este " +
    "esta yo usted gracias buena bueno buenos buenas atencion servicio comida lugar recomiendo volver volveremos hay es lo se me nos le les sin solo " +
    "precio personal fuimos tiene hemos",
  fr:
    "le la les et que de du des en un une avec pour tres etait etaient ne pas mais bien plus deja aussi sont au aux par tout toute tous toujours ici ce " +
    "cette ces je nous vous il elle on est c j qu d l n merci bon bonne accueil personnel repas lieu recommande reviendrons sur dans ont avons ete chez " +
    "votre notre",
  de:
    "der die das und ist war sehr mit fur nicht ein eine einen einem auch aber wir ich es den dem des zu im auf sich gut essen freundlich freundliches " +
    "lecker wieder immer hier alles bedienung sind waren uns haben hat kann wie noch nur mal schon vom zum zur gerne toll empfehlen absolut wirklich",
  it:
    "il lo la i gli le e che di del della dei delle in un una con per molto molta era erano non ma bene piu anche sono al alla tutto tutti sempre qui " +
    "questo questa io noi cibo servizio buono buona ottimo ottima personale gentile gentili ho abbiamo siamo stato stata consiglio locale prezzo prezzi " +
    "davvero tornare torneremo grazie",
  nl:
    "de het een en is was zeer heel met voor niet ook maar wij we ik er van op te in lekker goed eten vriendelijk vriendelijke personeel zijn waren " +
    "hebben heeft nog wel dat die deze bij naar aan om als echt zeker aanrader mooi gezellig erg ons onze",
};

const wordLanguages = new Map<string, ReplyLanguage[]>();
for (const language of replyLanguages) {
  for (const word of new Set(stopwords[language].split(" "))) wordLanguages.set(word, [...(wordLanguages.get(word) ?? []), language]);
}

/** Fewer words than this and the detector does not guess. */
export const minDetectWords = 3;

/**
 * Language of a text from its frequent words, or null when unsure: too short, too few known
 * words, or no clear winner (the best must score at least 1.5 and 1.5× the second).
 */
export function detectLanguage(text: string | null): ReplyLanguage | null {
  const words = normalize(text ?? "").split(/\s+/).filter(Boolean);
  if (words.length < minDetectWords) return null;
  const scores = new Map<ReplyLanguage, number>();
  for (const word of words) {
    const languages = wordLanguages.get(word);
    if (!languages) continue;
    for (const language of languages) scores.set(language, (scores.get(language) ?? 0) + 1 / languages.length);
  }
  const [best, second] = [...scores].sort((a, b) => b[1] - a[1]);
  if (!best || best[1] < 1.5 || (second && best[1] < second[1] * 1.5)) return null;
  return best[0];
}

/** "pt-PT" → "pt", "zh-Hans" → "zh"; null without a code. */
export function languageCode(value: string | null | undefined): string | null {
  return value?.trim().toLowerCase().split(/[-_]/)[0] || null;
}

/**
 * Business rule for the language of a reply:
 * - no text (stars only) → Portuguese, as always;
 * - Google's language code for the review (google_reviews.language, e.g. "ru", "pl") is a language
 *   we have no base sentences for → English, the one tourists read most;
 * - else the local detector when it is sure (Google's code is sometimes the reviewer's account
 *   language: English texts marked "pt" exist), then Google's code ("en", "pt-PT"…), then Portuguese.
 */
export function replyLanguage(text: string | null, googleLanguage?: string | null): ReplyLanguage {
  if (!text?.trim()) return "pt";
  const code = languageCode(googleLanguage);
  if (code && !isReplyLanguage(code)) return "en";
  return detectLanguage(text) ?? (isReplyLanguage(code) ? code : "pt");
}

/**
 * Themes in a foreign review, in the order they are first mentioned (like themesByMention, which
 * only knows Portuguese and some English). Words without accents, as normalize leaves them.
 */
const themePatterns: Record<ForeignLanguage, Record<ThemeId, RegExp>> = {
  en: {
    service: /\b(staff|service|waiter\w*|waitress\w*|server\w*|friendly|helpful|rude|welcom\w*|host\w*|attentive)\b/,
    quality: /\b(food|tasty|yummy|delicious|quality|fresh|coffee|meals?|dish\w*|flavou?r\w*|taste\w*|cakes?|pastr\w*|wine|cuisine|fish|seafood|breakfast|lunch|dinner)\b/,
    price: /\b(prices?|priced|pricey|expensive|cheap|value|overpriced|cost\w*|bill|affordable)\b/,
    waiting: /\b(wait\w*|slow\w*|quick\w*|fast|queue\w*|minutes|delay\w*)\b/,
    cleanliness: /\b(clean\w*|dirty|hygien\w*|toilets?|bathrooms?|restrooms?)\b/,
    ambience: /\b(atmosphere|cozy|cosy|noisy|vibe|decor\w*|music|ambiance|ambience|terrace|interior)\b/,
    location: /\b(location|parking|located|central|views?)\b/,
  },
  es: {
    service: /\b(atencion|personal|camarer\w*|servicio|amabl\w*|simpatic\w*|trato|maleducad\w*|antipatic\w*)\b/,
    quality: /\b(comida|cocina|platos?|sabor\w*|delicios\w*|calidad|fresc\w*|cafe|rico|rica|tapas?|pescados?|marisco\w*)\b/,
    price: /\b(precios?|caros?|caras?|barat\w*|cuenta|valor)\b/,
    waiting: /\b(espera\w*|esperar|tard\w*|rapid\w*|lent\w*|cola|minutos)\b/,
    cleanliness: /\b(limpi\w*|suci\w*|higiene|banos?|aseos?)\b/,
    ambience: /\b(ambiente|espacio|decoracion|acogedor\w*|ruido\w*|musica|terraza|comod\w*)\b/,
    location: /\b(ubicacion|aparcamiento|aparcar|parking|centro|cerca|acceso|situad\w*)\b/,
  },
  fr: {
    service: /\b(accueil\w*|personnel|serveu\w*|service|sympa\w*|aimable\w*|souriant\w*|desagreable\w*)\b/,
    quality: /\b(nourriture|cuisine|plats?|saveur\w*|delicieu\w*|qualite|frais|fraiche\w*|cafe|repas|gout\w*|poissons?|fruits de mer)\b/,
    price: /\b(prix|chers?|cheres?|abordable\w*|addition)\b/,
    waiting: /\b(attente|attendre|attendu\w*|rapide\w*|lent\w*|minutes|longtemps)\b/,
    cleanliness: /\b(propre\w*|sales?|salete|hygiene|toilettes?)\b/,
    ambience: /\b(ambiance|cadre|decor\w*|cosy|bruit\w*|bruyant\w*|musique|terrasse|confortable\w*|chaleureu\w*)\b/,
    location: /\b(emplacement|situe\w*|parking|stationnement|centre|acces|proche)\b/,
  },
  de: {
    service: /\b(service|bedienung|personal|freundlich\w*|kellner\w*|unfreundlich\w*|aufmerksam\w*|hilfsbereit\w*|nett\w*)\b/,
    quality: /\b(essen|kuche|gericht\w*|lecker\w*|geschmack\w*|qualitat|frisch\w*|kaffee|kuchen|kostlich\w*|fisch\w*|tapas)\b/,
    price: /\b(preis\w*|teuer\w*|gunstig\w*|billig\w*|rechnung)\b/,
    waiting: /\b(warte\w*|warten|gewartet|schnell\w*|langsam\w*|minuten)\b/,
    cleanliness: /\b(sauber\w*|schmutzig\w*|dreckig\w*|hygiene|toilette\w*)\b/,
    ambience: /\b(ambiente|atmosphare|gemutlich\w*|einrichtung|laut\w*|musik|terrasse)\b/,
    location: /\b(lage|parkplatz\w*|parken|zentral\w*|erreichbar\w*|zentrum)\b/,
  },
  it: {
    service: /\b(servizio|personale|camerier\w*|gentil\w*|cordial\w*|accoglienza|simpatic\w*|scortes\w*)\b/,
    quality: /\b(cibo|cucina|piatt\w*|sapor\w*|delizios\w*|qualita|fresc\w*|caffe|pesce)\b/,
    price: /\b(prezz\w*|car[oaie]|economic\w*|conto)\b/,
    waiting: /\b(attesa|aspettat\w*|aspettare|veloc\w*|rapid\w*|lent\w*|minuti)\b/,
    cleanliness: /\b(pulit\w*|pulizia|sporc\w*|igiene|bagn\w*)\b/,
    ambience: /\b(atmosfera|ambiente|arredament\w*|rumoros\w*|musica|terrazza|accoglient\w*)\b/,
    location: /\b(posizione|parcheggi\w*|centro|vicin\w*|raggiungibil\w*)\b/,
  },
  nl: {
    service: /\b(bediening|personeel|service|vriendelijk\w*|onvriendelijk\w*|behulpzaam|gastvrij\w*)\b/,
    quality: /\b(eten|keuken|gerecht\w*|lekker\w*|heerlijk\w*|smaak\w*|kwaliteit|verse?|koffie|taart|vis)\b/,
    price: /\b(prijs\w*|prijzen|duur|goedkoop|rekening|betaalbaar)\b/,
    waiting: /\b(wacht\w*|snel\w*|traag|langzaam|minuten)\b/,
    cleanliness: /\b(schoon|vies\w*|smerig|hygiene|toilet\w*)\b/,
    ambience: /\b(sfeer\w*|gezellig\w*|inrichting|lawaai\w*|muziek|terras)\b/,
    location: /\b(locatie|ligging|parkeren|parkeerplaats\w*|centrum|bereikbaar\w*)\b/,
  },
};

export function themesInLanguage(text: string | null, language: ForeignLanguage): ThemeId[] {
  if (!text) return [];
  const value = normalize(text);
  return (Object.entries(themePatterns[language]) as [ThemeId, RegExp][])
    .map(([theme, pattern]) => ({ theme, index: value.search(pattern) }))
    .filter((item) => item.index >= 0)
    .sort((x, y) => x.index - y.index)
    .map((item) => item.theme);
}
