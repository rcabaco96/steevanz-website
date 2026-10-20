import { unstable_cache } from "next/cache";
import { cache } from "react";
import sharp from "sharp";
import { getBusinessCard, type BusinessCard } from "@/content/business-cards";
import type { VCardPhoto } from "@/lib/business-card/vcard";
import { createServiceClient, SupabaseNotConfiguredError } from "@/lib/supabase/service";
import {
  cardColumns,
  cardSlugProblem,
  cardWithFallback,
  safeTagDestination,
  tagCodeProblem,
  tagColumns,
  type BusinessCardRow,
  type KeychainTagRow,
} from "./rules";

// Reads of the business cards and keychain tags (service role: RLS lets nothing else in). The admin
// reads fresh rows; the public pages read through the caches below, refreshed by every save in the
// admin. Until the migration (20261020210000_business_cards_keychains.sql) is applied, the cards come
// from src/content/business-cards.ts and the tags don't exist.

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const cardsCacheTag = "business-cards";
export function cardCacheTag(slug: string): string {
  return `business-card:${slug}`;
}

export const tagsCacheTag = "keychain-tags";
export function tagCacheTag(code: string): string {
  return `keychain-tag:${code}`;
}

/** The tables of this feature aren't in the database yet (the migration hasn't been applied). */
export class CardsNotReadyError extends Error {
  constructor() {
    super("business card tables missing");
    this.name = "CardsNotReadyError";
  }
}

export function isMissingTable(error: { code?: string }): boolean {
  return error.code === "PGRST205" || error.code === "42P01";
}

function fail(error: { code?: string; message: string }, context: string): never {
  if (isMissingTable(error)) throw new CardsNotReadyError();
  throw new Error(`${context}: ${error.message}`);
}

// Public -------------------------------------------------------------------------------------------

/** The active card's row, cached for an hour at most (each save refreshes it at once). Throws when unreadable. */
function cachedCardRow(slug: string): Promise<BusinessCardRow | null> {
  return unstable_cache(
    async () => {
      const { data, error } = await createServiceClient().from("business_cards").select(cardColumns).eq("slug", slug).eq("active", true).maybeSingle();
      if (error) fail(error, "getPublicCard");
      return (data as BusinessCardRow | null) ?? null;
    },
    ["business-card", "v1", slug],
    { tags: [cardsCacheTag, cardCacheTag(slug)], revalidate: 3600 },
  )();
}

/**
 * Public: the active card with this slug, or null. Before the migration (no table, or no database in
 * this environment) the content file answers, so the example card keeps working. Any other failure also
 * falls back to the content file when it has the card, else it throws (an error is never cached as a 404).
 */
export const loadPublicCard = cache(async (slug: string): Promise<BusinessCard | null> => {
  if (cardSlugProblem(slug)) return null;
  return cardWithFallback(
    () => cachedCardRow(slug),
    getBusinessCard(slug),
    (error) => error instanceof CardsNotReadyError || error instanceof SupabaseNotConfiguredError,
    (error) => console.error("[business-cards] card read failed:", error instanceof Error ? error.message : error),
  );
});

/**
 * The card's photo for the contact file: a small JPEG on cream (round PNGs have transparent corners;
 * contacts crop it round again). Cached a day per address (uploaded photos never change at the same
 * address). Undefined when it can't be fetched: the contact still saves.
 */
export async function vcardPhoto(absoluteUrl: string): Promise<VCardPhoto | undefined> {
  try {
    const base64 = await unstable_cache(
      async () => {
        const response = await fetch(absoluteUrl, { signal: AbortSignal.timeout(5000), cache: "no-store" });
        if (!response.ok) throw new Error(`photo ${response.status}`);
        const source = Buffer.from(await response.arrayBuffer());
        const jpeg = await sharp(source).rotate().resize(240, 240, { fit: "cover" }).flatten({ background: "#fbf7f1" }).jpeg({ quality: 82 }).toBuffer();
        return jpeg.toString("base64");
      },
      ["business-card-vcard-photo", "v1", absoluteUrl],
      { revalidate: 86400 },
    )();
    return { base64, type: "JPEG" };
  } catch (error) {
    console.warn("[business-cards] vcard photo skipped:", error instanceof Error ? error.message : error);
    return undefined;
  }
}

/** Where /k/<code> sends people: the active tag's checked destination, or null. Cached like the cards. */
function cachedTagDestination(code: string): Promise<string | null> {
  return unstable_cache(
    async () => {
      const { data, error } = await createServiceClient().from("keychain_tags").select("destination_type, destination_url").eq("code", code).eq("active", true).maybeSingle();
      if (error) fail(error, "getTagDestination");
      const row = data as Pick<KeychainTagRow, "destination_type" | "destination_url"> | null;
      return row ? safeTagDestination(row.destination_type, row.destination_url) : null;
    },
    ["keychain-tag", "v1", code],
    { tags: [tagsCacheTag, tagCacheTag(code)], revalidate: 3600 },
  )();
}

/** Public: the destination of /k/<code>, or null (unknown, off, unsafe, or no table yet). */
export async function loadTagDestination(code: string): Promise<string | null> {
  if (tagCodeProblem(code)) return null;
  try {
    return await cachedTagDestination(code);
  } catch (error) {
    if (error instanceof CardsNotReadyError || error instanceof SupabaseNotConfiguredError) return null;
    throw error;
  }
}

/** One tap counted (best effort; never slows or breaks the redirect). */
export async function countTagTap(code: string): Promise<void> {
  try {
    const { error } = await createServiceClient().rpc("keychain_tag_tap", { tag_code: code });
    if (error && !isMissingTable(error)) console.warn("[keychain-tags] tap not counted:", error.message);
  } catch (error) {
    console.warn("[keychain-tags] tap not counted:", error instanceof Error ? error.message : error);
  }
}

// Admin --------------------------------------------------------------------------------------------

export async function listCards(): Promise<BusinessCardRow[]> {
  const { data, error } = await createServiceClient().from("business_cards").select(cardColumns).order("name");
  if (error) fail(error, "listCards");
  return (data ?? []) as BusinessCardRow[];
}

export async function getAdminCard(id: string): Promise<BusinessCardRow | null> {
  if (!uuidPattern.test(id)) return null;
  const { data, error } = await createServiceClient().from("business_cards").select(cardColumns).eq("id", id).maybeSingle();
  if (error) fail(error, "getAdminCard");
  return (data as BusinessCardRow | null) ?? null;
}

export async function listTags(): Promise<KeychainTagRow[]> {
  const { data, error } = await createServiceClient().from("keychain_tags").select(tagColumns).order("label");
  if (error) fail(error, "listTags");
  return (data ?? []) as KeychainTagRow[];
}

export async function getAdminTag(id: string): Promise<KeychainTagRow | null> {
  if (!uuidPattern.test(id)) return null;
  const { data, error } = await createServiceClient().from("keychain_tags").select(tagColumns).eq("id", id).maybeSingle();
  if (error) fail(error, "getAdminTag");
  return (data as KeychainTagRow | null) ?? null;
}
