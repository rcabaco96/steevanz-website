import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/admin/RecordDetail";
import { BotSettingsForm, EnableForm } from "@/components/admin/chatbot/BotSettingsForm";
import { ChatbotNotReady, EnabledBadge, effectiveSessionState, kindLabels, SessionBadge } from "@/components/admin/chatbot/ChatbotBits";
import { Inbox } from "@/components/admin/chatbot/Inbox";
import { KnowledgeEditor } from "@/components/admin/chatbot/KnowledgeEditor";
import { TestChat } from "@/components/admin/chatbot/TestChat";
import { AdminPageHeader, EmptyState, Panel } from "@/components/backoffice/ui";
import { AutoRefresh } from "@/components/modules/shared/AutoRefresh";
import { CopyButton } from "@/components/modules/shared/CopyButton";
import { QrCode } from "@/components/modules/shared/QrCode";
import { requireAdmin } from "@/lib/admin/auth";
import { ChatbotNotReadyError, getAdminBot, getConversationMessages, listConversations, type AdminBot } from "@/lib/chatbot/admin-store";
import { formatWeek } from "@/lib/chatbot/hours";
import { itemSummary } from "@/lib/chatbot/rows";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Assistente WhatsApp" };

const tabs = [
  { id: "ligacao", label: "Ligação" },
  { id: "conhecimento", label: "Conhecimento" },
  { id: "definicoes", label: "Definições" },
  { id: "conversas", label: "Conversas" },
  { id: "experimentar", label: "Experimentar" },
] as const;
type TabId = (typeof tabs)[number]["id"];

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function AdminChatbotBotPage({ params, searchParams }: PageProps<"/admin/chatbot/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const requested = first(query.tab);
  const tab: TabId = tabs.some((item) => item.id === requested) ? (requested as TabId) : "ligacao";

  let data: AdminBot | null = null;
  try {
    data = await getAdminBot(id);
  } catch (error) {
    if (!(error instanceof ChatbotNotReadyError)) throw error;
    return (
      <>
        <BackLink href="/admin/chatbot" label="Assistente WhatsApp" />
        <ChatbotNotReady />
      </>
    );
  }
  if (!data) {
    return (
      <>
        <BackLink href="/admin/chatbot" label="Assistente WhatsApp" />
        <EmptyState>Este assistente já não existe.</EmptyState>
      </>
    );
  }

  const { row, profile } = data;
  const basePath = `/admin/chatbot/${row.id}`;
  const conversations = tab === "conversas" ? await listConversations(row.id) : [];
  const selectedId = first(query.c);
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? null;
  const messages = selected ? await getConversationMessages(row.id, selected.id) : [];
  const sessionState = effectiveSessionState(data.session);
  const establishment = data.establishments.find((item) => item.id === row.establishment_id) ?? null;

  return (
    <>
      <BackLink href="/admin/chatbot" label="Assistente WhatsApp" />
      <AdminPageHeader
        title={row.name}
        description={`${data.ownerLabel} · ${kindLabels[row.kind]}`}
        actions={
          <span className="flex flex-wrap items-center gap-2">
            <EnabledBadge enabled={row.enabled} />
            <SessionBadge state={sessionState} />
          </span>
        }
      />

      <nav aria-label="Secções do assistente" className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1 [scrollbar-width:none]">
        {tabs.map((item) => (
          <Link
            key={item.id}
            href={item.id === "ligacao" ? basePath : `${basePath}?tab=${item.id}`}
            aria-current={item.id === tab ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              item.id === tab ? "border-accent text-text" : "border-transparent text-muted hover:text-text"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {tab === "ligacao" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {sessionState === "qr" || sessionState === "starting" ? <AutoRefresh intervalMs={4000} /> : null}
          <Panel title="Número de WhatsApp">
            <div className="flex flex-col gap-4 text-sm text-muted">
              {sessionState === "qr" && data.session?.qr ? (
                <div className="flex flex-col items-center gap-3">
                  <QrCode value={data.session.qr} label="QR para ligar o WhatsApp do negócio" className="h-56 w-56 rounded-xl border border-line bg-white p-2" />
                  <p className="text-center">
                    No telemóvel do negócio: WhatsApp › <strong className="text-text">Dispositivos ligados</strong> › <strong className="text-text">Ligar um dispositivo</strong> e aponte para este QR.
                  </p>
                </div>
              ) : sessionState === "connected" ? (
                <p>
                  Ligado{data.session?.number ? <> ao número <strong className="text-text">{data.session.number}</strong></> : null}. O assistente responde enquanto o programa estiver a correr
                  {row.enabled ? "." : ", mas as respostas estão desligadas."}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  <p>
                    O programa do assistente ainda não está a correr. Arranca-se à mão no computador (mais tarde, no servidor gratuito) e mostra aqui o QR para ligar o
                    WhatsApp do negócio.
                  </p>
                  <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface-2 p-3">
                    <code className="font-mono text-xs break-all text-text">node scripts/chatbot/runner.mjs --bot {row.id}</code>
                    <div>
                      <CopyButton value={`node scripts/chatbot/runner.mjs --bot ${row.id}`} label="Copiar comando" />
                    </div>
                  </div>
                  <p className="text-xs text-subtle">
                    Por omissão só ouve: liga ao número e não responde a ninguém. Só com «--reply» responde, e apenas aos números da lista do .env.local. Passo a passo em
                    docs/chatbot/PILOTO.md.
                  </p>
                </div>
              )}
              {data.session?.message && sessionState !== "connected" ? <p className="text-danger">Última mensagem do programa: {data.session.message}</p> : null}
            </div>
          </Panel>
          <Panel title="Respostas">
            <div className="flex flex-col gap-4 text-sm text-muted">
              <p>
                {row.enabled
                  ? "Ligadas: o assistente responde aos clientes que escrevem para o número."
                  : "Desligadas: mesmo com o número ligado, o assistente não responde. Ligue depois de testar o conhecimento no separador «Experimentar»."}
              </p>
              <EnableForm bot={row} />
              <p className="rounded-xl border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">
                A ligação por WhatsApp Web (open-wa) é só para testes, num número de teste: não é oficial e o WhatsApp pode bloquear o número. Responde só aos números
                da lista, a quem escreve primeiro, no máximo 10 vezes por hora. Os clientes usarão a API oficial. Ver docs/chatbot/PILOTO.md.
              </p>
            </div>
          </Panel>
        </div>
      ) : null}

      {tab === "conhecimento" ? (
        <div className="flex flex-col gap-6">
          <Panel title="O que o assistente já sabe">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-text">Horário {establishment ? `(de ${establishment.name})` : ""}</dt>
                <dd className="whitespace-pre-line text-muted">
                  {profile.knowledge.hours.length ? formatWeek(profile.knowledge.hours, "pt") : "Sem horário: ligue um espaço nas definições, senão o assistente nunca diz que está fechado."}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-text">Contactos e ligações</dt>
                <dd className="flex flex-col gap-0.5 text-muted">
                  <span>Morada: {profile.knowledge.address ?? "—"}</span>
                  <span>Telefone: {profile.knowledge.phone ?? "—"}</span>
                  <span className="break-all">Reservas: {profile.knowledge.bookingUrl ?? "—"}</span>
                  <span className="break-all">Menu: {profile.knowledge.menuUrl ?? "—"}</span>
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <dt className="font-semibold text-text">Pratos e serviços com preço ({profile.knowledge.items.length})</dt>
                <dd className="text-muted">
                  {profile.knowledge.items.length
                    ? profile.knowledge.items.slice(0, 12).map(itemSummary).join(" · ") + (profile.knowledge.items.length > 12 ? " · …" : "")
                    : "Nenhum: ligue um menu em vídeo ou um espaço com serviços nas definições."}
                </dd>
              </div>
            </dl>
          </Panel>
          <Panel title="Respostas do negócio">
            <KnowledgeEditor botId={row.id} entries={data.entries} properties={row.properties} />
          </Panel>
        </div>
      ) : null}

      {tab === "definicoes" ? (
        <Panel>
          <BotSettingsForm
            bot={row}
            establishments={data.establishments}
            menus={data.menus}
            bookingSuggestion={establishment ? `${siteUrl}/reservar/${establishment.slug}` : null}
          />
        </Panel>
      ) : null}

      {tab === "conversas" ? <Inbox botId={row.id} basePath={basePath} conversations={conversations} selected={selected} messages={messages} /> : null}

      {tab === "experimentar" ? (
        <Panel title="Experimentar como cliente">
          <TestChat botId={row.id} hint="Escreva como um cliente. Responde com a informação deste negócio, mesmo com as respostas desligadas." />
        </Panel>
      ) : null}
    </>
  );
}
