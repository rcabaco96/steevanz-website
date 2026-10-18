import type { CSSProperties } from "react";
import { brandLine } from "@/content/home-ultra/shared";
import { SplitText } from "./Section";
import s from "./ultra.module.css";

// The brand pieces. The brand line is ALWAYS the two lines together (owner rule, 2026-10-18):
// «Tecnologia do futuro.» / «Com os bons modos de antigamente.»

/**
 * The two-line brand line. Line 1 roman near-black (or cream), line 2 route italic in plum (or gold).
 * `as="h1"` makes it the hero title; `reveal="now"` runs the pure-CSS word rise before hydration.
 */
export function BrandLine({
  as: Tag = "p",
  tone = "ink",
  reveal = false,
  goldDot = true,
  className = "",
  lineClassName = "",
  style,
}: {
  as?: "h1" | "h2" | "p";
  tone?: "ink" | "cream";
  /** "now" = CSS word rise on load; "mask" = rise when scrolled into view; false = static. */
  reveal?: "now" | "mask" | false;
  /** The final full stop of line 2 becomes the brand's gold dot. */
  goldDot?: boolean;
  className?: string;
  /** Applied to each of the two line spans (display: block). */
  lineClassName?: string;
  style?: CSSProperties;
}) {
  const [first, second] = brandLine;
  return (
    <Tag
      className={`${reveal === "now" ? s.riseNow : ""} ${tone === "cream" ? s.cream : ""} ${className}`}
      data-hu-reveal={reveal === "mask" ? "mask" : undefined}
      style={style}
    >
      <span className={s.srOnly}>{`${first} ${second}`}</span>
      <span className={lineClassName} style={{ display: "block" }}>
        <SplitText text={first} />
      </span>
      <span className={lineClassName} style={{ display: "block" }}>
        <SplitText
          text={`*${goldDot ? second.slice(0, -1) : second}*${goldDot ? "." : ""}`}
          accentTone={tone === "cream" ? "gold" : "plum"}
          goldDot={goldDot}
          startIndex={first.split(" ").length}
        />
      </span>
    </Tag>
  );
}

/** «Steevanz» with the gold dot. size "xl" = the giant footer wordmark (per-letter mask with reveal). */
export function Wordmark({
  size = "inline",
  reveal = false,
  className = "",
}: {
  size?: "inline" | "xl";
  reveal?: "letters" | false;
  className?: string;
}) {
  if (size === "xl") {
    return (
      <span
        className={`${s.wordmarkXl} ${className}`}
        data-hu-reveal={reveal || undefined}
        style={{ "--hu-stagger": "40ms", "--hu-cap": 99, display: "block" } as CSSProperties}
      >
        <span className={s.srOnly}>Steevanz.</span>
        <SplitText text="Steevanz." by="letter" goldDot />
      </span>
    );
  }
  return (
    <span className={className} style={{ fontFamily: "var(--hu-display)", fontWeight: 500 }}>
      Steevanz<span className={s.goldDot}>.</span>
    </span>
  );
}
