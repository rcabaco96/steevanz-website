import type { CSSProperties } from "react";
import { manifesto } from "@/content/home-ultra/manifesto";
import { Section, parseAccent, plainText } from "../shared/Section";
import s from "../shared/ultra.module.css";
import m from "./Manifesto.module.css";
import { ManifestoFallback } from "./manifesto/ManifestoFallback";

// One sentence whose words light up as it crosses the viewport.
// Where CSS scroll-driven animations exist (and motion is allowed), each word runs its own slice of the
// paragraph's view timeline (pure CSS, compositor-only: opacity + transform). Elsewhere a tiny island
// (ManifestoFallback) writes one --p on the <p> while it is on screen. No JS / reduced motion: all lit.

type Word = { text: string; accent: boolean };

function splitWords(text: string): Word[] {
  return parseAccent(text).flatMap((part) =>
    part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ text: word, accent: part.accent })),
  );
}

function WordSpan({ word, i }: { word: Word; i: number }) {
  return (
    <span className={word.accent ? `${m.w} ${s.accent}` : m.w} style={{ "--i": i } as CSSProperties}>
      {word.text}
    </span>
  );
}

export function Manifesto() {
  const words = splitWords(manifesto.text);
  const n = words.length;
  // The last two words share a no-wrap group so the sentence never ends on a lone word («perto.»).
  const body = words.slice(0, -2);
  const tail = words.slice(-2);

  return (
    <Section tight>
      <ManifestoFallback className={`${s.manifesto} ${m.p}`} style={{ "--n": n } as CSSProperties}>
        <span className={s.srOnly}>{plainText(manifesto.text)}</span>
        <span aria-hidden="true">
          {body.map((word, i) => (
            <span key={i}>
              {i > 0 ? " " : null}
              <WordSpan word={word} i={i} />
            </span>
          ))}{" "}
          <span className={m.keep}>
            {tail.map((word, j) => (
              <span key={j}>
                {j > 0 ? " " : null}
                <WordSpan word={word} i={n - 2 + j} />
              </span>
            ))}
          </span>
        </span>
      </ManifestoFallback>
    </Section>
  );
}
