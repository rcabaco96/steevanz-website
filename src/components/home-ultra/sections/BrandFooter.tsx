import type { CSSProperties } from "react";
import { BrandLine, Wordmark } from "../shared/Brand";
import { Section } from "../shared/Section";
import f from "./BrandFooter.module.css";

// The brand ending: a giant «Steevanz.» cropped by the page edge, sitting straight on the site footer
// (same --bg-soft, no padding below), with the two-line brand line above it on phones and tucked into
// the notch above «vanz» on desktop.
// Motion is all shared: RevealRoot sets data-shown, the letters rise through their masks (40ms stagger,
// 8 letters) and the gold dot pops once the last letter has landed. Reduced motion: static.
// Owned by the BrandFooter builder: this file and ./BrandFooter.module.css.

// Last letter starts at 7 × 40ms = 280ms; the dot pops ~450ms after it.
const markStyle = { "--hu-dot-delay": "730ms" } as CSSProperties;

export function BrandFooter() {
  return (
    <Section tone="soft" className={f.section} containerClassName={f.inner}>
      <BrandLine tone="ink" reveal="mask" className={f.line} />
      <div className={f.markWrap} style={markStyle}>
        <p className={f.markP}>
          <Wordmark size="xl" reveal="letters" className={f.mark} />
        </p>
      </div>
    </Section>
  );
}
