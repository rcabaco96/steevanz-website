"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cancelBookingByToken } from "@/lib/modules/bookings/actions";
import { useConfirmedSubmit } from "@/components/ui/ConfirmDialog";
import { brandButton, brandSecondaryButton } from "../BrandFrame";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${brandSecondaryButton} text-danger`}>
      {pending ? "A cancelar…" : "Cancelar reserva"}
    </button>
  );
}

export function CancelBookingForm({ slug, token }: { slug: string; token: string }) {
  const [state, formAction] = useActionState(cancelBookingByToken, null);
  const { onSubmit, dialog } = useConfirmedSubmit("Cancelar esta reserva? O lugar fica livre para outra pessoa.", {
    confirmClassName: `${brandButton} bg-danger! text-white! shadow-none!`,
    cancelClassName: brandSecondaryButton,
  });
  if (state?.ok) {
    return (
      <p role="status" className="text-center text-sm text-success">
        {state.message}
      </p>
    );
  }
  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      className="flex flex-col gap-2"
    >
      {dialog}
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="token" value={token} />
      <Submit />
      {state && !state.ok ? (
        <p role="alert" className="text-center text-sm text-danger">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
