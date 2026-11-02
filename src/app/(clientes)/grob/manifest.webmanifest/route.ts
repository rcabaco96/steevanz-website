import { grob } from "@/content/grob/facts";

// O manifesto da app web do domínio do clube (o seu /manifest.webmanifest, pelo proxy).
export const dynamic = "force-static";

export function GET() {
  const manifest = {
    name: grob.name,
    short_name: grob.short,
    start_url: "/",
    display: "browser",
    background_color: "#f6f8f3",
    theme_color: "#062615",
    icons: [
      { src: grob.media.icon192, sizes: "192x192", type: "image/png" },
      { src: grob.media.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { "Content-Type": "application/manifest+json" } });
}
