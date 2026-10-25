import Link from "next/link";
import { oQuintalPreviewBase } from "@/content/o-quintal/routes";
import { Leaf } from "./Logo";

export function QuintalNotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-kraft px-4 text-center">
      <div>
        <Leaf className="mx-auto h-14 w-14 text-folha" />
        <h1 className="mt-6 font-display text-[clamp(2.2rem,8vw,3.6rem)] text-ardosia">Esta página não está na banca.</h1>
        <Link href={oQuintalPreviewBase} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-folha px-6 font-semibold text-giz">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
