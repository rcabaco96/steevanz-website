import type { CSSProperties } from "react";
import { processLine } from "@/content/home-ultra/processLine";
import { InViewPlay } from "../shared/InViewPlay";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import st from "./ProcessLine.module.css";

// «Como trabalhamos» (#como): four numbered steps on a gold line that draws itself on scroll.
// Phones: a vertical line at the left whose tip follows a fixed line at 65% of the viewport; each node lights
// (data-on, IntersectionObserver with the same 65% line) as the tip reaches it.
// Desktop (≥1024px): four columns under one gentle S-curve SVG path drawn with stroke-dashoffset; the nodes
// light along it from the same scroll timeline.
// Fallback (no scroll timelines, reduced motion or no JS): the line is drawn and every node is on.

// Gentle S-curve through the 4 node centres (x = 0, 250, 500, 750; y = 24), plus a tail of the same shape that
// fades out after the last step («ficamos por perto»). Four equal segments, so node k sits at k/4 of the length.
const CURVE = "M0 24 C90 36 160 36 250 24 S410 12 500 24 S660 36 750 24 S910 12 1000 24";

/** Keeps hyphenated words («e-mail», «Diga-nos») whole instead of breaking them at the hyphen on narrow phones. */
function keepHyphenated(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className={st.nowrap}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function ProcessLine() {
  const { title, lead, steps } = processLine;
  return (
    <Section id="como" labelledBy="como-title">
      <SectionHeading id="como-title" title={title} lead={lead} />
      <div className={st.wrap}>
        <span className={st.rail} aria-hidden="true">
          <span className={st.track} />
          <span className={st.bar} />
        </span>
        <svg className={st.curve} viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className={st.curveTrack} d={CURVE} />
          <path className={st.curveGold} d={CURVE} pathLength={1} />
        </svg>
        <ol className={st.list} role="list">
          {steps.map((step, i) => (
            <InViewPlay
              key={step.title}
              as="li"
              className={st.step}
              style={{ "--k": i } as CSSProperties}
              attr="data-on"
              threshold={0}
              rootMargin="0px 0px -35% 0px"
              once
            >
              <span className={st.node} aria-hidden="true" />
              <span className={`${s.price} ${st.number}`} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`${s.h3} ${st.title}`}>
                <span className={s.srOnly}>Passo {i + 1}: </span>
                {step.title}
              </h3>
              <p className={`${s.body} ${st.text}`}>{keepHyphenated(step.text)}</p>
            </InViewPlay>
          ))}
        </ol>
      </div>
    </Section>
  );
}
