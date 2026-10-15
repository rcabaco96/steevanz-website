"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertIcon, Check } from "@/components/icons";
import { buttonClasses } from "./Button";

/** Verbs that undo or delete something: their button is red. */
const destructive = /^(remover|apagar|retirar|cancelar|desligar|sair|eliminar)$/i;

/**
 * "Entregar «Um corte grátis» a Rui? Fica marcada como usada." → the question as the title, the rest
 * underneath, and the question's first verb on the button («Entregar»), red when it deletes or undoes.
 */
export function splitConfirm(message: string): { title: string; detail: string | null; action: string; danger: boolean } {
  const end = message.indexOf("?");
  const title = end >= 0 ? message.slice(0, end + 1) : message;
  const detail = end >= 0 ? message.slice(end + 1).trim() || null : null;
  const first = title.split(/\s+/)[0] ?? "";
  const verb = /^[A-Za-zÀ-ÿ]+(ar|er|ir)$/i.test(first) ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : "Confirmar";
  return { title, detail, action: verb, danger: destructive.test(verb) };
}

/**
 * The confirmation before an action, in the site's style (not the browser's grey box): the question,
 * a line of detail, «Voltar» and the action. A native <dialog>, so focus stays inside, Escape and a
 * tap outside close it, and the page behind can't be used meanwhile.
 */
export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  confirmClassName,
  cancelClassName,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Button classes for pages with their own style (the customer pages). */
  confirmClassName?: string;
  cancelClassName?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { title, detail, action, danger } = splitConfirm(message);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-line bg-surface p-0 text-center text-text shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] backdrop:bg-black/45 backdrop:backdrop-blur-[2px] open:animate-[confirm-in_0.22s_var(--ease-out-expo)] motion-reduce:animate-none"
    >
      <div className="flex flex-col items-center gap-5 px-6 pt-7 pb-6">
        <span aria-hidden="true" className={`grid h-11 w-11 place-items-center rounded-full ${danger ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent-text"}`}>
          {danger ? <AlertIcon size={20} /> : <Check size={20} />}
        </span>
        <div className="flex flex-col gap-1.5">
          <p id={titleId} className="text-[1.05rem] leading-snug font-semibold text-balance">
            {title}
          </p>
          {detail ? <p className="text-sm text-pretty text-muted">{detail}</p> : null}
        </div>
        <div className="grid w-full grid-cols-2 gap-2">
          <button type="button" autoFocus onClick={onCancel} className={cancelClassName ?? buttonClasses("secondary", "md", "w-full")}>
            Voltar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmClassName ?? buttonClasses("primary", "md", `w-full ${danger ? "bg-danger! text-white! shadow-none! hover:brightness-110" : ""}`)}
          >
            {action}
          </button>
        </div>
      </div>
    </dialog>
  );
}

/**
 * A form that asks before it submits: `onSubmit` holds the first submit and opens the dialog; the
 * action goes ahead (with the same button that was pressed) only after the confirmation.
 */
export function useConfirmedSubmit(
  message: string | undefined,
  style?: { confirmClassName?: string; cancelClassName?: string },
): { onSubmit: (event: FormEvent<HTMLFormElement>) => void; dialog: ReactNode } {
  const [held, setHeld] = useState<{ form: HTMLFormElement; submitter: HTMLElement | null } | null>(null);
  const confirmed = useRef(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!message) return;
    if (confirmed.current) {
      confirmed.current = false;
      return;
    }
    event.preventDefault();
    setHeld({ form: event.currentTarget, submitter: (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null });
  };

  const dialog = message ? (
    <ConfirmDialog
      open={held !== null}
      message={message}
      onCancel={() => setHeld(null)}
      onConfirm={() => {
        const target = held;
        setHeld(null);
        if (!target) return;
        confirmed.current = true;
        target.form.requestSubmit(target.submitter ?? undefined);
      }}
      {...style}
    />
  ) : null;

  return { onSubmit, dialog };
}
