"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { ArrowUpRight } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { checkTagCode, createTag, updateTag, type AvailabilityState } from "@/lib/business-cards/actions";
import {
  buildTagDestination,
  isTagDestinationType,
  programOrigin,
  suggestSlug,
  tagCodeMaxLength,
  tagCodeProblem,
  tagDestinationInputs,
  tagDestinationNames,
  tagDestinationTypes,
  tagPublicPath,
  type KeychainTagRow,
  type TagDestinationInputs,
  type TagDestinationType,
} from "@/lib/business-cards/rules";

const input = `${adminInputClasses} h-11`;

const typeHints: Record<TagDestinationType, string> = {
  whatsapp: "Abre uma conversa no WhatsApp com este número.",
  instagram: "Abre o perfil de Instagram.",
  website: "Abre o site ou uma página do site.",
  custom: "Qualquer endereço https:// (Google Reviews, menu, reservas…).",
};

/** A short random code (letters and digits without look-alikes), for tags that shouldn't be guessed. */
function randomCode(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

/**
 * A keychain or tag: its name, the code in its address (suggested from the name, checked for being free)
 * and where it opens. The destination can change at any time: the tag keeps the same address.
 */
export function TagForm({ tag }: { tag?: KeychainTagRow }) {
  const [label, setLabel] = useState(tag?.label ?? "");
  const [code, setCode] = useState(tag?.code ?? "");
  const [codeTouched, setCodeTouched] = useState(Boolean(tag));
  const [type, setType] = useState<TagDestinationType>(tag && isTagDestinationType(tag.destination_type) ? tag.destination_type : "whatsapp");
  const [inputs, setInputs] = useState<TagDestinationInputs>(() => (tag ? tagDestinationInputs(tag.destination_type, tag.destination_url) : { whatsapp: "", message: "", instagram: "", url: "" }));
  const [active, setActive] = useState(tag ? tag.active : true);
  const [checked, setChecked] = useState<{ code: string; state: AvailabilityState } | null>(null);
  const [savedAt, setSavedAt] = useState(tag?.updated_at);
  if (tag && tag.updated_at !== savedAt) {
    setSavedAt(tag.updated_at);
    setLabel(tag.label);
    setCode(tag.code);
    if (isTagDestinationType(tag.destination_type)) setType(tag.destination_type);
    setInputs(tagDestinationInputs(tag.destination_type, tag.destination_url));
    setActive(tag.active);
  }

  const shownCode = codeTouched ? code : suggestSlug(label, tagCodeMaxLength);
  const codeMessage = shownCode ? tagCodeProblem(shownCode) : null;
  const tagId = tag?.id ?? null;
  const savedCode = tag?.code ?? null;

  useEffect(() => {
    if (!shownCode || tagCodeProblem(shownCode) || shownCode === savedCode) return;
    let current = true;
    const timer = window.setTimeout(() => {
      void checkTagCode(shownCode, tagId)
        .catch((): AvailabilityState => "unknown")
        .then((state) => {
          if (current) setChecked({ code: shownCode, state });
        });
    }, 400);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [shownCode, tagId, savedCode]);

  const availability = !shownCode || codeMessage || shownCode === savedCode ? null : checked?.code === shownCode ? checked.state : "checking";
  const destination = buildTagDestination(type, inputs);
  const touched = type === "whatsapp" ? inputs.whatsapp.trim() : type === "instagram" ? inputs.instagram.trim() : inputs.url.trim();
  const setInput = (key: keyof TagDestinationInputs) => (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setInputs((current) => ({ ...current, [key]: next }));
  };

  return (
    <ActionForm action={tag ? updateTag : createTag} className="flex flex-col gap-6">
      {tag ? <input type="hidden" name="id" value={tag.id} /> : null}
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={adminLabelClasses}>
            Nome
            <input name="label" required maxLength={120} autoComplete="off" placeholder="Porta-chaves Café Central" value={label} onChange={(event) => setLabel(event.target.value)} className={input} />
            <span className="text-xs font-normal text-subtle">Só para nós: para encontrar a tag na lista.</span>
          </label>
          <label className={adminLabelClasses}>
            Código no endereço
            <span className="flex gap-2">
              <span className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl border border-line bg-surface-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
                <span className="shrink-0 pl-3 text-sm text-subtle">/k/</span>
                <input
                  name="code"
                  required
                  maxLength={tagCodeMaxLength}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="cafe-central"
                  value={shownCode}
                  onChange={(event) => {
                    setCodeTouched(true);
                    setCode(event.target.value.toLowerCase());
                  }}
                  aria-invalid={codeMessage || availability === "taken" ? true : undefined}
                  aria-describedby="code-help"
                  className="h-11 min-w-0 flex-1 bg-surface px-2 text-base text-text focus:outline-none"
                />
              </span>
              <button
                type="button"
                onClick={() => {
                  setCodeTouched(true);
                  setCode(randomCode());
                }}
                className={buttonClasses("secondary", "sm", "h-11 shrink-0")}
              >
                Gerar
              </button>
            </span>
            <span id="code-help" aria-live="polite" className="flex flex-col gap-0.5 text-xs font-normal">
              {codeMessage ? (
                <span className="text-danger">{codeMessage}</span>
              ) : (
                <>
                  <span className="text-subtle">{shownCode ? `A tag guarda ${programOrigin.replace("https://", "")}${tagPublicPath(shownCode)}.` : "Sugerido a partir do nome."}</span>
                  {availability === "checking" ? <span className="text-subtle">A confirmar se está livre…</span> : null}
                  {availability === "free" ? <span className="text-success">Livre.</span> : null}
                  {availability === "taken" ? <span className="text-danger">Já existe uma tag com este código. Escolha outro.</span> : null}
                  {tag && shownCode !== tag.code ? <span className="text-gold-text">Atenção: as tags já programadas com o código antigo deixam de abrir.</span> : null}
                </>
              )}
            </span>
          </label>
        </div>
      </section>

      <fieldset className="card flex min-w-0 flex-col gap-4 p-5 sm:p-6">
        <legend className="sr-only">Para onde abre</legend>
        <div className="flex flex-col gap-1">
          <h2 aria-hidden="true" className="text-lg font-semibold tracking-[-0.01em] text-text">
            Para onde abre
          </h2>
          <p className="text-sm text-muted">Pode mudar quando quiser: a tag continua com o mesmo endereço.</p>
        </div>
        <div role="radiogroup" aria-label="Tipo de destino" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tagDestinationTypes.map((option) => (
            <label
              key={option}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                type === option ? "border-accent bg-accent-soft text-accent-text" : "border-line bg-surface text-text hover:bg-surface-2"
              }`}
            >
              <input type="radio" name="destination_type" value={option} checked={type === option} onChange={() => setType(option)} className="sr-only" />
              {tagDestinationNames[option]}
            </label>
          ))}
        </div>
        <p className="text-sm text-muted">{typeHints[type]}</p>

        {type === "whatsapp" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={adminLabelClasses}>
              Número de WhatsApp
              <input name="dest_whatsapp" type="tel" inputMode="tel" maxLength={40} autoComplete="off" placeholder="961 292 679" value={inputs.whatsapp} onChange={setInput("whatsapp")} className={input} />
              <span className="text-xs font-normal text-subtle">Números portugueses podem ir sem +351.</span>
            </label>
            <label className={adminLabelClasses}>
              Mensagem já escrita (opcional)
              <input name="dest_message" maxLength={500} autoComplete="off" placeholder="Olá! Vim pelo porta-chaves." value={inputs.message} onChange={setInput("message")} className={input} />
            </label>
          </div>
        ) : type === "instagram" ? (
          <label className={adminLabelClasses}>
            Conta de Instagram
            <input name="dest_instagram" maxLength={200} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="@steevanz_" value={inputs.instagram} onChange={setInput("instagram")} className={input} />
          </label>
        ) : (
          <label className={adminLabelClasses}>
            {type === "website" ? "Endereço do site" : "Endereço"}
            <input name="dest_url" inputMode="url" maxLength={1000} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={type === "website" ? "www.empresa.pt" : "https://…"} value={inputs.url} onChange={setInput("url")} className={input} />
          </label>
        )}

        <div aria-live="polite" className="rounded-2xl border border-line bg-surface-2/60 p-3 text-sm">
          {destination.ok ? (
            <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="min-w-0">
                <span className="block text-subtle">Abre:</span>
                <span className="block font-mono font-semibold break-all text-text">{destination.value}</span>
              </span>
              <a href={destination.value} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "sm", "shrink-0 self-start sm:self-center")}>
                Testar destino <ArrowUpRight size={15} />
              </a>
            </span>
          ) : (
            <span className={touched ? "text-danger" : "text-subtle"}>{touched ? destination.message : "Preencha o destino para ver o endereço que a tag abre."}</span>
          )}
        </div>

        <label className="flex items-start gap-3 border-t border-line pt-4 text-sm text-text">
          <input type="checkbox" name="active" checked={active} onChange={(event) => setActive(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
          <span>
            <span className="font-semibold">Tag ativa</span>
            <span className="block text-muted">Desligada, a tag deixa de abrir (dá «página não encontrada»).</span>
          </span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel={tag ? "A guardar…" : "A criar…"}>{tag ? "Guardar tag" : "Criar tag"}</SubmitButton>
        {!tag ? <span className="text-sm text-muted">A seguir mostramos o endereço para programar a tag.</span> : null}
      </div>
    </ActionForm>
  );
}
