import { useLanguage } from "../../i18n/LanguageContext";
import type { Lang } from "../../i18n/LanguageContext";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
];

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-(--color-line) bg-(--color-surface-2)/60 p-0.5 font-mono text-[11px] uppercase tracking-[0.14em] ${
        compact ? "" : ""
      }`}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLang(opt.code)}
          aria-pressed={lang === opt.code}
          className={`rounded-full px-2.5 py-1 transition-colors duration-300 ${
            lang === opt.code
              ? "bg-(--color-gold)/20 text-(--color-gold-bright)"
              : "text-(--color-fog) hover:text-(--color-bone)"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
