import Link from "next/link";
import { oQuintal } from "@/content/o-quintal/facts";
import { oQuintalCategories, oQuintalProductsIn, type OQuintalCategoryId } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { ProductCard } from "./ProductCard";

// The shop: category tabs (links, so each category has its own address and works without JavaScript) and the
// grid, priced products first. No scroll scenes here: the catalogue must stay quick on phones (owner, 2026-10-25).
export function Catalogue({ mode, category }: { mode: OQuintalMode; category: OQuintalCategoryId | null }) {
  const current = oQuintalCategories.find((entry) => entry.id === category) ?? null;
  const sections = current ? [current] : oQuintalCategories;
  return (
    <div className="px-4 pt-24 pb-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[84rem]">
        <p className="oq-stamp text-tomate-deep">Loja online</p>
        <h1 className="mt-3 font-display text-[clamp(2.3rem,9vw,4.4rem)] leading-[1.02] text-ardosia">{current ? current.name : "A nossa banca"}</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-terra">
          {current ? current.intro : `${oQuintal.origin} ${oQuintal.selection} Escolha por secção ou percorra tudo.`}
        </p>

        <nav aria-label="Secções da loja" className="sticky top-16 z-30 -mx-4 mt-7 bg-kraft/95 px-4 py-3 backdrop-blur sm:top-[4.5rem] sm:-mx-8 sm:px-8">
          <ul className="-my-1 flex gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
            {[{ id: null, name: "Tudo" }, ...oQuintalCategories].map((entry) => {
              const active = (entry.id ?? null) === (current?.id ?? null);
              return (
                <li key={entry.id ?? "tudo"} className="shrink-0">
                  <Link
                    href={oQuintalHref(mode, { kind: "shop", category: entry.id })}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-5 font-semibold whitespace-nowrap transition-colors ${active ? "bg-ardosia text-giz" : "border-2 border-ardosia/15 bg-giz/60 text-ardosia hover:border-folha"}`}
                  >
                    {entry.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {sections.map((section, sectionIndex) => {
          const items = oQuintalProductsIn(section.id);
          return (
            <section key={section.id} aria-labelledby={`oq-cat-${section.id}`} className="mt-10 sm:mt-14">
              <div className={current ? "sr-only" : "mb-5 border-b-2 border-dashed border-ardosia/15 pb-4"}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id={`oq-cat-${section.id}`} className="font-display text-[1.8rem] text-ardosia sm:text-[2.2rem]">
                    {section.name}
                  </h2>
                  <Link href={oQuintalHref(mode, { kind: "shop", category: section.id })} className="shrink-0 text-sm font-semibold text-folha underline-offset-4 hover:underline">
                    Ver secção
                  </Link>
                </div>
                <p className="mt-1 max-w-2xl text-terra">{section.intro}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {items.map((item, i) => (
                  // The first row of the first section is above the fold on phones: preloaded; the rest lazy.
                  <ProductCard key={item.id} product={item} mode={mode} preload={sectionIndex === 0 && i < 2} />
                ))}
              </div>
            </section>
          );
        })}
        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-terra">
          O preço de cada produto refere-se à unidade indicada (kg, 500 g, molho, unidade…). Na fruta e nos legumes o peso pode variar ligeiramente de peça para peça.
        </p>
      </div>
    </div>
  );
}
