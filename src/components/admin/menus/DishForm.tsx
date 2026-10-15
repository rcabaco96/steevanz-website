"use client";

import { useActionState, useState } from "react";
import { FormMessage, SubmitButton } from "@/components/backoffice/ActionForm";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import type { ActionState } from "@/lib/action-state";
import { addDish, updateDish } from "@/lib/video-menus/actions";
import { formatPriceCents, parsePriceCents, parseYouTubeId, priceInputValue, youTubeThumbnail, type VideoMenuDishRow } from "@/lib/video-menus/rules";

const input = `${adminInputClasses} h-11`;

interface DishFormProps {
  menuId: string;
  /** Without a dish: the form that adds one. */
  dish?: VideoMenuDishRow;
  /** Adding: the collections it can go into at once. */
  collections?: { id: string; name: string }[];
}

/**
 * A dish: its YouTube Short (any link or the id; the picture shows at once from YouTube's image
 * servers), name, description and price in euros. The fields are the component's own, so a refused
 * save keeps what was typed; adding empties them for the next dish.
 */
export function DishForm({ menuId, dish, collections = [] }: DishFormProps) {
  const [video, setVideo] = useState(dish?.video_id ?? "");
  const [name, setName] = useState(dish?.name ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [price, setPrice] = useState(dish ? priceInputValue(dish.price_cents) : "");
  const [picked, setPicked] = useState<string[]>([]);

  const [state, formAction] = useActionState(async (previous: ActionState, formData: FormData) => {
    const result = await (dish ? updateDish : addDish)(previous, formData);
    if (result?.ok && !dish) {
      setVideo("");
      setName("");
      setDescription("");
      setPrice("");
    }
    return result;
  }, null);

  const videoId = video.trim() ? parseYouTubeId(video) : null;
  const priceCents = price.trim() ? parsePriceCents(price) : null;
  const fieldId = dish?.id ?? `new-${menuId}`;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="menu_id" value={menuId} />
      {dish ? <input type="hidden" name="id" value={dish.id} /> : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2 sm:w-28">
          {videoId ? (
            // eslint-disable-next-line @next/next/no-img-element -- YouTube's own picture of the video
            <img key={videoId} src={youTubeThumbnail(videoId)} alt="Imagem do vídeo" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center px-2 text-center text-xs text-subtle">{video.trim() ? "Link inválido" : "Sem vídeo"}</span>
          )}
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Vídeo do YouTube
            <input
              name="video"
              required
              maxLength={300}
              inputMode="url"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="https://youtube.com/shorts/…"
              value={video}
              onChange={(event) => setVideo(event.target.value)}
              aria-invalid={video.trim() && !videoId ? true : undefined}
              aria-describedby={`${fieldId}-video-hint`}
              className={input}
            />
            <span id={`${fieldId}-video-hint`} className={`text-xs font-normal ${video.trim() && !videoId ? "text-danger" : "text-subtle"}`}>
              {videoId ? `Vídeo ${videoId}` : video.trim() ? "Não é um link de vídeo do YouTube." : "Cole o link do Short (shorts/, watch?v=, youtu.be/…) ou o código de 11 caracteres."}
            </span>
          </label>
          <label className={adminLabelClasses}>
            Nome
            <input name="name" required maxLength={80} autoComplete="off" placeholder="Tosta de queijo" value={name} onChange={(event) => setName(event.target.value)} className={input} />
          </label>
          <label className={adminLabelClasses}>
            Preço (€)
            <input
              name="price"
              required
              inputMode="decimal"
              autoComplete="off"
              placeholder="4,50"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              aria-invalid={price.trim() && priceCents === null ? true : undefined}
              className={input}
            />
            {price.trim() ? (
              <span className={`text-xs font-normal ${priceCents === null ? "text-danger" : "text-subtle"}`}>{priceCents === null ? "Preço inválido (ex.: 4,50)." : formatPriceCents(priceCents)}</span>
            ) : null}
          </label>
          <label className={`${adminLabelClasses} sm:col-span-2`}>
            Descrição
            <textarea
              name="description"
              maxLength={300}
              rows={2}
              placeholder="Pão tostado na manteiga com queijo derretido."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${adminInputClasses} py-2.5`}
            />
          </label>
        </div>
      </div>
      {!dish && collections.length ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium text-muted">Juntar às coleções</legend>
          <div className="flex flex-wrap gap-2">
            {collections.map((collection) => (
              <label
                key={collection.id}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-2 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20"
              >
                <input
                  type="checkbox"
                  name="collections"
                  value={collection.id}
                  checked={picked.includes(collection.id)}
                  onChange={(event) => setPicked((current) => (event.target.checked ? [...current, collection.id] : current.filter((id) => id !== collection.id)))}
                  className="h-4 w-4 accent-accent"
                />
                {collection.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton size={dish ? "sm" : "md"} pendingLabel={dish ? "A guardar…" : "A adicionar…"}>
          {dish ? "Guardar prato" : "Adicionar prato"}
        </SubmitButton>
        {state ? <FormMessage ok={state.ok} message={state.message} /> : null}
      </div>
    </form>
  );
}
