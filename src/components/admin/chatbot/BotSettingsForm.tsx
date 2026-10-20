"use client";

import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { setBotEnabled, updateBot } from "@/lib/chatbot/actions";
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

export function BotSettingsForm({
  bot,
  establishments,
  menus,
  bookingSuggestion,
}: {
  bot: BotRow;
  establishments: { id: string; name: string }[];
  menus: { id: string; name: string }[];
  bookingSuggestion: string | null;
}) {
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
            <option value="open-wa">WhatsApp Web (open-wa, não oficial)</option>
            <option value="cloud-api">API oficial da Meta (ainda não ativa)</option>
          </select>
        </label>
        <label className={adminLabelClasses}>
          Avisar o dono neste WhatsApp quando uma conversa passa para a equipa
          <input name="alert_number" maxLength={40} inputMode="tel" placeholder="Opcional" defaultValue={bot.alert_number ?? ""} className={input} />
        </label>
        <div className="rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
          <p className="font-semibold text-text">Respostas: gratuitas</p>
          <p>Hoje o assistente responde só com a informação do negócio, sem IA paga. Ligar um modelo de IA pago fica para uma fase seguinte, com o seu acordo.</p>
        </div>
      </fieldset>

      <div>
        <SubmitButton pendingLabel="A guardar…">Guardar definições</SubmitButton>
      </div>
    </ActionForm>
  );
}
