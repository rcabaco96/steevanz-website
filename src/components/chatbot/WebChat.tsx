"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/Button";

// The site chat as a visitor sees it (today only on /chat-teste): replies only, no sources or notes. The
// conversation stays in this browser tab (sessionStorage) and goes back with each message, like the admin's
// «Experimentar»; nothing is stored on the server.

type Turn = { author: "customer" | "bot"; body: string };
type Saved = { turns: Turn[]; conversation: unknown; session: string };

const storageKey = "steevanz-chat-teste";
const maxChars = 500;

function newSession(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }
}

function load(): Saved | null {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Saved;
    return Array.isArray(saved.turns) && typeof saved.session === "string" ? saved : null;
  } catch {
    return null;
  }
}

function save(saved: Saved) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    // Private mode or blocked storage: the chat still works, it just isn't kept on reload.
  }
}

/** Web addresses in a reply become links (only http(s), opened in a new tab). */
function withLinks(text: string) {
  return text.split(/(https?:\/\/[^\s)»]+)/g).map((part, index) => {
    if (!/^https?:\/\//.test(part)) return part;
    const href = part.replace(/[.,;:!?]+$/, "");
    const rest = part.slice(href.length);
    return (
      <span key={index}>
        <a href={href} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-accent-text underline underline-offset-2">
          {href}
        </a>
        {rest}
      </span>
    );
  });
}

export function WebChat({ suggestions }: { suggestions: readonly string[] }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [conversation, setConversation] = useState<unknown>(null);
  const [session, setSession] = useState("");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  // Restore this tab's conversation (sessionStorage is only readable in the browser).
  useEffect(() => {
    const saved = load();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage once after mounting
    setTurns(saved?.turns ?? []);
    setConversation(saved?.conversation ?? null);
    setSession(saved?.session ?? newSession());
  }, []);

  useEffect(() => {
    const last = list.current?.lastElementChild;
    if (last) last.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [turns.length, pending]);

  async function send(text: string) {
    const message = text.replace(/\s+/g, " ").trim();
    if (!message || pending) return;
    const id = session || newSession();
    const before = turns;
    const shown: Turn[] = [...before, { author: "customer", body: message }];
    setTurns(shown);
    setDraft("");
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/chatbot/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, turns: before.slice(-20), conversation, session: id }),
      });
      const data = (await response.json().catch(() => ({}))) as { replies?: string[]; conversation?: unknown; message?: string };
      if (!response.ok || !Array.isArray(data.replies)) {
        setTurns(before);
        setDraft(message);
        setError(data.message ?? "Não consegui enviar a mensagem. Tente novamente.");
        return;
      }
      const next: Turn[] = [...shown, ...data.replies.map((body) => ({ author: "bot" as const, body }))].slice(-60);
      setTurns(next);
      setConversation(data.conversation ?? null);
      setSession(id);
      save({ turns: next, conversation: data.conversation ?? null, session: id });
    } catch {
      setTurns(before);
      setDraft(message);
      setError("Sem ligação. Verifique a internet e tente novamente.");
    } finally {
      setPending(false);
      input.current?.focus();
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  function restart() {
    const id = newSession();
    setTurns([]);
    setConversation(null);
    setSession(id);
    setError(null);
    save({ turns: [], conversation: null, session: id });
  }

  return (
    <section aria-label="Conversa com o assistente Steevanz" className="flex min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-accent px-4 py-3 text-accent-contrast">
        <div className="flex min-w-0 items-center gap-3">
          {/* The round «S.» mark, the same as the favicon. */}
          <Image src="/icons/icon-192.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">Assistente Steevanz</p>
            <p className="truncate text-xs opacity-80">{pending ? "A escrever…" : "Responde em segundos"}</p>
          </div>
        </div>
        {turns.length ? (
          <button type="button" onClick={restart} className="shrink-0 rounded-full border border-white/40 px-3 py-1 text-xs font-semibold transition-colors hover:bg-white/10">
            Recomeçar
          </button>
        ) : null}
      </header>

      <ol ref={list} aria-live="polite" aria-busy={pending} className="flex max-h-[60vh] min-h-64 flex-1 flex-col gap-2 overflow-y-auto bg-surface-2 px-3 py-4">
        {turns.length === 0 ? (
          <li className="m-auto max-w-xs px-2 text-center text-sm text-muted">
            Pergunte o que quiser sobre a Steevanz: produtos, preços, setores ou como marcar uma demonstração.
          </li>
        ) : null}
        {turns.map((turn, index) => (
          <li
            key={index}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[0.95rem] leading-relaxed whitespace-pre-wrap break-words ${
              turn.author === "customer" ? "self-end rounded-br-md bg-accent text-accent-contrast" : "self-start rounded-bl-md border border-line bg-surface text-text"
            }`}
          >
            <span className="sr-only">{turn.author === "customer" ? "Você: " : "Assistente: "}</span>
            {turn.author === "bot" ? withLinks(turn.body) : turn.body}
          </li>
        ))}
        {pending ? (
          <li className="self-start rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3" aria-hidden="true">
            <span className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <span key={delay} className="h-2 w-2 animate-bounce rounded-full bg-accent/70" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </span>
          </li>
        ) : null}
      </ol>
      {pending ? (
        <p role="status" className="sr-only">
          O assistente está a escrever…
        </p>
      ) : null}

      {suggestions.length ? (
        <div className="border-t border-line bg-surface px-3 pt-3">
          <p className="sr-only" id="chat-suggestions">
            Perguntas sugeridas
          </p>
          {/* Phone: swipe sideways (thin bar as a hint); from sm up they wrap so every question shows. */}
          <div role="group" aria-labelledby="chat-suggestions" className="-mx-3 flex snap-x gap-2 overflow-x-auto overscroll-x-contain px-3 pb-2 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible">
            {suggestions.map((question) => (
              <button
                key={question}
                type="button"
                disabled={pending}
                onClick={() => void send(question)}
                className="shrink-0 snap-start rounded-full border border-line bg-bg px-3 py-1.5 text-sm text-text transition-colors hover:border-accent hover:text-accent-text disabled:opacity-60"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex items-end gap-2 bg-surface p-3">
        <label className="sr-only" htmlFor="chat-message">
          A sua mensagem
        </label>
        <textarea
          ref={input}
          id="chat-message"
          rows={1}
          value={draft}
          maxLength={maxChars}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send(draft);
            }
          }}
          placeholder="Escreva a sua pergunta…"
          autoComplete="off"
          className="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-line-strong bg-bg px-3.5 py-2.5 text-base text-text placeholder:text-subtle focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <button type="submit" disabled={pending || !draft.trim()} aria-busy={pending} className={buttonClasses("primary", "md", "h-11 shrink-0")}>
          Enviar
        </button>
      </form>
      {error ? (
        <p role="alert" className="border-t border-line bg-danger-soft px-4 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </section>
  );
}
