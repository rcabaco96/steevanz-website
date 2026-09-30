import { notFound, permanentRedirect } from "next/navigation";
import { products } from "@/content/products";
import { href } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ product: product.slug.pt }));
}

export default async function Page({ params }: { params: Promise<{ product: string }> }) {
  const { product: slug } = await params;
  const product = products.find((candidate) => candidate.slug.pt === slug);
  if (!product) notFound();
  permanentRedirect(href("pt", { key: "doc", productId: product.id, pageId: "getting-started" }));
}
