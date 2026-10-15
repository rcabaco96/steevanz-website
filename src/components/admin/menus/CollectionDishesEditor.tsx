"use client";

import { useActionState, useState } from "react";
import { FormMessage, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses } from "@/components/backoffice/ui";
import { CloseIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { saveCollectionDishes } from "@/lib/video-menus/actions";
import { formatPriceCents, moveItem, youTubeThumbnail } from "@/lib/video-menus/rules";

interface EditorDish {
  id: string;
  name: string;
  video_id: string;
  price_cents: number;
}

const smallButton = "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-surface-2 hover:text-text disabled:opacity-40";

/**
 * Which dishes a collection shows and in what order. Changes stay here (marked as unsaved) until
 * «Guardar coleção»; «Juntar todos os pratos» adds every missing dish in the menu's order.
 * When the stored list changes (a save, a dish added to it or deleted), the editor starts again from it.
 */
export function CollectionDishesEditor({ collectionId, dishes, selected }: { collectionId: string; dishes: EditorDish[]; selected: string[] }) {
  const [list, setList] = useState(selected);
  const [stored, setStored] = useState(selected.join());
  if (selected.join() !== stored) {
    setStored(selected.join());
    setList(selected);
  }
  const [state, formAction] = useActionState(saveCollectionDishes, null);
  const byId = new Map(dishes.map((dish) => [dish.id, dish]));
  const shown = list.filter((id) => byId.has(id));
  const missing = dishes.filter((dish) => !shown.includes(dish.id));
  const changed = shown.join() !== selected.filter((id) => byId.has(id)).join();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={collectionId} />
      {shown.map((id) => (
        <input key={id} type="hidden" name="dishes" value={id} />
      ))}
      {shown.length ? (
        <ol className="flex flex-col divide-y divide-line rounded-2xl border border-line">
          {shown.map((id, index) => {
            const dish = byId.get(id)!;
            const controls = (className: string) => (
              <span className={`shrink-0 gap-1 ${className}`}>
                <button type="button" className={smallButton} disabled={index === 0} aria-label={`Subir ${dish.name}`} onClick={() => setList(moveItem(shown, index, -1))}>
                  ↑
                </button>
                <button type="button" className={smallButton} disabled={index === shown.length - 1} aria-label={`Descer ${dish.name}`} onClick={() => setList(moveItem(shown, index, 1))}>
                  ↓
                </button>
                <button type="button" className={`${smallButton} hover:text-danger`} aria-label={`Tirar ${dish.name} da coleção`} onClick={() => setList(shown.filter((other) => other !== id))}>
                  <CloseIcon size={15} />
                </button>
              </span>
            );
            return (
              <li key={id} className="flex items-center gap-2 p-2 sm:pl-3">
                <span className="hidden w-5 shrink-0 text-right text-xs tabular-nums text-subtle sm:block">{index + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own picture of the video */}
                <img src={youTubeThumbnail(dish.video_id)} alt="" width={36} height={48} loading="lazy" className="h-12 w-9 shrink-0 rounded-md bg-surface-2 object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-medium text-text">{dish.name}</span>
                  <span className="block text-xs text-subtle">{formatPriceCents(dish.price_cents)}</span>
                  {/* On a phone the buttons go under the name, which keeps the whole width. */}
                  {controls("mt-1.5 flex sm:hidden")}
                </span>
                {controls("hidden sm:flex")}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-2xl border border-dashed border-line-strong px-4 py-5 text-center text-sm text-muted">Sem pratos: a coleção não aparece no menu.</p>
      )}
      {missing.length ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            aria-label="Juntar um prato"
            value=""
            onChange={(event) => {
              if (event.target.value) setList([...shown, event.target.value]);
            }}
            className={`${adminInputClasses} h-10 min-w-0 flex-1`}
          >
            <option value="">Juntar um prato…</option>
            {missing.map((dish) => (
              <option key={dish.id} value={dish.id}>
                {dish.name}
              </option>
            ))}
          </select>
          <button type="button" className={buttonClasses("ghost", "sm")} onClick={() => setList([...shown, ...missing.map((dish) => dish.id)])}>
            Juntar todos os pratos ({missing.length})
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton size="sm" variant={changed ? "primary" : "secondary"} pendingLabel="A guardar…">
          Guardar coleção
        </SubmitButton>
        {changed ? <span className="text-xs font-semibold text-gold-text">Alterações por guardar</span> : null}
        {state && !changed ? <FormMessage ok={state.ok} message={state.message} /> : null}
      </div>
    </form>
  );
}
