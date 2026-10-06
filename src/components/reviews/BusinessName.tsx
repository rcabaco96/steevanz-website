import { ArrowUpRight } from "@/components/icons";

/** The panel's title: the business name, which opens its profile on Google Maps in a new tab. */
export function BusinessName({ name, mapsUrl }: { name: string; mapsUrl: string | null }) {
  if (!mapsUrl) return <h1 className="display text-[2.2rem] leading-tight sm:text-5xl">{name}</h1>;
  return (
    <h1 className="display text-[2.2rem] leading-tight sm:text-5xl">
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="group decoration-2 underline-offset-[0.15em] hover:underline">
        {name}
        <ArrowUpRight size={22} className="ml-1.5 inline-block align-[0.1em] text-subtle transition-colors group-hover:text-accent-text" />
        <span className="sr-only"> (abre no Google Maps)</span>
      </a>
    </h1>
  );
}
