import { platibanda } from "@/content/platibanda/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: platibanda.fullName,
    short_name: platibanda.name,
    start_url: "/",
    display: "browser",
    background_color: "#faf6ef",
    theme_color: "#13302e",
    icons: [
      { src: platibanda.media.icon192, sizes: "192x192", type: "image/png" },
      { src: platibanda.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
