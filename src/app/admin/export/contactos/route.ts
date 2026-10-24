import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { vcard, vcards, type ContactCardFields } from "@/lib/prospects/crm";
import { createServiceClient } from "@/lib/supabase/service";

const columns = "name, phone, email, other_emails, website, address, maps_url, category";

async function cards(placeIds: string[]): Promise<ContactCardFields[]> {
  const client = createServiceClient();
  const found: ContactCardFields[] = [];
  for (let index = 0; index < placeIds.length; index += 200) {
    const { data, error } = await client.from("prospects").select(columns).in("place_id", placeIds.slice(index, index + 200));
    if (error) throw new Error(error.message);
    found.push(...((data ?? []) as ContactCardFields[]).map((row) => ({ ...row, other_emails: row.other_emails ?? [] })));
  }
  return found;
}

function card(body: string, filename: string, disposition: "inline" | "attachment") {
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/** One business as a contact card: on the phone it opens «Novo contacto» («Negócio · Lead Steevanz»). */
export async function GET(request: NextRequest) {
  const context = await getAdminContext();
  if (context.state !== "admin") return new Response("Não autorizado", { status: 401 });
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (id.length < 3 || id.length > 300) return new Response("Pedido inválido", { status: 400 });
  try {
    const [prospect] = await cards([id]);
    if (!prospect) return new Response("Negócio não encontrado", { status: 404 });
    return card(`${vcard(prospect)}\r\n`, "lead-steevanz.vcf", "inline");
  } catch (error) {
    console.error("[admin] contact card failed:", error instanceof Error ? error.message : error);
    return new Response("Erro ao preparar o contacto", { status: 500 });
  }
}

/** The businesses on screen (ids sent by the CRM board) as one file: opening it on the phone adds them all. */
export async function POST(request: NextRequest) {
  const context = await getAdminContext();
  if (context.state !== "admin") return new Response("Não autorizado", { status: 401 });
  try {
    const form = await request.formData();
    const ids = [...new Set(String(form.get("ids") ?? "").split(",").map((id) => id.trim()).filter((id) => id.length >= 3 && id.length <= 300))].slice(0, 3000);
    if (!ids.length) return new Response("Sem negócios", { status: 400 });
    // Same rule as the board's «Guardar contactos (N)»: a phone or any email.
    const found = (await cards(ids)).filter((row) => row.phone || row.email || row.other_emails.length);
    if (!found.length) return new Response("Nenhum destes negócios tem telefone ou email", { status: 404 });
    return card(vcards(found), `leads-steevanz-${found.length}.vcf`, "attachment");
  } catch (error) {
    console.error("[admin] contact cards failed:", error instanceof Error ? error.message : error);
    return new Response("Erro ao preparar os contactos", { status: 500 });
  }
}
