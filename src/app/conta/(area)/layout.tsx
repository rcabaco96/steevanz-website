import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { BackofficeShell } from "@/components/backoffice/Shell";
import { getSession } from "@/lib/auth/session";
import { ownerCounterSpaces } from "@/lib/establishments/counter";

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
  // "Balcão" only for clients with the queue, bookings or loyalty card on a space.
  const hasCounter = (await ownerCounterSpaces(session.user.id)).length > 0;

  return (
    <BackofficeShell
      home="/conta"
      homeLabel="A minha conta Steevanz"
      badge="Área de cliente"
      email={session.email}
      links={hasCounter ? [links[0], { href: "/conta/balcao", label: "Balcão" }, ...links.slice(1)] : links}
      navLabel="Navegação da conta"
    >
      {children}
    </BackofficeShell>
  );
}
