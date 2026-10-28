import { risca } from "@/content/risca/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: risca.fullName,
    short_name: risca.name,
    start_url: "/",
    display: "browser",
    background_color: "#f2efe9",
    theme_color: "#121110",
    icons: [
      { src: risca.media.icon192, sizes: "192x192", type: "image/png" },
      { src: risca.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
