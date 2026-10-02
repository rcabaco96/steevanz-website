"use client";

import Link from "next/link";
import { CartIcon, Check, PlusIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { ProductId } from "@/content/types";
import { cart, useCartCount } from "@/lib/cart/store";

interface AddToCartButtonProps {
  productId: ProductId;
  cartHref: string;
  labels: { add: string; inCart: string; added: string };
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AddToCartButton({ productId, cartHref, labels, variant = "secondary", size = "lg", className = "" }: AddToCartButtonProps) {
  const count = useCartCount(productId);
  const iconSize = size === "sm" ? 15 : 18;

  return (
    <>
      {count ? (
        <Link href={cartHref} className={buttonClasses(variant, size, className)}>
          <Check size={iconSize} className="text-success" />
          {labels.inCart}
          <span className="tabular rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-text">{count}</span>
        </Link>
      ) : (
        <button type="button" onClick={() => cart.add(productId)} className={buttonClasses(variant, size, className)}>
          {size === "sm" ? <PlusIcon size={iconSize} /> : <CartIcon size={iconSize} />}
          {labels.add}
        </button>
      )}
      <span role="status" className="sr-only">
        {count ? labels.added : ""}
      </span>
    </>
  );
}
