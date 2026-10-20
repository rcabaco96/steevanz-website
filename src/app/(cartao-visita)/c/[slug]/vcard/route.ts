import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { businessCards, getBusinessCard, type BusinessCard } from "@/content/business-cards";
import { buildVCard, vcardFileName, type VCardPhoto } from "@/lib/business-card/vcard";

// «Guardar contacto»: the card owner's contact file, made at build time for every card (fast, with the photo inside).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return businessCards.map((card) => ({ slug: card.slug }));
}

/** The photo as a small JPEG on cream (round PNGs have transparent corners; contacts crop it round again). */
async function photoFor(card: BusinessCard): Promise<VCardPhoto | undefined> {
  if (!card.photo) return undefined;
  try {
    const source = await readFile(join(process.cwd(), "public", card.photo.src));
    const jpeg = await sharp(source).resize(240, 240, { fit: "cover" }).flatten({ background: "#fbf7f1" }).jpeg({ quality: 82 }).toBuffer();
    return { base64: jpeg.toString("base64"), type: "JPEG" };
  } catch {
    // Without the photo the contact still saves.
    return undefined;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const card = getBusinessCard((await params).slug);
  if (!card) return new Response("Not found", { status: 404 });
  const body = buildVCard(card, await photoFor(card));
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${vcardFileName(card)}"`,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
