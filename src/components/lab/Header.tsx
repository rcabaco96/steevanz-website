"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProductCopy } from "@/content/product-copy";
import { products, type ProductFamily } from "@/content/products";
import { href } from "@/lib/routes";
import { modules } from "./chapters";
import { FlowerMark } from "./FlowerMark";
import { toggleTheme, useTheme } from "./theme";

const GROUPS: { family: ProductFamily; title: string }[] = [
  { family: "nfc", title: "Placas NFC e fidelização" },
  { family: "operations", title: "Reservas e filas" },
  { family: "ai", title: "Inteligência artificial" },
];

const euro = (amount: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button type="button" className="site-icon-btn" onClick={toggleTheme} aria-label={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}>
      {dark ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function ProductsMenu({ onNavigate }: { onNavigate: () => void }) {
  const custom = modules.filter((m) => m.id === "websites" || m.id === "software");
  return (
    <div className="site-menu-grid">
      {GROUPS.map((group) => (
        <div key={group.family}>
          <p className="site-menu-title">{group.title}</p>
          <ul>
            {products
              .filter((product) => product.family === group.family)
              .map((product) => {
                const copy = getProductCopy(product.id, "pt");
                return (
                  <li key={product.id}>
                    <a href={href("pt", { key: "product", productId: product.id })} onClick={onNavigate}>
                      <b>{copy.shortName}</b>
                      <small>
                        desde {euro(product.priceFrom)}
                        {product.priceBilling === "monthly" ? "/mês" : ""}
                      </small>
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
      <div>
        <p className="site-menu-title">Projetos à medida</p>
        <ul>
          {custom.map((m) => (
            <li key={m.id}>
              <a href={m.cta.href} onClick={onNavigate}>
                <b>{m.label}</b>
                <small>{m.offers[0]?.price ? `desde ${m.offers[0].price}` : "orçamento à medida"}</small>
              </a>
            </li>
          ))}
        </ul>
        <a className="site-menu-all" href={href("pt", { key: "products" })} onClick={onNavigate}>
          Ver todos os produtos <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

/**
 * Site header: Produtos (dropdown with every product, grouped), Setores,
 * Documentação, Sobre, Contacto, language, light/dark theme and "Agendar demo".
 * Collapses into a full-screen menu on small screens.
 */
export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => {
    document.documentElement.classList.toggle("site-menu-locked", mobile);
    if (!mobile) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobile(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobile]);

  const links = [
    { label: "Setores", href: href("pt", { key: "sectors" }) },
    { label: "Documentação", href: href("pt", { key: "docs" }) },
    { label: "Sobre", href: href("pt", { key: "about" }) },
    { label: "Contacto", href: href("pt", { key: "contact" }) },
  ];
  const close = () => {
    setMenu(false);
    setMobile(false);
  };

  return (
    <header className="site-header" data-solid={solid} data-menu={menu || mobile}>
      <Link className="site-logo" href="/" aria-label="Steevanz, início" onClick={close}>
        <FlowerMark />
        <span>STEEVANZ</span>
      </Link>

      <nav className="site-nav" aria-label="Principal">
        <div ref={menuRef} className="site-nav-products">
          <button type="button" aria-expanded={menu} aria-controls="site-products-menu" onClick={() => setMenu((v) => !v)}>
            Produtos
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <div id="site-products-menu" className="site-menu" data-open={menu}>
            <ProductsMenu onNavigate={close} />
          </div>
        </div>
        {links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="site-actions">
        <ThemeToggle />
        <a className="site-cta" href={href("pt", { key: "book" })}>
          Agendar demo
        </a>
        <button type="button" className="site-icon-btn site-burger" aria-expanded={mobile} aria-controls="site-mobile-menu" aria-label={mobile ? "Fechar menu" : "Abrir menu"} onClick={() => setMobile((v) => !v)}>
          <span />
          <span />
        </button>
      </div>

      <div id="site-mobile-menu" className="site-mobile" data-open={mobile}>
        <p className="site-menu-title">Produtos</p>
        <ProductsMenu onNavigate={close} />
        <nav className="site-mobile-links" aria-label="Menu">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="site-cta site-mobile-cta" href={href("pt", { key: "book" })} onClick={close}>
          Agendar demonstração
        </a>
      </div>
    </header>
  );
}
