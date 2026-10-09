import { steevanzColors } from "@/lib/brand";
import { getEntryByToken } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

/**
 * Web app manifest of one queue ticket: added to the home screen, it opens this ticket. On iPhone
 * that is what allows push notifications (Safari only offers them to pages on the home screen).
 */
export async function GET(_request: Request, ctx: RouteContext<"/fila/[slug]/[token]/manifest.webmanifest">) {
  const { slug, token } = await ctx.params;
  const establishment = await publicEstablishment(slug, "waitlist");
  const entry = establishment ? await getEntryByToken(token) : null;
  if (!establishment || !entry || entry.establishment_id !== establishment.id) return new Response("Not found", { status: 404 });
  const url = `/fila/${slug}/${token}`;
  return Response.json(
    {
      name: `Senha ${establishment.name}`,
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
      description: `Senha da fila ${establishment.name}`,
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, no-store" } },
  );
}
