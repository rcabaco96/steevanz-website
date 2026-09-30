import { ProductsIndexPage, productsIndexMetadata } from "@/components/pages/ProductsIndexPage";

export const metadata = productsIndexMetadata("en");

export default function Page() {
  return <ProductsIndexPage locale="en" />;
}
