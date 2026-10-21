// Finding the business's own answer to a message, without embeddings or paid calls: shared words
// (with light stemming) plus «concepts» that join the same idea across the six languages (a guest
// who writes «parking» finds the entry «Há estacionamento?»). Pure module (tests/chatbot.test.mjs).
import { documentPassages, type Passage } from "./passages.ts";
import { hasKeyword, inflectionRoot, isStopword, keywordStarts, normalize, sameWord, searchWords, stem } from "./text.ts";
import type { BusinessKnowledge, CatalogItem, ChatbotLanguage, KnowledgeChunk, KnowledgeEntry } from "./types.ts";

/** One idea, the words for it in the six languages (normalized; "*" = word beginning). */
const concepts: Record<string, readonly string[]> = {
  wifi: ["wifi", "wi fi", "internet", "password", "senha", "palavra passe", "rede", "router", "network", "contrasena", "mot de passe", "reseau", "routeur", "passwort", "kennwort", "netz", "rete"],
  parking: ["estacionamento", "estacionar", "parque", "garagem", "parking", "park", "car park", "garage", "aparcamiento", "aparcar", "parqueo", "stationnement", "garer", "parkplatz", "parken", "parcheggio", "parcheggiare"],
  checkin: ["check in", "checkin", "entrada", "chegada", "chegar", "chego", "cheguei", "chegamos", "chegarei", "arrival", "arrive", "llegada", "llegar", "arrivee", "arriver", "ankunft", "anreise", "einchecken", "arrivo", "arrivare"],
  // Not «partir»: «a partir das 16:00» is «from 16:00» in Portuguese.
  checkout: ["check out", "checkout", "saida", "sair", "departure", "leave", "salida", "salir", "depart", "abreise", "auschecken", "partenza", "partire"],
  payment: ["pagamento", "pagar", "multibanco", "mbway", "mb way", "dinheiro", "pay", "payment", "cash", "efectivo", "paiement", "payer", "especes", "zahlung", "zahlen", "bargeld", "contanti", "bancomat"],
  // Paying by card: «posso pagar com cartão?» ↔ «Visa e Mastercard» (not every payment line).
  card: [
    "cartao", "cartoes", "cartao de credito", "cartao de debito", "card", "cards", "credit card", "debit card", "visa", "mastercard", "maestro", "amex", "american express",
    "apple pay", "google pay", "tarjeta*", "carte", "cartes", "carte bancaire", "carte de credit", "kreditkarte", "ec karte", "karte", "carta di credito",
  ],
  // A customer's or student's card is not a way to pay.
  membercard: [
    "cartao de cliente", "cartao cliente", "cartao de estudante", "cartao de cidadao", "cartao do seguro", "loyalty card", "student card", "membership card", "tarjeta de cliente",
    "carnet de estudiante", "carte de fidelite", "carte etudiant", "kundenkarte", "studentenausweis", "tessera",
  ],
  allergens: [
    "alergen*", "alergia*", "alergic*", "intoleran*", "gluten", "celiac*", "lactose", "allergen*", "allergy", "allergies", "allergic*", "intolerance*", "glutine", "lattosio",
    "allergie*", "allergique*", "laktose", "sans gluten", "sem gluten", "sin gluten", "senza glutine", "glutenfrei", "allergisch",
  ],
  nuts: [
    "frutos secos", "frutos de casca rija", "fruto* seco*", "noz", "nozes", "amendoa*", "amendoim*", "avela*", "castanha*", "pinhao", "pinhoes", "caju", "pistacio*", "nut", "nuts",
    "peanut*", "almond*", "hazelnut*", "walnut*", "cashew*", "pistachio*", "frutos de cascara", "cacahuete*", "almendra*", "avellana*", "nuez", "nueces", "fruits a coque",
    "noix", "amande*", "noisette*", "nuss", "nusse", "nuesse", "erdnuss*", "mandel*", "haselnuss*", "frutta a guscio", "frutta secca", "noci", "arachid*", "mandorl*", "nocciol*",
  ],
  vegetarian: ["vegetarian*", "vegan*", "vegetal", "vegetariano", "vegano", "vegetarien*", "vegetarisch", "vegetariana"],
  pets: ["animal", "animais", "cao", "caes", "gato", "pet", "pets", "dog", "dogs", "perro", "mascota*", "chien", "animaux", "hund", "haustier*", "cane", "animali", "gatos", "cat", "cats", "perros", "chiens", "chats", "hunde", "katze*", "cani", "gatti"],
  children: [
    "crianca*", "bebe", "bebes", "infantil", "infantis", "filho", "filhos", "filha", "filhas", "menor", "menores", "child", "children", "kids", "kid", "son", "daughter",
    "baby", "babies", "nino*", "hijo", "hijos", "hija", "hijas", "enfant*", "fils", "fille", "kinder", "sohn", "tochter", "bambin*", "figli*",
  ],
  // Teeth and the dentist (a clinic's patients write «dentista», the clinic writes «medicina dentária», «odontopediatria»).
  teeth: [
    "dente", "dentes", "dentista*", "dentari*", "odonto*", "dental", "dentist*", "tooth", "teeth", "diente*", "dentaire*", "dent", "dents", "zahn", "zahne", "zaehne", "zahnarzt*",
    "denti", "dentale",
  ],
  cleaning: [
    "limpeza", "limpezas", "limpeza* dent*", "destartariza*", "higiene oral", "cleaning", "dental cleaning", "teeth cleaning", "scale and polish", "limpieza*", "limpieza* dental*",
    "detartraje", "nettoyage", "detartrage", "zahnreinigung", "pulizia", "pulizia dei denti", "ablazione",
  ],
  extraction: [
    "extracao", "extracoes", "extrair", "tirar um dente", "tirar o dente", "tirar dentes", "arrancar um dente", "extraction", "pull a tooth", "tooth out", "extraccion", "sacar una muela",
    "sacar un diente", "arracher une dent", "zahn ziehen", "extraktion", "estrazione", "togliere un dente",
  ],
  whitening: [
    "branqueamento*", "branquear", "branqueamento* dos dentes", "branqueamento* dent*", "whitening", "whiten", "teeth whitening", "blanqueamiento", "blanqueamiento* dental*",
    "blanquear", "blanchiment", "blanchiment des dents", "blanchiment dentaire", "blanchir", "bleaching", "aufhellung", "zahnaufhellung", "sbiancamento", "sbiancamento dei denti",
  ],
  // Languages spoken: «Do you speak English?» ↔ «Falamos português, inglês e espanhol».
  languages: [
    "falam", "falamos", "idioma*", "lingua*", "ingles", "espanhol", "frances", "alemao", "italiano", "speak", "english", "spanish", "french", "german", "italian", "language*",
    "hablan", "hablais", "habla", "espanol", "parlez", "parle", "anglais", "espagnol", "langue*", "sprechen", "englisch", "spanisch", "sprache*", "parlate", "parla", "inglese", "lingue",
  ],
  // Things for babies: «cadeira de bebé» is a high chair, not a question about children in general.
  babygear: [
    "berco", "bercos", "cadeira* de bebe", "cadeira* alta*", "cadeira* de papa", "fraldario", "muda fraldas", "cot", "cots", "crib", "high chair*", "changing table", "cuna", "cunas",
    "trona*", "cambiador", "lit bebe", "lit parapluie", "chaise* haute*", "table a langer", "babybett", "hochstuhl", "wickeltisch", "culla", "seggiolon*", "fasciatoio",
  ],
  // «parque infantil» is a playground, not a car park.
  playground: [
    "parque infantil", "parques infantis", "zona infantil", "espaco infantil", "area infantil", "playground*", "play area", "parque de juegos", "zona de juegos", "aire de jeux",
    "espace enfants", "spielplatz", "spielecke", "parco giochi", "area giochi",
  ],
  terrace: ["esplanada*", "terraco*", "terrace*", "outdoor seating", "terraza*", "terrasse*", "terrazza*", "dehors", "all aperto"],
  // Being late for a booking or appointment, and how long the business waits.
  late: [
    "atraso*", "atrasad*", "atrasar*", "chegar tarde", "chegarmos tarde", "tolerancia", "depois da hora marcada", "late", "delay*", "running late", "retraso*", "retrasad*",
    "llegar tarde", "retard*", "en retard", "verspat*", "verspaet*", "in ritardo", "ritard*", "tolleranza",
  ],
  transport: ["autocarro", "metro", "comboio", "taxi", "uber", "transporte*", "aeroporto", "bus", "train", "airport", "transport", "tren", "autobus", "aeropuerto", "gare", "aeroport", "zug", "flughafen", "bahnhof", "treno", "aeroporto", "stazione"],
  breakfast: ["pequeno almoco", "breakfast", "desayuno", "petit dejeuner", "fruhstuck", "colazione"],
  towels: ["toalha*", "lencol", "lencois", "towel*", "sheets", "linen", "toalla*", "sabana*", "serviette*", "draps", "handtuch*", "bettwasche", "asciugaman*", "lenzuol*"],
  trash: ["lixo", "reciclagem", "garbage", "trash", "rubbish", "recycling", "basura", "reciclaje", "poubelle*", "recyclage", "mull", "muell", "abfall", "spazzatura", "rifiuti", "raccolta"],
  aircon: ["ar condicionado", "aquecimento", "aquecedor", "air conditioning", "aircon", "ac", "heating", "heater", "aire acondicionado", "calefaccion", "climatisation", "chauffage", "klimaanlage", "heizung", "aria condizionata", "riscaldamento"],
  appliances: ["maquina*", "maquina de lavar", "fogao", "forno", "microondas", "televisao", "tv", "washing machine", "machine a laver", "machine*", "dishwasher", "oven", "stove", "microwave", "lavadora", "horno", "lave linge", "waschmaschine", "herd", "ofen", "lavatrice", "forno"],
  restaurants: [
    "onde jantar", "onde comer", "jantar", "almocar", "comer", "restaurante*", "where to eat", "dinner", "lunch", "eat", "restaurant*", "donde comer", "cenar", "ou manger",
    "diner", "dejeuner", "manger", "wo essen", "abendessen", "mittagessen", "essen", "dove mangiare", "cenare", "pranzare", "mangiare",
  ],
  // Something not working: «A internet não está a dar» ↔ «Se falhar, desliguem o router».
  fault: [
    "nao funciona", "nao funcionam", "nao da", "nao esta a dar", "deixou de funcionar", "falha*", "falhar", "falhou", "avari*", "not working", "doesn t work", "stopped working",
    "broken", "no funciona", "no va", "ne marche pas", "ne fonctionne pas", "en panne", "funktioniert nicht", "kaputt", "non funziona", "guasto",
  ],
  // Staying the night: «Quantas pessoas podem ficar?», «Dá para ficar só uma noite?».
  stay: [
    "ficar", "ficamos", "estadia*", "estada*", "alojar", "dormir", "pernoit*", "passar a noite", "stay", "stays", "staying", "overnight", "quedarse", "alojarse", "estancia*",
    "sejour*", "rester", "bleiben", "ubernacht*", "uebernacht*", "aufenthalt", "soggiorn*", "rimanere", "alloggiare", "pernottare",
  ],
  // How many people: «Quantas pessoas podem ficar?» ↔ «Capacidade máxima: 4 hóspedes».
  capacity: [
    "pessoas", "hospede*", "capacidade", "lotacao", "lugares", "people", "guest*", "persons", "capacity", "personas", "huesped*", "capacidad", "personnes", "voyageurs",
    "capacite", "personen", "gaste", "gaeste", "kapazitat", "persone", "ospiti", "capienza",
  ],
  luggage: ["mala", "malas", "bagage*", "luggage", "bag", "bags", "suitcase*", "equipaje", "maleta*", "valise*", "gepack", "gepaeck", "koffer", "bagagl*", "valigi*"],
  beach: ["praia*", "beach*", "playa*", "plage*", "strand", "spiaggia*"],
  groups: ["grupo*", "group*", "evento*", "event*", "festa", "party", "aniversario", "birthday", "groupe*", "veranstaltung", "gruppe*", "gruppo*", "compleanno", "cumpleanos"],
  cancel: ["cancelar", "cancelamento", "desmarcar", "cancel*", "anular", "annuler", "annulation", "stornieren", "absagen", "annullare", "disdire"],
  delivery: [
    "entrega*", "envio*", "enviam", "enviamos", "portes", "correio", "take away", "takeaway", "para levar", "delivery", "deliver*", "ship", "ships", "shipping", "domicilio",
    "para llevar", "livraison", "livrez", "expedi*", "a emporter", "lieferung", "liefern", "versand*", "versend*", "mitnehmen", "consegna", "spedizion*", "spedite", "asporto",
  ],
  // Buying (a past purchase is often the start of a return or exchange question).
  purchase: ["comprei", "comprou", "compramos", "compra", "compras", "bought", "purchase*", "compre", "achete", "gekauft", "comprato"],
  // Returning or exchanging something bought.
  returns: [
    "troca*", "trocar", "trocam", "devolu*", "devolver", "devolvo", "return*", "exchange*", "cambio", "cambios", "cambiar", "devolucion*", "echange*", "echanger", "retour*",
    "retourner", "umtausch*", "umtauschen", "ruckgabe", "rueckgabe", "zuruckgeben", "cambiare", "reso", "resi", "restituire",
  ],
  accessibility: [
    "acessibilidade", "acessivel", "acessiveis", "cadeira* de rodas", "mobilidade reduzida", "elevador", "elevadores", "rampa", "rampas", "wheelchair*", "accessible", "accessibility",
    "elevator", "lift", "ramp", "step free", "silla de ruedas", "accesible", "accesibilidad", "ascensor", "fauteuil roulant", "ascenseur", "rampe", "rollstuhl", "barrierefrei",
    "aufzug", "sedia a rotelle", "accessibile", "ascensore",
  ],
  haircut: [
    "corte", "cortes", "cortam", "cortamos", "cabelo", "cabelos", "degrade", "degrades", "fade", "haircut*", "hair cut", "hair",
    "corte de pelo", "cortar el pelo", "cortarme el pelo", "coupe de cheveux", "couper", "cheveux", "haarschnitt*", "haare", "taglio", "tagliare", "capelli",
  ],
  beard: ["barba*", "barbear", "beard*", "shave", "shaving", "afeitad*", "barbe", "rasage", "bart", "rasur", "rasatura"],
  // A beauty salon's services in the six languages.
  nails: ["unha*", "manicure*", "pedicure*", "verniz", "gel", "nail*", "manicura*", "pedicura*", "unas", "ongle*", "vernis", "nagel*", "unghi*", "smalto"],
  eyebrows: ["sobrancelha*", "eyebrow*", "brow", "brows", "ceja*", "sourcil*", "augenbraue*", "sopraccigli*"],
  lashes: ["pestana*", "eyelash*", "lash", "lashes", "cils", "wimper*", "ciglia"],
  waxing: ["depila*", "cera", "waxing", "wax", "depilacion", "epilation", "epiler", "cire", "haarentfernung", "wachs*", "ceretta", "epilazione"],
  upperlip: ["buco", "bigode", "upper lip", "moustache", "mustache", "bigote", "oberlippe", "baffetti"],
  haircolour: [
    "pintar", "pinto", "coloracao", "coloracoes", "tinta", "tintas", "madeixa*", "balayage", "nuance*", "hair dye", "dye", "dyeing", "highlights", "tinte", "tenir", "mechas",
    "coloration", "teinture", "meches", "farben", "haarfarbe", "strahnchen", "tinta per capelli", "colpi di sole",
  ],
  makeup: ["maquilhagem", "maquilhar", "make up", "makeup", "maquillaje", "maquillage", "schminken", "trucco"],
  duration: [
    "min", "minuto*", "minute*", "minuti", "minuten", "quanto tempo", "demora", "duracao", "prazo", "prazos", "how long", "duration", "cuanto tiempo", "duracion", "plazo",
    "combien de temps", "duree", "delai", "wie lange", "dauer", "frist", "quanto dura", "dura", "duram", "durar", "last", "lasts", "durata", "dias", "dias uteis", "days", "jours",
    "tage", "giorni", "semana", "semanas", "horas", "hours", "heures", "stunden", "ore",
    "week", "weeks", "mes", "meses", "month", "months", "mois", "monat", "monate", "mesi", "ano", "year", "anos de validade", "jahr", "anno",
  ],
  // «A que horas…?» asks for a time of day, not a duration (its «horas» is not «2 a 3 horas»).
  clocktime: ["a que horas", "que horas", "ate que horas", "what time", "a que hora", "a quelle heure", "um wie viel uhr", "a che ora"],
  // What is in stock, and colours: «Têm a lã merino azul em stock?» ↔ «para saber se uma cor ou um lote está disponível».
  stock: ["stock", "em stock", "disponivel", "disponiveis", "existencia*", "in stock", "available", "disponible*", "en stock", "existencias", "vorratig", "vorraetig", "lager", "lieferbar", "disponibil*", "magazzino"],
  colour: [
    "cor", "cores", "azul", "vermelho*", "verde*", "amarel*", "preto*", "branco*", "cinzent*", "rosa", "roxo*", "laranja", "castanho*", "bege", "colour*", "color*", "blue", "red",
    "green", "yellow", "black", "white", "grey", "gray", "pink", "purple", "orange", "brown", "rojo", "negro", "blanco", "gris", "couleur*", "bleu", "rouge", "vert", "jaune", "noir",
    "blanc", "farbe*", "blau", "rot", "grun", "gelb", "schwarz", "weiss", "colore", "colori", "rosso", "giallo", "nero", "bianco",
  ],
  wool: ["lana", "lanas", "novelo", "novelos", "wool", "yarn", "laine", "laines", "pelote*", "wolle", "garn", "gomitol*", "filato", "filati"],
  // Who works there: «Quem dá os workshops?» ↔ «Equipa: Fátima e Joana (atendimento e workshops)».
  staff: ["quem", "equipa", "who", "team", "staff", "quien", "quienes", "equipo", "qui", "equipe", "wer", "chi", "squadra"],
  giftcard: [
    "vale", "vales", "vale* oferta", "vale* de oferta", "vale* presente", "cartao oferta", "cartao presente", "gift card*", "gift voucher*", "voucher*", "tarjeta regalo",
    "cheque regalo", "bono regalo", "carte cadeau", "cartes cadeaux", "bon cadeau", "bons cadeaux", "cheque cadeau", "gutschein*", "geschenkgutschein*", "buono regalo", "buoni regalo",
    "carta regalo",
  ],
  // Ordering something the business doesn't have in the shop.
  order: ["encomenda*", "encomendar", "mandar vir", "mandam vir", "mandar buscar", "special order*", "order it", "encargar", "encargo", "pedido especial", "commander", "commande*", "bestellen", "bestellung", "ordinare", "ordinazione"],
  // Collecting an order at the business.
  pickup: ["levantar", "levantamento", "recolher", "pick up", "pickup", "collect", "click and collect", "recoger", "recogida", "retirer", "retrait", "abholen", "abholung", "ritirare", "ritiro"],
};

/** Every place a concept's keyword matches in a text: the concept and the words it spans [start, end). */
function conceptMatches(tokens: readonly string[]): { concept: string; start: number; end: number }[] {
  const matches: { concept: string; start: number; end: number }[] = [];
  // The words without «de», «des», «of»…, and where each one was: «blanchiment dents» (a subject carried from the
  // previous message, without its small words) is still «blanchiment des dents».
  const kept = tokens.map((token, at) => ({ token, at })).filter((item) => !isStopword(item.token));
  const content = kept.map((item) => item.token);
  for (const [concept, list] of Object.entries(concepts)) {
    for (const keyword of list) {
      const parts = keyword.split(" ");
      for (const start of keywordStarts(tokens, keyword)) matches.push({ concept, start, end: start + parts.length });
      const essential = parts.filter((part) => !isStopword(part));
      if (essential.length < 2 || essential.length === parts.length) continue;
      for (const start of keywordStarts(content, essential.join(" "))) matches.push({ concept, start: kept[start].at, end: kept[start + essential.length - 1].at + 1 });
    }
  }
  // «parque infantil» is a playground, not a car park; «cadeira de bebé» is a high chair, not «bebé»: a match
  // inside a longer phrase of another concept doesn't count.
  return matches.filter(
    (match) => !matches.some((other) => other.concept !== match.concept && other.end - other.start > match.end - match.start && other.start <= match.start && match.end <= other.end),
  );
}

export function conceptsOf(normalizedText: string): Set<string> {
  return new Set(conceptMatches(normalizedText ? normalizedText.split(" ") : []).map((match) => match.concept));
}

export type KnowledgeDocKind = "entry" | "item" | "chunk";

export interface KnowledgeDoc {
  kind: KnowledgeDocKind;
  entry?: KnowledgeEntry;
  item?: CatalogItem;
  chunk?: KnowledgeChunk;
  /** Document windows: the passages they hold (in order). */
  passages?: Passage[];
  /** Chunks: how often each word key appears in the body, and the body's length in words (BM25). */
  termCounts?: Map<string, number>;
  length?: number;
  /** Words of the question/title and keywords (they count more). */
  titleWords: string[];
  /**
   * How long the title is for the «shorter titles are more specific» rule: the question's own words only.
   * Keywords are other words for the same thing and must not make an entry harder to find.
   */
  titleLength?: number;
  bodyWords: string[];
  concepts: Set<string>;
  property: string | null;
  language: ChatbotLanguage | null;
}

export interface KnowledgeIndex {
  docs: KnowledgeDoc[];
  /**
   * Overlapping windows of document passages (~450 characters, half of each shared with the next),
   * searched with BM25 (searchChunks): nothing depends on where a document's sections start.
   */
  chunks: KnowledgeDoc[];
  /** In how many windows each word key appears, and the average window length (BM25). */
  documentFrequency: Map<string, number>;
  averageLength: number;
  /** Every passage of every document, in order (doc-answers.ts), and in how many each word key appears. */
  passages: Passage[];
  passageFrequency: Map<string, number>;
  averagePassageLength: number;
}

/** Target size of a search window and how far the next one starts (half: windows overlap). */
export const windowSize = { chars: 450, step: 225 };

/** The key a word is counted under in chunks: its root, cut to 5 letters like sameWord (estacionar = estacionamento, atraso = atrasado, avisar = avisem). */
export function termKey(word: string): string {
  // Without a last vowel too, so «falta» and «faltar», «aviso» and «avisar» are counted together.
  const root = inflectionRoot(stem(word));
  return (root.length >= 5 && /[aeo]$/.test(root) ? root.slice(0, -1) : root).slice(0, 5);
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
      titleLength: searchWords(entry.question).length,
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
  // Documents: every passage, then overlapping windows of passages (BM25 over the windows).
  const byDocument = new Map<string, KnowledgeChunk[]>();
  for (const chunk of knowledge.chunks ?? []) {
    const list = byDocument.get(chunk.documentId);
    if (list) list.push(chunk);
    else byDocument.set(chunk.documentId, [chunk]);
  }
  const passages: Passage[] = [];
  const passageFrequency = new Map<string, number>();
  const chunks: KnowledgeDoc[] = [];
  const documentFrequency = new Map<string, number>();
  let totalLength = 0;
  let totalPassageLength = 0;
  for (const documentChunks of byDocument.values()) {
    const list = documentPassages(documentChunks);
    for (const passage of list) {
      passages.push(passage);
      totalPassageLength += passage.words.length;
      for (const key of new Set(passage.words.map(termKey))) passageFrequency.set(key, (passageFrequency.get(key) ?? 0) + 1);
    }
    for (let start = 0; start < list.length; ) {
      let end = start;
      let size = 0;
      while (end < list.length && (end === start || size + list[end].text.length <= windowSize.chars)) size += list[end++].text.length + 1;
      const held = list.slice(start, end);
      const bodyWords = held.flatMap((passage) => passage.words);
      const termCounts = new Map<string, number>();
      for (const word of bodyWords) termCounts.set(termKey(word), (termCounts.get(termKey(word)) ?? 0) + 1);
      for (const key of termCounts.keys()) documentFrequency.set(key, (documentFrequency.get(key) ?? 0) + 1);
      totalLength += bodyWords.length;
      const first = held[0].chunk;
      chunks.push({
        kind: "chunk",
        chunk: { ...first, body: held.map((passage) => passage.text).join("\n") },
        passages: held,
        termCounts,
        length: bodyWords.length,
        // Titles, when the document has them, count a little more.
        // and so do the words lines start with («Farmácia Central a 400 m…», «Wi-Fi: rede…»): what a line is about.
        titleWords: held.flatMap((passage) => (passage.titleLike ? passage.words : passage.words.slice(0, 1))),
        bodyWords,
        concepts: conceptsOf(normalize(held.map((passage) => passage.text).join(" "))),
        property: first.property?.trim() || null,
        language: first.language ?? null,
      });
      if (end >= list.length) break;
      // The next window starts about half a window later (always at least one passage later).
      let next = start + 1;
      let moved = list[start].text.length + 1;
      while (next < end && moved < windowSize.step) moved += list[next++].text.length + 1;
      start = next;
    }
  }
  return {
    docs,
    chunks,
    documentFrequency,
    averageLength: chunks.length ? totalLength / chunks.length : 0,
    passages,
    passageFrequency,
    averagePassageLength: passages.length ? totalPassageLength / passages.length : 0,
  };
}

export interface SearchHit {
  doc: KnowledgeDoc;
  score: number;
  /** Share of the message's meaningful words this answer covers (0..1). */
  coverage: number;
  /** Document windows: the passage inside that best matches the message. */
  passage?: Passage;
}

/** Question words: they don't say what the question is about, so coverage ignores them. */
export const questionWords = new Set(
  (
    "que qual quais como onde quando quanto quanta quantos ha tem teem fazem pode podem existe posso podemos ir vir trazer levar aceitam aceita " +
    "can may bring accept accepted puedo podemos traer aceptan peux puis pouvons apporter acceptez darf durfen mitbringen akzeptieren portare accettate " +
    "what which how where when who there have has any can could " +
    "cual cuales donde cuando cuanto cuanta hay tiene tienen puede " +
    "quel quelle quels comment ou quand combien avez peut " +
    "was welche welcher wie wo wann gibt haben kann " +
    "cosa quale quali dove quando quanto avete puo ce quem quien quienes qui wer chi " +
    // Greetings and courtesy: not what the question is about either.
    // (Not «dia», «tarde», «noite»: «só uma noite», «prato do dia» are about something; greetings are taken out whole, greetingFree.)
    "ola oi bom boa hello hi hey good please thanks hola buenos buenas " +
    // «Vou chegar…», «É a segunda vez que pergunto: …»: how the question is put, not what it is about.
    "vou vamos pergunto perguntei perguntar novamente vez again ask asked pregunto demande frage chiedo ainda sao ser sera atendem atende " +
    // «Há algum prato…?», «Também há ao sábado?»: «any» and «also» say nothing about the subject either.
    "algum alguma alguns algumas tambem tambien also aussi auch anche " +
    // «Podem enviar-me a ementa?», «Can you send me the menu?»: asking to send or show something.
    "enviar envie mandar manda mande mostrar mostra mostre send show enviame envoyer envoyez montrer schicken zeigen inviare mandare mostrare " +
    // «Dá para ver os jogos aí?»: «there», «here» point at the business, they don't say what about.
    "ai aqui ali here there alli aqui ici la dort hier qui li " +
    // «Quantas pessoas…?», «A internet não está a dar, o que faço?», «Há problema?», «por volta das 23:30», «só uma
    // noite», «a farmácia mais perto», «a que hora», «Como funciona…?», «temos de avisar alguém?», «antes da
    // entrada»: how the question is put, not what it is about.
    "quantas nao no not non nicht pas faco devo deve devemos should problema problemas problem problems volta so only solo seulement nur " +
    "mais more most perto near nearby cerca pres proche vicino hora horas hour time heure ora uhr funciona funcionam work works fonctionne " +
    "funktioniert funziona temos tenho preciso precisamos need must tengo tenemos necesito devons muss dobbiamo alguem someone anyone alguien " +
    "jemand qualcuno antes depois partir before after despues avant apres dopo longe far lejos loin weit lontano fica ficam situa situado located " +
    // «¿Se puede fumar en el apartamento?», «Can I smoke in the apartment?»: the place itself, i.e. «here».
    "apartamento apartamentos alojamento estabelecimento apartment flat premises appartement logement wohnung unterkunft appartamento alloggio " +
    // «Quero trocar…», «outra cor», «durante quanto tempo», «há algum cuidado?».
    "quero gostaria gostava outro outra outros outras other another otro otra autre andere altro altra durante cuidado cuidados precisar " +
    "gostei gostou gostamos liked faz mal estao estamos estou estava estavam fazer tiver tiverem tivermos hacen haceis hace hacer " +
    // «É paga mesmo que faça o tratamento?», «Vous faites le blanchiment ?»: forms of «do» and «even if».
    "faca facam fizer fizermos mesmo faites faire fait fais " +
    "bonjour bonsoir salut plait merci hallo guten tag bitte danke ciao buongiorno buonasera favore grazie favor obrigado obrigada"
  ).split(" "),
);

/** Greetings in the six languages («boa noite», «good morning»): taken out of a message before it is searched. */
const greetingPhrases =
  /\b(?:bom dia|boa tarde|boa noite|bons dias|boas tardes|boas noites|good (?:morning|afternoon|evening|night)|buen(?:os|as) (?:dias|tardes|noches)|bonne (?:nuit|journee|soiree)|guten (?:morgen|tag|abend)|gute nacht|buona (?:sera|notte|giornata))\b/g;

/** A message without its greetings («Boa noite, qual é o preço do cabrito?» → «, qual é o preço do cabrito?»). */
export function greetingFree(text: string): string {
  return normalize(text).replace(greetingPhrases, " ");
}

/** The query's words a concept explains: single-word keywords ("*" = beginning) and whole phrases found in the query. */
export function wordsExplainedBy(concept: string, normalizedQuery: string, queryWords: readonly string[]): string[] {
  const explained: string[] = [];
  const tokens = normalizedQuery ? normalizedQuery.split(" ") : [];
  for (const keyword of concepts[concept] ?? []) {
    if (keyword.includes(" ")) {
      const size = keyword.split(" ").length;
      for (const start of keywordStarts(tokens, keyword)) explained.push(...tokens.slice(start, start + size));
    } else {
      const prefix = keyword.endsWith("*") ? keyword.slice(0, -1) : null;
      explained.push(...queryWords.filter((word) => (prefix ? word.startsWith(prefix) : word === keyword)));
    }
  }
  return explained;
}

/** An idea written in several words («parque infantil», «cadeira de bebé», «frutos secos»): its concept and the query words it spans. */
export interface PhraseGroup {
  concept: string;
  words: string[];
}

/** The query's ideas written in several words (at least two meaningful words each). */
export function phraseGroups(normalizedQuery: string, queryWords: readonly string[]): PhraseGroup[] {
  const tokens = normalizedQuery ? normalizedQuery.split(" ") : [];
  const groups: PhraseGroup[] = [];
  for (const match of conceptMatches(tokens)) {
    if (match.end - match.start < 2) continue;
    const words = [...new Set(tokens.slice(match.start, match.end).filter((token) => queryWords.includes(token)))];
    if (words.length >= 2) groups.push({ concept: match.concept, words });
  }
  return groups;
}

/**
 * The words of a several-word idea count only together: a passage covers «parque infantil» when it has
 * that idea (a playground, in any language) or all its words, never with «parque» alone (a car park).
 */
function keepPhrasesWhole(covered: Set<string>, direct: ReadonlySet<string>, groups: readonly PhraseGroup[], has: (concept: string) => boolean): void {
  for (const group of groups) {
    if (has(group.concept) || group.words.every((word) => direct.has(word))) continue;
    for (const word of group.words) covered.delete(word);
  }
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
  const queryWords = searchWords(greetingFree(query));
  const normalizedQuery = normalize(query);
  const queryConcepts = conceptsOf(normalizedQuery);
  if (!queryWords.length && !queryConcepts.size) return [];
  const groups = phraseGroups(normalizedQuery, queryWords);
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
    const direct = new Set(matched);
    for (const concept of shared) for (const word of wordsExplainedBy(concept, normalizedQuery, queryWords)) matched.add(word);
    keepPhrasesWhole(matched, direct, groups, (concept) => doc.concepts.has(concept));
    const meaningful = queryWords.filter((word) => !questionWords.has(word));
    const coverage = meaningful.length ? meaningful.filter((word) => matched.has(word)).length / meaningful.length : 1;
    // Shorter titles that match are more specific; entries in the customer's language win ties.
    score = score / Math.sqrt(1 + (doc.titleLength ?? doc.titleWords.length) / 6) + (options.language && doc.language === options.language ? 0.25 : 0);
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
  const queryWords = searchWords(greetingFree(query));
  const normalizedQuery = normalize(query);
  const queryConcepts = conceptsOf(normalizedQuery);
  if (!queryWords.length && !queryConcepts.size) return [];
  const total = index.chunks.length;
  const k1 = 1.2;
  const b = 0.75;
  const meaningful = [...new Set(queryWords.filter((word) => !questionWords.has(word)))];
  const groups = phraseGroups(normalizedQuery, meaningful);
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
        score += 1;
        matched.add(word);
      }
    }
    const shared = [...queryConcepts].filter((concept) => doc.concepts.has(concept));
    score += shared.length * 2;
    // A window with a line that starts with the idea («Praia dos Pescadores: a 300 m» for «la plage») is more about it.
    score += shared.filter((concept) => (doc.passages ?? []).some((passage) => leadingConcepts(passage).has(concept))).length;
    if (!score) continue;
    const direct = new Set(matched);
    for (const concept of shared) for (const word of wordsExplainedBy(concept, normalizedQuery, queryWords)) matched.add(word);
    keepPhrasesWhole(matched, direct, groups, (concept) => doc.concepts.has(concept));
    const coverage = meaningful.length ? meaningful.filter((word) => matched.has(word)).length / meaningful.length : 1;
    hits.push({ doc, score: score + (options.language && doc.language === options.language ? 0.25 : 0), coverage });
  }
  hits.sort((a, b) => b.score - a.score || b.coverage - a.coverage);
  // Windows overlap: keep the best one around each passage, and point each hit at its best passage
  // (its section is the source the admin sees).
  const q = passageQuery(query);
  const picked: SearchHit[] = [];
  const covered = new Set<Passage>();
  for (const hit of hits) {
    if (picked.length >= (options.limit ?? 4)) break;
    const passages = hit.doc.passages ?? [];
    let best: Passage | undefined;
    let bestScore = 0;
    for (const passage of passages) {
      const value = scorePassage(index, passage, q);
      if (value > bestScore) [best, bestScore] = [passage, value];
    }
    if (best && covered.has(best)) continue;
    for (const passage of passages) covered.add(passage);
    const chunk = best && hit.doc.chunk ? { ...hit.doc.chunk, id: best.chunk.id, heading: best.chunk.heading } : hit.doc.chunk;
    picked.push({ ...hit, doc: { ...hit.doc, chunk }, passage: best });
  }
  return picked;
}

const passageBigrams = new WeakMap<Passage, Map<string, number>>();

/** Pairs of words in a row with at least one meaningful word («uma noite», not «de uma»), and how many of the two are. */
function bigramsOf(normalized: string): Map<string, number> {
  const tokens = normalized ? normalized.split(" ") : [];
  const pairs = new Map<string, number>();
  const meaningful = (token: string) => token.length > 1 && !isStopword(token) && !questionWords.has(token) && !/^\d+$/.test(token);
  for (let at = 0; at + 1 < tokens.length; at++) {
    const count = Number(meaningful(tokens[at])) + Number(meaningful(tokens[at + 1]));
    if (count) pairs.set(`${tokens[at]} ${tokens[at + 1]}`, count);
  }
  return pairs;
}

/** The pairs of words in a row the message and the passage share: 1 for two meaningful words, ½ for one. */
function sharedBigrams(query: PassageQuery, passage: Passage): number {
  let own = passageBigrams.get(passage);
  if (!own) passageBigrams.set(passage, (own = bigramsOf(normalize(passage.text))));
  let shared = 0;
  for (const [pair, count] of bigramsOf(query.normalized)) if (own.has(pair)) shared += count / 2;
  return shared;
}

const passageConcepts = new WeakMap<Passage, Set<string>>();
const passageLeadingConcepts = new WeakMap<Passage, Set<string>>();

/** The concepts a passage starts with (in its first two words): what the line is about. */
export function leadingConcepts(passage: Passage): Set<string> {
  let own = passageLeadingConcepts.get(passage);
  if (!own) {
    const tokens = normalize(passage.text).split(" ");
    passageLeadingConcepts.set(passage, (own = new Set(conceptMatches(tokens).filter((match) => match.start <= 1).map((match) => match.concept))));
  }
  return own;
}

/** The six-language concepts a passage mentions (kept per passage). */
export function conceptsOfPassage(passage: Passage): Set<string> {
  let own = passageConcepts.get(passage);
  if (!own) passageConcepts.set(passage, (own = conceptsOf(normalize(passage.text))));
  return own;
}

/** A message ready for scoring passages: the words that say what it is about, and its concepts. */
export interface PassageQuery {
  /** Meaningful words (or every word when the message has only question words). */
  words: string[];
  concepts: Set<string>;
  normalized: string;
  /** Ideas written in several words: they count only together (phraseGroups). */
  groups?: PhraseGroup[];
}

export function passageQuery(text: string, ignore: readonly string[] = []): PassageQuery {
  const all = searchWords(greetingFree(text));
  const normalized = normalize(text);
  const skip = new Set(ignore);
  const meaningful = all.filter((word) => !questionWords.has(word) && !skip.has(word));
  const words = [...new Set(meaningful.length || skip.size ? meaningful : all)];
  return { words, concepts: conceptsOf(normalized), normalized, groups: phraseGroups(normalized, words) };
}

/** The message's words that coverage counts: numbers next to words («15 minutos atrasado», «somos 5») say how much, not what about. */
export function coverageWords(query: PassageQuery): string[] {
  return query.words.some((word) => !isNumber(word)) ? query.words.filter((word) => !isNumber(word)) : query.words;
}

/** How often each word key appears in a document's passages (kept per document). */
const documentShares = new WeakMap<readonly Passage[], Map<string, number>>();

/**
 * How much a word counts when coverage is measured: a word on more than one passage in eight of the document
 * («consulta» in a clinic's guide, «apartamento» in a house guide) counts half («Fazem consultas ao domicílio?»
 * is about home visits, not about appointments).
 */
export function wordWeight(passage: Passage, word: string): number {
  let shares = documentShares.get(passage.siblings);
  if (!shares) {
    shares = new Map();
    for (const sibling of passage.siblings) for (const key of new Set(sibling.words.map(termKey))) shares.set(key, (shares.get(key) ?? 0) + 1);
    documentShares.set(passage.siblings, shares);
  }
  return (shares.get(termKey(word)) ?? 0) / Math.max(1, passage.siblings.length) > 0.125 ? 0.5 : 1;
}

/** The message's words (coverageWords) a passage covers, directly or through a shared concept. */
export function coveredWords(passage: Passage, query: PassageQuery): Set<string> {
  const words = coverageWords(query);
  const direct = new Set(passageMatches(passage, words));
  const covered = new Set(direct);
  const own = conceptsOfPassage(passage);
  for (const concept of query.concepts) if (own.has(concept)) for (const word of wordsExplainedBy(concept, query.normalized, words)) covered.add(word);
  keepPhrasesWhole(covered, direct, query.groups ?? [], (concept) => own.has(concept));
  for (const word of covered) if (!words.includes(word)) covered.delete(word);
  return covered;
}

/** Share of the message's words a passage covers (directly or through a shared concept), 0..1 (a price line with «15 min» is not about being late). */
export function passageCoverage(passage: Passage, query: PassageQuery): number {
  const words = coverageWords(query);
  if (!words.length) return 1;
  const covered = coveredWords(passage, query);
  const weights = words.map((word) => wordWeight(passage, word));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return words.reduce((sum, word, at) => sum + (covered.has(word) ? weights[at] : 0), 0) / total;
}

const isNumber = (word: string) => /^\d+$/.test(word);

/** The message words a passage contains. */
export function passageMatches(passage: Passage, words: readonly string[]): string[] {
  return words.filter((word) => passage.words.some((candidate) => sameWord(word, candidate)));
}

/**
 * How well one passage answers a message: shared words weighted by how rare they are among the
 * passages, shared concepts (six languages), a little less for long passages, a little more for a
 * question from a frequent-questions list (its answer follows). `startBonus`: list lines whose first
 * words are the ones asked («Corte…» for «quanto custa um corte?»).
 */
export function scorePassage(index: KnowledgeIndex, passage: Passage, query: PassageQuery, options: { startBonus?: boolean } = {}): number {
  const total = index.passages.length || 1;
  // Not for the answer of a frequent question («Sim, 2 € no corte…»): it is not a line of the list.
  const startBonus = options.startBonus && !passage.siblings[passage.position - 1]?.question;
  let score = 0;
  for (const word of query.words) {
    if (!passage.words.some((candidate) => sameWord(word, candidate))) continue;
    const frequency = index.passageFrequency.get(termKey(word)) ?? 1;
    const idf = Math.log(1 + (total - frequency + 0.5) / (frequency + 0.5));
    score += idf;
    if (startBonus && passage.words.slice(0, 2).some((candidate) => sameWord(word, candidate))) score += idf;
  }
  // The same two words in a row («só uma noite» ↔ «estadias de uma noite»): the passage says it the way it was asked.
  score += sharedBigrams(query, passage);
  if (query.concepts.size) {
    const own = conceptsOfPassage(passage);
    score += [...query.concepts].filter((concept) => own.has(concept)).length * 2;
    // A line that starts with the idea is about it («Praia dos Pescadores: a 300 m» for «la plage», not «Há duas toalhas de praia»).
    score += [...query.concepts].filter((concept) => leadingConcepts(passage).has(concept)).length;
  }
  if (!score) return 0;
  score /= Math.sqrt(Math.max(1, passage.words.length / Math.max(8, index.averagePassageLength)));
  if (!passage.question) return score;
  // A frequent question is about what it asks: «Podemos deixar as malas antes do check-in?» shares only «check-in»
  // with «A que horas é o check-in?». The more of its own words the message has, the more its answer counts.
  const own = passage.words.filter((word) => !questionWords.has(word));
  if (!own.length) return score * 1.25;
  const shared = [...query.concepts].filter((concept) => conceptsOfPassage(passage).has(concept));
  const explained = new Set(shared.flatMap((concept) => wordsExplainedBy(concept, normalize(passage.text), own)));
  const asked = own.filter((word) => explained.has(word) || query.words.some((other) => sameWord(word, other))).length / own.length;
  return score * 1.25 * (0.6 + 0.4 * asked);
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
