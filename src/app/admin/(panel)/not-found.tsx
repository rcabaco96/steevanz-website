import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function AdminNotFound() {
  return (
    <div className="card flex flex-col items-start gap-4 p-6 sm:p-8">
      <p className="eyebrow">404</p>
      <h1 className="display text-3xl">Registo não encontrado.</h1>
      <Link href="/admin" className={buttonClasses("secondary", "md")}>
        Voltar ao resumo
      </Link>
    </div>
  );
}
