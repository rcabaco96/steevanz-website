// Last check on every answer before it is sent, whatever wrote it (mock now, a real model later):
// no access codes for lodging, no card numbers, no over-long walls of text. And the summary the team
// gets when a chat is passed to them. Pure module (tests/chatbot.test.mjs).
import { normalize, shorten } from "./text.ts";
import type { ChatbotBusinessKind, ChatMessage, HandoffReason } from "./types.ts";

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
