import { EmptyState } from "@/components/backoffice/ui";
import type { SessionState } from "@/lib/chatbot/rows";
import type { ChatbotBusinessKind, ChatbotLanguage } from "@/lib/chatbot/types";

export const kindLabels: Record<ChatbotBusinessKind, string> = {
  restaurant: "Restaurante, café ou bar",
  lodging: "Alojamento local",
  beauty: "Cabeleireiro, barbearia ou estética",
  clinic: "Clínica ou consultório",
  retail: "Loja",
  other: "Outro serviço",
};

export const languageLabels: Record<ChatbotLanguage, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  de: "Alemão",
  it: "Italiano",
};

export function ChatbotNotReady() {
  return (
    <EmptyState>
      A base de dados ainda não tem as tabelas do assistente. Falta aprovar e aplicar a migração{" "}
      <code className="font-mono text-xs">20261020200000_chatbot.sql</code>. Entretanto pode experimentar o assistente com os negócios de exemplo.
    </EmptyState>
  );
}

const sessionLabels: Record<SessionState, [string, string]> = {
  stopped: ["Desligado", "bg-surface-2 text-subtle border-line"],
  starting: ["A arrancar", "bg-gold-soft text-gold-text border-gold/40"],
  qr: ["À espera do QR", "bg-gold-soft text-gold-text border-gold/40"],
  connected: ["Ligado", "bg-success-soft text-success border-success/30"],
  disconnected: ["Sem ligação", "bg-danger-soft text-danger border-danger/30"],
  error: ["Erro", "bg-danger-soft text-danger border-danger/30"],
};

/** The runner says it is alive every 30 s: without news for 2 minutes it counts as off. */
export function effectiveSessionState(session: { state: SessionState; last_seen_at: string | null } | null, now = Date.now()): SessionState {
  if (!session) return "stopped";
  if (session.state === "stopped") return "stopped";
  const seen = session.last_seen_at ? Date.parse(session.last_seen_at) : 0;
  return now - seen > 2 * 60_000 ? "stopped" : session.state;
}

export function SessionBadge({ state }: { state: SessionState }) {
  const [label, tone] = sessionLabels[state];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tone}`}>{label}</span>;
}

export function EnabledBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${
        enabled ? "bg-success-soft text-success border-success/30" : "bg-surface-2 text-subtle border-line"
      }`}
    >
      {enabled ? "Respostas ligadas" : "Respostas desligadas"}
    </span>
  );
}
