import { BackLink } from "@/components/admin/RecordDetail";
import { CollectionDishesEditor } from "@/components/admin/menus/CollectionDishesEditor";
import { DishForm } from "@/components/admin/menus/DishForm";
import { MenuDetailsForm } from "@/components/admin/menus/MenuDetailsForm";
import { MenuStateBadge, MoveButtons } from "@/components/admin/menus/MenuBits";
import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { AdminPageHeader, EmptyState, Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { ArrowUpRight, PlusIcon } from "@/components/icons";
import {
  addCollection,
  deleteCollection,
  deleteDish,
  deleteMenu,
  moveCollection,
  moveDish,
  renameCollection,
  setDefaultCollection,
} from "@/lib/video-menus/actions";
import { formatPriceCents, menuPublicPath, youTubeThumbnail } from "@/lib/video-menus/rules";
import type { AdminMenu } from "@/lib/video-menus/store";

const summaryClasses = "inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-muted hover:text-text [&::-webkit-details-marker]:hidden";

/**
 * A menu's admin page: its details, the dishes (add, edit, order, delete) and the collections
 * (create, rename, order, default, delete, and which dishes each shows in what order).
 */
export function MenuEditor({ data, businesses }: { data: AdminMenu; businesses: { id: string; name: string }[] }) {
  const { menu, dishes, collections, links } = data;
  const publicPath = menuPublicPath(menu.slug);
  const collectionNames = new Map(collections.map((collection) => [collection.id, collection.name]));
  const dishCollections = (dishId: string) => links.filter((link) => link.dish_id === dishId).map((link) => collectionNames.get(link.collection_id)).filter(Boolean);
  const collectionDishes = (collectionId: string) => links.filter((link) => link.collection_id === collectionId).map((link) => link.dish_id);
  const editorDishes = dishes.map(({ id: dishId, name, video_id, price_cents }) => ({ id: dishId, name, video_id, price_cents }));

  return (
    <>
      <BackLink href="/admin/menus" label="Menus em vídeo" />
      <AdminPageHeader
        title={menu.business_name}
        description={publicPath}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <MenuStateBadge active={menu.active} empty={!dishes.length} />
            <a href={publicPath} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text hover:underline">
              Ver menu <ArrowUpRight size={15} />
            </a>
          </div>
        }
      />
      {!menu.active || !dishes.length ? (
        <p className="rounded-2xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-text">
          {!menu.active ? "O menu está desligado: a página pública dá «página não encontrada» até o ligar em «Dados do menu»." : "O menu ainda não tem pratos: a página pública só abre depois do primeiro."}
        </p>
      ) : null}

      <Panel title="Dados do menu">
        <MenuDetailsForm menu={menu} businesses={businesses} />
      </Panel>

      <Panel title={`Pratos (${dishes.length})`}>
        <div className="flex flex-col gap-4">
          <details className="group rounded-[var(--radius-card)] border-2 border-dashed border-line-strong p-4 open:border-solid open:border-line sm:p-5" open={!dishes.length}>
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-text [&::-webkit-details-marker]:hidden">
              <PlusIcon size={16} />
              Adicionar prato
            </summary>
            <div className="mt-4">
              <DishForm menuId={menu.id} collections={collections.map(({ id: collectionId, name }) => ({ id: collectionId, name }))} />
            </div>
          </details>

          {dishes.length ? (
            <ol className="flex flex-col divide-y divide-line rounded-2xl border border-line">
              {dishes.map((dish, index) => {
                const inCollections = dishCollections(dish.id);
                return (
                  <li key={dish.id} className="flex flex-col gap-2 p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <a href={`https://www.youtube.com/shorts/${dish.video_id}`} target="_blank" rel="noopener" className="shrink-0" aria-label={`Ver o vídeo de ${dish.name} no YouTube`}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own picture of the video */}
                        <img src={youTubeThumbnail(dish.video_id)} alt="" width={48} height={64} loading="lazy" className="h-16 w-12 rounded-lg bg-surface-2 object-cover" />
                      </a>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text">
                          <span className="tabular-nums text-subtle">{index + 1}.</span> {dish.name}
                        </p>
                        <p className="text-sm text-muted">
                          <strong className="font-semibold text-text">{formatPriceCents(dish.price_cents)}</strong>
                          {" · "}
                          {inCollections.length ? inCollections.join(", ") : "em nenhuma coleção"}
                        </p>
                        {dish.description ? <p className="line-clamp-2 text-sm text-subtle">{dish.description}</p> : null}
                        {/* On a phone the arrows go under the text, which keeps the whole width. */}
                        <MoveButtons action={moveDish} id={dish.id} name={dish.name} first={index === 0} last={index === dishes.length - 1} className="mt-2 flex sm:hidden" />
                      </div>
                      <MoveButtons action={moveDish} id={dish.id} name={dish.name} first={index === 0} last={index === dishes.length - 1} className="hidden sm:flex" />
                    </div>
                    <details className="group">
                      <summary className={summaryClasses}>
                        Editar ou apagar
                        <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="mt-3 flex flex-col gap-4 rounded-2xl bg-surface-2/50 p-3 sm:p-4">
                        <DishForm menuId={menu.id} dish={dish} />
                        <ActionForm action={deleteDish} confirmMessage={`Apagar «${dish.name}»? Sai também de todas as coleções.`} className="border-t border-line pt-3">
                          <input type="hidden" name="id" value={dish.id} />
                          <SubmitButton variant="ghost" size="sm" className="text-danger" pendingLabel="A apagar…">
                            Apagar prato
                          </SubmitButton>
                        </ActionForm>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState>Ainda não há pratos. Cole o link de um Short do YouTube em «Adicionar prato».</EmptyState>
          )}
        </div>
      </Panel>

      <Panel title={`Coleções (${collections.length})`}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">As listas do botão ☰ do menu. A coleção marcada «Abre primeiro» é a que aparece ao abrir; as coleções sem pratos não aparecem.</p>
          <ActionForm action={addCollection} className="flex flex-col gap-3 rounded-2xl border border-line p-3 sm:flex-row sm:flex-wrap sm:items-end sm:p-4">
            <input type="hidden" name="menu_id" value={menu.id} />
            <label className={`${adminLabelClasses} min-w-0 sm:flex-1`}>
              Nova coleção
              <input name="name" required maxLength={60} autoComplete="off" placeholder="Bebidas" className={`${adminInputClasses} h-11`} />
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm text-text">
              <input type="checkbox" name="all_dishes" className="h-4.5 w-4.5 accent-accent" />
              Com todos os pratos
            </label>
            <SubmitButton pendingLabel="A criar…">Criar coleção</SubmitButton>
          </ActionForm>

          {collections.length ? (
            <ol className="flex flex-col gap-3">
              {collections.map((collection, index) => {
                const selected = collectionDishes(collection.id);
                return (
                  <li key={collection.id} className="flex flex-col gap-3 rounded-2xl border border-line p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-semibold text-text">
                          {collection.name}
                          {collection.is_default ? (
                            <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text">Abre primeiro</span>
                          ) : null}
                        </p>
                        <p className="text-sm text-muted">
                          {selected.length} {selected.length === 1 ? "prato" : "pratos"}
                          {selected.length ? "" : " · não aparece no menu"}
                        </p>
                      </div>
                      <MoveButtons action={moveCollection} id={collection.id} name={collection.name} first={index === 0} last={index === collections.length - 1} />
                    </div>
                    <details className="group" open={!selected.length && dishes.length > 0}>
                      <summary className={summaryClasses}>
                        Escolher e ordenar os pratos
                        <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="mt-3">
                        {dishes.length ? (
                          <CollectionDishesEditor collectionId={collection.id} dishes={editorDishes} selected={selected} />
                        ) : (
                          <p className="text-sm text-muted">Adicione primeiro os pratos do menu.</p>
                        )}
                      </div>
                    </details>
                    <details className="group">
                      <summary className={summaryClasses}>
                        Nome, abrir primeiro ou apagar
                        <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-surface-2/50 p-3 sm:p-4">
                        <ActionForm action={renameCollection} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
                          <input type="hidden" name="id" value={collection.id} />
                          <label className={`${adminLabelClasses} min-w-0 sm:flex-1`}>
                            Nome
                            <input name="name" required maxLength={60} autoComplete="off" defaultValue={collection.name} className={`${adminInputClasses} h-10`} />
                          </label>
                          <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…">
                            Guardar nome
                          </SubmitButton>
                        </ActionForm>
                        <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                          {collection.is_default ? null : (
                            <ActionForm action={setDefaultCollection}>
                              <input type="hidden" name="id" value={collection.id} />
                              <SubmitButton variant="secondary" size="sm" pendingLabel="A guardar…">
                                Abrir primeiro
                              </SubmitButton>
                            </ActionForm>
                          )}
                          <ActionForm action={deleteCollection} confirmMessage={`Apagar a coleção «${collection.name}»? Os pratos ficam no menu.`}>
                            <input type="hidden" name="id" value={collection.id} />
                            <SubmitButton variant="ghost" size="sm" className="text-danger" pendingLabel="A apagar…">
                              Apagar coleção
                            </SubmitButton>
                          </ActionForm>
                        </div>
                      </div>
                    </details>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState>Sem coleções, o menu mostra todos os pratos numa lista «Todos».</EmptyState>
          )}
        </div>
      </Panel>

      <Panel title="Apagar menu">
        <ActionForm action={deleteMenu} confirmMessage={`Apagar o menu de «${menu.business_name}», os pratos e as coleções? A página ${publicPath} deixa de abrir.`} className="flex flex-col items-start gap-2">
          <input type="hidden" name="id" value={menu.id} />
          <p className="text-sm text-muted">Apaga o menu, os pratos e as coleções. Os vídeos ficam no YouTube. Para o esconder sem apagar, desligue «Menu ativo».</p>
          <SubmitButton variant="secondary" size="sm" className="text-danger" pendingLabel="A apagar…">
            Apagar menu
          </SubmitButton>
        </ActionForm>
      </Panel>
    </>
  );
}
