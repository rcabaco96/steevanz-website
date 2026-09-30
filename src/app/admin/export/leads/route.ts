import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { leadsCsv } from "@/lib/admin/csv";
import { listLeads, parseFilters } from "@/lib/admin/queries";
import { zonedDateString } from "@/lib/booking/slots";
import { site } from "@/lib/site";

export async function GET(request: NextRequest) {
  const context = await getAdminContext();
  if (context.state !== "admin") return new Response("Não autorizado", { status: 401 });
  try {
    const rows = await listLeads(parseFilters(request.nextUrl.searchParams), true);
    const fileName = `steevanz-pedidos-${zonedDateString(new Date(), site.timeZone)}.csv`;
    return new Response(leadsCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("[admin] export leads failed:", error instanceof Error ? error.message : error);
    return new Response("Erro ao exportar", { status: 500 });
  }
}
