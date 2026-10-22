import { loboCopy } from "@/content/lobo-do-mar/copy";
import { loboPreviewBase } from "@/content/lobo-do-mar/routes";
import { Badge } from "./Logo";

// A page that doesn't exist, in the restaurant's colours (Portuguese: the not-found page has no language).
export function LoboNotFound() {
  const copy = loboCopy.pt;
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-abismo px-6 text-center text-areia">
      <Badge className="w-32 rounded-full bg-white p-1" />
      <h1 className="font-display text-3xl sm:text-5xl">{copy.notFound.title}</h1>
      <p className="max-w-md text-areia/80">{copy.notFound.text}</p>
      <a href={loboPreviewBase} className="inline-flex h-12 items-center rounded-full bg-coral px-6 text-sm font-bold tracking-[0.14em] text-white uppercase">
        {copy.notFound.back}
      </a>
    </main>
  );
}
