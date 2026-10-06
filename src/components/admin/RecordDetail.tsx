import Link from "next/link";
import { ArrowLeft, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";
import { lisbonTimestamp } from "@/lib/admin/csv";
import { productLabel, sectorLabel, statusLabels } from "@/lib/booking/labels";
import { pipelineStatuses, type BookingRow, type LeadRow } from "@/lib/booking/types";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses, DetailRow, Panel, StatusBadge } from "@/components/backoffice/ui";

type Row = BookingRow | LeadRow;

function whatsappLink(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9) digits = `351${digits}`;
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-muted transition-colors hover:text-text">
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}

export function ContactActions({ row }: { row: Pick<Row, "email" | "phone"> }) {
  const whatsapp = row.phone ? whatsappLink(row.phone) : null;
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`mailto:${row.email}`} className={buttonClasses("primary", "sm")}>
        <MailIcon size={16} />
        Email
      </a>
      {row.phone ? (
        <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`} className={buttonClasses("secondary", "sm")}>
          <PhoneIcon size={16} />
          Ligar
        </a>
      ) : null}
      {whatsapp ? (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "sm")}>
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}

export function ContactDetails({ row }: { row: Row }) {
  return (
    <dl>
      <DetailRow label="Nome">{row.name}</DetailRow>
      <DetailRow label="Email">{row.email}</DetailRow>
      <DetailRow label="Telemóvel">{row.phone}</DetailRow>
      <DetailRow label="Negócio">{row.business_name}</DetailRow>
      <DetailRow label="Setor">{sectorLabel(row.sector)}</DetailRow>
      <DetailRow label="Produto">{productLabel(row.product_id)}</DetailRow>
      <DetailRow label="Mensagem">{row.message}</DetailRow>
    </dl>
  );
}

export function TrackingDetails({ row }: { row: Row }) {
  return (
    <dl>
      <DetailRow label="Idioma">{row.locale.toUpperCase()}</DetailRow>
      <DetailRow label="Recebido">{lisbonTimestamp(row.created_at)}</DetailRow>
      <DetailRow label="Atualizado">{lisbonTimestamp(row.updated_at)}</DetailRow>
      <DetailRow label="Consentimento">{lisbonTimestamp(row.consent_at)}</DetailRow>
      <DetailRow label="utm_source">{row.utm_source}</DetailRow>
      <DetailRow label="utm_medium">{row.utm_medium}</DetailRow>
      <DetailRow label="utm_campaign">{row.utm_campaign}</DetailRow>
      <DetailRow label="utm_term">{row.utm_term}</DetailRow>
      <DetailRow label="utm_content">{row.utm_content}</DetailRow>
      <DetailRow label="Referrer">{row.referrer}</DetailRow>
    </dl>
  );
}

interface PipelineEditorProps {
  row: Row;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  cancelledHint?: string;
}

export function PipelineEditor({ row, action, cancelledHint }: PipelineEditorProps) {
  return (
    <Panel title="Acompanhamento" actions={<StatusBadge status={row.status} />}>
      <ActionForm action={action} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={row.id} />
        <label className={adminLabelClasses}>
          Estado
          <select name="status" defaultValue={row.status} className={`${adminInputClasses} h-11`}>
            {pipelineStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        {cancelledHint ? <p className="-mt-2 text-xs text-subtle">{cancelledHint}</p> : null}
        <label className={adminLabelClasses}>
          Notas internas
          <textarea
            name="admin_notes"
            rows={6}
            maxLength={5000}
            defaultValue={row.admin_notes ?? ""}
            placeholder="Resumo da conversa, próximos passos…"
            className={`${adminInputClasses} resize-y py-2.5 leading-relaxed`}
          />
        </label>
        <SubmitButton pendingLabel="A guardar…" className="self-start">
          Guardar
        </SubmitButton>
      </ActionForm>
    </Panel>
  );
}
