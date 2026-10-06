import Link from "next/link";
import type { ReactNode } from "react";
import { AlertIcon } from "@/components/icons";
import { Logo } from "@/components/site/Logo";

interface AuthCardProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export function AuthCard({ title, description, children, footer, wide = false }: AuthCardProps) {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
      <div className={`card flex w-full flex-col gap-6 p-6 sm:p-8 ${wide ? "max-w-lg" : "max-w-sm"}`}>
        <Logo href="/" label="Steevanz" />
        <div className="flex flex-col gap-2">
          <h1 className="display text-3xl">{title}</h1>
          {description ? <p className="text-sm text-muted">{description}</p> : null}
        </div>
        {children}
        {footer ? <div className="border-t border-line pt-5 text-sm text-muted">{footer}</div> : null}
      </div>
    </main>
  );
}

export function AuthAlert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
      <AlertIcon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-accent-text underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export { AuthField } from "./AuthField";
