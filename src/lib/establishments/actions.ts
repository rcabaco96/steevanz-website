"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { formText } from "@/lib/modules/common";
import { createServiceClient } from "@/lib/supabase/service";
import { accessErrorMessage, requireAdminSession, requireEstablishmentAccess } from "./access";
import { businessKinds, slugify } from "./kinds";
import { addStartingHours, addStartingServices } from "./provision";
import { isUuid } from "./store";

async function guarded(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await task();
  } catch (error) {
    const denied = accessErrorMessage(error);
    if (denied) return { ok: false, message: denied };
    console.error("[establishments] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function refresh() {
  revalidatePath("/conta", "layout");
  revalidatePath("/admin", "layout");
}

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((text) => text || null);

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const createSchema = z.object({
  owner_id: z.uuid(),
  name: z.string().trim().min(1).max(120),
  kind: z.enum(businessKinds),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60),
});

/** Admin: a new establishment for a client account, with starting opening hours. */
export async function createEstablishment(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    await requireAdminSession();
    const name = formText(formData, "name");
    const parsed = createSchema.safeParse({
      owner_id: formText(formData, "owner_id"),
      name,
      kind: formText(formData, "kind"),
      slug: slugify(formText(formData, "slug") || name),
    });
    if (!parsed.success) {
      const field = String(parsed.error.issues[0]?.path[0] ?? "");
      return { ok: false, message: field === "slug" ? "O endereço só pode ter letras, números e hífens." : "Indique o nome e o tipo de negócio." };
    }
    const client = createServiceClient();
    const { data, error } = await client.from("establishments").insert(parsed.data).select("id").single<{ id: string }>();
    if (error) {
      if (error.code === "23505") return { ok: false, message: `O endereço «${parsed.data.slug}» já está a ser usado. Escolha outro.` };
      if (error.code === "23503") return { ok: false, message: "Conta de cliente não encontrada." };
      throw new Error(error.message);
    }
    await addStartingHours(data.id, parsed.data.kind);
    await addStartingServices(data.id, parsed.data.kind);
    refresh();
    return { ok: true, message: `Espaço «${parsed.data.name}» criado.` };
  });
}

/** Admin: removes an establishment and everything of its modules. */
export async function deleteEstablishment(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    await requireAdminSession();
    const id = formText(formData, "id");
    if (!isUuid(id)) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from("establishments").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true, message: "Espaço removido." };
  });
}

const detailsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  kind: z.enum(businessKinds),
  phone: optional(40),
  address: optional(200),
});

/** Name, kind and contacts. The public address (slug) only changes from the admin. */
export async function updateEstablishment(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment, viewer } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const parsed = detailsSchema.safeParse({
      name: formText(formData, "name"),
      kind: formText(formData, "kind"),
      phone: formText(formData, "phone"),
      address: formText(formData, "address"),
    });
    if (!parsed.success) return { ok: false, message: "Verifique o nome e o tipo de negócio." };
    const changes: Record<string, unknown> = { ...parsed.data };
    const slugInput = formText(formData, "slug");
    if (viewer === "admin" && slugInput && slugInput !== establishment.slug) {
      const slug = slugify(slugInput);
      if (!slug) return { ok: false, message: "O endereço só pode ter letras, números e hífens." };
      changes.slug = slug;
    }
    const { error } = await createServiceClient().from("establishments").update(changes).eq("id", establishment.id);
    if (error) {
      if (error.code === "23505") return { ok: false, message: "Esse endereço já está a ser usado." };
      throw new Error(error.message);
    }
    refresh();
    return { ok: true, message: "Dados guardados." };
  });
}

const serviceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  duration_minutes: z.coerce.number().int().min(5).max(480),
  buffer_minutes: z.coerce.number().int().min(0).max(120),
  price_cents: z
    .string()
    .trim()
    .transform((text) => (text ? Math.round(Number(text.replace(",", ".")) * 100) : null))
    .refine((value) => value === null || (Number.isFinite(value) && value >= 0 && value <= 10_000_000)),
  active: z.boolean(),
});

/**
 * Adds or changes a service. From the bookings module it also says how the service is booked (one
 * at a time, or several people until a turn fills) and who does it (none chosen: everyone).
 */
export async function saveService(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const kind = formText(formData, "booking_kind") === "group" ? "group" : "one";
    const parsed = serviceSchema.safeParse({
      name: formText(formData, "name"),
      duration_minutes: kind === "group" ? "120" : formText(formData, "duration_minutes"),
      buffer_minutes: kind === "group" ? "0" : formText(formData, "buffer_minutes") || "0",
      price_cents: formText(formData, "price"),
      active: formData.get("active") === "on",
    });
    if (!parsed.success) return { ok: false, message: "Indique o nome e a duração (5 a 480 minutos)." };
    const changes: Record<string, unknown> = { ...parsed.data };
    if (formData.has("booking_kind")) {
      changes.booking_kind = kind;
      if (kind === "group") {
        const capacity = Number(formText(formData, "capacity"));
        const maxParty = Number(formText(formData, "max_party"));
        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000) return { ok: false, message: "Indique quantos lugares há por turno." };
        if (!Number.isInteger(maxParty) || maxParty < 1 || maxParty > 1000) return { ok: false, message: "Indique o máximo de pessoas por reserva." };
        changes.capacity = capacity;
        changes.max_party = maxParty;
      } else {
        changes.capacity = null;
      }
    }
    const id = formText(formData, "id");
    const client = createServiceClient();
    let serviceId = id;
    if (isUuid(id)) {
      const { error } = await client.from("establishment_services").update(changes).eq("id", id).eq("establishment_id", establishment.id);
      if (error) throw new Error(error.message);
    } else {
      const { data, error } = await client
        .from("establishment_services")
        .insert({ ...changes, establishment_id: establishment.id, sort: Date.now() % 1_000_000 })
        .select("id")
        .single<{ id: string }>();
      if (error) throw new Error(error.message);
      serviceId = data.id;
    }
    // Who does it: only when the form shows the choice (bookings module).
    if (formData.has("staff_choice")) {
      const { data: staff, error: staffError } = await client.from("establishment_staff").select("id").eq("establishment_id", establishment.id);
      if (staffError) throw new Error(staffError.message);
      const known = new Set(((staff ?? []) as { id: string }[]).map((row) => row.id));
      const chosen = kind === "group" ? [] : formData.getAll("staff_ids").map(String).filter((value) => known.has(value));
      const { error: clearError } = await client.from("establishment_service_staff").delete().eq("service_id", serviceId);
      if (clearError) throw new Error(clearError.message);
      if (chosen.length) {
        const { error: insertError } = await client.from("establishment_service_staff").insert(chosen.map((staffId) => ({ service_id: serviceId, staff_id: staffId })));
        if (insertError) throw new Error(insertError.message);
      }
    }
    refresh();
    return { ok: true, message: isUuid(id) ? "Serviço guardado." : "Serviço adicionado." };
  });
}

export async function deleteService(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const id = formText(formData, "id");
    if (!isUuid(id)) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from("establishment_services").delete().eq("id", id).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true, message: "Serviço removido." };
  });
}

export async function saveStaff(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const name = formText(formData, "name");
    if (!name || name.length > 80) return { ok: false, message: "Indique o nome (até 80 caracteres)." };
    const active = formData.get("active") === "on";
    const id = formText(formData, "id");
    const client = createServiceClient();
    const { error } = isUuid(id)
      ? await client.from("establishment_staff").update({ name, active }).eq("id", id).eq("establishment_id", establishment.id)
      : await client.from("establishment_staff").insert({ name, active, establishment_id: establishment.id, sort: Date.now() % 1_000_000 });
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true, message: isUuid(id) ? "Profissional guardado." : "Profissional adicionado." };
  });
}

export async function deleteStaff(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const id = formText(formData, "id");
    if (!isUuid(id)) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from("establishment_staff").delete().eq("id", id).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true, message: "Profissional removido." };
  });
}

/** Replaces the weekly opening hours: up to two intervals per day (fields h{weekday}_{0|1}_opens/closes). */
export async function saveHours(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const rows: { establishment_id: string; weekday: number; opens: string; closes: string }[] = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      const intervals: [string, string][] = [];
      for (const index of [0, 1]) {
        const opens = formText(formData, `h${weekday}_${index}_opens`);
        const closes = formText(formData, `h${weekday}_${index}_closes`);
        if (!opens && !closes) continue;
        if (!time.safeParse(opens).success || !time.safeParse(closes).success || closes <= opens) {
          return { ok: false, message: "Verifique as horas: cada período precisa de abertura e fecho, e o fecho depois da abertura." };
        }
        intervals.push([opens, closes]);
      }
      intervals.sort(([a], [b]) => a.localeCompare(b));
      if (intervals.length === 2 && intervals[1][0] < intervals[0][1]) return { ok: false, message: "Os dois períodos de um dia não se podem sobrepor." };
      for (const [opens, closes] of intervals) rows.push({ establishment_id: establishment.id, weekday, opens, closes });
    }
    // New hours first, then the old ones go: a failure halfway never leaves the shop without hours.
    const client = createServiceClient();
    const { data: previous, error: readError } = await client.from("establishment_hours").select("id").eq("establishment_id", establishment.id);
    if (readError) throw new Error(readError.message);
    if (rows.length) {
      const { error } = await client.from("establishment_hours").insert(rows);
      if (error) throw new Error(error.message);
    }
    const oldIds = ((previous ?? []) as { id: string }[]).map((row) => row.id);
    if (oldIds.length) {
      const { error: deleteError } = await client.from("establishment_hours").delete().in("id", oldIds);
      if (deleteError) throw new Error(deleteError.message);
    }
    refresh();
    return { ok: true, message: "Horário guardado." };
  });
}

/** A person's or place's own weekly hours (fields h{weekday}_{0|1}_opens/closes); empty = the space's hours. */
export async function saveStaffHours(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const staffId = formText(formData, "staff_id");
    if (!isUuid(staffId)) return { ok: false, message: "Pedido inválido." };
    const client = createServiceClient();
    const { data: person, error: personError } = await client.from("establishment_staff").select("id").eq("id", staffId).eq("establishment_id", establishment.id).maybeSingle();
    if (personError) throw new Error(personError.message);
    if (!person) return { ok: false, message: "Não encontrado." };
    const rows: { staff_id: string; weekday: number; opens: string; closes: string }[] = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      for (const index of [0, 1]) {
        const opens = formText(formData, `h${weekday}_${index}_opens`);
        const closes = formText(formData, `h${weekday}_${index}_closes`);
        if (!opens && !closes) continue;
        if (!time.safeParse(opens).success || !time.safeParse(closes).success || closes <= opens) {
          return { ok: false, message: "Verifique as horas: cada período precisa de início e fim, e o fim depois do início." };
        }
        rows.push({ staff_id: staffId, weekday, opens, closes });
      }
    }
    const { error: deleteError } = await client.from("establishment_staff_hours").delete().eq("staff_id", staffId);
    if (deleteError) throw new Error(deleteError.message);
    if (rows.length) {
      const { error } = await client.from("establishment_staff_hours").insert(rows);
      if (error) throw new Error(error.message);
    }
    refresh();
    return { ok: true, message: rows.length ? "Horário próprio guardado." : "Segue o horário do espaço." };
  });
}

export async function addClosure(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const day = formText(formData, "day");
    if (!z.iso.date().safeParse(day).success) return { ok: false, message: "Escolha uma data." };
    const reason = formText(formData, "reason").slice(0, 120) || null;
    const { error } = await createServiceClient().from("establishment_closures").insert({ establishment_id: establishment.id, day, reason });
    if (error) {
      if (error.code === "23505") return { ok: false, message: "Esse dia já está marcado como fechado." };
      throw new Error(error.message);
    }
    refresh();
    return { ok: true, message: "Dia fechado adicionado." };
  });
}

export async function removeClosure(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { establishment } = await requireEstablishmentAccess(formText(formData, "establishment_id"));
    const id = formText(formData, "id");
    if (!isUuid(id)) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from("establishment_closures").delete().eq("id", id).eq("establishment_id", establishment.id);
    if (error) throw new Error(error.message);
    refresh();
    return { ok: true, message: "Dia fechado removido." };
  });
}
