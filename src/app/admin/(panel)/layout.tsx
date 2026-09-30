import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { signOut } from "@/lib/admin/actions";
import { getAdminContext } from "@/lib/admin/auth";

function SignOutButton({ label = "Sair" }: { label?: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={buttonClasses("ghost", "sm")}>
        {label}
      </button>
    </form>
  );
}

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const context = await getAdminContext();

  if (context.state === "unconfigured" || context.state === "anonymous") redirect("/admin/login");

  if (context.state === "forbidden") {
    return (
      <main className="grid min-h-dvh place-items-center px-4 py-16">
        <div className="card flex w-full max-w-md flex-col gap-5 p-6 text-center sm:p-8">
          <p className="eyebrow">Acesso negado</p>
          <h1 className="display text-3xl">Esta conta não tem acesso ao painel.</h1>
          <p className="text-sm text-muted">
            Entrou como <strong className="text-text">{context.email}</strong>. Se precisa de acesso, fale com o administrador.
          </p>
          <div className="flex justify-center">
            <SignOutButton label="Sair e usar outro email" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-3 pb-2 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo href="/admin" label="Painel Steevanz" />
              <span className="hidden rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text sm:inline">Painel</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="hidden max-w-48 truncate text-sm text-subtle md:inline">{context.email}</span>
              <ThemeToggle label="Mudar tema" />
              <SignOutButton />
            </div>
          </div>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
