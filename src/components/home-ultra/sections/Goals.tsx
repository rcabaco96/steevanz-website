import { goalChipLabels, goalDemos, goalsCopy } from "@/content/home-ultra/goals";
import { contact, fromLabel, goalFromPrice, goals, productHref } from "@/content/home-ultra/shared";
import Link from "next/link";
import { TextLink } from "../shared/Buttons";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import st from "./Goals.module.css";
import { BookingMini, FlowScreen, MenuMini, SiteMini } from "./goals/GoalDemos";
import { GoalsStage } from "./goals/GoalsStage";

// «O que quer melhorar?» (#melhorar): the page's main product moment. Five goals of equal weight as
// tabs; one big phone plays the real product for the selected goal and advances softly while on screen.
// Server side: heading, panels (line, product chips, «desde» price) and the code-drawn screens; the
// island (goals/GoalsStage) only holds the selection, the clock and the phone layers.
export function Goals() {
  const panels = goals.map((goal) => (
    <div key={goal.id} className={st.panelBody}>
      <h3 className={`${s.h3} ${st.panelTitle}`}>{goal.title}</h3>
      <p className={st.panelLine}>{goal.line}</p>
      <ul className={st.chips}>
        {goal.productIds.map((id) => (
          <li key={id}>
            <Link href={productHref(id)} className={st.chip}>
              {goalChipLabels[id]}
            </Link>
          </li>
        ))}
      </ul>
      <div className={st.priceRow}>
        <p className={`${s.price} ${st.priceLine}`}>
          {fromLabel(goalFromPrice(goal))}
          {goalsCopy.vat}
        </p>
        {goal.id === "medida" ? <TextLink href={contact.contactHref}>{goalsCopy.contact}</TextLink> : null}
      </div>
    </div>
  ));

  return (
    <Section id="melhorar" labelledBy="melhorar-title" tone="soft" band containerClassName={st.inner}>
      <GoalsStage
        heading={<SectionHeading id="melhorar-title" title={goalsCopy.title} lead={goalsCopy.lead} />}
        goals={goals.map((goal) => ({ id: goal.id, title: goal.title, demo: goalDemos[goal.id] }))}
        panels={panels}
        fallbacks={{ encontrado: <SiteMini />, casa: <BookingMini />, vender: <MenuMini /> }}
        flowScreen={<FlowScreen />}
        labels={{ tablist: goalsCopy.tablistLabel, pause: goalsCopy.pause, resume: goalsCopy.resume }}
      />
    </Section>
  );
}
