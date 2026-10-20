// The instructions a real language model would get (phase 2). Written and tested here, but NOT sent
// anywhere: no model is called until the owner chooses and pays for one from the site. The safety
// rules are also enforced in code before and after the model (engine.ts, guardrails.ts), so a model
// that ignores the prompt still can't leak a door code or skip the hand-off.
import { formatWeek } from "../hours.ts";
import type { SearchHit } from "../knowledge.ts";
import { formatPrice } from "../text.ts";
import type { BotSettings, BusinessKnowledge, ChatbotLanguage } from "../types.ts";

const languageNames: Record<ChatbotLanguage, string> = {
  pt: "European Portuguese (pt-PT)",
  en: "English",
  es: "Spanish (usted)",
  fr: "French (vous)",
  de: "German (Sie)",
  it: "Italian (formal Lei)",
};

export function buildSystemPrompt(knowledge: BusinessKnowledge, settings: BotSettings, language: ChatbotLanguage): string {
  const kindRules: string[] = [];
  if (knowledge.kind === "lodging") {
    kindRules.push(
      "- NEVER share door, keybox, alarm or safe codes (the Wi-Fi password is fine when it is in the information below). If asked for an access code, say the host will send it and stop.",
      "- NEVER confirm or deny who is staying, nor give any guest's name, dates or details.",
      "- Emergencies: tell the guest to call 112 first; the system alerts the host.",
      "- Complaints, damage, refunds, early check-in and late check-out go to the host: say so, do not promise anything.",
    );
  }
  if (knowledge.kind === "clinic") {
    kindRules.push("- NEVER give medical advice, diagnoses, dosages or medication guidance. Practical questions only (services, prices, hours, preparation the clinic wrote down).");
  }
  return [
    `You are the automated WhatsApp assistant of «${knowledge.businessName}». You are an assistant, not a person: never pretend otherwise.`,
    `Answer in ${languageNames[language]}. Tone: ${settings.tone === "formal" ? "polite and formal" : "warm and close, still polite"}. Short messages (WhatsApp): at most 4 short sentences, plus a link when useful.`,
    "",
    "Rules:",
    "- Use ONLY the business information below. If the answer is not there, say you don't have that information and offer to pass the chat to the team. Never guess prices, hours, availability or policies.",
    "- Do not promise discounts, refunds or exceptions that are not in the policies.",
    "- Do not give medical, legal or financial advice.",
    "- Never ask for sensitive data (health data, card numbers, passwords).",
    "- To book, send the booking link; you cannot confirm a booking yourself.",
    "- If the customer asks for a person, complains, or the request is outside the information, say the team will reply here.",
    ...kindRules,
    "",
    "Business information:",
    knowledge.address ? `Address: ${knowledge.address}` : null,
    knowledge.phone ? `Phone: ${knowledge.phone}` : null,
    knowledge.bookingUrl ? `Booking link: ${knowledge.bookingUrl}` : null,
    knowledge.menuUrl ? `Menu / price list: ${knowledge.menuUrl}` : null,
    knowledge.hours.length ? `Opening hours (${knowledge.timeZone}):\n${formatWeek(knowledge.hours, "en")}` : "Opening hours: not provided.",
    knowledge.closures.length ? `Closed on: ${knowledge.closures.map((closure) => `${closure.day}${closure.reason ? ` (${closure.reason})` : ""}`).join(", ")}` : null,
    knowledge.properties.length ? `Properties on this number: ${knowledge.properties.join(", ")}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/** The retrieved entries and catalogue lines given to the model with the customer's message. */
export function buildContext(hits: readonly SearchHit[], language: ChatbotLanguage): string {
  if (!hits.length) return "Relevant information: none found.";
  const lines = hits.map((hit) => {
    if (hit.doc.kind === "entry" && hit.doc.entry) {
      const entry = hit.doc.entry;
      return `- Q: ${entry.question}${entry.property ? ` [${entry.property}]` : ""}\n  A: ${entry.answer}`;
    }
    const item = hit.doc.item!;
    return `- ${item.name}${item.priceCents !== null ? ` — ${formatPrice(item.priceCents, language)}` : ""}${item.description ? `: ${item.description}` : ""}`;
  });
  return `Relevant information:\n${lines.join("\n")}`;
}
