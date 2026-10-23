import { orve } from "@/content/orve/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: orve.fullName,
    short_name: orve.name,
    start_url: "/",
    display: "browser",
    background_color: "#f5efe8",
    theme_color: "#241814",
    icons: [
      { src: orve.media.icon192, sizes: "192x192", type: "image/png" },
      { src: orve.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
