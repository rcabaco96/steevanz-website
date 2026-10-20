import type { ReactNode } from "react";
import { AdVideo } from "@/components/media/AdVideo";
import { novoCopy } from "@/content/novo-home";
import { adVideoLabels, productAds } from "@/content/product-ads";
import type { Locale } from "@/lib/i18n";
import styles from "./novo.module.css";

// The Menu digital showcase: the three steps beside the approved Menu digital ad, in a phone frame.

export function MenuShowcase({ locale, head, foot }: { locale: Locale; head: ReactNode; foot: ReactNode }) {
  const copy = novoCopy[locale].showcase;
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
        <AdVideo src={ad.src} poster={ad.poster} label={ad.label[locale]} copy={adVideoLabels[locale]} />
      </div>
      <div className={styles.showcaseFoot}>{foot}</div>
    </div>
  );
}
