import type { ModuleVisual } from "./chapters";

/**
 * Small looping line drawings that show what each product does, drawn in thin
 * plum lines straight onto the wall (no boxes). Animated with CSS only.
 */

function NfcTap() {
  return (
    <svg viewBox="0 0 360 280" className="la la-nfc">
      {/* Table stand */}
      <g className="la-stroke">
        <path d="M58 92h88a10 10 0 0 1 10 10v124H48V102a10 10 0 0 1 10-10Z" />
        <path d="M40 226h124l-8 18H48Z" />
        <path d="M86 112a12 12 0 0 1 0 17M93 106a20 20 0 0 1 0 29M100 100a28 28 0 0 1 0 41" className="la-thin" />
        <rect x="80" y="178" width="44" height="34" rx="4" className="la-thin" />
        <path d="M86 184h8v8h-8zM110 184h8v8h-8zM86 198h8v8h-8zM102 198h4M110 202h8" className="la-thin" />
      </g>
      <g className="la-accent">
        {[66, 82, 98, 114, 130].map((x) => (
          <path key={x} d={`M${x} 152l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7Z`} />
        ))}
      </g>
      {/* Signal ripples between plate and phone */}
      <g className="la-ripples la-stroke">
        <path d="M168 120a26 26 0 0 1 0 36" />
        <path d="M168 120a26 26 0 0 1 0 36" />
      </g>
      {/* Phone */}
      <g className="la-phone">
        <rect x="190" y="40" width="96" height="190" rx="18" className="la-stroke la-fill" />
        <path d="M224 52h28" className="la-stroke la-thin" />
        <g className="la-screen-stars la-accent">
          {[204, 220, 236, 252, 268].map((x, i) => (
            <path key={x} style={{ animationDelay: `${1.7 + i * 0.12}s` }} d={`M${x} 104l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8Z`} />
          ))}
        </g>
        <g className="la-stroke la-thin la-screen-lines">
          <path d="M206 140h64M206 152h56M206 164h44" />
        </g>
        <g className="la-toast">
          <rect x="204" y="186" width="68" height="20" rx="10" className="la-solid" />
          <path d="M213 196l3 3 6-6" className="la-check" />
        </g>
      </g>
    </svg>
  );
}

function Browser() {
  return (
    <svg viewBox="0 0 320 240" className="la la-browser">
      <g className="la-stroke">
        <rect x="20" y="20" width="280" height="200" rx="14" className="la-draw" />
        <path d="M20 50h280" className="la-draw" />
        <circle cx="38" cy="35" r="3.5" />
        <circle cx="50" cy="35" r="3.5" />
        <circle cx="62" cy="35" r="3.5" />
      </g>
      <g className="la-blocks">
        <rect x="44" y="72" width="150" height="14" rx="7" className="la-solid" style={{ animationDelay: "0.9s" }} />
        <rect x="44" y="94" width="104" height="8" rx="4" className="la-soft" style={{ animationDelay: "1.1s" }} />
        <rect x="44" y="114" width="72" height="22" rx="11" className="la-accent-fill" style={{ animationDelay: "1.3s" }} />
        <rect x="44" y="152" width="70" height="46" rx="8" className="la-stroke la-tile" style={{ animationDelay: "1.5s" }} />
        <rect x="125" y="152" width="70" height="46" rx="8" className="la-stroke la-tile" style={{ animationDelay: "1.65s" }} />
        <rect x="206" y="152" width="70" height="46" rx="8" className="la-stroke la-tile" style={{ animationDelay: "1.8s" }} />
        <rect x="212" y="72" width="64" height="64" rx="10" className="la-stroke la-tile" style={{ animationDelay: "1.2s" }} />
      </g>
      <path className="la-cursor la-stroke" d="M112 132l0 22 6-6 5 10 5-2-5-10 8 0Z" />
    </svg>
  );
}

function Dashboard() {
  const bars = [44, 70, 56, 92, 78, 110, 96];
  return (
    <svg viewBox="0 0 320 240" className="la la-dash">
      <g className="la-stroke">
        <rect x="20" y="20" width="280" height="200" rx="14" className="la-draw" />
        <path d="M44 186h232" className="la-thin" />
      </g>
      <g className="la-bars">
        {bars.map((h, i) => (
          <rect key={i} x={52 + i * 32} y={186 - h} width="18" height={h} rx="4" className="la-solid" style={{ animationDelay: `${0.6 + i * 0.1}s` }} />
        ))}
      </g>
      <path d="M61 128L93 102 125 116 157 76 189 90 221 52 253 64" className="la-line la-accent-stroke" />
      <g className="la-accent">
        <circle cx="253" cy="64" r="5" className="la-dot" />
      </g>
    </svg>
  );
}

function Chat() {
  return (
    <svg viewBox="0 0 320 260" className="la la-chat">
      <rect x="96" y="14" width="128" height="232" rx="22" className="la-stroke la-fill" />
      <path d="M140 28h40" className="la-stroke la-thin" />
      <g className="la-bubble" style={{ animationDelay: "0.4s" }}>
        <rect x="110" y="52" width="76" height="24" rx="12" className="la-stroke" />
      </g>
      <g className="la-bubble" style={{ animationDelay: "1.2s" }}>
        <rect x="134" y="86" width="76" height="24" rx="12" className="la-solid" />
      </g>
      <g className="la-bubble" style={{ animationDelay: "2s" }}>
        <rect x="110" y="120" width="56" height="24" rx="12" className="la-stroke" />
      </g>
      <g className="la-bubble" style={{ animationDelay: "2.8s" }}>
        <rect x="124" y="154" width="86" height="34" rx="14" className="la-solid" />
      </g>
      <g className="la-typing la-accent">
        <circle cx="124" cy="212" r="3.5" />
        <circle cx="136" cy="212" r="3.5" />
        <circle cx="148" cy="212" r="3.5" />
      </g>
    </svg>
  );
}

function Booking() {
  return (
    <svg viewBox="0 0 320 240" className="la la-book">
      <g className="la-stroke">
        <rect x="40" y="26" width="240" height="190" rx="14" className="la-draw" />
        <path d="M40 62h240" />
        <path d="M84 16v20M236 16v20" />
      </g>
      <g className="la-grid">
        {Array.from({ length: 15 }, (_, i) => (
          <rect key={i} x={62 + (i % 5) * 42} y={78 + Math.floor(i / 5) * 40} width="28" height="26" rx="6" className="la-stroke la-thin" />
        ))}
      </g>
      <rect x="146" y="118" width="28" height="26" rx="6" className="la-pick la-accent-fill" />
      <path d="M232 176l10 10 22-22" className="la-check-big la-accent-stroke" />
    </svg>
  );
}

export function LineArt({ visual }: { visual: ModuleVisual }) {
  switch (visual) {
    case "plate":
      return <NfcTap />;
    case "browser":
      return <Browser />;
    case "dashboard":
      return <Dashboard />;
    case "chat":
      return <Chat />;
    case "booking":
      return <Booking />;
  }
}
