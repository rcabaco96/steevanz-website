"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { fill, plural, type PlatibandaCopy } from "@/content/platibanda/copy";
import { platibandaPhotos } from "@/content/platibanda/facts";
import {
  defaultFilters,
  deals,
  filterListings,
  kinds,
  listingPrice,
  listings,
  priceSteps,
  zones,
  type Deal,
  type Kind,
  type Listing,
  type ListingFilters,
  type ZoneId,
} from "@/content/platibanda/listings";
import { platibandaListingHref, type PlatibandaMode } from "@/content/platibanda/routes";
import { AreaIcon, ArrowIcon, BathIcon, BedIcon } from "./icons";
import { platibandaSections } from "./sections";
import { SplitText } from "./react-bits/SplitText";

const barraColour: Record<Listing["barra"], string> = {
  ocre: "var(--color-ocre)",
  telha: "var(--color-telha)",
  anil: "var(--color-anil)",
  sal: "var(--color-sal)",
};

const usedZones = (Object.keys(zones) as ZoneId[]).filter((z) => listings.some((l) => l.zone === z));
const euros = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;

// The listings with their filters: deal (buy, rent, holidays), type of house, area, bedrooms and a price ceiling that
// follows the deal chosen. Everything is on the page already, so the results change at once (no loading state to
// show); each card fades in. Each card opens the property's own page.
export function Listings({ copy, mode }: { copy: PlatibandaCopy; mode: PlatibandaMode }) {
  const t = copy.listings;
  const [f, setF] = useState<ListingFilters>(defaultFilters);
  const results = useMemo(() => filterListings(listings, f), [f]);
  const id = useId();
  const set = (patch: Partial<ListingFilters>) => setF((prev) => ({ ...prev, ...patch }));
  const changed = JSON.stringify(f) !== JSON.stringify(defaultFilters);
  const field = "pb-select h-12 w-full rounded-xl border border-ria/15 bg-cal pl-4 text-[0.95rem] text-ria transition-colors hover:border-ria/40 disabled:cursor-not-allowed disabled:opacity-45";

  return (
    <section id={platibandaSections.listings} aria-labelledby="pb-listings-title" className="relative bg-cal py-24 sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="pb-label mb-4 flex items-center gap-3 text-ocre-deep">
          <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
          {t.eyebrow}
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="pb-listings-title" className="font-display text-[clamp(2.2rem,7.5vw,4.6rem)] leading-[0.98] text-ria">
            <SplitText text={t.title} splitType="words" delay={60} /> <span className="text-telha">{t.titleItalic}</span>
          </h2>
          <p className="max-w-md leading-relaxed text-pedra">{t.intro}</p>
        </div>

        <form
          aria-label={t.filtersLabel}
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 rounded-[1.6rem] bg-areia p-4 sm:p-6"
        >
          <fieldset>
            <legend className="pb-label mb-3 text-ria/80">{t.deal}</legend>
            <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4">
              {(["todos", ...(Object.keys(deals) as Deal[])] as const).map((d) => {
                const active = f.deal === d;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set({ deal: d, maxPrice: null })}
                    className={`h-12 rounded-xl px-3 text-[0.95rem] font-semibold transition-colors ${
                      active ? "bg-ria text-cal" : "bg-cal text-ria ring-1 ring-ria/15 hover:ring-ria/40"
                    }`}
                  >
                    {d === "todos" ? t.all : deals[d].filter}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor={`${id}-kind`} className="pb-label mb-2 block text-ria/80">
                {t.kind}
              </label>
              <select id={`${id}-kind`} className={field} value={f.kind} onChange={(e) => set({ kind: e.target.value as Kind | "todos" })}>
                <option value="todos">{t.kindAll}</option>
                {(Object.keys(kinds) as Kind[]).map((k) => (
                  <option key={k} value={k}>
                    {kinds[k]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-zone`} className="pb-label mb-2 block text-ria/80">
                {t.zone}
              </label>
              <select id={`${id}-zone`} className={field} value={f.zone} onChange={(e) => set({ zone: e.target.value as ZoneId | "todas" })}>
                <option value="todas">{t.zoneAll}</option>
                {usedZones.map((z) => (
                  <option key={z} value={z}>
                    {zones[z]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-bed`} className="pb-label mb-2 block text-ria/80">
                {t.bedrooms}
              </label>
              <select id={`${id}-bed`} className={field} value={f.bedrooms} onChange={(e) => set({ bedrooms: Number(e.target.value) })}>
                <option value={0}>{t.bedroomsAny}</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {fill(t.bedroomsMin, { n })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-price`} className="pb-label mb-2 block text-ria/80">
                {t.price}
              </label>
              <select
                id={`${id}-price`}
                className={field}
                value={f.maxPrice ?? ""}
                disabled={f.deal === "todos"}
                aria-describedby={f.deal === "todos" ? `${id}-price-hint` : undefined}
                onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">{t.priceAny}</option>
                {f.deal !== "todos"
                  ? priceSteps[f.deal].map((p) => (
                      <option key={p} value={p}>
                        {euros(p)}
                        {deals[f.deal as Deal].unit}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          </div>
          {f.deal === "todos" ? (
            <p id={`${id}-price-hint`} className="mt-3 text-sm text-pedra">
              {t.priceHint}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ria/10 pt-4">
            <p aria-live="polite" className="font-display text-xl text-ria">
              {plural(t.count, results.length)}
            </p>
            {changed ? (
              <button type="button" onClick={() => setF(defaultFilters)} className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-telha underline decoration-telha/40 underline-offset-4 hover:decoration-telha">
                {t.clear}
              </button>
            ) : null}
          </div>
        </form>

        {results.length === 0 ? (
          <div className="mt-10 rounded-[1.6rem] border border-dashed border-ria/25 px-6 py-12 text-center">
            <p className="text-pedra">{t.empty}</p>
            <button type="button" onClick={() => setF(defaultFilters)} className="mt-5 inline-flex h-12 items-center rounded-full bg-ria px-6 font-semibold text-cal">
              {t.clear}
            </button>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((l) => {
                const cover = platibandaPhotos[l.photos[0].id];
                return (
                  <m.li
                    key={l.slug}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={platibandaListingHref(mode, l.slug)} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-areia">
                        <Image
                          src={cover.src}
                          alt={l.photos[0].alt}
                          width={cover.width}
                          height={cover.height}
                          sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cal)] group-hover:scale-[1.05]"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-[1.2rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          style={{ boxShadow: `inset 0 0 0 10px ${barraColour[l.barra]}` }}
                        />
                        <span className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="pb-label rounded-full bg-cal px-2.5 py-1 text-[0.62rem] text-ria">{deals[l.deal].label}</span>
                          <span className="rounded-full bg-ria/80 px-2.5 py-1 text-[0.68rem] font-medium text-cal backdrop-blur-sm">{copy.fictionalListing}</span>
                        </span>
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-pedra">
                            {zones[l.zone]} · {l.spot}
                          </p>
                          <h3 className="mt-1 font-display text-[1.4rem] leading-tight text-ria">{l.title}</h3>
                        </div>
                        <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-ria/20 transition-colors group-hover:bg-ria group-hover:text-cal">
                          <ArrowIcon width={18} height={18} />
                          <span className="sr-only">{t.open}</span>
                        </span>
                      </div>
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-pedra">
                        <li className="inline-flex items-center gap-1.5">
                          <BedIcon width={17} height={17} /> {l.typology} · {plural(t.bedroomsShort, l.bedrooms)}
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                          <BathIcon width={17} height={17} /> {l.bathrooms}
                          <span className="sr-only">{plural(t.bathroomsShort, l.bathrooms)}</span>
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                          <AreaIcon width={16} height={16} /> {l.area} {t.area}
                        </li>
                      </ul>
                      <p className="mt-3 text-[1.15rem] font-semibold text-ria">{listingPrice(l)}</p>
                    </Link>
                  </m.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
        <p className="mt-12 text-sm text-pedra">{t.note}</p>
      </div>
    </section>
  );
}
