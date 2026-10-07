import Link from "next/link";
import { ProductGlyph } from "@/components/icons";
import { getProduct } from "@/content/products";
import type { ProductId } from "@/content/types";

/** The product is active but the Steevanz team hasn't created the establishment yet. */
export function NoEstablishment({ productId, viewer, ownerId }: { productId: ProductId; viewer: "client" | "admin"; ownerId: string }) {
  return (
    <section className="card flex flex-col items-start gap-4 p-6 sm:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent-text">
        <ProductGlyph icon={getProduct(productId).icon} size={22} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold text-text">Falta criar o estabelecimento</h2>
        <p className="max-w-prose text-muted">
          {viewer === "admin"
            ? "Este cliente ainda não tem estabelecimentos. Crie o primeiro na ficha do cliente (nome e tipo de negócio); o módulo fica pronto a configurar."
            : "A nossa equipa está a preparar a sua loja. Assim que estiver pronta, a gestão aparece aqui. Se precisar de alguma coisa, fale connosco."}
        </p>
      </div>
      {viewer === "admin" ? (
        <Link href={`/admin/clientes/${ownerId}#estabelecimentos`} className="text-sm font-semibold text-accent-text hover:underline">
          Ir para a ficha do cliente
        </Link>
      ) : null}
    </section>
  );
}
