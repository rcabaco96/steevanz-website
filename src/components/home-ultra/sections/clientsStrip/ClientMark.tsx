import Image from "next/image";
import type { ClientLogo } from "@/content/home-ultra/shared";
import c from "../ClientsStrip.module.css";
import s from "../../shared/ultra.module.css";

// One client in a fixed-height slot (28px phones, 36px desktop; width follows the content). A logo's
// height is the slot × its optical scale (src/content/client-logos.ts); a client without a logo is set
// in type, alternating roman ink and italic plum.
export function ClientMark({ name, logo, italic }: { name: string; logo?: ClientLogo; italic: boolean }) {
  if (logo) {
    return (
      <span className={c.mark}>
        <Image
          className={c.logo}
          src={logo.src}
          width={Math.round((48 * logo.scale * logo.width) / logo.height)}
          height={Math.round(48 * logo.scale)}
          alt={name}
          style={{ height: `calc(var(--cs-slot) * ${logo.scale})` }}
        />
      </span>
    );
  }
  return <span className={`${c.mark} ${c.name} ${italic ? `${s.accent} ${c.italic}` : ""}`}>{name}</span>;
}
