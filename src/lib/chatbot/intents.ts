// What a customer message is about, from keywords in the six languages (normalized, "*" = word
// beginning). Free and deterministic. The safety intents (emergency, access codes, medical…) decide
// the fixed rules before any answer is written. Pure module (tests/chatbot.test.mjs).
import { hasAnyKeyword, normalize } from "./text.ts";
import type { ChatbotBusinessKind } from "./types.ts";

export const intents = [
  "greeting",
  "thanks",
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
    "preco*", "quanto custa*", "quanto e", "quanto fica", "valor", "price*", "cost*", "how much", "precio*", "cuanto cuesta*",
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
    "diagnostic*", "sintoma*", "medicament*", "medicacao", "dose", "dosagem", "receita", "dor", "doi", "febre", "tomar comprimido*",
    "symptom*", "medication", "medicine", "diagnos*", "prescription", "pain", "fever", "dolor", "fiebre", "symptome*", "medicament",
    "douleur", "fievre", "medikament*", "schmerz*", "fieber", "sintomi", "farmac*", "dolore", "febbre",
  ],
  refund: ["reembols*", "devolu*", "dinheiro de volta", "refund*", "money back", "reembolso", "rembours*", "ruckerstattung", "rueckerstattung", "erstattung", "rimbors*"],
  damage: [
    "parti", "partiu", "partido", "estragad*", "avaria*", "avariad*", "danific*", "nao funciona", "deixou de funcionar", "broken", "broke",
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
  return found.filter((intent) => {
    if (intent === "yes") return normalized.split(" ").length <= 4;
    if (intent === "access_code" && hasAnyKeyword(normalized, ["pin"]) && !hasAnyKeyword(normalized, keywords.access_code.filter((k) => k !== "pin"))) {
      return normalized.split(" ").length <= 8;
    }
    return true;
  });
}

/** Only small talk (hello, thanks, yes): nothing to look up. */
export function isSmallTalk(found: readonly Intent[]): boolean {
  return found.length > 0 && found.every((intent) => intent === "greeting" || intent === "thanks" || intent === "yes");
}
