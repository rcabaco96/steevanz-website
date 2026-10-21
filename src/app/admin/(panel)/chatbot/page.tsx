import type { Metadata } from "next";
import Link from "next/link";
import { ChatbotNotReady, EnabledBadge, effectiveSessionState, kindLabels, SessionBadge, SetupScoreBadge } from "@/components/admin/chatbot/ChatbotBits";
import { NewBotForm } from "@/components/admin/chatbot/NewBotForm";
import { TestChat } from "@/components/admin/chatbot/TestChat";
import { AdminPageHeader, EmptyState, Panel } from "@/components/backoffice/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { ChatbotNotReadyError, listBots, listClientOptions, type BotListItem } from "@/lib/chatbot/admin-store";

export const metadata: Metadata = { title: "Assistente WhatsApp" };

export default async function AdminChatbotPage() {
  await requireAdmin();
  let bots: BotListItem[] | null = null;
  try {
    bots = await listBots();
  } catch (error) {
    if (!(error instanceof ChatbotNotReadyError)) throw error;
  }
  const clients = bots ? await listClientOptions() : [];

  return (
    <>
      <AdminPageHeader
        title="Assistente WhatsApp"
        description={bots ? `${bots.length} ${bots.length === 1 ? "assistente" : "assistentes"} · respostas gratuitas, sem IA paga` : "Chatbot com IA para o WhatsApp dos clientes"}
      />

      {!bots ? (
        <ChatbotNotReady />
      ) : bots.length ? (
        <ul className="flex flex-col gap-2">
          {bots.map((bot) => (
            <li key={bot.id}>
              <Link href={`/admin/chatbot/${bot.id}`} className="card flex flex-col gap-2 p-4 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:justify-between">
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold text-text">{bot.name}</span>
                  <span className="text-sm text-muted">
                    {bot.ownerLabel} · {kindLabels[bot.kind]}
                    {bot.whatsapp_number ? ` · ${bot.whatsapp_number}` : ""}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  {bot.waiting ? (
                    <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-semibold text-gold-text">
                      {bot.waiting} para a equipa
                    </span>
                  ) : null}
                  <SetupScoreBadge score={bot.setupScore} />
                  <EnabledBadge enabled={bot.enabled} />
                  <SessionBadge state={effectiveSessionState(bot.session)} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>Ainda não há assistentes. Crie o primeiro abaixo.</EmptyState>
      )}

      {bots ? (
        <Panel title="Novo assistente">
          {clients.length ? <NewBotForm clients={clients} /> : <EmptyState>Primeiro crie a conta do cliente em «Clientes».</EmptyState>}
        </Panel>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Experimentar: restaurante de exemplo">
          <TestChat demo="restaurante" hint="Experimente «A que horas abrem?», «Quanto custa o polvo?», «Is there parking?» ou «Quero falar com alguém»." />
        </Panel>
        <Panel title="Experimentar: alojamento de exemplo">
          <TestChat demo="alojamento" hint="Dois alojamentos e um guia da casa em documento. Experimente «What's the wifi password?», «Onde fica o supermercado?», «Qual é o código da porta?» ou «Can we check in early?»." />
        </Panel>
      </div>
    </>
  );
}
