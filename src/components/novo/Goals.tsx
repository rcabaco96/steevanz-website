"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ProductGlyph } from "@/components/icons";
import type { ProductIcon } from "@/content/products";
import styles from "./novo.module.css";

// «O que quer melhorar?» (owner, 2026-10-20): the goals as tabs; each goal shows the products that
// solve it as equal cards (icon, name, what it does for that goal, «desde … + IVA», «Conhecer …»).
// No illustration of a single product and no auto-advance: the visitor picks the goal.

export interface GoalProductView {
  id: string;
  href: string;
  icon: ProductIcon;
  name: string;
  benefit: string;
  price: string;
  cta: string;
}

export interface GoalView {
  id: string;
  title: string;
  lead: string;
  products: GoalProductView[];
}

export function Goals({ label, goals }: { label: string; goals: GoalView[] }) {
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
    <div className={styles.goals}>
      <div role="tablist" aria-label={label} className={styles.tabs}>
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
        <p className={styles.goalLead}>{goal.lead}</p>
        <ul className={styles.goalCards}>
          {goal.products.map((product) => (
            <li key={product.id} className={styles.goalCard}>
              <span className={styles.goalIcon} aria-hidden="true">
                <ProductGlyph icon={product.icon} size={20} />
              </span>
              <h3 className={styles.goalName}>{product.name}</h3>
              <p className={styles.goalBenefit}>{product.benefit}</p>
              <p className={styles.goalPrice}>{product.price}</p>
              <Link href={product.href} className={styles.goalLink}>
                {product.cta}
                <ArrowRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
