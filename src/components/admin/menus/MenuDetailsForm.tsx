"use client";

import { useState } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { createMenu, updateMenu } from "@/lib/video-menus/actions";
import { initialsLogo, isLogoUrl, menuPublicPath, slugFromName, slugMaxLength, slugProblem, type VideoMenuRow } from "@/lib/video-menus/rules";

const input = `${adminInputClasses} h-11`;

interface MenuDetailsFormProps {
  /** Without a menu: the form that creates one. */
  menu?: VideoMenuRow;
  businesses: { id: string; name: string }[];
}

/**
 * The menu's details: business, address (suggested from the name until it's typed by hand), logo
 * (an image sent from here or an address, with a preview), Instagram, linked business and on/off.
 * After a save (a new updated_at) the fields start again from the saved values, e.g. the uploaded
 * logo's address.
 */
export function MenuDetailsForm({ menu, businesses }: MenuDetailsFormProps) {
  const [name, setName] = useState(menu?.business_name ?? "");
  const [slug, setSlug] = useState(menu?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(menu));
  const [logoUrl, setLogoUrl] = useState(menu?.logo_url ?? "");
  const [file, setFile] = useState<{ file: File; preview: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState(menu?.updated_at);
  if (menu && menu.updated_at !== savedAt) {
    setSavedAt(menu.updated_at);
    setName(menu.business_name);
    setSlug(menu.slug);
    setLogoUrl(menu.logo_url ?? "");
    setFile(null);
  }

  const shownSlug = slugTouched ? slug : slugFromName(name);
  const problem = shownSlug ? slugProblem(shownSlug) : null;
  const preview = file?.preview ?? (logoUrl && isLogoUrl(logoUrl) ? logoUrl : initialsLogo(name || "?"));

  const choose = (chosen: File | undefined) => {
    setFileError(null);
    setFile((current) => {
      if (current) URL.revokeObjectURL(current.preview);
      return null;
    });
    if (!chosen) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(chosen.type)) return setFileError("Escolha uma imagem PNG, JPEG ou WebP.");
    if (chosen.size > 2 * 1024 * 1024) return setFileError("A imagem tem mais de 2 MB. Escolha uma mais pequena.");
    setFile({ file: chosen, preview: URL.createObjectURL(chosen) });
  };

  return (
    // Once sent, the chosen file is the form's (React empties the field when the action ends): the
    // preview goes back to the saved logo until the page shows the new one.
    <div className="contents" onSubmitCapture={() => setFile(null)}>
    <ActionForm action={menu ? updateMenu : createMenu} className="flex flex-col gap-5">
      {menu ? <input type="hidden" name="id" value={menu.id} /> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={adminLabelClasses}>
          Nome do negócio
          <input name="business_name" required maxLength={120} autoComplete="off" placeholder="Café Central" value={name} onChange={(event) => setName(event.target.value)} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Endereço do menu
          <span className="flex items-center overflow-hidden rounded-xl border border-line bg-surface-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
            <span className="shrink-0 pl-3 text-sm text-subtle">/menu/</span>
            <input
              name="slug"
              required
              maxLength={slugMaxLength}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="cafe-central"
              value={shownSlug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value.toLowerCase());
              }}
              aria-invalid={problem ? true : undefined}
              className="h-11 min-w-0 flex-1 bg-surface px-2 text-base text-text focus:outline-none"
            />
          </span>
          {problem ? (
            <span className="text-xs font-normal text-danger">{problem}</span>
          ) : (
            <span className="text-xs font-normal text-subtle">
              {shownSlug ? `Fica em steevanz.com${menuPublicPath(shownSlug)}.` : "Sugerido a partir do nome."}
              {menu ? " Se mudar o endereço, os QR codes e links antigos deixam de funcionar." : null}
            </span>
          )}
        </label>
        <label className={adminLabelClasses}>
          Instagram (opcional)
          <span className="flex items-center overflow-hidden rounded-xl border border-line bg-surface-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
            <span className="shrink-0 pl-3 text-sm text-subtle">@</span>
            <input
              name="instagram"
              maxLength={120}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="cafecentral"
              defaultValue={menu?.instagram ?? ""}
              className="h-11 min-w-0 flex-1 bg-surface px-2 text-base text-text focus:outline-none"
            />
          </span>
        </label>
        <label className={adminLabelClasses}>
          Negócio nas reviews (opcional)
          <select name="review_business_id" defaultValue={menu?.review_business_id ?? ""} className={input}>
            <option value="">Nenhum</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="flex flex-col gap-3 border-t border-line pt-5">
        <legend className="sr-only">Logótipo</legend>
        <span className="text-sm font-medium text-muted">Logótipo</span>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- any address or a local preview (blob URL), as the menu draws it */}
            <img src={preview} alt="Pré-visualização do logótipo" width={80} height={80} className="h-20 w-20 rounded-full border border-line bg-white object-cover" />
            <span className="text-xs text-subtle">{file ? "Nova imagem" : logoUrl ? "Atual" : "Iniciais"}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="text-sm text-muted">Aparece redondo no topo do menu e na abertura. Uma imagem quadrada funciona melhor (PNG, JPEG ou WebP, até 2 MB). Sem logótipo, mostramos as iniciais.</p>
            <div className="flex flex-wrap items-center gap-2">
              <label className={buttonClasses("secondary", "sm", "cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent")}>
                {file ? "Escolher outra imagem" : "Carregar imagem"}
                <input type="file" name="logo_file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} />
              </label>
              {file ? <span className="min-w-0 truncate text-sm text-muted">{file.file.name}</span> : null}
            </div>
            {fileError ? <span className="text-xs text-danger">{fileError}</span> : null}
            <label className={adminLabelClasses}>
              Ou o endereço da imagem
              <input
                name="logo_url"
                maxLength={500}
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="https://…"
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                disabled={Boolean(file)}
                className={`${input} disabled:opacity-60`}
              />
              {file ? <span className="text-xs font-normal text-subtle">A imagem carregada substitui este endereço ao guardar.</span> : null}
            </label>
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-3 border-t border-line pt-5 text-sm text-text">
        <input type="checkbox" name="active" defaultChecked={menu ? menu.active : true} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
        <span>
          <span className="font-semibold">Menu ativo</span>
          <span className="block text-muted">Desligado, a página pública do menu deixa de abrir (dá «página não encontrada»).</span>
        </span>
      </label>

      <div className="border-t border-line pt-5">
        <SubmitButton pendingLabel={menu ? "A guardar…" : "A criar…"}>{menu ? "Guardar menu" : "Criar menu"}</SubmitButton>
      </div>
    </ActionForm>
    </div>
  );
}
