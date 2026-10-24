import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { businessCardLabels } from "@/content/business-cards";
import { initialsOfName } from "@/lib/business-cards/rules";
import { loadPublicCard } from "@/lib/business-cards/store";
import { localize } from "@/lib/i18n";

// The link preview (1200×630) of any «Cartão de visita digital» (/c/<slug>), drawn from the card itself (owner,
// 2026-10-24: every card made in the admin gets one): the page's plum header with the round photo (or the initials),
// the name, the role and company, and its «Guardar contacto» button, in the card owner's language. Rogério's card has a
// photographed picture of its own (app/(cartao-visita)/c/[slug]/page.tsx); every other card points here.

// Refreshed at most hourly, like the card page (a saved card shows its new details within the hour).
export const revalidate = 3600;

const cream = "#fbf7f1";
const plum = "#7a2d60";
const plumDark = "#5e1f49";
const ink = "#1d1220";
const gold = "#cfa563";

async function loadFonts() {
  const directory = join(process.cwd(), "src/assets/og");
  const [display, sans] = await Promise.all([readFile(join(directory, "fraunces-600.woff")), readFile(join(directory, "hanken-500.woff"))]);
  return [
    { name: "Fraunces", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Hanken", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

/** The card's photo as a square JPEG data URL: a site file (/…) or an uploaded one (https). Undefined if unreadable. */
async function photoDataUrl(src: string | undefined): Promise<string | undefined> {
  if (!src) return undefined;
  try {
    let source: Buffer;
    if (src.startsWith("/")) {
      if (src.includes("..")) return undefined;
      source = await readFile(join(process.cwd(), "public", src));
    } else if (src.startsWith("https://")) {
      const response = await fetch(src, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) return undefined;
      source = Buffer.from(await response.arrayBuffer());
    } else return undefined;
    const jpeg = await sharp(source).rotate().resize(360, 360, { fit: "cover" }).flatten({ background: cream }).jpeg({ quality: 85 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const card = await loadPublicCard((await params).slug);
  if (!card) return new Response("Not found", { status: 404 });
  const labels = localize(businessCardLabels, card.locale);
  const line = [card.role, card.company].filter(Boolean).join(" · ");
  const [fonts, photo] = await Promise.all([loadFonts(), photoDataUrl(card.photo?.src)]);
  const nameSize = card.name.length > 26 ? 60 : card.name.length > 18 ? 72 : 84;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: cream, fontFamily: "Hanken", color: ink, position: "relative" }}>
        {/* The page's header, on the right, with the round photo. */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 470,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(160deg, ${plum} 0%, ${plumDark} 100%)`,
            borderTopLeftRadius: 64,
            borderBottomLeftRadius: 64,
          }}
        >
          <div style={{ position: "absolute", right: -90, top: -90, width: 320, height: 320, borderRadius: 999, border: `2px solid ${gold}`, opacity: 0.35, display: "flex" }} />
          <div style={{ position: "absolute", left: 40, bottom: 36, display: "flex", fontFamily: "Fraunces", fontSize: 44, color: cream }}>
            S<span style={{ color: gold }}>.</span>
          </div>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- next/og renders plain img
            <img src={photo} alt="" width={300} height={300} style={{ borderRadius: 999, border: `10px solid ${cream}` }} />
          ) : (
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: 999,
                border: `10px solid ${cream}`,
                background: "#f4e4ee",
                color: plum,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Fraunces",
                fontSize: 110,
              }}
            >
              {initialsOfName(card.name)}
            </div>
          )}
        </div>

        {/* The card's own words: who it is and the button the page opens with. */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 72px", width: 700, gap: 22 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: plum }}>{labels.madeBy}</div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: nameSize, lineHeight: 1.04 }}>{card.name}</div>
          {line ? <div style={{ display: "flex", fontSize: 30, color: "#4d3d4a" }}>{line}</div> : null}
          <div style={{ display: "flex", marginTop: 18 }}>
            <div style={{ display: "flex", padding: "20px 40px", borderRadius: 22, background: plum, color: cream, fontSize: 30 }}>{labels.save}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400", "X-Robots-Tag": "noindex" },
    },
  );
}
