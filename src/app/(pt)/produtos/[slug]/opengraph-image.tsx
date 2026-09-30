import { ogContentType, ogSize } from "@/lib/og";
import { productOgParams, renderProductOg } from "@/lib/og-product";

export const alt = "Steevanz";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return productOgParams("pt");
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderProductOg("pt", slug);
}
