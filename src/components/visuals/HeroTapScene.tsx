import type { HomeCopy } from "@/content/home";
import { NfcWaves, StarFilled } from "@/components/icons";
import { NfcPlate } from "./NfcPlate";
import styles from "./HeroTapScene.module.css";

export function HeroTapScene({ copy }: { copy: HomeCopy["scene"] }) {
  return (
    <div className={styles.scene} role="img" aria-label={copy.ariaLabel}>
      <div className={styles.halo} />
      <div className={styles.ring} />
      <div className={styles.plateWrap}>
        <NfcPlate variant="stand" finish="black" line1={copy.plateLine1} line2={copy.plateLine2} className={styles.plate} />
        <span className={styles.pulse} />
        <span className={`${styles.pulse} ${styles.pulseLate}`} />
      </div>
      <div className={styles.phone}>
        <div className={styles.screen}>
          <span className={styles.notch} />
          <div className={styles.idle}>
            <NfcWaves className={styles.idleIcon} />
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
                <StarFilled key={index} className={styles.star} />
              ))}
            </div>
            <div className={styles.textLines}>
              <span className={styles.textLine} />
              <span className={styles.textLine} />
              <span className={styles.textLine} />
            </div>
            <span className={styles.postButton}>{copy.screenButton}</span>
            <span className={styles.toast}>
              <span className={styles.toastDot} />
              {copy.toast}
            </span>
          </div>
        </div>
      </div>
      <div className={`${styles.chip} ${styles.chipTopLeft}`}>
        <NfcWaves className={styles.chipIcon} />
        {copy.chipNoApp}
      </div>
      <div className={`${styles.chip} ${styles.chipBottomRight}`}>
        <StarFilled className={`${styles.chipIcon} ${styles.chipStar}`} />
        {copy.chipTap}
      </div>
    </div>
  );
}
