"use client";

import { useActionState } from "react";
import { FormMessage, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { LanguageFlag } from "@/components/menu/LanguageFlag";
import { saveCollectionTranslations, saveDishTranslations } from "@/lib/video-menus/actions";
import { cleanTranslations, filledLanguages, languageNames, translatedLanguages, translationLimits } from "@/lib/video-menus/i18n";

/**
 * «Traduções» of a dish (name and description) or a collection (name), closed by default (owner,
 * 2026-10-19): the six flags say which languages are written (Portuguese is the dish's own text). Written
 * by Steevanz, no translation service. An empty field shows the Portuguese text in that language.
 */
export function TranslationsEditor({
  kind,
  id,
  original,
  translations,
}: {
  kind: "dish" | "collection";
  id: string;
  /** The Portuguese texts, shown as the fields' hints. */
  original: { name: string; description?: string };
  /** As the database keeps them. */
  translations: unknown;
}) {
  const dish = kind === "dish";
  const limits: Record<string, number> = dish ? { name: translationLimits.dishName, description: translationLimits.dishDescription } : { name: translationLimits.collectionName };
  const stored = cleanTranslations(translations, limits);
  const filled = filledLanguages(stored);
  const [state, formAction] = useActionState(dish ? saveDishTranslations : saveCollectionTranslations, null);

  return (
    <details className="group">
      <summary className="inline-flex min-h-10 cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-muted hover:text-text [&::-webkit-details-marker]:hidden">
        Traduções
        <span className="inline-flex items-center gap-1" aria-label={`Traduzido: português${filled.map((language) => `, ${languageNames[language]}`).join("")}`}>
          <LanguageFlag language="pt" size={12} />
          {translatedLanguages.map((language) => (
            <LanguageFlag key={language} language={language} size={12} className={filled.includes(language) ? "" : "opacity-25 grayscale"} />
          ))}
        </span>
        <span className="text-xs font-normal text-subtle">
          {filled.length}/{translatedLanguages.length}
        </span>
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <form action={formAction} className="mt-3 flex flex-col gap-4 rounded-2xl bg-surface-2/50 p-3 sm:p-4">
        <input type="hidden" name="id" value={id} />
        <p className="text-xs text-muted">Em branco: aparece o texto em português. Os preços não mudam.</p>
        {translatedLanguages.map((language) => (
          <fieldset key={language} className="flex flex-col gap-2 border-t border-line pt-3 first-of-type:border-t-0 first-of-type:pt-0">
            <legend className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
              <LanguageFlag language={language} size={14} />
              {languageNames[language]}
            </legend>
            <div className={`grid grid-cols-1 gap-3 ${dish ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]" : ""}`}>
              <label className={adminLabelClasses}>
                Nome
                <input
                  name={`${language}.name`}
                  maxLength={limits.name}
                  autoComplete="off"
                  lang={language}
                  defaultValue={stored[language]?.name ?? ""}
                  placeholder={original.name}
                  className={`${adminInputClasses} h-10`}
                />
              </label>
              {dish ? (
                <label className={adminLabelClasses}>
                  Descrição
                  <textarea
                    name={`${language}.description`}
                    maxLength={limits.description}
                    rows={2}
                    lang={language}
                    defaultValue={stored[language]?.description ?? ""}
                    placeholder={original.description}
                    className={`${adminInputClasses} py-2`}
                  />
                </label>
              ) : null}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…">
            Guardar traduções
          </SubmitButton>
          {state ? <FormMessage ok={state.ok} message={state.message} /> : null}
        </div>
      </form>
    </details>
  );
}
