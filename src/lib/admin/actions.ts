"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isProductId } from "@/content/products";
import { orderStatuses, subscriptionStatuses } from "@/lib/accounts/types";
import type { ActionState } from "@/lib/action-state";
import { pipelineStatuses } from "@/lib/booking/types";
import { createServiceClient } from "@/lib/supabase/service";
import { AdminAccessError, requireAdmin } from "./auth";
import { accountForOrder, getOrder } from "./queries";

export type AdminActionState = ActionState;

const timePattern = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const uuid = z.uuid();
const time = z.string().regex(timePattern).transform((value) => value.slice(0, 5));

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

async function guarded(task: () => Promise<AdminActionState>): Promise<AdminActionState> {
  try {
    await requireAdmin();
    return await task();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." };
    console.error("[admin] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function toMinutes(timeValue: string): number {
  const [hours, minutes] = timeValue.split(":").map(Number);
  return hours * 60 + minutes;
}

const pipelineUpdateSchema = z.object({
  id: uuid,
  status: z.enum(pipelineStatuses),
  admin_notes: z
    .string()
    .max(5000)
    .transform((notes) => (notes.trim().length ? notes.trim() : null)),
});

async function updatePipeline(table: "bookings" | "leads", formData: FormData): Promise<AdminActionState> {
  const parsed = pipelineUpdateSchema.safeParse({
    id: value(formData, "id"),
    status: value(formData, "status"),
    admin_notes: typeof formData.get("admin_notes") === "string" ? String(formData.get("admin_notes")) : "",
  });
  if (!parsed.success) return { ok: false, message: "Dados inválidos." };
  const { id, ...changes } = parsed.data;
  const { error } = await createServiceClient().from(table).update(changes).eq("id", id);
  if (error) {
    if (error.code === "23505") return { ok: false, message: "Já existe outra marcação ativa neste horário." };
    throw new Error(error.message);
  }
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Alterações guardadas." };
}

export async function updateBooking(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(() => updatePipeline("bookings", formData));
}

export async function updateLead(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(() => updatePipeline("leads", formData));
}

const settingsSchema = z.object({
  min_notice_hours: z.coerce.number().int().min(0).max(720),
  max_days_ahead: z.coerce.number().int().min(1).max(365),
});

export async function saveSettings(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const parsed = settingsSchema.safeParse({
      min_notice_hours: value(formData, "min_notice_hours"),
      max_days_ahead: value(formData, "max_days_ahead"),
    });
    if (!parsed.success) return { ok: false, message: "Antecedência entre 0 e 720 horas; janela entre 1 e 365 dias." };
    const { error } = await createServiceClient()
      .from("booking_settings")
      .upsert({ id: 1, timezone: "Europe/Lisbon", ...parsed.data });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/availability");
    return { ok: true, message: "Definições guardadas." };
  });
}

const ruleSchema = z
  .object({
    id: z.union([uuid, z.literal("")]),
    weekday: z.coerce.number().int().min(0).max(6),
    start_time: time,
    end_time: time,
    slot_minutes: z.coerce.number().int().min(5).max(480),
    active: z.boolean(),
  })
  .refine((rule) => toMinutes(rule.end_time) - toMinutes(rule.start_time) >= rule.slot_minutes);

export async function saveRule(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const parsed = ruleSchema.safeParse({
      id: value(formData, "id"),
      weekday: value(formData, "weekday"),
      start_time: value(formData, "start_time"),
      end_time: value(formData, "end_time"),
      slot_minutes: value(formData, "slot_minutes"),
      active: formData.get("active") === "on",
    });
    if (!parsed.success) return { ok: false, message: "Verifique as horas: o fim tem de ser depois do início e caber pelo menos uma vaga." };
    const { id, ...rule } = parsed.data;
    const client = createServiceClient();
    const { error } = id
      ? await client.from("availability_rules").update(rule).eq("id", id)
      : await client.from("availability_rules").insert(rule);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/availability");
    return { ok: true, message: id ? "Horário atualizado." : "Horário adicionado." };
  });
}

const breakSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    start_time: time,
    end_time: time,
  })
  .refine((item) => toMinutes(item.end_time) > toMinutes(item.start_time));

export async function createBreak(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const parsed = breakSchema.safeParse({
      weekday: value(formData, "weekday"),
      start_time: value(formData, "start_time"),
      end_time: value(formData, "end_time"),
    });
    if (!parsed.success) return { ok: false, message: "O fim da pausa tem de ser depois do início." };
    const { error } = await createServiceClient().from("availability_breaks").insert(parsed.data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/availability");
    return { ok: true, message: "Pausa adicionada." };
  });
}

const blockedSchema = z.object({
  date: z.iso.date(),
  reason: z
    .string()
    .trim()
    .max(200)
    .transform((reason) => (reason.length ? reason : null)),
});

export async function createBlockedDate(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const parsed = blockedSchema.safeParse({ date: value(formData, "date"), reason: value(formData, "reason") });
    if (!parsed.success) return { ok: false, message: "Indique uma data válida." };
    const { error } = await createServiceClient().from("blocked_dates").upsert(parsed.data, { onConflict: "date" });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/availability");
    return { ok: true, message: "Dia bloqueado." };
  });
}

const deletableTables = {
  rule: "availability_rules",
  break: "availability_breaks",
  blocked: "blocked_dates",
} as const;

export async function deleteAvailabilityItem(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const kind = value(formData, "kind") as keyof typeof deletableTables;
    const table = deletableTables[kind];
    const id = uuid.safeParse(value(formData, "id"));
    if (!table || !id.success) return { ok: false, message: "Pedido inválido." };
    const { error } = await createServiceClient().from(table).delete().eq("id", id.data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/availability");
    return { ok: true, message: "Removido." };
  });
}

// Client accounts and orders

const orderUpdateSchema = z.object({
  id: uuid,
  status: z.enum(orderStatuses),
  admin_notes: z
    .string()
    .max(5000)
    .transform((notes) => (notes.trim().length ? notes.trim() : null)),
});

export async function updateOrder(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const parsed = orderUpdateSchema.safeParse({
      id: value(formData, "id"),
      status: value(formData, "status"),
      admin_notes: typeof formData.get("admin_notes") === "string" ? String(formData.get("admin_notes")) : "",
    });
    if (!parsed.success) return { ok: false, message: "Dados inválidos." };
    const { id, status, admin_notes } = parsed.data;
    const order = await getOrder(id);
    if (!order) return { ok: false, message: "Encomenda não encontrada." };
    const client = createServiceClient();

    if (status !== "accepted") {
      const { error } = await client.from("orders").update({ status, admin_notes }).eq("id", id);
      if (error) throw new Error(error.message);
      revalidatePath("/admin", "layout");
      return { ok: true, message: "Alterações guardadas." };
    }

    // Accepting gives the client access to every product in the order.
    const account = await accountForOrder(order);
    if (!account) {
      return { ok: false, message: `Não existe conta com o email ${order.email}. Peça ao cliente para criar conta com esse email e aceite de novo.` };
    }
    const productIds = [...new Set(order.items.map((item) => item.productId).filter(isProductId))];
    if (productIds.length) {
      const { error } = await client.from("client_products").upsert(
        productIds.map((product_id) => ({ user_id: account.id, product_id, status: "active", order_id: order.id, activated_at: new Date().toISOString() })),
        { onConflict: "user_id,product_id" },
      );
      if (error) throw new Error(error.message);
    }
    const { error } = await client.from("orders").update({ status, admin_notes, user_id: account.id }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin", "layout");
    return { ok: true, message: `Encomenda aceite. ${productIds.length} ${productIds.length === 1 ? "produto ativado" : "produtos ativados"} na conta de ${account.email}.` };
  });
}

const clientProductSchema = z.object({
  user_id: uuid,
  product_id: z.string().refine(isProductId),
  status: z.enum(subscriptionStatuses),
  notes: z
    .string()
    .trim()
    .max(2000)
    .transform((notes) => (notes.length ? notes : null)),
});

export async function saveClientProduct(_previous: AdminActionState, formData: FormData): Promise<AdminActionState> {
  return guarded(async () => {
    const parsed = clientProductSchema.safeParse({
      user_id: value(formData, "user_id"),
      product_id: value(formData, "product_id"),
      status: value(formData, "status") || "active",
      notes: typeof formData.get("notes") === "string" ? String(formData.get("notes")) : "",
    });
    if (!parsed.success) return { ok: false, message: "Escolha um produto e um estado válidos." };
    const client = createServiceClient();
    const { data: existing, error: lookupError } = await client
      .from("client_products")
      .select("id")
      .eq("user_id", parsed.data.user_id)
      .eq("product_id", parsed.data.product_id)
      .maybeSingle();
    if (lookupError) throw new Error(lookupError.message);
    const { error } = existing
      ? await client.from("client_products").update({ status: parsed.data.status, notes: parsed.data.notes }).eq("id", existing.id)
      : await client.from("client_products").insert(parsed.data);
    if (error) {
      if (error.code === "23503") return { ok: false, message: "Conta não encontrada." };
      throw new Error(error.message);
    }
    revalidatePath("/admin/clientes", "layout");
    return { ok: true, message: existing ? "Produto atualizado." : "Produto adicionado." };
  });
}
