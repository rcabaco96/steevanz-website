import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { content } from "./content";

export type Lang = "pt" | "en";

const STORAGE_KEY = "steevanz-lang";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "pt";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "pt" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "pt";
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  c: (typeof content)["pt"];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggle: () => setLangState((l) => (l === "pt" ? "en" : "pt")),
      c: content[lang],
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
