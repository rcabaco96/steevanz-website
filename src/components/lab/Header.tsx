"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { getProductCopy } from "@/content/product-copy";
import { products, type ProductFamily } from "@/content/products";
import { href } from "@/lib/routes";
import { modules } from "./chapters";
import { FlowerMark } from "./FlowerMark";
import { playHoverSound, playMenuSound, setSoundEnabled, soundEnabled, subscribeSound } from "./menuSound";
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

const MENU_LINKS = [
  { label: "Início", href: href("pt", { key: "home" }) },
  { label: "Produtos", href: href("pt", { key: "products" }) },
  { label: "Setores", href: href("pt", { key: "sectors" }) },
  { label: "Documentação", href: href("pt", { key: "docs" }) },
  { label: "Sobre", href: href("pt", { key: "about" }) },
  { label: "Contacto", href: href("pt", { key: "contact" }) },
  { label: "Agendar demo", href: href("pt", { key: "book" }) },
];

/**
 * Right-hand menu: a line draws out under the button, then each row wipes in from the
 * right, top to bottom; closing runs it backwards. Sections first, then settings
 * (theme, sound, language). Plays the menu sound on open and close.
 */
function SiteMenu() {
  const [open, setOpen] = useState(false);
  const sound = useSyncExternalStore(subscribeSound, soundEnabled, () => true);
  const theme = useTheme();
  const root = useRef<HTMLDivElement>(null);

  const toggle = (next = !open) => {
    if (next === open) return;
    setOpen(next);
    playMenuSound();
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        playMenuSound();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        playMenuSound();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleSound = () => {
    setSoundEnabled(!sound);
    if (!sound) playMenuSound();
  };

  const rows: { key: string; node: ReactNode }[] = [
    ...MENU_LINKS.map((link) => ({
      key: link.label,
      node: (
        <a className="sm-link" href={link.href} onClick={() => setOpen(false)}>
          <span className="sm-label">{link.label}</span>
          <HoverDot />
        </a>
      ),
    })),
    {
      key: "theme",
      node: (
        <button type="button" className="sm-link sm-setting" onClick={toggleTheme}>
          <span className="sm-label">
            <small>Tema</small>
            <span>{theme === "dark" ? "Escuro" : "Claro"}</span>
          </span>
          <HoverDot />
        </button>
      ),
    },
    {
      key: "sound",
      node: (
        <button type="button" className="sm-link sm-setting" aria-pressed={sound} onClick={toggleSound}>
          <span className="sm-label">
            <small>Som</small>
            <span>{sound ? "Ligado" : "Desligado"}</span>
          </span>
          <HoverDot />
        </button>
      ),
    },
    {
      key: "lang",
      node: (
        <a className="sm-link sm-setting" href={href("en", { key: "home" })} hrefLang="en" onClick={() => setOpen(false)}>
          <span className="sm-label">
            <small>Idioma</small>
            <span>
              PT <i>/</i> EN
            </span>
          </span>
          <HoverDot />
        </a>
      ),
    },
  ];

  return (
    <div ref={root} className="sm" data-open={open}>
      <button
        type="button"
        className="sm-toggle"
        aria-expanded={open}
        aria-controls="site-menu-panel"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => toggle()}
      >
        <span />
        <span />
        <span />
      </button>
      <div id="site-menu-panel" className="sm-panel" aria-hidden={!open} inert={!open} style={{ "--n": rows.length } as CSSProperties}>
        <span className="sm-line" />
        <ul className="sm-list">
          {rows.map((row, i) => (
            <li
              key={row.key}
              className={i === MENU_LINKS.length ? "sm-item sm-gap" : "sm-item"}
              style={{ "--i": i } as CSSProperties}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") playHoverSound();
              }}
            >
              {row.node}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HoverDot() {
  return (
    <svg className="sm-dot" viewBox="0 0 10 10" aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill="currentColor" />
    </svg>
  );
}

/**
 * Site header: Produtos (dropdown with every product, grouped), Setores,
 * Documentação, Sobre, Contacto, light/dark theme and "Agendar demo", plus the
 * right-hand menu with every section and the settings.
 */
export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [menu, setMenu] = useState(false);
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

  const links = [
    { label: "Setores", href: href("pt", { key: "sectors" }) },
    { label: "Documentação", href: href("pt", { key: "docs" }) },
    { label: "Sobre", href: href("pt", { key: "about" }) },
    { label: "Contacto", href: href("pt", { key: "contact" }) },
  ];
  const close = () => setMenu(false);

  return (
    <header className="site-header" data-solid={solid} data-menu={menu}>
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
        <SiteMenu />
      </div>
    </header>
  );
}
