import Image from "next/image";
import type { CSSProperties } from "react";
import { clientLogos } from "@/content/client-logos";
import { novoCopy } from "@/content/novo-home";
import { localize, type Locale } from "@/lib/i18n";
import styles from "./novo.module.css";

// «Confiam em nós»: the client logos, still (no marquee), in the site's ink; each one shows its own
// colours on hover. Phones: a 3×2 grid; from 640px: one row. Sizes are optically balanced
// (src/content/client-logos.ts) and the width/height attributes keep the aspect ratio, so nothing shifts
// while they load. Not links: they are references, not destinations.

export function ClientStrip({ locale }: { locale: Locale }) {
  const copy = localize(novoCopy, locale).clients;
  return (
    <section aria-labelledby="novo-clients" className={styles.clients}>
      <div className={styles.wrap}>
        <h2 id="novo-clients" className={styles.clientsTitle}>
          {copy.title}
        </h2>
        <ul className={styles.clientLogos}>
          {clientLogos.map((logo) => {
            // Rendered at up to ~66px tall: the width/height props ask next/image for that size
            // (and its 2× for sharp screens) instead of the full-size file. SVGs are served as they are.
            const h = Math.round(52 * logo.scale);
            const w = Math.round((h * logo.width) / logo.height);
            return (
              <li
                key={logo.id}
                className={styles.clientLogo}
                data-client={logo.id}
                data-featured={logo.featured ? "" : undefined}
                style={{ "--logo-scale": logo.scale } as CSSProperties}
              >
                <Image src={logo.monoSrc} alt={logo.name} width={w} height={h} className={styles.clientLogoMono} />
                <Image src={logo.src} alt="" aria-hidden width={w} height={h} className={styles.clientLogoColour} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
