import { notFound } from "next/navigation";
import { ProductPage, productMetadata } from "@/components/pages/ProductPage";
import { products } from "@/content/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug.en }));
}

function findProduct(slug: string) {
  return products.find((product) => product.slug.en === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  return product ? productMetadata("en", product.id) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  return <ProductPage locale="en" productId={product.id} />;
}
