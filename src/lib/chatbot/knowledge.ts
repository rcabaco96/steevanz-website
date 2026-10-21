// Finding the business's own answer to a message, without embeddings or paid calls: shared words
// (with light stemming) plus «concepts» that join the same idea across the six languages (a guest
// who writes «parking» finds the entry «Há estacionamento?»). Pure module (tests/chatbot.test.mjs).
import { hasKeyword, normalize, sameWord, searchWords, stem } from "./text.ts";
import type { BusinessKnowledge, CatalogItem, ChatbotLanguage, KnowledgeChunk, KnowledgeEntry } from "./types.ts";

/** One idea, the words for it in the six languages (normalized; "*" = word beginning). */
const concepts: Record<string, readonly string[]> = {
  wifi: ["wifi", "wi fi", "internet", "password", "senha", "palavra passe", "rede", "network", "contrasena", "mot de passe", "reseau", "passwort", "kennwort", "netz", "rete"],
  parking: ["estacionamento", "estacionar", "parque", "garagem", "parking", "park", "car park", "garage", "aparcamiento", "aparcar", "parqueo", "stationnement", "garer", "parkplatz", "parken", "parcheggio", "parcheggiare"],
  checkin: ["check in", "checkin", "entrada", "chegada", "chegar", "arrival", "arrive", "llegada", "llegar", "arrivee", "arriver", "ankunft", "anreise", "einchecken", "arrivo", "arrivare"],
  checkout: ["check out", "checkout", "saida", "sair", "departure", "leave", "salida", "salir", "depart", "partir", "abreise", "auschecken", "partenza", "partire"],
  payment: ["pagamento", "pagar", "multibanco", "mbway", "mb way", "cartao", "dinheiro", "card", "pay", "payment", "cash", "tarjeta", "efectivo", "paiement", "payer", "carte bancaire", "carte de credit", "especes", "zahlung", "zahlen", "kreditkarte", "ec karte", "bargeld", "pagamento", "contanti", "bancomat"],
  allergens: ["alergen*", "alergia*", "gluten", "celiac*", "lactose", "allergen*", "allergy", "allergies", "glutine", "lattosio", "allergie*", "laktose", "sans gluten", "sem gluten", "sin gluten", "senza glutine", "glutenfrei"],
  vegetarian: ["vegetarian*", "vegan*", "vegetal", "vegetariano", "vegano", "vegetarien*", "vegetarisch", "vegetariana"],
  pets: ["animal", "animais", "cao", "caes", "gato", "pet", "pets", "dog", "dogs", "perro", "mascota*", "chien", "animaux", "hund", "haustier*", "cane", "animali"],
  children: ["crianca*", "bebe", "berco", "cadeira de bebe", "child", "children", "kids", "baby", "cot", "high chair", "nino*", "cuna", "enfant*", "bebe", "lit bebe", "kinder", "babybett", "bambin*", "culla"],
  transport: ["autocarro", "metro", "comboio", "taxi", "uber", "transporte*", "aeroporto", "bus", "train", "airport", "transport", "tren", "autobus", "aeropuerto", "gare", "aeroport", "zug", "flughafen", "bahnhof", "treno", "aeroporto", "stazione"],
  breakfast: ["pequeno almoco", "breakfast", "desayuno", "petit dejeuner", "fruhstuck", "colazione"],
  towels: ["toalha*", "lencol", "lencois", "towel*", "sheets", "linen", "toalla*", "sabana*", "serviette*", "draps", "handtuch*", "bettwasche", "asciugaman*", "lenzuol*"],
  trash: ["lixo", "reciclagem", "garbage", "trash", "rubbish", "recycling", "basura", "reciclaje", "poubelle*", "recyclage", "mull", "muell", "abfall", "spazzatura", "rifiuti", "raccolta"],
  aircon: ["ar condicionado", "aquecimento", "aquecedor", "air conditioning", "aircon", "ac", "heating", "heater", "aire acondicionado", "calefaccion", "climatisation", "chauffage", "klimaanlage", "heizung", "aria condizionata", "riscaldamento"],
  appliances: ["maquina*", "maquina de lavar", "fogao", "forno", "microondas", "televisao", "tv", "washing machine", "machine a laver", "machine*", "dishwasher", "oven", "stove", "microwave", "lavadora", "horno", "lave linge", "waschmaschine", "herd", "ofen", "lavatrice", "forno"],
  restaurants: ["onde jantar", "onde comer", "restaurante*", "recomenda*", "where to eat", "restaurant*", "recommend*", "donde comer", "recomienda*", "ou manger", "recommand*", "wo essen", "empfehl*", "dove mangiare", "consigli*"],
  beach: ["praia*", "beach*", "playa*", "plage*", "strand", "spiaggia*"],
  groups: ["grupo*", "group*", "evento*", "event*", "festa", "party", "aniversario", "birthday", "groupe*", "veranstaltung", "gruppe*", "gruppo*", "compleanno", "cumpleanos"],
  cancel: ["cancelar", "cancelamento", "desmarcar", "cancel*", "anular", "annuler", "annulation", "stornieren", "absagen", "annullare", "disdire"],
  delivery: ["entrega*", "take away", "takeaway", "levar", "delivery", "domicilio", "para llevar", "livraison", "a emporter", "lieferung", "mitnehmen", "consegna", "asporto"],
  accessibility: ["acessibilidade", "cadeira de rodas", "mobilidade reduzida", "wheelchair", "accessible", "accessibility", "silla de ruedas", "accesible", "fauteuil roulant", "rollstuhl", "barrierefrei", "sedia a rotelle", "accessibile"],
  duration: ["quanto tempo", "demora", "duracao", "how long", "duration", "cuanto tiempo", "duracion", "combien de temps", "duree", "wie lange", "dauer", "quanto dura", "durata"],
};

function conceptsOf(normalizedText: string): Set<string> {
  const found = new Set<string>();
  for (const [concept, list] of Object.entries(concepts)) if (list.some((keyword) => hasKeyword(normalizedText, keyword))) found.add(concept);
  return found;
}

export type KnowledgeDocKind = "entry" | "item" | "chunk";

export interface KnowledgeDoc {
  kind: KnowledgeDocKind;
  entry?: KnowledgeEntry;
  item?: CatalogItem;
  chunk?: KnowledgeChunk;
  /** Chunks: how often each word key appears in the body, and the body's length in words (BM25). */
  termCounts?: Map<string, number>;
  length?: number;
  /** Words of the question/title and keywords (they count more). */
  titleWords: string[];
  bodyWords: string[];
  concepts: Set<string>;
  property: string | null;
  language: ChatbotLanguage | null;
}

export interface KnowledgeIndex {
  docs: KnowledgeDoc[];
  /** Document sections, searched with BM25 (searchChunks). */
  chunks: KnowledgeDoc[];
  /** In how many chunks each word key appears, and the average chunk length (BM25). */
  documentFrequency: Map<string, number>;
  averageLength: number;
}

/** The key a word is counted under in chunks: its stem, cut to 6 letters (estacionar = estacionamento). */
export function termKey(word: string): string {
  return stem(word).slice(0, 6);
}

export function buildIndex(knowledge: Pick<BusinessKnowledge, "entries" | "items"> & { chunks?: KnowledgeChunk[] }): KnowledgeIndex {
  const docs: KnowledgeDoc[] = [];
  for (const entry of knowledge.entries) {
    if (!entry.active || !entry.answer.trim()) continue;
    const title = `${entry.question} ${entry.keywords ?? ""}`;
    docs.push({
      kind: "entry",
      entry,
      titleWords: searchWords(title),
      bodyWords: searchWords(entry.answer),
      concepts: conceptsOf(normalize(title)),
      property: entry.property?.trim() || null,
      language: entry.language ?? null,
    });
  }
  for (const item of knowledge.items) {
    docs.push({
      kind: "item",
      item,
      titleWords: searchWords(item.name),
      bodyWords: searchWords(item.description ?? ""),
      concepts: conceptsOf(normalize(`${item.name} ${item.description ?? ""}`)),
      property: null,
      language: null,
    });
  }
  const chunks: KnowledgeDoc[] = [];
  const documentFrequency = new Map<string, number>();
  let totalLength = 0;
  for (const chunk of knowledge.chunks ?? []) {
    const bodyWords = searchWords(chunk.body);
    if (!bodyWords.length) continue;
    const termCounts = new Map<string, number>();
    for (const word of bodyWords) termCounts.set(termKey(word), (termCounts.get(termKey(word)) ?? 0) + 1);
    for (const key of termCounts.keys()) documentFrequency.set(key, (documentFrequency.get(key) ?? 0) + 1);
    totalLength += bodyWords.length;
    chunks.push({
      kind: "chunk",
      chunk,
      termCounts,
      length: bodyWords.length,
      titleWords: searchWords(chunk.heading),
      bodyWords,
      concepts: conceptsOf(normalize(`${chunk.heading} ${chunk.body}`)),
      property: chunk.property?.trim() || null,
      language: chunk.language ?? null,
    });
  }
  return { docs, chunks, documentFrequency, averageLength: chunks.length ? totalLength / chunks.length : 0 };
}

export interface SearchHit {
  doc: KnowledgeDoc;
  score: number;
  /** Share of the message's meaningful words this answer covers (0..1). */
  coverage: number;
}

/** Question words: they don't say what the question is about, so coverage ignores them. */
const questionWords = new Set(
  (
    "que qual quais como onde quando quanto quanta quantos ha tem teem fazem pode podem existe " +
    "what which how where when who there have has any can could " +
    "cual cuales donde cuando cuanto cuanta hay tiene tienen puede " +
    "quel quelle quels comment ou quand combien avez peut " +
    "was welche welcher wie wo wann gibt haben kann " +
    "cosa quale quali dove quando quanto avete puo ce " +
    // Greetings and courtesy: not what the question is about either.
    "ola oi bom boa dia tarde noite hello hi hey good morning evening please thanks hola buenos buenas dias tardes " +
    "bonjour bonsoir salut plait merci hallo guten tag bitte danke ciao buongiorno buonasera favore grazie favor obrigado obrigada"
  ).split(" "),
);

/** The query's words a concept explains: single-word keywords ("*" = beginning) and whole phrases found in the query. */
function wordsExplainedBy(concept: string, normalizedQuery: string, queryWords: readonly string[]): string[] {
  const explained: string[] = [];
  for (const keyword of concepts[concept] ?? []) {
    if (keyword.includes(" ")) {
      if (hasKeyword(normalizedQuery, keyword)) explained.push(...keyword.split(" "));
    } else {
      const prefix = keyword.endsWith("*") ? keyword.slice(0, -1) : null;
      explained.push(...queryWords.filter((word) => (prefix ? word.startsWith(prefix) : word === keyword)));
    }
  }
  return explained;
}

export interface SearchOptions {
  /** The guest's property, once known: entries of other properties are left out. */
  property?: string | null;
  language?: ChatbotLanguage | null;
  limit?: number;
}

/**
 * The best answers for a message, best first. A score of about 3 means a title word or a concept
 * matched; below 2.5 is noise (see minimumScore).
 */
export function search(index: KnowledgeIndex, query: string, options: SearchOptions = {}): SearchHit[] {
  const queryWords = searchWords(query);
  const normalizedQuery = normalize(query);
  const queryConcepts = conceptsOf(normalizedQuery);
  if (!queryWords.length && !queryConcepts.size) return [];
  const hits: SearchHit[] = [];
  for (const doc of index.docs) {
    if (options.property && doc.property && doc.property !== options.property) continue;
    let score = 0;
    const matched = new Set<string>();
    for (const word of queryWords) {
      if (doc.titleWords.some((candidate) => sameWord(word, candidate))) {
        score += 3;
        matched.add(word);
      } else if (doc.bodyWords.some((candidate) => sameWord(word, candidate))) {
        score += 1;
        matched.add(word);
      }
    }
    const shared = [...queryConcepts].filter((concept) => doc.concepts.has(concept));
    // The same idea in another language counts a little more than one shared word.
    score += shared.length * 4;
    if (!score) continue;
    for (const concept of shared) for (const word of wordsExplainedBy(concept, normalizedQuery, queryWords)) matched.add(word);
    const meaningful = queryWords.filter((word) => !questionWords.has(word));
    const coverage = meaningful.length ? meaningful.filter((word) => matched.has(word)).length / meaningful.length : 1;
    // Shorter titles that match are more specific; entries in the customer's language win ties.
    score = score / Math.sqrt(1 + doc.titleWords.length / 6) + (options.language && doc.language === options.language ? 0.25 : 0);
    hits.push({ doc, score, coverage });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, options.limit ?? 5);
}

export const minimumScore = 2.5;

/** A document section counts from this BM25 score (with the same coverage rule as entries). */
export const minimumChunkScore = 2;

/**
 * The best document sections for a message (BM25 over the bodies, plus the section titles and the
 * six-language concepts), best first. Zero cost; embeddings can replace or join this later.
 */
export function searchChunks(index: KnowledgeIndex, query: string, options: SearchOptions = {}): SearchHit[] {
  if (!index.chunks.length) return [];
  const queryWords = searchWords(query);
  const normalizedQuery = normalize(query);
  const queryConcepts = conceptsOf(normalizedQuery);
  if (!queryWords.length && !queryConcepts.size) return [];
  const total = index.chunks.length;
  const k1 = 1.2;
  const b = 0.75;
  const meaningful = queryWords.filter((word) => !questionWords.has(word));
  const hits: SearchHit[] = [];
  for (const doc of index.chunks) {
    if (options.property && doc.property && doc.property !== options.property) continue;
    let score = 0;
    const matched = new Set<string>();
    for (const word of new Set(meaningful.length ? meaningful : queryWords)) {
      const key = termKey(word);
      const count = doc.termCounts?.get(key) ?? 0;
      if (count) {
        const frequency = index.documentFrequency.get(key) ?? 0;
        const idf = Math.log(1 + (total - frequency + 0.5) / (frequency + 0.5));
        score += (idf * (count * (k1 + 1))) / (count + k1 * (1 - b + (b * (doc.length ?? 0)) / (index.averageLength || 1)));
        matched.add(word);
      }
      if (doc.titleWords.some((candidate) => sameWord(word, candidate))) {
        score += 1.5;
        matched.add(word);
      }
    }
    const shared = [...queryConcepts].filter((concept) => doc.concepts.has(concept));
    score += shared.length * 2;
    if (!score) continue;
    for (const concept of shared) for (const word of wordsExplainedBy(concept, normalizedQuery, queryWords)) matched.add(word);
    const coverage = meaningful.length ? meaningful.filter((word) => matched.has(word)).length / meaningful.length : 1;
    hits.push({ doc, score: score + (options.language && doc.language === options.language ? 0.25 : 0), coverage });
  }
  return hits.sort((a, b) => b.score - a.score || b.coverage - a.coverage).slice(0, options.limit ?? 3);
}

/** An entry answers a message when it scores enough AND covers at least half of what was asked. */
export const minimumCoverage = 0.5;

/** The property a guest names in a message («estou na Casa do Rio»), if any. */
export function findProperty(text: string, properties: readonly string[]): string | null {
  const normalized = normalize(text);
  if (!normalized) return null;
  let best: { name: string; score: number } | null = null;
  for (const name of properties) {
    const nameWords = searchWords(name);
    if (!nameWords.length) continue;
    if (hasKeyword(normalized, normalize(name))) return name;
    const matched = nameWords.filter((word) => normalized.split(" ").some((candidate) => sameWord(word, candidate))).length;
    const score = matched / nameWords.length;
    if (score >= 0.5 && (!best || score > best.score)) best = { name, score };
  }
  return best?.name ?? null;
}
