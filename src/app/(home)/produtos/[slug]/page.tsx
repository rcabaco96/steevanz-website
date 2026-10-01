import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductDetail } from "@/components/lab/ProductDetail";
import { SiteFooter, SiteHeader } from "@/components/lab/SiteChrome";
import { productMetadata } from "@/components/pages/ProductPage";
import { photos } from "@/content/media";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { faqJsonLd, productJsonLd } from "@/lib/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug.pt }));
}

function findProduct(slug: string) {
  return products.find((product) => product.slug.pt === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  return product ? productMetadata("pt", product.id) : {};
}

export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  const copy = getProductCopy(product.id, "pt");
  const image = product.contextPhoto ? photos[product.contextPhoto].src : "/icon.svg";

  return (
    <div className="lab-root pd-page">
      <JsonLd
        data={[
          productJsonLd({ locale: "pt", product, name: copy.name, description: copy.metaDescription, image }),
          faqJsonLd(copy.faq),
        ]}
      />
      <SiteHeader solid />
      <main className="pd-page-main">
        <ProductDetail productId={product.id} />
      </main>
      <SiteFooter />
    </div>
  );
}
