import { prumo } from "@/content/prumo/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: prumo.fullName,
    short_name: prumo.name,
    start_url: "/",
    display: "browser",
    background_color: "#f4f2ed",
    theme_color: "#1d2730",
    icons: [
      { src: prumo.media.icon192, sizes: "192x192", type: "image/png" },
      { src: prumo.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
