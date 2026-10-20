"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { adminInputClasses } from "@/components/backoffice/ui";
import { displayUrl } from "@/content/business-cards";
import { setTagActive } from "@/lib/business-cards/actions";
import { isTagDestinationType, searchText, tagDestinationNames, tagPublicPath, type KeychainTagRow } from "@/lib/business-cards/rules";
import { ActiveBadge, ActiveToggle } from "./ActiveToggle";

const taps = new Intl.NumberFormat("pt-PT");

/** The keychains and tags, with a search (name, code or destination) and on/off. */
export function TagList({ tags }: { tags: KeychainTagRow[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const needle = searchText(deferred.trim());
  const shown = needle ? tags.filter((tag) => searchText(tag.label, tag.code, tag.destination_url).includes(needle)) : tags;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
        Procurar
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, código ou destino" autoComplete="off" className={`${adminInputClasses} h-11`} />
      </label>
      <p role="status" className="text-sm text-subtle">
        {needle ? `${shown.length} de ${tags.length} ${tags.length === 1 ? "tag" : "tags"}` : `${tags.length} ${tags.length === 1 ? "tag" : "tags"}`}
      </p>
      {shown.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {shown.map((tag) => (
            <li key={tag.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
              <Link href={`/admin/tags/${tag.id}`} className="group flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold text-text group-hover:underline">{tag.label}</span>
                <span className="truncate text-sm text-muted">
                  {isTagDestinationType(tag.destination_type) ? tagDestinationNames[tag.destination_type] : "Destino"} · {displayUrl(tag.destination_url)}
                </span>
                <span className="truncate text-sm text-subtle">
                  {tagPublicPath(tag.code)} · {taps.format(tag.tap_count)} {tag.tap_count === 1 ? "toque" : "toques"}
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <ActiveBadge active={tag.active} feminine />
                <Link href={`/admin/tags/${tag.id}`} className="font-semibold text-text hover:underline">
                  Editar
                </Link>
                <ActiveToggle action={setTagActive} id={tag.id} active={tag.active} name={tag.label} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line-strong px-4 py-8 text-center text-sm text-muted">Nenhuma tag com «{query.trim()}».</p>
      )}
    </div>
  );
}
