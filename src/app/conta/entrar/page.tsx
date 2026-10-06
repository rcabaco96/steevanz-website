import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthAlert, AuthCard, AuthField, AuthLink } from "@/components/account/AuthCard";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { requestSignInLink, signIn } from "@/lib/auth/actions";
import { getSession, safeNextPath } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Entrar" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNextPath(first(params.next), "");
  const session = await getSession();
  if (session.state === "admin" || session.state === "client") {
    redirect(next || (session.state === "admin" ? "/admin" : "/conta"));
  }
  const byLink = first(params.modo) === "link";
  const modeHref = (link: boolean) => {
    const query = new URLSearchParams();
    if (link) query.set("modo", "link");
    if (next) query.set("next", next);
    const search = query.toString();
    return search ? `/conta/entrar?${search}` : "/conta/entrar";
  };

  return (
    <AuthCard
      title="Entrar"
      description="Aceda à sua área de cliente para gerir os produtos Steevanz."
      footer={
        <>
          Ainda não tem conta? <AuthLink href="/conta/registar">Criar conta</AuthLink>
        </>
      }
    >
      {first(params.erro) ? <AuthAlert>O link é inválido ou expirou. Entre com a sua palavra-passe ou peça um novo link.</AuthAlert> : null}
      {session.state === "unconfigured" ? (
        <AuthAlert>O acesso a contas ainda não está configurado (variáveis do Supabase em falta).</AuthAlert>
      ) : byLink ? (
        <>
          <ActionForm action={requestSignInLink} className="flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />
            <AuthField label="Email" name="email" type="email" required autoComplete="email" placeholder="nome@empresa.pt" />
            <p className="-mt-1 text-sm text-muted">Enviamos um link para entrar sem palavra-passe. Só funciona para contas já criadas.</p>
            <SubmitButton pendingLabel="A enviar…" className="w-full">
              Enviar link de entrada
            </SubmitButton>
          </ActionForm>
          <p className="text-center text-sm">
            <AuthLink href={modeHref(false)}>Entrar com palavra-passe</AuthLink>
          </p>
        </>
      ) : (
        <>
          <ActionForm action={signIn} className="flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />
            <AuthField label="Email" name="email" type="email" required autoComplete="email" placeholder="nome@empresa.pt" />
            <AuthField label="Palavra-passe" name="password" type="password" required autoComplete="current-password" />
            <div className="-mt-1 text-right text-sm">
              <AuthLink href="/conta/recuperar">Esqueceu-se da palavra-passe?</AuthLink>
            </div>
            <SubmitButton pendingLabel="A entrar…" className="w-full">
              Entrar
            </SubmitButton>
          </ActionForm>
          <p className="text-center text-sm">
            <AuthLink href={modeHref(true)}>Receber link de entrada por email</AuthLink>
          </p>
        </>
      )}
    </AuthCard>
  );
}
