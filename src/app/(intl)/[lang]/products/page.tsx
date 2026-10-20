import { ProductsIndexPage, productsIndexMetadata } from "@/components/pages/ProductsIndexPage";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return productsIndexMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  return <ProductsIndexPage locale={await localeOf(params)} />;
}
