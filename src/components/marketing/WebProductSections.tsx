import type { WebProductCopy } from "@/content/types";
import { webSharedCopy, type WebProductId } from "@/content/web-products";
import { Check, MinusIcon, PlusIcon } from "@/components/icons";
import { Section, SectionHeader } from "@/components/ui/Section";
import { localize, type Locale } from "@/lib/i18n";

/** «Modelos por setor»: text-only starting points per sector for a website product. */
export function WebModelosSection({ locale, productId }: { locale: Locale; productId: WebProductId }) {
  const t = localize(webSharedCopy, locale);
  return (
    <Section labelledBy="modelos-title">
      <SectionHeader id="modelos-title" eyebrow={t.modelosEyebrow} title={t.modelosTitle} lead={t.modelosLead} />
      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.modelos.map((modelo, index) => (
          <li
            key={modelo.id}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${(index % 3) * 80}ms` }}
            className="card flex flex-col gap-3 p-6"
          >
            <h3 className="text-lg font-semibold text-text">{modelo.name}</h3>
            <p className="text-[0.95rem] leading-relaxed text-muted">{modelo.includes[productId]}</p>
            <p className="mt-auto border-t border-line pt-3 text-sm text-muted">
              <span className="font-semibold text-text">{t.connectionsLabel}:</span> {modelo.connections}
            </p>
          </li>
        ))}
      </ul>
      <p data-reveal className="mt-8 flex max-w-3xl gap-3 text-[0.95rem] leading-relaxed text-muted">
        <Check size={18} className="mt-0.5 shrink-0 text-success" />
        {t.modelosAll}
      </p>
    </Section>
  );
}

/** The legal and practical basics every website product is blocalize(ui, locale)t with. */
export function WebRulesSection({ locale, productId }: { locale: Locale; productId: WebProductId }) {
  const t = localize(webSharedCopy, locale);
  const rules = productId === "online-shop" ? [...t.rules, ...t.shopRules] : t.rules;
  return (
    <Section tone="soft" labelledBy="rules-title">
      <div data-reveal className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-surface-inverse p-7 text-inverse sm:p-10">
        <p className="font-mono text-xs tracking-[0.16em] text-gold uppercase">{t.rulesEyebrow}</p>
        <h2 id="rules-title" className="display max-w-2xl text-3xl sm:text-4xl">
          {t.rulesTitle}
        </h2>
        <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule} className="flex gap-3 text-[0.95rem]">
              <Check size={18} className="mt-0.5 shrink-0 text-gold" />
              <span className="opacity-90">{rule}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-white/15 pt-5 text-sm opacity-75">{t.rulesNote}</p>
      </div>
    </Section>
  );
}

/** Below the price card: what is not included, the priced options and the monthly plan. */
export function WebExtras({ locale, web }: { locale: Locale; web: WebProductCopy }) {
  const t = localize(webSharedCopy, locale);
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div data-reveal className="card p-7 sm:p-10">
        <h3 className="display text-2xl sm:text-3xl">{t.addOnsTitle}</h3>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {web.addOns.map((addOn) => (
            <li key={addOn.name} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <span className="flex gap-3 text-[0.95rem] text-muted">
                <PlusIcon size={16} className="mt-1 shrink-0 text-accent-text" />
                {addOn.name}
              </span>
              <span className="tabular pl-7 text-[0.95rem] font-semibold whitespace-nowrap text-text sm:pl-0">{addOn.price}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-subtle">{t.addOnsNote}</p>
      </div>
      <div className="flex flex-col gap-6">
        <div data-reveal style={{ ["--reveal-delay" as string]: "100ms" }} className="card flex flex-col gap-4 p-7 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-xl font-semibold text-text">{t.monthlyTitle}</h3>
            <p className="tabular font-semibold text-accent-text">{web.monthlyPlan.price}</p>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-muted">{web.monthlyPlan.body}</p>
          <ul className="flex flex-col gap-2.5">
            {web.monthlyPlan.points.map((point) => (
              <li key={point} className="flex gap-3 text-[0.95rem] text-muted">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                  <Check size={12} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={{ ["--reveal-delay" as string]: "180ms" }} className="card flex flex-col gap-4 p-7 sm:p-8">
          <h3 className="text-xl font-semibold text-text">{t.notIncludedTitle}</h3>
          <ul className="flex flex-col gap-2.5">
            {web.notIncluded.map((item) => (
              <li key={item} className="flex gap-3 text-[0.95rem] text-muted">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-surface-2 text-subtle">
                  <MinusIcon size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
