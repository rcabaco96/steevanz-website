import { ermita } from "@/content/o-ermita/facts";

// The web app manifest of the client's own domain (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: ermita.name,
    short_name: ermita.name,
    start_url: "/",
    display: "browser",
    background_color: "#f6f1e7",
    theme_color: "#0f1624",
    icons: [
      { src: ermita.media.icon192, sizes: "192x192", type: "image/png" },
      { src: ermita.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
