import type { ModuleVisual } from "./chapters";

/** Small, crisp product mockups that show at a glance what each module is. */

function Stars() {
  return (
    <span className="mk-stars" aria-hidden="true">
      {"★★★★★"}
    </span>
  );
}

function Plate() {
  return (
    <div className="mk mk-plate">
      <svg className="mk-nfc" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M14 12a12 12 0 0 1 0 16M20 8a18 18 0 0 1 0 24M26 4a24 24 0 0 1 0 32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <Stars />
      <strong>GOSTOU?</strong>
      <span className="mk-plate-sub">Toque para avaliar no Google</span>
      <span className="mk-qr" aria-hidden="true">
        {Array.from({ length: 49 }, (_, i) => (
          <i key={i} data-on={[0, 1, 2, 7, 9, 14, 15, 16, 4, 5, 6, 11, 13, 18, 19, 20, 28, 29, 30, 35, 37, 42, 43, 44, 24, 26, 32, 38, 46, 22, 40].includes(i)} />
        ))}
      </span>
    </div>
  );
}

function Browser() {
  return (
    <div className="mk mk-browser">
      <div className="mk-bar">
        <i />
        <i />
        <i />
        <span>o-seu-negocio.pt</span>
      </div>
      <div className="mk-page">
        <span className="mk-line mk-line-lg" />
        <span className="mk-line mk-line-md" />
        <span className="mk-btn">Reservar mesa</span>
        <div className="mk-tiles">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="mk mk-dash">
      <div className="mk-dash-head">
        <strong>Painel</strong>
        <span>Esta semana</span>
      </div>
      <div className="mk-bars" aria-hidden="true">
        {[42, 64, 51, 78, 69, 88, 74].map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <ul className="mk-rows">
        <li>
          <span>Encomendas</span>
          <b>Sincronizado</b>
        </li>
        <li>
          <span>Faturação</span>
          <b>Automático</b>
        </li>
      </ul>
    </div>
  );
}

function Chat() {
  return (
    <div className="mk mk-chat">
      <p className="mk-msg mk-msg-in">Olá! Têm mesa para 4 hoje às 21h?</p>
      <p className="mk-msg mk-msg-out">Temos sim 🙂 Fica em nome de quem?</p>
      <p className="mk-msg mk-msg-in">Ana Silva</p>
      <p className="mk-msg mk-msg-out">Reserva confirmada para as 21h. Até logo!</p>
      <span className="mk-typing">Assistente IA · 24/7</span>
    </div>
  );
}

function Booking() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const slots = ["12:30", "13:00", "19:30", "20:30", "21:00", "21:30"];
  return (
    <div className="mk mk-book">
      <strong>Escolha o dia</strong>
      <div className="mk-days">
        {days.map((d, i) => (
          <span key={d} data-on={i === 3}>
            {d}
            <b>{14 + i}</b>
          </span>
        ))}
      </div>
      <div className="mk-slots">
        {slots.map((s) => (
          <span key={s} data-on={s === "20:30"}>
            {s}
          </span>
        ))}
      </div>
      <span className="mk-btn">Confirmar 20:30</span>
    </div>
  );
}

export function Mockup({ visual }: { visual: ModuleVisual }) {
  switch (visual) {
    case "plate":
      return <Plate />;
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
