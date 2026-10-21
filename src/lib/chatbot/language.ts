// Which of the six site languages a customer wrote in, from common words and letters. Free and
// instant (no model): good enough for chat messages, and when it can't tell it keeps the language
// of the conversation. Pure module (tests/chatbot.test.mjs).
import { normalize } from "./text.ts";
import type { ChatbotLanguage } from "./types.ts";

/** Words that point to one language (normalized: no accents). Words shared by several are left out. */
const markers: Record<ChatbotLanguage, string[]> = {
  pt: (
    "ola oi obrigado obrigada voces voce nao sim tem tens estao esta onde qual quais quanto quanta custa fica " +
    "aberto abertos abrem fecham hoje amanha bom boa dia tarde noite ate posso pode queria gostaria ha " +
    "estacionamento mesa pessoas sao umas uns tambem muito obg pf favor gostava preciso fazer marcacao ementa " +
    "pequeno almoco chave chaves casa aqui ai lugar lugares jantar almocar almoco precos preco horario uma um quero " +
    "segunda terca quarta quinta sexta feira cabelo cortar marcar reserva fazem fazer voces obrigadinho telemovel " +
    "estacionar pagar crianca criancas filho filha depois antes entao isso esse essa"
  ).split(" "),
  en: (
    "hello hi hey thanks thank you please do does have has where what when how much open close closed today tomorrow " +
    "good morning evening night can could would like need book table people the is are there any your our we " +
    "parking menu price prices hours time check out wifi password key keys house here dinner lunch breakfast"
  ).split(" "),
  es: (
    "hola gracias usted ustedes tiene tienen donde cuanto cuanta cuesta abierto abren cierran hoy manana " +
    "buenos buenas dias tardes noches puedo puede queria quisiera hay aparcamiento mesa personas muy tambien " +
    "el los las del una es son esta estan cuando carta precio precios horario llave llaves cena comida quiero " +
    "desayuno aqui necesito"
  ).split(" "),
  fr: (
    "bonjour bonsoir salut merci vous avez etes est ou quand combien ouvert ouverts ouvrez fermez fermes aujourd hui " +
    "demain je voudrais peux pouvez une des les du au aux table personnes tres aussi le la reserver carte prix " +
    "horaires heure cle cles ici diner dejeuner petit pas plait besoin"
  ).split(" "),
  de: (
    "hallo guten tag morgen abend danke bitte sie haben ist sind wo wann wie viel kostet geoffnet offen geschlossen " +
    "heute ich mochte moechte konnen kann ein eine der die das und tisch personen sehr auch reservieren speisekarte " +
    "preis preise offnungszeiten uhr schlussel hier abendessen mittagessen fruhstuck gibt es nicht brauche"
  ).split(" "),
  it: (
    "ciao buongiorno buonasera salve grazie lei avete siete dove quando quanto costa aperto aperti chiuso chiusi oggi domani " +
    "vorrei posso potete un una il gli della tavolo persone molto anche prenotare menu prezzo prezzi orari orario " +
    "chiave chiavi qui cena pranzo colazione favore non bisogno"
  ).split(" "),
};

const markerSets = Object.fromEntries(Object.entries(markers).map(([language, list]) => [language, new Set(list)])) as Record<
  ChatbotLanguage,
  Set<string>
>;

/** Letters that only (or mostly) one of the six languages uses. */
const letterHints: [ChatbotLanguage, RegExp, number][] = [
  ["pt", /[ãõ]/, 3],
  ["pt", /ç(?=[ãõao])/, 1],
  ["es", /[ñ¿¡]/, 3],
  ["de", /[ßäöü]/, 3],
  ["fr", /[êœûëî]|ç(?=[ae])/, 2],
  ["it", /(^|[\s(])(è|perché|più|può|città|caffè|c'è)(?=$|[\s?!.,)])/, 3],
];

export interface LanguageGuess {
  language: ChatbotLanguage | null;
  /** How sure: the winner's score minus the runner-up's (0 = can't tell). */
  margin: number;
}

/** How much a message looks like each language (letters and common words). */
export function languageScores(text: string): Record<ChatbotLanguage, number> {
  const scores: Record<ChatbotLanguage, number> = { pt: 0, en: 0, es: 0, fr: 0, de: 0, it: 0 };
  const lower = text.toLowerCase();
  for (const [language, pattern, weight] of letterHints) if (pattern.test(lower)) scores[language] += weight;
  for (const word of normalize(text).split(" ")) {
    if (!word) continue;
    for (const language of Object.keys(markerSets) as ChatbotLanguage[]) if (markerSets[language].has(word)) scores[language] += 1;
  }
  return scores;
}

/** The language of one message, or null when the words don't say (e.g. «ok», «123», an emoji). */
export function guessLanguage(text: string): LanguageGuess {
  const ranked = (Object.entries(languageScores(text)) as [ChatbotLanguage, number][]).sort((a, b) => b[1] - a[1]);
  const [first, second] = ranked;
  if (first[1] === 0 || first[1] === second[1]) return { language: null, margin: 0 };
  return { language: first[0], margin: first[1] - second[1] };
}

/**
 * The language to answer in. The «current» language is the conversation's, or the bot's default
 * language on a new conversation; another language wins only on clear evidence: a lead of 2 over the
 * current one (a word or two shared by two languages never flips it: «Queria reservar uma mesa para
 * segunda» stays Portuguese), or, on a new conversation, any lead when the message has nothing of the
 * default language («Hello», «Hola»). Only languages the business allows; otherwise its default.
 */
export function replyLanguage(
  text: string,
  conversationLanguage: ChatbotLanguage | null,
  allowed: readonly ChatbotLanguage[],
  fallback: ChatbotLanguage,
): ChatbotLanguage {
  const scores = languageScores(text);
  const current = conversationLanguage ?? fallback;
  const guess = guessLanguage(text);
  let chosen = current;
  if (guess.language && guess.language !== current) {
    const lead = scores[guess.language] - scores[current];
    const needed = conversationLanguage || scores[current] > 0 ? 2 : 1;
    if (lead >= needed) chosen = guess.language;
  }
  return allowed.includes(chosen) ? chosen : allowed.includes(fallback) ? fallback : (allowed[0] ?? fallback);
}
