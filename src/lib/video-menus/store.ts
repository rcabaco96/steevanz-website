import { unstable_cache } from "next/cache";
import type { VideoMenuData } from "@/content/demo-menu";
import { createServiceClient } from "@/lib/supabase/service";
import { toVideoMenuData, type VideoMenuCollectionRow, type VideoMenuDishRow, type VideoMenuLinkRow, type VideoMenuRow } from "./rules";

// Reads of the video menus (service role: RLS lets nothing else in). The admin reads fresh rows;
// the public pages read through the cache below, refreshed by every save in the admin.

export const menuColumns = "id, slug, business_name, logo_url, instagram, review_business_id, active, created_at, updated_at";
const dishColumns = "id, menu_id, video_id, name, description, price_cents, position, bunny_video_id, pending_video_id, pending_video_status";
const collectionColumns = "id, menu_id, name, position, is_default";

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Every cached public menu carries this tag, plus its own slug's. */
export const menusCacheTag = "video-menus";
export function menuCacheTag(slug: string): string {
  return `video-menu:${slug}`;
}

/** The tables of this feature aren't in the database yet (the migration hasn't been applied). */
export class MenusNotReadyError extends Error {
  constructor() {
    super("video menu tables missing");
    this.name = "MenusNotReadyError";
  }
}

function fail(error: { code?: string; message: string }, context: string): never {
  if (error.code === "PGRST205" || error.code === "42P01") throw new MenusNotReadyError();
  throw new Error(`${context}: ${error.message}`);
}

export interface AdminMenuListItem extends VideoMenuRow {
  dishCount: number;
  collectionCount: number;
}

export async function listMenus(): Promise<AdminMenuListItem[]> {
  const { data, error } = await createServiceClient()
    .from("video_menus")
    .select(`${menuColumns}, video_menu_dishes(count), video_menu_collections(count)`)
    .order("business_name");
  if (error) fail(error, "listMenus");
  type Row = VideoMenuRow & { video_menu_dishes: { count: number }[]; video_menu_collections: { count: number }[] };
  return ((data ?? []) as Row[]).map(({ video_menu_dishes, video_menu_collections, ...menu }) => ({
    ...menu,
    dishCount: video_menu_dishes[0]?.count ?? 0,
    collectionCount: video_menu_collections[0]?.count ?? 0,
  }));
}

export interface AdminMenu {
  menu: VideoMenuRow;
  dishes: VideoMenuDishRow[];
  collections: VideoMenuCollectionRow[];
  links: VideoMenuLinkRow[];
}

async function loadMenuParts(menu: VideoMenuRow): Promise<AdminMenu> {
  const client = createServiceClient();
  const [dishes, collections, links] = await Promise.all([
    client.from("video_menu_dishes").select(dishColumns).eq("menu_id", menu.id).order("position").order("created_at"),
    client.from("video_menu_collections").select(collectionColumns).eq("menu_id", menu.id).order("position").order("created_at"),
    client.from("video_menu_collection_dishes").select("collection_id, dish_id, position").eq("menu_id", menu.id).order("position"),
  ]);
  for (const result of [dishes, collections, links]) if (result.error) fail(result.error, "loadMenuParts");
  return {
    menu,
    dishes: (dishes.data ?? []) as VideoMenuDishRow[],
    collections: (collections.data ?? []) as VideoMenuCollectionRow[],
    links: (links.data ?? []) as VideoMenuLinkRow[],
  };
}

/** Admin: one menu with everything in it, or null when the id doesn't exist. */
export async function getAdminMenu(id: string): Promise<AdminMenu | null> {
  if (!uuidPattern.test(id)) return null;
  const { data, error } = await createServiceClient().from("video_menus").select(menuColumns).eq("id", id).maybeSingle();
  if (error) fail(error, "getAdminMenu");
  return data ? loadMenuParts(data as VideoMenuRow) : null;
}

/** Review businesses the menu may be linked to (optional; to know whose menu it is). */
export async function listReviewBusinessOptions(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await createServiceClient().from("review_businesses").select("id, name").order("name");
  if (error) throw new Error(`listReviewBusinessOptions: ${error.message}`);
  return (data ?? []) as { id: string; name: string }[];
}

/**
 * Public: the active menu with this slug, in the player's shape; null when it doesn't exist, is
 * inactive or has no dish yet. Throws when the database can't be read (nothing is cached then), so
 * the page can decide what to show. Cached for an hour at most; the admin refreshes it on every save.
 */
export function getPublicMenu(slug: string): Promise<VideoMenuData | null> {
  return unstable_cache(
    async () => {
      const { data, error } = await createServiceClient().from("video_menus").select(menuColumns).eq("slug", slug).eq("active", true).maybeSingle();
      if (error) fail(error, "getPublicMenu");
      if (!data) return null;
      const parts = await loadMenuParts(data as VideoMenuRow);
      return toVideoMenuData(parts.menu, parts.dishes, parts.collections, parts.links);
    },
    ["video-menu", slug],
    { tags: [menusCacheTag, menuCacheTag(slug)], revalidate: 3600 },
  )();
}
