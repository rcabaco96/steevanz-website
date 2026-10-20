import { products } from "@/content/products";
import { getProductCopy } from "@/content/product-copy";
import { ui } from "@/content/ui";
import { ButtonLink } from "@/components/ui/Button";
import { TapPlate } from "@/components/visuals/TapPlate";
import { localize, type Locale, type Localized } from "@/lib/i18n";
import { href } from "@/lib/routes";
import Link from "next/link";

const copy: Localized<{ title404: string; eyebrow: string; title: string; body: string; home: string; plateLine1: string; plateLine2: string }> = {
  pt: {
    title404: "Página não encontrada | Steevanz",
    eyebrow: "Erro 404",
    title: "Esta placa não leva a lado nenhum.",
    body: "A página que procura não existe ou mudou de sítio. Experimente um destes caminhos:",
    home: "Voltar ao início",
    plateLine1: "Ups!",
    plateLine2: "Página não encontrada",
  },
  en: {
    title404: "Page not found | Steevanz",
    eyebrow: "Error 404",
    title: "This plate doesn't lead anywhere.",
    body: "The page you're looking for doesn't exist or has moved. Try one of these instead:",
    home: "Back to home",
    plateLine1: "Oops!",
    plateLine2: "Page not found",
  },
  es: {
    title404: "Página no encontrada | Steevanz",
    eyebrow: "Error 404",
    title: "Esta placa no lleva a ninguna parte.",
    body: "La página que busca no existe o ha cambiado de sitio. Pruebe uno de estos caminos:",
    home: "Volver al inicio",
    plateLine1: "¡Ups!",
    plateLine2: "Página no encontrada",
  },
  fr: {
    title404: "Page introuvable | Steevanz",
    eyebrow: "Erreur 404",
    title: "Cette plaque ne mène nulle part.",
    body: "La page que vous cherchez n'existe pas ou a changé d'adresse. Essayez plutôt l'un de ces chemins :",
    home: "Retour à l'accueil",
    plateLine1: "Oups !",
    plateLine2: "Page introuvable",
  },
  de: {
    title404: "Seite nicht gefunden | Steevanz",
    eyebrow: "Fehler 404",
    title: "Dieses Schild führt nirgendwohin.",
    body: "Die gesuchte Seite gibt es nicht oder sie ist umgezogen. Versuchen Sie es mit einem dieser Wege:",
    home: "Zur Startseite",
    plateLine1: "Hoppla!",
    plateLine2: "Seite nicht gefunden",
  },
  it: {
    title404: "Pagina non trovata | Steevanz",
    eyebrow: "Errore 404",
    title: "Questa targa non porta da nessuna parte.",
    body: "La pagina che cerca non esiste o è stata spostata. Provi uno di questi percorsi:",
    home: "Torna alla home",
    plateLine1: "Ops!",
    plateLine2: "Pagina non trovata",
  },
};

/** The 404 page title in `locale`. */
export function notFoundTitle(locale: Locale): string {
  return localize(copy, locale).title404;
}

export function NotFoundContent({ locale }: { locale: Locale }) {
  const text = localize(copy, locale);
  const t = localize(ui, locale);
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-24 sm:pt-36">
      <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
      {/* Stacked: title and text, then the plate, then the links (the order for every section with media). */}
      <div className="container-page grid items-center gap-x-12 gap-y-10 lg:grid-cols-[1.2fr_1fr] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-y-6">
        <div className="flex flex-col items-start gap-6 lg:col-start-1 lg:row-start-2">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 className="display text-5xl sm:text-6xl">{text.title}</h1>
          <p className="max-w-lg text-lg text-muted">{text.body}</p>
        </div>
        <TapPlate variant="stand" finish="black" line1={text.plateLine1} line2={text.plateLine2} className="mx-auto h-auto w-56 -rotate-6 sm:w-64 lg:col-start-2 lg:row-span-4 lg:row-start-1" />
        <div className="flex flex-col items-start gap-6 lg:col-start-1 lg:row-start-3">
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
      </div>
    </section>
  );
}
