import type { FaqItem } from "@/content/types";
import { PlusIcon } from "@/components/icons";
import { InlineText } from "./InlineText";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 text-left text-lg font-semibold tracking-[-0.01em] text-text transition-colors hover:text-accent-text">
            <span>{item.q}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform duration-300 group-open:rotate-45">
              <PlusIcon size={16} />
            </span>
          </summary>
          <div className="prose-doc pb-6 pr-12 text-base">
            <p>
              <InlineText text={item.a} />
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
