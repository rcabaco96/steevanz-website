import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function AccountNotFound() {
  return (
    <div className="card flex flex-col items-start gap-4 p-6 sm:p-8">
      <p className="eyebrow">404</p>
      <h1 className="display text-3xl">Página não encontrada.</h1>
      <p className="text-muted">Este produto não está ativo na sua conta, ou a página não existe.</p>
      <Link href="/conta" className={buttonClasses("secondary", "md")}>
        Voltar aos meus produtos
      </Link>
    </div>
  );
}
