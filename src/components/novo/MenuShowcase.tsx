import type { ReactNode } from "react";
import { AdVideo } from "@/components/media/AdVideo";
import { novoCopy } from "@/content/novo-home";
import { adVideoLabels, productAds } from "@/content/product-ads";
import styles from "./novo.module.css";

// The Menu digital showcase: the three steps beside the approved Menu digital ad, in a phone frame.

export function MenuShowcase({ head, foot }: { head: ReactNode; foot: ReactNode }) {
  const copy = novoCopy.showcase;
  const ad = productAds["digital-menu"]!;
  return (
    <div className={styles.showcaseGrid}>
      <div className={styles.showcaseHead}>{head}</div>
      <ol className={styles.steps}>
        {copy.steps.map((item, index) => (
          <li key={item.title} className={`${styles.step} ${styles.stepStatic}`}>
            <span className={styles.stepMark} aria-hidden="true">
              {index + 1}
            </span>
            <span className={styles.stepTitle}>{item.title}</span>
            <span className={styles.stepBody}>{item.body}</span>
          </li>
        ))}
      </ol>
      <div className={styles.showcaseStage}>
        <div className={styles.showcaseRing} aria-hidden="true" />
        <AdVideo src={ad.src} poster={ad.poster} label={ad.label.pt} copy={adVideoLabels.pt} />
      </div>
      <div className={styles.showcaseFoot}>{foot}</div>
    </div>
  );
}
