"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { compareProspects, isDue, lisbonToday, noAnswer, siteStatusLabels, siteStatuses, sortLabels, spreadsheet, stageLabels, stages, whatsappNumber, type CrmSort, type SiteStatus, type Stage, type WhatsAppSettings } from "@/lib/prospects/crm";
import { noAnswerAction, saveNotesAction } from "@/lib/prospects/crm-actions";
import type { CrmProspect } from "@/lib/prospects/store";
import { copyText, CrmRow, type CrmRun, type ProductOption } from "./CrmRow";
import { Dropdown, DropdownOption } from "./Dropdown";
import { stageTone } from "./tones";

interface CrmBoardProps {
  prospects: CrmProspect[];
  me: string;
  settings: WhatsAppSettings;
  products: ProductOption[];
}

type StageFilter = "" | "due" | Stage;
type SiteFilter = "" | SiteStatus | "unchecked";

const pageSize = 120;
const fieldClasses = "h-11 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-text hover:border-line-strong";

/**
 * The CRM board: where each business stands (strip of stages on top), filters, then one row per
 * business with who, why, how to reach them and where the conversation is. Changes save at once.
 */
export function CrmBoard({ prospects, me, settings, products }: CrmBoardProps) {
  const [today] = useState(() => lisbonToday());
  const [rows, setRows] = useState<Record<string, CrmProspect>>(() => Object.fromEntries(prospects.map((row) => [row.place_id, row])));
  const [versions, setVersions] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<StageFilter>("");
  const [site, setSite] = useState<SiteFilter>("");
  const [sector, setSector] = useState("");
  const [sort, setSort] = useState<CrmSort>("prio");
  const [query, setQuery] = useState("");
  const [onlyEmail, setOnlyEmail] = useState(false);
  const [onlyWhatsApp, setOnlyWhatsApp] = useState(false);
  const [shown, setShown] = useState(pageSize);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const order = useMemo(() => prospects.map((row) => row.place_id), [prospects]);
  const all = useMemo(() => order.map((id) => rows[id]), [order, rows]);

  const toast = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setMessage(null), 2800);
  }, []);

  const run = useCallback<CrmRun>(
    (placeId, optimistic, action, done) => {
      let before: CrmProspect | undefined;
      setRows((current) => {
        before = current[placeId];
        return { ...current, [placeId]: { ...current[placeId], ...optimistic, worked_at: new Date().toISOString(), worked_by: me } };
      });
      action().then(
        (result) => {
          if (result.ok) {
            setRows((current) => ({ ...current, [placeId]: { ...current[placeId], ...result.patch } }));
            setVersions((current) => ({ ...current, [placeId]: (current[placeId] ?? 0) + 1 }));
            if (done) toast(done);
          } else {
            setRows((current) => (before ? { ...current, [placeId]: before } : current));
            toast(result.message);
          }
        },
        () => {
          setRows((current) => (before ? { ...current, [placeId]: before } : current));
          toast("Sem ligação: não foi guardado. Tente outra vez.");
        },
      );
    },
    [me, toast],
  );

  const onNoAnswer = useCallback(
    (prospect: CrmProspect) => {
      run(prospect.place_id, noAnswer(prospect, today), () => noAnswerAction(prospect.place_id), `${prospect.name}: tentativa registada, próximo contacto amanhã.`);
    },
    [run, today],
  );

  const onNotes = useCallback((prospect: CrmProspect, notes: string) => run(prospect.place_id, { notes: notes.trim() ? notes : null }, () => saveNotesAction(prospect.place_id, notes)), [run]);

  const counts = useMemo(() => {
    const byStage = Object.fromEntries(stages.map((key) => [key, 0])) as Record<Stage, number>;
    let due = 0;
    for (const row of all) {
      byStage[row.status]++;
      if (isDue(row, today)) due++;
    }
    return { byStage, due };
  }, [all, today]);

  const sectors = useMemo(() => {
    const found = new Map<string, number>();
    for (const row of all) found.set(row.sector, (found.get(row.sector) ?? 0) + 1);
    return [...found.entries()].sort(([a], [b]) => a.localeCompare(b, "pt"));
  }, [all]);

  const siteCounts = useMemo(() => {
    const found: Record<string, number> = {};
    for (const row of all) found[row.site_status ?? "unchecked"] = (found[row.site_status ?? "unchecked"] ?? 0) + 1;
    return found;
  }, [all]);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt");
    return all
      .filter((row) => {
        if (stage === "due" ? !isDue(row, today) : stage && row.status !== stage) return false;
        if (site && (row.site_status ?? "unchecked") !== site) return false;
        if (sector && row.sector !== sector) return false;
        if (onlyEmail && !row.email && !row.other_emails.length) return false;
        if (onlyWhatsApp && !whatsappNumber(row.phone)) return false;
        return !term || [row.name, row.category, row.address, row.sector, row.notes].join(" ").toLocaleLowerCase("pt").includes(term);
      })
      .sort(compareProspects(sort, today));
  }, [all, stage, site, sector, onlyEmail, onlyWhatsApp, query, sort, today]);

  const withContact = filtered.filter((row) => row.phone || row.email || row.other_emails.length);
  const filterLabel = (text: string, on: boolean) => <span className={on ? "text-accent-text" : ""}>{text}</span>;
  const stageButton = (key: StageFilter, label: string, count: number, tone: string) => (
    <button
      key={key || "all"}
      type="button"
      aria-pressed={stage === key}
      onClick={() => {
        setStage(stage === key ? "" : key);
        setShown(pageSize);
      }}
      className={`flex min-w-[6.5rem] cursor-pointer flex-col gap-0.5 rounded-2xl border bg-surface px-3 py-2.5 text-left xl:px-2 transition-colors ${stage === key ? `border-2 ${tone}` : "border-line text-text hover:border-line-strong"}`}
    >
      <b className="font-display text-2xl leading-none font-semibold tabular-nums">{count}</b>
      <span className="truncate text-xs text-muted">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:thin] sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filtrar por fase" className="grid min-w-max grid-flow-col gap-2 xl:min-w-0 xl:grid-flow-row xl:grid-cols-9">
          {stageButton("", "Todos", all.length, "border-text text-text")}
          {stageButton("due", "Para hoje", counts.due, "border-danger text-danger")}
          {stages.map((key) => stageButton(key, stageLabels[key], counts.byStage[key], stageTone[key].ring))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setShown(pageSize);
          }}
          placeholder="Procurar nome, rua, categoria ou nota"
          aria-label="Procurar"
          className={`${fieldClasses} min-w-0 flex-[1_1_100%] text-base sm:flex-[1_1_16rem] sm:text-sm`}
        />
        <Dropdown className={`${fieldClasses} flex-[1_1_9rem] ${site ? "border-accent bg-accent-soft" : ""}`} label={filterLabel(site ? (site === "unchecked" ? "Site por verificar" : siteStatusLabels[site]) : "Qualquer situação", Boolean(site))}>
          {(close) => (
            <>
              <DropdownOption selected={!site} onChoose={() => (setSite(""), close())}>
                Qualquer situação
              </DropdownOption>
              {[...siteStatuses, "unchecked" as const].map((key) => (
                <DropdownOption key={key} selected={site === key} onChoose={() => (setSite(key), setShown(pageSize), close())}>
                  {key === "unchecked" ? "Site por verificar" : siteStatusLabels[key]}
                  <small className="ml-auto text-xs text-subtle tabular-nums">{siteCounts[key] ?? 0}</small>
                </DropdownOption>
              ))}
            </>
          )}
        </Dropdown>
        <Dropdown className={`${fieldClasses} flex-[1_1_9rem] ${sector ? "border-accent bg-accent-soft" : ""}`} label={filterLabel(sector || "Todos os setores", Boolean(sector))}>
          {(close) => (
            <>
              <DropdownOption selected={!sector} onChoose={() => (setSector(""), close())}>
                Todos os setores
              </DropdownOption>
              {sectors.map(([name, count]) => (
                <DropdownOption key={name} selected={sector === name} onChoose={() => (setSector(name), setShown(pageSize), close())}>
                  {name}
                  <small className="ml-auto text-xs text-subtle tabular-nums">{count}</small>
                </DropdownOption>
              ))}
            </>
          )}
        </Dropdown>
        <Dropdown className={`${fieldClasses} flex-[1_1_9rem]`} label={`Ordenar: ${sortLabels[sort].toLocaleLowerCase("pt")}`}>
          {(close) =>
            (Object.keys(sortLabels) as CrmSort[]).map((key) => (
              <DropdownOption key={key} selected={sort === key} onChoose={() => (setSort(key), close())}>
                {sortLabels[key]}
              </DropdownOption>
            ))
          }
        </Dropdown>
        {/* The two ticks stay together (on phones they share a line under the menus). */}
        <div className="flex flex-wrap items-center gap-x-2">
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 px-1 text-sm text-muted">
            <input type="checkbox" checked={onlyEmail} onChange={(event) => setOnlyEmail(event.target.checked)} className="size-[18px] accent-(--accent)" />
            Só com email
          </label>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 px-1 text-sm text-muted">
            <input type="checkbox" checked={onlyWhatsApp} onChange={(event) => setOnlyWhatsApp(event.target.checked)} className="size-[18px] accent-(--accent)" />
            Só com WhatsApp
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={async () => {
            await copyText(spreadsheet(filtered));
            setCopied(filtered.length);
            window.setTimeout(() => setCopied(null), 1800);
          }}
          className="inline-flex h-11 cursor-pointer items-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-contrast hover:bg-accent-hover"
        >
          {copied !== null ? `Copiado (${copied})` : "Copiar para Excel"}
        </button>
        <form method="post" action="/admin/export/contactos">
          <input type="hidden" name="ids" value={withContact.map((row) => row.place_id).join(",")} />
          <button
            type="submit"
            disabled={!withContact.length}
            className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-text hover:bg-surface-2 disabled:opacity-50"
          >
            Guardar contactos ({withContact.length})
          </button>
        </form>
        <p aria-live="polite" className="text-sm text-muted tabular-nums sm:ml-auto">
          {filtered.length} de {all.length} negócios
        </p>
      </div>

      <div className="card overflow-hidden">
        {filtered.length ? (
          <>
            <div className="hidden grid-cols-[minmax(0,1.15fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_15rem] gap-x-4 bg-surface-2 px-5 py-2.5 text-xs tracking-[0.06em] text-muted uppercase xl:grid">
              <span>Negócio</span>
              <span>Situação do site</span>
              <span>Contactos</span>
              <span>Fase</span>
            </div>
            <div className="[&>article:first-child]:border-t-0 xl:[&>article:first-child]:border-t">
              {filtered.slice(0, shown).map((row) => (
                <CrmRow
                  key={row.place_id}
                  prospect={row}
                  today={today}
                  me={me}
                  settings={settings}
                  products={products}
                  version={versions[row.place_id] ?? 0}
                  run={run}
                  onNoAnswer={onNoAnswer}
                  onNotes={onNotes}
                  toast={toast}
                />
              ))}
            </div>
            {filtered.length > shown ? (
              <div className="border-t border-line p-4 text-center">
                <button type="button" onClick={() => setShown(shown + pageSize)} className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line-strong px-5 text-sm font-semibold text-text hover:bg-surface-2">
                  Mostrar mais {Math.min(pageSize, filtered.length - shown)} (faltam {filtered.length - shown})
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {all.length ? "Nenhum negócio com estes filtros. Limpe a pesquisa ou escolha outra fase." : "Esta lista ainda não tem negócios."}
          </p>
        )}
      </div>

      {message ? (
        <p role="status" className="fixed inset-x-4 bottom-[calc(18px+env(safe-area-inset-bottom,0px))] z-50 mx-auto w-fit max-w-md rounded-xl bg-surface-inverse px-4 py-2.5 text-sm text-inverse shadow-lg">
          {message}
        </p>
      ) : null}
    </div>
  );
}
