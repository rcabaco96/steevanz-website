"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { adminInputClasses } from "@/components/backoffice/ui";
import { ArrowUpRight } from "@/components/icons";
import { setCardActive } from "@/lib/business-cards/actions";
import { cardPublicPath, initialsOfName, searchText, type BusinessCardRow } from "@/lib/business-cards/rules";
import { ActiveBadge, ActiveToggle } from "./ActiveToggle";

type CardListItem = Pick<BusinessCardRow, "id" | "slug" | "active" | "name" | "role" | "company" | "client_name" | "photo_url" | "email">;

/** The cards, with a search (name, company, client, address or email; accents don't matter) and on/off. */
export function CardList({ cards }: { cards: CardListItem[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const needle = searchText(deferred.trim());
  const shown = needle ? cards.filter((card) => searchText(card.name, card.company, card.client_name, card.slug, card.role, card.email).includes(needle)) : cards;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
        Procurar
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nome, empresa, cliente ou endereço"
          autoComplete="off"
          className={`${adminInputClasses} h-11`}
        />
      </label>
      <p role="status" className="text-sm text-subtle">
        {needle ? `${shown.length} de ${cards.length} ${cards.length === 1 ? "cartão" : "cartões"}` : `${cards.length} ${cards.length === 1 ? "cartão" : "cartões"}`}
      </p>
      {shown.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {shown.map((card) => {
            const line = [card.role, card.company].filter(Boolean).join(" · ");
            return (
              <li key={card.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <Link href={`/admin/cartoes/${card.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
                  {card.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- the card's own photo (a site path or the bucket)
                    <img src={card.photo_url} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-full border border-line bg-white object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-text">
                      {initialsOfName(card.name)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-text group-hover:underline">{card.name}</span>
                    {line ? <span className="block truncate text-sm text-muted">{line}</span> : null}
                    <span className="block truncate text-sm text-subtle">
                      {cardPublicPath(card.slug)}
                      {card.client_name ? ` · ${card.client_name}` : null}
                    </span>
                  </span>
                </Link>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  <ActiveBadge active={card.active} />
                  <Link href={`/admin/cartoes/${card.id}`} className="font-semibold text-text hover:underline">
                    Editar
                  </Link>
                  <a href={cardPublicPath(card.slug)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-accent-text hover:underline">
                    Abrir página <ArrowUpRight size={15} />
                  </a>
                  <ActiveToggle action={setCardActive} id={card.id} active={card.active} name={card.name} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line-strong px-4 py-8 text-center text-sm text-muted">Nenhum cartão com «{query.trim()}».</p>
      )}
    </div>
  );
}
