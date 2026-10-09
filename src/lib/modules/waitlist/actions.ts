"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { requestOrigin } from "@/lib/booking/request";
import { accessErrorMessage, requireEstablishmentAccess } from "@/lib/establishments/access";
import { getEstablishment, getEstablishmentBySlug, isUuid, loadBundle } from "@/lib/establishments/store";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { formText, isBot, isModuleRateLimited, publicToken, startOfLocalDay, tokenPattern } from "../common";
import { notifyCalled } from "./notify";
import { parseSubscription } from "./push-rules";
import { ensureWaitlistSettings, getEntryByToken, type EntryReply, type EntryStatus, type WaitlistEntryRow } from "./store";

function refreshQueue(establishment: EstablishmentRow) {
  revalidatePath("/conta", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath(`/fila/${establishment.slug}`, "layout");
}

const joinErrors: Record<string, string> = {
  waitlist_closed: "A fila não está aberta neste momento. Fale com a equipa.",
  waitlist_full: "A fila está cheia neste momento. Fale com a equipa.",
};

const entrySchema = z.object({
  name: z.string().trim().min(1).max(60),
  party: z.number().int().min(1).max(100).nullable(),
  service: z.uuid().nullable(),
  staff: z.uuid().nullable(),
  email: z.union([z.email().max(200), z.literal("")]).transform((email) => email.toLowerCase() || null),
  notes: z.string().trim().max(200).transform((text) => text || null),
});

async function parseEntry(formData: FormData, establishment: EstablishmentRow) {
  const settings = await ensureWaitlistSettings(establishment);
  const bundle = await loadBundle(establishment);
  const partyText = formText(formData, "party");
  const service = formText(formData, "service");
  const staff = formText(formData, "staff");
  const parsed = entrySchema.safeParse({
    name: formText(formData, "name"),
    party: settings.ask_party && partyText ? Number(partyText) : null,
    service: settings.ask_service && service ? service : null,
    staff: settings.ask_staff && staff ? staff : null,
    email: formText(formData, "email"),
    notes: formText(formData, "notes"),
  });
  if (!parsed.success) return { error: "Indique o seu nome e verifique os dados." } as const;
  const data = parsed.data;
  if (settings.ask_party && (!data.party || data.party > settings.max_party)) return { error: `Indique o número de pessoas (1 a ${settings.max_party}).` } as const;
  if (data.service && !bundle.services.some((item) => item.id === data.service && item.active)) return { error: "Escolha um serviço da lista." } as const;
  if (data.staff && !bundle.staff.some((item) => item.id === data.staff && item.active)) return { error: "Escolha um profissional da lista." } as const;
  return { data, settings } as const;
}

/** Public: a customer joins the queue (QR or NFC at the door) and lands on their live status page. */
export async function joinWaitlist(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let target: string | null = null;
  try {
    const establishment = await getEstablishmentBySlug(formText(formData, "slug"));
    if (!establishment) return { ok: false, message: "Esta fila já não existe." };
    if (isBot(formData)) return { ok: false, message: "Não foi possível entrar na fila." };
    const client = createServiceClient();
    if (await isModuleRateLimited(client, "waitlist")) return { ok: false, message: "Demasiados pedidos. Aguarde uns minutos." };
    const parsed = await parseEntry(formData, establishment);
    if ("error" in parsed) return { ok: false, message: parsed.error ?? "Verifique os dados." };
    const token = publicToken();
    const { error } = await client.rpc("waitlist_join", {
      p_establishment: establishment.id,
      p_token: token,
      p_name: parsed.data.name,
      p_party: parsed.data.party,
      p_service: parsed.data.service,
      p_staff: parsed.data.staff,
      p_email: parsed.data.email,
      p_notes: parsed.data.notes,
      p_source: "online",
      p_day_start: startOfLocalDay(establishment.time_zone).toISOString(),
    });
    if (error) {
      const known = Object.keys(joinErrors).find((key) => error.message.includes(key));
      if (known) return { ok: false, message: joinErrors[known] };
      throw new Error(error.message);
    }
    refreshQueue(establishment);
    target = `/fila/${establishment.slug}/${token}`;
  } catch (error) {
    console.error("[waitlist] join failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível entrar na fila. Tente novamente." };
  }
  redirect(target);
}

const replies: EntryReply[] = ["leaving"];

/** Public: "já não venho" leaves the queue (once called, the customer comes straight away). */
export async function replyToCall(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const token = formText(formData, "token");
    const reply = formText(formData, "reply") as EntryReply;
    if (!tokenPattern.test(token) || !replies.includes(reply)) return { ok: false, message: "Pedido inválido." };
    const entry = await getEntryByToken(token);
    if (!entry || !["waiting", "called"].includes(entry.status)) return { ok: false, message: "Já não está na fila." };
    const now = new Date().toISOString();
    const changes: Partial<WaitlistEntryRow> =
      reply === "leaving" ? { reply, replied_at: now, status: "cancelled", finished_at: now, close_reason: "left" } : { reply, replied_at: now };
    const { error } = await createServiceClient().from("waitlist_entries").update(changes).eq("id", entry.id);
    if (error) throw new Error(error.message);
    const establishment = await getEstablishment(entry.establishment_id);
    if (establishment) refreshQueue(establishment);
    return { ok: true, message: reply === "leaving" ? "Saiu da fila. Obrigado por avisar." : "Obrigado, a equipa já sabe." };
  } catch (error) {
    console.error("[waitlist] reply failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível enviar. Tente novamente." };
  }
}

/** Public: the ticket page switched notifications on; the phone gets a push when called. */
export async function savePushSubscription(token: string, subscription: unknown): Promise<{ ok: boolean }> {
  try {
    const parsed = parseSubscription(subscription);
    if (!tokenPattern.test(token) || !parsed) return { ok: false };
    const entry = await getEntryByToken(token);
    if (!entry || !["waiting", "called"].includes(entry.status)) return { ok: false };
    const { error } = await createServiceClient().from("waitlist_entries").update({ push_subscription: parsed }).eq("id", entry.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (error) {
    console.error("[waitlist] push subscription failed:", error instanceof Error ? error.message : error);
    return { ok: false };
  }
}

// --- Staff (client area / admin) ---------------------------------------------------------------

async function staffGuard(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await task();
  } catch (error) {
    const denied = accessErrorMessage(error);
    if (denied) return { ok: false, message: denied };
    console.error("[waitlist] staff action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

async function staffAccess(formData: FormData) {
  return requireEstablishmentAccess(formText(formData, "establishment_id"), "waitlist");
}

async function entryOf(establishment: EstablishmentRow, formData: FormData): Promise<WaitlistEntryRow | null> {
  const id = formText(formData, "entry_id");
  if (!isUuid(id)) return null;
  const { data, error } = await createServiceClient().from("waitlist_entries").select("*").eq("id", id).eq("establishment_id", establishment.id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as WaitlistEntryRow | null;
}

export async function setQueueState(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const state = formText(formData, "state");
    if (!["open", "paused", "closed"].includes(state)) return { ok: false, message: "Pedido inválido." };
    await ensureWaitlistSettings(establishment);
    const { error } = await createServiceClient().from("waitlist_settings").update({ state }).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refreshQueue(establishment);
    return { ok: true, message: state === "open" ? "Fila aberta." : state === "paused" ? "Entradas em pausa." : "Fila fechada. Quem já está na fila continua a ser atendido." };
  });
}

/** Calls someone: their status page rings and, with an email, they also get one. */
export async function callEntry(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const entry = await entryOf(establishment, formData);
    if (!entry || !["waiting", "called"].includes(entry.status)) return { ok: false, message: "Esta entrada já não está na fila." };
    const { error } = await createServiceClient()
      .from("waitlist_entries")
      .update({ status: "called", called_at: new Date().toISOString(), reply: null, replied_at: null })
      .eq("id", entry.id);
    if (error) throw new Error(error.message);
    const origin = await requestOrigin();
    after(() => notifyCalled(establishment, entry, origin));
    refreshQueue(establishment);
    return { ok: true, message: `${entry.name} foi chamado.` };
  });
}

/** "Chamar o seguinte": the next ticket in order (for one professional, or anyone). */
export async function callNext(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const staff = formText(formData, "staff_id");
    const { data, error } = await createServiceClient().rpc("waitlist_call_next", { p_establishment: establishment.id, p_staff: isUuid(staff) ? staff : null });
    if (error) throw new Error(error.message);
    const entry = ((data ?? []) as WaitlistEntryRow[])[0];
    if (!entry) return { ok: false, message: "Não há ninguém à espera." };
    const origin = await requestOrigin();
    after(() => notifyCalled(establishment, entry, origin));
    refreshQueue(establishment);
    return { ok: true, message: `Senha ${entry.number} chamada: ${entry.name}.` };
  });
}

const finishing: EntryStatus[] = ["served", "no_show", "cancelled", "waiting"];

/** Atendido, não apareceu, desistiu, or back to waiting (keeps the place). */
export async function setEntryStatus(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const status = formText(formData, "status") as EntryStatus;
    if (!finishing.includes(status)) return { ok: false, message: "Pedido inválido." };
    const entry = await entryOf(establishment, formData);
    if (!entry) return { ok: false, message: "Entrada não encontrada." };
    const changes =
      status === "waiting"
        ? { status, called_at: null, finished_at: null, reply: null, replied_at: null, arrived_at: null, close_reason: null }
        : { status, finished_at: new Date().toISOString(), close_reason: "staff" };
    const { error } = await createServiceClient().from("waitlist_entries").update(changes).eq("id", entry.id);
    if (error) throw new Error(error.message);
    if (status === "no_show" && entry.status === "called" && (await ensureWaitlistSettings(establishment)).auto_next) {
      const { data, error: nextError } = await createServiceClient().rpc("waitlist_call_next", { p_establishment: establishment.id, p_staff: entry.staff_id });
      if (nextError) throw new Error(nextError.message);
      const next = ((data ?? []) as WaitlistEntryRow[])[0];
      if (next) {
        const origin = await requestOrigin();
        after(() => notifyCalled(establishment, next, origin));
        refreshQueue(establishment);
        return { ok: true, message: `Não apareceu. Chamada a senha ${next.number}: ${next.name}.` };
      }
    }
    refreshQueue(establishment);
    return { ok: true, message: "Fila atualizada." };
  });
}

/** Moves a waiting entry one place up or down (between its neighbours). */
export async function moveEntry(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const direction = formText(formData, "direction");
    const entry = await entryOf(establishment, formData);
    if (!entry || entry.status !== "waiting" || !["up", "down"].includes(direction)) return { ok: false, message: "Pedido inválido." };
    const client = createServiceClient();
    const { data, error } = await client
      .from("waitlist_entries")
      .select("id, sort_key")
      .eq("establishment_id", establishment.id)
      .eq("status", "waiting")
      .order("sort_key")
      .limit(500);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as { id: string; sort_key: number }[];
    const index = rows.findIndex((row) => row.id === entry.id);
    const neighbour = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || neighbour < 0 || neighbour >= rows.length) return { ok: true, message: "Já está nessa ponta da fila." };
    // Place it just past the neighbour: halfway to the next one along.
    const beyond = direction === "up" ? rows[neighbour - 1] : rows[neighbour + 1];
    const edge = rows[neighbour].sort_key;
    const sortKey = beyond ? (edge + beyond.sort_key) / 2 : edge + (direction === "up" ? -1 : 1);
    const { error: updateError } = await client.from("waitlist_entries").update({ sort_key: sortKey }).eq("id", entry.id);
    if (updateError) throw new Error(updateError.message);
    refreshQueue(establishment);
    return { ok: true, message: "Ordem alterada." };
  });
}

/** Someone at the counter without a phone (or who prefers to talk): added by the team, even with the queue closed. */
export async function addEntryByStaff(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const parsed = await parseEntry(formData, establishment);
    if ("error" in parsed) return { ok: false, message: parsed.error ?? "Verifique os dados." };
    const { error } = await createServiceClient().rpc("waitlist_join", {
      p_establishment: establishment.id,
      p_token: publicToken(),
      p_name: parsed.data.name,
      p_party: parsed.data.party,
      p_service: parsed.data.service,
      p_staff: parsed.data.staff,
      p_email: parsed.data.email,
      p_notes: parsed.data.notes,
      p_source: "staff",
      p_day_start: startOfLocalDay(establishment.time_zone).toISOString(),
    });
    if (error) throw new Error(error.message);
    refreshQueue(establishment);
    return { ok: true, message: `${parsed.data.name} entrou na fila.` };
  });
}

const settingsSchema = z.object({
  avg_minutes: z.coerce.number().int().min(1).max(240),
  max_party: z.coerce.number().int().min(1).max(100),
  max_waiting: z.coerce.number().int().min(1).max(500),
  grace_minutes: z.coerce.number().int().min(1).max(120),
  ask_party: z.boolean(),
  ask_service: z.boolean(),
  ask_staff: z.boolean(),
  auto_hours: z.boolean(),
  auto_next: z.boolean(),
  message: z.string().trim().max(300).transform((text) => text || null),
});

export async function saveWaitlistSettings(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return staffGuard(async () => {
    const { establishment } = await staffAccess(formData);
    const parsed = settingsSchema.safeParse({
      avg_minutes: formText(formData, "avg_minutes"),
      max_party: formText(formData, "max_party"),
      max_waiting: formText(formData, "max_waiting"),
      grace_minutes: formText(formData, "grace_minutes"),
      ask_party: formData.get("ask_party") === "on",
      ask_service: formData.get("ask_service") === "on",
      ask_staff: formData.get("ask_staff") === "on",
      auto_hours: formData.get("auto_hours") === "on",
      auto_next: formData.get("auto_next") === "on",
      message: formText(formData, "message"),
    });
    if (!parsed.success) return { ok: false, message: "Verifique os valores (minutos e limites)." };
    await ensureWaitlistSettings(establishment);
    const { error } = await createServiceClient().from("waitlist_settings").update(parsed.data).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refreshQueue(establishment);
    return { ok: true, message: "Definições guardadas." };
  });
}
