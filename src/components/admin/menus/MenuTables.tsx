import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { EmptyState, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { CopyButton } from "@/components/modules/shared/CopyButton";
import { QrCode } from "@/components/modules/shared/QrCode";
import { buttonClasses } from "@/components/ui/Button";
import { maxTableNameLength, maxTablesAtOnce, tablePath } from "@/lib/video-menus/ordering-rules";
import type { AdminMenuTable } from "@/lib/video-menus/store";
import { addTable, addTablesUpTo, deleteTable, renameTable, rotateTableToken, setMenuOrdering } from "@/lib/video-menus/table-actions";

const summaryClasses = "inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-muted hover:text-text [&::-webkit-details-marker]:hidden";

/**
 * A menu's ordering at the table: the «Pedidos no menu» switch and its tables, each with its link and
 * QR code (to download for the plate), its name, «Gerar novo código» and delete.
 */
export function MenuTables({ menuId, enabled, tables, origin }: { menuId: string; enabled: boolean; tables: AdminMenuTable[]; origin: string }) {
  return (
    <div className="flex flex-col gap-4">
      <ActionForm action={setMenuOrdering} className="flex flex-col gap-3 rounded-2xl border border-line p-3 sm:flex-row sm:items-center sm:p-4">
        <input type="hidden" name="id" value={menuId} />
        <input type="hidden" name="enabled" value={enabled ? "off" : "on"} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-text">
            Pedidos no menu
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${enabled ? "border-success/30 bg-success-soft text-success" : "border-line bg-surface-2 text-subtle"}`}
            >
              {enabled ? "Ligados" : "Desligados"}
            </span>
          </p>
          <p className="text-sm text-muted">
            {enabled
              ? "Quem abre o link de uma mesa pode juntar pratos e fazer o pedido; o funcionário confirma com o QR do pedido."
              : "Os links das mesas mostram só o menu. Ligue para aceitar pedidos à mesa."}
          </p>
        </div>
        <SubmitButton variant={enabled ? "secondary" : "primary"} size="sm" pendingLabel="A guardar…">
          {enabled ? "Desligar pedidos" : "Ligar pedidos"}
        </SubmitButton>
      </ActionForm>

      <div className="grid gap-3 sm:grid-cols-2">
        <ActionForm action={addTable} className="flex flex-col gap-2 rounded-2xl border border-line p-3 sm:p-4">
          <input type="hidden" name="menu_id" value={menuId} />
          <label className={adminLabelClasses}>
            Nova mesa
            <input name="name" required maxLength={maxTableNameLength} autoComplete="off" placeholder="Esplanada 1" className={`${adminInputClasses} h-11`} />
          </label>
          <SubmitButton size="sm" pendingLabel="A criar…" className="self-start">
            Adicionar mesa
          </SubmitButton>
        </ActionForm>
        <ActionForm action={addTablesUpTo} className="flex flex-col gap-2 rounded-2xl border border-line p-3 sm:p-4">
          <input type="hidden" name="menu_id" value={menuId} />
          <label className={adminLabelClasses}>
            Criar mesas 1 a…
            <input name="count" type="number" inputMode="numeric" required min={1} max={maxTablesAtOnce} defaultValue={10} className={`${adminInputClasses} h-11`} />
          </label>
          <SubmitButton variant="secondary" size="sm" pendingLabel="A criar…" className="self-start">
            Criar mesas
          </SubmitButton>
        </ActionForm>
      </div>

      {tables.length ? (
        <ol className="flex flex-col gap-3">
          {tables.map((table) => {
            const url = `${origin}${tablePath(table.token)}`;
            const qr = `/api/admin/mesas/${table.id}/qr`;
            return (
              <li key={table.id} className="flex flex-col gap-3 rounded-2xl border border-line p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <QrCode value={url} label={`Código QR da ${table.name}`} className="h-20 w-20 shrink-0 rounded-lg border border-line bg-white p-1" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text">{table.name}</p>
                    <a href={url} target="_blank" rel="noopener" className="block truncate text-sm text-accent-text hover:underline">
                      {url}
                    </a>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <CopyButton value={url} />
                      <a href={`${qr}?formato=png`} download className={buttonClasses("secondary", "sm")}>
                        QR PNG
                      </a>
                      <a href={`${qr}?formato=svg`} download className={buttonClasses("secondary", "sm")}>
                        QR SVG
                      </a>
                    </div>
                  </div>
                </div>
                <details className="group">
                  <summary className={summaryClasses}>
                    Nome, novo código ou apagar
                    <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-surface-2/50 p-3 sm:p-4">
                    <ActionForm action={renameTable} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
                      <input type="hidden" name="id" value={table.id} />
                      <label className={`${adminLabelClasses} min-w-0 sm:flex-1`}>
                        Nome
                        <input name="name" required maxLength={maxTableNameLength} autoComplete="off" defaultValue={table.name} className={`${adminInputClasses} h-10`} />
                      </label>
                      <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…">
                        Guardar nome
                      </SubmitButton>
                    </ActionForm>
                    <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                      <ActionForm action={rotateTableToken} confirmMessage={`Gerar um novo código para «${table.name}»? O link e o QR atuais deixam de funcionar: terá de imprimir o novo.`}>
                        <input type="hidden" name="id" value={table.id} />
                        <SubmitButton variant="secondary" size="sm" pendingLabel="A gerar…">
                          Gerar novo código
                        </SubmitButton>
                      </ActionForm>
                      <ActionForm action={deleteTable} confirmMessage={`Apagar «${table.name}»? O link da mesa deixa de abrir. Os pedidos já feitos ficam guardados.`}>
                        <input type="hidden" name="id" value={table.id} />
                        <SubmitButton variant="ghost" size="sm" className="text-danger" pendingLabel="A apagar…">
                          Apagar mesa
                        </SubmitButton>
                      </ActionForm>
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState>Ainda não há mesas. Crie-as acima: cada mesa tem o seu link e o seu QR para a placa.</EmptyState>
      )}
    </div>
  );
}
