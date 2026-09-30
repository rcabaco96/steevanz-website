"use client";

import { useActionState } from "react";
import { MailIcon } from "@/components/icons";
import { requestMagicLink } from "@/lib/admin/actions";
import { FormMessage, SubmitButton } from "./AdminForm";
import { adminInputClasses, adminLabelClasses } from "./ui";

export function LoginForm() {
  const [state, formAction] = useActionState(requestMagicLink, null);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className={adminLabelClasses}>
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="nome@steevanz.com"
          className={`${adminInputClasses} h-12`}
        />
      </label>
      <SubmitButton pendingLabel="A enviar…" className="w-full">
        <MailIcon size={18} />
        Enviar link de entrada
      </SubmitButton>
      {state ? <FormMessage ok={state.ok} message={state.message} /> : null}
    </form>
  );
}
