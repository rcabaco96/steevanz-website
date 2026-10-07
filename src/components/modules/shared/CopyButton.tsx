"use client";

import { useState } from "react";
import { buttonClasses } from "@/components/ui/Button";

export function CopyButton({ value, label = "Copiar link" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={buttonClasses("secondary", "sm")}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copie o link:", value);
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copiado" : label}</span>
    </button>
  );
}

export function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return (
    <button type="button" className={buttonClasses("secondary", "sm")} onClick={() => window.print()}>
      {label}
    </button>
  );
}
