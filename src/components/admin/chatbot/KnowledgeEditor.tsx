"use client";

import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses, EmptyState } from "@/components/backoffice/ui";
import { deleteEntry, saveEntry } from "@/lib/chatbot/actions";
import type { KnowledgeRow } from "@/lib/chatbot/rows";
import { chatbotLanguages } from "@/lib/chatbot/types";
import { languageLabels } from "./ChatbotBits";

const input = `${adminInputClasses} h-11`;

const kindLabels: Record<KnowledgeRow["kind"], string> = { faq: "Pergunta frequente", policy: "Política", info: "Informação" };

function EntryFields({ botId, entry, properties }: { botId: string; entry?: KnowledgeRow; properties: string[] }) {
  return (
    <>
      <input type="hidden" name="bot_id" value={botId} />
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className={adminLabelClasses}>
          Tipo
          <select name="kind" defaultValue={entry?.kind ?? "faq"} className={input}>
            {Object.entries(kindLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabelClasses}>
          Escrita em
          <select name="language" defaultValue={entry?.language ?? ""} className={input}>
            <option value="">Língua principal</option>
            {chatbotLanguages.map((language) => (
              <option key={language} value={language}>
                {languageLabels[language]}
              </option>
            ))}
          </select>
        </label>
        {properties.length ? (
          <label className={adminLabelClasses}>
            <input type="hidden" name="active" value={entry && !entry.active ? "0" : "1"} />
            Alojamento
            <select name="property" defaultValue={entry?.property ?? ""} className={input}>
              <option value="">Todos</option>
              {properties.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className={adminLabelClasses}>
            Estado
            <select name="active" defaultValue={entry && !entry.active ? "0" : "1"} className={input}>
              <option value="1">Em uso</option>
              <option value="0">Parada</option>
            </select>
          </label>
        )}
      </div>
      <label className={adminLabelClasses}>
        Pergunta ou tema
        <input name="question" required maxLength={300} defaultValue={entry?.question ?? ""} placeholder="Têm estacionamento?" className={input} />
      </label>
      <label className={adminLabelClasses}>
        Resposta
        <textarea name="answer" required maxLength={2000} rows={3} defaultValue={entry?.answer ?? ""} className={`${adminInputClasses} py-2`} />
      </label>
      <label className={adminLabelClasses}>
        Outras palavras que os clientes usam <span className="font-normal text-subtle">(separadas por vírgulas)</span>
        <input name="keywords" maxLength={300} defaultValue={entry?.keywords ?? ""} placeholder="carro, parque, garagem" className={input} />
      </label>
    </>
  );
}

/**
 * The business's own answers: frequent questions, policies and information. One rule: when
 * something changes, edit the entry instead of adding a second one (two prices = wrong answers).
 * Never write door, keybox or alarm codes here (lodging): the assistant would block them anyway.
 */
export function KnowledgeEditor({ botId, entries, properties }: { botId: string; entries: KnowledgeRow[]; properties: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {entries.length ? (
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-line">
              <details>
                <summary className="flex cursor-pointer list-none flex-col gap-0.5 px-4 py-3">
                  <span className="text-sm font-semibold text-text">
                    {entry.question}
                    {!entry.active ? <span className="ml-2 text-xs font-normal text-subtle">(parada)</span> : null}
                  </span>
                  <span className="line-clamp-2 text-sm text-muted">{entry.answer}</span>
                  <span className="text-xs text-subtle">
                    {kindLabels[entry.kind]}
                    {entry.language ? ` · ${languageLabels[entry.language as keyof typeof languageLabels] ?? entry.language}` : ""}
                    {entry.property ? ` · ${entry.property}` : ""}
                  </span>
                </summary>
                <div className="flex flex-col gap-4 border-t border-line px-4 py-4">
                  <ActionForm action={saveEntry} resetKey={entry.updated_at} className="flex flex-col gap-4">
                    <EntryFields botId={botId} entry={entry} properties={properties} />
                    <div>
                      <SubmitButton size="sm" pendingLabel="A guardar…">
                        Guardar
                      </SubmitButton>
                    </div>
                  </ActionForm>
                  <ActionForm action={deleteEntry} confirmMessage="Apagar esta resposta? O assistente deixa de a usar.">
                    <input type="hidden" name="bot_id" value={botId} />
                    <input type="hidden" name="id" value={entry.id} />
                    <SubmitButton variant="ghost" size="sm" pendingLabel="A apagar…">
                      Apagar resposta
                    </SubmitButton>
                  </ActionForm>
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>Ainda não há respostas. Comece pelas perguntas que a equipa mais recebe.</EmptyState>
      )}
      <details className="rounded-2xl border border-dashed border-line-strong">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent-text">+ Acrescentar resposta</summary>
        <div className="border-t border-line px-4 py-4">
          <ActionForm action={saveEntry} className="flex flex-col gap-4">
            <EntryFields botId={botId} properties={properties} />
            <div>
              <SubmitButton size="sm" pendingLabel="A guardar…">
                Acrescentar
              </SubmitButton>
            </div>
          </ActionForm>
        </div>
      </details>
    </div>
  );
}
