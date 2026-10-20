import type { Product } from "@/content/products";
import { ui } from "@/content/ui";
import { localize, numberLocale, type Locale } from "@/lib/i18n";

export function formatEuro(amount: number, locale: Locale): string {
  // Whole euros without decimals (10 €); cents only when there are any (4,50 € a keychain in a pack).
  const digits = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat(numberLocale[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function priceLabel(product: Product, locale: Locale): string {
  const t = localize(ui, locale).common;
  const suffix = product.priceBilling === "monthly" ? t.perMonth : "";
  return `${t.from} ${formatEuro(product.priceFrom, locale)}${suffix}`;
}

interface PriceProps {
  product: Product;
  locale: Locale;
  size?: "sm" | "lg";
  showQualifier?: boolean;
}

export function Price({ product, locale, size = "sm", showQualifier = false }: PriceProps) {
  const t = localize(ui, locale);
  const amountClass = size === "lg" ? "text-5xl sm:text-6xl" : "text-2xl";
  return (
    <div className="flex flex-col gap-1">
      <p className="flex items-baseline gap-1.5">
        <span className="text-sm text-subtle">{t.common.from}</span>
        <span className={`display tabular ${amountClass}`}>{formatEuro(product.priceFrom, locale)}</span>
        {product.priceBilling === "monthly" ? <span className="text-sm text-subtle">{t.common.perMonth}</span> : null}
        <span className="text-xs text-subtle">{t.common.vatExcluded}</span>
      </p>
      {showQualifier ? (
        <p className="text-sm text-muted">
          {localize(product.priceQualifier, locale)}
          {product.priceIsProvisional ? <span className="text-subtle"> · {t.common.provisional}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
