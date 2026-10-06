import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthAlert, AuthCard, AuthField, AuthLink } from "@/components/account/AuthCard";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { signUp } from "@/lib/auth/actions";
import { minPasswordLength } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignUpPage() {
  const session = await getSession();
  if (session.state === "admin") redirect("/admin");
  if (session.state === "client") redirect("/conta");

  return (
    <AuthCard
      wide
      title="Criar conta"
      description="Com a sua conta acompanha as encomendas e gere os produtos Steevanz que comprou."
      footer={
        <>
          Já tem conta? <AuthLink href="/conta/entrar">Entrar</AuthLink>
        </>
      }
    >
      {session.state === "unconfigured" ? (
        <AuthAlert>O acesso a contas ainda não está configurado (variáveis do Supabase em falta).</AuthAlert>
      ) : (
        <ActionForm action={signUp} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <AuthField label="Nome" name="full_name" required autoComplete="name" maxLength={120} />
          </div>
          <AuthField label="Negócio (opcional)" name="business_name" autoComplete="organization" maxLength={160} />
          <AuthField label="Telemóvel (opcional)" name="phone" type="tel" autoComplete="tel" maxLength={40} />
          <div className="sm:col-span-2">
            <AuthField label="Email" name="email" type="email" required autoComplete="email" maxLength={200} placeholder="nome@empresa.pt" />
          </div>
          <AuthField
            label="Palavra-passe"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={minPasswordLength}
            maxLength={72}
            hint={`Mínimo ${minPasswordLength} caracteres.`}
          />
          <AuthField label="Confirmar palavra-passe" name="confirm" type="password" required autoComplete="new-password" minLength={minPasswordLength} maxLength={72} />
          <label className="flex items-start gap-2.5 text-sm text-muted sm:col-span-2">
            <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-accent)" />
            <span>
              Li e aceito os{" "}
              <Link href="/termos" className="font-semibold text-text underline underline-offset-4">
                termos
              </Link>{" "}
              e a{" "}
              <Link href="/privacidade" className="font-semibold text-text underline underline-offset-4">
                política de privacidade
              </Link>
              .
            </span>
          </label>
          <SubmitButton pendingLabel="A criar conta…" className="w-full sm:col-span-2">
            Criar conta
          </SubmitButton>
        </ActionForm>
      )}
    </AuthCard>
  );
}
