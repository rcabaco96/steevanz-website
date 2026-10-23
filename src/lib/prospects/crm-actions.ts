"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { isDate, isSiteStatus, isStage, lisbonToday, noAnswer, stageChange, type SiteStatus, type Stage } from "./crm";
import { listProspectEvents, type ProspectEvent } from "./store";

/** What the board keeps of a business after a change, as saved. */
export interface CrmPatch {
  status: Stage;
  next_contact: string | null;
  attempts: number;
  notes: string | null;
  site_status: SiteStatus | null;
  site_reasons: string[];
  worked_at: string | null;
  worked_by: string | null;
}

export type CrmResult = { ok: true; patch: CrmPatch } | { ok: false; message: string };

const patchColumns = "status, next_contact, attempts, notes, site_status, site_reasons, worked_at, worked_by";
const validPlace = (placeId: unknown): placeId is string => typeof placeId === "string" && placeId.length >= 3 && placeId.length <= 300;

type EventInsert = { kind: ProspectEvent["kind"]; value?: string | null; previous?: string | null };

async function change(placeId: string, build: (current: CrmPatch) => { update: Partial<CrmPatch> & { site_checked_at?: string }; events: EventInsert[] } | null): Promise<CrmResult> {
  try {
    const email = await requireAdmin();
    if (!validPlace(placeId)) return { ok: false, message: "Pedido inválido." };
    const client = createServiceClient();
    const { data: current, error } = await client.from("prospects").select(patchColumns).eq("place_id", placeId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!current) return { ok: false, message: "Este negócio já não está na lista." };
    const planned = build(current as CrmPatch);
    if (!planned) return { ok: true, patch: current as CrmPatch };
    const { data: saved, error: saveError } = await client
      .from("prospects")
      .update({ ...planned.update, worked_at: new Date().toISOString(), worked_by: email })
      .eq("place_id", placeId)
      .select(patchColumns)
      .single();
    if (saveError) throw new Error(saveError.message);
    if (planned.events.length) {
      const { error: eventError } = await client.from("prospect_events").insert(planned.events.map((event) => ({ place_id: placeId, actor: email, ...event })));
      if (eventError) console.error("[crm] history not saved:", eventError.message);
    }
    return { ok: true, patch: saved as CrmPatch };
  } catch (error) {
    console.error("[crm] change failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível guardar. Tente outra vez." };
  }
}

/** A new stage: «Contactado» brings a next contact in 3 days (when there is none); «Cliente» and «Sem interesse» clear it. */
export async function setStageAction(placeId: string, stage: string): Promise<CrmResult> {
  if (!isStage(stage)) return { ok: false, message: "Fase inválida." };
  return change(placeId, (current) => {
    if (current.status === stage) return null;
    const next = stageChange(current, stage, lisbonToday());
    const events: EventInsert[] = [{ kind: "stage", value: stage, previous: current.status }];
    if (next.next_contact !== current.next_contact) events.push({ kind: "next_contact", value: next.next_contact, previous: current.next_contact });
    return { update: next, events };
  });
}

export async function setNextContactAction(placeId: string, date: string | null): Promise<CrmResult> {
  if (date !== null && !isDate(date)) return { ok: false, message: "Data inválida." };
  return change(placeId, (current) =>
    current.next_contact === date ? null : { update: { next_contact: date }, events: [{ kind: "next_contact", value: date, previous: current.next_contact }] },
  );
}

/** «Não atendeu»: counts the attempt and puts the next contact for tomorrow. */
export async function noAnswerAction(placeId: string): Promise<CrmResult> {
  return change(placeId, (current) => {
    const next = noAnswer(current, lisbonToday());
    return { update: next, events: [{ kind: "no_answer", value: String(next.attempts), previous: current.next_contact }] };
  });
}

/** Notes save themselves while typing: one history entry per stretch of writing (15 minutes), not per pause. */
export async function saveNotesAction(placeId: string, notes: string): Promise<CrmResult> {
  const clean = String(notes ?? "").slice(0, 2000);
  const value = clean.trim() ? clean : null;
  const result = await change(placeId, (current) => ((current.notes ?? null) === value ? null : { update: { notes: value }, events: [] }));
  if (!result.ok) return result;
  try {
    const email = await requireAdmin();
    const client = createServiceClient();
    const since = new Date(Date.now() - 15 * 60_000).toISOString();
    const { data: last } = await client
      .from("prospect_events")
      .select("id")
      .eq("place_id", placeId)
      .eq("kind", "note")
      .eq("actor", email)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last) await client.from("prospect_events").update({ value }).eq("id", (last as { id: number }).id);
    else await client.from("prospect_events").insert({ place_id: placeId, actor: email, kind: "note", value });
  } catch (error) {
    console.error("[crm] note history not saved:", error instanceof Error ? error.message : error);
  }
  return result;
}

/** The website label changed by hand (the prospector never overwrites it afterwards). */
export async function setSiteStatusAction(placeId: string, status: string): Promise<CrmResult> {
  if (!isSiteStatus(status)) return { ok: false, message: "Situação inválida." };
  return change(placeId, (current) =>
    current.site_status === status
      ? null
      : {
          update: { site_status: status, site_reasons: [], site_checked_at: new Date().toISOString() },
          events: [{ kind: "site", value: status, previous: current.site_status }],
        },
  );
}

/** A Steevanz product page sent to the business: «copy» (link copied) or «whatsapp» (opened WhatsApp with it). Only the history changes. */
export async function logProductAction(placeId: string, productId: string, how: "copy" | "whatsapp"): Promise<{ ok: boolean }> {
  try {
    const email = await requireAdmin();
    if (!validPlace(placeId) || !/^[a-z0-9-]{2,60}$/.test(productId)) return { ok: false };
    const { error } = await createServiceClient().from("prospect_events").insert({ place_id: placeId, actor: email, kind: "product", value: productId, previous: how });
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (error) {
    console.error("[crm] product history failed:", error instanceof Error ? error.message : error);
    return { ok: false };
  }
}

export async function listEventsAction(placeId: string): Promise<{ ok: true; events: ProspectEvent[] } | { ok: false; message: string }> {
  try {
    await requireAdmin();
    if (!validPlace(placeId)) return { ok: false, message: "Pedido inválido." };
    return { ok: true, events: await listProspectEvents(placeId) };
  } catch (error) {
    console.error("[crm] history failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível abrir o histórico." };
  }
}

const settingsSchema = z.object({
  whatsapp_template: z.string().trim().min(1).max(1000),
  whatsapp_none: z.string().trim().max(300),
  whatsapp_down: z.string().trim().max(300),
  whatsapp_ai: z.string().trim().max(300),
  whatsapp_outdated: z.string().trim().max(300),
  whatsapp_other: z.string().trim().max(300),
});

/** Admin: the WhatsApp message the CRM writes for each business. */
export async function saveWhatsAppSettingsAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const email = await requireAdmin();
    const parsed = settingsSchema.safeParse(Object.fromEntries(Object.keys(settingsSchema.shape).map((key) => [key, String(formData.get(key) ?? "")])));
    if (!parsed.success) return { ok: false, message: "A mensagem não pode ficar vazia (até 1000 letras; cada frase até 300)." };
    const { error } = await createServiceClient()
      .from("prospect_settings")
      .upsert({ id: true, ...parsed.data, updated_by: email, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/crm");
    return { ok: true, message: "Mensagem guardada." };
  } catch (error) {
    console.error("[crm] settings failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Não foi possível guardar a mensagem." };
  }
}
