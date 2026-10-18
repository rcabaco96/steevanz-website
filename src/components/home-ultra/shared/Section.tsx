import type { CSSProperties, ReactNode } from "react";
import s from "./ultra.module.css";

// Section shell, heading pattern and word/letter masks for /novo-ultra.
// Design rule from the spec: NO eyebrow/kicker labels above headings, no section numbers (except the
// process steps). So SectionHeading has a title (with one *accent* word), an optional lead, and nothing above.

/* ---------- Section ---------- */

export type SectionTone = "page" | "soft" | "plum" | "plumDeep";

export function Section({
  id,
  tone = "page",
  band = false,
  tight = false,
  container = true,
  labelledBy,
  className = "",
  containerClassName = "",
  style,
  children,
}: {
  id?: string;
  /** page = --bg; soft = --bg-soft; plum/plumDeep = brand colour (use with band). */
  tone?: SectionTone;
  /** Inset rounded colour block (8px side inset on phones, radius 1.75rem → 2.25rem). */
  band?: boolean;
  /** Half the vertical padding (clients strip, manifesto). */
  tight?: boolean;
  /** Wrap children in the 76rem page container. */
  container?: boolean;
  labelledBy?: string;
  className?: string;
  containerClassName?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const toneClass =
    tone === "soft" ? s.toneSoft : tone === "plum" ? s.tonePlum : tone === "plumDeep" ? s.tonePlumDeep : "";
  const plum = tone === "plum" || tone === "plumDeep";
  const inner = container ? <div className={`${s.container} ${containerClassName}`}>{children}</div> : children;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tight={tight ? "" : undefined}
      style={style}
      className={`${s.section} ${band ? s.band : ""} ${toneClass} ${plum ? `${s.onPlum} ${s.cream}` : ""} ${className}`}
    >
      {inner}
    </section>
  );
}

/* ---------- SplitText: word or letter masks ---------- */

/** Parses "O que quer *melhorar*?" into parts; the *starred* part is the accent. */
export function parseAccent(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false }));
}

/** Plain text without the accent markers (for sr-only copies and aria-labels). */
export function plainText(text: string): string {
  return text.replace(/\*/g, "");
}

/**
 * Renders `text` as masked words (or letters) for the rise animation. aria-hidden: always pair it with
 * an sr-only copy (SectionHeading does). Accent part → route italic in plum (or gold with accentTone).
 * A trailing "." can become the brand's gold dot with `goldDot`.
 */
export function SplitText({
  text,
  by = "word",
  accentTone = "plum",
  goldDot = false,
  startIndex = 0,
}: {
  text: string;
  by?: "word" | "letter";
  accentTone?: "plum" | "gold";
  goldDot?: boolean;
  startIndex?: number;
}) {
  let i = startIndex;
  let parts = parseAccent(text);
  let dot = false;
  if (goldDot) {
    const last = parts[parts.length - 1];
    if (last && last.text.endsWith(".")) {
      parts = [...parts.slice(0, -1), { ...last, text: last.text.slice(0, -1) }];
      dot = true;
    }
  }
  const accentClass = `${s.accent} ${accentTone === "gold" ? s.accentGold : ""}`;
  return (
    <span aria-hidden="true">
      {parts.map((part, p) => {
        const tokens = by === "letter" ? Array.from(part.text) : part.text.split(/(\s+)/);
        return (
          <span key={p} className={part.accent ? accentClass : undefined}>
            {tokens.map((token, t) => {
              if (token === "" ) return null;
              if (/^\s+$/.test(token)) return " ";
              const index = i++;
              return (
                <span key={t} className={s.word}>
                  <span className={s.wordIn} style={{ "--i": index } as CSSProperties}>
                    {token}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
      {dot ? <span className={`${s.goldDot} ${s.dotPop}`}>.</span> : null}
    </span>
  );
}

/* ---------- SectionHeading ---------- */

export function SectionHeading({
  title,
  as = "h2",
  size = as === "h1" ? "h1" : as === "h3" ? "h3" : "h2",
  id,
  lead,
  align = "start",
  accentTone = "plum",
  goldDot = false,
  reveal = "mask",
  className = "",
  titleClassName = "",
}: {
  /** One *accent* word at most, e.g. "O que quer *melhorar*?". */
  title: string;
  as?: "h1" | "h2" | "h3";
  size?: "h1" | "h2" | "h3" | "manifesto";
  /** Put the id on the heading and pass it to Section labelledBy. */
  id?: string;
  lead?: ReactNode;
  align?: "start" | "center";
  /** "gold" on the plum bands. */
  accentTone?: "plum" | "gold";
  goldDot?: boolean;
  /** "mask" = per-word rise on scroll (RevealRoot); "now" = pure CSS on load (hero); false = static. */
  reveal?: "mask" | "now" | false;
  className?: string;
  titleClassName?: string;
}) {
  const Tag = as;
  const sizeClass = size === "h1" ? s.h1 : size === "h3" ? s.h3 : size === "manifesto" ? s.manifesto : s.h2;
  return (
    <div className={`${s.heading} ${align === "center" ? s.headingCenter : ""} ${className}`}>
      <Tag
        id={id}
        className={`${sizeClass} ${reveal === "now" ? s.riseNow : ""} ${titleClassName}`}
        data-hu-reveal={reveal === "mask" ? "mask" : undefined}
      >
        <span className={s.srOnly}>{plainText(title)}</span>
        <SplitText text={title} accentTone={accentTone} goldDot={goldDot} />
      </Tag>
      {lead ? <p className={s.lead}>{lead}</p> : null}
    </div>
  );
}
