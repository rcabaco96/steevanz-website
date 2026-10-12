"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { replyToCall } from "@/lib/modules/waitlist/actions";
import { useConfirmedSubmit } from "@/components/ui/ConfirmDialog";
import { brandButton, brandSecondaryButton } from "../BrandFrame";

function Option({ value, label, danger = false }: { value: string; label: string; danger?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="reply"
      value={value}
      disabled={pending}
      className={`${brandSecondaryButton} ${danger ? "text-danger" : ""}`}
    >
      {label}
    </button>
  );
}

/** "Já não venho": leaves the queue (optional; waiting or being called needs nothing else). */
export function ReplyButtons({ token }: { token: string }) {
  const [state, formAction] = useActionState(replyToCall, null);
  // The only answer left is leaving, which loses the place: ask first.
  const { onSubmit, dialog } = useConfirmedSubmit("Sair da fila? Perde o seu lugar.", {
    confirmClassName: `${brandButton} bg-danger! text-white! shadow-none!`,
    cancelClassName: brandSecondaryButton,
  });
  return (
    <form action={formAction} onSubmit={onSubmit} className="flex flex-col gap-2">
      {dialog}
      <input type="hidden" name="token" value={token} />
      <Option value="leaving" label="Já não venho, sair da fila" danger />
      {state ? (
        <p role={state.ok ? "status" : "alert"} className={`text-center text-sm ${state.ok ? "text-success" : "text-danger"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
