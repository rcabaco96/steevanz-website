import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Steevanz — NFC plates for Google reviews and AI for local businesses";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "NFC plates · Artificial intelligence",
    title: "One tap. One more Google review.",
    subtitle: "NFC plates and AI tools for restaurants, salons, clinics and local shops.",
  });
}
