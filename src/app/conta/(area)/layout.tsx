import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { BackofficeShell } from "@/components/backoffice/Shell";
import { buttonClasses } from "@/components/ui/Button";
import { getSession } from "@/lib/auth/session";

const links = [
  { href: "/conta", label: "Os meus produtos", exact: true },
  { href: "/conta/encomendas", label: "Encomendas" },
  { href: "/conta/perfil", label: "Perfil" },
];

export default async function AccountAreaLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (session.state !== "client" && session.state !== "admin") redirect("/conta/entrar");

  return (
    <BackofficeShell
      home="/conta"
      homeLabel="A minha conta Steevanz"
      badge="Área de cliente"
      email={session.email}
      links={links}
      navLabel="Navegação da conta"
      actions={
        session.state === "admin" ? (
          <Link href="/admin" className={buttonClasses("secondary", "sm")}>
            Painel
          </Link>
        ) : null
      }
    >
      {children}
    </BackofficeShell>
  );
}
