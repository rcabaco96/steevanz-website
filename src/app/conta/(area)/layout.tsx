import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { BackofficeShell } from "@/components/backoffice/Shell";
import { getSession } from "@/lib/auth/session";

const links = [
  { href: "/conta", label: "Os meus produtos", exact: true },
  { href: "/conta/encomendas", label: "Encomendas" },
  { href: "/conta/perfil", label: "Perfil" },
];

export default async function AccountAreaLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (session.state !== "client" && session.state !== "admin") redirect("/conta/entrar");
  // The client area is for clients. Admins see a client's area from the admin (client page → module).
  if (session.state === "admin") redirect("/admin");

  return (
    <BackofficeShell
      home="/conta"
      homeLabel="A minha conta Steevanz"
      badge="Área de cliente"
      email={session.email}
      links={links}
      navLabel="Navegação da conta"
    >
      {children}
    </BackofficeShell>
  );
}
