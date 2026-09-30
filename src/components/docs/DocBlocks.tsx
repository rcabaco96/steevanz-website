import type { CalloutTone, DocBlock } from "@/content/types";
import { AlertIcon, InfoIcon, LightbulbIcon, PlusIcon } from "@/components/icons";
import { InlineText } from "@/components/ui/InlineText";

const calloutStyles: Record<CalloutTone, { wrapper: string; icon: typeof InfoIcon }> = {
  info: { wrapper: "border-accent/25 bg-accent-soft/60", icon: InfoIcon },
  tip: { wrapper: "border-success/25 bg-success-soft/70", icon: LightbulbIcon },
  warning: { wrapper: "border-gold/40 bg-gold-soft/70", icon: AlertIcon },
};

function DocBlockView({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={block.id} className="display mt-14 scroll-mt-28 text-[1.9rem] text-text first:mt-0">
          <a href={`#${block.id}`} className="no-underline! text-inherit!">
            {block.text}
          </a>
        </h2>
      );
    case "h3":
      return (
        <h3 id={block.id} className="mt-10 scroll-mt-28 text-xl font-semibold text-text">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-5">
          <InlineText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="mt-5 flex flex-col gap-2 pl-5 marker:text-gold [list-style:disc]">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-5 flex list-decimal flex-col gap-2 pl-5 marker:font-mono marker:text-sm marker:text-gold-text">
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      );
    case "steps":
      return (
        <ol className="mt-7 flex flex-col gap-0">
          {block.items.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
              {index < block.items.length - 1 ? (
                <span aria-hidden="true" className="absolute top-10 bottom-0 left-[1.1rem] w-px bg-line-strong" />
              ) : null}
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-sm font-medium text-accent-text">
                {index + 1}
              </span>
              <div className="pt-1">
                <p className="font-semibold text-text">
                  <InlineText text={step.title} />
                </p>
                <p className="mt-1.5">
                  <InlineText text={step.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "callout": {
      const style = calloutStyles[block.tone];
      const Icon = style.icon;
      return (
        <aside className={`mt-7 flex gap-4 rounded-2xl border p-5 text-[0.98rem] ${style.wrapper}`}>
          <Icon size={20} className="mt-1 shrink-0 text-text" />
          <div>
            {block.title ? <p className="font-semibold text-text">{block.title}</p> : null}
            <p className={block.title ? "mt-1" : ""}>
              <InlineText text={block.text} />
            </p>
          </div>
        </aside>
      );
    }
    case "code":
      return (
        <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-[#1d1220] text-[#f6efe6]">
          {block.label ? (
            <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-xs text-[#e9c685]">{block.label}</figcaption>
          ) : null}
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
            <code className="border-0! bg-transparent! p-0! text-inherit!">{block.code}</code>
          </pre>
        </figure>
      );
    case "table":
      return (
        <div className="mt-7 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[32rem] border-collapse text-left text-[0.95rem]">
            <thead className="bg-surface-2 text-text">
              <tr>
                {block.head.map((heading) => (
                  <th key={heading} scope="col" className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-line">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 align-top">
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div className="mt-6 divide-y divide-line border-y border-line">
          {block.items.map((item) => (
            <details key={item.q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-text">
                {item.q}
                <PlusIcon size={16} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-5">
                <InlineText text={item.a} />
              </p>
            </details>
          ))}
        </div>
      );
  }
}

export function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="prose-doc">
      {blocks.map((block, index) => (
        <DocBlockView key={index} block={block} />
      ))}
    </div>
  );
}
