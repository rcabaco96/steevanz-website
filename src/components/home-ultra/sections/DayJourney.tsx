import { dayJourney } from "@/content/home-ultra/dayJourney";
import { Section, SectionHeading } from "../shared/Section";
import d from "./DayJourney.module.css";
import { JourneyStage } from "./dayJourney/JourneyStage";

// «Um dia no seu negócio» (#dia): one customer's day with a fictional business per sector, from the
// search to the review form and the stamp, told by a story phone (phones) or a sticky phone next to the
// five steps (desktop). The heading is server-rendered; the stage is the client island.
// Owned by the DayJourney builder: this file, ./DayJourney.module.css, ./dayJourney/* and
// src/content/home-ultra/dayJourney.ts. Shared primitives in ../shared are read-only.
export function DayJourney() {
  return (
    <Section id="dia" labelledBy={dayJourney.titleId}>
      <SectionHeading id={dayJourney.titleId} title={dayJourney.title} lead={dayJourney.lead} className={d.heading} />
      <JourneyStage />
    </Section>
  );
}
