import { productsIndexMetadata } from "@/components/pages/ProductsIndexPage";
import { ProductsView } from "@/components/lab/InfoViews";
import { SiteFooter, SiteHeader } from "@/components/lab/SiteChrome";

export const metadata = productsIndexMetadata("pt");

export default function ProductsRoute() {
  return (
    <div className="lab-root pd-page">
      <SiteHeader solid />
      <main className="pd-page-main">
        <ProductsView />
      </main>
      <SiteFooter />
    </div>
  );
}
