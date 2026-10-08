import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { establishmentHasProduct, getEstablishmentBySlug } from "@/lib/establishments/store";
import { normalizeCardCode } from "@/lib/modules/loyalty/rules";

/**
 * Where the QR on a customer's loyalty card points. Staff scan it with the shop's phone or tablet
 * (any camera app): signed in as the owner or an admin, it opens the Balcão on that card, ready
 * for "Dar carimbo". Signed out, it asks to sign in first; signed in as another client, it
 * opens the public card page. The QR only carries the card code, which is not a secret: the stamp
 * still needs the staff session.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("espaco") ?? "";
  const code = normalizeCardCode(request.nextUrl.searchParams.get("cartao") ?? "");
  const establishment = /^[a-z0-9-]{1,60}$/.test(slug) ? await getEstablishmentBySlug(slug) : null;
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url));
  if (!establishment || code.length !== 6) return to("/");

  const query = new URLSearchParams({ loja: establishment.slug, vista: "cartao", q: code });
  const session = await getSession();
  if (session.state === "admin") return to(`/admin/clientes/${establishment.owner_id}/balcao?${query}`);
  if (session.state === "client" && session.user.id === establishment.owner_id && (await establishmentHasProduct(establishment, "loyalty"))) {
    return to(`/conta/balcao?${query}`);
  }
  if (session.state === "anonymous") {
    return to(`/conta/entrar?${new URLSearchParams({ next: `${request.nextUrl.pathname}${request.nextUrl.search}` })}`);
  }
  return to(`/cartao/${establishment.slug}`);
}
