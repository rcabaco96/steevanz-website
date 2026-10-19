import { bunnyConfig, bunnyStatus, scheduleBunnyVideoDeletion, setSmallBunnyThumbnail, verifyBunnyWebhook } from "@/lib/bunny";
import { bunnyDishColumns, dishesTable, refreshDishMenu, type BunnyDishRow } from "@/lib/video-menus/bunny-dishes";

/**
 * Bunny Stream's webhook (library-wide): a dish's pending video moves on as Bunny encodes it.
 * Finished (3): it gets its small picture and becomes the dish's video, its menu's pages are refreshed, and
 * the previous Bunny video is deleted a day later (pages already open still show it). Failed (5, 8):
 * marked failed. Created, uploaded, processing, upload finished (0, 1, 2, 7): processing. Anything
 * else, an unknown video or a bad signature is ignored. Always answers 200 (Bunny would retry).
 */
export async function POST(request: Request) {
  const ok = () => new Response(null, { status: 200 });
  const raw = await request.text();
  if (!verifyBunnyWebhook(raw, request.headers)) {
    console.warn("[bunny] webhook with an invalid signature ignored");
    return ok();
  }
  let event: { VideoLibraryId?: number | string; VideoGuid?: string; Status?: number };
  try {
    event = JSON.parse(raw);
  } catch {
    return ok();
  }
  const libraryId = bunnyConfig()?.libraryId;
  if (!event.VideoGuid || typeof event.Status !== "number" || String(event.VideoLibraryId) !== libraryId) return ok();

  try {
    const { data: dish, error } = await dishesTable().select(bunnyDishColumns).eq("pending_video_id", event.VideoGuid).maybeSingle<BunnyDishRow>();
    if (error) throw new Error(error.message);
    if (!dish) return ok();

    if (event.Status === bunnyStatus.finished) {
      const previous = dish.bunny_video_id;
      // Without it, the menu shows Bunny's full-size thumbnail: never a reason to hold the video back.
      const thumbnail = await setSmallBunnyThumbnail(event.VideoGuid).catch((reason) => {
        console.warn("[bunny] small thumbnail not set:", reason instanceof Error ? reason.message : reason);
        return null;
      });
      const saved = await dishesTable()
        .update({ bunny_video_id: event.VideoGuid, bunny_thumbnail: thumbnail, pending_video_id: null, pending_video_status: null })
        .eq("id", dish.id)
        .eq("pending_video_id", event.VideoGuid);
      if (saved.error) throw new Error(saved.error.message);
      refreshDishMenu(dish);
      if (previous && previous !== event.VideoGuid) await scheduleBunnyVideoDeletion(previous).catch((reason) => console.warn("[bunny] old video not marked for deletion:", reason instanceof Error ? reason.message : reason));
      return ok();
    }
    const failed: number[] = [bunnyStatus.failed, bunnyStatus.presignedUploadFailed];
    const working: number[] = [bunnyStatus.created, bunnyStatus.uploaded, bunnyStatus.processing, bunnyStatus.presignedUploadFinished];
    // «Created» (0) arrives right after the admin creates the video, before the file is sent: it must
    // not end the «uploading» state, which is what lets an interrupted upload resume.
    const stillUploading = event.Status === bunnyStatus.created && dish.pending_video_status === "uploading";
    const status = failed.includes(event.Status) ? "failed" : working.includes(event.Status) && !stillUploading ? "processing" : null;
    if (status && dish.pending_video_status !== status) {
      const saved = await dishesTable().update({ pending_video_status: status }).eq("id", dish.id).eq("pending_video_id", event.VideoGuid);
      if (saved.error) throw new Error(saved.error.message);
      refreshDishMenu(dish);
    }
  } catch (reason) {
    console.error("[bunny] webhook failed:", reason instanceof Error ? reason.message : reason);
  }
  return ok();
}
