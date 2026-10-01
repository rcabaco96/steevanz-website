import { CompatShell } from "@/components/lab/CompatShell";
import { notFound } from "next/navigation";
import { DocPage, docMetadata } from "@/components/pages/DocPage";
import { docPages } from "@/content/doc-pages";
import { products } from "@/content/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.flatMap((product) => docPages.map((page) => ({ product: product.slug.pt, page: page.slug.pt })));
}

type Params = Promise<{ product: string; page: string }>;

async function resolve(params: Params) {
  const { product: productSlug, page: pageSlug } = await params;
  const product = products.find((candidate) => candidate.slug.pt === productSlug);
  const page = docPages.find((candidate) => candidate.slug.pt === pageSlug);
  return product && page ? { productId: product.id, pageId: page.id } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const resolved = await resolve(params);
  return resolved ? docMetadata("pt", resolved.productId, resolved.pageId) : {};
}

export default async function Page({ params }: { params: Params }) {
  const resolved = await resolve(params);
  if (!resolved) notFound();
  return (
    <CompatShell>
      <DocPage locale="pt" productId={resolved.productId} pageId={resolved.pageId} />
    </CompatShell>
  );
}
