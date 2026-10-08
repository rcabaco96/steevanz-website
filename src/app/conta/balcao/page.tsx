import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { getSession } from "@/lib/auth/session";
import { ownerCounterSpaces } from "@/lib/establishments/counter";
import { readableTextOn } from "@/lib/establishments/kinds";

export const metadata: Metadata = { title: "Balcão" };

const labels = { waitlist: "Fila", bookings: "Reservas", loyalty: "Cartão" } as const;

/** The counter's entry: straight to the space when there is one, otherwise pick it. */
export default async function CounterHomePage() {
  const session = await getSession();
  if (session.state === "admin") redirect("/admin");
  if (session.state !== "client") redirect(`/conta/entrar?${new URLSearchParams({ next: "/conta/balcao" })}`);
  const spaces = await ownerCounterSpaces(session.user.id);
  if (spaces.length === 1) redirect(`/conta/balcao/${spaces[0].establishment.slug}`);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="display text-3xl">Balcão</h1>
        <p className="text-muted">{spaces.length ? "Escolha o espaço." : "Ainda não tem a fila, as reservas ou o cartão ativos."}</p>
      </div>
      {spaces.length ? (
        <ul className="flex flex-col gap-2">
          {spaces.map(({ establishment, products }) => (
            <li key={establishment.id}>
              <Link href={`/conta/balcao/${establishment.slug}`} className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-4 transition-colors hover:border-line-strong">
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl font-bold"
                  style={{ background: establishment.accent_color, color: readableTextOn(establishment.accent_color) }}
                >
                  {establishment.name.trim().charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-text">{establishment.name}</span>
                  <span className="block text-sm text-muted">{products.map((product) => labels[product]).join(" · ")}</span>
                </span>
                <ArrowRight size={18} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <Link href="/conta" className="text-sm font-semibold text-muted hover:text-text">
        Voltar à conta
      </Link>
    </main>
  );
}
