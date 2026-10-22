import Image from "next/image";
import type { CSSProperties } from "react";
import { clientLogos, type ClientLogo } from "@/content/client-logos";
import { novoCopy } from "@/content/novo-home";
import { localize, type Locale } from "@/lib/i18n";
import { MarqueePause } from "./MarqueePause";
import styles from "./novo.module.css";

// «Clientes» (owner, 2026-10-22: the old grey row was «super podre e fraca»; he wants a carousel that never stops):
// an eyebrow, a strong title and one line, then the client logos in their own colours, each on a white tile
// (cream in the dark theme), sliding past in an endless loop at a slow, constant speed.
// - The loop: each row repeats its list a few times side by side and the row slides left by one copy, then starts
//   again, so the join never shows. The speed is per logo (--count), so it stays the same on every screen and list length.
// - Adding a client is one line in src/content/client-logos.ts. From 12 logos the band splits into two rows that
//   move in opposite directions (with 6, a second row would just repeat the first).
// - Screen readers get the list once (the first copy); the repeats are aria-hidden with empty alts.
// - Pauses on hover and with the button below (WCAG 2.2.2); prefers-reduced-motion: no motion, one centred grid.
// - Nothing shifts or pops: the tiles have a fixed size and paint before their logo has loaded; width/height keep
//   each logo's aspect ratio. The logos load lazily (the repeats reuse the same files).
// Not links: they are references, not destinations.

/** From this many logos the band uses two rows. */
const twoRowsFrom = 12;
/** Narrowest logo pitch (tile + gap, px) on a computer and the widest screen to cover, to size the repeats. */
const minPitch = 200;
const widestScreen = 2560;

function splitRows(logos: readonly ClientLogo[]): ClientLogo[][] {
  if (logos.length < twoRowsFrom) return [[...logos]];
  // Alternate so both rows start with one of the big names.
  return [logos.filter((_, index) => index % 2 === 0), logos.filter((_, index) => index % 2 === 1)];
}

function LogoTiles({ logos, hidden }: { logos: ClientLogo[]; hidden: boolean }) {
  return (
    <ul className={styles.marqueeGroup} aria-hidden={hidden || undefined}>
      {logos.map((logo) => {
        // Rendered at up to ~66px tall: the width/height props ask next/image for that size (and its 2× for sharp
        // screens) instead of the full-size file. SVGs are served as they are.
        const h = Math.round(52 * logo.scale);
        const w = Math.round((h * logo.width) / logo.height);
        return (
          <li
            key={logo.id}
            className={styles.clientTile}
            data-client={logo.id}
            style={{ "--logo-scale": logo.scale } as CSSProperties}
          >
            <Image src={logo.src} alt={hidden ? "" : logo.name} width={w} height={h} className={styles.clientLogoImage} />
          </li>
        );
      })}
    </ul>
  );
}

export function ClientStrip({ locale }: { locale: Locale }) {
  const copy = localize(novoCopy, locale).clients;
  const rows = splitRows(clientLogos);
  return (
    <section aria-labelledby="novo-clients" className={styles.clients}>
      <div className={styles.wrap}>
        <div className={styles.clientsHead}>
          <p className={styles.clientsEyebrow}>{copy.eyebrow}</p>
          <h2 id="novo-clients" className={styles.clientsTitle}>
            {copy.titleStart} <em className={styles.clientsAccent}>{copy.titleAccent}</em>
          </h2>
          <p className={styles.clientsLead}>{copy.lead}</p>
        </div>
      </div>

      <div className={styles.marquee}>
        {rows.map((row, rowIndex) => {
          const copies = 1 + Math.ceil(widestScreen / (row.length * minPitch));
          return (
            <div
              key={rowIndex}
              className={styles.marqueeRow}
              data-reverse={rowIndex % 2 === 1 ? "" : undefined}
              style={{ "--count": row.length, "--copies": copies } as CSSProperties}
            >
              {Array.from({ length: copies }, (_, copyIndex) => (
                <LogoTiles key={copyIndex} logos={row} hidden={copyIndex > 0} />
              ))}
            </div>
          );
        })}
      </div>

      <div className={styles.wrap}>
        <MarqueePause pauseLabel={copy.pause} playLabel={copy.play} className={styles.marqueePause} />
      </div>
    </section>
  );
}
