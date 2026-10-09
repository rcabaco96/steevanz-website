import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { BackofficeShell, SignOutButton } from "@/components/backoffice/Shell";
import { buttonClasses } from "@/components/ui/Button";
import { getAdminContext } from "@/lib/admin/auth";

// Day to day first: what to do today, the clients and their orders, the people who asked about us
// (demos, information requests and the demo hours, as tabs inside «Contactos»), then reviews.
const links = [
  { href: "/admin", label: "Início", exact: true },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/encomendas", label: "Encomendas" },
  { href: "/admin/bookings", label: "Contactos", also: ["/admin/leads", "/admin/availability"] },
  { href: "/admin/reviews", label: "Reviews" },
];

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const context = await getAdminContext();

  if (context.state === "unconfigured" || context.state === "anonymous") redirect("/conta/entrar?next=/admin");

  if (context.state === "forbidden") {
    return (
      <main className="grid min-h-dvh place-items-center px-4 py-16">
        <div className="card flex w-full max-w-md flex-col gap-5 p-6 text-center sm:p-8">
          <p className="eyebrow">Acesso negado</p>
          <h1 className="display text-3xl">Esta conta não tem acesso ao painel.</h1>
          <p className="text-sm text-muted">
            Entrou como <strong className="text-text">{context.email}</strong>. Se precisa de acesso, fale com o administrador.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/conta" className={buttonClasses("primary", "sm")}>
              Ir para a minha conta
            </Link>
            <SignOutButton label="Sair e usar outro email" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <BackofficeShell home="/admin" homeLabel="Painel Steevanz" badge="Painel" email={context.email} links={links} navLabel="Navegação do painel">
      {children}
    </BackofficeShell>
  );
}
