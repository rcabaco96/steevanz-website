import type { CSSProperties } from "react";
import { Check, MapPinIcon, ProductGlyph, TapWaves, WhatsAppIcon } from "@/components/icons";
import { flowDemo, miniDemos } from "@/content/home-ultra/goals";
import { ScaledScreen } from "../../shared/ScaledScreen";
import st from "../Goals.module.css";

// Phone screens drawn in code for «O que quer melhorar?» (server components, 390×844 layouts scaled to
// the phone by ScaledScreen). Every moving part has class `a`: it runs only on the active layer while the
// section is on screen (Goals.module.css). Default styles are the final frame, so reduced motion and
// "no animation" both show the finished screen. Decorative: aria-hidden (the tab and panel name it).
//
// SiteMini, BookingMini and MenuMini are the stand-ins for the recordings in public/home-ultra/ while
// those files do not exist (LoopVideo shows its `fallback` when the poster fails to load).

const lock = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" focusable="false">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

/** «Ser encontrado»: the address is typed, the page builds itself, «Como chegar» and the tap plate appear. */
export function SiteMini() {
  const d = miniDemos.site;
  return (
    <ScaledScreen>
      <div className={`${st.mini} ${st.miniSite}`} aria-hidden="true">
        <div className={`${st.a} ${st.fadeLoop}`}>
          <div className={st.urlBar}>
            {lock}
            <span className={st.urlText}>
              {d.url}
              <span className={`${st.a} ${st.urlCover}`} />
            </span>
          </div>
          <div className={`${st.a} ${st.rise} ${st.siteHero}`}>
            <span className={st.siteSun} />
            <p className={st.siteName}>{d.name}</p>
            <p className={st.siteTagline}>{d.tagline}</p>
          </div>
          <div className={st.siteLines}>
            <span className={`${st.a} ${st.rise}`} style={{ "--k": 1 } as CSSProperties} />
            <span className={`${st.a} ${st.rise}`} style={{ "--k": 2 } as CSSProperties} />
            <span className={`${st.a} ${st.rise}`} style={{ "--k": 3 } as CSSProperties} />
          </div>
          <span className={`${st.a} ${st.pop} ${st.directions}`}>
            <MapPinIcon size={22} />
            {d.directions}
          </span>
          <span className={`${st.a} ${st.tapIn} ${st.tapBadge}`}>
            <span className={`${st.a} ${st.ring}`} />
            <span className={`${st.a} ${st.ring} ${st.ringLate}`} />
            <TapWaves size={34} />
            <span>{d.tap}</span>
          </span>
        </div>
      </div>
    </ScaledScreen>
  );
}

/** «Encher a casa»: a tap lands on 13:00, it turns plum with a check, then «Reserva confirmada». */
export function BookingMini() {
  const d = miniDemos.booking;
  return (
    <ScaledScreen>
      <div className={`${st.mini} ${st.miniBooking}`} aria-hidden="true">
        <div className={`${st.a} ${st.fadeLoop}`}>
          <p className={st.miniTitle}>{d.title}</p>
          <p className={st.miniHint}>{d.hint}</p>
          <p className={st.dayCard}>
            <ProductGlyph icon="calendar" size={26} />
            {d.day}
          </p>
          <ul className={st.times}>
            {d.times.map((time, i) => (
              <li key={time} className={st.time}>
                {time}
                {i === d.pick ? (
                  <>
                    <span className={`${st.a} ${st.timeOn}`}>
                      <Check size={20} strokeWidth={2.4} />
                      {time}
                    </span>
                    <span className={`${st.a} ${st.tapDot}`} />
                  </>
                ) : null}
              </li>
            ))}
          </ul>
          <p className={`${st.a} ${st.toast}`}>
            <span className={st.toastCheck}>
              <Check size={18} strokeWidth={2.4} />
            </span>
            {d.toast}
          </p>
        </div>
      </div>
    </ScaledScreen>
  );
}

/** «Vender mais»: «Adicionar» is pressed, a «+1» flies to «Pedido da mesa» and the counter flips 1 → 2. */
export function MenuMini() {
  const d = miniDemos.menu;
  return (
    <ScaledScreen>
      <div className={`${st.mini} ${st.miniMenu}`} aria-hidden="true">
        <div className={`${st.a} ${st.fadeLoop}`}>
          <p className={st.miniTitle}>{d.section}</p>
          {/* A CSS background: a missing file fails quietly over the warm backdrop (no broken-image icon). */}
          <div className={st.dish} style={{ backgroundImage: `url(${d.image}), linear-gradient(150deg, #ead7bf, #c99a6b)` }} />
          <div className={st.dishRow}>
            <p className={st.dishName}>{d.dish}</p>
            <span className={`${st.a} ${st.addBtn}`}>{d.add}</span>
          </div>
          <span className={`${st.a} ${st.plusOne}`}>+1</span>
          <div className={`${st.a} ${st.orderBar}`}>
            <span>{d.bar}</span>
            <span className={st.counter}>
              <span className={`${st.a} ${st.countOld}`}>1</span>
              <span className={`${st.a} ${st.countNew}`}>2</span>
            </span>
          </div>
        </div>
      </div>
    </ScaledScreen>
  );
}

const bell = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

/** «À medida»: three steps on a gold dashed line; a gold dot travels it and each step pulses as it arrives. */
export function FlowScreen() {
  const d = flowDemo;
  const icon = (name: (typeof d.nodes)[number]["icon"]) =>
    name === "calendar" ? <ProductGlyph icon="calendar" size={24} /> : name === "bell" ? bell : <WhatsAppIcon size={24} />;
  return (
    <ScaledScreen>
      <div className={`${st.mini} ${st.miniFlow}`} aria-hidden="true">
        <div className={st.flowHead}>
          <p className={st.miniTitle}>{d.title}</p>
          <span className={st.flowStatus}>
            <span className={st.flowStatusDot} />
            {d.status}
          </span>
        </div>
        <p className={st.miniHint}>{d.intro}</p>
        <div className={st.flow}>
          <span className={st.flowLine} />
          <span className={`${st.a} ${st.flowDot}`} />
          {d.nodes.map((node, i) => (
            <div key={node.title} className={`${st.a} ${st.flowNode}`} style={{ "--k": i } as CSSProperties}>
              <span className={st.flowMark}>{icon(node.icon)}</span>
              <span className={st.flowCard}>
                <span className={st.flowTitle}>{node.title}</span>
                <span className={st.flowNote}>{node.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScaledScreen>
  );
}
