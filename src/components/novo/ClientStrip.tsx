"use client";

import Image from "next/image";
import { useState } from "react";
import { novoCopy, trustedClients, type TrustedClient } from "@/content/novo-home";
import { localize, type Locale } from "@/lib/i18n";
import styles from "./novo.module.css";

// «Confiam em nós»: a slow marquee of the clients we may name. It pauses on hover and with the
// button (WCAG 2.2.2); with reduced motion it is a still, wrapped list.

function ClientName({ client }: { client: TrustedClient }) {
  // TODO(logos): when the owner sends each logo, set `logo` in src/content/novo-home.ts and the SVG
  // takes the name's place here, at the same height.
  if (client.logo) {
    return (
      <li className={styles.client} data-client={client.id}>
        <Image src={client.logo.src} alt={client.name} width={client.logo.width} height={client.logo.height} className={styles.clientLogo} />
      </li>
    );
  }
  return (
    <li className={styles.client} data-client={client.id}>
      {client.name}
    </li>
  );
}

export function ClientStrip({ locale }: { locale: Locale }) {
  const [paused, setPaused] = useState(false);
  const copy = localize(novoCopy, locale).clients;
  return (
    <section aria-labelledby="novo-clients" className={styles.clients}>
      <div className={styles.wrap}>
        <div className={styles.clientsHead}>
          <h2 id="novo-clients" className={styles.clientsTitle}>
            {copy.title}
          </h2>
          <button type="button" className={styles.pauseBtn} onClick={() => setPaused((p) => !p)} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused}>
            {paused ? (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className={styles.marquee} data-paused={paused ? "" : undefined}>
        <div className={styles.marqueeTrack}>
          <ul className={styles.marqueeList}>
            {trustedClients.map((client) => (
              <ClientName key={client.id} client={client} />
            ))}
          </ul>
          <ul className={styles.marqueeList} aria-hidden="true">
            {trustedClients.map((client) => (
              <ClientName key={client.id} client={client} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
