import Link from "next/link";
import type { ReactNode } from "react";
import { products } from "@/content/products";
import { getProductCopy } from "@/content/product-copy";
import { sectors } from "@/content/sectors";
import { ui } from "@/content/ui";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import type { Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { Logo } from "./Logo";

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

export function Footer({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const companyLinks: FooterLink[] = [
    { href: href(locale, { key: "about" }), label: t.nav.about },
    { href: href(locale, { key: "contact" }), label: t.nav.contact },
    { href: href(locale, { key: "book" }), label: t.nav.bookDemo },
    { href: href(locale, { key: "requestInfo" }), label: t.common.requestInfo },
  ];
  const resourceLinks: FooterLink[] = [
    { href: href(locale, { key: "docs" }), label: t.nav.docs },
    { href: href(locale, { key: "products" }), label: t.nav.allProducts },
    ...sectors.map((sector) => ({
      href: href(locale, { key: "sector", sectorId: sector.id }),
      label: sector.copy[locale].name,
    })),
  ];
  const legalLinks: FooterLink[] = [
    { href: href(locale, { key: "privacy" }), label: locale === "pt" ? "Política de privacidade" : "Privacy policy" },
    { href: href(locale, { key: "cookies" }), label: locale === "pt" ? "Política de cookies" : "Cookie policy" },
    { href: href(locale, { key: "terms" }), label: locale === "pt" ? "Termos e condições" : "Terms and conditions" },
    { href: "https://www.livroreclamacoes.pt", label: locale === "pt" ? "Livro de Reclamações" : "Complaints book", external: true },
  ];

  return (
    <footer className="border-t border-line bg-bg-soft pb-20 sm:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="flex flex-col gap-5 md:col-span-4">
          <Logo href={href(locale, { key: "home" })} label="Steevanz" />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">{t.footer.blurb}</p>
          <ul className="flex flex-col gap-2.5 text-sm text-muted">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-6 items-center gap-2 hover:text-text">
                <MailIcon size={16} /> {site.email}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="inline-flex min-h-6 items-center gap-2 hover:text-text">
                <PhoneIcon size={16} /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(t.common.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-6 items-center gap-2 hover:text-text"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center gap-2 hover:text-text">
                <InstagramIcon size={16} /> {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
        <FooterColumn title={t.footer.productsTitle} className="md:col-span-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={href(locale, { key: "product", productId: product.id })} className="inline-block py-0.5 hover:text-text">
                {getProductCopy(product.id, locale).shortName}
              </Link>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title={t.footer.resourcesTitle} className="md:col-span-2">
          <FooterLinks links={resourceLinks} />
        </FooterColumn>
        <div className="flex flex-col gap-10 md:col-span-3">
          <FooterColumn title={t.footer.companyTitle}>
            <FooterLinks links={companyLinks} />
          </FooterColumn>
          <FooterColumn title={t.footer.legalTitle}>
            <FooterLinks links={legalLinks} />
          </FooterColumn>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. {t.footer.rights} {t.footer.pricesNote}
          </p>
          <p>{t.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <>
      {links.map((link) => (
        <li key={link.href}>
          {link.external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-block py-0.5 hover:text-text">
              {link.label}
            </a>
          ) : (
            <Link href={link.href} className="inline-block py-0.5 hover:text-text">
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </>
  );
}

function FooterColumn({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="eyebrow mb-4">{title}</h2>
      <ul className="flex flex-col gap-2 text-sm text-muted">{children}</ul>
    </div>
  );
}
