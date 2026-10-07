"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cancelBookingByToken } from "@/lib/modules/bookings/actions";
import { brandSecondaryButton } from "../BrandFrame";

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
      onSubmit={(event) => {
        if (!window.confirm("Cancelar esta reserva?")) event.preventDefault();
      }}
      className="flex flex-col gap-2"
    >
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
