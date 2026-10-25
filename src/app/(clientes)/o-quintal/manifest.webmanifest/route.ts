import { oQuintal } from "@/content/o-quintal/facts";

// The web app manifest of the client's own domain (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: oQuintal.name,
    short_name: oQuintal.name,
    start_url: "/",
    display: "browser",
    background_color: "#f4ecdc",
    theme_color: "#2d4a2b",
    icons: [
      { src: oQuintal.media.icon192, sizes: "192x192", type: "image/png" },
      { src: oQuintal.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
