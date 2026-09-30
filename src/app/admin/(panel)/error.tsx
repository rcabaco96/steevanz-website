"use client";

import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="card flex flex-col items-start gap-4 p-6 sm:p-8">
      <p className="eyebrow">Erro</p>
      <h1 className="display text-3xl">Não foi possível carregar esta página.</h1>
      <p className="text-muted">
        Verifique a ligação à base de dados (variáveis do Supabase e migrações aplicadas) e tente novamente.
        {error.digest ? <span className="mt-2 block font-mono text-xs text-subtle">Ref. {error.digest}</span> : null}
      </p>
      <button type="button" onClick={reset} className={buttonClasses("primary", "md")}>
        Tentar novamente
      </button>
    </div>
  );
}
