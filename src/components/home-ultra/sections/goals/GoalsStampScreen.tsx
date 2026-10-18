import type { CSSProperties } from "react";
import { Check } from "@/components/icons";
import { StampCard } from "@/components/public/loyalty/StampCard";
import { stampDemo } from "@/content/home-ultra/goals";
import { ScaledScreen } from "../../shared/ScaledScreen";
import st from "../Goals.module.css";

// «Fazer voltar»: the real customer card (StampCard, as the customer sees it) in the brand colours. The
// stage moves `stamps` from 3 to 4 and the card's own .stamp-land animation plays; the toast follows.
export function GoalsStampScreen({ stamps }: { stamps: number }) {
  const d = stampDemo;
  const landed = stamps >= d.after;
  return (
    <ScaledScreen>
      <div
        className={`${st.mini} ${st.miniStamps}`}
        style={{ "--brand": "#7a2d60", "--brand-text": "#fbf7f1" } as CSSProperties}
        aria-hidden="true"
      >
        <p className={st.miniTitle}>{d.title}</p>
        <div className={st.stampCard}>
          <StampCard name={d.name} holder={d.holder} stamps={stamps} required={d.required} reward={d.reward} />
        </div>
        {landed ? (
          <p className={`${st.toast} ${st.stampToast}`}>
            <span className={st.toastCheck}>
              <Check size={18} strokeWidth={2.4} />
            </span>
            {d.toast}
          </p>
        ) : null}
      </div>
    </ScaledScreen>
  );
}
