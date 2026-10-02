import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import { fontVariables } from "@/app/fonts";
import { cartCopy } from "@/content/cart";
import { products } from "@/content/products";
import { getProductCopy } from "@/content/product-copy";
import { ui } from "@/content/ui";
import { htmlLang, type Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { Footer } from "./Footer";
import { Header, type NavProduct } from "./Header";
import { RevealObserver } from "./RevealObserver";
import { ThemeScript } from "./ThemeScript";
import { WhatsAppButton } from "./WhatsAppButton";

const isVercelDeployment = Boolean(process.env.VERCEL);

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = ui[locale];
  const navProducts: NavProduct[] = products.map((product) => {
    const copy = getProductCopy(product.id, locale);
    return {
      href: href(locale, { key: "product", productId: product.id }),
      name: copy.shortName,
      tagline: copy.tagline,
      icon: product.icon,
      family: product.family,
    };
  });

  return (
    <html lang={htmlLang[locale]} className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeScript />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-transform focus:translate-y-0"
        >
          {t.skipToContent}
        </a>
        <Header
          locale={locale}
          products={navProducts}
          labels={{
            products: t.nav.products,
            sectors: t.nav.sectors,
            docs: t.nav.docs,
            about: t.nav.about,
            contact: t.nav.contact,
            bookDemo: t.nav.bookDemoShort,
            openMenu: t.nav.openMenu,
            closeMenu: t.nav.closeMenu,
            allProducts: t.nav.allProducts,
            mainNavLabel: t.nav.mainNavLabel,
            themeToggle: t.theme.toggle,
            languageSwitch: t.language.switchTo,
            languageShort: t.language.short,
            homeLabel: "Steevanz",
            cart: cartCopy[locale].headerLabel,
            cartWithCount: cartCopy[locale].headerLabelCount,
            families: t.nav.families,
          }}
          links={{
            home: href(locale, { key: "home" }),
            products: href(locale, { key: "products" }),
            sectors: href(locale, { key: "sectors" }),
            docs: href(locale, { key: "docs" }),
            about: href(locale, { key: "about" }),
            contact: href(locale, { key: "contact" }),
            book: href(locale, { key: "book" }),
            cart: href(locale, { key: "cart" }),
          }}
        />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer locale={locale} />
        <WhatsAppButton href={whatsappUrl(t.common.whatsappMessage)} label={t.common.whatsapp} />
        <RevealObserver />
        {isVercelDeployment ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
