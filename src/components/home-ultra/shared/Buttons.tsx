import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import s from "./ultra.module.css";

// Buttons for /novo-ultra (our own classes, not buttonClasses()). 52px tall on phones, 56px from 1024px,
// hover lift 2px, press scale .97. Every primary call to action carries data-cta (FloatingBar hides
// while any [data-cta] is on screen).

export type CtaVariant = "primary" | "cream" | "creamInk" | "outlineCream";

const variantClass: Record<CtaVariant, string> = {
  primary: s.btnPrimary,
  cream: s.btnCream,
  creamInk: s.btnCreamInk,
  outlineCream: s.btnOutlineCream,
};

function isExternal(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

export function CtaButton({
  href,
  children,
  variant = "primary",
  icon = null,
  block = false,
  cta = true,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  /** "arrow" after the label, "whatsapp" before it. */
  icon?: "arrow" | "whatsapp" | null;
  /** Full width (phones). */
  block?: boolean;
  /** Adds data-cta. Default true. */
  cta?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `${s.btn} ${variantClass[variant]} ${block ? s.btnBlock : ""} ${className}`;
  const content = (
    <>
      {icon === "whatsapp" ? <WhatsAppIcon size={20} /> : null}
      <span>{children}</span>
      {icon === "arrow" ? <ArrowRight size={18} className={s.arrow} /> : null}
    </>
  );
  const data = cta ? { "data-cta": "" } : {};
  if (isExternal(href)) {
    const blank = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        target={blank ? "_blank" : undefined}
        rel={blank ? "noopener noreferrer" : undefined}
        {...data}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel} {...data}>
      {content}
    </Link>
  );
}

/** Secondary text link: 44px tall, underline offset 6px, arrow slides 3px on hover. */
export function TextLink({
  href,
  children,
  tone = "ink",
  arrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "cream";
  arrow?: boolean;
  className?: string;
}) {
  const cls = `${s.textLink} ${tone === "cream" ? s.textLinkCream : ""} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowRight size={18} className={s.arrow} /> : null}
    </>
  );
  return isExternal(href) || href.startsWith("#") ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
