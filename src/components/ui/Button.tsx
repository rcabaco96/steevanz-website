import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
type ButtonSize = "md" | "lg" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-contrast shadow-[0_10px_30px_-12px_rgb(var(--glow)/0.7)] hover:bg-accent-hover",
  secondary: "border border-line-strong bg-surface text-text hover:border-text/40 hover:bg-surface-2",
  ghost: "text-text hover:bg-surface-2",
  inverse: "bg-surface-inverse text-inverse hover:opacity-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = ""): string {
  return [
    "group/button relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap",
    "transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-300 ease-(--ease-out-expo) active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    extra,
  ].join(" ");
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant, size, className = "", children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
