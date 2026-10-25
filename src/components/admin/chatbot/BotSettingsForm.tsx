"use client";

import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { setBotEnabled, setPaidAnswers, updateBot } from "@/lib/chatbot/actions";
import type { BotRow } from "@/lib/chatbot/rows";
import { chatbotBusinessKinds, chatbotLanguages } from "@/lib/chatbot/types";
import { kindLabels, languageLabels } from "./ChatbotBits";

const input = `${adminInputClasses} h-11`;

const resumeOptions: [string, string][] = [
  ["", "Só quando a equipa a devolver"],
  ["60", "Depois de 1 hora sem a equipa escrever"],
  ["240", "Depois de 4 horas"],
  ["720", "Depois de 12 horas"],
  ["1440", "Depois de 24 horas"],
];

/** Switches the replies on or off at once (the runner reads it every minute). */
export function EnableForm({ bot }: { bot: Pick<BotRow, "id" | "enabled"> }) {
  return (
    <ActionForm
      action={setBotEnabled}
      confirmMessage={bot.enabled ? "Desligar as respostas? O assistente deixa de responder a todos os clientes até as voltar a ligar." : undefined}
      className="flex flex-wrap items-center gap-3"
    >
      <input type="hidden" name="id" value={bot.id} />
      <input type="hidden" name="enabled" value={bot.enabled ? "0" : "1"} />
      <SubmitButton variant={bot.enabled ? "secondary" : "primary"} size="sm" pendingLabel="A guardar…">
        {bot.enabled ? "Desligar respostas" : "Ligar respostas"}
      </SubmitButton>
    </ActionForm>
  );
}

/**
 * The owner's switch for paid answers (paid_answers_allowed): only here in the admin, never in the client
 * panel. Off: no request ever goes to Mistral, even with «IA para clientes» chosen.
 */
export function PaidAnswersForm({ bot, mistralKeyHere }: { bot: Pick<BotRow, "id" | "paid_answers_allowed" | "answer_provider">; mistralKeyHere: boolean }) {
  const allowed = bot.paid_answers_allowed;
  return (
    <ActionForm
      action={setPaidAnswers}
      confirmMessage={
        allowed
          ? "Desligar a IA paga? Este assistente passa a responder sem IA paga."
          : "Autorizar a IA paga neste assistente? Com «IA para clientes (Mistral, UE)» escolhida, as mensagens dos clientes e os excertos passam a ser enviados à Mistral para escrever as respostas."
      }
      className="flex flex-col gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted"
    >
      <input type="hidden" name="id" value={bot.id} />
      <input type="hidden" name="paid_answers_allowed" value={allowed ? "0" : "1"} />
      <p className="font-semibold text-text">IA paga (só o dono)</p>
      <p>
        Autoriza este assistente a usar a IA para clientes (Mistral). Enquanto não estiver autorizada, nunca é feito nenhum pedido à Mistral, mesmo com essa opção
        escolhida nas definições acima: responde sem IA. Este interruptor só existe aqui no admin; os clientes não o veem.
      </p>
      <p>
        Estado:{" "}
        <span className="font-semibold text-text">{allowed ? "autorizada" : "não autorizada"}</span>
        {allowed && bot.answer_provider !== "real" ? " (mas as respostas não estão em «IA para clientes (Mistral, UE)», por isso a Mistral não é usada)" : ""}.
      </p>
      {allowed && !mistralKeyHere ? (
        <p className="rounded-lg border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">Falta a chave MISTRAL_API_KEY neste servidor: até ser posta, responde sem IA.</p>
      ) : null}
      <div>
        <SubmitButton variant={allowed ? "secondary" : "primary"} size="sm" pendingLabel="A guardar…">
          {allowed ? "Desligar IA paga" : "Autorizar IA paga"}
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

export function BotSettingsForm({
  bot,
  establishments,
  menus,
  bookingSuggestion,
  ollamaAvailableHere,
  groqEnabledHere,
  groqKeyHere,
  mistralKeyHere,
}: {
  bot: BotRow;
  ollamaAvailableHere: boolean;
  /** CHATBOT_GROQ_ENABLED=1 on this server (the database allows 'groq'). */
  groqEnabledHere: boolean;
  groqKeyHere: boolean;
  mistralKeyHere: boolean;
  establishments: { id: string; name: string }[];
  menus: { id: string; name: string }[];
  bookingSuggestion: string | null;
}) {
  const current = bot.answer_provider === "ollama" || bot.answer_provider === "groq" || bot.answer_provider === "real" ? bot.answer_provider : "mock";
  return (
    <ActionForm action={updateBot} resetKey={bot.updated_at} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={bot.id} />

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-base font-semibold text-text">Negócio</legend>
        <label className={adminLabelClasses}>
          Nome que o assistente usa
          <input name="name" required maxLength={120} defaultValue={bot.name} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Tipo de negócio
          <select name="kind" defaultValue={bot.kind} className={input}>
            {chatbotBusinessKinds.map((kind) => (
              <option key={kind} value={kind}>
                {kindLabels[kind]}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Espaço (horário, serviços e preços)
          <select name="establishment_id" defaultValue={bot.establishment_id ?? ""} className={input}>
            <option value="">Nenhum</option>
            {establishments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Menu em vídeo (pratos e preços)
          <select name="video_menu_id" defaultValue={bot.video_menu_id ?? ""} className={input}>
            <option value="">Nenhum</option>
            {menus.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Morada <span className="font-normal text-subtle">(vazio = a do espaço)</span>
          <input name="address" maxLength={200} defaultValue={bot.address ?? ""} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Telefone para clientes <span className="font-normal text-subtle">(vazio = o do espaço)</span>
          <input name="phone" maxLength={40} inputMode="tel" defaultValue={bot.phone ?? ""} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Página de reservas
          <input name="booking_url" type="url" maxLength={500} placeholder={bookingSuggestion ?? "https://…"} defaultValue={bot.booking_url ?? ""} className={input} />
          {bookingSuggestion ? <span className="text-xs font-normal text-subtle">Com o sistema de reservas Steevanz ativo: {bookingSuggestion}</span> : null}
        </label>
        <label className={adminLabelClasses}>
          Menu ou preçário <span className="font-normal text-subtle">(vazio = o menu em vídeo)</span>
          <input name="menu_url" type="url" maxLength={500} defaultValue={bot.menu_url ?? ""} placeholder="https://…" className={input} />
        </label>
        <label className={adminLabelClasses}>
          Mapa (Google Maps)
          <input name="maps_url" type="url" maxLength={500} defaultValue={bot.maps_url ?? ""} placeholder="https://…" className={input} />
        </label>
        <label className={adminLabelClasses}>
          Política de privacidade
          <input name="privacy_url" type="url" maxLength={500} defaultValue={bot.privacy_url ?? ""} placeholder="https://…" className={input} />
        </label>
        {bot.kind === "lodging" ? (
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Alojamentos neste número (um por linha, até cinco)
            <textarea name="properties" rows={3} defaultValue={bot.properties.join("\n")} className={`${adminInputClasses} py-2`} />
          </label>
        ) : (
          <input type="hidden" name="properties" value={bot.properties.join("\n")} />
        )}
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-base font-semibold text-text">Conversa</legend>
        <div className={`${adminLabelClasses} sm:col-span-2`}>
          Línguas em que responde
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-normal text-text">
            {chatbotLanguages.map((language) => (
              <label key={language} className="inline-flex items-center gap-2">
                <input type="checkbox" name="languages" value={language} defaultChecked={bot.languages.includes(language)} className="h-4 w-4 accent-[var(--color-accent)]" />
                {languageLabels[language]}
              </label>
            ))}
          </div>
        </div>
        <label className={adminLabelClasses}>
          Língua principal
          <select name="default_language" defaultValue={bot.default_language} className={input}>
            {chatbotLanguages.map((language) => (
              <option key={language} value={language}>
                {languageLabels[language]}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Tom
          <select name="tone" defaultValue={bot.tone} className={input}>
            <option value="formal">Formal («o senhor», «a senhora»)</option>
            <option value="friendly">Mais próximo</option>
          </select>
        </label>
        <label className={adminLabelClasses}>
          Depois de a equipa assumir uma conversa, o assistente volta
          <select name="auto_resume_minutes" defaultValue={bot.auto_resume_minutes === null ? "" : String(bot.auto_resume_minutes)} className={input}>
            {resumeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
            {bot.auto_resume_minutes !== null && !resumeOptions.some(([value]) => value === String(bot.auto_resume_minutes)) ? (
              <option value={String(bot.auto_resume_minutes)}>Depois de {bot.auto_resume_minutes} minutos</option>
            ) : null}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Guardar as conversas durante (dias)
          <input name="retention_days" type="number" min={7} max={730} required defaultValue={bot.retention_days} className={input} />
        </label>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-base font-semibold text-text">WhatsApp</legend>
        <label className={adminLabelClasses}>
          Número do negócio
          <input name="whatsapp_number" maxLength={40} inputMode="tel" placeholder="+351 9xx xxx xxx" defaultValue={bot.whatsapp_number ?? ""} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Ligação
          <select name="channel_provider" defaultValue={bot.channel_provider} className={input}>
            <option value="open-wa">WhatsApp Web (open-wa): só testes</option>
            <option value="cloud-api">API oficial da Meta (webhook do site)</option>
          </select>
        </label>
        <label className={adminLabelClasses}>
          Avisar o dono neste WhatsApp quando uma conversa passa para a equipa <span className="font-normal text-subtle">(não usado nos testes com open-wa)</span>
          <input name="alert_number" maxLength={40} inputMode="tel" placeholder="Opcional" defaultValue={bot.alert_number ?? ""} className={input} />
        </label>
        <fieldset className="flex flex-col gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted sm:col-span-2">
          <legend className="sr-only">Quem escreve as respostas</legend>
          <p className="font-semibold text-text">Quem escreve as respostas</p>
          <label className="flex items-start gap-2">
            <input type="radio" name="answer_provider" value="mock" defaultChecked={current === "mock"} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
            <span>
              <span className="font-semibold text-text">Respostas gratuitas, sem IA</span> — só com a informação e os documentos deste assistente.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input type="radio" name="answer_provider" value="real" defaultChecked={current === "real"} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
            <span className="flex flex-col gap-1">
              <span>
                <span className="font-semibold text-text">IA para clientes (Mistral, UE)</span> — a IA prevista para responder aos clientes; funciona também em
                «Experimentar».
              </span>
              <span>
                A Mistral AI é uma empresa francesa e trata os dados na UE. A mensagem do cliente, as últimas mensagens da conversa e os excertos dos documentos são
                enviados à Mistral para escrever a resposta. Agora a conta está no plano grátis de testes: nesse plano a Mistral pode usar os pedidos para melhorar os
                seus modelos, por isso só com dados de teste. Para clientes reais passa-se ao plano pago, com um limite de gastos definido na conta da Mistral.
              </span>
              <span>
                Só responde depois de o dono autorizar a IA paga (em baixo). Se a Mistral falhar, demorar mais de 15 segundos ou se atingir um limite, volta às respostas
                gratuitas e «Experimentar» diz porquê.
              </span>
              {current === "real" && !bot.paid_answers_allowed ? (
                <span className="rounded-lg border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">
                  A IA paga ainda não está autorizada neste assistente: até o dono a autorizar (em baixo), responde sem IA.
                </span>
              ) : current === "real" && !mistralKeyHere ? (
                <span className="rounded-lg border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">
                  Falta a chave MISTRAL_API_KEY neste servidor: até ser posta, responde sem IA.
                </span>
              ) : null}
            </span>
          </label>
          {groqEnabledHere || current === "groq" ? (
            <label className="flex items-start gap-2">
              <input type="radio" name="answer_provider" value="groq" defaultChecked={current === "groq"} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
              <span className="flex flex-col gap-1">
                <span>
                  <span className="font-semibold text-text">IA de teste (Groq, grátis)</span> — funciona também aqui no site, em «Experimentar».
                </span>
                <span>
                  Usa o plano grátis da Groq, que tem limites por minuto e por dia; quando se atingem, ou se a Groq falhar ou demorar mais de 15 segundos, volta às
                  respostas gratuitas e «Experimentar» diz porquê. Nunca usa um plano pago. A mensagem do cliente, as últimas mensagens da conversa e os excertos dos
                  documentos são enviados à Groq, uma empresa dos EUA, para escrever a resposta: serve para testes com as suas próprias mensagens, ainda não para
                  clientes.
                </span>
                {!groqEnabledHere ? (
                  <span className="rounded-lg border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">
                    A IA de teste Groq está desligada neste servidor (falta CHATBOT_GROQ_ENABLED=1): responde sem IA.
                  </span>
                ) : !groqKeyHere ? (
                  <span className="rounded-lg border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">
                    Falta a chave GROQ_API_KEY neste servidor: até ser posta, responde sem IA.
                  </span>
                ) : null}
              </span>
            </label>
          ) : null}
          <label className="flex items-start gap-2">
            <input type="radio" name="answer_provider" value="ollama" defaultChecked={current === "ollama"} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
            <span className="flex flex-col gap-1">
              <span>
                <span className="font-semibold text-text">IA de teste local (Ollama)</span> — só funciona no computador onde corre o assistente.
              </span>
              <span>
                Usa um modelo de IA instalado no próprio computador, só com o conhecimento e os documentos deste assistente; nada sai do computador e não tem custos.
                Se o Ollama não estiver ligado, demorar mais de um minuto ou falhar, volta às respostas gratuitas. Num portátil sem placa gráfica cada resposta pode
                demorar até um minuto.
              </span>
              {ollamaAvailableHere ? null : (
                <span className="rounded-lg border border-gold/40 bg-gold-soft px-3 py-2 text-gold-text">
                  Este servidor (o site online) não tem o Ollama: aqui, também em «Experimentar», responde sem IA. Para experimentar com o Ollama, use o site no
                  computador (npm run dev) ou o programa do assistente nesse computador.
                </span>
              )}
            </span>
          </label>
        </fieldset>
      </fieldset>

      <div>
        <SubmitButton pendingLabel="A guardar…">Guardar definições</SubmitButton>
      </div>
    </ActionForm>
  );
}
