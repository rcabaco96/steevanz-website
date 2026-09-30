"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AlertIcon, Check } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { AdminActionState } from "@/lib/admin/actions";

type AdminAction = (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;

interface AdminFormProps {
  action: AdminAction;
  children: ReactNode;
  className?: string;
  confirmMessage?: string;
  hideMessage?: boolean;
}

export function AdminForm({ action, children, className = "", confirmMessage, hideMessage = false }: AdminFormProps) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault();
      }}
      className={className}
    >
      {children}
      {state && !(hideMessage && state.ok) ? <FormMessage ok={state.ok} message={state.message} /> : null}
    </form>
  );
}

export function FormMessage({ ok, message }: { ok: boolean; message: string }) {
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`mt-3 flex items-center gap-1.5 text-sm ${ok ? "text-success" : "text-danger"} basis-full col-span-full`}
    >
      {ok ? <Check size={15} /> : <AlertIcon size={15} />}
      {message}
    </p>
  );
}

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function SubmitButton({ children, pendingLabel, variant = "primary", size = "md", className = "", ariaLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} aria-label={ariaLabel} className={buttonClasses(variant, size, className)}>
      {pending ? (
        <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
