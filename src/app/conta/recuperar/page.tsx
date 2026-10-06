import type { Metadata } from "next";
import { AuthCard, AuthField, AuthLink } from "@/components/account/AuthCard";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { requestPasswordReset } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Recuperar palavra-passe" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar palavra-passe"
      description="Indique o email da sua conta. Enviamos um link para definir uma nova palavra-passe."
      footer={
        <>
          Lembrou-se? <AuthLink href="/conta/entrar">Entrar</AuthLink>
        </>
      }
    >
      <ActionForm action={requestPasswordReset} className="flex flex-col gap-4">
        <AuthField label="Email" name="email" type="email" required autoComplete="email" placeholder="nome@empresa.pt" />
        <SubmitButton pendingLabel="A enviar…" className="w-full">
          Enviar link
        </SubmitButton>
      </ActionForm>
    </AuthCard>
  );
}
