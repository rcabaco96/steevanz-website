import { meada } from "@/content/meada/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: meada.fullName,
    short_name: meada.name,
    start_url: "/",
    display: "browser",
    background_color: "#f4f1ea",
    theme_color: "#1c1d20",
    icons: [
      { src: meada.media.icon192, sizes: "192x192", type: "image/png" },
      { src: meada.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
