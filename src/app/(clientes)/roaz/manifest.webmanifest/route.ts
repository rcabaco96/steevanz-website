import { roaz } from "@/content/roaz/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: roaz.fullName,
    short_name: roaz.name,
    start_url: "/",
    display: "browser",
    background_color: "#f6f2ea",
    theme_color: "#06303a",
    icons: [
      { src: roaz.media.icon192, sizes: "192x192", type: "image/png" },
      { src: roaz.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
