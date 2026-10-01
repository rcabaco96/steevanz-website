"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { switchLocalePath } from "@/lib/routes";

interface LanguageSwitchProps {
  locale: Locale;
  label: string;
  short: string;
}

export function LanguageSwitch({ locale, label, short }: LanguageSwitchProps) {
  const pathname = usePathname();
  const target: Locale = locale === "pt" ? "en" : "pt";
  const targetPath = switchLocalePath(pathname, target);
  return (
    <a
      href={targetPath}
      hrefLang={target === "pt" ? "pt-PT" : "en"}
      lang={target === "pt" ? "pt-PT" : "en"}
      title={label}
      className="grid h-10 min-w-10 place-items-center rounded-full px-2 text-xs font-semibold tracking-[0.12em] text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      <span aria-hidden="true">{short}</span>
      <span className="sr-only">{label}</span>
    </a>
  );
}
