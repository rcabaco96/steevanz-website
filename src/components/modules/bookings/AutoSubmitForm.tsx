"use client";

import { useRef, type ReactNode } from "react";

/** A GET form that reloads on its own when a field changes (no "see" button); typing waits a moment. */
export function AutoSubmitForm({ action, className, children }: { action: string; className?: string; children: ReactNode }) {
  const timer = useRef<number | undefined>(undefined);
  return (
    <form
      method="get"
      action={action}
      className={className}
      onChange={(event) => {
        const form = event.currentTarget;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => form.requestSubmit(), (event.target as HTMLElement).tagName === "SELECT" ? 0 : 450);
      }}
    >
      {children}
    </form>
  );
}
