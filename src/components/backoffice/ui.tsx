import type { ReactNode } from "react";
import { statusLabels } from "@/lib/booking/labels";
import type { PipelineStatus } from "@/lib/booking/types";

const statusTone: Record<PipelineStatus, string> = {
  new: "bg-accent-soft text-accent-text border-accent/30",
  contacted: "bg-gold-soft text-gold-text border-gold/40",
  scheduled: "bg-surface text-text border-line-strong",
  closed: "bg-success-soft text-success border-success/30",
  lost: "bg-danger-soft text-danger border-danger/30",
  cancelled: "bg-surface-2 text-subtle border-line line-through decoration-1",
};

export function StatusBadge({ status }: { status: PipelineStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${statusTone[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="display text-3xl sm:text-4xl">{title}</h1>
        {description ? <p className="text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({ title, children, className = "", actions }: { title?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      {title || actions ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-lg font-semibold tracking-[-0.01em] text-text">{title}</h2> : <span />}
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-line-strong px-4 py-8 text-center text-sm text-muted">{children}</p>;
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-subtle">{label}</dt>
      <dd className="min-w-0 break-words whitespace-pre-wrap text-text">{children}</dd>
    </div>
  );
}

export const adminInputClasses =
  "block w-full rounded-xl border border-line bg-surface px-3 text-base text-text transition-[border-color,box-shadow] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

export const adminLabelClasses = "flex flex-col gap-1.5 text-sm font-medium text-muted";
