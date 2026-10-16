import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { requestOrigin } from "@/lib/booking/request";
import { createServiceClient } from "@/lib/supabase/service";
import { tablePath } from "@/lib/video-menus/ordering-rules";
import { slugFromName } from "@/lib/video-menus/rules";
import { uuidPattern } from "@/lib/video-menus/store";

/**
 * Admin: the QR code of a table's link, to print on its plate. ?formato=svg (crisp at any size) or
 * png (1024 px), downloaded as «<menu>-<mesa>.svg|png».
 */
export async function GET(request: Request, ctx: RouteContext<"/api/admin/mesas/[tableId]/qr">) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAccessError) return NextResponse.json({ error: "Sessão expirada ou sem permissão. Entre novamente." }, { status: 401 });
    throw error;
  }
  const { tableId } = await ctx.params;
  if (!uuidPattern.test(tableId)) return NextResponse.json({ error: "Mesa não encontrada." }, { status: 404 });
  const { data, error } = await createServiceClient().from("video_menu_tables").select("name, token, video_menus(slug)").eq("id", tableId).maybeSingle();
  if (error) {
    console.error("[ordering] qr lookup failed:", error.message);
    return NextResponse.json({ error: "Ocorreu um erro. Tente novamente." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Mesa não encontrada." }, { status: 404 });
  const table = data as unknown as { name: string; token: string; video_menus: { slug: string } | null };
  const url = `${await requestOrigin()}${tablePath(table.token)}`;
  const fileName = [table.video_menus?.slug, slugFromName(table.name)].filter(Boolean).join("-") || "mesa";
  const headers = { "Cache-Control": "private, no-store" };
  if (new URL(request.url).searchParams.get("formato") === "png") {
    const png = await QRCode.toBuffer(url, { type: "png", errorCorrectionLevel: "M", margin: 2, width: 1024, color: { dark: "#1d1220", light: "#ffffff" } });
    return new NextResponse(new Uint8Array(png), { headers: { ...headers, "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${fileName}.png"` } });
  }
  const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: { dark: "#1d1220", light: "#ffffff" } });
  return new NextResponse(svg, { headers: { ...headers, "Content-Type": "image/svg+xml", "Content-Disposition": `attachment; filename="${fileName}.svg"` } });
}
