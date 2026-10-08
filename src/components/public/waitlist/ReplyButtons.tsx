"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { replyToCall } from "@/lib/modules/waitlist/actions";
import { brandSecondaryButton } from "../BrandFrame";

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
  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "leaving" && !window.confirm("Sair da fila? Perde o seu lugar.")) event.preventDefault();
      }}
      className="flex flex-col gap-2"
    >
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
