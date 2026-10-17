"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { clips, novoCopy, type GoalDemo } from "@/content/novo-home";
import { PhoneVideo } from "./PhoneVideo";
import styles from "./novo.module.css";

// «O que quer melhorar?»: four goals of equal weight. Each one shows its product working (a real
// recording, or the product's own screen drawn live) next to what solves it and what it costs.

export interface GoalProductView {
  id: string;
  href: string;
  name: string;
  tagline: string;
  price: string;
  suffix: string;
}

export interface GoalView {
  id: string;
  title: string;
  lead: string;
  demo: GoalDemo;
  products: GoalProductView[];
}

function Demo({ demo }: { demo: GoalDemo }) {
  if (demo === "website" || demo === "menu") {
    const clip = demo === "website" ? clips.dolciLanding : clips.menuGrid;
    return (
      <div className={`${styles.phone} ${styles.phoneDemo}`}>
        <PhoneVideo clips={[clip]} sizes="224px" minVisible={0.4} />
      </div>
    );
  }
  if (demo === "booking") {
    return (
      <div className={styles.mini} aria-label="Exemplo do ecrã de reservas: escolher o dia e a hora e receber a confirmação." role="img">
        <p className={styles.miniTitle}>Reservar mesa</p>
        <p className={styles.miniSub}>4 pessoas</p>
        <div className={styles.days} aria-hidden="true">
          <span className={`${styles.chip} ${styles.chipDay}`}>
            <small>Qui</small>14
          </span>
          <span className={`${styles.chip} ${styles.chipDay}`}>
            <small>Sex</small>15
          </span>
          <span className={`${styles.chip} ${styles.chipDay} ${styles.chipOn}`}>
            <small>Sáb</small>16
          </span>
          <span className={`${styles.chip} ${styles.chipDay}`}>
            <small>Dom</small>17
          </span>
        </div>
        <div className={styles.slots} aria-hidden="true">
          <span className={`${styles.chip} ${styles.chipOff}`}>19:30</span>
          <span className={styles.chip}>20:00</span>
          <span className={`${styles.chip} ${styles.slotPick}`}>
            20:30
            <span className={`${styles.tap} ${styles.slotTap}`} />
          </span>
          <span className={styles.chip}>21:00</span>
          <span className={`${styles.chip} ${styles.chipOff}`}>21:30</span>
          <span className={styles.chip}>22:00</span>
        </div>
        <p className={styles.confirm} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reserva confirmada · Sáb 20:30
        </p>
      </div>
    );
  }
  return (
    <div className={styles.card} role="img" aria-label="Exemplo do cartão de cliente digital, a ganhar carimbos.">
      <div className={styles.cardTop}>
        <span className={styles.cardBrand}>
          O seu café<span>.</span>
        </span>
        <span>Cartão de cliente</span>
      </div>
      <div className={styles.stamps} aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={styles.stamp} style={{ ["--i" as string]: i }}>
            {i < 7 ? <i /> : null}
          </span>
        ))}
      </div>
      <p className={styles.cardFoot}>Ao 10.º carimbo, o café é por nossa conta.</p>
    </div>
  );
}

export function Goals({ goals, custom }: { goals: GoalView[]; custom: { href: string; price: string } }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const goal = goals[active];

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (index + keys[event.key] + goals.length) % goals.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = goals.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label={novoCopy.goals.title} className={styles.tabs}>
        {goals.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={active === index}
            aria-controls={`${baseId}-panel`}
            tabIndex={active === index ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div key={goal.id} role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${goal.id}`} className={styles.panel}>
        <div className={styles.demo}>
          <Demo demo={goal.demo} />
        </div>
        <div>
          <p className={styles.goalLead}>{goal.lead}</p>
          <ul className={styles.productList}>
            {goal.products.map((product) => (
              <li key={product.id}>
                <Link href={product.href} className={styles.productLink}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productPrice}>
                    {novoCopy.goals.from} <strong>{product.price}</strong>
                    {product.suffix}
                  </span>
                  <span className={styles.productTag}>{product.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.custom}>
            <span>
              <strong>{novoCopy.goals.custom.label}:</strong> {novoCopy.goals.custom.body}
            </span>
            <Link href={custom.href}>Automação, desde {custom.price}</Link>
          </p>
        </div>
      </div>
    </>
  );
}
