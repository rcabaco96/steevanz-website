"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { replyToCall } from "@/lib/modules/waitlist/actions";
import { brandButton, brandSecondaryButton } from "../BrandFrame";

function Option({ value, label, primary = false, danger = false }: { value: string; label: string; primary?: boolean; danger?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="reply"
      value={value}
      disabled={pending}
      className={primary ? brandButton : `${brandSecondaryButton} ${danger ? "text-danger" : ""}`}
    >
      {label}
    </button>
  );
}

/** "A caminho" / "Vou atrasar-me" / "Já não venho" (called), or just "Sair da fila" (waiting). */
export function ReplyButtons({ token, called, current }: { token: string; called: boolean; current: string | null }) {
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
      {called ? (
        <>
          <Option value="on_way" label={current === "on_way" ? "✓ A caminho" : "Estou a caminho"} primary />
          <Option value="late" label={current === "late" ? "✓ Vou atrasar-me" : "Vou atrasar-me uns minutos"} />
        </>
      ) : null}
      <Option value="leaving" label="Já não venho — sair da fila" danger />
      {state ? (
        <p role={state.ok ? "status" : "alert"} className={`text-center text-sm ${state.ok ? "text-success" : "text-danger"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
