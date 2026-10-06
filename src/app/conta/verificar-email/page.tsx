import type { Metadata } from "next";
import { AuthCard, AuthLink } from "@/components/account/AuthCard";
import { MailIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Confirme o seu email" };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { email } = await searchParams;
  const address = typeof email === "string" ? email.slice(0, 200) : "";

  return (
    <AuthCard
      title="Confirme o seu email"
      footer={
        <>
          Já confirmou? <AuthLink href="/conta/entrar">Entrar</AuthLink>
        </>
      }
    >
      <div className="flex flex-col items-start gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent-text">
          <MailIcon size={22} />
        </span>
        <p className="text-muted">
          Enviámos um link de confirmação para {address ? <strong className="text-text">{address}</strong> : "o seu email"}. Abra-o para
          ativar a conta.
        </p>
        <p className="text-sm text-subtle">Não chegou? Verifique a pasta de spam ou aguarde alguns minutos.</p>
      </div>
    </AuthCard>
  );
}
