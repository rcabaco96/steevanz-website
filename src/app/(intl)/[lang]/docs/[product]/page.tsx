import { notFound, permanentRedirect } from "next/navigation";
import { products } from "@/content/products";
import { localeOf, staticLocale } from "@/lib/intl-route";
import { href, slugIn } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = staticLocale(params);
  return locale ? products.map((product) => ({ product: slugIn(product.slug, locale) })) : [];
}

export default async function Page({ params }: { params: Promise<{ lang: string; product: string }> }) {
  const locale = await localeOf(params);
  const { product: slug } = await params;
  const product = products.find((candidate) => slugIn(candidate.slug, locale) === slug);
  if (!product) notFound();
  permanentRedirect(href(locale, { key: "doc", productId: product.id, pageId: "getting-started" }));
}
