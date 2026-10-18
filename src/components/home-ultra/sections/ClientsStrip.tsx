import { clients } from "@/content/home-ultra/shared";
import { clientsStripCopy } from "@/content/home-ultra/clientsStrip";
import { Section } from "../shared/Section";
import { InViewPlay } from "../shared/InViewPlay";
import s from "../shared/ultra.module.css";
import c from "./ClientsStrip.module.css";
import { ClientMark } from "./clientsStrip/ClientMark";

// «Confiam em nós»: a slow marquee of real client names (logos drop into ClientMark when they exist).
// Two identical copies in one track, translateX 0 → -50% (CSS only). It runs only while the strip is on
// screen (InViewPlay sets data-play) and pauses on hover/focus. The first copy is the real list; the
// second is aria-hidden. Reduced motion: one centred, wrapped row, no duplicate.
const LABEL_ID = "hu-clients-label";

function Copy({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className={`${c.copy} ${hidden ? c.dup : ""}`} aria-hidden={hidden || undefined}>
      {clients.map((client, i) => (
        <li key={client.name} className={c.item}>
          <ClientMark name={client.name} logo={client.logo} italic={i % 2 === 1} />
        </li>
      ))}
    </ul>
  );
}

export function ClientsStrip() {
  return (
    <Section tight labelledBy={LABEL_ID} className={c.strip}>
      <div className={c.row}>
        <h2 id={LABEL_ID} className={`${s.label} ${s.muted} ${c.label}`}>
          {clientsStripCopy.label}
        </h2>
        <InViewPlay threshold={0.1} className={c.marquee}>
          <div className={c.track}>
            <Copy />
            <Copy hidden />
          </div>
        </InViewPlay>
      </div>
    </Section>
  );
}
