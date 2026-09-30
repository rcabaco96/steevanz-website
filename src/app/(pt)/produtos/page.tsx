import { ProductsIndexPage, productsIndexMetadata } from "@/components/pages/ProductsIndexPage";

export const metadata = productsIndexMetadata("pt");

export default function Page() {
  return <ProductsIndexPage locale="pt" />;
}
