import type { ReactNode } from "react";
import type { MenuLanguage } from "@/lib/video-menus/i18n";

// The six languages' flags, drawn small and simplified, the same on every phone and computer
// (Windows shows emoji flags as two letters). Decorative: the language's name is always beside them
// or in the button's label.

const flags: Record<MenuLanguage, { viewBox: string; body: ReactNode }> = {
  pt: {
    viewBox: "0 0 30 20",
    body: (
      <>
        <rect width="12" height="20" fill="#046a38" />
        <rect x="12" width="18" height="20" fill="#da291c" />
        <circle cx="12" cy="10" r="4.6" fill="#ffe900" />
        <circle cx="12" cy="10" r="3.2" fill="#da291c" />
        <rect x="10.6" y="8" width="2.8" height="3.6" rx="0.6" fill="#fff" />
      </>
    ),
  },
  en: {
    viewBox: "0 0 60 30",
    body: (
      <>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0 60 30M60 0 0 30" stroke="#c8102e" strokeWidth="2" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
      </>
    ),
  },
  es: {
    viewBox: "0 0 30 20",
    body: (
      <>
        <rect width="30" height="20" fill="#aa151b" />
        <rect y="5" width="30" height="10" fill="#f1bf00" />
      </>
    ),
  },
  fr: {
    viewBox: "0 0 30 20",
    body: (
      <>
        <rect width="10" height="20" fill="#002654" />
        <rect x="10" width="10" height="20" fill="#fff" />
        <rect x="20" width="10" height="20" fill="#ce1126" />
      </>
    ),
  },
  de: {
    viewBox: "0 0 30 20",
    body: (
      <>
        <rect width="30" height="6.67" fill="#000" />
        <rect y="6.67" width="30" height="6.67" fill="#dd0000" />
        <rect y="13.33" width="30" height="6.67" fill="#ffce00" />
      </>
    ),
  },
  it: {
    viewBox: "0 0 30 20",
    body: (
      <>
        <rect width="10" height="20" fill="#009246" />
        <rect x="10" width="10" height="20" fill="#fff" />
        <rect x="20" width="10" height="20" fill="#ce2b37" />
      </>
    ),
  },
};

/** A language's flag, 3:2, `size` px tall. */
export function LanguageFlag({ language, size = 16, className = "" }: { language: MenuLanguage; size?: number; className?: string }) {
  const flag = flags[language];
  return (
    <svg
      aria-hidden="true"
      viewBox={flag.viewBox}
      width={Math.round(size * 1.5)}
      height={size}
      preserveAspectRatio="xMidYMid slice"
      className={`shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] ${className}`}
    >
      {flag.body}
    </svg>
  );
}
