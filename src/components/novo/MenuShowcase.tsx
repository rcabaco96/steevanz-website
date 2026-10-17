"use client";

import { useState, type ReactNode } from "react";
import { clips, novoCopy } from "@/content/novo-home";
import { PhoneVideo } from "./PhoneVideo";
import styles from "./novo.module.css";

// The three steps follow the phone: each recording is one step, and a step can be chosen by hand.

const showClips = [clips.menuOpening, clips.menuFull, clips.menuOrder];

export function MenuShowcase({ head, foot }: { head: ReactNode; foot: ReactNode }) {
  const [step, setStep] = useState(0);
  const copy = novoCopy.showcase;
  return (
    <div className={styles.showcaseGrid}>
      <div className={styles.showcaseHead}>{head}</div>
      <ol className={styles.steps}>
        {copy.steps.map((item, index) => (
          <li key={item.title}>
            <button type="button" className={styles.step} aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)}>
              <span className={styles.stepMark} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.stepTitle}>{item.title}</span>
              <span className={styles.stepBody}>{item.body}</span>
            </button>
          </li>
        ))}
      </ol>
      <ShowcasePhone step={step} onStep={setStep} />
      <div className={styles.showcaseFoot}>{foot}</div>
    </div>
  );
}

function ShowcasePhone({ step, onStep }: { step: number; onStep: (index: number) => void }) {
  return (
    <div className={styles.showcaseStage} data-showcase-phone>
      <div className={styles.showcaseRing} aria-hidden="true" />
      <div className={`${styles.phone} ${styles.phoneShow}`}>
        <PhoneVideo clips={showClips} index={step} onIndexChange={onStep} sizes="(min-width: 1024px) 320px, 256px" />
      </div>
    </div>
  );
}
