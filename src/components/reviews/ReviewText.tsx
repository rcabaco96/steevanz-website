"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "@/components/icons";

export function ReviewText({ text }: { text: string | null }) {
  const id = useId();
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || expanded) return;
    const measure = () => setClamped(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded, text]);

  if (!text) return <p className="text-[0.95rem] text-subtle italic">Review sem texto.</p>;

  return (
    <div className="flex flex-col items-start gap-1">
      <p id={id} ref={ref} className={`text-[0.95rem] leading-relaxed whitespace-pre-line text-text ${expanded ? "" : "line-clamp-4"}`}>
        {text}
      </p>
      {clamped || expanded ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-accent-text hover:underline"
        >
          {expanded ? "Mostrar menos" : "Ler review completa"}
          <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      ) : null}
    </div>
  );
}
