import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { AlertIcon } from "@/components/icons";
import { Logo } from "@/components/site/Logo";
import { getAdminContext } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const context = await getAdminContext();
  if (context.state === "admin") redirect("/admin");
  const { erro } = await searchParams;

  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div aria-hidden="true" className="glow-backdrop absolute inset-0 -z-10" />
      <div className="card flex w-full max-w-sm flex-col gap-6 p-6 sm:p-8">
        <Logo href="/" label="Steevanz" />
        <div className="flex flex-col gap-2">
          <h1 className="display text-3xl">Painel de gestão</h1>
          <p className="text-sm text-muted">Indique o seu email. Enviamos um link seguro para entrar, sem palavra-passe.</p>
        </div>
        {erro ? (
          <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            <AlertIcon size={16} className="mt-0.5 shrink-0" />
            O link é inválido ou expirou. Peça um novo link abaixo.
          </p>
        ) : null}
        {context.state === "unconfigured" ? (
          <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            O painel ainda não está configurado (variáveis do Supabase ou ADMIN_EMAILS em falta).
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
