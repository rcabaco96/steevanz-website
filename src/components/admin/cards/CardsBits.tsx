import type { ReactNode } from "react";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState } from "@/components/backoffice/ui";
import { CopyButton } from "@/components/modules/shared/CopyButton";
import { QrCode } from "@/components/modules/shared/QrCode";
import { ArrowUpRight } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";
import { programOrigin } from "@/lib/business-cards/rules";

// Small pieces shared by the admin pages of the business cards and the keychain tags.

type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

/** Shown instead of the list while the database doesn't have this feature's tables. */
export function CardsNotReady({ what }: { what: "cards" | "tags" }) {
  return (
    <EmptyState>
      A base de dados ainda não tem as tabelas dos cartões e tags. Falta aplicar a migração <code className="font-mono text-xs">20261020200000_business_cards_keychains.sql</code>.
      {what === "cards" ? " Até lá, o cartão de exemplo (rogerio-cabaco) continua a abrir a partir do ficheiro do site." : " Até lá, os endereços /k/… dão «página não encontrada»."}
    </EmptyState>
  );
}

/**
 * What goes into the card or tag: the production address (to copy into the programming app), its QR
 * code (PNG 2048 px or SVG, to print) and the links to try it.
 */
export async function ProgramPanel({
  path,
  title,
  hint,
  qrLabel,
  qrOptional = false,
  children,
}: {
  path: string;
  title: string;
  hint: string;
  qrLabel: string;
  qrOptional?: boolean;
  children?: ReactNode;
}) {
  const url = `${programOrigin}${path}`;
  const qr = `/api/admin/qr?caminho=${encodeURIComponent(path)}`;
  const qrBlock = (
    <div className="flex items-center gap-4">
      <QrCode value={url} label={qrLabel} className="h-28 w-28 shrink-0 rounded-xl border border-line bg-white p-1.5" />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">Para imprimir: o PNG tem 2048 px; o SVG fica nítido em qualquer tamanho.</p>
        <div className="flex flex-wrap gap-2">
          <a href={`${qr}&formato=png`} download className={buttonClasses("secondary", "sm")}>
            QR em PNG
          </a>
          <a href={`${qr}&formato=svg`} download className={buttonClasses("secondary", "sm")}>
            QR em SVG
          </a>
        </div>
      </div>
    </div>
  );
  return (
    <section aria-labelledby="program-title" className="card flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 id="program-title" className="text-lg font-semibold tracking-[-0.01em] text-text">
          {title}
        </h2>
        <p className="text-sm text-muted">{hint}</p>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface-2/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <code className="min-w-0 font-mono text-[0.95rem] font-semibold break-all text-text">{url}</code>
        <CopyButton value={url} label="Copiar endereço" />
      </div>
      {qrOptional ? (
        <details className="group rounded-2xl border border-line p-3">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-text">
            Código QR (opcional)
            <span aria-hidden="true" className="transition-transform group-open:rotate-180">
              ⌄
            </span>
          </summary>
          <div className="mt-3">{qrBlock}</div>
        </details>
      ) : (
        qrBlock
      )}
      {children ? <div className="flex flex-wrap gap-2 border-t border-line pt-4">{children}</div> : null}
    </section>
  );
}

/** «Abrir página» and similar: opens in a new tab, on the site the admin is open on. */
export function OpenLink({ href, children, download = false }: { href: string; children: ReactNode; download?: boolean }) {
  return download ? (
    <a href={href} download className={buttonClasses("secondary", "sm")}>
      {children}
    </a>
  ) : (
    <a href={href} target="_blank" rel="noopener" className={buttonClasses("secondary", "sm")}>
      {children} <ArrowUpRight size={15} />
    </a>
  );
}

/** «Apagar» at the end of a card's or tag's page, after a confirmation. */
export function DeleteForm({ action, id, label, message }: { action: FormAction; id: string; label: string; message: string }) {
  return (
    <section className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <p className="text-sm text-muted">{message}</p>
      <ActionForm action={action} confirmMessage={`${message} Quer mesmo apagar?`} className="shrink-0">
        <input type="hidden" name="id" value={id} />
        <SubmitButton variant="ghost" size="sm" pendingLabel="A apagar…" className="text-danger hover:bg-danger-soft">
          {label}
        </SubmitButton>
      </ActionForm>
    </section>
  );
}
