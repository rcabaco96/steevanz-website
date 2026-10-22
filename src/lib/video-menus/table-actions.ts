"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { maxTablesAtOnce, tableName, tableNamesUpTo } from "./ordering-rules";
import { newOrderingToken } from "./ordering-store";
import { menuPaths } from "./rules";
import { menuCacheTag, uuidPattern } from "./store";

// Admin: ordering at the table. The «Pedidos no menu» switch and the menu's tables (each with its
// own secret link for the table's plate). The table pages are rendered on every visit, so only the
// admin's page needs refreshing (and, for the switch, the menu's public page: see setMenuOrdering).

type ServiceClient = ReturnType<typeof createServiceClient>;

class TableMessage extends Error {}

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

async function guarded(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    return await task();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." };
    if (error instanceof TableMessage) return { ok: false, message: error.message };
    console.error("[ordering] admin action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function refresh() {
  revalidatePath("/admin/menus", "layout");
}

async function findMenuId(client: ServiceClient, id: string): Promise<string> {
  if (!uuidPattern.test(id)) throw new TableMessage("Menu não encontrado.");
  const { data, error } = await client.from("video_menus").select("id").eq("id", id).maybeSingle();
  if (error) throw new Error(`findMenuId: ${error.message}`);
  if (!data) throw new TableMessage("Este menu já não existe.");
  return (data as { id: string }).id;
}

async function findTable(client: ServiceClient, id: string): Promise<{ id: string; menu_id: string }> {
  if (!uuidPattern.test(id)) throw new TableMessage("Mesa não encontrada.");
  const { data, error } = await client.from("video_menu_tables").select("id, menu_id").eq("id", id).maybeSingle();
  if (error) throw new Error(`findTable: ${error.message}`);
  if (!data) throw new TableMessage("Esta mesa já não existe.");
  return data as { id: string; menu_id: string };
}

function nameFrom(formData: FormData): string {
  const name = tableName(value(formData, "name"));
  if (!name) throw new TableMessage("Indique o nome da mesa (até 40 caracteres), por exemplo «Mesa 1».");
  return name;
}

function nameTaken(error: { code?: string }, name: string): void {
  if (error.code === "23505") throw new TableMessage(`Já existe uma mesa chamada «${name}» neste menu.`);
}

/** «Pedidos no menu»: on, the table links take orders; off, they show the menu only. */
export async function setMenuOrdering(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const menuId = await findMenuId(client, value(formData, "id"));
    const enabled = value(formData, "enabled") === "on";
    const { data, error } = await client.from("video_menus").update({ ordering_enabled: enabled }).eq("id", menuId).select("slug").maybeSingle();
    if (error) throw new Error(`setMenuOrdering: ${error.message}`);
    // The public link reads the switch too (a demo menu's demo orders): its cached page follows.
    const slug = (data as { slug: string } | null)?.slug;
    if (slug) {
      revalidateTag(menuCacheTag(slug), { expire: 0 });
      for (const path of menuPaths(slug)) revalidatePath(path);
    }
    refresh();
    return { ok: true, message: enabled ? "Pedidos ligados: os links das mesas já aceitam pedidos." : "Pedidos desligados: os links das mesas mostram só o menu." };
  });
}

async function existingTables(client: ServiceClient, menuId: string): Promise<{ position: number; names: string[] }> {
  const { data, error } = await client.from("video_menu_tables").select("name, position").eq("menu_id", menuId);
  if (error) throw new Error(`existingTables: ${error.message}`);
  const rows = (data ?? []) as { name: string; position: number }[];
  return { position: rows.reduce((highest, row) => Math.max(highest, row.position), -1), names: rows.map((row) => row.name) };
}

export async function addTable(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const menuId = await findMenuId(client, value(formData, "menu_id"));
    const name = nameFrom(formData);
    const { position } = await existingTables(client, menuId);
    const { error } = await client.from("video_menu_tables").insert({ menu_id: menuId, name, token: newOrderingToken(), position: position + 1 });
    if (error) {
      nameTaken(error, name);
      throw new Error(`addTable: ${error.message}`);
    }
    refresh();
    return { ok: true, message: `«${name}» criada.` };
  });
}

/** «Criar mesas 1 a N»: only the missing ones (a «Mesa 3» that exists stays as it is). */
export async function addTablesUpTo(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const menuId = await findMenuId(client, value(formData, "menu_id"));
    const count = Number(value(formData, "count"));
    if (!Number.isInteger(count) || count < 1 || count > maxTablesAtOnce) throw new TableMessage(`Indique um número de 1 a ${maxTablesAtOnce}.`);
    const { position, names } = await existingTables(client, menuId);
    const missing = tableNamesUpTo(count, names);
    if (!missing.length) return { ok: true, message: `As mesas 1 a ${count} já existem.` };
    const rows = missing.map((name, index) => ({ menu_id: menuId, name, token: newOrderingToken(), position: position + 1 + index }));
    const { error } = await client.from("video_menu_tables").insert(rows);
    if (error) {
      if (error.code === "23505") throw new TableMessage("Algumas mesas já existiam. Atualize a página e tente outra vez.");
      throw new Error(`addTablesUpTo: ${error.message}`);
    }
    refresh();
    return { ok: true, message: `${missing.length} ${missing.length === 1 ? "mesa criada" : "mesas criadas"}.` };
  });
}

export async function renameTable(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const table = await findTable(client, value(formData, "id"));
    const name = nameFrom(formData);
    const { error } = await client.from("video_menu_tables").update({ name }).eq("id", table.id);
    if (error) {
      nameTaken(error, name);
      throw new Error(`renameTable: ${error.message}`);
    }
    refresh();
    return { ok: true, message: "Nome guardado." };
  });
}

/** «Gerar novo código»: a new link for the table; the old one stops working at once. */
export async function rotateTableToken(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const table = await findTable(client, value(formData, "id"));
    const { error } = await client.from("video_menu_tables").update({ token: newOrderingToken() }).eq("id", table.id);
    if (error) throw new Error(`rotateTableToken: ${error.message}`);
    refresh();
    return { ok: true, message: "Novo código gerado. Imprima o QR novo: o antigo já não abre a mesa." };
  });
}

/** The table's cart goes with it; its orders stay (with the table's name). */
export async function deleteTable(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const table = await findTable(client, value(formData, "id"));
    const { error } = await client.from("video_menu_tables").delete().eq("id", table.id);
    if (error) throw new Error(`deleteTable: ${error.message}`);
    refresh();
    return { ok: true, message: "Mesa apagada." };
  });
}
