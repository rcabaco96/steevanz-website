"use client";

import { useActionState, useEffect, useMemo, useRef, type FormEvent } from "react";
import { FormAlert, Honeypot, TextAreaField, TextField } from "@/components/booking/fields";
import { AlertIcon } from "@/components/icons";
import { phoneDisplay, type AcceptanceState } from "@/lib/proposals/accept";
import { acceptProposal } from "@/lib/proposals/actions";
import { site } from "@/lib/site";
import { PlanField } from "./PlanChoice";
import { ThankYou } from "./ThankYou";

interface Props {
  proposalId: string;
  clientName: string;
  number: string;
  nextSteps: string[];
  expired: boolean;
  validUntil: string;
}

const initialState: AcceptanceState = { status: "idle" };

const phoneLink = (
  <a href={site.phoneHref} className="font-semibold whitespace-nowrap underline underline-offset-3">
    {phoneDisplay}
  </a>
);

function ExpiredNotice({ validUntil }: { validUntil: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 px-4 py-4 text-sm leading-relaxed text-muted">
      <p className="font-semibold text-text">Esta proposta esteve válida até {validUntil}.</p>
      <p className="mt-1">Fale connosco para a atualizarmos: ligue {phoneLink} ou responda ao email da proposta.</p>
    </div>
  );
}

export function AcceptanceForm({ proposalId, clientName, number, nextSteps, expired, validUntil }: Props) {
  const [state, formAction, pending] = useActionState(
    useMemo(() => acceptProposal.bind(null, proposalId), [proposalId]),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : null;
  const attempt = state.status === "error" ? state.attempt : 0;

  // After a failed submit, take the client to the first field to fix; after success, to the thank-you.
  useEffect(() => {
    if (state.status === "success") {
      thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      thanksRef.current?.focus({ preventScroll: true });
    } else if (state.status === "error") {
      const invalid = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      (invalid ?? formRef.current?.querySelector<HTMLElement>("[role='alert']"))?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={thanksRef} tabIndex={-1} className="scroll-mt-4 outline-none">
        <ThankYou clientName={clientName} number={number} nextSteps={nextSteps} />
      </div>
    );
  }

  if (expired || (state.status === "error" && state.code === "expired")) {
    return (
      <>
        <h2 className="display text-[1.45rem] text-text">Adjudicar a proposta</h2>
        <div className="mt-4">
          <ExpiredNotice validUntil={validUntil} />
        </div>
      </>
    );
  }

  const blockWhilePending = (event: FormEvent<HTMLFormElement>) => {
    if (pending) event.preventDefault();
  };

  const fieldErrorCount = Object.keys(errors).length;

  return (
    <>
      <p className="eyebrow mb-1.5">Último passo</p>
      <h2 className="display text-[1.45rem] text-text">Adjudicar a proposta</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Os dados para a faturação. Assim que adjudicar, recebemos tudo e entramos em contacto para começar.</p>

      {/* The key re-creates the fields with the values sent back after a failed submit. */}
      <form key={attempt} ref={formRef} action={formAction} onSubmit={blockWhilePending} noValidate className="relative mt-6 flex flex-col gap-5" aria-busy={pending}>
        {state.status === "error" && state.code === "send_failed" ? (
          <div tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm leading-relaxed text-danger outline-none">
            <AlertIcon size={18} className="mt-0.5 shrink-0" />
            <p>
              Pedimos desculpa: não conseguimos registar a adjudicação agora. Tente de novo dentro de momentos ou ligue-nos para o {phoneLink}, que tratamos de tudo
              consigo.
            </p>
          </div>
        ) : null}
        {state.status === "error" && state.code === "validation" && fieldErrorCount ? (
          <FormAlert>{fieldErrorCount === 1 ? "Há um campo a corrigir." : `Há ${fieldErrorCount} campos a corrigir.`} Veja as indicações a vermelho.</FormAlert>
        ) : null}

        <PlanField error={errors.plan} />

        <TextField name="company" label="Nome da empresa / razão social" required autoComplete="organization" maxLength={160} defaultValue={values?.company} error={errors.company} />
        <TextField
          name="nif"
          label="NIF"
          required
          autoComplete="off"
          maxLength={20}
          placeholder="500 000 000"
          defaultValue={values?.nif}
          error={errors.nif}
        />
        <TextField name="address" label="Morada" required autoComplete="street-address" maxLength={200} defaultValue={values?.address} error={errors.address} />
        <div className="grid gap-5 sm:grid-cols-[11rem_1fr]">
          <TextField
            name="postalCode"
            label="Código postal"
            required
            autoComplete="postal-code"
            inputMode="text"
            maxLength={12}
            placeholder="0000-000"
            defaultValue={values?.postalCode}
            error={errors.postalCode}
          />
          <TextField name="city" label="Localidade" required autoComplete="address-level2" maxLength={80} defaultValue={values?.city} error={errors.city} />
        </div>
        <TextField name="contact" label="Pessoa de contacto" required autoComplete="name" maxLength={120} defaultValue={values?.contact} error={errors.contact} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            name="email"
            label="Email (para as faturas)"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            defaultValue={values?.email}
            error={errors.email}
          />
          <TextField name="phone" label="Telefone" type="tel" required autoComplete="tel" inputMode="tel" maxLength={30} defaultValue={values?.phone} error={errors.phone} />
        </div>
        <TextAreaField name="notes" label="Observações" optionalLabel="Opcional" rows={3} defaultValue={values?.notes} error={errors.notes} />

        <Honeypot label="Não preencha este campo" />

        <div className="-mt-1 flex flex-col gap-2">
          <label
            htmlFor="field-accept"
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-[0.95rem] leading-relaxed text-text transition-colors hover:border-line-strong has-[:checked]:border-accent/50 has-[:checked]:bg-accent-soft/50"
          >
            <input
              id="field-accept"
              name="accept"
              type="checkbox"
              required
              defaultChecked={Boolean(values) && !errors.accept}
              aria-invalid={errors.accept ? true : undefined}
              aria-describedby={errors.accept ? "field-accept-error" : undefined}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md accent-accent"
            />
            <span className="font-medium">Li e aceito a proposta e as condições</span>
          </label>
          {errors.accept ? (
            <p id="field-accept-error" className="flex items-center gap-1.5 text-sm text-danger" role="alert">
              <AlertIcon size={15} className="shrink-0" />
              {errors.accept}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-2xl bg-accent px-6 text-base font-semibold text-accent-contrast shadow-[0_14px_30px_-16px_var(--accent)] transition-[background-color,transform] hover:bg-accent-hover active:scale-[0.98] disabled:cursor-progress disabled:opacity-75"
        >
          {pending ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              A adjudicar…
            </>
          ) : (
            "Adjudicar proposta"
          )}
        </button>
        <p role="status" className="sr-only">
          {pending ? "A enviar a adjudicação…" : ""}
        </p>
        <p className="text-center text-xs leading-relaxed text-subtle">Recebemos os seus dados apenas para faturar e falar consigo sobre este projeto.</p>
      </form>
    </>
  );
}
