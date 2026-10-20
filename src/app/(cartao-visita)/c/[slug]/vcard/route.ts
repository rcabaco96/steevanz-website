import { buildVCard, vcardFileName } from "@/lib/business-card/vcard";
import { loadPublicCard, vcardPhoto } from "@/lib/business-cards/store";

// «Guardar contacto»: the card owner's contact file, made on request from the card (database or content
// file) with the photo inside. The card and the photo come from caches, so it stays fast.
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const card = await loadPublicCard((await params).slug);
  if (!card) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } });
  // A site path ("/assinatura/foto.png") is fetched from this same site; uploaded photos by their address.
  const photo = card.photo ? await vcardPhoto(new URL(card.photo.src, request.url).toString()) : undefined;
  return new Response(buildVCard(card, photo), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${vcardFileName(card)}"`,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
