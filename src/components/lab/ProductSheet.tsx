"use client";

import { useEffect, useRef, useState } from "react";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { sectors } from "@/content/sectors";
import type { ProductId } from "@/content/types";
import { href } from "@/lib/routes";
import { AboutView, ContactView, ProductsView } from "./InfoViews";
import { ProductDetail } from "./ProductDetail";

type SheetPage =
  | { kind: "product"; id: ProductId }
  | { kind: "about" }
  | { kind: "contact" }
  | { kind: "products" }
  | { kind: "frame"; name: string; src: string };

/** Pages that open over the homepage. Forms (booking, info request) load as an embedded page. */
const PAGES = new Map<string, SheetPage>([
  ...products.map((product) => [href("pt", { key: "product", productId: product.id }), { kind: "product", id: product.id }] as [string, SheetPage]),
  [href("pt", { key: "about" }), { kind: "about" }],
  [href("pt", { key: "contact" }), { kind: "contact" }],
  [href("pt", { key: "products" }), { kind: "products" }],
  [href("pt", { key: "book" }), { kind: "frame", name: "Agendar demonstração", src: href("pt", { key: "book" }) }],
  [href("pt", { key: "requestInfo" }), { kind: "frame", name: "Pedir informação", src: href("pt", { key: "requestInfo" }) }],
  [href("pt", { key: "sectors" }), { kind: "frame", name: "Setores", src: href("pt", { key: "sectors" }) }],
  ...sectors.map(
    (sector) =>
      [
        href("pt", { key: "sector", sectorId: sector.id }),
        { kind: "frame", name: sector.copy.pt.name, src: href("pt", { key: "sector", sectorId: sector.id }) },
      ] as [string, SheetPage],
  ),
  [href("pt", { key: "docs" }), { kind: "frame", name: "Documentação", src: href("pt", { key: "docs" }) }],
]);

/** Resolves a link to a sheet page, keeping its query string for embedded forms. */
function resolvePage(pathname: string, search: string): SheetPage | undefined {
  const page = PAGES.get(pathname);
  if (page?.kind !== "frame") return page;
  const params = new URLSearchParams(search);
  params.set("embed", "1");
  return { ...page, src: `${page.src}?${params.toString()}` };
}

function pageName(page: SheetPage) {
  if (page.kind === "product") return getProductCopy(page.id, "pt").shortName;
  if (page.kind === "frame") return page.name;
  return page.kind === "about" ? "Sobre nós" : page.kind === "contact" ? "Contacto" : "Produtos";
}

function PageBody({ page }: { page: SheetPage }) {
  if (page.kind === "product") return <ProductDetail productId={page.id} headingLevel={2} />;
  if (page.kind === "about") return <AboutView />;
  if (page.kind === "contact") return <ContactView />;
  if (page.kind === "frame") return <iframe className="sheet-frame" src={page.src} title={page.name} />;
  return <ProductsView />;
}

type SheetState = "closed" | "open" | "closing";

/**
 * Opens product pages over the homepage, in the same tab. Any link to a product
 * page is intercepted: the URL changes (shareable, back button works) while the
 * homepage stays alive underneath; closing returns to the exact scroll position.
 * A direct visit to the same URL renders the standalone page instead.
 */
export function ProductSheet({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [page, setPage] = useState<SheetPage | null>(null);
  const [state, setState] = useState<SheetState>("closed");
  const panel = useRef<HTMLDivElement>(null);
  const openChange = useRef(onOpenChange);

  useEffect(() => {
    openChange.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    let closeTimer = 0;

    const show = (next: SheetPage) => {
      window.clearTimeout(closeTimer);
      setPage(next);
      setState("open");
      openChange.current(true);
      panel.current?.scrollTo({ top: 0 });
    };
    const hide = () => {
      setState("closing");
      openChange.current(false);
      closeTimer = window.setTimeout(() => {
        setState("closed");
        setPage(null);
      }, 650);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
      const next = resolvePage(link.pathname, link.search);
      if (!next) return;
      event.preventDefault();
      window.history.pushState({ steevanzSheet: link.pathname }, "", link.pathname + link.search);
      show(next);
    };
    const onPop = () => {
      const next = resolvePage(window.location.pathname, window.location.search);
      if (next) show(next);
      else hide();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && PAGES.has(window.location.pathname)) window.history.back();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(closeTimer);
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => {
    if (window.history.state?.steevanzSheet) window.history.back();
    else {
      window.history.replaceState(null, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  if (!page) return null;
  const name = pageName(page);

  return (
    <div className="sheet" data-state={state} role="dialog" aria-modal="true" aria-label={name}>
      <button type="button" className="sheet-backdrop" aria-label="Fechar" onClick={close} />
      <div ref={panel} className="sheet-panel" data-lenis-prevent>
        <div className="sheet-bar">
          <button type="button" className="sheet-back" onClick={close}>
            <span aria-hidden="true">←</span> Voltar à página inicial
          </button>
          <span className="sheet-name">{name}</span>
          <button type="button" className="sheet-close" onClick={close} aria-label="Fechar">
            ×
          </button>
        </div>
        <PageBody page={page} />
      </div>
    </div>
  );
}
