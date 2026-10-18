import { PlusIcon } from "@/components/icons";
import { homeFaq } from "@/content/home-ultra/homeFaq";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import f from "./HomeFaq.module.css";

// «Perguntas frequentes». Server component, zero JS: native <details> rows (independent, all closed),
// opening with the ::details-content block-size transition where supported (instant elsewhere and under
// reduced motion). Phones: one column. From 1024px: sticky heading on the left (4/12), list on the right (7/12).
export function HomeFaq() {
  return (
    <Section id="perguntas" labelledBy="perguntas-title" className={f.section} containerClassName={f.grid}>
      <div className={f.aside}>
        <SectionHeading id="perguntas-title" title={homeFaq.title} className={f.heading} />
      </div>
      <div className={f.list}>
        {homeFaq.items.map((item) => (
          <details key={item.q} className={f.item}>
            <summary className={f.summary}>
              <span className={`${s.label} ${f.question}`}>{item.q}</span>
              <span className={f.plus} aria-hidden="true">
                <PlusIcon size={20} className={f.plusIcon} />
              </span>
            </summary>
            <div className={f.answer}>
              <p className={`${s.body} ${f.answerText}`}>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
