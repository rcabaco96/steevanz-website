"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clips, dayCopy, daySectors, momentOrder, type DaySector, type MomentId } from "@/content/novo-home";
import styles from "./sections.module.css";

// «Um dia no seu negócio»: five moments of a customer's day, on the phone. On a computer the phone
// stays beside the text and changes screen as each moment reaches the middle (no pinning, no
// scroll-jacking: plain position: sticky). On a phone, the moments are a row to swipe, each with its
// own screen. The sector switch changes the names and examples. The review screen is only the
// form: never a rating or a review.

function Screen({ sector, moment }: { sector: DaySector; moment: MomentId }) {
  switch (moment) {
    case "found":
      return (
        <div className={styles.scr}>
          <div className={styles.search}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {sector.search}
          </div>
          <div className={styles.result}>
            <div className={styles.resultPhoto}>
              <Image src={sector.photo} alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
            </div>
            <p className={styles.resultName}>{sector.business}</p>
            <p className={styles.resultMeta}>
              <span className={styles.open}>Aberto agora</span>
            </p>
            <div className={styles.resultActions}>
              <span>Website</span>
              <span>Direções</span>
              <span>Ligar</span>
            </div>
          </div>
          <div className={styles.resultGhost} />
        </div>
      );
    case "sees":
      if (sector.sees === "menu") {
        return (
          <div className={`${styles.scr} ${styles.scrFlush}`}>
            <Image src={clips.menuGrid.poster} alt="" fill sizes="240px" style={{ objectFit: "cover", objectPosition: "top" }} />
          </div>
        );
      }
      return (
        <div className={`${styles.scr} ${styles.scrFlush}`}>
          <div className={styles.siteHero}>
            <Image src={sector.photo} alt="" fill sizes="240px" style={{ objectFit: "cover" }} />
            <span className={styles.siteName}>
              {sector.business}
              <i>.</i>
            </span>
          </div>
          <div className={styles.siteBody}>
            <span className={styles.siteLine} />
            <span className={`${styles.siteLine} ${styles.siteLineShort}`} />
            <span className={styles.siteBtn}>{sector.id === "lodging" ? "Ver datas livres" : "Marcar online"}</span>
          </div>
        </div>
      );
    case "books":
      return (
        <div className={styles.scr}>
          <p className={styles.bookTitle}>{sector.booking.title}</p>
          <p className={styles.bookDetail}>{sector.booking.detail}</p>
          <div className={styles.bookSlots} aria-hidden="true">
            {["09:30", "10:30", "11:30", "14:00", "15:00", "16:30"].map((slot, i) => (
              <span key={slot} className={i === 1 ? styles.slotOn : undefined}>
                {sector.id === "cafe" ? ["Galão", "Tosta", "Sumo", "Bolo", "Café", "Água"][i] : slot}
              </span>
            ))}
          </div>
          <p className={styles.bookConfirm}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {sector.booking.confirm}
          </p>
        </div>
      );
    case "review":
      return (
        <div className={styles.scr}>
          <p className={styles.reviewBiz}>{sector.business}</p>
          <p className={styles.reviewHead}>Deixe a sua avaliação</p>
          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} width="26" height="26" viewBox="0 0 24 24">
                <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            ))}
          </div>
          <div className={styles.reviewBox}>Partilhe como foi a sua experiência…</div>
          <span className={styles.reviewBtn}>Publicar</span>
        </div>
      );
    default:
      if (sector.returns === "stamps") {
        return (
          <div className={styles.scr}>
            <div className={styles.loyal}>
              <p className={styles.loyalBrand}>
                {sector.business}
                <i>.</i>
              </p>
              <div className={styles.loyalStamps} aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i}>{i < 5 ? <b className={i === 4 ? styles.stampNew : undefined} /> : null}</span>
                ))}
              </div>
              <p className={styles.loyalFoot}>Cartão de cliente</p>
            </div>
          </div>
        );
      }
      if (sector.returns === "reminder") {
        return (
          <div className={`${styles.scr} ${styles.scrLock}`}>
            <p className={styles.lockTime}>9:41</p>
            <div className={styles.notice}>
              <p className={styles.noticeApp}>{sector.business}</p>
              <p className={styles.noticeText}>Lembrete: a sua consulta é amanhã às 09:30. Até já!</p>
            </div>
          </div>
        );
      }
      return (
        <div className={styles.scr}>
          <p className={styles.reviewBiz}>Guia da casa</p>
          <div className={styles.langs} aria-hidden="true">
            <span className={styles.langOn}>PT</span>
            <span>EN</span>
            <span>FR</span>
            <span>DE</span>
          </div>
          <ul className={styles.guideList}>
            <li>Wi-Fi</li>
            <li>Check-out</li>
            <li>Como chegar</li>
            <li>Recomendações</li>
          </ul>
        </div>
      );
  }
}

export function DayJourney() {
  const [sectorIndex, setSectorIndex] = useState(0);
  const [active, setActive] = useState<MomentId>("found");
  const listRef = useRef<HTMLOListElement>(null);
  const sector = daySectors[sectorIndex];

  useEffect(() => {
    const list = listRef.current;
    if (!list || !("IntersectionObserver" in window)) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let observer: IntersectionObserver | null = null;
    const setup = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (records) => {
          for (const record of records) {
            if (record.isIntersecting) setActive((record.target as HTMLElement).dataset.moment as MomentId);
          }
        },
        desktop.matches ? { rootMargin: "-48% 0px -48% 0px" } : { root: list, threshold: 0.6 },
      );
      for (const item of list.querySelectorAll("[data-moment]")) observer.observe(item);
    };
    setup();
    desktop.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      desktop.removeEventListener("change", setup);
    };
  }, []);

  return (
    <div className={styles.day}>
      <div className={styles.dayText}>
        <div role="radiogroup" aria-label={dayCopy.switchLabel} className={styles.sectorSwitch}>
          {daySectors.map((item, index) => (
            <button key={item.id} type="button" role="radio" aria-checked={index === sectorIndex} className={styles.sectorBtn} onClick={() => setSectorIndex(index)}>
              {item.tab}
            </button>
          ))}
        </div>
        <ol ref={listRef} className={styles.moments}>
          {momentOrder.map((moment, index) => (
            <li key={moment} data-moment={moment} className={styles.moment} data-active={active === moment ? "" : undefined}>
              <div className={styles.momentScreen} aria-hidden="true">
                <div className={styles.miniPhone}>
                  <Screen sector={sector} moment={moment} />
                </div>
              </div>
              <span className={styles.momentNo} aria-hidden="true">
                {index + 1}
              </span>
              <h3 className={styles.momentTitle}>{sector.moments[moment].title}</h3>
              <p className={styles.momentBody}>{sector.moments[moment].body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.dayStage} aria-hidden="true">
        <div className={styles.stickyPhone}>
          {momentOrder.map((moment) => (
            <div key={moment} className={styles.stickyScreen} data-on={active === moment ? "" : undefined}>
              <Screen sector={sector} moment={moment} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
