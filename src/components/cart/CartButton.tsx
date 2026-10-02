"use client";

import Link from "next/link";
import { CartIcon } from "@/components/icons";
import { useCartCount } from "@/lib/cart/store";

interface CartButtonProps {
  href: string;
  label: string;
  labelWithCount: string;
  active?: boolean;
}

export function CartButton({ href, label, labelWithCount, active = false }: CartButtonProps) {
  const count = useCartCount();
  const accessibleLabel = count ? labelWithCount.replace("{count}", String(count)) : label;

  return (
    <Link
      href={href}
      aria-label={accessibleLabel}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-surface-2 hover:text-text ${active ? "text-text" : "text-muted"}`}
    >
      <CartIcon size={19} />
      {count ? (
        <span
          aria-hidden="true"
          className="tabular absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.7rem] font-semibold text-accent-contrast motion-safe:animate-[menu-in_0.25s_var(--ease-out-expo)]"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
