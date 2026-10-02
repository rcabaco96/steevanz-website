import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function DashboardNotFound() {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-start gap-4 p-6 sm:p-8">
      <p className="eyebrow">404</p>
      <h1 className="display text-3xl">Este painel não existe.</h1>
      <p className="text-muted">Confirme o endereço que recebeu da Steevanz.</p>
      <Link href="/" className={buttonClasses("secondary", "md")}>
        Ir para o site Steevanz
      </Link>
    </div>
  );
}
