import { ponteiro } from "@/content/ponteiro/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: ponteiro.fullName,
    short_name: ponteiro.name,
    start_url: "/",
    display: "browser",
    background_color: "#ece9e2",
    theme_color: "#1b1838",
    icons: [
      { src: ponteiro.media.icon192, sizes: "192x192", type: "image/png" },
      { src: ponteiro.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
