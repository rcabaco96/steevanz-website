import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import type { ActionState } from "@/lib/action-state";

// The state badge and the on/off button of the business cards and tags lists (used by client lists too).

type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function ActiveBadge({ active, feminine = false }: { active: boolean; feminine?: boolean }) {
  const [label, tone] = active ? [feminine ? "Ativa" : "Ativo", "bg-success-soft text-success border-success/30"] : [feminine ? "Inativa" : "Inativo", "bg-surface-2 text-subtle border-line"];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tone}`}>{label}</span>;
}

/** Switches a card or tag on or off from the list (a small form: works without JavaScript too). */
export function ActiveToggle({ action, id, active, name }: { action: FormAction; id: string; active: boolean; name: string }) {
  return (
    <ActionForm action={action} hideMessage className="contents">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={active ? "false" : "true"} />
      <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…" ariaLabel={`${active ? "Desativar" : "Ativar"} ${name}`}>
        {active ? "Desativar" : "Ativar"}
      </SubmitButton>
    </ActionForm>
  );
}
