import Link from "next/link";
import { oQuintalCategories, oQuintalProducts, type OQuintalCategoryId } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { ProductCard } from "./ProductCard";

// The shop: category tabs (links, so each category has its own address and works without JavaScript) and the
// grid. No scroll scenes here: the catalogue must stay quick on phones (owner, 2026-10-25).
export function Catalogue({ mode, category }: { mode: OQuintalMode; category: OQuintalCategoryId | null }) {
  const current = oQuintalCategories.find((entry) => entry.id === category) ?? null;
  const sections = current ? [current] : oQuintalCategories;
  return (
    <div className="px-4 pt-24 pb-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[84rem]">
        <p className="oq-stamp text-tomate-deep">Loja online</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,9vw,4.6rem)] leading-[1.02] text-ardosia">{current ? current.name : "A nossa banca"}</h1>
        <p className="mt-3 max-w-xl text-lg text-terra">{current ? current.intro : "Fruta, legumes, cabazes e produtos regionais. Os preços são os da nossa banca."}</p>

        <nav aria-label="Secções da loja" className="sticky top-16 z-30 -mx-4 mt-8 overflow-x-auto bg-kraft/90 px-4 py-3 backdrop-blur sm:top-[4.5rem] sm:-mx-8 sm:px-8">
          <ul className="flex w-max gap-2">
            <li>
              <Link
                href={oQuintalHref(mode, { kind: "shop", category: null })}
                aria-current={current ? undefined : "page"}
                className={`inline-flex min-h-11 items-center rounded-full px-5 font-semibold transition-colors ${current ? "border-2 border-ardosia/15 text-ardosia hover:border-folha" : "bg-ardosia text-giz"}`}
              >
                Tudo
              </Link>
            </li>
            {oQuintalCategories.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={oQuintalHref(mode, { kind: "shop", category: entry.id })}
                  aria-current={entry.id === current?.id ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-5 font-semibold whitespace-nowrap transition-colors ${entry.id === current?.id ? "bg-ardosia text-giz" : "border-2 border-ardosia/15 text-ardosia hover:border-folha"}`}
                >
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {sections.map((section) => {
          const items = oQuintalProducts.filter((item) => item.category === section.id);
          return (
            <section key={section.id} aria-labelledby={`oq-cat-${section.id}`} className="mt-10">
              {current ? null : (
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b-2 border-dashed border-ardosia/15 pb-3">
                  <h2 id={`oq-cat-${section.id}`} className="font-display text-[1.8rem] text-ardosia">
                    {section.name}
                  </h2>
                  <span className="oq-stamp text-terra">{items.length} produtos</span>
                </div>
              )}
              {current ? (
                <h2 id={`oq-cat-${section.id}`} className="sr-only">
                  {section.name}
                </h2>
              ) : null}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {items.map((item) => (
                  <ProductCard key={item.id} product={item} mode={mode} />
                ))}
              </div>
            </section>
          );
        })}
        <p className="mt-12 text-sm text-terra">Preços por unidade de venda indicada em cada produto. O peso da fruta e dos legumes pode variar ligeiramente.</p>
      </div>
    </div>
  );
}
