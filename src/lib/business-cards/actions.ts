"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import type { ActionState } from "@/lib/action-state";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { imageTypeOf } from "@/lib/establishments/logo-rules";
import { createServiceClient } from "@/lib/supabase/service";
import {
  buildTagDestination,
  cardColumns,
  cardPaths,
  cardPhotoSize,
  cardSlugProblem,
  isPhotoUrl,
  isTagDestinationType,
  parseCardForm,
  socialNetworks,
  tagCodeProblem,
  tagColumns,
  tagPublicPath,
  type BusinessCardRow,
  type CardFormValues,
  type KeychainTagRow,
} from "./rules";
import { cardCacheTag, isMissingTable, tagCacheTag, uuidPattern } from "./store";

// Admin: business cards and keychain tags. Every change refreshes the public page at once (its cache
// tag and paths) and the admin pages.

type ServiceClient = ReturnType<typeof createServiceClient>;

const photoBucket = "business-card-photos";
const photoMaxBytes = 2 * 1024 * 1024;
const notReadyMessage = "A base de dados ainda não tem as tabelas dos cartões e tags (falta aplicar a migração 20261020210000_business_cards_keychains.sql).";

class CardMessage extends Error {}

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function fail(error: { code?: string; message: string }, context: string): never {
  if (isMissingTable(error)) throw new CardMessage(notReadyMessage);
  throw new Error(`${context}: ${error.message}`);
}

async function guarded(task: () => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    return await task();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, message: "Sessão expirada ou sem permissão. Entre novamente." };
    if (error instanceof CardMessage) return { ok: false, message: error.message };
    console.error("[business-cards] action failed:", error instanceof Error ? error.message : error);
    return { ok: false, message: "Ocorreu um erro. Tente novamente." };
  }
}

function refreshCards(...slugs: string[]) {
  for (const slug of new Set(slugs)) {
    revalidateTag(cardCacheTag(slug), { expire: 0 });
    for (const path of cardPaths(slug)) revalidatePath(path);
  }
  revalidatePath("/admin/cartoes", "layout");
}

function refreshTags(...codes: string[]) {
  for (const code of new Set(codes)) {
    revalidateTag(tagCacheTag(code), { expire: 0 });
    revalidatePath(tagPublicPath(code));
  }
  revalidatePath("/admin/tags", "layout");
}

// Business cards -----------------------------------------------------------------------------------

async function findCard(client: ServiceClient, id: string): Promise<BusinessCardRow> {
  if (!uuidPattern.test(id)) throw new CardMessage("Cartão não encontrado.");
  const { data, error } = await client.from("business_cards").select(cardColumns).eq("id", id).maybeSingle();
  if (error) fail(error, "findCard");
  if (!data) throw new CardMessage("Este cartão já não existe.");
  return data as BusinessCardRow;
}

function cardFields(formData: FormData) {
  const values: CardFormValues = {
    name: value(formData, "name"),
    slug: value(formData, "slug"),
    locale: value(formData, "locale"),
    client_name: value(formData, "client_name"),
    given_name: value(formData, "given_name"),
    family_name: value(formData, "family_name"),
    role: value(formData, "role"),
    company: value(formData, "company"),
    phone: value(formData, "phone"),
    phone2: value(formData, "phone2"),
    whatsapp: value(formData, "whatsapp"),
    email: value(formData, "email"),
    website: value(formData, "website"),
    address: typeof formData.get("address") === "string" ? String(formData.get("address")) : "",
    maps_url: value(formData, "maps_url"),
    note: value(formData, "note"),
    socials: Object.fromEntries(socialNetworks.map((network) => [network, value(formData, `social_${network}`)])),
    active: formData.get("active") === "on",
  };
  const parsed = parseCardForm(values);
  if (!parsed.ok) throw new CardMessage(parsed.message);
  return parsed.value;
}

function chosenPhoto(formData: FormData): File | null {
  const file = formData.get("photo_file");
  return file instanceof File && file.size > 0 ? file : null;
}

/**
 * Checks the image by its first bytes (never the name), redraws it as a 512 px square JPEG (turned the
 * right way up, without the camera's metadata such as the place it was taken), uploads it and gives its
 * public address.
 */
async function uploadPhoto(client: ServiceClient, cardId: string, file: File): Promise<string> {
  if (file.size > photoMaxBytes) throw new CardMessage("A fotografia tem mais de 2 MB. Escolha uma mais pequena.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!imageTypeOf(bytes)) throw new CardMessage("Escolha uma fotografia PNG, JPEG ou WebP.");
  let jpeg: Buffer;
  try {
    jpeg = await sharp(bytes).rotate().resize(cardPhotoSize, cardPhotoSize, { fit: "cover", position: "attention" }).flatten({ background: "#ffffff" }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  } catch {
    throw new CardMessage("Não foi possível abrir esta fotografia. Escolha outra.");
  }
  const path = `${cardId}/${randomBytes(9).toString("base64url")}.jpg`;
  const upload = await client.storage.from(photoBucket).upload(path, jpeg, {
    contentType: "image/jpeg",
    // Every photo has its own name, so the file never changes.
    cacheControl: "31536000",
    upsert: false,
  });
  if (upload.error) {
    console.error("[business-cards] photo upload failed:", upload.error.message);
    throw new CardMessage("Não foi possível guardar a fotografia. Confirme que o bucket «business-card-photos» existe (migração dos cartões).");
  }
  return client.storage.from(photoBucket).getPublicUrl(path).data.publicUrl;
}

/** Deletes an old photo of this card from Storage; a failure only leaves an orphan file. */
async function removeOldPhoto(client: ServiceClient, cardId: string, url: string | null) {
  const marker = `/storage/v1/object/public/${photoBucket}/`;
  const path = url?.includes(marker) ? url.slice(url.indexOf(marker) + marker.length) : null;
  if (!path || !path.startsWith(`${cardId}/`)) return;
  const { error } = await client.storage.from(photoBucket).remove([path]);
  if (error) console.error("[business-cards] photo cleanup failed:", error.message);
}

function slugTaken(error: { code?: string }, slug: string): void {
  if (error.code === "23505") throw new CardMessage(`Já existe um cartão com o endereço «${slug}». Escolha outro.`);
}

/** A new card; opens its page, with the address to program into the card and the QR code. */
export async function createCard(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let created: string | null = null;
  const result = await guarded(async () => {
    const fields = cardFields(formData);
    const client = createServiceClient();
    const { data, error } = await client.from("business_cards").insert(fields).select("id").single();
    if (error) {
      slugTaken(error, fields.slug);
      fail(error, "createCard");
    }
    const id = (data as { id: string }).id;
    const file = chosenPhoto(formData);
    if (file) {
      try {
        const photo_url = await uploadPhoto(client, id, file);
        const update = await client.from("business_cards").update({ photo_url }).eq("id", id);
        if (update.error) fail(update.error, "createCard photo");
      } catch (problem) {
        // The card exists already: open it anyway; the photo can be sent again there.
        console.error("[business-cards] new card without its photo:", problem instanceof Error ? problem.message : problem);
      }
    }
    refreshCards(fields.slug);
    created = id;
    return { ok: true, message: "Cartão criado." };
  });
  if (created) redirect(`/admin/cartoes/${created}?criado=1`);
  return result;
}

export async function updateCard(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const card = await findCard(client, value(formData, "id"));
    const fields = cardFields(formData);
    let photo_url = card.photo_url;
    if (formData.get("remove_photo") === "on") photo_url = null;
    const file = chosenPhoto(formData);
    if (file) photo_url = await uploadPhoto(client, card.id, file);
    if (photo_url && !isPhotoUrl(photo_url)) photo_url = null;
    const { error } = await client
      .from("business_cards")
      .update({ ...fields, photo_url })
      .eq("id", card.id);
    if (error) {
      slugTaken(error, fields.slug);
      fail(error, "updateCard");
    }
    if (card.photo_url !== photo_url) await removeOldPhoto(client, card.id, card.photo_url);
    refreshCards(card.slug, fields.slug);
    return { ok: true, message: "Cartão guardado." };
  });
}

export async function setCardActive(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const card = await findCard(client, value(formData, "id"));
    const active = value(formData, "active") === "true";
    const { error } = await client.from("business_cards").update({ active }).eq("id", card.id);
    if (error) fail(error, "setCardActive");
    refreshCards(card.slug);
    return { ok: true, message: active ? `«${card.name}» ativo.` : `«${card.name}» desativado.` };
  });
}

export async function deleteCard(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let deleted = false;
  const result = await guarded(async () => {
    const client = createServiceClient();
    const card = await findCard(client, value(formData, "id"));
    const { error } = await client.from("business_cards").delete().eq("id", card.id);
    if (error) fail(error, "deleteCard");
    await removeOldPhoto(client, card.id, card.photo_url);
    refreshCards(card.slug);
    deleted = true;
    return { ok: true, message: "Cartão apagado." };
  });
  if (deleted) redirect("/admin/cartoes");
  return result;
}

export type AvailabilityState = "free" | "taken" | "invalid" | "unknown";

/** While typing: is this card address free (another card's, not this one's)? */
export async function checkCardSlug(slug: string, exceptId: string | null): Promise<AvailabilityState> {
  return availability("business_cards", "slug", slug, exceptId, cardSlugProblem);
}

async function availability(
  table: "business_cards" | "keychain_tags",
  column: "slug" | "code",
  input: string,
  exceptId: string | null,
  problem: (value: string) => string | null,
): Promise<AvailabilityState> {
  try {
    await requireAdmin();
  } catch {
    return "unknown";
  }
  const candidate = typeof input === "string" ? input.trim().toLowerCase() : "";
  if (problem(candidate)) return "invalid";
  try {
    let query = createServiceClient().from(table).select("id").eq(column, candidate).limit(1);
    if (exceptId && uuidPattern.test(exceptId)) query = query.neq("id", exceptId);
    const { data, error } = await query;
    if (error) return "unknown";
    return (data ?? []).length ? "taken" : "free";
  } catch {
    return "unknown";
  }
}

// Keychain tags ------------------------------------------------------------------------------------

async function findTag(client: ServiceClient, id: string): Promise<KeychainTagRow> {
  if (!uuidPattern.test(id)) throw new CardMessage("Tag não encontrada.");
  const { data, error } = await client.from("keychain_tags").select(tagColumns).eq("id", id).maybeSingle();
  if (error) fail(error, "findTag");
  if (!data) throw new CardMessage("Esta tag já não existe.");
  return data as KeychainTagRow;
}

function tagFields(formData: FormData) {
  const label = value(formData, "label");
  if (!label) throw new CardMessage("Indique o nome da tag (por exemplo, «Porta-chaves Café Central»).");
  if (label.length > 120) throw new CardMessage("O nome pode ter até 120 caracteres.");
  const code = value(formData, "code").toLowerCase();
  const codeProblem = tagCodeProblem(code);
  if (codeProblem) throw new CardMessage(`Código: ${codeProblem}`);
  const type = value(formData, "destination_type");
  if (!isTagDestinationType(type)) throw new CardMessage("Escolha para onde a tag abre.");
  const destination = buildTagDestination(type, {
    whatsapp: value(formData, "dest_whatsapp"),
    message: value(formData, "dest_message"),
    instagram: value(formData, "dest_instagram"),
    url: value(formData, "dest_url"),
  });
  if (!destination.ok) throw new CardMessage(destination.message);
  return { label, code, destination_type: type, destination_url: destination.value, active: formData.get("active") === "on" };
}

function codeTaken(error: { code?: string }, code: string): void {
  if (error.code === "23505") throw new CardMessage(`Já existe uma tag com o código «${code}». Escolha outro.`);
}

export async function createTag(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let created: string | null = null;
  const result = await guarded(async () => {
    const fields = tagFields(formData);
    const { data, error } = await createServiceClient().from("keychain_tags").insert(fields).select("id").single();
    if (error) {
      codeTaken(error, fields.code);
      fail(error, "createTag");
    }
    refreshTags(fields.code);
    created = (data as { id: string }).id;
    return { ok: true, message: "Tag criada." };
  });
  if (created) redirect(`/admin/tags/${created}?criada=1`);
  return result;
}

export async function updateTag(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const tag = await findTag(client, value(formData, "id"));
    const fields = tagFields(formData);
    const { error } = await client.from("keychain_tags").update(fields).eq("id", tag.id);
    if (error) {
      codeTaken(error, fields.code);
      fail(error, "updateTag");
    }
    refreshTags(tag.code, fields.code);
    return { ok: true, message: "Tag guardada." };
  });
}

export async function setTagActive(_previous: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const client = createServiceClient();
    const tag = await findTag(client, value(formData, "id"));
    const active = value(formData, "active") === "true";
    const { error } = await client.from("keychain_tags").update({ active }).eq("id", tag.id);
    if (error) fail(error, "setTagActive");
    refreshTags(tag.code);
    return { ok: true, message: active ? `«${tag.label}» ativa.` : `«${tag.label}» desativada.` };
  });
}

export async function deleteTag(_previous: ActionState, formData: FormData): Promise<ActionState> {
  let deleted = false;
  const result = await guarded(async () => {
    const client = createServiceClient();
    const tag = await findTag(client, value(formData, "id"));
    const { error } = await client.from("keychain_tags").delete().eq("id", tag.id);
    if (error) fail(error, "deleteTag");
    refreshTags(tag.code);
    deleted = true;
    return { ok: true, message: "Tag apagada." };
  });
  if (deleted) redirect("/admin/tags");
  return result;
}

/** While typing: is this tag code free? */
export async function checkTagCode(code: string, exceptId: string | null): Promise<AvailabilityState> {
  return availability("keychain_tags", "code", code, exceptId, tagCodeProblem);
}
