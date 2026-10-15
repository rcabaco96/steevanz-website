"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "tus-js-client";

/** The pull zone that serves the library's videos (public). */
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
/** While Bunny prepares a video, the page checks again this often (ms). */
const refreshEveryMs = 15000;

type Phase = { kind: "idle" } | { kind: "starting" } | { kind: "sending"; percent: number } | { kind: "done" } | { kind: "error"; message: string };

interface Credentials {
  endpoint: string;
  libraryId: string;
  videoId: string;
  expire: number;
  signature: string;
}

const storageKey = (dishId: string) => `bunny-upload:${dishId}`;
const readStored = (dishId: string) => {
  try {
    return window.localStorage.getItem(storageKey(dishId));
  } catch {
    return null;
  }
};
const writeStored = (dishId: string, videoId: string | null) => {
  try {
    if (videoId) window.localStorage.setItem(storageKey(dishId), videoId);
    else window.localStorage.removeItem(storageKey(dishId));
  } catch {
    // Private mode or blocked storage: the upload simply can't resume after a reload.
  }
};

/**
 * A dish's own video (Bunny Stream): sent straight from the browser to Bunny (TUS, signed by the
 * server), with a progress bar. An interrupted upload resumes only when the video it was going into
 * is the same one the server signs again (the id kept in localStorage); otherwise it starts over.
 * Once sent, Bunny prepares it (a few minutes) and the menu switches to it on its own.
 */
export function DishVideoUpload({
  dishId,
  dishName,
  bunnyVideoId,
  pendingStatus,
  hasYouTube,
  thumbnail,
}: {
  dishId: string;
  dishName: string;
  bunnyVideoId: string | null;
  pendingStatus: "uploading" | "processing" | "failed" | null;
  /** The dish also has a YouTube video (shown until its own is ready). */
  hasYouTube: boolean;
  /** The video's small picture (file name on Bunny). */
  thumbnail?: string | null;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const upload = useRef<Upload | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const preparing = phase.kind === "done" || pendingStatus === "processing";
  // While Bunny prepares the video, the page refreshes itself to show when it's ready.
  useEffect(() => {
    if (!preparing) return;
    const timer = window.setInterval(() => router.refresh(), refreshEveryMs);
    return () => window.clearInterval(timer);
  }, [preparing, router]);
  useEffect(() => () => void upload.current?.abort(), []);

  const start = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setPhase({ kind: "error", message: "Escolha um ficheiro de vídeo." });
      return;
    }
    setPhase({ kind: "starting" });
    let credentials: Credentials;
    try {
      const response = await fetch(`/api/dishes/${dishId}/video`, { method: "POST" });
      const body = (await response.json().catch(() => ({}))) as Partial<Credentials> & { error?: string };
      if (!response.ok || !body.videoId || !body.signature) throw new Error(body.error ?? "Não foi possível começar o envio.");
      credentials = body as Credentials;
    } catch (reason) {
      setPhase({ kind: "error", message: reason instanceof Error ? reason.message : "Não foi possível começar o envio." });
      return;
    }

    const tus = new Upload(file, {
      endpoint: credentials.endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize: 25 * 1024 * 1024,
      removeFingerprintOnSuccess: true,
      headers: {
        AuthorizationSignature: credentials.signature,
        AuthorizationExpire: String(credentials.expire),
        VideoId: credentials.videoId,
        LibraryId: credentials.libraryId,
      },
      metadata: { filetype: file.type, title: dishName },
      onProgress: (sent, total) => setPhase({ kind: "sending", percent: total ? Math.round((sent / total) * 100) : 0 }),
      onError: (error) => {
        console.error("[bunny] upload failed:", error);
        setPhase({ kind: "error", message: "O envio parou. Escolha o mesmo ficheiro para continuar de onde ficou." });
      },
      onSuccess: () => {
        writeStored(dishId, null);
        setPhase({ kind: "done" });
        router.refresh();
      },
    });
    upload.current = tus;
    // Resume only into the same video: an older upload of another video can't be continued.
    const previous = await tus.findPreviousUploads();
    if (previous.length && readStored(dishId) === credentials.videoId) tus.resumeFromPreviousUpload(previous[0]);
    writeStored(dishId, credentials.videoId);
    setPhase({ kind: "sending", percent: 0 });
    tus.start();
  };

  const busy = phase.kind === "starting" || phase.kind === "sending";
  const picture = bunnyVideoId && pullZone ? `https://${pullZone}.b-cdn.net/${bunnyVideoId}/${thumbnail || "thumbnail.jpg"}` : null;
  const status =
    phase.kind === "starting"
      ? "A preparar o envio…"
      : phase.kind === "sending"
        ? `A enviar… ${phase.percent}%`
        : phase.kind === "done" || pendingStatus === "processing"
          ? "Vídeo enviado. A preparar (pode demorar uns minutos); o menu passa a usá-lo sozinho."
          : phase.kind === "error"
            ? phase.message
            : pendingStatus === "failed"
              ? "O último envio falhou. Envie o vídeo outra vez."
              : pendingStatus === "uploading"
                ? "Há um envio por terminar. Escolha o mesmo ficheiro para continuar."
                : bunnyVideoId
                  ? "Vídeo próprio ativo no menu."
                  : hasYouTube
                    ? "Sem vídeo próprio: o menu usa o vídeo do YouTube."
                    : "Sem vídeo: o prato só aparece no menu depois de o enviar.";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-3">
      <div className="flex items-center gap-3">
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element -- Bunny's own thumbnail of the video
          <img src={picture} alt="" width={36} height={64} loading="lazy" className="h-16 w-9 shrink-0 rounded-md bg-surface-2 object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">Vídeo do prato</p>
          <p role="status" className={`text-sm ${phase.kind === "error" || (phase.kind === "idle" && pendingStatus === "failed") ? "text-red-700 dark:text-red-400" : "text-muted"}`}>
            {status}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-line-strong px-4 text-sm font-semibold text-text hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {bunnyVideoId ? "Substituir vídeo" : "Enviar vídeo"}
        </button>
        <input ref={input} type="file" accept="video/*" className="sr-only" tabIndex={-1} onChange={start} aria-label={`Escolher o vídeo de ${dishName}`} />
      </div>
      {phase.kind === "sending" ? (
        <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={phase.percent} aria-label="Progresso do envio">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${phase.percent}%` }} />
        </div>
      ) : null}
    </div>
  );
}
