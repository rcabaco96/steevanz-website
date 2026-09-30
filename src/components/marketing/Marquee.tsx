export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul className="flex w-max animate-marquee gap-10 motion-reduce:animate-none" aria-hidden="true">
        {loop.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-center gap-10 font-display text-2xl whitespace-nowrap text-subtle italic">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </li>
        ))}
      </ul>
      <p className="sr-only">{items.join(", ")}</p>
    </div>
  );
}
