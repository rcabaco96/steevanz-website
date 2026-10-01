"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ProductFamily, ProductIcon } from "@/content/products";
import { ArrowRight, ChevronDown, CloseIcon, MenuIcon, ProductGlyph } from "@/components/icons";
import type { Locale } from "@/lib/i18n";
import { buttonClasses } from "@/components/ui/Button";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export interface NavProduct {
  href: string;
  name: string;
  tagline: string;
  icon: ProductIcon;
  family: ProductFamily;
}

export interface HeaderLabels {
  products: string;
  sectors: string;
  docs: string;
  about: string;
  contact: string;
  bookDemo: string;
  openMenu: string;
  closeMenu: string;
  allProducts: string;
  mainNavLabel: string;
  themeToggle: string;
  languageSwitch: string;
  languageShort: string;
  homeLabel: string;
  families: Record<ProductFamily, string>;
}

export interface HeaderLinks {
  home: string;
  products: string;
  sectors: string;
  docs: string;
  about: string;
  contact: string;
  book: string;
}

interface HeaderProps {
  locale: Locale;
  labels: HeaderLabels;
  links: HeaderLinks;
  products: NavProduct[];
}

const families: ProductFamily[] = ["nfc", "operations", "ai"];

export function Header({ locale, labels, links, products }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setProductsOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!productsOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!productsRef.current?.contains(event.target as Node)) setProductsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProductsOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [productsOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (target: string) => pathname === target || pathname.startsWith(`${target}/`);
  const simpleLinks = [
    { href: links.sectors, label: labels.sectors },
    { href: links.docs, label: labels.docs },
    { href: links.about, label: labels.about },
    { href: links.contact, label: labels.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen
            ? "border-b border-line/80 bg-bg/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
          <Logo href={links.home} label={labels.homeLabel} />

          <nav aria-label={labels.mainNavLabel} className="hidden items-center gap-1 lg:flex">
            <div ref={productsRef} className="relative">
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-controls="products-menu"
                onClick={() => setProductsOpen((open) => !open)}
                className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.95rem] font-medium transition-colors hover:bg-surface-2 ${
                  isActive(links.products) ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {labels.products}
                <ChevronDown size={16} className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`} />
              </button>
                  <div
                    id="products-menu"
                    inert={!productsOpen}
                    className={`card absolute top-[calc(100%+0.75rem)] left-1/2 w-[min(58rem,calc(100vw-4rem))] origin-top p-3 transition-[opacity,transform,visibility] duration-200 ease-(--ease-out-expo) ${
                      productsOpen ? "visible -translate-x-1/2 translate-y-0 scale-100 opacity-100" : "invisible -translate-x-1/2 translate-y-2 scale-[0.98] opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {families.map((family) => (
                        <div key={family} className="flex flex-col gap-1 rounded-2xl p-2">
                          <p className="eyebrow px-3 pt-2 pb-1">{labels.families[family]}</p>
                          {products
                            .filter((product) => product.family === family)
                            .map((product) => (
                              <Link
                                key={product.href}
                                href={product.href}
                                className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-surface-2"
                              >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
                                  <ProductGlyph icon={product.icon} size={18} />
                                </span>
                                <span className="flex flex-col">
                                  <span className="text-sm font-semibold text-text">{product.name}</span>
                                  <span className="text-[0.8rem] leading-snug text-subtle">{product.tagline}</span>
                                </span>
                              </Link>
                            ))}
                        </div>
                      ))}
                    </div>
                    <Link
                      href={links.products}
                      className="mt-2 flex items-center justify-between rounded-xl bg-surface-2 px-5 py-3 text-sm font-semibold text-text transition-colors hover:text-accent-text"
                    >
                      {labels.allProducts}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
            </div>
            {simpleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors hover:bg-surface-2 ${
                  isActive(link.href) ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageSwitch locale={locale} label={labels.languageSwitch} short={labels.languageShort} />
            <ThemeToggle label={labels.themeToggle} />
            <span className="ml-2 hidden md:block">
              <Link href={links.book} className={buttonClasses("primary", "sm")}>
                {labels.bookDemo}
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
              className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-line text-text lg:hidden"
            >
              {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>

          {menuOpen ? (
            <div
              id="mobile-menu"
              className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg motion-safe:animate-[menu-in_0.25s_var(--ease-out-expo)] lg:hidden"
            >
              <nav aria-label={labels.mainNavLabel} className="container-page flex flex-col gap-8 py-8">
                {families.map((family) => (
                  <div key={family} className="flex flex-col gap-1">
                    <p className="eyebrow pb-2">{labels.families[family]}</p>
                    {products
                      .filter((product) => product.family === family)
                      .map((product) => (
                        <Link key={product.href} href={product.href} className="flex items-center gap-3 rounded-xl py-2.5 text-lg font-medium text-text">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent-text">
                            <ProductGlyph icon={product.icon} size={18} />
                          </span>
                          {product.name}
                        </Link>
                      ))}
                  </div>
                ))}
                <div className="flex flex-col gap-1 border-t border-line pt-6">
                  <Link href={links.products} className="py-2 text-lg font-medium text-text">
                    {labels.allProducts}
                  </Link>
                  {simpleLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="py-2 text-lg font-medium text-text">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <Link href={links.book} className={buttonClasses("primary", "lg", "w-full")}>
                  {labels.bookDemo}
                </Link>
              </nav>
            </div>
          ) : null}
      </header>
    </>
  );
}
