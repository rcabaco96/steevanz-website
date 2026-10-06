import { ProductGlyph } from "@/components/icons";
import { getProduct } from "@/content/products";
import type { ModuleProps } from "./registry";

export function ModulePlaceholder({ productId, viewer }: ModuleProps) {
  return (
    <section className="card flex flex-col items-start gap-4 p-6 sm:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent-text">
        <ProductGlyph icon={getProduct(productId).icon} size={22} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold text-text">Módulo em preparação</h2>
        <p className="max-w-prose text-muted">
          {viewer === "admin"
            ? "A área de gestão deste produto ainda não foi construída. Quando estiver pronta, aparece aqui para o cliente e para a equipa."
            : "Estamos a preparar a área de gestão deste produto. Entretanto, a nossa equipa trata de tudo por si — fale connosco se precisar de alguma alteração."}
        </p>
      </div>
    </section>
  );
}
