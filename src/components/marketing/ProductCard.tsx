import Link from "next/link";
import type { Product } from "@/content/products";
import { getProductCopy } from "@/content/product-copy";
import { ArrowUpRight, ProductGlyph } from "@/components/icons";
import { priceLabel } from "@/components/ui/Price";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  headingLevel?: "h2" | "h3";
  revealDelay?: number;
}

export function ProductCard({ product, locale, headingLevel = "h3", revealDelay = 0 }: ProductCardProps) {
  const copy = getProductCopy(product.id, locale);
  const Heading = headingLevel;
  return (
    <article
      data-reveal
      style={{ ["--reveal-delay" as string]: `${revealDelay}ms` }}
      className="card card-interactive group relative flex h-full flex-col gap-5 p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent-text transition-transform duration-500 ease-(--ease-out-expo) group-hover:-rotate-6 group-hover:scale-110">
          <ProductGlyph icon={product.icon} size={24} />
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-contrast">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Heading className="text-xl font-semibold tracking-[-0.015em] text-text">
          <Link href={href(locale, { key: "product", productId: product.id })} className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
            {copy.name}
          </Link>
        </Heading>
        <p className="text-[0.95rem] leading-relaxed text-muted">{copy.summary}</p>
      </div>
      <p className="border-t border-line pt-4 text-sm font-semibold text-text">
        <span className="tabular">{priceLabel(product, locale)}</span>
        <span className="font-normal text-subtle"> · {product.priceQualifier[locale]}</span>
      </p>
    </article>
  );
}
