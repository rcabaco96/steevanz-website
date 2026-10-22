import { lobo } from "@/content/lobo-do-mar/facts";

// The web app manifest of the client's own domain (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: lobo.name,
    short_name: lobo.name,
    start_url: "/",
    display: "browser",
    background_color: "#f4ecdf",
    theme_color: "#0b2430",
    icons: [
      { src: lobo.media.icon192, sizes: "192x192", type: "image/png" },
      { src: lobo.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
