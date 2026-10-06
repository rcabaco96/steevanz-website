"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { panelAccess } from "./access.ts";
import {
  approveDraft,
  chooseAlternative,
  draftMissingReplies,
  draftAlternatives,
  learnTrainingAnswer,
  loadReplyBusiness,
  loadReplySettings,
  rejectAndRedraft,
  removeSnippet,
  saveAutoMode,
  saveReplySettings,
  skipTrainingReview,
  undoApproval,
  type LibrarySnippet,
  type ReplyAlternative,
  type ReplyBusiness,
} from "./reply-store.ts";
import { autoLimitOptions, maxTones, rejectReasonIds, toneIds, type ReplySettings } from "./replies.ts";

export type ReplyActionState = { ok: true; message?: string } | { ok: false; message: string };

const text = (max: number) => z.string().trim().max(max);
const reviewId = z.string().min(1).max(300);

const SettingsSchema = z.object({
  signature: text(80),
  addressForm: z.enum(["voce", "tu", "neutro"]),
  tone: z.array(z.string().refine((id) => toneIds.includes(id))).min(1).max(maxTones),
  length: z.enum(["curta", "media"]),
  emojis: z.boolean(),
  training: z.array(z.object({ reviewId, answer: text(1500) })).max(6),
  emptyPositive: text(400),
  emptyNegative: text(400),
  negativeContact: text(200),
  autoMode: z.enum(["off", "limit", "always"]),
  autoLimit: z.number().int().refine((value) => autoLimitOptions.includes(value)),
  autoNegative: z.boolean(),
});
export type ReplySettingsInput = z.input<typeof SettingsSchema>;

type Client = ReturnType<typeof createServiceClient>;

/** Same rule as the panel pages: the panel's own client account or an admin. */
async function accessError(slug: string): Promise<{ ok: false; message: string } | null> {
  const access = await panelAccess(slug);
  if (access === "allowed") return null;
  return { ok: false, message: access === "anonymous" ? "A sessão expirou. Entre novamente." : "Painel não encontrado." };
}

async function withBusiness<T extends { ok: boolean }>(slug: string, task: (client: Client, business: ReplyBusiness) => Promise<T>): Promise<T | { ok: false; message: string }> {
  try {
    const denied = await accessError(slug);
    if (denied) return denied;
    const client = createServiceClient();
    const business = await loadReplyBusiness(client, slug);
    if (!business) return { ok: false, message: "Painel não encontrado." };
    const result = await task(client, business);
    revalidatePath(`/painel/${slug}/respostas`);
    return result;
  } catch (error) {
    console.error("[replies] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

export async function saveReplySettingsAction(slug: string, input: ReplySettingsInput): Promise<ReplyActionState> {
  const parsed = SettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Há campos por preencher ou inválidos." };
  return withBusiness(slug, async (client, business) => {
    const previous = await loadReplySettings(client, business.id);
    const { training, ...fields } = parsed.data;
    const settings: ReplySettings = { ...previous, ...fields };
    await saveReplySettings(client, business.id, settings, previous);
    // Settings first: learning strips the signature and the contact the owner just typed.
    for (const item of training.filter((entry) => entry.answer)) await learnTrainingAnswer(client, business.id, item.reviewId, item.answer);
    // Replies are built by rules (instant, free): right after the first setup, and pending ones
    // dropped by a change come back now.
    await draftMissingReplies(client, business);
    return { ok: true as const };
  });
}

export type TrainingActionState = { ok: true; learned: LibrarySnippet[] } | { ok: false; message: string };

export async function trainAction(slug: string, id: string, answer: string): Promise<TrainingActionState> {
  if (!reviewId.safeParse(id).success) return { ok: false, message: "Review inválida." };
  const clean = answer.trim().slice(0, 1500);
  if (clean.length < 3) return { ok: false, message: "Escreva a sua resposta primeiro." };
  return withBusiness(slug, async (client, business) => {
    const learned = await learnTrainingAnswer(client, business.id, id, clean);
    return learned ? { ok: true as const, learned } : { ok: false as const, message: "Review não encontrada." };
  });
}

export async function skipTrainingAction(slug: string, id: string): Promise<ReplyActionState> {
  if (!reviewId.safeParse(id).success) return { ok: false, message: "Review inválida." };
  return withBusiness(slug, async (client, business) => {
    await skipTrainingReview(client, business.id, id);
    return { ok: true as const };
  });
}

export async function removeSnippetAction(slug: string, snippetId: string): Promise<ReplyActionState> {
  if (!z.uuid().safeParse(snippetId).success) return { ok: false, message: "Frase inválida." };
  return withBusiness(slug, async (client, business) => {
    await removeSnippet(client, business.id, snippetId);
    return { ok: true as const };
  });
}

export async function approveDraftAction(slug: string, draftId: string, editedReply: string | null): Promise<ReplyActionState> {
  if (!z.uuid().safeParse(draftId).success) return { ok: false, message: "Resposta inválida." };
  const edited = editedReply === null ? null : editedReply.slice(0, 4000);
  return withBusiness(slug, async (client, business) => {
    const result = await approveDraft(client, business.id, draftId, edited);
    if (!result.ok) return { ok: false as const, message: "Esta resposta já foi tratada." };
    if (result.foreign) return { ok: true as const, message: "Aprovada. Como não está em português, as suas alterações não entram nas suas frases." };
    return {
      ok: true as const,
      message: result.learned ? `Aprovada. Aprendi ${result.learned} ${result.learned === 1 ? "frase nova sua" : "frases novas suas"}.` : undefined,
    };
  });
}

export async function undoApprovalAction(slug: string, draftId: string): Promise<ReplyActionState> {
  if (!z.uuid().safeParse(draftId).success) return { ok: false, message: "Resposta inválida." };
  return withBusiness(slug, async (client, business) =>
    (await undoApproval(client, business.id, draftId)) ? { ok: true as const } : { ok: false as const, message: "Já não é possível desfazer." },
  );
}

export async function rejectDraftAction(slug: string, draftId: string, reasons: string[]): Promise<ReplyActionState> {
  if (!z.uuid().safeParse(draftId).success) return { ok: false, message: "Resposta inválida." };
  const validReasons = reasons.filter((reason) => rejectReasonIds.includes(reason));
  return withBusiness(slug, async (client, business) => {
    const outcome = await rejectAndRedraft(client, business.id, draftId, validReasons);
    if (outcome === "missing") return { ok: false as const, message: "Esta resposta já foi tratada." };
    if (outcome === "rejected") return { ok: true as const, message: "Rejeitada. Não foi possível montar outra agora: tente «Atualizar»." };
    return { ok: true as const, message: "Montei outra resposta com frases diferentes." };
  });
}

const AutoSchema = z.object({
  mode: z.enum(["off", "limit", "always"]),
  limit: z.number().int().refine((value) => autoLimitOptions.includes(value)),
  negative: z.boolean(),
});

export async function setAutoModeAction(slug: string, input: z.input<typeof AutoSchema>): Promise<ReplyActionState> {
  const parsed = AutoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Opção inválida." };
  return withBusiness(slug, async (client, business) => {
    await saveAutoMode(client, business.id, parsed.data.mode, parsed.data.limit, parsed.data.negative);
    return { ok: true as const };
  });
}

export type AlternativesState = { ok: true; options: ReplyAlternative[] } | { ok: false; message: string };

/** "Outra resposta": up to 5 different texts to choose from (nothing is saved yet). */
export async function alternativesAction(slug: string, draftId: string): Promise<AlternativesState> {
  if (!z.uuid().safeParse(draftId).success) return { ok: false, message: "Resposta inválida." };
  try {
    const denied = await accessError(slug);
    if (denied) return denied;
    const client = createServiceClient();
    const business = await loadReplyBusiness(client, slug);
    if (!business) return { ok: false, message: "Painel não encontrado." };
    const options = await draftAlternatives(client, business.id, draftId);
    return options ? { ok: true, options } : { ok: false, message: "Esta resposta já foi tratada." };
  } catch (error) {
    console.error("[replies] alternatives failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

export async function chooseAlternativeAction(slug: string, draftId: string, alternativeId: string): Promise<ReplyActionState> {
  if (!z.uuid().safeParse(draftId).success || !z.uuid().safeParse(alternativeId).success) return { ok: false, message: "Resposta inválida." };
  return withBusiness(slug, async (client, business) => {
    const outcome = await chooseAlternative(client, business.id, draftId, alternativeId);
    if (outcome === "missing") return { ok: false as const, message: "Esta resposta já foi tratada." };
    if (outcome === "stale") return { ok: false as const, message: "As alternativas mudaram entretanto. Peça outra vez." };
    return { ok: true as const };
  });
}
