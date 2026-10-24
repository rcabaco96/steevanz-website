import { seteChaves } from "@/content/sete-chaves/facts";

// The web app manifest of a domain of its own (its root /manifest.webmanifest, through the proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: seteChaves.fullName,
    short_name: seteChaves.name,
    start_url: "/",
    display: "browser",
    background_color: "#f5f1e8",
    theme_color: "#262c33",
    icons: [
      { src: seteChaves.media.icon192, sizes: "192x192", type: "image/png" },
      { src: seteChaves.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
