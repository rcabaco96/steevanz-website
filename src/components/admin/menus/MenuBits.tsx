import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import Link from "next/link";
import { EmptyState } from "@/components/backoffice/ui";
import { ArrowUpRight } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";
import { menuPublicPath } from "@/lib/video-menus/rules";
import type { AdminMenuListItem } from "@/lib/video-menus/store";

type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

// Small pieces shared by the admin pages of the video menus.

/** Shown instead of the list while the database doesn't have this feature's tables. */
export function MenusNotReady() {
  return (
    <EmptyState>
      A base de dados ainda não tem as tabelas dos menus em vídeo. Falta aplicar a migração <code className="font-mono text-xs">20261015120000_video_menus.sql</code>.
    </EmptyState>
  );
}

/** Active and with dishes: the public page opens. Otherwise it gives «página não encontrada». */
export function MenuStateBadge({ active, empty }: { active: boolean; empty: boolean }) {
  const [label, tone] = !active
    ? ["Inativo", "bg-surface-2 text-subtle border-line"]
    : empty
      ? ["Sem pratos", "bg-gold-soft text-gold-text border-gold/40"]
      : ["Ativo", "bg-success-soft text-success border-success/30"];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tone}`}>{label}</span>;
}

const moveClasses = "h-9 w-9 shrink-0 px-0";

/** ↑ and ↓ for a dish or a collection (each a small form, so they work without JavaScript too). */
export function MoveButtons({ action, id, name, first, last, className = "flex" }: { action: FormAction; id: string; name: string; first: boolean; last: boolean; className?: string }) {
  return (
    <span className={`shrink-0 gap-1 ${className}`}>
      {(["up", "down"] as const).map((direction) =>
        (direction === "up" ? first : last) ? (
          <button key={direction} type="button" disabled aria-hidden="true" tabIndex={-1} className={buttonClasses("secondary", "sm", moveClasses)}>
            {direction === "up" ? "↑" : "↓"}
          </button>
        ) : (
          <ActionForm key={direction} action={action} hideMessage className="contents">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value={direction} />
            <SubmitButton variant="secondary" size="sm" className={moveClasses} ariaLabel={`${direction === "up" ? "Subir" : "Descer"} ${name}`}>
              {direction === "up" ? "↑" : "↓"}
            </SubmitButton>
          </ActionForm>
        ),
      )}
    </span>
  );
}

/** The list of menus: name, address, dishes and collections, state, edit and open links. */
export function MenuList({ menus }: { menus: AdminMenuListItem[] }) {
  return (
    <ul className="card divide-y divide-line overflow-hidden">
      {menus.map((menu) => (
        <li key={menu.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
          <Link href={`/admin/menus/${menu.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
            {menu.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- any address the menu itself shows
              <img src={menu.logo_url} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full border border-line bg-white object-cover" />
            ) : (
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-text">
                {menu.business_name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate font-semibold text-text group-hover:underline">{menu.business_name}</span>
              <span className="block truncate text-sm text-muted">{menuPublicPath(menu.slug)}</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>
              <strong className="font-semibold tabular-nums text-text">{menu.dishCount}</strong> {menu.dishCount === 1 ? "prato" : "pratos"}
              {" · "}
              <strong className="font-semibold tabular-nums text-text">{menu.collectionCount}</strong> {menu.collectionCount === 1 ? "coleção" : "coleções"}
            </span>
            <MenuStateBadge active={menu.active} empty={menu.dishCount === 0} />
            <span className="flex items-center gap-3">
              <Link href={`/admin/menus/${menu.id}`} className="font-semibold text-text hover:underline">
                Editar
              </Link>
              <a href={menuPublicPath(menu.slug)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-accent-text hover:underline">
                Ver menu <ArrowUpRight size={15} />
              </a>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
