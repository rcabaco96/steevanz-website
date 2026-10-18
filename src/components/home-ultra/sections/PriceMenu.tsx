import Link from "next/link";
import type { CSSProperties } from "react";
import { getProductCopy } from "@/content/product-copy";
import type { ProductId } from "@/content/types";
import { cleanQualifier, euros, goals, product, productHref } from "@/content/home-ultra/shared";
import { priceMenuCopy as copy } from "@/content/home-ultra/priceMenu";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import m from "./PriceMenu.module.css";

// «Preços à vista»: a printed-menu card with every product's starting price, grouped by the 5 goals.
// Server component, zero JS. Phones/tablets: a radio group of pills picks one group (CSS :has, all
// groups stacked in one grid cell so switching never changes the card height). Desktop: all five groups
// in a two-column card. Without :has support every group simply shows, one after the other.

const RADIO_NAME = "hu-precos-grupo";

function priceRow(id: ProductId) {
  const p = product(id);
  const monthly = p.priceBilling === "monthly";
  let note = cleanQualifier(p.priceQualifier.pt);
  // The price already says «/mês»: drop a leading «por mês» so the note adds something new.
  if (monthly) note = note.replace(/^por mês\s*[,;]?\s*/i, "") || copy.perMonth;
  return {
    id,
    href: productHref(id),
    name: getProductCopy(id, "pt").name,
    price: `${euros(p.priceFrom)}${monthly ? "/mês" : ""}`,
    note,
  };
}

export function PriceMenu() {
  const groups = goals.map((goal) => ({ ...goal, rows: goal.productIds.map(priceRow) }));

  return (
    <Section id="precos" labelledBy="precos-title">
      <SectionHeading id="precos-title" title={copy.title} lead={copy.lead} />

      <div className={m.prices}>
        <fieldset className={m.picker}>
          <legend className={s.srOnly}>{copy.legend}</legend>
          <div className={`${m.pills} ${s.rail}`}>
            {groups.map((g, i) => (
              <label key={g.id} className={m.pill}>
                <input
                  type="radio"
                  name={RADIO_NAME}
                  id={`p-${g.id}`}
                  value={g.id}
                  defaultChecked={i === 0}
                  aria-controls={`precos-${g.id}`}
                  className={m.radio}
                />
                <span className={m.pillText}>{g.title}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={m.card}>
          <div className={m.groups}>
            {groups.map((g) => (
              <div key={g.id} id={`precos-${g.id}`} data-group={g.id} className={m.group}>
                <h3 className={m.groupTitle}>{g.title}</h3>
                <p className={m.groupLine}>{g.line}</p>
                <ul className={m.rows}>
                  {g.rows.map((row, i) => (
                    <li key={row.id} className={m.item} style={{ "--i": i } as CSSProperties}>
                      <Link href={row.href} className={m.row}>
                        <span className={m.name}>{row.name}</span>
                        <span className={m.leader} aria-hidden="true" />
                        <span className={s.srOnly}>: </span>
                        <span className={`${s.price} ${m.price}`}>{row.price}</span>
                        <span className={s.srOnly}>, </span>
                        <span className={`${s.subtle} ${m.note}`}>{row.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className={`${s.subtle} ${m.footnote}`}>{copy.footnote}</p>
        </div>
      </div>
    </Section>
  );
}
