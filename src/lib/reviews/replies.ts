/**
 * "Respostas IA": rules shared by the onboarding form, the inbox and the prompt.
 * Pure module (no server imports) so it can be tested with node --test.
 */
import { isNegative } from "./analytics.ts";

export type AddressForm = "voce" | "tu" | "neutro";
export type ReplyLength = "curta" | "media";
export type AutoMode = "off" | "limit" | "always";
export type DraftStatus = "generating" | "pending" | "approved" | "rejected";

export const toneOptions = [
  { id: "proximo", label: "Próximo", hint: "Como quem conhece o cliente" },
  { id: "profissional", label: "Profissional", hint: "Cuidado e direto" },
  { id: "caloroso", label: "Caloroso", hint: "Agradecido, com emoção" },
  { id: "divertido", label: "Descontraído", hint: "Leve, com humor q.b." },
  { id: "elegante", label: "Elegante", hint: "Sóbrio, de marca premium" },
] as const;
export type ToneId = (typeof toneOptions)[number]["id"];
export const toneIds: string[] = toneOptions.map((tone) => tone.id);
export const maxTones = 2;

export const addressOptions: { id: AddressForm; label: string; example: string }[] = [
  { id: "voce", label: "Você", example: "«Obrigado pela sua visita»" },
  { id: "tu", label: "Tu", example: "«Obrigado pela tua visita»" },
  { id: "neutro", label: "Sem tratamento", example: "«Obrigado pela visita»" },
];

export const lengthOptions: { id: ReplyLength; label: string; example: string }[] = [
  { id: "curta", label: "Curta", example: "2 a 3 frases" },
  { id: "media", label: "Média", example: "3 a 5 frases" },
];

/** Why a draft was rejected. "longa"/"curta" change the next reply's length, "emojis" drops them; all are kept for review. */
export const rejectReasons = [
  { id: "formal", label: "Demasiado formal" },
  { id: "informal", label: "Demasiado informal" },
  { id: "longa", label: "Muito longa" },
  { id: "curta", label: "Muito curta" },
  { id: "generica", label: "Genérica" },
  { id: "frase", label: "Não gosto de uma frase" },
  { id: "emojis", label: "Emojis a mais" },
  { id: "tom", label: "Não é o meu tom" },
] as const;
export type RejectReasonId = (typeof rejectReasons)[number]["id"];
export const rejectReasonIds: string[] = rejectReasons.map((reason) => reason.id);
export const rejectReasonLabel = (id: string) => rejectReasons.find((reason) => reason.id === id)?.label ?? id;

/** One real review the customer answered in the onboarding (never invented). */
export interface ReplyExample {
  reviewId: string;
  rating: number;
  text: string;
  reply: string;
}

export interface ReplySettings {
  signature: string;
  addressForm: AddressForm;
  tone: string[];
  length: ReplyLength;
  emojis: boolean;
  examples: ReplyExample[];
  emptyPositive: string;
  emptyNegative: string;
  highlights: string;
  avoid: string;
  negativeContact: string;
  autoMode: AutoMode;
  autoLimit: number;
  autoUsed: number;
  autoNegative: boolean;
  onboardedAt: string | null;
  /** The tone (set of form answers) everything is currently learned under. */
  profileId: string | null;
}

export const defaultReplySettings: ReplySettings = {
  signature: "",
  addressForm: "voce",
  tone: ["proximo"],
  length: "curta",
  emojis: false,
  examples: [],
  emptyPositive: "",
  emptyNegative: "",
  highlights: "",
  avoid: "",
  negativeContact: "",
  autoMode: "off",
  autoLimit: 10,
  autoUsed: 0,
  autoNegative: false,
  onboardedAt: null,
  profileId: null,
};

/**
 * Business rule: training, learning and evolution are kept per tone, and a tone is the set of
 * answers in the settings form that shape how replies sound. Not part of it: the signature and the
 * contact for negatives (details that change without changing the voice) and automatic replies
 * (how much is approved alone).
 */
export type ToneSettings = Pick<ReplySettings, "addressForm" | "tone" | "length" | "emojis" | "emptyPositive" | "emptyNegative">;

export function toneSettings(settings: ToneSettings): ToneSettings {
  return {
    addressForm: settings.addressForm,
    tone: [...settings.tone].sort(),
    length: settings.length,
    emojis: settings.emojis,
    emptyPositive: settings.emptyPositive.trim(),
    emptyNegative: settings.emptyNegative.trim(),
  };
}

/** Same form answers → same fingerprint → same tone (keys in a fixed order). */
export function toneFingerprint(settings: ToneSettings): string {
  return JSON.stringify(toneSettings(settings));
}

/** Short description of a tone, e.g. "Próximo e Caloroso · você · curta · sem emojis". */
export function describeTone(settings: ToneSettings): string {
  const tones = settings.tone.map((id) => toneOptions.find((tone) => tone.id === id)?.label ?? id).join(" e ");
  const address = addressOptions.find((option) => option.id === settings.addressForm)?.label.toLowerCase() ?? "";
  const length = lengthOptions.find((option) => option.id === settings.length)?.label.toLowerCase() ?? "";
  return [tones, address, length, settings.emojis ? "com emojis" : "sem emojis"].filter(Boolean).join(" · ");
}

export const autoLimitOptions = [5, 10, 25, 50];
/** Replies built per "Atualizar" (rules are free; this only keeps each click quick). */
export const draftsPerRun = 25;
/**
 * Business rule: replies are prepared for every stored review without an owner reply (the whole
 * history in Supabase, newest first, `draftsPerRun` per click; rules cost nothing). Automatic
 * approval only applies to recent reviews (published since the setup, plus this many days before
 * it): replies to the old history always wait for the owner.
 */
export const replyWindowDays = 30;

/** Oldest publication date automatic approval applies to, or null before the setup. */
export function replyWindowStart(onboardedAt: string | null): Date | null {
  return onboardedAt ? new Date(Date.parse(onboardedAt) - replyWindowDays * 86_400_000) : null;
}

/** Whether a review is recent enough for automatic approval (see replyWindowDays). */
export function inAutoReplyWindow(onboardedAt: string | null, publishedAt: string): boolean {
  const start = replyWindowStart(onboardedAt);
  return start !== null && Date.parse(publishedAt) >= start.getTime();
}

/** A "generating" claim older than this belongs to a request that died; it can be retried. */
export const staleClaimMinutes = 5;

/** Remaining automatic approvals, or null when unlimited. */
export function autoRemaining(settings: Pick<ReplySettings, "autoMode" | "autoLimit" | "autoUsed">): number | null {
  if (settings.autoMode === "always") return null;
  if (settings.autoMode === "off") return 0;
  return Math.max(0, settings.autoLimit - settings.autoUsed);
}

/**
 * Whether a fresh draft is approved without the customer: automatic replies must be on, with
 * quota left, and negative reviews (1–3★) stay manual unless the customer allowed them.
 */
export function shouldAutoApprove(settings: Pick<ReplySettings, "autoMode" | "autoLimit" | "autoUsed" | "autoNegative">, rating: number): boolean {
  if (settings.autoMode === "off") return false;
  if (isNegative(rating) && !settings.autoNegative) return false;
  const remaining = autoRemaining(settings);
  return remaining === null || remaining > 0;
}

