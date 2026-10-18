import Image from "next/image";
import type { CSSProperties } from "react";
import { menuShowcase } from "@/content/home-ultra/menuShowcase";
import { ScaledScreen } from "../../shared/ScaledScreen";
import d from "./SharedOrderDemo.module.css";

// Tab 2 of the Menu digital band: one table, two phones, one order. The base layer is a real screen of
// the demo menu (/home/menu-pedido-longo.jpg, 480×1038, drawn at 390×844); the live parts are code on
// top of it at the same geometry: the «Adicionar» button (sender only), the burger's badge and the
// order bar. A 5s CSS loop (runs while an ancestor has data-demo-run): the sender presses «Adicionar»,
// then the badge (1→2) and the bar (2→3 pratos) flip on BOTH phones in the same frame. The «+1» chip
// that flies between the phones lives in the fan (MenuShowcase.module.css, same 5s clock).
// Reduced motion: the loop's last keyframe is the resting state (1 / 2 pratos), shown static.

const SCALE = 390 / 480; // poster px → layout px

function px(n: number) {
  return Math.round(n * SCALE * 10) / 10;
}

// Geometry measured on the poster (480×1038).
const button = { left: px(19), top: px(652), width: px(214), height: px(54) };
const badge = { cx: px(226), cy: px(659), size: px(34) };
const bar = { left: px(20), top: px(955), width: px(440), height: px(68) };

function Flip({ from, to, className = "" }: { from: number; to: number; className?: string }) {
  return (
    <span className={`${d.flip} ${className}`}>
      <span className={d.flipStack}>
        <span>{from}</span>
        <span>{to}</span>
      </span>
    </span>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M6 7h12l-1 13H7L6 7Zm3 0V6a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SharedOrderDemo({ role }: { role: "sender" | "receiver" }) {
  const copy = menuShowcase.order;
  return (
    <ScaledScreen className={d.screen} initialScale={role === "sender" ? 0.3 : 0.38}>
      <Image
        src="/home/menu-pedido-longo.jpg"
        alt=""
        width={480}
        height={1038}
        sizes="(min-width: 1024px) 240px, 46vw"
        loading="lazy"
        className={d.base}
      />
      {role === "sender" ? (
        <span
          className={d.add}
          style={{ left: button.left, top: button.top, width: button.width, height: button.height } as CSSProperties}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          {copy.add}
        </span>
      ) : null}
      <span
        className={d.badge}
        style={{
          left: badge.cx - badge.size / 2,
          top: badge.cy - badge.size / 2,
          width: badge.size,
          height: badge.size,
        }}
      >
        <Flip from={1} to={2} />
      </span>
      <span
        className={d.bar}
        style={{ left: bar.left, top: bar.top, width: bar.width, height: bar.height }}
      >
        <span className={d.barLabel}>
          <BagIcon />
          <span>
            {copy.bar} · <Flip from={2} to={3} /> {copy.dishes}
          </span>
        </span>
        <span>{copy.see}</span>
      </span>
    </ScaledScreen>
  );
}
