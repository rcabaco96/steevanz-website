import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { bunnyConfig, deleteBunnyVideo, dueBunnyDeletions } from "@/lib/bunny";
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

/**
 * Scheduler tick (every 15 minutes): deletes from Bunny the old videos whose day has passed
 * (bunny-cleanup-rules), unless a dish uses one again. Best effort: one left over only takes space.
 */
export async function cleanupBunnyVideos(options: { now: Date; dryRun: boolean }) {
  if (!bunnyConfig()) return null;
  const due = await dueBunnyDeletions(options.now);
  if (!due.length) return { due: 0, deleted: 0 };
  const list = due.join(",");
  const { data, error } = await dishesTable().select("bunny_video_id, pending_video_id").or(`bunny_video_id.in.(${list}),pending_video_id.in.(${list})`);
  if (error) throw new Error(`bunny cleanup: ${error.message}`);
  const used = new Set(((data ?? []) as { bunny_video_id: string | null; pending_video_id: string | null }[]).flatMap((row) => [row.bunny_video_id, row.pending_video_id]));
  const free = due.filter((video) => !used.has(video));
  if (options.dryRun) return { due: due.length, inUse: due.length - free.length, deleted: 0 };
  let deleted = 0;
  for (const video of free) {
    try {
      await deleteBunnyVideo(video);
      deleted += 1;
    } catch (reason) {
      console.warn("[bunny] old video not deleted:", video, reason instanceof Error ? reason.message : reason);
    }
  }
  return { due: due.length, inUse: due.length - free.length, deleted };
}
