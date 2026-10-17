"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { novoCopy } from "@/content/novo-home";
import styles from "./novo.module.css";

// On phones, once the hero has scrolled away, a bottom bar with the two actions. It replaces the
// floating WhatsApp button on this page, so nothing covers the page's own buttons.

export function MobileBar({ heroId, menuHref, whatsappHref }: { heroId: string; menuHref: string; whatsappHref: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fab = document.querySelector<HTMLElement>(".whatsapp-fab");
    if (fab) fab.style.display = "none";
    // Room at the end of the page so the bar never covers the footer's last lines.
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    if (narrow) document.body.style.paddingBottom = "calc(4.25rem + env(safe-area-inset-bottom))";
    const hero = document.getElementById(heroId);
    let observer: IntersectionObserver | null = null;
    if (hero && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0 });
      observer.observe(hero);
    }
    return () => {
      observer?.disconnect();
      if (fab) fab.style.display = "";
      document.body.style.paddingBottom = "";
    };
  }, [heroId]);

  return (
    <div className={styles.bar} data-show={show ? "" : undefined} aria-hidden={!show} inert={!show}>
      <Link href={menuHref} className={`${styles.btn} ${styles.btnPrimary}`}>
        {novoCopy.bar.menu}
      </Link>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.whatsapp}`}>
        <WhatsAppIcon size={18} />
        {novoCopy.bar.talk}
      </a>
    </div>
  );
}
