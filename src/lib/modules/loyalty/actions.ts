"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { sendOwnerEmail } from "@/lib/booking/email";
import { requestOrigin } from "@/lib/booking/request";
import { accessErrorMessage, requireEstablishmentAccess } from "@/lib/establishments/access";
import { getEstablishment, isUuid } from "@/lib/establishments/store";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { formText, isBot, isModuleRateLimited, publicToken, tokenPattern } from "../common";
import { publicEstablishment } from "../public";
import { codeLockMinutes, cooldownMessage, isLocked, isStaffCode, maxCodeAttempts } from "./rules";
import {
  ensureProgram,
  getCard,
  getCardByToken,
  newCardCode,
  newStaffCodeHash,
  staffCodeMatches,
  type LoyaltyCardRow,
  type LoyaltyProgramRow,
} from "./store";

function refresh(establishment: EstablishmentRow) {
  revalidatePath("/conta", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath(`/cartao/${establishment.slug}`, "layout");
}

interface StampOutcome {
  outcome: "ok" | "cooldown";
  stamps: number;
  rewards_earned: number;
  next_allowed_at: string | null;
}

async function stamp(cardId: string, amount: number, source: "staff_code" | "staff_panel" | "welcome" | "migration", enforceCooldown: boolean): Promise<StampOutcome> {
  const { data, error } = await createServiceClient().rpc("loyalty_stamp", { p_card: cardId, p_amount: amount, p_source: source, p_enforce_cooldown: enforceCooldown });
  if (error) throw new Error(error.message);
  const row = (Array.isArray(data) ? data[0] : data) as StampOutcome | undefined;
  if (!row) throw new Error("loyalty_stamp returned nothing");
  return row;
}

function stampMessage(result: StampOutcome, program: LoyaltyProgramRow, establishment: EstablishmentRow): ActionState {
  if (result.outcome === "cooldown") return { ok: false, message: cooldownMessage(result.next_allowed_at!, establishment.time_zone) };
  if (result.rewards_earned > 0) return { ok: true, message: `Cartão completo! Ganhou: ${program.reward}. Mostre à equipa quando quiser usar.` };
  const left = program.stamps_required - result.stamps;
  return { ok: true, message: `Carimbo dado. ${left === 1 ? "Falta 1" : `Faltam ${left}`} para: ${program.reward}.` };
}

async function cardLink(establishment: EstablishmentRow, card: LoyaltyCardRow): Promise<string> {
  return `${await requestOrigin()}/cartao/${establishment.slug}/${card.token}`;
}

function sendCardEmail(establishment: EstablishmentRow, card: LoyaltyCardRow, program: LoyaltyProgramRow, link: string, welcome: boolean) {
  if (!card.email) return;
  after(async () => {
    await sendOwnerEmail({
      to: [card.email!],
      subject: welcome ? `O seu cartão de cliente ${establishment.name}` : `Link do seu cartão ${establishment.name}`,
      heading: welcome ? `Bem-vindo ao cartão de cliente ${establishment.name}` : `O seu cartão ${establishment.name}`,
      rows: [
        { label: "Cartão", value: `${card.name} · código ${card.code.slice(0, 3)} ${card.code.slice(3)}` },
        { label: "Recompensa", value: `Ao fim de ${program.stamps_required} carimbos: ${program.reward}` },
        { label: "Dica", value: "Abra o link no telemóvel e escolha «Adicionar ao ecrã principal» para ter o cartão sempre à mão." },
      ],
      adminUrl: link,
      linkLabel: "Abrir o meu cartão",
    });
  });
}

// --- Public --------------------------------------------------------------------------------------

const joinSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.union([z.email().max(200), z.literal("")]).transform((email) => email.toLowerCase() || null),
  phone: z.string().trim().max(40).transform((text) => text || null),
  consent: z.literal(true),
});

/** Public: a customer gets a card (with the welcome stamp, if the program gives one). Only the name is required. */
export async function joinLoyalty(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let target: string | null = null;
  try {
    const establishment = await publicEstablishment(formText(formData, "slug"), "loyalty");
    if (!establishment) return { ok: false, message: "Este cartão já não está disponível." };
    if (isBot(formData)) return { ok: false, message: "Não foi possível criar o cartão." };
    const parsed = joinSchema.safeParse({
      name: formText(formData, "name"),
      email: formText(formData, "email"),
      phone: formText(formData, "phone"),
      consent: formData.get("consent") === "on",
    });
    if (!parsed.success) {
      const field = String(parsed.error.issues[0]?.path[0] ?? "");
      return { ok: false, message: field === "consent" ? "Para criar o cartão tem de aceitar o tratamento dos dados." : field === "email" ? "Indique um email válido." : "Indique o seu nome." };
    }
    const client = createServiceClient();
    if (await isModuleRateLimited(client, "loyalty")) return { ok: false, message: "Demasiados pedidos. Aguarde uns minutos." };
    const program = await ensureProgram(establishment);
    if (!program.active) return { ok: false, message: "O cartão de cliente está temporariamente indisponível." };

    if (parsed.data.email) {
      const { data: existing } = await client.from("loyalty_cards").select("*").eq("establishment_id", establishment.id).eq("email", parsed.data.email).limit(1);
      if (existing?.length) {
        const card = existing[0] as LoyaltyCardRow;
        sendCardEmail(establishment, card, program, await cardLink(establishment, card), false);
        return { ok: true, message: "Já tem um cartão com este email. Enviámos-lhe o link para o abrir." };
      }
    }

    let card: LoyaltyCardRow | null = null;
    for (let attempt = 0; attempt < 5 && !card; attempt++) {
      const { data, error } = await client
        .from("loyalty_cards")
        .insert({
          establishment_id: establishment.id,
          token: publicToken(),
          code: newCardCode(),
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          consent_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      if (!error) card = data as LoyaltyCardRow;
      else if (error.code !== "23505") throw new Error(error.message);
    }
    if (!card) throw new Error("no free card code");
    await client.from("loyalty_events").insert({ card_id: card.id, establishment_id: establishment.id, kind: "joined", amount: 0 });
    if (program.welcome_stamp) await stamp(card.id, 1, "welcome", false);
    sendCardEmail(establishment, card, program, await cardLink(establishment, card), true);
    refresh(establishment);
    target = `/cartao/${establishment.slug}/${card.token}`;
  } catch (error) {
    console.error("[loyalty] join failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível criar o cartão. Tente novamente." };
  }
  redirect(target);
}

/** Checks the team's code typed on the customer's phone, with a lock after repeated mistakes. */
async function verifyCodeOnCard(card: LoyaltyCardRow, program: LoyaltyProgramRow, code: string): Promise<ActionState | null> {
  if (!program.staff_code_set_at) return { ok: false, message: "O PIN de carimbo ainda não foi definido. Peça ao funcionário para carimbar no painel." };
  if (isLocked(card.locked_until, Date.now())) return { ok: false, message: `Demasiadas tentativas erradas. Tente de novo daqui a ${codeLockMinutes} minutos.` };
  if (isStaffCode(code) && staffCodeMatches(program, code)) return null;
  const attempts = card.failed_code_attempts + 1;
  const lock = attempts >= maxCodeAttempts;
  await createServiceClient()
    .from("loyalty_cards")
    .update({ failed_code_attempts: lock ? 0 : attempts, locked_until: lock ? new Date(Date.now() + codeLockMinutes * 60_000).toISOString() : null })
    .eq("id", card.id);
  return { ok: false, message: lock ? `PIN errado. O cartão fica bloqueado durante ${codeLockMinutes} minutos.` : "PIN errado. Peça ao funcionário para o escrever." };
}

async function publicCard(formData: FormData) {
  const token = formText(formData, "token");
  if (!tokenPattern.test(token)) return null;
  const card = await getCardByToken(token);
  if (!card) return null;
  const establishment = await getEstablishment(card.establishment_id);
  if (!establishment) return null;
  return { card, establishment, program: await ensureProgram(establishment) };
}

/** Public: the team types its code on the customer's phone to give a stamp. */
export async function stampWithCode(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const found = await publicCard(formData);
    if (!found) return { ok: false, message: "Cartão não encontrado." };
    const { card, establishment, program } = found;
    if (!program.active) return { ok: false, message: "O cartão de cliente está temporariamente indisponível." };
    if (await isModuleRateLimited(createServiceClient(), "loyalty_stamp")) return { ok: false, message: "Demasiados pedidos. Aguarde uns minutos." };
    const refused = await verifyCodeOnCard(card, program, formText(formData, "code"));
    if (refused) return refused;
    const result = await stamp(card.id, 1, "staff_code", true);
    refresh(establishment);
    return stampMessage(result, program, establishment);
  } catch (error) {
    console.error("[loyalty] stamp failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível dar o carimbo. Tente novamente." };
  }
}

/** Public: the team confirms a reward was handed over (with its code, on the customer's phone). */
export async function redeemWithCode(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const found = await publicCard(formData);
    if (!found) return { ok: false, message: "Cartão não encontrado." };
    const { card, establishment, program } = found;
    if (await isModuleRateLimited(createServiceClient(), "loyalty_stamp")) return { ok: false, message: "Demasiados pedidos. Aguarde uns minutos." };
    const refused = await verifyCodeOnCard(card, program, formText(formData, "code"));
    if (refused) return refused;
    const redeemed = await redeemReward(card, formText(formData, "reward_id"));
    if (!redeemed) return { ok: false, message: "Esta recompensa já foi usada ou expirou." };
    await createServiceClient().from("loyalty_cards").update({ failed_code_attempts: 0 }).eq("id", card.id);
    refresh(establishment);
    return { ok: true, message: `Recompensa entregue: ${program.reward}. Bom proveito!` };
  } catch (error) {
    console.error("[loyalty] redeem failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível registar. Tente novamente." };
  }
}

async function redeemReward(card: LoyaltyCardRow, rewardId: string): Promise<boolean> {
  if (!isUuid(rewardId)) return false;
  const now = new Date().toISOString();
  const { data, error } = await createServiceClient()
    .from("loyalty_rewards")
    .update({ redeemed_at: now })
    .eq("id", rewardId)
    .eq("card_id", card.id)
    .is("redeemed_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data?.length) return false;
  await createServiceClient().from("loyalty_events").insert({ card_id: card.id, establishment_id: card.establishment_id, kind: "reward_redeemed", amount: 1 });
  return true;
}

/** Public: "perdi o cartão" — emails the link (same answer whether or not the email has a card). */
export async function recoverCard(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const establishment = await publicEstablishment(formText(formData, "slug"), "loyalty");
    if (!establishment) return { ok: false, message: "Este cartão já não está disponível." };
    const email = z.email().safeParse(formText(formData, "email").toLowerCase());
    if (!email.success) return { ok: false, message: "Indique um email válido." };
    const client = createServiceClient();
    if (await isModuleRateLimited(client, "loyalty_recover")) return { ok: false, message: "Demasiados pedidos. Aguarde uns minutos." };
    const { data } = await client.from("loyalty_cards").select("*").eq("establishment_id", establishment.id).eq("email", email.data).limit(1);
    if (data?.length) {
      const card = data[0] as LoyaltyCardRow;
      sendCardEmail(establishment, card, await ensureProgram(establishment), await cardLink(establishment, card), false);
    }
    return { ok: true, message: "Se existir um cartão com este email, vai receber o link dentro de momentos." };
  } catch (error) {
    console.error("[loyalty] recover failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível enviar. Tente novamente." };
  }
}

// --- Staff (client area / admin) ---------------------------------------------------------------

async function staffGuard(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await task();
  } catch (error) {
    const denied = accessErrorMessage(error);
    if (denied) return { ok: false, message: denied };
    console.error("[loyalty] staff action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

async function staffCard(formData: FormData) {
  const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "loyalty");
  const card = await getCard(establishment.id, formText(formData, "card_id"));
  return { establishment, card, program: await ensureProgram(establishment) };
}

const paused: ActionState = { ok: false, message: "O cartão de cliente está em pausa. Ative-o em Definições para dar ou retirar carimbos." };

/** Staff panel: one stamp (respects the time window between stamps). */
export async function staffStamp(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment, card, program } = await staffCard(formData);
    if (!card) return { ok: false, message: "Cartão não encontrado." };
    if (!program.active) return paused;
    const result = await stamp(card.id, 1, "staff_panel", true);
    refresh(establishment);
    const outcome = stampMessage(result, program, establishment)!;
    return { ok: outcome.ok, message: `${card.name}: ${outcome.message}` };
  });
}

/** Staff panel: removes a stamp given by mistake. */
export async function staffRemoveStamp(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment, card, program } = await staffCard(formData);
    if (!card) return { ok: false, message: "Cartão não encontrado." };
    if (!program.active) return paused;
    if (card.stamps === 0) return { ok: false, message: "Este cartão não tem carimbos para retirar." };
    await stamp(card.id, -1, "staff_panel", false);
    refresh(establishment);
    return { ok: true, message: `Carimbo retirado do cartão de ${card.name}.` };
  });
}

/** Staff panel: stamps a customer already had on the paper card (no time window). */
export async function staffMigrateStamps(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment, card, program } = await staffCard(formData);
    if (!card) return { ok: false, message: "Cartão não encontrado." };
    if (!program.active) return paused;
    const amount = Number(formText(formData, "amount"));
    if (!Number.isInteger(amount) || amount < 1 || amount > program.stamps_required * 3) return { ok: false, message: "Indique quantos carimbos tinha no cartão de papel." };
    const result = await stamp(card.id, amount, "migration", false);
    refresh(establishment);
    return { ok: true, message: `${amount} carimbos do cartão de papel passados para ${card.name}.${result.rewards_earned ? " Completou o cartão!" : ""}` };
  });
}

/** Staff panel: deletes a card and its history when the customer asks (right to erasure). */
export async function staffDeleteCard(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment, card } = await staffCard(formData);
    if (!card) return { ok: false, message: "Cartão não encontrado." };
    const { error } = await createServiceClient().from("loyalty_cards").delete().eq("id", card.id).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: `Cartão de ${card.name} apagado, com todo o histórico.` };
  });
}

export async function staffRedeem(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment, card, program } = await staffCard(formData);
    if (!card) return { ok: false, message: "Cartão não encontrado." };
    if (!(await redeemReward(card, formText(formData, "reward_id")))) return { ok: false, message: "Esta recompensa já foi usada ou expirou." };
    refresh(establishment);
    return { ok: true, message: `Recompensa entregue a ${card.name}: ${program.reward}.` };
  });
}

const programSchema = z.object({
  active: z.boolean(),
  stamps_required: z.coerce.number().int().min(2).max(50),
  reward: z.string().trim().min(1).max(120),
  welcome_stamp: z.boolean(),
  cooldown_minutes: z.coerce.number().int().min(0).max(10080),
  reward_valid_days: z
    .string()
    .trim()
    .transform((text) => (text ? Number(text) : null))
    .refine((value) => value === null || (Number.isInteger(value) && value >= 1 && value <= 730)),
  terms: z.string().trim().max(600).transform((text) => text || null),
});

export async function saveProgram(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "loyalty");
    const parsed = programSchema.safeParse({
      active: formData.get("active") === "on",
      stamps_required: formText(formData, "stamps_required"),
      reward: formText(formData, "reward"),
      welcome_stamp: formData.get("welcome_stamp") === "on",
      cooldown_minutes: formText(formData, "cooldown_minutes"),
      reward_valid_days: formText(formData, "reward_valid_days"),
      terms: formText(formData, "terms"),
    });
    if (!parsed.success) return { ok: false, message: "Verifique os valores (carimbos entre 2 e 50, recompensa preenchida)." };
    await ensureProgram(establishment);
    const { error } = await createServiceClient().from("loyalty_programs").update(parsed.data).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: "Regras guardadas. Valem para todos os cartões a partir de agora." };
  });
}

/** The stamp PIN (6 digits) staff type on the customer's phone. Only its salted hash is stored. */
export async function setStaffCode(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"), "loyalty");
    const code = formText(formData, "code");
    if (!isStaffCode(code)) return { ok: false, message: "O PIN tem de ter 6 algarismos." };
    if (code !== formText(formData, "confirm")) return { ok: false, message: "Os dois PIN não coincidem." };
    if (/^(\d)\1{5}$/.test(code) || "0123456789".includes(code) || "9876543210".includes(code)) {
      return { ok: false, message: "Escolha um PIN menos óbvio (sem algarismos todos iguais ou seguidos)." };
    }
    await ensureProgram(establishment);
    const { error } = await createServiceClient()
      .from("loyalty_programs")
      .update({ ...newStaffCodeHash(code), staff_code_set_at: new Date().toISOString() })
      .eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh(establishment);
    return { ok: true, message: "PIN de carimbo guardado. O PIN anterior deixa de funcionar." };
  });
}
