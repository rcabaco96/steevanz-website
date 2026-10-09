import { ImageResponse } from "next/og";
import { getEstablishmentBySlug } from "@/lib/establishments/store";
import { iconColor, iconSize, imageTypeOf, initialsOf, logoPublicUrl, ownsLogoPath } from "@/lib/establishments/logo-rules";
import { publicSupabaseConfig } from "@/lib/supabase/env";

/** The logo as a data URL for the renderer, or null (no logo, unreadable, or not PNG/JPEG). */
async function logoData(path: string): Promise<string | null> {
  const config = publicSupabaseConfig();
  if (!config) return null;
  try {
    const response = await fetch(logoPublicUrl(config.url, path), { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const type = imageTypeOf(bytes);
    if (type !== "png" && type !== "jpeg") return null;
    return `data:image/${type};base64,${Buffer.from(bytes).toString("base64")}`;
  } catch (error) {
    console.error("[waitlist] logo fetch failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * The queue ticket's icon: home screen (apple-touch-icon, manifest) and notifications. With a logo,
 * the logo on white with room around it (iPhone rounds the corners, Android may cut a circle from
 * the "maskable" one, ?m=1); without one, the establishment's initials on its colour.
 * The ?v= of the links changes with each logo, so the long cache never shows an old one.
 */
export async function GET(request: Request, ctx: RouteContext<"/fila/[slug]/icon/[size]">) {
  const { slug, size: sizeParam } = await ctx.params;
  const size = iconSize(sizeParam);
  const establishment = size ? await getEstablishmentBySlug(slug) : null;
  if (!size || !establishment) return new Response("Not found", { status: 404 });
  const maskable = new URL(request.url).searchParams.get("m") === "1";
  const logo = ownsLogoPath(establishment.id, establishment.logo_path) ? await logoData(establishment.logo_path) : null;
  // A logo that failed to load is retried soon; otherwise the icon only changes with a new ?v=.
  const maxAge = establishment.logo_path && !logo ? 60 : 6 * 3600;
  const headers = { "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=86400` };

  if (logo) {
    const padding = Math.round(size * (maskable ? 0.22 : 0.12));
    const inner = size - padding * 2;
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- drawn into a PNG, not a page */}
          <img src={logo} width={inner} height={inner} style={{ width: inner, height: inner, objectFit: "contain" }} />
        </div>
      ),
      { width: size, height: size, headers },
    );
  }

  const initials = initialsOf(establishment.name);
  const fontSize = Math.round(size * (initials.length > 1 ? 0.4 : 0.5) * (maskable ? 0.8 : 1));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconColor(establishment.accent_color),
          color: "#ffffff",
          fontSize,
          letterSpacing: -fontSize * 0.02,
        }}
      >
        {initials}
      </div>
    ),
    { width: size, height: size, headers },
  );
}
