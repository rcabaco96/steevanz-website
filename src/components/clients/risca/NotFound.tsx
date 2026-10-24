import { riscaCopy } from "@/content/risca/copy";
import { riscaPreviewBase } from "@/content/risca/routes";
import { Wordmark } from "./Logo";

export function RiscaNotFound() {
  const { notFound } = riscaCopy;
  return (
    <main className="rc-on-dark flex min-h-svh flex-col items-center justify-center gap-8 bg-tinta px-6 text-center text-gesso">
      <Wordmark id="rc-mark-404" className="w-48" />
      <h1 className="rc-display max-w-[14ch] text-[clamp(2.6rem,10vw,5rem)]">{notFound.title}</h1>
      <p className="max-w-sm text-gesso/70">{notFound.text}</p>
      <a href={riscaPreviewBase} className="rc-slant inline-flex h-12 items-center bg-vermelhao pr-9 pl-6 text-[0.8rem] font-bold tracking-[0.14em] text-tinta uppercase">
        {notFound.home}
      </a>
    </main>
  );
}
