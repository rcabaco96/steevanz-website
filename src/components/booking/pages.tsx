import type { CSSProperties, ReactNode } from "react";
import { Check, MailIcon, WhatsAppIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { bookingCopy, infoRequestCopy, waitlistParamValues } from "@/content/booking";
import { getProductCopy } from "@/content/product-copy";
import { isProductId, products } from "@/content/products";
import { sectors } from "@/content/sectors";
import { ui } from "@/content/ui";
import { getAvailability } from "@/lib/booking/availability";
import { otherSectorValue } from "@/lib/booking/schema";
import { utmKeys, type LeadKind } from "@/lib/booking/types";
import type { Locale } from "@/lib/i18n";
import { bookingHref, bookingProductParam, href } from "@/lib/routes";
import { serviceSupabaseConfig } from "@/lib/supabase/env";
import { site, whatsappUrl } from "@/lib/site";
import { BookingFlow } from "./BookingFlow";
import { InfoRequestForm } from "./InfoRequestForm";
import type { SelectOption } from "./fields";

export type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: SearchParams, key: string): string {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function productOptions(locale: Locale): SelectOption[] {
  return products.map((product) => ({ value: product.id, label: getProductCopy(product.id, locale).name }));
}

function sectorOptions(locale: Locale): SelectOption[] {
  return [
    ...sectors.map((sector) => ({ value: sector.id, label: sector.copy[locale].name })),
    { value: otherSectorValue, label: bookingCopy[locale].form.sectorOther },
  ];
}

function trackingFrom(params: SearchParams): Record<string, string> {
  return Object.fromEntries(utmKeys.map((key) => [key, firstParam(params, key).slice(0, 300)]));
}

function productFrom(params: SearchParams): string {
  const candidate = firstParam(params, bookingProductParam) || firstParam(params, "product");
  return isProductId(candidate) ? candidate : "";
}

function PageIntro({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children?: ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <p data-reveal className="eyebrow">
        {eyebrow}
      </p>
      <h1 data-reveal style={{ "--reveal-delay": "60ms" } as CSSProperties} className="display text-[2.4rem] sm:text-6xl">
        {title}
      </h1>
      <p data-reveal style={{ "--reveal-delay": "120ms" } as CSSProperties} className="max-w-2xl text-lg leading-relaxed text-muted">
        {lead}
      </p>
      {children}
    </div>
  );
}

function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div aria-hidden="true" className="glow-backdrop absolute inset-x-0 top-0 -z-10 h-[40rem]" />
      <div aria-hidden="true" className="dot-grid absolute inset-x-0 top-0 -z-10 h-[28rem] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-page flex flex-col gap-10 sm:gap-14">{children}</div>
    </div>
  );
}

function ContactFallback({ locale, title, body, cta }: { locale: Locale; title: string; body: string; cta?: { href: string; label: string } }) {
  const t = ui[locale].common;
  return (
    <div role="status" className="card flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="display text-2xl sm:text-3xl">{title}</h2>
        <p className="text-muted">{body}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={`mailto:${site.email}`} className={buttonClasses("primary", "md")}>
          <MailIcon size={18} />
          {site.email}
        </a>
        <a href={whatsappUrl(t.whatsappMessage)} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "md")}>
          <WhatsAppIcon size={18} />
          {t.whatsapp}
        </a>
        {cta ? (
          <a href={cta.href} className={buttonClasses("ghost", "md")}>
            {cta.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export async function BookingPageView({ locale, searchParams }: { locale: Locale; searchParams: SearchParams }) {
  const copy = bookingCopy[locale];
  const availability = await getAvailability();

  return (
    <PageFrame>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead}>
        <ul data-reveal style={{ "--reveal-delay": "180ms" } as CSSProperties} className="flex flex-wrap gap-2 pt-1">
          {copy.perks.map((perk) => (
            <li key={perk} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-sm text-muted backdrop-blur">
              <Check size={15} className="text-accent-text" />
              {perk}
            </li>
          ))}
        </ul>
      </PageIntro>
      <div data-reveal style={{ "--reveal-delay": "220ms" } as CSSProperties} className="mx-auto w-full max-w-5xl">
        {availability.ok ? (
          <BookingFlow
            locale={locale}
            copy={copy}
            products={productOptions(locale)}
            sectors={sectorOptions(locale)}
            initialProductId={productFrom(searchParams)}
            initialDays={availability.days}
            timeZone={availability.timeZone}
            tracking={trackingFrom(searchParams)}
            links={{
              privacy: href(locale, { key: "privacy" }),
              requestInfo: href(locale, { key: "requestInfo" }),
              home: href(locale, { key: "home" }),
            }}
          />
        ) : (
          <ContactFallback
            locale={locale}
            title={copy.unavailableTitle}
            body={copy.unavailableBody}
            cta={{ href: href(locale, { key: "requestInfo" }), label: copy.unavailableCta }}
          />
        )}
      </div>
    </PageFrame>
  );
}

export function InfoRequestPageView({ locale, searchParams }: { locale: Locale; searchParams: SearchParams }) {
  const copy = infoRequestCopy[locale];
  const kindParam = firstParam(searchParams, "tipo") || firstParam(searchParams, "type");
  const initialKind: LeadKind = waitlistParamValues.includes(kindParam) ? "waitlist" : "info_request";
  const productId = productFrom(searchParams);
  const configured = serviceSupabaseConfig() !== null;
  if (!configured) console.error("[lead] Supabase is not configured; showing contact fallback");

  return (
    <PageFrame>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
      <div data-reveal style={{ "--reveal-delay": "180ms" } as CSSProperties} className="mx-auto w-full max-w-3xl">
        {configured ? (
        <InfoRequestForm
          locale={locale}
          copy={copy}
          products={productOptions(locale)}
          sectors={sectorOptions(locale)}
          initialProductId={productId}
          initialKind={initialKind}
          tracking={trackingFrom(searchParams)}
          links={{
            privacy: href(locale, { key: "privacy" }),
            book: bookingHref(locale, isProductId(productId) ? productId : undefined),
            home: href(locale, { key: "home" }),
          }}
        />
        ) : (
          <ContactFallback locale={locale} title={copy.unavailableTitle} body={copy.unavailableBody} />
        )}
      </div>
    </PageFrame>
  );
}
