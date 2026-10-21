"use client";

import { useActionState, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FormMessage } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";
import { saveSetupBusiness, saveSetupFaqs, saveSetupHours, saveSetupServices } from "@/lib/chatbot/actions";
import { formatWeek } from "@/lib/chatbot/hours";
import type { DocumentRow } from "@/lib/chatbot/rows";
import { parseHours, parsePriceList, setupTargets, type PriceItem, type PriceListResult, type SetupProgress, type SetupStepId } from "@/lib/chatbot/setup";
import { chatbotBusinessKinds, chatbotLanguages, type ChatbotBusinessKind, type ChatbotLanguage, type Closure, type WeeklyHours } from "@/lib/chatbot/types";
import { kindLabels, languageLabels } from "./ChatbotBits";
import { DocumentsEditor } from "./DocumentsEditor";
import { TestChat } from "./TestChat";

type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export interface SetupWizardData {
  bot: {
    id: string;
    name: string;
    kind: ChatbotBusinessKind;
    address: string | null;
    phone: string | null;
    booking_url: string | null;
    maps_url: string | null;
    languages: string[];
    default_language: string;
    tone: "formal" | "friendly";
  };
  /** The linked Espaço (name and its own weekly hours), if any. */
  establishment: { name: string; hours: WeeklyHours[] } | null;
  bookingSuggestion: string | null;
  /** The hours written in this setup (fromSetup) or nothing yet. */
  hours: { fromSetup: boolean; week: WeeklyHours[]; closures: Closure[] };
  holidayNotes: string;
  services: PriceItem[];
  /** Priced dishes or services the assistant also reads from the Espaço or the video menu. */
  otherItems: number;
  faqs: { id: string; question: string; example: string; answer: string }[];
  documents: DocumentRow[] | null;
  outdatedDocuments: string[];
  properties: string[];
  progress: SetupProgress;
  testQuestions: string[];
  /** "YYYY-MM-DD" in the business's time zone (dates pasted without a year). */
  today: string;
}

const steps = [
  { label: "Negócio", title: "O negócio" },
  { label: "Horário", title: "Horário" },
  { label: "Preços", title: "Serviços e preços" },
  { label: "Perguntas", title: "Perguntas frequentes" },
  { label: "Testar", title: "Documentos e experimentar" },
] as const;

const stepOf: Record<SetupStepId, number> = { business: 1, hours: 2, prices: 3, questions: 4, documents: 5 };

const input = `${adminInputClasses} h-11`;
const area = `${adminInputClasses} py-2`;

/** True once `busy` has lasted ~300 ms (no flicker on quick saves). */
function useDelayed(busy: boolean, ms = 300): boolean {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!busy) {
      const reset = window.setTimeout(() => setShown(false), 0);
      return () => window.clearTimeout(reset);
    }
    const timer = window.setTimeout(() => setShown(true), ms);
    return () => window.clearTimeout(timer);
  }, [busy, ms]);
  return shown;
}

/**
 * «Configurar em 5 passos»: everything a business needs for the assistant to answer well, in about ten
 * minutes, without Steevanz: business details, hours, services and prices, the sector's usual questions,
 * documents and a test. Each step saves on its own; the score above updates after each save.
 */
export function SetupWizard({ data, initialStep }: { data: SetupWizardData; initialStep: number }) {
  const [step, setStep] = useState(Math.min(5, Math.max(1, initialStep)));
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const veiled = useDelayed(busy);
  const [tested, setTested] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const testedKey = `steevanz:chatbot-tested:${data.bot.id}`;

  useEffect(() => {
    let stored = false;
    try {
      stored = window.localStorage.getItem(testedKey) === "1";
    } catch {
      // Private window or blocked storage: the checklist just shows «por testar».
    }
    if (!stored) return;
    const timer = window.setTimeout(() => setTested(true), 0);
    return () => window.clearTimeout(timer);
  }, [testedKey]);

  const markTested = useCallback(() => {
    setTested(true);
    try {
      window.localStorage.setItem(testedKey, "1");
    } catch {
      // Ignored: only this browser's checklist.
    }
  }, [testedKey]);

  const go = (next: number, message: string | null = null) => {
    const target = Math.min(5, Math.max(1, next));
    setSaved(message);
    setStep(target);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", "configurar");
    params.set("passo", String(target));
    window.history.replaceState(null, "", `?${params.toString()}`);
    top.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const done = new Set(data.progress.steps.filter((item) => item.done).map((item) => stepOf[item.id]));
  const current = steps[step - 1];
  const stepProps = { onSaved: (message: string) => go(step + 1, message), onBack: step > 1 ? () => go(step - 1) : null, onSkip: () => go(step + 1), onBusy: setBusy };

  return (
    <div ref={top} className="flex w-full max-w-3xl scroll-mt-24 flex-col gap-5">
      <div className="relative" aria-busy={veiled || undefined}>
        <div className={`flex flex-col gap-4 transition-opacity duration-300 ${veiled ? "opacity-35" : ""}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-text">Configurar em 5 passos</h2>
              <span className="text-sm font-semibold text-accent-text">{data.progress.score} %</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Configuração" aria-valuemin={0} aria-valuemax={100} aria-valuenow={data.progress.score}>
              <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${data.progress.score}%` }} />
            </div>
            <p className="text-sm text-muted">Cerca de 10 minutos. Pode parar e continuar depois: cada passo fica guardado.</p>
          </div>
          <ol className="grid grid-cols-5 gap-1" aria-label="Passos">
            {steps.map((item, index) => {
              const number = index + 1;
              const active = number === step;
              const complete = done.has(number);
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => go(number)}
                    aria-current={active ? "step" : undefined}
                    className="flex w-full flex-col items-center gap-1 rounded-xl px-0.5 py-1.5 text-center transition-colors hover:bg-surface-2"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                        active ? "border-accent bg-accent text-accent-contrast" : complete ? "border-success/40 bg-success-soft text-success" : "border-line bg-surface text-muted"
                      }`}
                    >
                      {complete && !active ? <span aria-hidden="true">✓</span> : number}
                      {complete ? <span className="sr-only"> (feito)</span> : null}
                    </span>
                    <span className={`text-[0.7rem] leading-tight sm:text-xs ${active ? "font-semibold text-text" : "text-muted"}`}>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        {veiled ? (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-bg/80 to-transparent" />
            </div>
            <span role="status" className="sr-only">
              A atualizar…
            </span>
          </>
        ) : null}
      </div>

      <section className="card flex flex-col gap-5 p-4 sm:p-6" aria-labelledby="setup-step-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Passo {step} de 5</p>
          <h3 id="setup-step-title" className="display text-2xl">
            {current.title}
          </h3>
          {saved ? (
            <p role="status" className="mt-1 text-sm text-success">
              ✓ {saved}
            </p>
          ) : null}
        </div>
        {step === 1 ? <BusinessStep data={data} {...stepProps} /> : null}
        {step === 2 ? <HoursStep data={data} {...stepProps} /> : null}
        {step === 3 ? <ServicesStep data={data} {...stepProps} /> : null}
        {step === 4 ? <FaqStep data={data} {...stepProps} /> : null}
        {step === 5 ? <TestStep data={data} tested={tested} onTested={markTested} onGo={(number) => go(number)} /> : null}
      </section>
    </div>
  );
}

interface StepProps {
  data: SetupWizardData;
  onSaved: (message: string) => void;
  onBack: (() => void) | null;
  onSkip: () => void;
  onBusy: (busy: boolean) => void;
}

/** One step's form: saves with its action, then moves on; errors stay here with the fields as typed. */
function StepForm({
  action,
  onSaved,
  onBack,
  onSkip,
  onBusy,
  validate,
  children,
  submitLabel = "Guardar e continuar",
  pendingLabel = "A guardar…",
}: Omit<StepProps, "data"> & { action: FormAction; validate?: () => string | null; children: ReactNode; submitLabel?: string; pendingLabel?: string }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [problem, setProblem] = useState<string | null>(null);
  const handled = useRef<ActionState>(null);
  useEffect(() => onBusy(pending), [pending, onBusy]);
  useEffect(() => {
    if (state?.ok && handled.current !== state) {
      handled.current = state;
      onSaved(state.message);
    }
  }, [state, onSaved]);
  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const message = validate?.() ?? null;
        setProblem(message);
        if (message) event.preventDefault();
      }}
      className="flex flex-col gap-5"
    >
      {children}
      {problem ? <FormMessage ok={false} message={problem} /> : state && !state.ok ? <FormMessage ok={false} message={state.message} /> : null}
      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {onBack ? (
            <button type="button" onClick={onBack} className={buttonClasses("ghost", "md")}>
              Anterior
            </button>
          ) : null}
          <button type="button" onClick={onSkip} className={buttonClasses("ghost", "md")}>
            Saltar
          </button>
        </div>
        <button type="submit" disabled={pending} aria-busy={pending} className={buttonClasses("primary", "md", "w-full sm:w-auto")}>
          {pending ? <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <span className="text-xs font-normal text-subtle">{children}</span>;
}

/** «www.exemplo.pt» → «https://www.exemplo.pt» when the field loses focus. */
function withScheme(value: string): string {
  const text = value.trim();
  if (!text || /^https?:\/\//i.test(text)) return text.replace(/^http:\/\//i, "https://");
  return `https://${text}`;
}

// 1. O negócio -----------------------------------------------------------------------------------------

function BusinessStep({ data, ...props }: StepProps) {
  const { bot } = data;
  const [name, setName] = useState(bot.name);
  const [kind, setKind] = useState<ChatbotBusinessKind>(bot.kind);
  const [address, setAddress] = useState(bot.address ?? "");
  const [phone, setPhone] = useState(bot.phone ?? "");
  const [booking, setBooking] = useState(bot.booking_url ?? "");
  const [maps, setMaps] = useState(bot.maps_url ?? "");
  const [languages, setLanguages] = useState<ChatbotLanguage[]>(chatbotLanguages.filter((language) => bot.languages.includes(language)));
  const [main, setMain] = useState(bot.default_language);
  const [tone, setTone] = useState(bot.tone);
  const fromPlace = data.establishment ? ` (vazio = a do Espaço «${data.establishment.name}»)` : "";
  return (
    <StepForm action={saveSetupBusiness} {...props}>
      <p className="text-sm text-muted">O que o assistente diz quando lhe perguntam onde fica, como marcar ou como falar com alguém.</p>
      <input type="hidden" name="id" value={bot.id} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={adminLabelClasses}>
          Nome do negócio
          <input name="name" required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Tipo de negócio
          <select name="kind" value={kind} onChange={(event) => setKind(event.target.value as ChatbotBusinessKind)} className={input}>
            {chatbotBusinessKinds.map((value) => (
              <option key={value} value={value}>
                {kindLabels[value]}
              </option>
            ))}
          </select>
        </label>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          <span>
            Morada <Hint>{fromPlace}</Hint>
          </span>
          <input name="address" maxLength={200} autoComplete="street-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua das Flores 12, 4050-262 Porto" className={input} />
        </label>
        <label className={adminLabelClasses}>
          <span>
            Telefone para clientes <Hint>{fromPlace}</Hint>
          </span>
          <input name="phone" maxLength={40} inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="912 345 678" className={input} />
        </label>
        <label className={adminLabelClasses}>
          Link de marcação ou reservas
          <input
            name="booking_url"
            maxLength={500}
            inputMode="url"
            value={booking}
            onChange={(event) => setBooking(event.target.value)}
            onBlur={() => setBooking(withScheme(booking))}
            placeholder={data.bookingSuggestion ?? "https://…"}
            className={input}
          />
          {data.bookingSuggestion && !booking ? (
            <button type="button" onClick={() => setBooking(data.bookingSuggestion ?? "")} className="self-start text-xs font-semibold text-accent-text underline-offset-2 hover:underline">
              Usar as reservas Steevanz: {data.bookingSuggestion}
            </button>
          ) : null}
        </label>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          <span>
            Link do Google Maps <Hint>(no Maps: Partilhar › Copiar link)</Hint>
          </span>
          <input name="maps_url" maxLength={500} inputMode="url" value={maps} onChange={(event) => setMaps(event.target.value)} onBlur={() => setMaps(withScheme(maps))} placeholder="https://maps.app.goo.gl/…" className={input} />
        </label>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-muted">Línguas em que responde</legend>
        <div className="flex flex-wrap gap-2">
          {chatbotLanguages.map((language) => {
            const checked = languages.includes(language);
            return (
              <label
                key={language}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25 ${checked ? "border-accent bg-accent-soft text-accent-text" : "border-line text-muted"}`}
              >
                <input
                  type="checkbox"
                  name="languages"
                  value={language}
                  checked={checked}
                  onChange={() => setLanguages((list) => (checked ? list.filter((item) => item !== language) : chatbotLanguages.filter((item) => item === language || list.includes(item))))}
                  className="sr-only"
                />
                {checked ? <span aria-hidden="true">✓</span> : null}
                {languageLabels[language]}
              </label>
            );
          })}
        </div>
        <Hint>Responde na língua do cliente, entre as escolhidas.</Hint>
      </fieldset>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={adminLabelClasses}>
          Língua principal
          <select name="default_language" value={main} onChange={(event) => setMain(event.target.value)} className={input}>
            {chatbotLanguages.map((language) => (
              <option key={language} value={language}>
                {languageLabels[language]}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium text-muted">Tom</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["formal", "Formal", "«o senhor», «a senhora»"],
                ["friendly", "Próximo", "simpático, mais leve"],
              ] as const
            ).map(([value, label, hint]) => (
              <label key={value} className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2 text-sm has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25 ${tone === value ? "border-accent bg-accent-soft" : "border-line"}`}>
                <input type="radio" name="tone" value={value} checked={tone === value} onChange={() => setTone(value)} className="sr-only" />
                <span className="font-semibold text-text">{label}</span>
                <span className="text-xs text-muted">{hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </StepForm>
  );
}

// 2. Horário -------------------------------------------------------------------------------------------

const weekOrder = [1, 2, 3, 4, 5, 6, 0];
const dayLabels = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
type Slot = { opens: string; closes: string };
type Week = Record<number, Slot[]>;

function weekFrom(hours: readonly WeeklyHours[]): Week {
  const week: Week = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  for (const slot of [...hours].sort((a, b) => a.opens.localeCompare(b.opens))) week[slot.weekday].push({ opens: slot.opens.slice(0, 5), closes: slot.closes.slice(0, 5) });
  return week;
}

function HoursStep({ data, ...props }: StepProps) {
  const placeHours = data.establishment?.hours.length ? data.establishment : null;
  const [mode, setMode] = useState<"establishment" | "own">(placeHours && !data.hours.fromSetup ? "establishment" : "own");
  const [week, setWeek] = useState<Week>(() => weekFrom(data.hours.week));
  const [closures, setClosures] = useState<Closure[]>(data.hours.closures);
  const [notes, setNotes] = useState(data.holidayNotes);
  const [pasted, setPasted] = useState("");
  const [reading, setReading] = useState<string | null>(null);
  const [unread, setUnread] = useState<string[]>([]);
  const pasteId = useId();

  const setDay = (weekday: number, slots: Slot[]) => setWeek((current) => ({ ...current, [weekday]: slots }));
  const hours: WeeklyHours[] = weekOrder.flatMap((weekday) => week[weekday].filter((slot) => slot.opens && slot.closes).map((slot) => ({ weekday, ...slot })));
  const readPasted = () => {
    const result = parseHours(pasted, data.today);
    setUnread(result.skipped);
    if (!result.hours.length && !result.closures.length) {
      setReading("Não encontrei dias com horas nesse texto. Escreva, por exemplo, «Segunda a sexta 9h-19h».");
      return;
    }
    if (result.hours.length) setWeek(weekFrom(result.hours));
    if (result.closures.length) setClosures((current) => [...current.filter((item) => !result.closures.some((closure) => closure.day === item.day)), ...result.closures]);
    const open = new Set(result.hours.map((slot) => slot.weekday)).size;
    setReading(`Li ${open} ${open === 1 ? "dia aberto" : "dias abertos"}${result.closures.length ? ` e ${result.closures.length} ${result.closures.length === 1 ? "dia fechado" : "dias fechados"}` : ""}. Confirme abaixo antes de guardar.`);
  };

  return (
    <StepForm action={saveSetupHours} {...props}>
      <p className="text-sm text-muted">Com o horário, o assistente responde a «Abrem amanhã?» ou «Estão abertos no sábado?» sem se enganar. Nunca diz que há vaga a uma hora: indica o horário e como marcar.</p>
      <input type="hidden" name="id" value={data.bot.id} />
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="hours" value={JSON.stringify(hours)} />
      <input type="hidden" name="closures" value={JSON.stringify(closures.filter((item) => item.day))} />

      {placeHours ? (
        <div role="radiogroup" aria-label="De onde vem o horário" className="flex flex-col gap-2">
          {(
            [
              ["establishment", `Usar o horário do Espaço «${placeHours.name}»`],
              ["own", "Escrever outro horário"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm ${mode === value ? "border-accent bg-accent-soft" : "border-line"}`}>
              <input type="radio" name="hours_mode" checked={mode === value} onChange={() => setMode(value)} className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
              <span className="flex flex-col gap-1">
                <span className="font-semibold text-text">{label}</span>
                {value === "establishment" ? <span className="text-xs whitespace-pre-line text-muted">{formatWeek(placeHours.hours, "pt")}</span> : null}
              </span>
            </label>
          ))}
          {mode === "establishment" ? <Hint>Sem duplicar: se mudar o horário do Espaço, o assistente passa a usar o novo.</Hint> : null}
        </div>
      ) : null}

      {mode === "own" ? (
        <>
          <details className="rounded-xl border border-dashed border-line-strong px-3 py-2">
            <summary className="cursor-pointer text-sm font-semibold text-accent-text">Colar o horário de um texto (WhatsApp, Google, site)</summary>
            <div className="mt-3 flex flex-col gap-3">
              <label htmlFor={pasteId} className={adminLabelClasses}>
                Texto com o horário
                <textarea
                  id={pasteId}
                  rows={4}
                  value={pasted}
                  onChange={(event) => setPasted(event.target.value)}
                  placeholder={"Segunda a sexta: 9h-13h e 14h30-19h\nSábado 9h-13h\nDomingo fechado"}
                  className={area}
                />
              </label>
              <div>
                <button type="button" onClick={readPasted} disabled={!pasted.trim()} className={buttonClasses("secondary", "sm")}>
                  Ler horário
                </button>
              </div>
              {reading ? (
                <p role="status" className="text-sm text-muted">
                  {reading}
                </p>
              ) : null}
              {unread.length ? <p className="text-xs text-gold-text">Não percebi: {unread.map((line) => `«${line}»`).join(", ")}. Acerte à mão abaixo.</p> : null}
            </div>
          </details>

          <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
            {weekOrder.map((weekday) => {
              const slots = week[weekday];
              const open = slots.length > 0;
              return (
                <li key={weekday} className="flex flex-col gap-2 px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-text">{dayLabels[weekday]}</span>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
                      {open ? "Aberto" : "Fechado"}
                      <input
                        type="checkbox"
                        role="switch"
                        checked={open}
                        onChange={() => setDay(weekday, open ? [] : [{ opens: "09:00", closes: "19:00" }])}
                        className="peer sr-only"
                      />
                      <span aria-hidden="true" className={`relative h-6 w-10 rounded-full transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25 ${open ? "bg-accent" : "bg-line-strong"}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${open ? "translate-x-[1.125rem]" : "translate-x-0.5"}`} />
                      </span>
                    </label>
                  </div>
                  {slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        step={300}
                        aria-label={`${dayLabels[weekday]}: abre`}
                        value={slot.opens}
                        onChange={(event) => setDay(weekday, slots.map((item, at) => (at === index ? { ...item, opens: event.target.value } : item)))}
                        className={`${input} min-w-0 flex-1 px-2 max-sm:[&::-webkit-calendar-picker-indicator]:hidden`}
                      />
                      <span className="text-muted" aria-hidden="true">
                        –
                      </span>
                      <input
                        type="time"
                        step={300}
                        aria-label={`${dayLabels[weekday]}: fecha`}
                        value={slot.closes}
                        onChange={(event) => setDay(weekday, slots.map((item, at) => (at === index ? { ...item, closes: event.target.value } : item)))}
                        className={`${input} min-w-0 flex-1 px-2 max-sm:[&::-webkit-calendar-picker-indicator]:hidden`}
                      />
                      {slots.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => setDay(weekday, slots.filter((_, at) => at !== index))}
                          aria-label={`Tirar este horário de ${dayLabels[weekday]}`}
                          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-muted hover:bg-surface-2"
                        >
                          ×
                        </button>
                      ) : null}
                    </div>
                  ))}
                  {open && slots.length < 3 ? (
                    <button
                      type="button"
                      onClick={() => setDay(weekday, [...slots, { opens: "14:00", closes: "19:00" }])}
                      className="self-start text-xs font-semibold text-accent-text underline-offset-2 hover:underline"
                    >
                      + Horário da tarde (fecha ao almoço)
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {week[1].length ? (
            <button type="button" onClick={() => setWeek((current) => ({ ...current, 2: current[1], 3: current[1], 4: current[1], 5: current[1] }))} className={buttonClasses("secondary", "sm", "self-start whitespace-normal! text-left")}>
              Repetir segunda-feira de terça a sexta
            </button>
          ) : null}

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium text-muted">Dias fechados (feriados, férias)</legend>
            {closures.map((closure, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  aria-label="Dia fechado"
                  value={closure.day}
                  min={data.today}
                  onChange={(event) => setClosures((list) => list.map((item, at) => (at === index ? { ...item, day: event.target.value } : item)))}
                  className={`${input} min-w-0 flex-1 px-2 sm:w-44 sm:flex-none`}
                />
                <button
                  type="button"
                  onClick={() => setClosures((list) => list.filter((_, at) => at !== index))}
                  aria-label="Tirar este dia"
                  className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-muted hover:bg-surface-2 sm:order-last"
                >
                  ×
                </button>
                <input
                  aria-label="Motivo"
                  maxLength={80}
                  value={closure.reason ?? ""}
                  onChange={(event) => setClosures((list) => list.map((item, at) => (at === index ? { ...item, reason: event.target.value } : item)))}
                  placeholder="Motivo (ex.: Natal)"
                  className={`${input} min-w-0 basis-full sm:flex-1 sm:basis-auto`}
                />
              </div>
            ))}
            <button type="button" onClick={() => setClosures((list) => [...list, { day: "", reason: null }])} className="self-start text-sm font-semibold text-accent-text underline-offset-2 hover:underline">
              + Acrescentar dia fechado
            </button>
          </fieldset>
        </>
      ) : null}

      <label className={adminLabelClasses}>
        <span>
          Feriados e férias <Hint>(opcional, com as suas palavras)</Hint>
        </span>
        <textarea name="notes" rows={2} maxLength={1000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: Fechamos nos feriados nacionais e na segunda quinzena de agosto." className={area} />
      </label>
    </StepForm>
  );
}

// 3. Serviços e preços ---------------------------------------------------------------------------------

interface Row {
  key: number;
  name: string;
  price: string;
  from: boolean;
  duration: string;
}

let rowKey = 0;
const nextKey = () => ++rowKey;

function priceText(cents: number | null): string {
  if (cents === null) return "";
  return cents % 100 ? (cents / 100).toFixed(2).replace(".", ",") : String(cents / 100);
}

function rowFrom(item: PriceItem): Row {
  return { key: nextKey(), name: item.name, price: priceText(item.priceCents), from: item.priceFrom, duration: item.durationMinutes ? String(item.durationMinutes) : "" };
}

/** «16», «16,50», «16.5 €» → cents; "" → null; anything else → NaN. */
function centsOf(text: string): number | null {
  const clean = text.replace(/€|eur(os)?/gi, "").trim();
  if (!clean) return null;
  if (!/^\d{1,6}([.,]\d{1,2})?$/.test(clean)) return Number.NaN;
  return Math.round(Number(clean.replace(",", ".")) * 100);
}

const money = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2 });

function ServicesStep({ data, ...props }: StepProps) {
  const [rows, setRows] = useState<Row[]>(() => (data.services.length ? data.services.map(rowFrom) : [{ key: nextKey(), name: "", price: "", from: false, duration: "" }]));
  const [pasted, setPasted] = useState("");
  const [preview, setPreview] = useState<PriceListResult | null>(null);
  const pasteId = useId();

  const items = rows
    .filter((row) => row.name.trim())
    .map((row) => ({ name: row.name.trim(), priceCents: centsOf(row.price), priceFrom: row.from, durationMinutes: row.duration ? Number(row.duration) : null }));
  const invalid = items.find((item) => Number.isNaN(item.priceCents) || (item.durationMinutes !== null && !(Number.isInteger(item.durationMinutes) && item.durationMinutes > 0)));
  const update = (key: number, patch: Partial<Row>) => setRows((list) => list.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  const applyPreview = (replace: boolean) => {
    if (!preview) return;
    const fresh = preview.items.map(rowFrom);
    setRows((list) => (replace ? fresh : [...list.filter((row) => row.name.trim()), ...fresh]));
    setPreview(null);
    setPasted("");
  };

  return (
    <StepForm action={saveSetupServices} validate={() => (invalid ? `Confirme o preço ou a duração de «${invalid.name}» (ex.: 16 ou 16,50; duração em minutos).` : null)} {...props}>
      <p className="text-sm text-muted">O assistente só diz preços que estejam aqui (ou nos documentos). Escreva-os como os cobra aos clientes.</p>
      {data.otherItems ? (
        <p className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-muted">
          Também usa {data.otherItems} {data.otherItems === 1 ? "preço" : "preços"} do Espaço ou do menu em vídeo ligados. Aqui só acrescenta os que faltam.
        </p>
      ) : null}
      <input type="hidden" name="id" value={data.bot.id} />
      <input type="hidden" name="items" value={JSON.stringify(invalid ? [] : items)} />

      <details className="rounded-xl border border-dashed border-line-strong px-3 py-2" open={!data.services.length || undefined}>
        <summary className="cursor-pointer text-sm font-semibold text-accent-text">Colar o preçário de um texto (WhatsApp, Word, Instagram)</summary>
        <div className="mt-3 flex flex-col gap-3">
          <label htmlFor={pasteId} className={adminLabelClasses}>
            Uma linha por serviço, com o preço
            <textarea id={pasteId} rows={5} value={pasted} onChange={(event) => setPasted(event.target.value)} placeholder={"Corte 16€\nBarba - 10 €\nDegradê 18 euros 40 min"} className={area} />
          </label>
          <div>
            <button type="button" onClick={() => setPreview(parsePriceList(pasted))} disabled={!pasted.trim()} className={buttonClasses("secondary", "sm")}>
              Ler lista
            </button>
          </div>
          {preview ? (
            <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface-2 p-3" role="status">
              {preview.items.length ? (
                <>
                  <p className="text-sm font-semibold text-text">
                    Encontrei {preview.items.length} {preview.items.length === 1 ? "serviço" : "serviços"}:
                  </p>
                  <ul className="flex flex-col gap-1 text-sm">
                    {preview.items.map((item, index) => (
                      <li key={index} className="flex items-baseline justify-between gap-3 border-b border-line pb-1 last:border-b-0">
                        <span className="min-w-0 break-words text-text">{item.name}</span>
                        <span className="shrink-0 text-muted">
                          {item.priceCents !== null ? `${item.priceFrom ? "desde " : ""}${money.format(item.priceCents / 100)}` : "sem preço"}
                          {item.durationMinutes ? ` · ${item.durationMinutes} min` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-text">Não encontrei preços nesse texto. Escreva uma linha por serviço, por exemplo «Corte 16€».</p>
              )}
              {preview.skipped.length ? <p className="text-xs text-gold-text">Linhas sem preço que deixei de fora: {preview.skipped.map((line) => `«${line}»`).join(", ")}.</p> : null}
              {preview.items.length ? (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => applyPreview(false)} className={buttonClasses("primary", "sm")}>
                    Acrescentar à lista
                  </button>
                  {rows.some((row) => row.name.trim()) ? (
                    <button type="button" onClick={() => applyPreview(true)} className={buttonClasses("secondary", "sm")}>
                      Substituir a lista
                    </button>
                  ) : null}
                  <button type="button" onClick={() => setPreview(null)} className={buttonClasses("ghost", "sm")}>
                    Cancelar
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </details>

      <ul className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <li key={row.key} className="flex flex-col gap-2 rounded-xl border border-line p-3">
            <div className="flex items-end gap-2">
              <label className={`${adminLabelClasses} min-w-0 flex-1`}>
                Serviço {index + 1}
                <input value={row.name} maxLength={120} onChange={(event) => update(row.key, { name: event.target.value })} placeholder="Corte de cabelo" className={input} />
              </label>
              <button
                type="button"
                onClick={() => setRows((list) => (list.length > 1 ? list.filter((item) => item.key !== row.key) : [{ key: nextKey(), name: "", price: "", from: false, duration: "" }]))}
                aria-label={`Tirar ${row.name || `o serviço ${index + 1}`}`}
                className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-muted hover:bg-surface-2"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-[8rem_8rem_auto] sm:items-end">
              <label className={adminLabelClasses}>
                Preço (€)
                <input value={row.price} inputMode="decimal" onChange={(event) => update(row.key, { price: event.target.value })} placeholder="16,50" className={input} />
              </label>
              <label className={adminLabelClasses}>
                <span>
                  Duração <Hint>(min)</Hint>
                </span>
                <input value={row.duration} inputMode="numeric" onChange={(event) => update(row.key, { duration: event.target.value.replace(/\D/g, "") })} placeholder="30" className={input} />
              </label>
              <label className="col-span-2 inline-flex items-center gap-2 text-sm text-muted sm:col-span-1 sm:pb-3">
                <input type="checkbox" checked={row.from} onChange={(event) => update(row.key, { from: event.target.checked })} className="h-4 w-4 accent-[var(--color-accent)]" />
                Preço «desde»
              </label>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setRows((list) => [...list, { key: nextKey(), name: "", price: "", from: false, duration: "" }])} className={buttonClasses("secondary", "sm", "self-start")}>
        + Acrescentar serviço
      </button>
    </StepForm>
  );
}

// 4. Perguntas frequentes ------------------------------------------------------------------------------

function FaqStep({ data, ...props }: StepProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(data.faqs.map((faq) => [faq.id, faq.answer])));
  const answered = data.faqs.filter((faq) => answers[faq.id]?.trim()).length;
  return (
    <StepForm action={saveSetupFaqs} {...props}>
      <p className="text-sm text-muted">
        As perguntas que os clientes mais fazem num negócio como o seu ({kindLabels[data.bot.kind].toLowerCase()}). Responda às que se aplicam e deixe as outras em branco: só as respondidas
        são guardadas.
      </p>
      {data.bot.kind === "lodging" ? (
        <p className="rounded-xl border border-gold/40 bg-gold-soft px-3 py-2 text-sm text-gold-text">Nunca escreva códigos da porta, da caixa das chaves ou do alarme: o assistente não os envia.</p>
      ) : null}
      <input type="hidden" name="id" value={data.bot.id} />
      <input type="hidden" name="kind" value={data.bot.kind} />
      <input type="hidden" name="answers" value={JSON.stringify(data.faqs.map((faq) => ({ id: faq.id, answer: answers[faq.id] ?? "" })))} />
      <p className="text-sm font-semibold text-text" aria-live="polite">
        {answered} de {data.faqs.length} respondidas{answered < setupTargets.questions ? ` · faltam ${setupTargets.questions - answered} para as ${setupTargets.questions} recomendadas` : " ✓"}
      </p>
      <ul className="flex flex-col gap-3">
        {data.faqs.map((faq) => (
          <li key={faq.id}>
            <label className={adminLabelClasses}>
              <span className="font-semibold text-text">{faq.question}</span>
              <textarea
                rows={2}
                maxLength={1000}
                value={answers[faq.id] ?? ""}
                onChange={(event) => setAnswers((current) => ({ ...current, [faq.id]: event.target.value }))}
                placeholder={faq.example}
                className={area}
              />
            </label>
          </li>
        ))}
      </ul>
      <p className="text-xs text-subtle">Outras perguntas e respostas: separador «Conhecimento».</p>
    </StepForm>
  );
}

// 5. Documentos e experimentar -------------------------------------------------------------------------

function TestStep({ data, tested, onTested, onGo }: { data: SetupWizardData; tested: boolean; onTested: () => void; onGo: (step: number) => void }) {
  const questions = data.progress.steps.find((item) => item.id === "questions");
  const answered = questions ? Math.round(questions.points / (20 / setupTargets.questions)) : 0;
  const checklist = [
    ...data.progress.steps.map((item) => ({
      key: item.id,
      label: item.id === "questions" ? `${setupTargets.questions}+ perguntas respondidas (${Math.min(answered, setupTargets.questions)} de ${setupTargets.questions})` : item.label,
      done: item.done,
      step: stepOf[item.id],
    })),
    { key: "tested", label: "Testado como cliente", done: tested, step: 5 },
  ];
  const ready = checklist.every((item) => item.done);
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted">Envie o que já tem (preçário, menu, guia da casa, políticas) e experimente como se fosse um cliente.</p>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-text">Documentos</h4>
        {data.documents ? (
          <DocumentsEditor botId={data.bot.id} documents={data.documents} properties={data.properties} outdated={data.outdatedDocuments} />
        ) : (
          <p className="text-sm text-muted">Os documentos ainda não estão disponíveis nesta base de dados.</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-text">Experimentar</h4>
        <TestChat
          botId={data.bot.id}
          suggestions={data.testQuestions}
          onAnswered={onTested}
          hint="Toque numa pergunta abaixo ou escreva como um cliente. Responde com o que configurou, mesmo com as respostas desligadas."
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface-2 p-4">
        <h4 className="text-base font-semibold text-text">{ready ? "Pronto a responder" : "O que falta"}</h4>
        <ul className="flex flex-col gap-2">
          {checklist.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-3 text-sm">
              <span className={`flex items-center gap-2 ${item.done ? "text-text" : "text-muted"}`}>
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${item.done ? "bg-success text-white" : "border border-line-strong bg-surface"}`}
                >
                  {item.done ? "✓" : ""}
                </span>
                {item.label}
                <span className="sr-only">{item.done ? " (feito)" : " (por fazer)"}</span>
              </span>
              {!item.done && item.step !== 5 ? (
                <button type="button" onClick={() => onGo(item.step)} className="shrink-0 text-xs font-semibold text-accent-text underline-offset-2 hover:underline">
                  Passo {item.step}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {ready ? <p className="text-sm text-muted">Quando quiser, ligue as respostas no separador «Ligação».</p> : null}
      </div>
    </div>
  );
}
