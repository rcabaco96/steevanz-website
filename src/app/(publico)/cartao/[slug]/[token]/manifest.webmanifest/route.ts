import { steevanzColors } from "@/lib/brand";
import { getCardByToken } from "@/lib/modules/loyalty/store";
import { publicEstablishment } from "@/lib/modules/public";

/** Web app manifest of one loyalty card: installed on the home screen, it opens this card. */
export async function GET(_request: Request, ctx: RouteContext<"/cartao/[slug]/[token]/manifest.webmanifest">) {
  const { slug, token } = await ctx.params;
  const establishment = await publicEstablishment(slug, "loyalty");
  const card = establishment ? await getCardByToken(token) : null;
  if (!establishment || !card || card.establishment_id !== establishment.id) return new Response("Not found", { status: 404 });
  const url = `/cartao/${slug}/${token}`;
  return Response.json(
    {
      name: `Cartão ${establishment.name}`,
      short_name: establishment.name.slice(0, 20),
      start_url: url,
      scope: url,
      display: "standalone",
      background_color: "#fbf7f1",
      theme_color: steevanzColors.accent,
      lang: "pt-PT",
      icons: [
        { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
      description: `Cartão de cliente ${establishment.name}`,
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, no-store" } },
  );
}
