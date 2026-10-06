import { AuthField } from "@/components/account/AuthCard";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { updatePassword } from "@/lib/auth/actions";
import { minPasswordLength } from "@/lib/auth/password";

export function PasswordForm() {
  return (
    <ActionForm action={updatePassword} className="flex flex-col gap-4">
      <AuthField
        label="Nova palavra-passe"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        minLength={minPasswordLength}
        maxLength={72}
        hint={`Mínimo ${minPasswordLength} caracteres.`}
      />
      <AuthField label="Confirmar palavra-passe" name="confirm" type="password" required autoComplete="new-password" minLength={minPasswordLength} maxLength={72} />
      <SubmitButton pendingLabel="A guardar…" className="self-start">
        Guardar palavra-passe
      </SubmitButton>
    </ActionForm>
  );
}
