import Link from "next/link";
import type { EstablishmentRow } from "@/lib/establishments/types";

export type ModuleQuery = Record<string, string | string[] | undefined>;

export function queryValue(query: ModuleQuery | undefined, key: string): string {
  const value = query?.[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** The establishment picked with ?loja=, else the first one. */
export function pickEstablishment(establishments: EstablishmentRow[], query: ModuleQuery | undefined): EstablishmentRow | null {
  const slug = queryValue(query, "loja");
  return establishments.find((item) => item.slug === slug) ?? establishments[0] ?? null;
}

function href(basePath: string, params: Record<string, string>) {
  const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString();
  return search ? `${basePath}?${search}` : basePath;
}

export interface ModuleView {
  id: string;
  label: string;
}

/** Establishment switcher (when there are several) and the module's views as tabs. */
export function ModuleNav({
  basePath,
  establishments,
  current,
  views,
  view,
}: {
  basePath: string;
  establishments: EstablishmentRow[];
  current: EstablishmentRow;
  views: ModuleView[];
  view: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {establishments.length > 1 ? (
        <nav aria-label="Loja" className="flex flex-wrap gap-2">
          {establishments.map((item) => (
            <Link
              key={item.id}
              href={href(basePath, { loja: item.slug, vista: view })}
              aria-current={item.id === current.id ? "page" : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                item.id === current.id ? "border-transparent bg-surface-inverse text-inverse" : "border-line text-muted hover:text-text"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      ) : null}
      <nav aria-label="Secções do módulo" className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1 [scrollbar-width:none]">
        {views.map((item) => (
          <Link
            key={item.id}
            href={href(basePath, { loja: establishments.length > 1 ? current.slug : "", vista: item.id === views[0].id ? "" : item.id })}
            aria-current={item.id === view ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              item.id === view ? "border-accent text-text" : "border-transparent text-muted hover:text-text"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function pickView(query: ModuleQuery | undefined, views: ModuleView[]): string {
  const requested = queryValue(query, "vista");
  return views.some((item) => item.id === requested) ? requested : views[0].id;
}
