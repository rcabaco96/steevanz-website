import { FlowerExperience } from "@/components/lab/FlowerExperience";
import { labDisplay, labSans } from "./fonts";

export default function LabPage() {
  return <FlowerExperience fontFamily={labDisplay.style.fontFamily} sansFamily={labSans.style.fontFamily} />;
}
