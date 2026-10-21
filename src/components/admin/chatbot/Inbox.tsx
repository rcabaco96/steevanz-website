import Link from "next/link";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState } from "@/components/backoffice/ui";
import { resolveConversation } from "@/lib/chatbot/actions";
import { handoffReasonLabel } from "@/lib/chatbot/guardrails";
import type { ConversationRow, MessageRow } from "@/lib/chatbot/rows";
import type { HandoffReason } from "@/lib/chatbot/types";
import { languageLabels } from "./ChatbotBits";

const time = new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function when(iso: string): string {
  return time.format(new Date(iso));
}

/** «+351 91x xxx 678»: enough to recognise the customer without showing the whole number in lists. */
function contactLabel(conversation: Pick<ConversationRow, "contact_id" | "contact_name">): string {
  const digits = conversation.contact_id.split("@")[0];
  const masked = digits.length > 6 ? `+${digits.slice(0, 5)}…${digits.slice(-3)}` : digits;
  return conversation.contact_name ? `${conversation.contact_name} (${masked})` : masked;
}

function reasonText(reason: string | null): string | null {
  if (!reason) return null;
  try {
    return handoffReasonLabel(reason as HandoffReason) ?? reason;
  } catch {
    return reason;
  }
}

const authorLabels: Record<MessageRow["author"], string> = { customer: "Cliente", bot: "Assistente", owner: "Equipa", system: "Sistema" };

export function Inbox({
  botId,
  basePath,
  conversations,
  selected,
  messages,
}: {
  botId: string;
  basePath: string;
  conversations: ConversationRow[];
  selected: ConversationRow | null;
  messages: MessageRow[];
}) {
  if (!conversations.length) return <EmptyState>Ainda não há conversas. Aparecem aqui quando o programa do assistente estiver a correr.</EmptyState>;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <ul className="flex flex-col gap-2">
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <Link
              href={`${basePath}?tab=conversas&c=${conversation.id}`}
              aria-current={selected?.id === conversation.id ? "page" : undefined}
              className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 transition-colors ${
                selected?.id === conversation.id ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong"
              }`}
            >
              <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text">
                {contactLabel(conversation)}
                {conversation.handoff_urgent && conversation.needs_attention ? (
                  <span className="rounded-full bg-danger-soft px-2 text-xs text-danger">Urgente</span>
                ) : conversation.needs_attention ? (
                  <span className="rounded-full bg-gold-soft px-2 text-xs text-gold-text">Para a equipa</span>
                ) : null}
                {conversation.mode === "human" ? <span className="rounded-full bg-surface-2 px-2 text-xs text-muted">Assistente em pausa</span> : null}
              </span>
              <span className="text-xs text-subtle">
                {when(conversation.last_message_at)}
                {conversation.language ? ` · ${languageLabels[conversation.language as keyof typeof languageLabels] ?? conversation.language}` : ""}
                {conversation.property ? ` · ${conversation.property}` : ""}
              </span>
              {conversation.needs_attention && conversation.handoff_reason ? <span className="text-xs text-muted">{reasonText(conversation.handoff_reason)}</span> : null}
            </Link>
          </li>
        ))}
      </ul>

      {selected ? (
        <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-line p-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-text">{contactLabel(selected)}</h3>
            {selected.handoff_summary && selected.mode === "human" ? (
              <p className="rounded-xl bg-gold-soft px-3 py-2 text-sm whitespace-pre-wrap text-gold-text">{selected.handoff_summary}</p>
            ) : null}
            {selected.mode === "human" ? (
              <p className="text-sm text-muted">Responda pelo WhatsApp do negócio, no telemóvel. Enquanto a equipa tiver a conversa, o assistente não responde.</p>
            ) : null}
          </div>
          <ol className="flex max-h-[32rem] flex-col gap-2 overflow-y-auto">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm break-words whitespace-pre-wrap ${
                  message.author === "customer" ? "self-start border border-line bg-surface" : message.author === "owner" ? "self-end bg-accent text-accent-contrast" : "self-end bg-surface-2"
                }`}
              >
                <span className="mb-0.5 block text-[0.7rem] font-semibold opacity-70">
                  {authorLabels[message.author]} · {when(message.created_at)}
                </span>
                {message.body}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            {selected.mode === "human" ? (
              <ActionForm action={resolveConversation}>
                <input type="hidden" name="bot_id" value={botId} />
                <input type="hidden" name="id" value={selected.id} />
                <input type="hidden" name="action" value="return" />
                <SubmitButton size="sm" pendingLabel="A devolver…">
                  Devolver ao assistente
                </SubmitButton>
              </ActionForm>
            ) : null}
            {selected.needs_attention ? (
              <ActionForm action={resolveConversation}>
                <input type="hidden" name="bot_id" value={botId} />
                <input type="hidden" name="id" value={selected.id} />
                <input type="hidden" name="action" value="seen" />
                <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…">
                  Marcar como vista
                </SubmitButton>
              </ActionForm>
            ) : null}
          </div>
        </section>
      ) : (
        <p className="hidden text-sm text-muted lg:block">Escolha uma conversa para a ler.</p>
      )}
    </div>
  );
}
