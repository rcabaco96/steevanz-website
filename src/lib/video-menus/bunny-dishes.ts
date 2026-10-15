import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { menuPaths } from "./rules";
import { menuCacheTag } from "./store";

/** A dish with what the Bunny upload flow needs (and its menu, to name the video and refresh pages). */
export interface BunnyDishRow {
  id: string;
  menu_id: string;
  name: string;
  bunny_video_id: string | null;
  pending_video_id: string | null;
  pending_video_status: "uploading" | "processing" | "failed" | null;
  video_menus: { slug: string; business_name: string } | null;
}

export const bunnyDishColumns = "id, menu_id, name, bunny_video_id, pending_video_id, pending_video_status, video_menus(slug, business_name)";

export function dishesTable() {
  return createServiceClient().from("video_menu_dishes");
}

/** After a dish's video changes: its menu's public pages and the admin pages show it at once. */
export function refreshDishMenu(dish: Pick<BunnyDishRow, "menu_id" | "video_menus">) {
  const slug = dish.video_menus?.slug;
  if (slug) {
    revalidateTag(menuCacheTag(slug), { expire: 0 });
    for (const path of menuPaths(slug)) revalidatePath(path);
  }
  revalidatePath(`/admin/menus/${dish.menu_id}`);
}
