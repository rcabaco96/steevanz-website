"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type RefObject } from "react";
import { ArrowLeft, ArrowRight, CartIcon, Check, MinusIcon, PlusIcon, ProductGlyph, TrashIcon } from "@/components/icons";
import { ConsentField, FormAlert, HiddenInputs, Honeypot, SelectField, TextAreaField, TextField, inputClasses, type SelectOption } from "@/components/booking/fields";
import { buttonClasses } from "@/components/ui/Button";
import type { FormField, FormCopy } from "@/content/booking";
import type { CartCopy } from "@/content/cart";
import type { ProductIcon } from "@/content/products";
import type { ProductId } from "@/content/types";
import { submitOrder, type OrderActionState } from "@/lib/cart/actions";
import { cartGroups, formatCents, maxQuantity, priceCart, vatRate, type CartGroupId, type GroupTotals, type PricedLine } from "@/lib/cart/pricing";
import { cart, useCart } from "@/lib/cart/store";
import type { Locale } from "@/lib/i18n";

export interface CartCatalogItem {
  id: ProductId;
  name: string;
  shortName: string;
  qualifier: string;
  billingLabel: string;
  href: string;
  icon: ProductIcon;
  customization?: {
    formats: SelectOption[];
    logoExtraCents: number;
    textMaxLength: number;
  };
}

interface CartViewProps {
  locale: Locale;
  copy: CartCopy;
  formCopy: FormCopy;
  catalog: CartCatalogItem[];
  sectors: SelectOption[];
  links: { privacy: string; products: string; home: string };
}

type Step = "cart" | "checkout";
type Money = (cents: number, group: CartGroupId) => string;

export function CartView({ locale, copy, formCopy, catalog, sectors, links }: CartViewProps) {
  const lines = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [result, setResult] = useState<OrderActionState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const summaryRef = useRef<HTMLElement>(null);
  const summaryBelowFold = useBelowFold(summaryRef, step === "cart" && lines.length > 0);
  const totals = priceCart(lines);
  const catalogById = new Map(catalog.map((item) => [item.id, item]));
  const available = catalog.filter((item) => !lines.some((line) => line.productId === item.id));
  const activeGroups = cartGroups.filter((group) => totals[group].lines.length);
  const money: Money = (cents, group) => `${formatCents(cents, locale)}${group === "monthly" ? copy.perMonth : ""}`;
  const itemCount = totals.oneTime.quantity + totals.monthly.quantity;

  function goTo(next: Step) {
    setStep(next);
    setResult({ status: "idle" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("items", JSON.stringify(lines));
    formData.set("referrer", document.referrer.slice(0, 300));
    startTransition(async () => {
      const response = await submitOrder({ status: "idle" }, formData);
      startTransition(() => {
        setResult(response);
        if (response.status === "success") {
          cart.clear();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
  }

  if (result.status === "success") {
    return (
      <div role="status" className="card mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-5 py-10 text-center sm:px-8 sm:py-12">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success sm:h-18 sm:w-18">
          <Check size={32} strokeWidth={2.2} />
        </span>
        <div className="flex flex-col gap-3">
          <h2 className="display text-3xl sm:text-4xl">{copy.success.title}</h2>
          <p className="text-muted">{copy.success.body}</p>
          {result.reference !== "ok" ? (
            <p className="text-sm text-subtle">
              {copy.success.reference}: <span className="font-mono font-semibold text-text">{result.reference}</span>
            </p>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href={links.products} className={buttonClasses("primary", "lg")}>
            {copy.success.products}
            <ArrowRight size={18} />
          </Link>
          <Link href={links.home} className={buttonClasses("secondary", "lg")}>
            {copy.success.home}
          </Link>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="flex flex-col gap-8">
        <div className="card flex flex-col items-center gap-5 px-5 py-10 text-center sm:py-12">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent-text">
            <CartIcon size={28} />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="display text-2xl sm:text-3xl">{copy.empty.title}</h2>
            <p className="text-muted">{copy.empty.body}</p>
          </div>
          <Link href={links.products} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
            {copy.empty.cta}
            <ArrowRight size={18} />
          </Link>
        </div>
        <QuickAdd title={copy.addMore} items={available} addLabel={copy.addShort} />
      </div>
    );
  }

  const errorFields: FormField[] = result.status === "error" ? result.fields : [];
  const fieldError = (field: FormField) => (errorFields.includes(field) ? formCopy.fieldErrors[field] : undefined);
  const generalError =
    result.status === "error"
      ? {
          validation: null,
          empty_cart: copy.emptyCartError,
          rate_limited: formCopy.rateLimitedError,
          generic: formCopy.genericError,
        }[result.code]
      : null;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-5 lg:col-start-1">
          {step === "cart" ? (
            <>
              <CartToolbar copy={copy} count={itemCount} />
              {activeGroups.map((group) => (
                <section key={group} aria-labelledby={`cart-group-${group}`} className="card overflow-hidden">
                  <header className="flex flex-col gap-0.5 border-b border-line bg-surface-2/60 px-4 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3 sm:px-6 sm:py-4">
                    <h2 id={`cart-group-${group}`} className="text-lg font-semibold text-text">
                      {copy.groups[group].title}
                    </h2>
                    <p className="text-sm text-subtle">{copy.groups[group].body}</p>
                  </header>
                  <ul className="divide-y divide-line">
                    {totals[group].lines.map((line, index, groupLines) => {
                      const item = catalogById.get(line.productId);
                      if (!item) return null;
                      const lastOfProduct = !groupLines.slice(index + 1).some((other) => other.productId === line.productId);
                      return (
                        <CartLineRow
                          key={line.id}
                          locale={locale}
                          line={line}
                          item={item}
                          copy={copy}
                          money={(cents) => money(cents, group)}
                          showAddVariant={Boolean(item.customization) && lastOfProduct}
                        />
                      );
                    })}
                  </ul>
                </section>
              ))}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="card relative flex flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
              <button type="button" onClick={() => goTo("cart")} className={buttonClasses("ghost", "sm", "-ml-2 self-start")}>
                <ArrowLeft size={16} />
                {copy.backToCart}
              </button>
              <div className="flex flex-col gap-2">
                <h2 className="display text-2xl sm:text-3xl">{copy.checkoutTitle}</h2>
                <p className="text-muted">{copy.checkoutLead}</p>
              </div>
              {generalError ? <FormAlert>{generalError}</FormAlert> : null}
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField name="name" label={formCopy.labels.name} required autoComplete="name" placeholder={formCopy.placeholders.name} maxLength={120} error={fieldError("name")} />
                <TextField
                  name="email"
                  type="email"
                  label={formCopy.labels.email}
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={formCopy.placeholders.email}
                  error={fieldError("email")}
                />
                <TextField
                  name="phone"
                  type="tel"
                  label={formCopy.labels.phone}
                  optionalLabel={formCopy.optional}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={formCopy.placeholders.phone}
                  maxLength={24}
                  error={fieldError("phone")}
                />
                <TextField
                  name="businessName"
                  label={formCopy.labels.businessName}
                  optionalLabel={formCopy.optional}
                  autoComplete="organization"
                  placeholder={formCopy.placeholders.businessName}
                  maxLength={160}
                  error={fieldError("businessName")}
                />
                <SelectField
                  name="sector"
                  label={formCopy.labels.sector}
                  optionalLabel={formCopy.optional}
                  options={sectors}
                  placeholder={formCopy.sectorPlaceholder}
                  defaultValue=""
                  error={fieldError("sector")}
                  className="sm:col-span-2"
                />
                <TextAreaField
                  name="message"
                  label={formCopy.labels.message}
                  optionalLabel={formCopy.optional}
                  placeholder={formCopy.placeholders.message}
                  error={fieldError("message")}
                  className="sm:col-span-2"
                />
              </div>
              <ConsentField copy={formCopy} privacyHref={links.privacy} error={fieldError("consent")} />
              <Honeypot label={formCopy.honeypotLabel} />
              <HiddenInputs values={{ locale }} />
              <div className="border-t border-line pt-6 sm:flex sm:justify-end">
                <button type="submit" disabled={pending} aria-busy={pending} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
                  {pending ? (
                    <>
                      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      {formCopy.sending}
                    </>
                  ) : (
                    <>
                      {copy.submit}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside
          ref={summaryRef}
          aria-labelledby="cart-summary-title"
          className="card flex flex-col gap-5 p-5 sm:p-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <h2 id="cart-summary-title" className="eyebrow">
            {copy.summaryTitle}
          </h2>
          {activeGroups.map((group) => (
            <dl key={group} className="flex flex-col gap-1.5 border-b border-line pb-4 text-sm">
              <dt className="mb-1 font-semibold text-text">{copy.groups[group].title}</dt>
              <dd className="flex justify-between gap-3 text-muted">
                <span>{copy.subtotal}</span>
                <span className="tabular">{money(totals[group].subtotalCents, group)}</span>
              </dd>
              <dd className="flex justify-between gap-3 text-muted">
                <span>{copy.vat.replace("{rate}", String(vatRate))}</span>
                <span className="tabular">{money(totals[group].vatCents, group)}</span>
              </dd>
              <dd className="flex justify-between gap-3 font-semibold text-text">
                <span>{copy.total}</span>
                <span className="tabular">{money(totals[group].totalCents, group)}</span>
              </dd>
            </dl>
          ))}
          <div className="flex flex-col gap-3">
            {activeGroups.map((group) => (
              <p key={group} className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm text-muted">{group === "monthly" ? copy.monthlyTotal : copy.oneTimeTotal}</span>
                <span className="display tabular text-2xl">{money(totals[group].totalCents, group)}</span>
              </p>
            ))}
          </div>
          <p className="text-xs text-subtle">{copy.pricesNote}</p>
          {step === "cart" ? (
            <button type="button" onClick={() => goTo("checkout")} className={buttonClasses("primary", "lg", "w-full")}>
              {copy.checkout}
              <ArrowRight size={18} />
            </button>
          ) : null}
        </aside>

        {step === "cart" ? (
          <div className="min-w-0 lg:col-start-1">
            <QuickAdd title={copy.addMore} items={available} addLabel={copy.addShort} />
          </div>
        ) : null}
      </div>

      {step === "cart" && summaryBelowFold ? (
        <MobileCheckoutBar copy={copy} totals={totals} groups={activeGroups} money={money} onCheckout={() => goTo("checkout")} />
      ) : null}
    </>
  );
}

function useBelowFold(ref: RefObject<HTMLElement | null>, enabled: boolean): boolean {
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setBelow(!entry.isIntersecting && entry.boundingClientRect.top > 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return enabled && below;
}

function MobileCheckoutBar({
  copy,
  totals,
  groups,
  money,
  onCheckout,
}: {
  copy: CartCopy;
  totals: Record<CartGroupId, GroupTotals>;
  groups: CartGroupId[];
  money: Money;
  onCheckout: () => void;
}) {
  return (
    <div
      data-cart-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 motion-safe:animate-[menu-in_0.25s_var(--ease-out-expo)] lg:hidden"
    >
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 flex-col">
          {groups.map((group) => (
            <p key={group} className="flex items-baseline gap-1.5 leading-snug">
              <span className="text-xs text-subtle">{group === "monthly" ? copy.barMonthly : copy.barOneTime}</span>
              <span className="tabular truncate text-base font-semibold text-text">{money(totals[group].totalCents, group)}</span>
            </p>
          ))}
          <p className="text-xs text-subtle">{copy.vatIncluded}</p>
        </div>
        <button type="button" onClick={onCheckout} className={buttonClasses("primary", "md", "shrink-0")}>
          {copy.checkoutShort}
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function CartToolbar({ copy, count }: { copy: CartCopy; count: number }) {
  const [confirming, setConfirming] = useState(false);
  const countLabel = (count === 1 ? copy.itemCount.one : copy.itemCount.other).replace("{count}", String(count));

  return (
    <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <p className="text-sm font-medium text-muted">{countLabel}</p>
      {confirming ? (
        <div
          role="group"
          aria-label={copy.clearConfirm}
          className="flex w-full flex-col gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm font-semibold text-danger">{copy.clearConfirm}</p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button type="button" autoFocus onClick={() => setConfirming(false)} className={buttonClasses("secondary", "sm", "h-10")}>
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={() => cart.clear()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              <TrashIcon size={15} />
              {copy.clearYes}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={buttonClasses("ghost", "sm", "-mr-2 text-muted hover:text-danger")}>
          <TrashIcon size={15} />
          {copy.clear}
        </button>
      )}
    </div>
  );
}

interface CartLineRowProps {
  locale: Locale;
  line: PricedLine;
  item: CartCatalogItem;
  copy: CartCopy;
  money: (cents: number) => string;
  showAddVariant: boolean;
}

function CartLineRow({ locale, line, item, copy, money, showAddVariant }: CartLineRowProps) {
  const formatLabel = item.customization?.formats.find((format) => format.value === line.options?.format)?.label;
  const lineName = formatLabel ? `${item.name} (${formatLabel})` : item.name;

  return (
    <li className="flex flex-col gap-4 px-4 py-5 sm:px-6">
      <div className="flex gap-3 sm:gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text sm:h-11 sm:w-11">
          <ProductGlyph icon={item.icon} size={20} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Link href={item.href} className="font-semibold text-text hover:text-accent-text">
            {item.name}
          </Link>
          <p className="text-sm text-subtle">{item.qualifier}</p>
          <p className="tabular text-sm text-muted">
            {money(line.unitCents)} {copy.unitPrice}
          </p>
        </div>
        <button
          type="button"
          onClick={() => cart.remove(line.id)}
          aria-label={copy.remove.replace("{name}", lineName)}
          title={copy.remove.replace("{name}", lineName)}
          className="-mt-1 -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-subtle transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <TrashIcon size={18} />
        </button>
      </div>

      {item.customization && line.options ? (
        <LineCustomization locale={locale} line={line} customization={item.customization} copy={copy} />
      ) : null}

      <div className="flex items-center justify-between gap-3 sm:pl-15">
        <QuantityStepper line={line} copy={copy} label={(template) => template.replace("{name}", lineName)} />
        <p className="tabular min-w-0 text-right text-lg font-semibold text-text">{money(line.subtotalCents)}</p>
      </div>

      {showAddVariant ? (
        <button
          type="button"
          onClick={() => cart.addVariant(item.id)}
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-full text-sm font-semibold text-accent-text hover:underline sm:ml-15"
        >
          <PlusIcon size={16} />
          {`${copy.customize.addVariant} · ${item.shortName}`}
        </button>
      ) : null}
    </li>
  );
}

function LineCustomization({
  locale,
  line,
  customization,
  copy,
}: {
  locale: Locale;
  line: PricedLine;
  customization: NonNullable<CartCatalogItem["customization"]>;
  copy: CartCopy;
}) {
  const id = useId();
  const options = line.options!;
  const t = copy.customize;

  return (
    <fieldset className="grid gap-4 rounded-2xl border border-line bg-surface-2/50 p-4 sm:ml-15 sm:grid-cols-2">
      <legend className="sr-only">{t.title}</legend>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-format`} className="text-sm font-semibold text-text">
          {t.format}
        </label>
        <div className="relative">
          <select
            id={`${id}-format`}
            value={options.format}
            onChange={(event) => cart.setOptions(line.id, { format: event.target.value })}
            className={`${inputClasses} h-12 cursor-pointer appearance-none pr-11`}
          >
            {customization.formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-subtle"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-text`} className="flex items-baseline justify-between gap-3 text-sm font-semibold text-text">
          <span>{t.text}</span>
          <span className="tabular text-xs font-normal text-subtle">
            {options.text.length}/{customization.textMaxLength}
          </span>
        </label>
        <input
          id={`${id}-text`}
          type="text"
          value={options.text}
          maxLength={customization.textMaxLength}
          placeholder={t.textPlaceholder}
          onChange={(event) => cart.setOptions(line.id, { text: event.target.value })}
          className={`${inputClasses} h-12`}
        />
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-3.5 text-sm transition-colors hover:border-line-strong has-[:checked]:border-accent/50 has-[:checked]:bg-accent-soft/50 sm:col-span-2">
        <input
          type="checkbox"
          checked={options.logo}
          onChange={(event) => cart.setOptions(line.id, { logo: event.target.checked })}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md accent-accent"
        />
        <span className="flex flex-col gap-0.5">
          <span className="font-semibold text-text">{t.logo}</span>
          <span className="tabular text-subtle">{t.logoExtra.replace("{price}", formatCents(customization.logoExtraCents, locale))}</span>
        </span>
      </label>
    </fieldset>
  );
}

function QuantityStepper({ line, copy, label }: { line: PricedLine; copy: CartCopy; label: (template: string) => string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const value = Number.parseInt(draft, 10);
    if (Number.isFinite(value) && value > 0) cart.setQuantity(line.id, value);
    setDraft(null);
  };
  const stepClasses =
    "grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex shrink-0 items-center rounded-full border border-line bg-surface p-0.5">
      <button
        type="button"
        onClick={() => cart.setQuantity(line.id, line.quantity - 1)}
        disabled={line.quantity <= 1}
        aria-label={label(copy.decrease)}
        className={stepClasses}
      >
        <MinusIcon size={16} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={maxQuantity}
        value={draft ?? line.quantity}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
        }}
        aria-label={label(`${copy.quantity}: {name}`)}
        className="tabular h-10 w-10 [appearance:textfield] bg-transparent text-center text-base font-semibold text-text focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => cart.setQuantity(line.id, line.quantity + 1)}
        disabled={line.quantity >= maxQuantity}
        aria-label={label(copy.increase)}
        className={stepClasses}
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

function QuickAdd({ title, items, addLabel }: { title: string; items: CartCatalogItem[]; addLabel: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="cart-quick-add" className="flex flex-col gap-4">
      <h2 id="cart-quick-add" className="eyebrow">
        {title}
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
              <ProductGlyph icon={item.icon} size={18} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <Link href={item.href} className="truncate text-sm font-semibold text-text hover:text-accent-text">
                {item.shortName}
              </Link>
              <span className="truncate text-xs text-subtle">{item.billingLabel}</span>
            </span>
            <button
              type="button"
              onClick={() => cart.add(item.id)}
              aria-label={`${addLabel}: ${item.name}`}
              className={buttonClasses("secondary", "sm", "h-10 shrink-0 px-3.5")}
            >
              <PlusIcon size={15} />
              <span aria-hidden="true">{addLabel}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
