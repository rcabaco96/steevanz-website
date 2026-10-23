"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  actorName,
  addDays,
  ago,
  closedStages,
  isDue,
  nextContactPresets,
  niceDate,
  siteStatusLabels,
  siteStatuses,
  stageLabels,
  stages,
  whatsappLink,
  whatsappMessage,
  type WhatsAppSettings,
} from "@/lib/prospects/crm";
import { listEventsAction, logProductAction, setNextContactAction, setSiteStatusAction, setStageAction, type CrmResult } from "@/lib/prospects/crm-actions";
import { linkName, reasons } from "@/lib/prospects/rules";
import type { CrmProspect, ProspectEvent } from "@/lib/prospects/store";
import { Dropdown, DropdownHint, DropdownOption, DropdownSeparator } from "./Dropdown";
import { actionClasses, siteTone, stageTone } from "./tones";

export interface ProductOption {
  id: string;
  name: string;
  family: string;
  url: string;
}

export type CrmRun = (placeId: string, optimistic: Partial<CrmProspect>, action: () => Promise<CrmResult>, done?: string) => void;

interface CrmRowProps {
  prospect: CrmProspect;
  today: string;
  me: string;
  settings: WhatsAppSettings;
  products: ProductOption[];
  /** Grows after each saved change, so an open history reloads. */
  version: number;
  run: CrmRun;
  onNoAnswer: (prospect: CrmProspect) => void;
  onNotes: (prospect: CrmProspect, notes: string) => void;
  toast: (message: string) => void;
}

export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch {}
    area.remove();
  }
}

function CopyButton({ text, label = "Copiar", ariaLabel }: { text: string; label?: string; ariaLabel?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={async () => {
        await copyText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className={copied ? actionClasses.done : actionClasses.ghost}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

const timeFormat = new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function eventText(event: ProspectEvent, today: string, products: ProductOption[]): string {
  const stage = (key: string | null) => (key && key in stageLabels ? stageLabels[key as keyof typeof stageLabels] : "—");
  switch (event.kind) {
    case "stage":
      return `Fase: ${stage(event.previous)} → ${stage(event.value)}`;
    case "no_answer":
      return `Não atendeu (${event.value === "1" ? "1.ª tentativa" : `${event.value}.ª tentativa`})`;
    case "next_contact":
      return event.value ? `Próximo contacto: ${niceDate(event.value, today)}` : "Próximo contacto retirado";
    case "note":
      return event.value ? `Notas: «${event.value.length > 240 ? `${event.value.slice(0, 240)}…` : event.value}»` : "Apagou as notas";
    case "site":
      return `Situação do site mudada para «${event.value && event.value in siteStatusLabels ? siteStatusLabels[event.value as keyof typeof siteStatusLabels] : event.value}»`;
    case "product": {
      const name = products.find((product) => product.id === event.value)?.name ?? event.value;
      return event.previous === "whatsapp" ? `Enviou no WhatsApp: ${name}` : `Copiou o link: ${name}`;
    }
  }
}

function History({ placeId, today, me, products }: { placeId: string; today: string; me: string; products: ProductOption[] }) {
  const [events, setEvents] = useState<ProspectEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => setSlow(true), 300);
    listEventsAction(placeId).then((result) => {
      if (!alive) return;
      window.clearTimeout(timer);
      if (result.ok) setEvents(result.events);
      else setError(result.message);
    });
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [placeId]);
  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!events)
    return (
      <div aria-busy="true" className="flex flex-col gap-2">
        <span role="status" className="sr-only">
          A carregar o histórico…
        </span>
        {slow ? [0, 1, 2].map((key) => <Skeleton key={key} className="h-4 w-full max-w-md" />) : null}
      </div>
    );
  if (!events.length) return <p className="text-sm text-subtle">Ainda nada feito com este negócio.</p>;
  return (
    <ol className="flex flex-col gap-1.5 text-sm">
      {events.map((event) => (
        <li key={event.id} className="flex flex-col gap-x-3 sm:flex-row">
          <span className="shrink-0 text-xs text-subtle tabular-nums sm:w-36 sm:pt-0.5">
            {timeFormat.format(new Date(event.created_at))}
            {event.actor ? ` · ${actorName(event.actor, me)}` : ""}
          </span>
          <span className="min-w-0 break-words text-text">{eventText(event, today, products)}</span>
        </li>
      ))}
    </ol>
  );
}

function Notes({ prospect, onNotes }: { prospect: CrmProspect; onNotes: CrmRowProps["onNotes"] }) {
  const [value, setValue] = useState(prospect.notes ?? "");
  const timer = useRef<number | undefined>(undefined);
  const saved = useRef(prospect.notes ?? "");
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const save = (text: string) => {
    window.clearTimeout(timer.current);
    if (text === saved.current) return;
    saved.current = text;
    onNotes(prospect, text);
  };
  return (
    <label className="flex flex-col gap-1">
      <span className="sr-only">Notas de {prospect.name}</span>
      <textarea
        autoFocus
        value={value}
        maxLength={2000}
        onChange={(event) => {
          setValue(event.target.value);
          const text = event.target.value;
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => save(text), 900);
        }}
        onBlur={() => save(value)}
        placeholder="O que ficou combinado, com quem falou, objeções…"
        className="min-h-20 w-full resize-y rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-base text-text focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 sm:text-sm"
      />
      <small className="text-xs text-subtle">Guarda sozinho ao parar de escrever.</small>
    </label>
  );
}

function CrmRowView({ prospect, today, me, settings, products, version, run, onNoAnswer, onNotes, toast }: CrmRowProps) {
  const [panel, setPanel] = useState<"" | "notes" | "history">("");
  const due = isDue(prospect, today);
  const closed = closedStages.has(prospect.status);
  const overdue = due && prospect.next_contact! < today;
  const message = whatsappMessage(settings, prospect);
  const whatsapp = whatsappLink(prospect.phone, message);
  const emails = [prospect.email, ...prospect.other_emails].filter((email): email is string => Boolean(email));
  const sells = reasons(prospect).filter((reason) => !reason.note);
  const meta = [
    prospect.attempts ? `${prospect.attempts} ${prospect.attempts === 1 ? "tentativa" : "tentativas"}` : "",
    prospect.worked_at ? `${ago(prospect.worked_at)}${prospect.worked_by ? ` · ${actorName(prospect.worked_by, me)}` : ""}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const families = [...new Set(products.map((product) => product.family))];

  function sendProduct(product: ProductOption, how: "copy" | "whatsapp") {
    if (how === "copy") {
      void copyText(product.url);
      toast(`Link copiado: ${product.name}`);
    } else {
      const link = whatsappLink(prospect.phone, `${message}\n\n${product.name}: ${product.url}`);
      if (link) window.open(link, "_blank", "noopener");
    }
    void logProductAction(prospect.place_id, product.id, how);
  }

  return (
    <article
      className={`grid grid-cols-1 gap-3 border-t border-line px-4 py-4 md:grid-cols-2 md:gap-x-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_15rem] xl:gap-x-4 xl:px-5 ${
        due ? "bg-danger-soft/45" : ""
      }`}
    >
      <div className={`min-w-0 ${closed ? "opacity-55" : ""}`}>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold break-words text-text">{prospect.name}</span>
          {prospect.fresh ? <span className="rounded-md bg-accent-soft px-1.5 py-px text-[0.7rem] font-semibold tracking-[0.05em] text-accent-text uppercase">novo</span> : null}
          {prospect.customer ? <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">Já é cliente</span> : null}
        </p>
        <p className="text-sm text-muted">{[prospect.category, prospect.sector].filter(Boolean).join(" · ")}</p>
        {prospect.address ? <p className="text-sm break-words text-subtle">{prospect.address}</p> : null}
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {prospect.reviews ? (
            <span>
              <strong className="text-text tabular-nums">{prospect.rating !== null ? `${prospect.rating.toFixed(1).replace(".", ",")} ★` : ""}</strong> {prospect.reviews}{" "}
              {prospect.reviews === 1 ? "review" : "reviews"}
            </span>
          ) : (
            <span>sem reviews</span>
          )}
          {prospect.maps_url ? (
            <a href={prospect.maps_url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-text hover:underline">
              Ver no Maps
            </a>
          ) : null}
        </p>
      </div>

      <div className={`min-w-0 ${closed ? "opacity-55" : ""}`}>
        <Dropdown
          ariaLabel={`Situação do site de ${prospect.name}: ${prospect.site_status ? siteStatusLabels[prospect.site_status] : "por verificar"}. Mudar`}
          className={`h-8 rounded-full px-3 text-xs font-semibold ${siteTone[prospect.site_status ?? "unchecked"]}`}
          label={prospect.site_status ? siteStatusLabels[prospect.site_status] : "Site por verificar"}
        >
          {(close) => (
            <>
              <DropdownHint>Situação do site</DropdownHint>
              {siteStatuses.map((status) => (
                <DropdownOption
                  key={status}
                  selected={prospect.site_status === status}
                  onChoose={() => {
                    close();
                    if (status !== prospect.site_status)
                      run(prospect.place_id, { site_status: status, site_reasons: [] }, () => setSiteStatusAction(prospect.place_id, status));
                  }}
                >
                  {siteStatusLabels[status]}
                </DropdownOption>
              ))}
            </>
          )}
        </Dropdown>
        <p className="mt-1.5 text-sm break-words text-muted">
          {[...prospect.site_reasons].join(" · ")}
          {prospect.website ? (
            <>
              {prospect.site_reasons.length ? " · " : ""}
              <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="font-medium break-all text-accent-text hover:underline">
                {linkName(prospect.website) || "Site"}
              </a>
            </>
          ) : null}
        </p>
        {sells.length ? <p className="mt-1 text-xs text-subtle">Podemos vender: {sells.map((reason) => reason.text).join(" · ")}</p> : null}
      </div>

      <div className="flex min-w-0 flex-col gap-2 text-sm">
        {prospect.phone ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-medium text-text tabular-nums select-all">{prospect.phone}</span>
            <a href={`tel:${prospect.phone.replace(/\s+/g, "")}`} className={actionClasses.solid}>
              Ligar
            </a>
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={actionClasses.whatsapp} aria-label={`Escrever no WhatsApp a ${prospect.name}`}>
                WhatsApp
              </a>
            ) : null}
            <a href={`/admin/export/contactos?id=${encodeURIComponent(prospect.place_id)}`} className={actionClasses.ghost} aria-label={`Guardar ${prospect.name} nos contactos do telemóvel`}>
              Guardar
            </a>
            <CopyButton text={prospect.phone} ariaLabel={`Copiar o telefone de ${prospect.name}`} />
          </div>
        ) : null}
        {emails.map((email) => (
          <div key={email} className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 min-w-0 break-all text-text select-all">{email}</span>
            <CopyButton text={email} ariaLabel={`Copiar o email ${email}`} />
          </div>
        ))}
        {!prospect.phone && emails.length ? (
          <a href={`/admin/export/contactos?id=${encodeURIComponent(prospect.place_id)}`} className={`${actionClasses.ghost} self-start`}>
            Guardar nos contactos
          </a>
        ) : null}
        {!prospect.phone && !emails.length ? <span className="text-subtle">Sem telefone nem email públicos</span> : null}
      </div>

      <div className="grid min-w-0 grid-cols-1 content-start gap-2 md:col-span-2 sm:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
        <Dropdown
          ariaLabel={`Fase de ${prospect.name}: ${stageLabels[prospect.status]}. Mudar`}
          className={`h-10 w-full rounded-xl px-3 text-sm font-semibold ${stageTone[prospect.status].chip}`}
          label={
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${stageTone[prospect.status].chipDot}`} />
              {stageLabels[prospect.status]}
            </span>
          }
        >
          {(close) =>
            stages.map((stage) => (
              <DropdownOption
                key={stage}
                selected={prospect.status === stage}
                onChoose={() => {
                  close();
                  if (stage === prospect.status) return;
                  const optimistic: Partial<CrmProspect> = { status: stage };
                  if (closedStages.has(stage)) optimistic.next_contact = null;
                  else if (stage === "contacted" && !prospect.next_contact) optimistic.next_contact = addDays(today, 3);
                  run(prospect.place_id, optimistic, () => setStageAction(prospect.place_id, stage));
                }}
              >
                <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${stageTone[stage].dot}`} />
                {stageLabels[stage]}
              </DropdownOption>
            ))
          }
        </Dropdown>

        <div className="flex min-w-0 flex-col gap-0.5">
          <span className={`text-[0.7rem] tracking-[0.05em] uppercase ${due ? "font-semibold text-danger" : "text-subtle"}`}>{overdue ? "Atrasado · próximo contacto" : "Próximo contacto"}</span>
          <Dropdown
            ariaLabel={`Próximo contacto com ${prospect.name}: ${prospect.next_contact ? niceDate(prospect.next_contact, today) : "sem data"}. Mudar`}
            className={`h-10 w-full rounded-xl border px-3 text-sm ${due ? "border-danger bg-danger-soft font-semibold text-danger" : prospect.next_contact ? "border-line bg-surface text-text" : "border-line bg-surface text-subtle"}`}
            label={prospect.next_contact ? niceDate(prospect.next_contact, today) : "Sem data"}
          >
            {(close) => {
              const choose = (date: string | null) => {
                close();
                if (date === prospect.next_contact) return;
                run(prospect.place_id, { next_contact: date }, () => setNextContactAction(prospect.place_id, date));
              };
              return (
                <>
                  <DropdownHint>Voltar a contactar</DropdownHint>
                  {nextContactPresets.map((preset) => {
                    const date = addDays(today, preset.days);
                    return (
                      <DropdownOption key={preset.days} selected={prospect.next_contact === date} onChoose={() => choose(date)}>
                        {preset.label}
                        {preset.days > 1 ? <small className="ml-auto text-xs text-subtle tabular-nums">{niceDate(date, today)}</small> : null}
                      </DropdownOption>
                    );
                  })}
                  <DropdownSeparator />
                  <label className="flex flex-col gap-1 px-2.5 pb-1.5 text-xs text-subtle">
                    Outro dia
                    <input
                      type="date"
                      data-opt
                      min={today}
                      defaultValue={prospect.next_contact ?? ""}
                      onChange={(event) => {
                        if (event.target.value) choose(event.target.value);
                      }}
                      className="h-10 rounded-lg border border-line bg-surface px-2 text-base text-text"
                    />
                  </label>
                  {prospect.next_contact ? (
                    <>
                      <DropdownSeparator />
                      <DropdownOption onChoose={() => choose(null)}>Sem data</DropdownOption>
                    </>
                  ) : null}
                </>
              );
            }}
          </Dropdown>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:col-span-2 xl:col-span-1">
          <button type="button" onClick={() => onNoAnswer(prospect)} className={actionClasses.ghost}>
            Não atendeu
          </button>
          <button type="button" aria-expanded={panel === "notes"} onClick={() => setPanel(panel === "notes" ? "" : "notes")} className={actionClasses.ghost}>
            Notas{prospect.notes ? <span className="ml-1 text-gold-text">•</span> : null}
          </button>
          <button type="button" aria-expanded={panel === "history"} onClick={() => setPanel(panel === "history" ? "" : "history")} className={actionClasses.ghost}>
            Histórico
          </button>
          <Dropdown ariaLabel={`Enviar um produto da Steevanz a ${prospect.name}`} className={actionClasses.solid} label="Enviar produto">
            {(close) => (
              <>
                {families.map((family) => (
                  <div key={family} className="flex flex-col gap-px">
                    <DropdownHint>{family}</DropdownHint>
                    {products
                      .filter((product) => product.family === family)
                      .map((product) => (
                        <div key={product.id} className="flex items-center gap-1">
                          <DropdownOption
                            className="flex-1"
                            onChoose={() => {
                              close();
                              sendProduct(product, "copy");
                            }}
                          >
                            <span className="min-w-0 flex-1">{product.name}</span>
                            <small className="text-xs text-subtle">Copiar link</small>
                          </DropdownOption>
                          {whatsapp ? (
                            <button
                              type="button"
                              data-opt
                              aria-label={`Enviar ${product.name} no WhatsApp a ${prospect.name}`}
                              onClick={() => {
                                close();
                                sendProduct(product, "whatsapp");
                              }}
                              className="h-10 shrink-0 cursor-pointer rounded-xl px-2.5 text-xs font-semibold text-accent-text outline-none hover:bg-accent-soft focus-visible:bg-accent-soft"
                            >
                              WhatsApp
                            </button>
                          ) : null}
                        </div>
                      ))}
                  </div>
                ))}
              </>
            )}
          </Dropdown>
        </div>
        {meta ? (
          <p className="text-xs text-subtle sm:col-span-2 xl:col-span-1" suppressHydrationWarning>
            {meta}
          </p>
        ) : null}
      </div>

      {panel ? (
        <div className="col-span-full rounded-2xl border border-line bg-surface p-3 sm:p-4">
          {panel === "notes" ? <Notes prospect={prospect} onNotes={onNotes} /> : <History key={version} placeId={prospect.place_id} today={today} me={me} products={products} />}
        </div>
      ) : null}
    </article>
  );
}

export const CrmRow = memo(CrmRowView);
