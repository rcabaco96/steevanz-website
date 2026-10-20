"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { BusinessCardView } from "@/components/business-card/BusinessCardView";
import { buttonClasses } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { BusinessCard } from "@/content/business-cards";
import type { ActionState } from "@/lib/action-state";
import { checkCardSlug, createCard, updateCard, type AvailabilityState } from "@/lib/business-cards/actions";
import {
  cardPublicPath,
  cardSlugMaxLength,
  cardSlugProblem,
  cleanSocials,
  initialsOfName,
  isLocale,
  localeNamesPt,
  normalizeEmail,
  normalizePhone,
  normalizeSocial,
  normalizeWebUrl,
  programOrigin,
  socialNames,
  socialNetworks,
  socialPlaceholders,
  splitName,
  suggestSlug,
  type BusinessCardRow,
} from "@/lib/business-cards/rules";
import { locales, type Locale } from "@/lib/i18n";

const input = `${adminInputClasses} h-11`;

type FieldName =
  | "name"
  | "slug"
  | "locale"
  | "client_name"
  | "given_name"
  | "family_name"
  | "role"
  | "company"
  | "phone"
  | "phone2"
  | "whatsapp"
  | "email"
  | "website"
  | "address"
  | "maps_url"
  | "note"
  | `social_${(typeof socialNetworks)[number]}`;

type Values = Record<FieldName, string>;

function valuesFrom(card?: BusinessCardRow): Values {
  const socials = new Map(cleanSocials(card?.socials).map((social) => [social.network, social.url]));
  return {
    name: card?.name ?? "",
    slug: card?.slug ?? "",
    locale: card?.locale ?? "pt",
    client_name: card?.client_name ?? "",
    given_name: card?.given_name ?? "",
    family_name: card?.family_name ?? "",
    role: card?.role ?? "",
    company: card?.company ?? "",
    phone: card?.phone ?? "",
    phone2: card?.phone2 ?? "",
    whatsapp: card?.whatsapp ?? "",
    email: card?.email ?? "",
    website: card?.website ?? "",
    address: card?.address ?? "",
    maps_url: card?.maps_url ?? "",
    note: card?.note ?? "",
    social_instagram: socials.get("instagram") ?? "",
    social_linkedin: socials.get("linkedin") ?? "",
    social_facebook: socials.get("facebook") ?? "",
    social_tiktok: socials.get("tiktok") ?? "",
    social_youtube: socials.get("youtube") ?? "",
    social_x: socials.get("x") ?? "",
  };
}

/** The photo as it is sent: the centre square of the picture, at most 800 px, as JPEG (phone photos are several MB). */
const photoSide = 800;
async function preparePhoto(file: File): Promise<File | { error: string }> {
  if (!file.type.startsWith("image/")) return { error: "Escolha uma fotografia (PNG, JPEG ou WebP)." };
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { error: "Não foi possível abrir esta fotografia. Escolha outra (PNG, JPEG ou WebP)." };
  }
  const side = Math.min(bitmap.width, bitmap.height);
  const out = Math.max(1, Math.min(photoSide, side));
  const canvas = document.createElement("canvas");
  canvas.width = out;
  canvas.height = out;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return { error: "Não foi possível preparar esta fotografia. Escolha outra." };
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, out, out);
  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, out, out);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
  if (!blob) return { error: "Não foi possível preparar esta fotografia. Escolha outra." };
  if (blob.size > 2 * 1024 * 1024) return { error: "A fotografia continua com mais de 2 MB. Escolha outra." };
  return new File([blob], "foto.jpg", { type: "image/jpeg" });
}

/** The card as the page will show it, from what is typed so far (tidied where it's already valid). */
function previewCard(values: Values, photo: string | null): BusinessCard {
  const pick = (normalized: string | null, raw: string) => (normalized === null ? raw.trim() : normalized) || undefined;
  const split = splitName(values.name);
  const lines = values.address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const socials = socialNetworks
    .map((network) => ({ network, url: normalizeSocial(network, values[`social_${network}`]) }))
    .filter((social): social is { network: (typeof socialNetworks)[number]; url: string } => Boolean(social.url));
  return {
    slug: values.slug || "exemplo",
    locale: isLocale(values.locale) ? values.locale : "pt",
    name: values.name.trim() || "Nome da pessoa",
    givenName: values.given_name || split.givenName,
    familyName: values.family_name || split.familyName,
    role: values.role.trim() || undefined,
    company: values.company.trim() || undefined,
    photo: photo ? { src: photo, width: 512, height: 512 } : undefined,
    phone: pick(normalizePhone(values.phone), values.phone),
    phone2: pick(normalizePhone(values.phone2), values.phone2),
    whatsapp: pick(normalizePhone(values.whatsapp), values.whatsapp),
    email: pick(normalizeEmail(values.email), values.email),
    website: normalizeWebUrl(values.website) || undefined,
    socials: socials.length ? socials : undefined,
    address: lines.length ? { lines, mapsUrl: normalizeWebUrl(values.maps_url) || undefined } : undefined,
  };
}

const availabilityText: Record<AvailabilityState | "checking", { text: string; tone: string } | null> = {
  checking: { text: "A confirmar se está livre…", tone: "text-subtle" },
  free: { text: "Livre.", tone: "text-success" },
  taken: { text: "Já existe um cartão com este endereço. Escolha outro.", tone: "text-danger" },
  invalid: null,
  unknown: null,
};

/** Fades the preview into a skeleton while the save runs longer than ~300 ms (inside the form). */
function PreviewBusy({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => setSlow(true), 300);
    return () => {
      window.clearTimeout(timer);
      setSlow(false);
    };
  }, [pending]);
  return (
    <div aria-busy={slow || undefined} className="relative">
      <div className={slow ? "opacity-35 transition-opacity" : "transition-opacity"}>{children}</div>
      {slow ? (
        <>
          <Skeleton className="absolute inset-0 rounded-[1.75rem] opacity-70" />
          <span role="status" className="sr-only">
            A guardar…
          </span>
        </>
      ) : null}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="card flex min-w-0 flex-col gap-4 p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="flex flex-col gap-1">
        <h2 aria-hidden="true" className="text-lg font-semibold tracking-[-0.01em] text-text">
          {title}
        </h2>
        {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      </div>
      {children}
    </fieldset>
  );
}

interface CardFormProps {
  /** Without a card: the form that creates one. */
  card?: BusinessCardRow;
  /** «Quero um cartão assim» in each language, for the preview. */
  productHrefs: Record<Locale, string>;
}

/**
 * Every field of a business card, with a live preview of its page. The address is suggested from the name
 * (until typed by hand) and checked for being free while typing. The photo is cut to its centre square in
 * the browser and redrawn by the server as a 512 px JPEG. After a save (a new updated_at) the fields start
 * again from the saved values.
 */
export function CardForm({ card, productHrefs }: CardFormProps) {
  const [values, setValues] = useState<Values>(() => valuesFrom(card));
  const [slugTouched, setSlugTouched] = useState(Boolean(card));
  const [active, setActive] = useState(card ? card.active : true);
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [checked, setChecked] = useState<{ slug: string; state: AvailabilityState } | null>(null);
  const photoRef = useRef<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [savedAt, setSavedAt] = useState(card?.updated_at);
  if (card && card.updated_at !== savedAt) {
    setSavedAt(card.updated_at);
    setValues(valuesFrom(card));
    setActive(card.active);
    setRemovePhoto(false);
    setPhoto(null);
  }
  // What the form sends (read when it is submitted).
  useEffect(() => {
    photoRef.current = photo?.file ?? null;
  }, [photo]);

  const slug = slugTouched ? values.slug : suggestSlug(values.name);
  const slugMessage = slug ? cardSlugProblem(slug) : null;
  const cardId = card?.id ?? null;
  const savedSlug = card?.slug ?? null;

  // Is the address free? Asked 400 ms after the last key, only for a valid one that changed.
  useEffect(() => {
    if (!slug || cardSlugProblem(slug) || slug === savedSlug) return;
    let current = true;
    const timer = window.setTimeout(() => {
      void checkCardSlug(slug, cardId)
        .catch((): AvailabilityState => "unknown")
        .then((state) => {
          if (current) setChecked({ slug, state });
        });
    }, 400);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [slug, cardId, savedSlug]);

  const availability: AvailabilityState | "checking" | null =
    !slug || slugMessage || slug === savedSlug ? null : checked?.slug === slug ? checked.state : "checking";

  const set = (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = event.target.value;
    setValues((current) => ({ ...current, [name]: next }));
  };
  const field = (name: FieldName) => ({ name, value: values[name], onChange: set(name) });

  const choosePhoto = async (file: File | undefined) => {
    setPhotoError(null);
    if (!file) return;
    const prepared = await preparePhoto(file);
    if (fileInput.current) fileInput.current.value = "";
    if ("error" in prepared) return setPhotoError(prepared.error);
    setPhoto((current) => {
      if (current) URL.revokeObjectURL(current.preview);
      return { file: prepared, preview: URL.createObjectURL(prepared) };
    });
    setRemovePhoto(false);
  };

  const clearPhoto = () => {
    setPhoto((current) => {
      if (current) URL.revokeObjectURL(current.preview);
      return null;
    });
  };

  // The prepared photo goes with the form (the file field itself has no name: the original can be huge).
  const isEdit = Boolean(card);
  const action = useCallback(
    async (previous: ActionState, formData: FormData): Promise<ActionState> => {
      if (photoRef.current) formData.set("photo_file", photoRef.current);
      return (isEdit ? updateCard : createCard)(previous, formData);
    },
    [isEdit],
  );

  const savedPhoto = removePhoto ? null : (card?.photo_url ?? null);
  const shownPhoto = photo?.preview ?? savedPhoto;
  const preview = previewCard({ ...values, slug }, shownPhoto);
  const derived = splitName(values.name);

  return (
    <ActionForm action={action} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
      <div className="flex min-w-0 flex-col gap-6">
        {card ? <input type="hidden" name="id" value={card.id} /> : null}

        <Section title="Pessoa" hint="O que aparece no topo da página e nos contactos de quem guardar o cartão.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={`${adminLabelClasses} sm:col-span-2`}>
              Nome
              <input {...field("name")} required maxLength={120} autoComplete="off" placeholder="Rogério Cabaço" className={input} />
            </label>
            <label className={adminLabelClasses}>
              Cargo (opcional)
              <input {...field("role")} maxLength={120} autoComplete="off" placeholder="Diretor comercial" className={input} />
            </label>
            <label className={adminLabelClasses}>
              Empresa (opcional)
              <input {...field("company")} maxLength={120} autoComplete="off" placeholder="Steevanz" className={input} />
            </label>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <span className="text-sm font-medium text-muted">Fotografia (opcional)</span>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                {shownPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element -- the saved photo or a local preview (blob URL)
                  <img src={shownPhoto} alt="Pré-visualização da fotografia" width={80} height={80} className="h-20 w-20 rounded-full border border-line bg-white object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid h-20 w-20 place-items-center rounded-full bg-accent-soft font-display text-2xl text-accent-text">
                    {initialsOfName(values.name)}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <p className="text-sm text-muted">Fica redonda. Usamos o quadrado do centro da imagem; uma fotografia de cara, de frente, funciona melhor.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className={buttonClasses("secondary", "sm", "cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent")}>
                    {shownPhoto ? "Escolher outra" : "Carregar fotografia"}
                    <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => void choosePhoto(event.target.files?.[0])} />
                  </label>
                  {photo ? (
                    <button type="button" onClick={clearPhoto} className={buttonClasses("ghost", "sm")}>
                      Não usar esta
                    </button>
                  ) : card?.photo_url ? (
                    <label className="inline-flex items-center gap-2 text-sm text-muted">
                      <input type="checkbox" name="remove_photo" checked={removePhoto} onChange={(event) => setRemovePhoto(event.target.checked)} className="h-4 w-4 accent-accent" />
                      Remover fotografia
                    </label>
                  ) : null}
                </div>
                {photo ? <span className="text-xs text-subtle">Nova fotografia: fica guardada quando carregar em «Guardar».</span> : null}
                {photoError ? (
                  <span role="alert" className="text-xs text-danger">
                    {photoError}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <details className="group border-t border-line pt-4">
            <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-text">
              Nome nos contactos do telemóvel
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                ⌄
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted">Vazio, usamos o nome: a última palavra é o apelido. Mude só se o nome for composto (por exemplo, «Maria da Silva Santos»).</p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={adminLabelClasses}>
                Nome próprio
                <input {...field("given_name")} maxLength={80} autoComplete="off" placeholder={derived.givenName || "Rogério"} className={input} />
              </label>
              <label className={adminLabelClasses}>
                Apelido
                <input {...field("family_name")} maxLength={80} autoComplete="off" placeholder={derived.familyName || "Cabaço"} className={input} />
              </label>
            </div>
          </details>
        </Section>

        <Section title="Contactos" hint="Números portugueses podem ir sem +351. Os campos vazios não aparecem na página.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={adminLabelClasses}>
              Telemóvel
              <input {...field("phone")} type="tel" inputMode="tel" maxLength={40} autoComplete="off" placeholder="961 292 679" className={input} />
            </label>
            <label className={adminLabelClasses}>
              WhatsApp
              <span className="flex gap-2">
                <input {...field("whatsapp")} type="tel" inputMode="tel" maxLength={40} autoComplete="off" placeholder="961 292 679" className={`${input} min-w-0 flex-1`} />
                {values.phone && values.whatsapp !== values.phone ? (
                  <button type="button" onClick={() => setValues((current) => ({ ...current, whatsapp: current.phone }))} className={buttonClasses("secondary", "sm", "h-11 shrink-0")}>
                    Igual ao telemóvel
                  </button>
                ) : null}
              </span>
            </label>
            <label className={adminLabelClasses}>
              Outro telefone (opcional)
              <input {...field("phone2")} type="tel" inputMode="tel" maxLength={40} autoComplete="off" placeholder="210 000 000" className={input} />
            </label>
            <label className={adminLabelClasses}>
              Email
              <input {...field("email")} type="email" inputMode="email" maxLength={200} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="nome@empresa.pt" className={input} />
            </label>
            <label className={`${adminLabelClasses} sm:col-span-2`}>
              Website
              <input {...field("website")} inputMode="url" maxLength={500} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="www.empresa.pt" className={input} />
            </label>
          </div>
        </Section>

        <Section title="Redes sociais" hint="A conta (@nome) ou o endereço completo. Aparecem por esta ordem.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {socialNetworks.map((network) => (
              <label key={network} className={adminLabelClasses}>
                {socialNames[network]}
                <input
                  {...field(`social_${network}`)}
                  inputMode="url"
                  maxLength={500}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={socialPlaceholders[network]}
                  className={input}
                />
              </label>
            ))}
          </div>
        </Section>

        <Section title="Morada (opcional)">
          <div className="grid grid-cols-1 gap-4">
            <label className={adminLabelClasses}>
              Morada, uma linha por linha
              <textarea {...field("address")} rows={3} maxLength={300} placeholder={"Rua de Exemplo, 10\n1000-000 Lisboa"} className={`${adminInputClasses} py-2.5`} />
            </label>
            <label className={adminLabelClasses}>
              Link do Google Maps (opcional)
              <input {...field("maps_url")} inputMode="url" maxLength={500} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="https://maps.app.goo.gl/…" className={input} />
              <span className="text-xs font-normal text-subtle">Vazio, o botão «Abrir no mapa» procura a morada.</span>
            </label>
          </div>
        </Section>

        <Section title="Página e endereço">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={`${adminLabelClasses} sm:col-span-2`}>
              Endereço do cartão
              <span className="flex items-center overflow-hidden rounded-xl border border-line bg-surface-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
                <span className="shrink-0 pl-3 text-sm text-subtle">/c/</span>
                <input
                  name="slug"
                  required
                  maxLength={cardSlugMaxLength}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="rogerio-cabaco"
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    const next = event.target.value.toLowerCase();
                    setValues((current) => ({ ...current, slug: next }));
                  }}
                  aria-invalid={slugMessage || availability === "taken" ? true : undefined}
                  aria-describedby="slug-help"
                  className="h-11 min-w-0 flex-1 bg-surface px-2 text-base text-text focus:outline-none"
                />
              </span>
              <span id="slug-help" aria-live="polite" className="flex flex-col gap-0.5 text-xs font-normal">
                {slugMessage ? (
                  <span className="text-danger">{slugMessage}</span>
                ) : (
                  <>
                    <span className="text-subtle">{slug ? `Fica em ${programOrigin.replace("https://", "")}${cardPublicPath(slug)}.` : "Sugerido a partir do nome."}</span>
                    {availability && availabilityText[availability] ? <span className={availabilityText[availability]!.tone}>{availabilityText[availability]!.text}</span> : null}
                    {card && slug !== card.slug ? <span className="text-gold-text">Atenção: os cartões já programados com o endereço antigo deixam de abrir.</span> : null}
                  </>
                )}
              </span>
            </label>
            <label className={adminLabelClasses}>
              Língua da página
              <select {...field("locale")} className={input}>
                {locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeNamesPt[locale]}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-subtle">Os botões da página («Guardar contacto», «Ligar»…) ficam nesta língua.</span>
            </label>
            <label className={adminLabelClasses}>
              Cliente (só para nós, opcional)
              <input {...field("client_name")} maxLength={120} autoComplete="off" placeholder="Empresa que encomendou" className={input} />
            </label>
            <label className={`${adminLabelClasses} sm:col-span-2`}>
              Nota interna (opcional)
              <textarea {...field("note")} rows={2} maxLength={1000} placeholder="Ex.: 50 cartões entregues em outubro." className={`${adminInputClasses} py-2.5`} />
              <span className="text-xs font-normal text-subtle">Nunca aparece na página.</span>
            </label>
          </div>
          <label className="flex items-start gap-3 border-t border-line pt-4 text-sm text-text">
            <input type="checkbox" name="active" checked={active} onChange={(event) => setActive(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-accent" />
            <span>
              <span className="font-semibold">Cartão ativo</span>
              <span className="block text-muted">Desligado, a página do cartão deixa de abrir (dá «página não encontrada»).</span>
            </span>
          </label>
        </Section>
      </div>

      <aside aria-label="Pré-visualização da página do cartão" className="flex min-w-0 flex-col gap-2 lg:sticky lg:top-36 lg:row-span-2">
        <p className="text-sm font-medium text-muted">Pré-visualização</p>
        <PreviewBusy>
          <div
            tabIndex={0}
            aria-label="Pré-visualização (deslize para ver tudo)"
            className="mx-auto h-[34rem] w-full max-w-[23rem] overflow-y-auto overscroll-contain rounded-[1.75rem] border-[6px] border-surface-inverse/85 bg-bg shadow-[0_24px_60px_-30px_rgb(var(--shadow-color)/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:h-[min(40rem,calc(100dvh-11rem))]"
          >
            <div inert className="min-h-full">
              <BusinessCardView card={preview} productHref={productHrefs[preview.locale]} preview />
            </div>
          </div>
        </PreviewBusy>
      </aside>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel={card ? "A guardar…" : "A criar…"}>{card ? "Guardar cartão" : "Criar cartão"}</SubmitButton>
        {!card ? <span className="text-sm text-muted">A seguir mostramos o endereço e o QR para programar o cartão.</span> : null}
      </div>
    </ActionForm>
  );
}
