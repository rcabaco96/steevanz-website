"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { bunnyConfig, scheduleBunnyVideoDeletion } from "@/lib/bunny";
import { imageTypeOf } from "@/lib/establishments/logo-rules";
import { createServiceClient } from "@/lib/supabase/service";
import { isLogoUrl, menuPaths, moveItem, parseInstagram, parsePriceCents, slugProblem, type VideoMenuRow } from "./rules";
import { menuCacheTag, menuColumns, uuidPattern } from "./store";

// Admin: video menus, their dishes and collections. Every change refreshes the menu's public page
// at once (its cache tag and paths) and the admin pages.

type ServiceClient = ReturnType<typeof createServiceClient>;

const menuLogoBucket = "menu-logos";
const logoMaxBytes = 2 * 1024 * 1024;

/** Shown when the database answers but the tables of this feature aren't there yet. */
const notReadyMessage = "A base de dados ainda não tem as tabelas dos menus em vídeo (falta aplicar a migração 20261015120000_video_menus.sql).";

class MenuMessage extends Error {}

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function fail(error: { code?: string; message: string }, context: string): never {
  if (error.code === "PGRST205" || error.code === "42P01") throw new MenuMessage(notReadyMessage);
  throw new Error(`${context}: ${error.message}`);
}

async function guarded(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    return await task();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." };
    if (error instanceof MenuMessage) return { ok: false, message: error.message };
    console.error("[video-menus] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function refresh(...slugs: string[]) {
  for (const slug of new Set(slugs)) {
    revalidateTag(menuCacheTag(slug), { expire: 0 });
    for (const path of menuPaths(slug)) revalidatePath(path);
  }
  revalidatePath("/admin/menus", "layout");
}

async function findMenu(client: ServiceClient, id: string): Promise<VideoMenuRow> {
  if (!uuidPattern.test(id)) throw new MenuMessage("Menu não encontrado.");
  const { data, error } = await client.from("video_menus").select(menuColumns).eq("id", id).maybeSingle();
  if (error) fail(error, "findMenu");
  if (!data) throw new MenuMessage("Este menu já não existe.");
  return data as VideoMenuRow;
}

/** The row of a dish or collection, with its menu (to refresh its page). */
async function findChild(client: ServiceClient, table: "video_menu_dishes" | "video_menu_collections", id: string) {
  if (!uuidPattern.test(id)) throw new MenuMessage("Não encontrado.");
  const { data, error } = await client.from(table).select("id, menu_id, position").eq("id", id).maybeSingle();
  if (error) fail(error, "findChild");
  if (!data) throw new MenuMessage(table === "video_menu_dishes" ? "Este prato já não existe." : "Esta coleção já não existe.");
  const row = data as { id: string; menu_id: string; position: number };
  return { row, menu: await findMenu(client, row.menu_id) };
}

/** The Bunny videos (ready or pending) of a dish or of a whole menu, to delete with them. */
async function bunnyVideosOf(client: ServiceClient, column: "id" | "menu_id", id: string): Promise<string[]> {
  if (!bunnyConfig()) return [];
  const { data, error } = await client.from("video_menu_dishes").select("bunny_video_id, pending_video_id").eq(column, id);
  if (error) {
    console.warn("[menus] bunny videos lookup failed:", error.message);
    return [];
  }
  return ((data ?? []) as { bunny_video_id: string | null; pending_video_id: string | null }[]).flatMap((row) => [row.bunny_video_id, row.pending_video_id]).filter((video): video is string => Boolean(video));
}

/**
 * Deleted from Bunny a day later (bunny-cleanup-rules: pages already open still show them). Best effort:
 * a video left on Bunny only takes space (it no longer shows anywhere).
 */
async function deleteBunnyVideos(videos: string[]) {
  await Promise.all(videos.map((video) => scheduleBunnyVideoDeletion(video).catch((reason) => console.warn("[menus] bunny video not marked for deletion:", video, reason instanceof Error ? reason.message : reason))));
}

async function nextPosition(client: ServiceClient, table: "video_menu_dishes" | "video_menu_collections", menuId: string): Promise<number> {
  const { data, error } = await client.from(table).select("position").eq("menu_id", menuId).order("position", { ascending: false }).limit(1);
  if (error) fail(error, "nextPosition");
  return ((data ?? [])[0]?.position ?? -1) + 1;
}

/** Positions 0, 1, 2… in this order (only the rows whose position changes are written). */
async function renumber(client: ServiceClient, table: "video_menu_dishes" | "video_menu_collections", rows: { id: string; position: number }[]) {
  const changes = rows.map((row, index) => ({ id: row.id, from: row.position, to: index })).filter((row) => row.from !== row.to);
  const results = await Promise.all(changes.map((row) => client.from(table).update({ position: row.to }).eq("id", row.id)));
  for (const result of results) if (result.error) fail(result.error, "renumber");
}

// Menu ---------------------------------------------------------------------------------------------

interface MenuFields {
  business_name: string;
  slug: string;
  instagram: string | null;
  logo_url: string | null;
  review_business_id: string | null;
  active: boolean;
}

function menuFields(formData: FormData): MenuFields {
  const business_name = value(formData, "business_name");
  if (!business_name) throw new MenuMessage("Indique o nome do negócio.");
  if (business_name.length > 120) throw new MenuMessage("O nome do negócio pode ter até 120 caracteres.");
  const slug = value(formData, "slug").toLowerCase();
  const problem = slugProblem(slug);
  if (problem) throw new MenuMessage(problem);
  const instagram = parseInstagram(value(formData, "instagram"));
  if (instagram === undefined) throw new MenuMessage("O Instagram não parece válido. Escreva só o nome da conta, por exemplo dolciesalati.ap.");
  const logo = value(formData, "logo_url");
  if (logo && !isLogoUrl(logo)) throw new MenuMessage("O endereço do logótipo tem de começar por https:// (ou ser um caminho do site, como /media/…).");
  const business = value(formData, "review_business_id");
  if (business && !uuidPattern.test(business)) throw new MenuMessage("Negócio inválido.");
  return { business_name, slug, instagram, logo_url: logo || null, review_business_id: business || null, active: formData.get("active") === "on" };
}

function chosenLogo(formData: FormData): File | null {
  const file = formData.get("logo_file");
  return file instanceof File && file.size > 0 ? file : null;
}

/** Checks the image by its first bytes (never the name), uploads it and gives its public address. */
async function uploadLogo(client: ServiceClient, menuId: string, file: File): Promise<string> {
  if (file.size > logoMaxBytes) throw new MenuMessage("A imagem tem mais de 2 MB. Escolha uma mais pequena.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = imageTypeOf(bytes);
  if (!type) throw new MenuMessage("Escolha uma imagem PNG, JPEG ou WebP.");
  const extension = type === "jpeg" ? "jpg" : type;
  const path = `${menuId}/${randomBytes(9).toString("base64url")}.${extension}`;
  const upload = await client.storage.from(menuLogoBucket).upload(path, bytes, {
    contentType: `image/${type}`,
    // Every logo has its own name, so the file never changes.
    cacheControl: "31536000",
    upsert: false,
  });
  if (upload.error) {
    console.error("[video-menus] logo upload failed:", upload.error.message);
    throw new MenuMessage("Não foi possível guardar a imagem. Confirme que o bucket «menu-logos» existe (migração dos menus) ou use um endereço.");
  }
  return client.storage.from(menuLogoBucket).getPublicUrl(path).data.publicUrl;
}

/** Deletes an old logo of this menu from Storage; a failure only leaves an orphan file. */
async function removeOldLogo(client: ServiceClient, menuId: string, url: string | null) {
  const marker = `/storage/v1/object/public/${menuLogoBucket}/`;
  const path = url?.includes(marker) ? url.slice(url.indexOf(marker) + marker.length) : null;
  if (!path || !path.startsWith(`${menuId}/`)) return;
  const { error } = await client.storage.from(menuLogoBucket).remove([path]);
  if (error) console.error("[video-menus] logo cleanup failed:", error.message);
}

function slugTaken(error: { code?: string }, slug: string): void {
  if (error.code === "23505") throw new MenuMessage(`Já existe um menu com o endereço «${slug}». Escolha outro.`);
}

/** A new menu; opens its page, where the dishes and collections are added. */
export async function createMenu(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let created: string | null = null;
  const result = await guarded(async () => {
    const fields = menuFields(formData);
    const client = createServiceClient();
    const { data, error } = await client.from("video_menus").insert(fields).select("id").single();
    if (error) {
      slugTaken(error, fields.slug);
      fail(error, "createMenu");
    }
    const id = (data as { id: string }).id;
    const file = chosenLogo(formData);
    if (file) {
      try {
        const logo_url = await uploadLogo(client, id, file);
        const update = await client.from("video_menus").update({ logo_url }).eq("id", id);
        if (update.error) fail(update.error, "createMenu logo");
      } catch (problem) {
        // The menu exists already: open it anyway; the logo can be sent again there.
        console.error("[video-menus] new menu without its logo:", problem instanceof Error ? problem.message : problem);
      }
    }
    refresh(fields.slug);
    created = id;
    return { ok: true, message: "Menu criado." };
  });
  if (created) redirect(`/admin/menus/${created}`);
  return result;
}

export async function updateMenu(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const menu = await findMenu(client, value(formData, "id"));
    const fields = menuFields(formData);
    const file = chosenLogo(formData);
    if (file) fields.logo_url = await uploadLogo(client, menu.id, file);
    const { error } = await client.from("video_menus").update(fields).eq("id", menu.id);
    if (error) {
      slugTaken(error, fields.slug);
      fail(error, "updateMenu");
    }
    if (menu.logo_url !== fields.logo_url) await removeOldLogo(client, menu.id, menu.logo_url);
    refresh(menu.slug, fields.slug);
    return { ok: true, message: "Menu guardado." };
  });
}

export async function deleteMenu(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let deleted = false;
  const result = await guarded(async () => {
    const client = createServiceClient();
    const menu = await findMenu(client, value(formData, "id"));
    const videos = await bunnyVideosOf(client, "menu_id", menu.id);
    const { error } = await client.from("video_menus").delete().eq("id", menu.id);
    if (error) fail(error, "deleteMenu");
    await removeOldLogo(client, menu.id, menu.logo_url);
    await deleteBunnyVideos(videos);
    refresh(menu.slug);
    deleted = true;
    return { ok: true, message: "Menu apagado." };
  });
  if (deleted) redirect("/admin/menus");
  return result;
}

// Dishes -------------------------------------------------------------------------------------------

function dishFields(formData: FormData) {
  const name = value(formData, "name");
  if (!name) throw new MenuMessage("Indique o nome do prato.");
  if (name.length > 80) throw new MenuMessage("O nome do prato pode ter até 80 caracteres.");
  const description = value(formData, "description");
  if (description.length > 300) throw new MenuMessage("A descrição pode ter até 300 caracteres.");
  const price_cents = parsePriceCents(value(formData, "price"));
  if (price_cents === null) throw new MenuMessage("Indique o preço em euros, por exemplo 4,50.");
  return { name, description, price_cents };
}

/** A new dish at the end of the menu, also at the end of the collections ticked in the form. */
export async function addDish(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const menu = await findMenu(client, value(formData, "menu_id"));
    const fields = dishFields(formData);
    const position = await nextPosition(client, "video_menu_dishes", menu.id);
    const { data, error } = await client.from("video_menu_dishes").insert({ ...fields, menu_id: menu.id, position }).select("id").single();
    if (error) fail(error, "addDish");
    const dishId = (data as { id: string }).id;
    const collections = formData.getAll("collections").filter((id): id is string => typeof id === "string" && uuidPattern.test(id));
    if (collections.length) {
      const { data: links, error: linksError } = await client.from("video_menu_collection_dishes").select("collection_id, position").in("collection_id", collections);
      if (linksError) fail(linksError, "addDish links");
      const last = new Map<string, number>();
      for (const link of (links ?? []) as { collection_id: string; position: number }[]) last.set(link.collection_id, Math.max(last.get(link.collection_id) ?? -1, link.position));
      const rows = collections.map((collection_id) => ({ collection_id, dish_id: dishId, menu_id: menu.id, position: (last.get(collection_id) ?? -1) + 1 }));
      const insert = await client.from("video_menu_collection_dishes").insert(rows);
      if (insert.error) fail(insert.error, "addDish collections");
    }
    refresh(menu.slug);
    return { ok: true, message: `«${fields.name}» adicionado. Envie o vídeo do prato: só aparece no menu depois disso.` };
  });
}

export async function updateDish(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const { row, menu } = await findChild(client, "video_menu_dishes", value(formData, "id"));
    const fields = dishFields(formData);
    const { error } = await client.from("video_menu_dishes").update(fields).eq("id", row.id);
    if (error) fail(error, "updateDish");
    refresh(menu.slug);
    return { ok: true, message: "Prato guardado." };
  });
}

/** Also leaves every collection (the database cascades) and deletes its own videos from Bunny. */
export async function deleteDish(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const { row, menu } = await findChild(client, "video_menu_dishes", value(formData, "id"));
    const videos = await bunnyVideosOf(client, "id", row.id);
    const { error } = await client.from("video_menu_dishes").delete().eq("id", row.id);
    if (error) fail(error, "deleteDish");
    await deleteBunnyVideos(videos);
    refresh(menu.slug);
    return { ok: true, message: "Prato apagado." };
  });
}

async function moveRow(table: "video_menu_dishes" | "video_menu_collections", formData: FormData): Promise<ActionState> {
  const client = createServiceClient();
  const { row, menu } = await findChild(client, table, value(formData, "id"));
  const direction = value(formData, "direction") === "up" ? -1 : 1;
  const { data, error } = await client.from(table).select("id, position").eq("menu_id", menu.id).order("position").order("created_at");
  if (error) fail(error, "moveRow");
  const rows = (data ?? []) as { id: string; position: number }[];
  await renumber(client, table, moveItem(rows, rows.findIndex((candidate) => candidate.id === row.id), direction));
  refresh(menu.slug);
  return { ok: true, message: "Ordem guardada." };
}

export async function moveDish(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(() => moveRow("video_menu_dishes", formData));
}

// Collections --------------------------------------------------------------------------------------

function collectionName(formData: FormData): string {
  const name = value(formData, "name");
  if (!name) throw new MenuMessage("Indique o nome da coleção.");
  if (name.length > 60) throw new MenuMessage("O nome da coleção pode ter até 60 caracteres.");
  return name;
}

/** A new collection at the end; the menu's first one becomes the default. «Com todos os pratos» fills it. */
export async function addCollection(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const menu = await findMenu(client, value(formData, "menu_id"));
    const name = collectionName(formData);
    const position = await nextPosition(client, "video_menu_collections", menu.id);
    const { data, error } = await client
      .from("video_menu_collections")
      .insert({ menu_id: menu.id, name, position, is_default: position === 0 })
      .select("id")
      .single();
    if (error) fail(error, "addCollection");
    if (formData.get("all_dishes") === "on") {
      const { data: dishes, error: dishesError } = await client.from("video_menu_dishes").select("id").eq("menu_id", menu.id).order("position").order("created_at");
      if (dishesError) fail(dishesError, "addCollection dishes");
      const rows = ((dishes ?? []) as { id: string }[]).map((dish, index) => ({ collection_id: (data as { id: string }).id, dish_id: dish.id, menu_id: menu.id, position: index }));
      if (rows.length) {
        const insert = await client.from("video_menu_collection_dishes").insert(rows);
        if (insert.error) fail(insert.error, "addCollection links");
      }
    }
    refresh(menu.slug);
    return { ok: true, message: `Coleção «${name}» criada.` };
  });
}

export async function renameCollection(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const { row, menu } = await findChild(client, "video_menu_collections", value(formData, "id"));
    const { error } = await client.from("video_menu_collections").update({ name: collectionName(formData) }).eq("id", row.id);
    if (error) fail(error, "renameCollection");
    refresh(menu.slug);
    return { ok: true, message: "Nome guardado." };
  });
}

/** The default one opens first on the menu. Deleting it passes the default to the first left. */
export async function setDefaultCollection(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const { row, menu } = await findChild(client, "video_menu_collections", value(formData, "id"));
    // One default per menu (unique index): the old one first, then the new one.
    const clear = await client.from("video_menu_collections").update({ is_default: false }).eq("menu_id", menu.id).eq("is_default", true).neq("id", row.id);
    if (clear.error) fail(clear.error, "setDefaultCollection");
    const { error } = await client.from("video_menu_collections").update({ is_default: true }).eq("id", row.id);
    if (error) fail(error, "setDefaultCollection");
    refresh(menu.slug);
    return { ok: true, message: "Esta coleção abre primeiro." };
  });
}

export async function deleteCollection(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const { row, menu } = await findChild(client, "video_menu_collections", value(formData, "id"));
    const { data, error } = await client.from("video_menu_collections").delete().eq("id", row.id).select("is_default");
    if (error) fail(error, "deleteCollection");
    if ((data ?? []).some((deleted: { is_default: boolean }) => deleted.is_default)) {
      const { data: first } = await client.from("video_menu_collections").select("id").eq("menu_id", menu.id).order("position").limit(1);
      const next = (first ?? [])[0] as { id: string } | undefined;
      if (next) await client.from("video_menu_collections").update({ is_default: true }).eq("id", next.id);
    }
    refresh(menu.slug);
    return { ok: true, message: "Coleção apagada." };
  });
}

export async function moveCollection(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(() => moveRow("video_menu_collections", formData));
}

/** The dishes of a collection, in this order ("dishes": the dish ids, one value each, in order). */
export async function saveCollectionDishes(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const { row, menu } = await findChild(client, "video_menu_collections", value(formData, "id"));
    const ids = [...new Set(formData.getAll("dishes").filter((id): id is string => typeof id === "string" && uuidPattern.test(id)))];
    if (ids.length) {
      // New and kept ones first (with their new order), then the ones taken out: never an empty moment.
      const rows = ids.map((dish_id, position) => ({ collection_id: row.id, dish_id, menu_id: menu.id, position }));
      const { error } = await client.from("video_menu_collection_dishes").upsert(rows, { onConflict: "collection_id,dish_id" });
      if (error) {
        if (error.code === "23503") throw new MenuMessage("Um dos pratos já não existe. Atualize a página.");
        fail(error, "saveCollectionDishes");
      }
    }
    let removal = client.from("video_menu_collection_dishes").delete().eq("collection_id", row.id);
    if (ids.length) removal = removal.not("dish_id", "in", `(${ids.join(",")})`);
    const { error } = await removal;
    if (error) fail(error, "saveCollectionDishes removal");
    refresh(menu.slug);
    return { ok: true, message: ids.length ? `${ids.length} ${ids.length === 1 ? "prato" : "pratos"} nesta coleção.` : "A coleção ficou vazia (não aparece no menu)." };
  });
}
