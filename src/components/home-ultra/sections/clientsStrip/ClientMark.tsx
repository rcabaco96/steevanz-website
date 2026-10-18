import Image from "next/image";
import type { ClientLogo } from "@/content/home-ultra/shared";
import c from "../ClientsStrip.module.css";
import s from "../../shared/ultra.module.css";

// One client in a fixed-height slot (28px phones, 36px desktop; width follows the content).
// Logo files are still missing (see TODO(logos) in src/content/home-ultra/shared.ts): until a `logo`
// is added there, the name is set in type, alternating roman ink and italic plum.
export function ClientMark({ name, logo, italic }: { name: string; logo?: ClientLogo; italic: boolean }) {
  if (logo) {
    return (
      <span className={c.mark}>
        <Image className={c.logo} src={logo.src} width={logo.width} height={logo.height} alt={name} />
      </span>
    );
  }
  return <span className={`${c.mark} ${c.name} ${italic ? `${s.accent} ${c.italic}` : ""}`}>{name}</span>;
}
