import { CartPage, cartMetadata } from "@/components/pages/CartPage";
import { localeOf, type LangParams } from "@/lib/intl-route";

export async function generateMetadata({ params }: { params: LangParams }) {
  return cartMetadata(await localeOf(params));
}

export default async function Page({ params }: { params: LangParams }) {
  return <CartPage locale={await localeOf(params)} />;
}
