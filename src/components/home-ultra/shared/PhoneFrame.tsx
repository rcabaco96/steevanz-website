import type { CSSProperties, ReactNode } from "react";
import { InViewPlay } from "./InViewPlay";
import { PointerTilt } from "./PointerTilt";
import s from "./ultra.module.css";

// PhoneFrame: CSS bezel (10px #1d1220, radius 2.75rem), dynamic island, screen at a fixed 390/844
// aspect (radius 2.1rem). Children cover the screen (each direct child is absolutely positioned inset 0).
// PhoneStage: the 3D stage around one or more phones: perspective, base pose, optional straighten on
// scroll (CSS scroll-driven, static base pose where unsupported), idle float while in view and the
// desktop pointer tilt. Satellite: a decorative element placed in the 3D space (translateZ).

export function PhoneFrame({
  width,
  screenBg = "#fff",
  island = true,
  shadow = false,
  className = "",
  screenClassName = "",
  style,
  label,
  children,
}: {
  /** Any CSS length, e.g. "min(62vw, 15rem)" or "18.75rem". Default min(62vw, 15rem). */
  width?: string;
  /** Screen background behind the content (dark screens: "#1d1220"). */
  screenBg?: string;
  island?: boolean;
  /** Soft radial floor shadow under the phone (not a box-shadow). */
  shadow?: boolean;
  className?: string;
  screenClassName?: string;
  style?: CSSProperties;
  /** Accessible name when the phone content is meaningful; otherwise it is aria-hidden by the caller. */
  label?: string;
  children?: ReactNode;
}) {
  const vars = {
    ...(width ? { "--hu-phone-w": width } : {}),
    "--hu-screen-bg": screenBg,
    ...style,
  } as CSSProperties;
  return (
    <div className={`${s.phone} ${className}`} style={vars} role={label ? "img" : undefined} aria-label={label}>
      <div className={`${s.screen} ${screenClassName}`}>{children}</div>
      {island ? <span className={s.island} aria-hidden="true" /> : null}
      {shadow ? <span className={s.phoneShadow} aria-hidden="true" /> : null}
    </div>
  );
}

export interface PhonePose {
  rx?: string;
  ry?: string;
  rz?: string;
}

export function PhoneStage({
  pose = { rx: "10deg", ry: "-22deg", rz: "-4deg" },
  straighten = "none",
  float = false,
  pointer = false,
  className = "",
  tiltClassName = "",
  style,
  children,
}: {
  /** Base pose. Default rotateX(10deg) rotateY(-22deg) rotateZ(-4deg). Use {rx:"0deg",ry:"0deg",rz:"0deg"} for flat. */
  pose?: PhonePose;
  /**
   * "root": straightens over the first 75svh of page scroll (hero).
   * "view": straightens as the stage enters the viewport (entry 0% → cover 50%).
   * Straight pose = rotateX(2deg) rotateY(-6deg) rotateZ(0) translateY(-4%). Reduced motion: static
   * rotateY(-12deg) rotateX(6deg). Unsupported: stays in the base pose.
   */
  straighten?: "root" | "view" | "none";
  /** Idle float (translateY -8px, rotateZ .8deg, 6s alternate), running only while the stage is in view. */
  float?: boolean;
  /** Desktop mouse tilt (≥1024px, pointer fine): rAF-lerped --px/--py in -1..1. */
  pointer?: boolean;
  className?: string;
  /** Extra class on the tilt layer (e.g. your own entrance animation — animate a wrapper, not .tilt). */
  tiltClassName?: string;
  style?: CSSProperties;
  /** Phones and <Satellite>s. They share the 3D space, so rotation gives free parallax. */
  children: ReactNode;
}) {
  const vars = {
    ...(pose.rx ? { "--hu-rx": pose.rx } : {}),
    ...(pose.ry ? { "--hu-ry": pose.ry } : {}),
    ...(pose.rz ? { "--hu-rz": pose.rz } : {}),
    ...style,
  } as CSSProperties;
  const straightenClass = straighten === "root" ? s.straightenRoot : straighten === "view" ? s.straightenView : "";
  let inner: ReactNode = (
    <div className={`${s.tilt} ${straightenClass} ${tiltClassName}`}>
      {float ? <div className={s.float}>{children}</div> : children}
    </div>
  );
  if (pointer) inner = <PointerTilt className={s.pointer}>{inner}</PointerTilt>;
  return float ? (
    <InViewPlay className={`${s.stage} ${className}`} style={vars} attr="data-inview" threshold={0.1}>
      {inner}
    </InViewPlay>
  ) : (
    <div className={`${s.stage} ${className}`} style={vars}>
      {inner}
    </div>
  );
}

/** Decorative element in the stage's 3D space. Position it with className/style (top/left/right/bottom). */
export function Satellite({
  z = 40,
  className = "",
  style,
  children,
}: {
  /** translateZ in px. */
  z?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div aria-hidden="true" className={`${s.satellite} ${className}`} style={{ "--z": `${z}px`, ...style } as CSSProperties}>
      {children}
    </div>
  );
}
