import { steevanzColors } from "@/lib/brand";
import { iconUrl } from "@/lib/establishments/logo-rules";
import { getEntryByToken } from "@/lib/modules/waitlist/store";
import { publicEstablishment } from "@/lib/modules/public";

/**
 * Web app manifest of one queue ticket: added to the home screen, it opens this ticket. On iPhone
 * that is what allows push notifications (Safari only offers them to pages on the home screen).
 * The icons are the establishment's (logo, or its initials): on iPhone the notifications show it.
 * The service worker's scope (/fila/) covers this ticket's scope, so it controls the installed page.
 */
export async function GET(_request: Request, ctx: RouteContext<"/fila/[slug]/[token]/manifest.webmanifest">) {
  const { slug, token } = await ctx.params;
  const establishment = await publicEstablishment(slug, "waitlist");
  const entry = establishment ? await getEntryByToken(token) : null;
  if (!establishment || !entry || entry.establishment_id !== establishment.id) return new Response("Not found", { status: 404 });
  const url = `/fila/${slug}/${token}`;
  const logo = establishment.logo_path;
  return Response.json(
    {
      id: url,
      name: `Senha ${establishment.name}`,
      short_name: establishment.name.slice(0, 20),
      start_url: url,
      scope: url,
      display: "standalone",
      background_color: "#fbf7f1",
      theme_color: steevanzColors.accent,
      lang: "pt-PT",
      icons: [
        { src: iconUrl(slug, 192, logo), sizes: "192x192", type: "image/png", purpose: "any" },
        { src: iconUrl(slug, 512, logo), sizes: "512x512", type: "image/png", purpose: "any" },
        { src: iconUrl(slug, 192, logo, true), sizes: "192x192", type: "image/png", purpose: "maskable" },
        { src: iconUrl(slug, 512, logo, true), sizes: "512x512", type: "image/png", purpose: "maskable" },
        { src: iconUrl(slug, 180, logo), sizes: "180x180", type: "image/png" },
      ],
      description: `Senha da fila ${establishment.name}`,
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, no-store" } },
  );
}
