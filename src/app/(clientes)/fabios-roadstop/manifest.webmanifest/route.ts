import { fabios } from "@/content/fabios-roadstop/facts";

// The web app manifest of the client's own domain (www.fabiosroadstop.pt/manifest.webmanifest, through the
// proxy): every page links /manifest.webmanifest, which on steevanz.com is the Steevanz one.
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: fabios.name,
    short_name: fabios.name,
    start_url: "/",
    display: "browser",
    background_color: "#fff4e1",
    theme_color: "#0d1726",
    icons: [
      { src: fabios.media.icon192, sizes: "192x192", type: "image/png" },
      { src: fabios.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
