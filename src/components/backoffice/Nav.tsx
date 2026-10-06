"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLink {
  href: string;
  label: string;
  exact?: boolean;
}

export function BackofficeNav({ links, label }: { links: NavLink[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={[
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active ? "bg-surface-inverse text-inverse" : "text-muted hover:bg-surface-2 hover:text-text",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
