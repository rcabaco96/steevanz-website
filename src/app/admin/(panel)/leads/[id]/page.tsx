import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink, ContactActions, ContactDetails, PipelineEditor, TrackingDetails } from "@/components/admin/RecordDetail";
import { Panel } from "@/components/admin/ui";
import { updateLead } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { getLead } from "@/lib/admin/queries";
import { kindLabels, productLabel } from "@/lib/booking/labels";

export const metadata: Metadata = { title: "Pedido" };

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <>
      <BackLink href="/admin/leads" label="Pedidos" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="eyebrow">{kindLabels[lead.kind]}</p>
          <h1 className="display text-3xl sm:text-4xl">{lead.name}</h1>
          <p className="text-lg text-muted">{productLabel(lead.product_id)}</p>
        </div>
        <ContactActions row={lead} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Panel title="Contacto">
            <ContactDetails row={lead} />
          </Panel>
          <Panel title="Origem">
            <TrackingDetails row={lead} />
          </Panel>
        </div>
        <div className="lg:sticky lg:top-36 lg:self-start">
          <PipelineEditor row={lead} action={updateLead} />
        </div>
      </div>
    </>
  );
}
