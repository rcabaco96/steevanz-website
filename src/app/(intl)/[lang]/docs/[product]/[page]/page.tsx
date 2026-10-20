import { notFound } from "next/navigation";
import { DocPage, docMetadata } from "@/components/pages/DocPage";
import { docPages } from "@/content/doc-pages";
import { products } from "@/content/products";
import { localeOf, staticLocale } from "@/lib/intl-route";
import { slugIn } from "@/lib/routes";

export const dynamicParams = false;

// The [product] segment has no layout, so its params do not reach here: this page lists both.
export function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = staticLocale(params);
  if (!locale) return [];
  return products.flatMap((product) => docPages.map((page) => ({ product: slugIn(product.slug, locale), page: slugIn(page.slug, locale) })));
}

type Params = Promise<{ lang: string; product: string; page: string }>;

async function resolve(params: Params) {
  const locale = await localeOf(params);
  const { product: productSlug, page: pageSlug } = await params;
  const product = products.find((candidate) => slugIn(candidate.slug, locale) === productSlug);
  const page = docPages.find((candidate) => slugIn(candidate.slug, locale) === pageSlug);
  return product && page ? { locale, productId: product.id, pageId: page.id } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const resolved = await resolve(params);
  return resolved ? docMetadata(resolved.locale, resolved.productId, resolved.pageId) : {};
}

export default async function Page({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  return <DocPage locale={resolved.locale} productId={resolved.productId} pageId={resolved.pageId} />;
}
