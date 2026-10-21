// What a customer message is about, from keywords in the six languages (normalized, "*" = word
// beginning). Free and deterministic. The safety intents (emergency, access codes, medical…) decide
// the fixed rules before any answer is written. Pure module (tests/chatbot.test.mjs).
import { dayMention, isDayWord } from "./hours.ts";
import { hasAnyKeyword, normalize, searchWords } from "./text.ts";
import type { ChatbotBusinessKind } from "./types.ts";

export const intents = [
  "greeting",
  "thanks",
  "bye",
  "yes",
  "hours",
  "location",
  "booking",
  "menu",
  "price",
  "human",
  "complaint",
  "emergency",
  "urgent",
  "access_code",
  "guest_identity",
  "medical",
  "refund",
  "damage",
  "early_checkin",
  "late_checkout",
] as const;
export type Intent = (typeof intents)[number];

const keywords: Record<Intent, readonly string[]> = {
  greeting: [
    "ola", "oi", "bom dia", "boa tarde", "boa noite", "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
    "hola", "buenos dias", "buenas tardes", "buenas noches", "bonjour", "bonsoir", "salut", "hallo", "guten tag", "guten morgen",
    "guten abend", "servus", "moin", "ciao", "buongiorno", "buonasera", "salve",
  ],
  thanks: ["obrigad*", "obg", "thank*", "thx", "gracias", "merci", "danke", "grazie", "muito obrigad*"],
  bye: [
    "adeus", "ate logo", "ate ja", "ate amanha", "ate breve", "ate a proxima", "ate segunda", "ate terca", "ate quarta", "ate quinta", "ate sexta", "ate sabado",
    "ate domingo", "ate para a semana", "tchau", "xau", "bye", "goodbye", "good bye", "see you", "adios",
    "hasta luego", "hasta pronto", "hasta manana", "au revoir", "a bientot", "a demain", "tschuss", "tschuess", "auf wiedersehen", "bis bald", "bis morgen",
    "arrivederci", "a presto", "a domani",
  ],
  yes: ["sim", "yes", "yeah", "yep", "ok", "okay", "si", "oui", "ja", "claro", "por favor", "please", "s il vous plait", "bitte", "certo", "va bene"],
  hours: [
    "horario*", "a que horas", "que horas", "abre*", "abert*", "fecha*", "estao abertos", "open*", "close*", "closing", "what time",
    "abiert*", "cierra*", "a que hora", "ouvert*", "ferme*", "horaire*", "quelle heure", "offnungszeit*", "oeffnungszeit*",
    "geoffnet", "geschlossen", "wann", "orari*", "aperto", "aperti", "chiuso", "chiusi", "chiude*", "apre*", "a che ora",
  ],
  location: [
    "morada", "endereco", "onde fica*", "onde e que", "onde estao", "localiza*", "como chegar", "address", "where are you", "where is",
    "location", "how to get", "direccion", "donde esta*", "donde queda*", "ubicacion", "como llegar", "adresse", "ou etes vous",
    "ou se trouve", "comment venir", "wo sind sie", "wo ist", "wo befindet", "anschrift", "indirizzo", "dove siete", "dove si trova",
    "come arrivare", "mapa", "map", "maps", "gps",
  ],
  booking: [
    "reserv*", "marcar", "marcacao", "agendar", "mesa para", "book", "booking", "appointment", "table for", "cita", "prenot*",
    "termin*", "buchen", "rendez vous", "rdv", "lugar para", "vaga", "disponibilidade", "availability", "disponibilidad", "disponibilite",
  ],
  menu: [
    "menu*", "ementa", "carta", "prato*", "comida", "comer", "dish*", "food", "eat", "plat*", "speisekarte", "gericht*", "essen",
    "piatt*", "mangiare", "vegetarian*", "vegan*", "sem gluten", "gluten*", "servico*", "service*", "servicio*", "dienstleistung*", "serviz*",
    "tratamento*", "treatment*", "tratamiento*", "soin*", "behandlung*", "trattament*",
  ],
  price: [
    "preco*", "precario*", "tabela de precos", "lista de precos", "custo", "custos", "desconto*", "promocao", "promocoes", "discount*", "descuento*", "rabatt*", "sconto", "sconti", "quanto custa*", "quanto e", "quanto fica", "quanto pago", "quanto se paga", "quanto pagam", "valor", "price*", "cost*", "how much", "precio*", "cuanto cuesta*",
    "cuanto vale", "cuanto es", "prix", "combien", "tarif*", "preis*", "kostet", "wie viel", "wieviel", "prezz*", "quanto costa*",
  ],
  human: [
    "falar com", "pessoa real", "humano", "atendente", "funcionario", "gerente", "responsavel", "dono", "equipa", "anfitri*",
    "human", "real person", "someone", "agent", "staff", "manager", "owner", "team", "host",
    "persona", "hablar con", "encargado", "equipo",
    "une personne", "quelqu un", "conseiller", "responsable", "equipe", "hote",
    "mensch", "mitarbeiter", "jemand", "gastgeber", "vermieter",
    "persona reale", "operatore", "parlare con", "proprietario", "host",
  ],
  complaint: [
    "reclama*", "queixa*", "mau servico", "pessimo", "horrivel", "inaceitavel", "vergonha", "complain*", "terrible", "awful",
    "unacceptable", "disappointed", "worst", "queja*", "fatal", "inaceptable", "plainte*", "inacceptable", "decu", "nul",
    "beschwerde*", "reklamation*", "schrecklich", "unverschamt", "reclamo*", "lamentel*", "inaccettabile", "pessimo servizio",
  ],
  emergency: [
    "emergencia*", "socorro", "incendio", "pegou fogo", "ha fogo", "esta a arder", "fuga de gas", "cheira a gas", "inundacao", "inundado", "acidente", "ambulancia",
    "policia", "112", "emergency", "fire", "gas leak", "smell gas", "flood", "flooding", "accident", "ambulance", "police", "help me",
    "fuego", "fuga de gas", "inundacion", "urgence", "feu", "fuite de gaz", "inondation", "pompiers", "au secours", "notfall*",
    "feuer", "gasleck", "uberschwemmung", "krankenwagen", "polizei", "hilfe", "emergenza", "fuoco", "fuga di gas", "allagamento",
    "ambulanza", "polizia", "aiuto",
  ],
  urgent: ["urgente", "urgent", "urgencia", "dringend", "asap", "quanto antes", "lo antes posible", "au plus vite", "subito"],
  access_code: [
    "codigo da porta", "codigo de acesso", "codigo do alarme", "codigo da caixa", "caixa das chaves", "caixa de chaves", "cofre das chaves",
    "codigo de entrada", "door code", "access code", "alarm code", "entry code", "keybox", "key box", "lockbox", "lock box", "key safe",
    "codigo de la puerta", "caja de llaves", "codigo de la alarma", "code de la porte", "boite a cles", "code d acces", "code de l alarme",
    "code d entree", "turcode", "tuercode", "schlusselbox", "schluesselbox", "schlusselsafe", "alarmcode", "zugangscode",
    "codice della porta", "cassetta delle chiavi", "codice di accesso", "codice allarme", "codice d ingresso", "pin da porta", "pin",
  ],
  guest_identity: [
    "quem esta hospedad*", "esta hospedad*", "estao hospedad*", "quem esta ai", "who is staying", "is staying at", "is staying there",
    "guest named", "esta alojad*", "quien se aloja", "qui sejourne", "sejourne chez", "wer wohnt", "wohnt bei ihnen", "chi alloggia",
    "alloggia da voi",
  ],
  medical: [
    "diagnostic*", "sintoma*", "medicament*", "medicacao", "dose", "dosagem", "receita", "dor", "dores", "doi", "doem", "doer", "febre", "tomar comprimido*",
    "inchad*", "inchaco", "sangra*", "sangue", "infec*", "abcesso", "antibiotic*", "analgesic*", "anti inflamatorio", "ibuprofeno", "paracetamol",
    "o que posso tomar", "posso tomar", "posso comer", "posso beber", "pos operatorio", "cuidados depois",
    "symptom*", "medication", "medicine", "diagnos*", "prescription", "pain", "painful", "hurts", "fever", "swollen", "swelling", "bleeding", "infection",
    "antibiotic*", "painkiller*", "toothache", "can i eat", "can i drink", "can i take", "aftercare",
    "dolor", "duele", "fiebre", "hinchad*", "sangr*", "infeccion", "puedo tomar", "puedo comer", "symptome*", "medicament", "douleur", "fievre", "gonfle*",
    "saigne*", "infection", "puis je manger", "puis je prendre", "medikament*", "schmerz*", "fieber", "geschwollen", "blutet", "entzund*", "darf ich essen",
    "sintomi", "farmac*", "dolore", "febbre", "gonfi*", "sanguin*", "infezione", "posso mangiare",
  ],
  refund: ["reembols*", "devolu*", "dinheiro de volta", "refund*", "money back", "reembolso", "rembours*", "ruckerstattung", "rueckerstattung", "erstattung", "rimbors*"],
  damage: [
    "parti", "partiu", "partido", "estragad*", "estragou", "avari*", "danific*", "nao funciona", "deixou de funcionar", "sem agua quente", "nao ha agua quente",
    "nao ha agua", "sem agua", "nao ha luz", "sem luz", "broken", "broke", "no hot water",
    "damage*", "not working", "doesn t work", "roto", "rota", "averia*", "no funciona", "casse", "en panne", "ne marche pas",
    "ne fonctionne pas", "kaputt", "defekt", "funktioniert nicht", "rotto", "guasto", "non funziona",
  ],
  early_checkin: [
    "check in antecipado", "check in mais cedo", "entrada antecipada", "chegar mais cedo", "entrar mais cedo", "early check in", "early checkin",
    "arrive early", "arrive earlier", "llegar antes", "entrada anticipada", "check in anticipado", "arrivee anticipee", "arriver plus tot",
    "fruher einchecken", "frueher einchecken", "fruher ankommen", "check in anticipato", "arrivare prima", "entrare prima",
  ],
  late_checkout: [
    "check out tardio", "check out mais tarde", "saida tardia", "sair mais tarde", "late check out", "late checkout", "leave later",
    "check out later", "salida tardia", "salir mas tarde", "check out tardio", "depart tardif", "partir plus tard", "spater auschecken",
    "spaeter auschecken", "spater abreisen", "check out posticipato", "partire piu tardi", "uscire piu tardi",
  ],
};

/**
 * «Can I come?» phrasing in the six languages (normalized). With a day («amanhã», «no sábado») it is a
 * question about the opening hours of that day and how to book (never about a free slot: the assistant
 * doesn't see the calendar). Alone it is too vague («Dá para pagar com MB WAY?», «Posso ir com o cão?»).
 */
export const availabilityPhrases = [
  "da para", "dava para", "daria para", "tem vaga*", "tens vaga*", "ha vaga*", "tem lugar", "ha lugar", "posso ir", "podemos ir", "posso passar",
  "podemos passar", "posso aparecer", "posso vir", "podemos vir", "estao abertos", "estao abertas", "vao estar abertos", "funcionam", "atendem",
  "trabalham", "can i come", "can we come", "can i drop", "can i walk in", "can i stop by", "are you open", "will you be open", "do you have space",
  "any slots", "any availability", "is there availability", "puedo ir", "podemos ir", "puedo pasar", "estan abiertos", "abren", "hay hueco",
  "teneis hueco", "tienen hueco", "se puede ir", "je peux venir", "puis je venir", "peut on venir", "on peut venir", "etes vous ouverts",
  "vous etes ouverts", "avez vous de la place", "kann ich kommen", "kann ich vorbeikommen", "konnen wir kommen", "haben sie offen", "haben sie geoffnet",
  "habt ihr offen", "habt ihr geoffnet", "noch platz", "termin frei", "posso venire", "possiamo venire", "posso passare", "siete aperti", "c e posto",
  "avete posto",
];

/**
 * Keywords that make a menu question and also say what it is about («Têm pratos vegetarianos?», «É sem
 * glúten?»): never taken out of a message as «the kind of question» (doc-answers.ts intentWords).
 */
export const subjectKeywords: ReadonlySet<string> = new Set(["vegetarian*", "vegan*", "sem gluten", "gluten*"]);

/** Intents that say nothing about what the customer wants to know (a day with only these is about the hours of that day). */
const smallTalk: readonly Intent[] = ["greeting", "thanks", "bye", "yes"];

/** Intents that only mean something for some kinds of business. */
const onlyFor: Partial<Record<Intent, readonly ChatbotBusinessKind[]>> = {
  access_code: ["lodging"],
  guest_identity: ["lodging"],
  early_checkin: ["lodging"],
  late_checkout: ["lodging"],
  medical: ["clinic"],
};

export function detectIntents(text: string, kind: ChatbotBusinessKind): Intent[] {
  const normalized = normalize(text);
  if (!normalized) return [];
  const found = intents.filter((intent) => {
    const kinds = onlyFor[intent];
    if (kinds && !kinds.includes(kind)) return false;
    return hasAnyKeyword(normalized, keywords[intent]);
  });
  // «pin» alone is a code only in a short message; «sim» / «ok» count as a yes only when they are the message.
  const kept = found.filter((intent) => {
    if (intent === "yes") return normalized.split(" ").length <= 4;
    if (intent === "access_code" && hasAnyKeyword(normalized, ["pin"]) && !hasAnyKeyword(normalized, keywords.access_code.filter((k) => k !== "pin"))) {
      return normalized.split(" ").length <= 8;
    }
    return true;
  });
  return withDayQuestion(normalized, aboutTheBusiness(normalized, kept));
}

/** «aberto», «fechado», «open», «closed» in the six languages (normalized; "*" = word beginning). */
const openWords = ["abert*", "fechad*", "abiert*", "cerrad*", "ouvert*", "ferme*", "geoffnet", "geschlossen", "aperto", "aperti", "aperta", "aperte", "chiuso", "chiusi", "chiusa", "open", "closed"];

/** Words before «aberto» that keep it about the business: the place, «vocês», verbs, greetings, small words. */
const openSubjects = new Set(
  (
    "loja restaurante cozinha clinica consultorio salao barbearia cabeleireiro esplanada cafe bar espaco casa sala voces voce senhores " +
    "you ustedes vosotros vous sie ihr voi shop store restaurant clinic salon kitchen tienda cocina boutique magasin cuisine laden kuche negozio cucina ristorante " +
    "estao estamos esta estara estarao vao ficam sao e is are will be estan esta etes est sont ist sind sono siete ainda ja hoje amanha agora ola bom boa dia tarde noite " +
    "hello hi hola bonjour hallo ciao buongiorno sim nao ok entao tambem que qual quais quando como"
  ).split(" "),
);

/**
 * «Os novelos já estão abertos, faz mal?» is about the wool, not the opening hours: when only «aberto/fechado» says
 * hours and another subject comes before it, it is not an hours question («A loja está aberta?», «Estão abertos
 * amanhã?» still are).
 */
function aboutTheBusiness(normalized: string, found: Intent[]): Intent[] {
  if (!found.includes("hours")) return found;
  if (keywords.hours.some((keyword) => !openWords.includes(keyword) && hasAnyKeyword(normalized, [keyword]) && !openWords.some((word) => hasAnyKeyword(keyword, [word])))) return found;
  const tokens = normalized.split(" ");
  const at = tokens.findIndex((token) => openWords.some((word) => hasAnyKeyword(token, [word])));
  if (at <= 0) return found;
  const subject = searchWords(tokens.slice(0, at).join(" ")).some((word) => !openSubjects.has(word) && !isDayWord(word) && !/^\d+$/.test(word));
  return subject ? found.filter((intent) => intent !== "hours") : found;
}

/** «até sábado», «until Monday», «hasta el lunes»: a day as a deadline, not as a day to come. */
const deadlineWords = new Set(["ate", "until", "till", "by", "hasta", "jusqu", "bis", "fino", "entro"]);

function untilDay(normalized: string): boolean {
  const tokens = normalized.split(" ");
  return tokens.some((token, at) => isDayWord(token) && token !== "feira" && tokens.slice(Math.max(0, at - 2), at).some((word) => deadlineWords.has(word)));
}

/**
 * «Dá para cortar o cabelo amanhã?», «Estão abertos no sábado?», «Can I come tomorrow?»: a day with
 * «can I come» phrasing, with an hours or booking question, or with nothing else asked («E amanhã?»,
 * «Cortam cabelo no sábado?») is about the opening hours of that day and how to book.
 */
function withDayQuestion(normalized: string, found: Intent[]): Intent[] {
  // «Obrigado, até amanhã!» says goodbye, it doesn't ask about tomorrow; «Podem guardar-me um kit até sábado?» asks
  // them to keep something until then.
  if (found.includes("bye") || !dayMention(normalized) || untilDay(normalized)) return found;
  const about = found.filter((intent) => !smallTalk.includes(intent));
  const phrased = hasAnyKeyword(normalized, availabilityPhrases);
  // «Dá para fazer um tratamento no sábado?» (a service named) still asks whether one can come that day.
  const fits = about.every((intent) => intent === "hours" || intent === "booking" || intent === "urgent" || (phrased && intent === "menu"));
  if (!fits) return found;
  // A day and a few words («Cortam cabelo no sábado?»); a longer message is about something else («Hoje está a chover, há guarda-chuvas?»).
  if (!phrased && !about.length && searchWords(normalized).filter((word) => !isDayWord(word)).length > 3) return found;
  const add: Intent[] = ["hours", "booking"];
  return intents.filter((intent) => found.includes(intent) || add.includes(intent));
}

/** Only small talk (hello, thanks, yes): nothing to look up. */
export function isSmallTalk(found: readonly Intent[]): boolean {
  return found.length > 0 && found.every((intent) => smallTalk.includes(intent));
}

/** The keywords of each intent (normalized; "*" = word beginning), for answers that need them. */
export { keywords as intentKeywords };
