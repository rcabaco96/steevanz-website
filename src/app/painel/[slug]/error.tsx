"use client";

import { useEffect, useRef } from "react";
import { buttonClasses } from "@/components/ui/Button";

/** Tries once on its own after a short wait: most failures here are a brief network drop. */
const autoRetryMs = 4000;

export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const retried = useRef(false);

  useEffect(() => {
    console.error(error);
    if (retried.current) return;
    retried.current = true;
    const timer = setTimeout(retry, autoRetryMs);
    return () => clearTimeout(timer);
  }, [error, retry]);

  return (
    <div data-panel-error className="card mx-auto flex max-w-xl flex-col items-start gap-4 p-6 sm:p-8">
      <p className="eyebrow">Ligação</p>
      <h1 className="display text-3xl">Não conseguimos carregar o painel agora.</h1>
      <p className="text-muted">Foi uma falha momentânea de ligação. Os seus dados estão guardados; vamos tentar outra vez dentro de instantes.</p>
      <button type="button" className={buttonClasses("secondary", "md")} onClick={() => retry()}>
        Tentar outra vez
      </button>
    </div>
  );
}
