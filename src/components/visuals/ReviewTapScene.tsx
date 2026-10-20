import type { HomeCopy } from "@/content/home";
import { StarOutline, TapWaves } from "@/components/icons";
import { TapPlate } from "./TapPlate";
import styles from "./ReviewTapScene.module.css";

/**
 * The flagship section's moving picture (2026-10-11: replaced a stock video that showed a card
 * payment at a terminal): a phone comes to the counter plate and the tap opens Google's review
 * form, empty (never a rating or a published review: brand rule). CSS only, free, no video to load;
 * with reduced motion it shows the open form, still.
 */
export function ReviewTapScene({ copy }: { copy: HomeCopy["scene"] }) {
  return (
    <div className={styles.scene} role="img" aria-label={copy.ariaLabel}>
      <div className={styles.glow} />
      <div className={styles.counter} />
      <div className={styles.plateWrap}>
        <TapPlate variant="square" finish="white" line1={copy.plateLine1} line2={copy.plateLine2} className={styles.plate} />
        <span className={styles.pulse} />
        <span className={`${styles.pulse} ${styles.pulseLate}`} />
      </div>
      <div className={styles.phone}>
        <div className={styles.screen}>
          <span className={styles.notch} />
          <div className={styles.idle}>
            <TapWaves className={styles.idleIcon} />
            <span>{copy.screenIdle}</span>
          </div>
          <div className={styles.review}>
            <div className={styles.reviewHeader}>
              <span className={styles.avatar} />
              <div className={styles.reviewTitle}>{copy.screenTitle}</div>
            </div>
            <div className={styles.prompt}>{copy.screenPrompt}</div>
            <div className={styles.stars}>
              {[0, 1, 2, 3, 4].map((index) => (
                <StarOutline key={index} className={styles.star} style={{ ["--i" as string]: index }} />
              ))}
            </div>
            <div className={styles.textBox} />
            <span className={styles.postButton}>{copy.screenButton}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
