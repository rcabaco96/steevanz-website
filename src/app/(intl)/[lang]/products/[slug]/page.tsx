import { notFound } from "next/navigation";
import { ProductPage, productMetadata } from "@/components/pages/ProductPage";
import { products } from "@/content/products";
import { localeOf, staticLocale } from "@/lib/intl-route";
import { slugIn } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = staticLocale(params);
  return locale ? products.map((product) => ({ slug: slugIn(product.slug, locale) })) : [];
}

type Params = Promise<{ lang: string; slug: string }>;

async function resolve(params: Params) {
  const locale = await localeOf(params);
  const { slug } = await params;
  const product = products.find((candidate) => slugIn(candidate.slug, locale) === slug);
  return product ? { locale, productId: product.id } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const resolved = await resolve(params);
  return resolved ? productMetadata(resolved.locale, resolved.productId) : {};
}

export default async function Page({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  return <ProductPage locale={resolved.locale} productId={resolved.productId} />;
}
