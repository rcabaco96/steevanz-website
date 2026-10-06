import type { Metadata } from "next";
import { AuthAlert, AuthCard, AuthLink } from "@/components/account/AuthCard";
import { PasswordForm } from "@/components/account/PasswordForm";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Nova palavra-passe" };

export default async function NewPasswordPage() {
  const session = await getSession();
  const signedIn = session.state === "client" || session.state === "admin";

  return (
    <AuthCard
      title="Nova palavra-passe"
      description={signedIn ? <>A definir a palavra-passe de <strong className="text-text">{session.email}</strong>.</> : undefined}
      footer={
        signedIn ? (
          <AuthLink href={session.state === "admin" ? "/admin" : "/conta"}>Continuar para a conta</AuthLink>
        ) : (
          <AuthLink href="/conta/entrar">Voltar a entrar</AuthLink>
        )
      }
    >
      {signedIn ? (
        <PasswordForm />
      ) : (
        <AuthAlert>
          O link expirou ou já foi usado. <AuthLink href="/conta/recuperar">Peça um novo link</AuthLink>.
        </AuthAlert>
      )}
    </AuthCard>
  );
}
