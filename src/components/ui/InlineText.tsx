import Link from "next/link";
import type { ReactNode } from "react";

const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function InlineText({ text }: { text: string }) {
  const parts = text.split(tokenPattern).filter(Boolean);
  const nodes: ReactNode[] = parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, target] = link;
      if (target.startsWith("/")) {
        return (
          <Link key={index} href={target}>
            {label}
          </Link>
        );
      }
      return (
        <a key={index} href={target} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    return part;
  });
  return <>{nodes}</>;
}
