import Image from "next/image";
import Link from "next/link";
import { fill, plural, platibandaCopy } from "@/content/platibanda/copy";
import { platibandaPhotos } from "@/content/platibanda/facts";
import { deals, kinds, listingPrice, listings, zones, type Listing } from "@/content/platibanda/listings";
import { platibandaHref, platibandaListingHref, type PlatibandaMode } from "@/content/platibanda/routes";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { AreaIcon, ArrowIcon, ArrowLeftIcon, BathIcon, BedIcon, ChatIcon, KeyIcon } from "./icons";
import { MotionRoot } from "./MotionRoot";
import { Reveal } from "./Reveal";
import { platibandaSections } from "./sections";
import { SmoothScroll } from "./SmoothScroll";
import { VisitForm } from "./VisitForm";

// One property's own page: title and price, the gallery (opening out of a house front), what the house has, the
// visit request (WhatsApp with the reference written in) and three other houses. Phones: heading and price, the
// photos, a button down to the request, then the details. Every listing is fictional and says so.
export function ListingPage({ mode, listing }: { mode: PlatibandaMode; listing: Listing }) {
  const copy = platibandaCopy;
  const t = copy.listing;
  const home = platibandaHref(mode);
  const others = [...listings.filter((l) => l.slug !== listing.slug && l.deal === listing.deal), ...listings.filter((l) => l.deal !== listing.deal)].slice(0, 3);
  const facts: [string, string][] = [
    [t.ref, listing.ref],
    [t.deal, deals[listing.deal].label],
    [t.kind, kinds[listing.kind]],
    [t.typology, listing.typology],
    [t.area, `${listing.area} m²`],
    ...(listing.plot ? ([[t.plot, `${listing.plot} m²`]] as [string, string][]) : []),
    [t.bedrooms, String(listing.bedrooms)],
    [t.bathrooms, String(listing.bathrooms)],
    ...(listing.guests ? ([[t.guests, String(listing.guests)]] as [string, string][]) : []),
    ...(listing.minNights ? ([[t.minNights, fill(t.nights, { n: listing.minNights })]] as [string, string][]) : []),
    [t.energy, t.energyPlaceholder],
    [t.zone, `${zones[listing.zone]} · ${listing.spot}`],
  ];

  return (
    <MotionRoot>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cal px-5 py-3 font-semibold text-ria transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={home} onHome={false} />
      <main id="conteudo" tabIndex={-1} className="relative bg-cal pt-24 pb-24 outline-none sm:pt-28">
        <div aria-hidden="true" className="pb-grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
          <a href={`${home}#${platibandaSections.listings}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ria hover:text-telha">
            <ArrowLeftIcon width={17} height={17} />
            {t.back}
          </a>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex flex-wrap items-center gap-2">
                <span className="pb-label rounded-full bg-ria px-3 py-1 text-[0.65rem] text-cal">{deals[listing.deal].label}</span>
                <span className="rounded-full bg-sal px-3 py-1 text-xs font-semibold text-ria">{copy.fictionalListing}</span>
              </p>
              <h1 className="mt-4 max-w-[20ch] font-display text-[clamp(2.1rem,6.5vw,4rem)] leading-[1.02] text-ria">{listing.title}</h1>
              <p className="mt-3 text-pedra">
                {zones[listing.zone]} · {listing.spot}
              </p>
            </div>
            <div className="lg:text-right">
              <p className="pb-label text-ocre-deep">{t.price}</p>
              <p className="mt-1 font-display text-[clamp(2rem,6vw,3.2rem)] leading-none text-ria">{listingPrice(listing)}</p>
              <p className="mt-2 text-xs text-pedra">{t.shareNote}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-14">
            <div className="min-w-0">
              <Gallery photos={listing.photos} labels={t} />
              <p className="mt-2 text-xs text-pedra">{copy.photosNote}</p>

              <a
                href="#pedir-visita"
                className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-telha px-6 font-semibold text-cal transition-colors hover:bg-telha-deep lg:hidden"
              >
                <ChatIcon width={18} height={18} />
                {listing.deal === "ferias" ? t.visit.holidayTitle : t.visit.title}
              </a>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-ria">
                <li className="inline-flex items-center gap-2">
                  <BedIcon /> {plural(copy.listings.bedroomsShort, listing.bedrooms)}
                </li>
                <li className="inline-flex items-center gap-2">
                  <BathIcon /> {plural(copy.listings.bathroomsShort, listing.bathrooms)}
                </li>
                <li className="inline-flex items-center gap-2">
                  <AreaIcon /> {listing.area} m²
                </li>
              </ul>

              <section aria-labelledby="pb-about" className="mt-10">
                <h2 id="pb-about" className="font-display text-[1.9rem] text-ria">
                  {t.about}
                </h2>
                <p className="mt-3 text-[1.08rem] leading-relaxed font-medium text-ria">{listing.lead}</p>
                {listing.description.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-4 max-w-2xl leading-relaxed text-tinta/85">
                    {p}
                  </p>
                ))}
                {listing.deal === "ferias" ? (
                  <p className="mt-6 flex max-w-2xl items-start gap-3 rounded-2xl bg-areia px-5 py-4 text-[0.95rem] leading-relaxed text-ria">
                    <KeyIcon className="mt-0.5 shrink-0 text-telha" />
                    {t.guide}
                  </p>
                ) : null}
              </section>

              <section aria-labelledby="pb-features" className="mt-10">
                <h2 id="pb-features" className="font-display text-[1.9rem] text-ria">
                  {t.features}
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {listing.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-2.5 block h-[3px] w-4 shrink-0 bg-ocre" />
                      {f}
                    </li>
                  ))}
                </ul>
                <dl className="mt-8 grid grid-cols-1 border-t border-ria/12 min-[420px]:grid-cols-2">
                  {facts.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 border-b border-ria/12 py-3 min-[420px]:pr-6">
                      <dt className="text-sm text-pedra">{k}</dt>
                      <dd className="text-right font-semibold text-ria">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            <div>
              <div className="lg:sticky lg:top-24">
                <VisitForm listing={listing} copy={copy} />
              </div>
            </div>
          </div>

          <section aria-labelledby="pb-more" className="mt-24">
            <h2 id="pb-more" className="font-display text-[clamp(1.9rem,5vw,3rem)] text-ria">
              {t.more}
            </h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((l, i) => {
                const cover = platibandaPhotos[l.photos[0].id];
                return (
                  <li key={l.slug}>
                    <Reveal delay={i * 90}>
                      <Link href={platibandaListingHref(mode, l.slug)} className="group block">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-areia">
                          <Image
                            src={cover.src}
                            alt={l.photos[0].alt}
                            width={cover.width}
                            height={cover.height}
                            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                          <span className="absolute top-3 left-3 rounded-full bg-ria/80 px-2.5 py-1 text-[0.68rem] font-medium text-cal">{copy.fictionalListing}</span>
                        </div>
                        <div className="mt-4 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-pedra">{zones[l.zone]}</p>
                            <h3 className="font-display text-[1.3rem] leading-tight text-ria">{l.title}</h3>
                            <p className="mt-2 font-semibold text-ria">{listingPrice(l)}</p>
                            <p className="mt-1 text-xs text-pedra">
                              {t.energy}: {t.energyPlaceholder}
                            </p>
                          </div>
                          <span className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-ria/20 group-hover:bg-ria group-hover:text-cal">
                            <ArrowIcon width={18} height={18} />
                            <span className="sr-only">{copy.listings.open}</span>
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
    </MotionRoot>
  );
}
