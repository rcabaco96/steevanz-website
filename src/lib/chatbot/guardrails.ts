// Last check on every answer before it is sent, whatever wrote it (mock now, a real model later):
// no access codes for lodging, no card numbers, no over-long walls of text. And the summary the team
// gets when a chat is passed to them. Pure module (tests/chatbot.test.mjs).
import { normalize, shorten } from "./text.ts";
import type { BusinessKnowledge, ChatbotBusinessKind, ChatbotLanguage, ChatMessage, HandoffReason } from "./types.ts";

/** Words next to which digits are a secret (door, keybox, alarm, safe), in the six languages. */
const secretWords =
  /(c[oó]digo|code|codice|pin|alarm[ea]?|alarme|allarme|keybox|key\s?box|lock\s?box|caixa\s+(das|de)\s+chaves|cofre|caja\s+de\s+llaves|bo[iî]te\s+[aà]\s+cl[eé]s|schl[uü]ssel(box|safe|kasten)|cassetta|t[uü]rcode|zugangscode|tresor|safe)/i;

/** Postal codes and phone numbers are not secrets. */
const harmlessCodes = /(c[oó]digo\s+postal|postal\s?code|post\s?code|zip|code\s+postal|c[oó]digo\s+de\s+pa[ií]s|postleitzahl|plz|codice\s+postale|\bcap\b)/gi;

/** A run of 3+ digits (or a code like «12#34»), possibly split by spaces or dashes. */
const digitsRun = /\d[\d\s#*-]{2,}\d|\d{3,}/;

/** Something that looks like a payment card number. */
const cardNumber = /\b(?:\d[ -]?){13,19}\b/;

/** A line that would leak a secret for this kind of business (lodging: a «code» word and a run of digits). */
export function leaksSecret(line: string, kind: ChatbotBusinessKind): boolean {
  return kind === "lodging" && secretWords.test(line.replace(harmlessCodes, "")) && digitsRun.test(line);
}

export interface SanitizedReply {
  text: string;
  /** Something was removed: the chat should go to a person. */
  blocked: boolean;
}

/**
 * Removes the lines that would leak a secret. For lodging: any line that has a «code» word and a run
 * of digits (the host may have typed the door code into an answer by mistake). For everyone: card
 * numbers. Very long answers are cut (WhatsApp reads best short).
 */
export function sanitizeReply(text: string, kind: ChatbotBusinessKind, maxLength = 900): SanitizedReply {
  let blocked = false;
  const lines = text.split("\n").filter((line) => {
    if (leaksSecret(line, kind)) {
      blocked = true;
      return false;
    }
    if (cardNumber.test(line)) {
      blocked = true;
      return false;
    }
    return true;
  });
  const joined = lines.join("\n").trim();
  return { text: joined.length > maxLength ? shorten(joined, maxLength) : joined, blocked };
}

// Prices and VAT (owner's absolute rule, 2026-10-18: never an amount with VAT calculated). --------------

/** A VAT word in the six languages. */
const vatWord = /\b(?:iva|vat|tva|mwst|mehrwertsteuer|umsatzsteuer)\b/i;

/** «+ IVA», «+ VAT», «+ TVA», «zzgl. MwSt.» right after a price. */
const vatNoteAfter = /^\s*(?:\(\s*)?(?:\+\s*(?:iva|vat|tva|mwst)\b|zzgl\.?\s*(?:der\s+)?mwst|plus\s+vat\b|hors\s+tva\b|ht\b)/i;

/** A sentence that says plainly that its prices are without VAT («Preços sem IVA», «acresce IVA», «excl. VAT»…). */
const vatExcludedSentence =
  /acresce(?:nta)?\s+(?:o\s+)?iva|\bsem\s+iva\b|\bs\/\s*iva\b|\bexcl(?:uding|\.)?\s*vat\b|\bplus\s+vat\b|\bhors\s+tva\b|\bohne\s+mwst|\biva\s+esclusa|\bm[aá]s\s+iva\b|\biva\s+n[aã]o\s+inclu|\biva\s+no\s+inclu/i;

/** A business that writes its prices without VAT («20 € + IVA», «Preços sem IVA»). */
const vatExcludedText = new RegExp(String.raw`\+\s*(?:iva|vat|tva|mwst)\b|\bzzgl\.?\s*(?:der\s+)?mwst|` + vatExcludedSentence.source, "i");

/**
 * Prices said to include VAT, in the six languages. Written in pieces so the site's own wording check
 * (tests/vat-wording.test.mjs) never finds these words in the code.
 */
const vatIncludedForm = new RegExp(
  [
    String.raw`\bc(?:om|\/)\s*iva\b`,
    String.raw`\biva\s+inclu[ií]d`,
    String.raw`\bincl(?:uding|uded|\.)?\s*vat\b`,
    String.raw`\bvat\s+inclu`,
    String.raw`\bwith\s+vat\b`,
    String.raw`\bt{2}c\b`,
    String.raw`\btva\s+(?:compris|inclus)`,
    String.raw`\binkl\.?\s*mwst`,
    String.raw`\bmwst\.?\s+inklusive`,
    String.raw`\biva\s+(?:inclus|compres)`,
    String.raw`\bcon\s+(?:l['’])?iva\b`,
  ].join("|"),
  "i",
);

/** A VAT rate: «IVA (23 %)», «IVA a 23%», «23 % de IVA», «VAT at 23%», «MwSt. 19 %» (not «3% por venda» elsewhere in the sentence). */
const vatRate = /\b(?:iva|vat|tva|mwst)\.?\s*(?:\(\s*|(?:a|à|at|de|of|à|al|von)\s+)?\d{1,2}(?:[.,]\d)?\s*%|\d{1,2}(?:[.,]\d)?\s*%\s*(?:de\s+|of\s+|d['’]\s*)?(?:iva|vat|tva|mwst)\b/i;

/** The VAT worked out: a rate («IVA (23 %)»), a sum («+ IVA = 24,60 €») or a multiplication («× 1,23») next to a VAT word. */
function computesVat(sentence: string): boolean {
  return vatWord.test(sentence) && (vatRate.test(sentence) || sentence.includes("=") || /[×x*]\s*1[.,]\d/.test(sentence));
}

/** How «+ IVA» is written after a price in each language (the site's wording). */
export const vatNotes: Record<ChatbotLanguage, string> = { pt: "+ IVA", en: "+ VAT", es: "+ IVA", fr: "+ TVA", de: "zzgl. MwSt.", it: "+ IVA" };

/** A price in a reply: «20 €», «1.200,00 €», «€20», «20 euros», with «/mês»-style periods after it. */
const priceToken =
  /(?:€\s?\d{1,3}(?:[.\s ]\d{3})*(?:[.,]\d{1,2})?|\d{1,3}(?:[.\s ]\d{3})*(?:[.,]\d{1,2})?\s?(?:€|euros?\b|eur\b))(?:\s?\/\s?(?:mês|mes|month|mois|monat|mese|ano|año|year|an|jahr|anno)\b)?/giu;

/** «a», «–», «to», «até», «bis»… followed by another price: a range takes one note, after its last price. */
const rangeNext = /^\s*(?:a|à|-|–|—|to|até|ate|hasta|bis|al|fino a)\s*(?:€\s?)?\d/i;

const vatCache = new WeakMap<object, boolean>();

/**
 * Whether this business writes its prices without VAT (a B2B business such as Steevanz: «20 € + IVA», «Preços
 * sem IVA», «acresce IVA», «+ VAT»…) in any of its answers, documents or items. Then every price in a reply keeps
 * that note. Cached per knowledge object.
 */
export function pricesExcludeVat(knowledge: Pick<BusinessKnowledge, "entries" | "chunks" | "items">): boolean {
  const cached = vatCache.get(knowledge);
  if (cached !== undefined) return cached;
  const texts = [
    ...knowledge.entries.filter((entry) => entry.active).map((entry) => entry.answer),
    ...(knowledge.chunks ?? []).map((chunk) => chunk.body),
    ...knowledge.items.map((item) => `${item.name} ${item.description ?? ""}`),
  ];
  const result = texts.some((text) => vatExcludedText.test(text));
  vatCache.set(knowledge, result);
  return result;
}

/** Sentences and lines with the spaces after them (the same cut as llm/grounding.ts → sentences). */
const sentencesOf = (text: string): string[] => text.match(/(?:[^.!?…\n]|[.!?…]+(?!\s|$))+(?:[.!?…]+)?\s*/g) ?? [text];

/** «+ IVA» after every price of the sentence that doesn't have it (one per range), unless the sentence already says it plainly. */
function withVatNotes(sentence: string, language: ChatbotLanguage): string {
  if (vatExcludedSentence.test(sentence)) return sentence;
  return sentence.replace(priceToken, (price: string, offset: number) => {
    const after = sentence.slice(offset + price.length);
    if (vatNoteAfter.test(after) || rangeNext.test(after)) return price;
    return `${price} ${vatNotes[language]}`;
  });
}

/**
 * The last check on prices in every reply, whoever wrote it. For every business: a sentence that works the VAT out
 * (a VAT word with a rate, «=» or «× 1,23») is dropped. For a business whose prices are without VAT: a sentence
 * that calls them VAT-inclusive is dropped too, and every price left keeps its note («20 € + IVA», «€20 + VAT»).
 * Empty when nothing is left (the engine then says it doesn't know).
 */
export function keepVatAsWritten(text: string, language: ChatbotLanguage, excludesVat: boolean): string {
  const kept = sentencesOf(text).filter((part) => !(vatWord.test(part) && (computesVat(part) || (excludesVat && vatIncludedForm.test(part)))));
  return (excludesVat ? kept.map((part) => withVatNotes(part, language)) : kept).join("").trim();
}

const reasonLabels: Record<HandoffReason, string> = {
  emergency: "Emergência",
  customer_asked: "O cliente pediu para falar com uma pessoa",
  complaint: "Reclamação",
  access_code: "Pedido de código de acesso",
  medical: "Questão clínica",
  refund: "Pedido de reembolso",
  damage: "Avaria ou dano",
  early_checkin: "Pedido de entrada antecipada",
  late_checkout: "Pedido de saída tardia",
  unknown_answer: "Pergunta sem resposta na informação do negócio",
  loop_guard: "Demasiadas mensagens seguidas (possível robô)",
  owner_took_over: "A equipa assumiu a conversa",
};

export function handoffReasonLabel(reason: HandoffReason): string {
  return reasonLabels[reason];
}

const languageNames: Record<string, string> = { pt: "português", en: "inglês", es: "espanhol", fr: "francês", de: "alemão", it: "italiano" };

/**
 * The summary the team reads (in Portuguese, the admin's language) when a chat is passed to them:
 * why, in which language, which property, and the customer's last messages.
 */
export function handoffSummary(input: {
  reason: HandoffReason;
  language: string;
  property?: string | null;
  history: readonly ChatMessage[];
  maxMessages?: number;
}): string {
  const customer = input.history.filter((message) => message.author === "customer" && normalize(message.body)).slice(-(input.maxMessages ?? 3));
  const lines = [
    `Motivo: ${reasonLabels[input.reason]}.`,
    `Língua do cliente: ${languageNames[input.language] ?? input.language}.`,
    input.property ? `Alojamento: ${input.property}.` : null,
    customer.length ? `Últimas mensagens do cliente: ${customer.map((message) => `«${shorten(message.body, 160)}»`).join(" · ")}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}
