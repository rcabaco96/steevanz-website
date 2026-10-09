import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, AuthLink } from "@/components/account/AuthCard";
import { AlertIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { authLinkValidity } from "@/lib/auth/link-validity";
import { getSession, safeNextPath } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Link expirado" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function InvalidLinkPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const recovery = first(params.tipo) === "recovery";
  const next = safeNextPath(first(params.next), "");
  const session = await getSession();
  const signedIn = session.state === "client" || session.state === "admin";

  const linkQuery = new URLSearchParams({ modo: "link" });
  if (next) linkQuery.set("next", next);
  const retryHref = recovery ? "/conta/recuperar" : `/conta/entrar?${linkQuery}`;
  const home = next || (session.state === "admin" ? "/admin" : "/conta");

  return (
    <AuthCard
      title="Este link já não serve"
      footer={
        <>
          Tem palavra-passe? <AuthLink href={next ? `/conta/entrar?next=${encodeURIComponent(next)}` : "/conta/entrar"}>Entrar com palavra-passe</AuthLink>
        </>
      }
    >
      <div className="flex flex-col items-start gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
          <AlertIcon size={22} />
        </span>
        <p className="text-muted">
          Os links que enviamos por email são válidos durante {authLinkValidity} e só podem ser usados uma vez. Este já expirou ou já
          foi aberto (às vezes o próprio programa de email abre-o para o verificar).
        </p>
        {signedIn ? (
          <p className="text-sm text-muted">
            Tem sessão iniciada como <strong className="text-text">{session.email}</strong>.
          </p>
        ) : null}
        <div className="flex w-full flex-col gap-3">
          {signedIn && !recovery ? (
            <Link href={home} className={buttonClasses("primary", "md", "w-full")}>
              Continuar
            </Link>
          ) : null}
          <Link href={retryHref} className={buttonClasses(signedIn && !recovery ? "secondary" : "primary", "md", "w-full")}>
            Pedir novo link
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
