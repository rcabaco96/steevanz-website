"use client";

import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { createBot } from "@/lib/chatbot/actions";
import { chatbotBusinessKinds } from "@/lib/chatbot/types";
import { kindLabels } from "./ChatbotBits";

const input = `${adminInputClasses} h-11`;

/** A new assistant: whose it is, the business's name and kind. The rest is set on its page. */
export function NewBotForm({ clients }: { clients: { id: string; label: string }[] }) {
  return (
    <ActionForm action={createBot} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <label className={adminLabelClasses}>
        Cliente
        <select name="owner_id" required defaultValue="" className={input}>
          <option value="" disabled>
            Escolha o cliente
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.label}
            </option>
          ))}
        </select>
      </label>
      <label className={adminLabelClasses}>
        Nome do negócio
        <input name="name" required maxLength={120} autoComplete="off" placeholder="Tasca do Largo" className={input} />
      </label>
      <label className={adminLabelClasses}>
        Tipo de negócio
        <select name="kind" defaultValue="restaurant" className={input}>
          {chatbotBusinessKinds.map((kind) => (
            <option key={kind} value={kind}>
              {kindLabels[kind]}
            </option>
          ))}
        </select>
      </label>
      <div className="sm:col-span-3">
        <SubmitButton pendingLabel="A criar…">Criar assistente</SubmitButton>
      </div>
    </ActionForm>
  );
}
