"use client";

import { useState } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses, EmptyState } from "@/components/backoffice/ui";
import { addDocument, deleteDocument } from "@/lib/chatbot/actions";
import type { DocumentRow } from "@/lib/chatbot/rows";
import { chatbotLanguages } from "@/lib/chatbot/types";
import { languageLabels } from "./ChatbotBits";

const input = `${adminInputClasses} h-11`;

const kindLabels: Record<DocumentRow["kind"], string> = { pdf: "PDF", docx: "Word", text: "Texto", markdown: "Markdown", html: "Página web" };
const sources = [
  ["upload", "Ficheiro"],
  ["text", "Colar texto"],
  ["url", "Endereço web"],
] as const;

const date = new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "2-digit", month: "2-digit", year: "numeric" });

/**
 * The business's documents (house guide, menu, price list, policies…): the assistant searches their
 * sections and quotes the best one. Free: text extracted on the server, no AI service involved.
 */
export function DocumentsEditor({
  botId,
  documents,
  properties,
  outdated = [],
}: {
  botId: string;
  documents: DocumentRow[];
  properties: string[];
  /** Documents stored by the older cutter (documents.ts → cutByOldVersion): a hint to send them again. */
  outdated?: string[];
}) {
  const [source, setSource] = useState<(typeof sources)[number][0]>("upload");
  return (
    <div className="flex flex-col gap-4">
      {documents.length ? (
        <ul className="flex flex-col gap-2">
          {documents.map((document) => (
            <li key={document.id} className="flex flex-col gap-2 rounded-2xl border border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-text">{document.title}</span>
                <span className="text-xs text-subtle">
                  {kindLabels[document.kind]} · {document.chunk_count} {document.chunk_count === 1 ? "secção" : "secções"} · {date.format(new Date(document.created_at))}
                  {document.property ? ` · ${document.property}` : ""}
                  {document.language ? ` · ${languageLabels[document.language as keyof typeof languageLabels] ?? document.language}` : ""}
                </span>
                {outdated.includes(document.id) ? (
                  <span className="mt-1 text-xs text-gold-text">Lido por uma versão antiga. Para melhores resultados, volte a enviar o documento (e apague este).</span>
                ) : null}
              </span>
              <ActionForm action={deleteDocument} confirmMessage={`Apagar «${document.title}»? O assistente deixa de o usar.`}>
                <input type="hidden" name="bot_id" value={botId} />
                <input type="hidden" name="id" value={document.id} />
                <SubmitButton variant="ghost" size="sm" pendingLabel="A apagar…">
                  Apagar
                </SubmitButton>
              </ActionForm>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>Ainda não há documentos. Envie o guia da casa, o menu, o preçário ou as políticas do negócio.</EmptyState>
      )}

      <ActionForm action={addDocument} className="flex flex-col gap-4 rounded-2xl border border-dashed border-line-strong p-4">
        <input type="hidden" name="bot_id" value={botId} />
        <input type="hidden" name="source" value={source} />
        <div role="radiogroup" aria-label="De onde vem o documento" className="flex flex-wrap gap-2">
          {sources.map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={source === value}
              onClick={() => setSource(value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${source === value ? "border-transparent bg-surface-inverse text-inverse" : "border-line text-muted hover:text-text"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {source === "upload" ? (
          <label className={adminLabelClasses}>
            PDF, Word (.docx), texto (.txt) ou Markdown (.md), até 2,5 MB
            <input name="file" type="file" required accept=".pdf,.docx,.txt,.md,.markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" className={`${adminInputClasses} py-2`} />
          </label>
        ) : source === "text" ? (
          <label className={adminLabelClasses}>
            Texto <span className="font-normal text-subtle">(linhas começadas por «#» viram títulos de secção)</span>
            <textarea name="text" required rows={6} className={`${adminInputClasses} py-2`} />
          </label>
        ) : (
          <label className={adminLabelClasses}>
            Endereço da página (pública)
            <input name="url" type="url" required placeholder="https://…" className={input} />
          </label>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className={adminLabelClasses}>
            Título <span className="font-normal text-subtle">(opcional)</span>
            <input name="title" maxLength={200} placeholder="Guia da casa" className={input} />
          </label>
          <label className={adminLabelClasses}>
            Escrito em
            <select name="language" defaultValue="" className={input}>
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
              Alojamento
              <select name="property" defaultValue="" className={input}>
                <option value="">Todos</option>
                {properties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <p className="text-xs text-subtle">
          Nunca envie documentos com códigos da porta, da caixa das chaves ou do alarme: o assistente bloqueia-os, mas o melhor é não estarem lá. PDFs digitalizados (imagens) não têm texto.
        </p>
        <div>
          <SubmitButton size="sm" pendingLabel="A ler o documento…">
            Acrescentar documento
          </SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
