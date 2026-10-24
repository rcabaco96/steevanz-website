import { ferragial } from "@/content/ferragial/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: ferragial.fullName,
    short_name: ferragial.name,
    start_url: "/",
    display: "browser",
    background_color: "#f3eee4",
    theme_color: "#3a0a17",
    icons: [
      { src: ferragial.media.icon192, sizes: "192x192", type: "image/png" },
      { src: ferragial.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
