/**
 * The replies the owner already gave on Google (google_reviews.owner_reply): his real voice.
 * Business rule (regras-negocio-reviews, rule 11):
 * - their sentences teach the AI replies by themselves (no «Treinar» needed), only Portuguese
 *   replies with some substance (the library is the owner's Portuguese voice; «Obrigado!» teaches
 *   no sentence);
 * - before the replies are configured, they pre-fill the settings form with what can be inferred
 *   (address form, length, emojis, signature, contact for negatives, star-only replies). Tones are
 *   not guessed: words alone do not say «próximo» or «elegante» reliably.
 * Nothing here is invented: every value comes from replies the owner wrote. Pure module so it can be
 * tested with node --test and used by the reader (scripts/reader) and the site.
 */
import { isNegative } from "./analytics.ts";
import { detectLanguage } from "./reply-languages.ts";
import { learnFromAnswer, replyKey, splitSentences, type LearnedSnippet } from "./reply-rules.ts";
import { normalize } from "./text.ts";
import type { AddressForm, ReplyLength, ReplySettings } from "./replies.ts";

/** One stored review with the owner's reply on Google. */
export interface OwnerReply {
  reviewId: string;
  rating: number;
  /** The review's text (null for star-only reviews). */
  reviewText: string | null;
  reply: string;
}

/** Replies shorter than this (without the signature) teach no sentence: «Obrigado!», «Muito obrigado 🙏». */
export const ownerReplyMinChars = 25;

/** Fewer replies than this and a habit (address form, length, emojis, signature) is not inferred. */
export const inferMinReplies = 3;

/** Words that make a short reply Portuguese when the language detector cannot tell («Muito obrigado 🙏»). */
const portugueseCue = /\b(obrigad[oa]s?|agradec\w*|volte\w*|abraco\w*|beijinhos?|cumprimentos|ate breve)\b/;

/** Whether the owner wrote this reply in Portuguese (sure detection, else a Portuguese thank-you word). */
export function isPortugueseReply(reply: string): boolean {
  const detected = detectLanguage(reply);
  return detected ? detected === "pt" : portugueseCue.test(normalize(reply));
}

/** Last lines that close a reply but are not a signature. */
const notSignature = /^(muito |muitissimo )?(obrigad|thank|cumprimentos|melhores cumprimentos|atenciosamente|abraco|beijinho|ate breve|ate ja|volte sempre|volta sempre|bom dia|boa tarde|boa noite|ola)/;

/** The reply's last line or trailing «— Name» when it looks like a signature, else null. */
export function signatureCandidate(reply: string): string | null {
  const lines = reply
    .trim()
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  let candidate: string | null = null;
  if (lines.length > 1) candidate = lines[lines.length - 1];
  else candidate = lines[0]?.match(/\s([—–-]\s*[^—–\n.!?]{2,60})$/)?.[1] ?? null;
  if (!candidate) return null;
  const words = candidate.replace(/^[—–-]\s*/, "");
  if (words.length < 2 || words.length > 60 || words.split(/\s+/).length > 6) return null;
  if (/[.!?…:,;]$/.test(words) || notSignature.test(normalize(words).trim())) return null;
  return candidate;
}

/**
 * The owner's signature: a last line (or trailing «— Name») repeated in at least 3 replies and in at
 * least a third of the replies with some substance. Null when there is none.
 */
export function inferSignature(replies: string[]): string | null {
  const substantial = replies.filter((reply) => reply.trim().length >= ownerReplyMinChars).length;
  const counts = new Map<string, { text: string; count: number }>();
  for (const reply of replies) {
    const candidate = signatureCandidate(reply);
    if (!candidate) continue;
    const key = replyKey(candidate);
    if (!key) continue;
    const entry = counts.get(key) ?? { text: candidate, count: 0 };
    entry.count++;
    counts.set(key, entry);
  }
  const best = [...counts.values()].sort((a, b) => b.count - a.count)[0];
  return best && best.count >= inferMinReplies && best.count * 3 >= substantial ? best.text : null;
}

/** The reply without its signature (last line or trailing «— Name») and the dash before it. */
export function stripSignature(reply: string, signature: string | null): string {
  const text = reply.trim();
  const sign = signature?.trim();
  if (!sign) return text;
  const key = replyKey(sign);
  const lines = text.split(/\n+/);
  if (lines.length > 1 && replyKey(lines[lines.length - 1]) === key) return lines.slice(0, -1).join("\n").trim();
  if (text.endsWith(sign)) return text.slice(0, -sign.length).trim().replace(/[—–-]\s*$/, "").trim();
  return text;
}

/** Whether a reply teaches sentences: Portuguese, and long enough without its signature. */
export function learnableOwnerReply(reply: string, signature: string | null = null): boolean {
  return isPortugueseReply(reply) && stripSignature(reply, signature).length >= ownerReplyMinChars;
}

/**
 * The sentences a reply on Google teaches (none for a reply that is not learnable). The signature
 * of the settings and the one inferred from the replies are both left out; the contact of the
 * settings becomes <contacto>, as in «Treinar».
 */
export function ownerReplySnippets(
  reply: OwnerReply,
  settings: Pick<ReplySettings, "signature" | "negativeContact">,
  inferredSignature: string | null,
): LearnedSnippet[] {
  const body = stripSignature(stripSignature(reply.reply, settings.signature), inferredSignature);
  if (!isPortugueseReply(reply.reply) || body.length < ownerReplyMinChars) return [];
  return learnFromAnswer(body, reply.rating, settings);
}

const tuWords = /\b(teu|tua|teus|tuas|contigo|te)\b/;
const voceWords = /\b(voce|seu|sua|seus|suas|consigo|lhe)\b/;

/**
 * Address form from Portuguese replies of at least 6 words (at least 3 of them): «sem tratamento»
 * when fewer than 1 in 5 talk to the person directly; else tu or você when one is used in at least
 * 2 replies and twice as often as the other. Null when it is not clear.
 */
export function inferAddressForm(replies: string[]): AddressForm | null {
  const sample = replies.map((reply) => normalize(reply)).filter((reply) => reply.split(/\s+/).filter(Boolean).length >= 6);
  if (sample.length < inferMinReplies) return null;
  const tu = sample.filter((reply) => tuWords.test(reply)).length;
  const voce = sample.filter((reply) => voceWords.test(reply)).length;
  const marked = sample.filter((reply) => tuWords.test(reply) || voceWords.test(reply)).length;
  if (marked * 5 < sample.length) return "neutro";
  if (tu >= 2 && tu >= voce * 2) return "tu";
  if (voce >= 2 && voce >= tu * 2) return "voce";
  return null;
}

/** Length from the median number of sentences of the Portuguese replies: 4 or more is «média». */
export function inferLength(bodies: string[]): ReplyLength | null {
  if (bodies.length < inferMinReplies) return null;
  const counts = bodies.map((body) => splitSentences(body).length).sort((a, b) => a - b);
  return counts[Math.floor(counts.length / 2)] >= 4 ? "media" : "curta";
}

const emoji = /\p{Extended_Pictographic}/u;

/** Emojis when at least a third of the replies to positive reviews have one (any language). */
export function inferEmojis(positiveReplies: string[]): boolean | null {
  if (positiveReplies.length < inferMinReplies) return null;
  return positiveReplies.filter((reply) => emoji.test(reply)).length * 3 >= positiveReplies.length;
}

const emailPattern = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const phonePattern = /(?:\+351\s?)?\b[29]\d{2}\s?\d{3}\s?\d{3}\b/g;

/**
 * Contact for negatives: an email or Portuguese phone number given in at least 2 replies to
 * negative reviews and in at least a third of them (any language). Null when there is none.
 */
export function inferContact(negativeReplies: string[]): string | null {
  const counts = new Map<string, { text: string; count: number }>();
  for (const reply of negativeReplies) {
    const found = new Map<string, string>();
    for (const match of reply.match(emailPattern) ?? []) found.set(match.toLowerCase(), match);
    for (const match of reply.match(phonePattern) ?? []) found.set(match.replace(/\D/g, "").slice(-9), match);
    for (const [key, text] of found) {
      const entry = counts.get(key) ?? { text, count: 0 };
      entry.count++;
      counts.set(key, entry);
    }
  }
  const best = [...counts.values()].sort((a, b) => b.count - a.count)[0];
  return best && best.count >= 2 && best.count * 3 >= negativeReplies.length ? best.text : null;
}

/** The reply the owner repeats most to star-only reviews (at least twice; ties: the most recent, listed first). */
export function inferStarOnlyReply(bodies: string[]): string | null {
  const counts = new Map<string, { text: string; count: number }>();
  for (const body of bodies) {
    const key = replyKey(body);
    if (!key || body.length > 400) continue;
    const entry = counts.get(key) ?? { text: body, count: 0 };
    entry.count++;
    counts.set(key, entry);
  }
  const best = [...counts.values()].sort((a, b) => b.count - a.count)[0];
  return best && best.count >= 2 ? best.text : null;
}

export type InferredSettings = Partial<Pick<ReplySettings, "addressForm" | "length" | "emojis" | "signature" | "negativeContact" | "emptyPositive" | "emptyNegative">>;

export interface ReplyInference {
  /** Replies read (every language). */
  replies: number;
  /** Replies in Portuguese. */
  portuguese: number;
  /** Portuguese replies whose sentences are learned (see learnableOwnerReply). */
  learnable: number;
  /** Form answers inferred from the replies; a missing key means «not clear: keep the default». */
  suggested: InferredSettings;
}

/**
 * Form answers inferred from the owner's replies on Google, newest first. Address form, length and
 * star-only replies only from Portuguese replies; emojis, signature and contact from every reply
 * (they go into replies in every language).
 */
export function inferReplySettings(replies: OwnerReply[]): ReplyInference {
  const signature = inferSignature(replies.map((item) => item.reply));
  const portuguese = replies.filter((item) => isPortugueseReply(item.reply));
  const body = (item: OwnerReply) => stripSignature(item.reply, signature);
  const suggested: InferredSettings = {};
  const addressForm = inferAddressForm(portuguese.map(body));
  if (addressForm) suggested.addressForm = addressForm;
  const length = inferLength(portuguese.map(body));
  if (length) suggested.length = length;
  const emojis = inferEmojis(replies.filter((item) => !isNegative(item.rating)).map(body));
  if (emojis !== null) suggested.emojis = emojis;
  if (signature) suggested.signature = signature;
  const contact = inferContact(replies.filter((item) => isNegative(item.rating)).map((item) => item.reply));
  if (contact) suggested.negativeContact = contact;
  const starOnly = portuguese.filter((item) => !item.reviewText?.trim());
  const emptyPositive = inferStarOnlyReply(starOnly.filter((item) => !isNegative(item.rating)).map(body));
  if (emptyPositive) suggested.emptyPositive = emptyPositive;
  const emptyNegative = inferStarOnlyReply(starOnly.filter((item) => isNegative(item.rating)).map(body));
  if (emptyNegative) suggested.emptyNegative = emptyNegative;
  return {
    replies: replies.length,
    portuguese: portuguese.length,
    learnable: portuguese.filter((item) => body(item).length >= ownerReplyMinChars).length,
    suggested,
  };
}
