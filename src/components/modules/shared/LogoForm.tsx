"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FormMessage } from "@/components/backoffice/ActionForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonClasses } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";
import { removeEstablishmentLogo, uploadEstablishmentLogo } from "@/lib/establishments/actions";
import { logoMaxBytes } from "@/lib/establishments/logo-rules";

/** Bigger than any icon drawn from it (512 px), with room to spare. */
const maxSide = 1024;

/**
 * The image as it is sent: PNG or JPEG as chosen; WebP (which the icon renderer can't draw) and
 * very large pictures redrawn as PNG/JPEG of at most 1024 px.
 */
async function prepareLogo(file: File): Promise<File | { error: string }> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return { error: "Escolha uma imagem PNG, JPEG ou WebP." };
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { error: "Não foi possível abrir esta imagem. Escolha outra." };
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  if (file.type !== "image/webp" && scale === 1) {
    bitmap.close();
    return file.size > logoMaxBytes ? { error: "A imagem tem mais de 2 MB. Escolha uma mais pequena." } : file;
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // JPEG stays JPEG (no transparency to keep, smaller); WebP and PNG become PNG.
  const type = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.9));
  if (!blob) return { error: "Não foi possível preparar esta imagem. Escolha outra." };
  if (blob.size > logoMaxBytes) return { error: "A imagem tem mais de 2 MB. Escolha uma mais pequena." };
  return new File([blob], type === "image/png" ? "logo.png" : "logo.jpg", { type });
}

/** True once `busy` has lasted ~300 ms (shorter waits show nothing, so nothing flickers). */
function useSlow(busy: boolean): boolean {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setSlow(true), 300);
    return () => {
      window.clearTimeout(timer);
      setSlow(false);
    };
  }, [busy]);
  return slow;
}

/**
 * Settings, "Espaço": the establishment's logo. It becomes the queue ticket's icon on the
 * customer's home screen and in its notifications; without one, the initials on the colour.
 */
export function LogoForm({ establishmentId, hasLogo, iconSrc }: { establishmentId: string; hasLogo: boolean; iconSrc: string }) {
  const [chosen, setChosen] = useState<{ file: File; preview: string } | null>(null);
  /** What the last step said: a problem with the chosen file, or the server's answer. */
  const [message, setMessage] = useState<ActionState>(null);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<"upload" | "remove" | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const uploading = pending && action === "upload";
  const removing = pending && action === "remove";
  const slow = useSlow(pending);

  const clearChosen = () => {
    if (input.current) input.current.value = "";
    setChosen((current) => {
      if (current) URL.revokeObjectURL(current.preview);
      return null;
    });
  };

  const choose = async (file: File | undefined) => {
    setMessage(null);
    setChosen((current) => {
      if (current) URL.revokeObjectURL(current.preview);
      return null;
    });
    if (!file) return;
    const prepared = await prepareLogo(file);
    if ("error" in prepared) {
      setMessage({ ok: false, message: prepared.error });
      if (input.current) input.current.value = "";
      return;
    }
    setChosen({ file: prepared, preview: URL.createObjectURL(prepared) });
  };

  const run = (kind: "upload" | "remove", data: FormData) => {
    setAction(kind);
    setMessage(null);
    startTransition(async () => {
      const result = await (kind === "upload" ? uploadEstablishmentLogo : removeEstablishmentLogo)(null, data).catch(() => ({ ok: false, message: "Sem ligação. Tente de novo." }));
      setMessage(result);
      // Kept: the icon (re-rendered by the server with its new version) replaces the local preview.
      if (result?.ok) clearChosen();
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-muted">Logótipo</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-1.5" aria-busy={slow || undefined}>
          <div className="relative h-20 w-20 overflow-hidden rounded-[22%] border border-line bg-white">
            <Skeleton className="absolute inset-0 rounded-none" />
            {chosen ? (
              // eslint-disable-next-line @next/next/no-img-element -- a local preview (blob URL)
              <img src={chosen.preview} alt="Pré-visualização do novo logótipo" className="absolute inset-[12%] h-[76%] w-[76%] object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- the generated icon, as phones get it
              <img key={iconSrc} src={iconSrc} alt="Ícone atual" className="absolute inset-0 h-full w-full" />
            )}
            {slow ? <Skeleton className="absolute inset-0 rounded-none" /> : null}
          </div>
          <span className="text-xs text-subtle">{chosen ? "Novo" : "No telemóvel"}</span>
          {slow ? (
            <span role="status" className="sr-only">
              A atualizar…
            </span>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-sm text-muted">
            Aparece no ícone da senha no ecrã principal do cliente e nas notificações da fila. Uma imagem quadrada funciona melhor (PNG, JPEG ou WebP, até 2 MB).
            {hasLogo ? null : " Sem logótipo, mostramos as iniciais do espaço."}
          </p>
          <form
            className="flex flex-wrap items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!chosen) {
                input.current?.click();
                return;
              }
              const data = new FormData();
              data.set("establishment_id", establishmentId);
              data.set("logo", chosen.file);
              run("upload", data);
            }}
          >
            <label className={buttonClasses("secondary", "sm", "cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent")}>
              {chosen || hasLogo ? "Escolher outra imagem" : "Escolher imagem"}
              <input
                ref={input}
                type="file"
                name="logo"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                disabled={pending}
                onChange={(event) => void choose(event.target.files?.[0])}
              />
            </label>
            {chosen ? (
              <button type="submit" disabled={pending} aria-busy={uploading} className={buttonClasses("primary", "sm")}>
                {uploading ? <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
                {uploading ? "A guardar…" : "Guardar logótipo"}
              </button>
            ) : null}
            {hasLogo && !chosen ? (
              <button
                type="button"
                disabled={pending}
                aria-busy={removing}
                className={buttonClasses("ghost", "sm", "text-muted hover:text-danger")}
                onClick={() => {
                  if (!window.confirm("Remover o logótipo? O ícone volta a mostrar as iniciais do espaço.")) return;
                  const data = new FormData();
                  data.set("establishment_id", establishmentId);
                  run("remove", data);
                }}
              >
                {removing ? "A remover…" : "Remover logótipo"}
              </button>
            ) : null}
          </form>
          {message ? <FormMessage ok={message.ok} message={message.message} /> : null}
        </div>
      </div>
    </div>
  );
}
