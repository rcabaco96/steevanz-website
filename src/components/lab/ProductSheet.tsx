"use client";

import { useEffect, useRef, useState } from "react";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import type { ProductId } from "@/content/types";
import { href } from "@/lib/routes";
import { ProductDetail } from "./ProductDetail";

const PATH_TO_PRODUCT = new Map<string, ProductId>(
  products.map((product) => [href("pt", { key: "product", productId: product.id }), product.id]),
);

type SheetState = "closed" | "open" | "closing";

/**
 * Opens product pages over the homepage, in the same tab. Any link to a product
 * page is intercepted: the URL changes (shareable, back button works) while the
 * homepage stays alive underneath; closing returns to the exact scroll position.
 * A direct visit to the same URL renders the standalone page instead.
 */
export function ProductSheet({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [productId, setProductId] = useState<ProductId | null>(null);
  const [state, setState] = useState<SheetState>("closed");
  const panel = useRef<HTMLDivElement>(null);
  const openChange = useRef(onOpenChange);

  useEffect(() => {
    openChange.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    let closeTimer = 0;

    const show = (id: ProductId) => {
      window.clearTimeout(closeTimer);
      setProductId(id);
      setState("open");
      openChange.current(true);
      panel.current?.scrollTo({ top: 0 });
    };
    const hide = () => {
      setState("closing");
      openChange.current(false);
      closeTimer = window.setTimeout(() => {
        setState("closed");
        setProductId(null);
      }, 650);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
      const id = PATH_TO_PRODUCT.get(link.pathname);
      if (!id) return;
      event.preventDefault();
      window.history.pushState({ steevanzSheet: id }, "", link.pathname);
      show(id);
    };
    const onPop = () => {
      const id = PATH_TO_PRODUCT.get(window.location.pathname);
      if (id) show(id);
      else hide();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && PATH_TO_PRODUCT.has(window.location.pathname)) window.history.back();
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

  if (!productId) return null;
  const name = getProductCopy(productId, "pt").shortName;

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
        <ProductDetail productId={productId} headingLevel={2} />
      </div>
    </div>
  );
}
