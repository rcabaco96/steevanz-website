import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { toCsv } from "@/lib/admin/csv";
import { zonedDateString } from "@/lib/booking/slots";
import { prospectStatusLabels, reasons } from "@/lib/prospects/rules";
import { listProspects, parseProspectFilters } from "@/lib/prospects/store";
import { site } from "@/lib/site";

/** The prospects on screen (same filters) as a spreadsheet, for calling down the list. */
export async function GET(request: NextRequest) {
  const context = await getAdminContext();
  if (context.state !== "admin") return new Response("Não autorizado", { status: 401 });
  try {
    const rows = await listProspects(parseProspectFilters(Object.fromEntries(request.nextUrl.searchParams)), 2000);
    const csv = toCsv(
      ["Nome", "Categoria", "Nota", "Reviews", "Telefone", "Email", "Site", "Morada", "O que lhe podemos vender", "Notas sobre o negócio", "Estado", "Notas", "Google Maps"],
      rows.map((row) => [
        row.name,
        row.category,
        row.rating,
        row.reviews,
        row.phone,
        row.email,
        row.website,
        row.address,
        reasons(row).filter((reason) => !reason.note).map((reason) => reason.text).join("; "),
        reasons(row).filter((reason) => reason.note).map((reason) => reason.text).join("; "),
        prospectStatusLabels[row.status],
        row.notes,
        row.maps_url,
      ]),
    );
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="steevanz-prospecao-${zonedDateString(new Date(), site.timeZone)}.csv"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("[admin] export prospects failed:", error instanceof Error ? error.message : error);
    return new Response("Erro ao exportar", { status: 500 });
  }
}
