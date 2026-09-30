import { products } from "@/content/products";
import { getProductCopy } from "@/content/product-copy";
import { ui } from "@/content/ui";
import { ButtonLink } from "@/components/ui/Button";
import { NfcPlate } from "@/components/visuals/NfcPlate";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import Link from "next/link";

const copy = {
  pt: {
    eyebrow: "Erro 404",
    title: "Esta placa não leva a lado nenhum.",
    body: "A página que procura não existe ou mudou de sítio. Experimente um destes caminhos:",
    home: "Voltar ao início",
    plateLine1: "Ups!",
    plateLine2: "Página não encontrada",
  },
  en: {
    eyebrow: "Error 404",
    title: "This plate doesn't lead anywhere.",
    body: "The page you're looking for doesn't exist or has moved. Try one of these instead:",
    home: "Back to home",
    plateLine1: "Oops!",
    plateLine2: "Page not found",
  },
};

export function NotFoundContent({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const t = ui[locale];
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-24 sm:pt-36">
      <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 className="display text-5xl sm:text-6xl">{text.title}</h1>
          <p className="max-w-lg text-lg text-muted">{text.body}</p>
          <ul className="flex flex-wrap gap-2">
            {products.slice(0, 4).map((product) => (
              <li key={product.id}>
                <Link
                  href={href(locale, { key: "product", productId: product.id })}
                  className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted hover:text-text"
                >
                  {getProductCopy(product.id, locale).shortName}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href(locale, { key: "docs" })} className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted hover:text-text">
                {t.nav.docs}
              </Link>
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href(locale, { key: "home" })}>{text.home}</ButtonLink>
            <ButtonLink href={href(locale, { key: "contact" })} variant="secondary">
              {t.nav.contact}
            </ButtonLink>
          </div>
        </div>
        <NfcPlate variant="stand" finish="black" line1={text.plateLine1} line2={text.plateLine2} className="mx-auto h-auto w-56 -rotate-6 sm:w-64" />
      </div>
    </section>
  );
}
