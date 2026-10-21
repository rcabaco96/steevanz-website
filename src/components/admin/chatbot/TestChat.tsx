"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { adminInputClasses } from "@/components/backoffice/ui";
import { buttonClasses } from "@/components/ui/Button";
import { testChat, type TestChatState } from "@/lib/chatbot/actions";

const empty: TestChatState = { turns: [], conversation: null, error: null };

/** «Documento: Guia da barbearia — Cabelo · Combinados», one line per document (sections cleaned and deduplicated by the engine). */
function sourceLines(sources: { title: string; section?: string | null }[]): string[] {
  const byTitle = new Map<string, string[]>();
  for (const source of sources) {
    const sections = byTitle.get(source.title) ?? [];
    if (source.section && !sections.includes(source.section)) sections.push(source.section);
    byTitle.set(source.title, sections);
  }
  return [...byTitle].map(([title, sections]) => `Documento: ${title}${sections.length ? ` — ${sections.join(" · ")}` : ""}`);
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={buttonClasses("primary", "md", "shrink-0")}>
      {pending ? <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      Enviar
    </button>
  );
}

/**
 * Talk to the assistant as a customer would, right here: the free mock answers with the bot's (or
 * the example's) information. Nothing is stored and nothing goes to WhatsApp.
 */
export function TestChat({
  botId,
  demo,
  hint,
  suggestions,
  onAnswered,
}: {
  botId?: string;
  demo?: string;
  hint?: string;
  /** Questions sent with one tap (the sector's usual questions). */
  suggestions?: string[];
  /** Called once the assistant has answered a test message. */
  onAnswered?: () => void;
}) {
  const [state, action] = useActionState(testChat, empty);
  const list = useRef<HTMLOListElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    list.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
    form.current?.reset();
  }, [state.turns.length]);
  const answered = state.turns.some((turn) => turn.author === "bot");
  useEffect(() => {
    if (answered) onAnswered?.();
  }, [answered, onAnswered]);
  const send = (message: string) => {
    if (!input.current || !form.current) return;
    input.current.value = message;
    form.current.requestSubmit();
  };

  return (
    <div className="flex flex-col gap-3">
      <ol ref={list} aria-live="polite" className="flex max-h-[28rem] min-h-40 flex-col gap-2 overflow-y-auto rounded-2xl border border-line bg-surface-2 p-3">
        {state.turns.length === 0 ? <li className="m-auto max-w-xs text-center text-sm text-muted">{hint ?? "Escreva como um cliente, por exemplo «A que horas abrem?» ou «Is there parking?»."}</li> : null}
        {state.turns.map((turn, index) => (
          <li
            key={index}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
              turn.author === "customer"
                ? "self-end bg-accent text-accent-contrast"
                : turn.author === "bot"
                  ? "self-start border border-line bg-surface text-text"
                  : "self-center bg-gold-soft text-gold-text text-xs"
            }`}
          >
            {turn.body}
            {turn.sources?.length || turn.by || turn.note ? (
              <span className="mt-1.5 block border-t border-line pt-1 text-[0.7rem] text-subtle">
                {turn.by ? <span className="block">{turn.by}</span> : null}
                {turn.sources?.length
                  ? sourceLines(turn.sources).map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))
                  : null}
                {turn.note ? <span className="block">{turn.note}</span> : null}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {suggestions?.length ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Perguntas sugeridas">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => send(question)}
              className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-text transition-colors hover:border-accent hover:text-accent-text"
            >
              {question}
            </button>
          ))}
        </div>
      ) : null}
      <form ref={form} action={action} className="flex gap-2">
        {botId ? <input type="hidden" name="bot_id" value={botId} /> : null}
        {demo ? <input type="hidden" name="demo" value={demo} /> : null}
        <label className="sr-only" htmlFor={`test-message-${botId ?? demo}`}>
          Mensagem do cliente
        </label>
        <input ref={input} id={`test-message-${botId ?? demo}`} name="message" required maxLength={1000} autoComplete="off" placeholder="Mensagem do cliente…" className={`${adminInputClasses} h-11 min-w-0 flex-1`} />
        <SendButton />
      </form>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {state.error ? (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        ) : (
          <p className="text-xs text-subtle">Sem IA paga. Nada é guardado nem enviado para o WhatsApp.</p>
        )}
        {state.turns.length ? (
          <form action={action}>
            <input type="hidden" name="reset" value="1" />
            <button type="submit" className={buttonClasses("ghost", "sm")}>
              Recomeçar
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
