import type { ReactNode } from "react";
import { huItalic } from "../fonts";
import { RevealRoot } from "./RevealRoot";
import s from "./ultra.module.css";

// The /novo-ultra root: local tokens, the route italic font, the scroll hairline and the reveal system.
// chrome.css keys off [data-home-ultra] (light theme forced, no header blur, no WhatsApp bubble).
export function UltraRoot({ children }: { children: ReactNode }) {
  return (
    <div data-home-ultra="" className={`${s.root} ${huItalic.variable}`}>
      <div className={s.hairline} aria-hidden="true" />
      {children}
      <RevealRoot />
    </div>
  );
}
