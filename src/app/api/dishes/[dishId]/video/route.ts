import { NextResponse } from "next/server";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { BunnyError, bunnyConfig, createBunnyVideo, deleteBunnyVideo, signBunnyUpload } from "@/lib/bunny";
import { bunnyDishColumns, dishesTable, type BunnyDishRow } from "@/lib/video-menus/bunny-dishes";
import { uuidPattern } from "@/lib/video-menus/store";

/**
 * Admin: starts (or resumes) the upload of a dish's own video to Bunny Stream and answers the TUS
 * credentials. An upload still marked «uploading» is signed again for the same video (so it can
 * resume); otherwise a stale pending video is deleted and a new one created. The dish's YouTube
 * video stays as it is: the Bunny one only replaces it on the menu once it's ready (webhook).
 */
export async function POST(_request: Request, ctx: RouteContext<"/api/dishes/[dishId]/video">) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAccessError) return NextResponse.json({ error: "Sessão expirada ou sem permissão. Entre novamente." }, { status: 401 });
    throw error;
  }
  if (!bunnyConfig()) return NextResponse.json({ error: "O envio de vídeos ainda não está configurado." }, { status: 503 });

  const { dishId } = await ctx.params;
  if (!uuidPattern.test(dishId)) return NextResponse.json({ error: "Prato não encontrado." }, { status: 404 });
  const { data, error } = await dishesTable().select(bunnyDishColumns).eq("id", dishId).maybeSingle<BunnyDishRow>();
  if (error) {
    console.error("[bunny] dish lookup failed:", error.message);
    return NextResponse.json({ error: "Ocorreu um erro. Tente novamente." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Prato não encontrado." }, { status: 404 });

  try {
    if (data.pending_video_status === "uploading" && data.pending_video_id) {
      return NextResponse.json(signBunnyUpload(data.pending_video_id));
    }
    // A previous pending video (processing, failed) is replaced by this new upload.
    if (data.pending_video_id) await deleteBunnyVideo(data.pending_video_id).catch((reason) => console.warn("[bunny] old pending not deleted:", reason instanceof Error ? reason.message : reason));
    const title = [data.video_menus?.business_name, data.name].filter(Boolean).join(" · ");
    const videoId = await createBunnyVideo(title);
    const saved = await dishesTable().update({ pending_video_id: videoId, pending_video_status: "uploading" }).eq("id", data.id);
    if (saved.error) {
      await deleteBunnyVideo(videoId).catch(() => {});
      throw new Error(`save pending: ${saved.error.message}`);
    }
    return NextResponse.json(signBunnyUpload(videoId));
  } catch (reason) {
    console.error("[bunny] upload start failed:", reason instanceof Error ? reason.message : reason);
    const message = reason instanceof BunnyError ? "O Bunny não respondeu. Tente novamente." : "Ocorreu um erro. Tente novamente.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
