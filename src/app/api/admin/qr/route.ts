import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { AdminAccessError, requireAdmin } from "@/lib/admin/auth";
import { programOrigin } from "@/lib/business-cards/rules";

/**
 * Admin: the QR code of a business card (/c/<slug>) or a tag (/k/<code>), always with the production
 * address, to print. ?formato=svg (crisp at any size) or png (2048 px), downloaded as
 * «cartao-<slug>.svg|png» or «tag-<code>.svg|png».
 */
const pathPattern = /^\/(c|k)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAccessError) return NextResponse.json({ error: "Sessão expirada ou sem permissão. Entre novamente." }, { status: 401 });
    throw error;
  }
  const params = new URL(request.url).searchParams;
  const match = pathPattern.exec(params.get("caminho") ?? "");
  if (!match || match[2].length > 60) return NextResponse.json({ error: "Endereço inválido." }, { status: 400 });
  const url = `${programOrigin}${match[0]}`;
  const fileName = `${match[1] === "c" ? "cartao" : "tag"}-${match[2]}`;
  const headers = { "Cache-Control": "private, no-store" };
  const colors = { dark: "#1d1220", light: "#ffffff" };
  if (params.get("formato") === "png") {
    const png = await QRCode.toBuffer(url, { type: "png", errorCorrectionLevel: "M", margin: 2, width: 2048, color: colors });
    return new NextResponse(new Uint8Array(png), { headers: { ...headers, "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${fileName}.png"` } });
  }
  const svg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: colors });
  return new NextResponse(svg, { headers: { ...headers, "Content-Type": "image/svg+xml", "Content-Disposition": `attachment; filename="${fileName}.svg"` } });
}
