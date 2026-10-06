"use client";

import { useState } from "react";
import { isShortMapsLink, parseMapsPlaceLink, plateLink as plateLinkFor } from "@/lib/reviews/maps-link";

/**
 * «Novo negócio»: the Google Maps link, and right below it, as soon as it is pasted, the link for the
 * NFC plate (Google's write-a-review window, from the place id computed out of the link) with a copy
 * button.
 */
export function MapsLinkField({ inputClassName, labelClassName }: { inputClassName: string; labelClassName: string }) {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const trimmed = link.trim();
  const place = trimmed ? parseMapsPlaceLink(trimmed) : null;
  const plateLink = place ? plateLinkFor(place) : null;

  async function copy() {
    if (!plateLink) return;
    try {
      await navigator.clipboard.writeText(plateLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className={labelClassName}>
        Link do negócio no Google Maps
        <input
          name="google_maps_url"
          type="url"
          required
          value={link}
          onChange={(event) => {
            setLink(event.target.value);
            setCopied(false);
          }}
          placeholder="https://maps.app.goo.gl/… ou https://www.google.com/maps/place/…"
          className={`${inputClassName} h-11`}
        />
      </label>
      {plateLink ? (
        <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-surface-2/60 p-3">
          <p className="text-sm font-medium text-text">
            Link para a placa NFC <span className="font-normal text-subtle">· {place?.name}</span>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input readOnly value={plateLink} onFocus={(event) => event.target.select()} aria-label="Link para a placa NFC" className={`${inputClassName} h-10 min-w-0 flex-1 text-xs`} />
            <button
              type="button"
              onClick={() => void copy()}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-text hover:border-accent/50"
            >
              {copied ? "Copiado ✓" : "Copiar"}
            </button>
            <a
              href={plateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-full bg-accent px-4 text-sm font-semibold text-accent-contrast hover:bg-accent-hover"
            >
              Abrir ↗<span className="sr-only"> (abre a página de reviews noutro separador)</span>
            </a>
          </div>
          <p className="text-xs text-subtle">
            Abre diretamente a janela «Escrever uma crítica» do negócio no Google (com as estrelas). É este o link a gravar nas placas e nos QR codes.
          </p>
        </div>
      ) : trimmed && isShortMapsLink(trimmed) ? (
        <p className="text-xs text-subtle">Link curto: o link da placa NFC aparece na ficha do negócio depois de o criar.</p>
      ) : trimmed ? (
        <p className="text-xs text-subtle">Ainda não é o link de um negócio: abra o negócio no Google Maps e copie o link da barra de endereço.</p>
      ) : null}
    </div>
  );
}
