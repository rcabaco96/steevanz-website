import Link from "next/link";
import { href } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { modules } from "./chapters";

/** The Steevanz flower mark: five cream petals, aubergine drops, gold heart. */
export function FlowerMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="#562650" />
      <g transform="translate(20 20)">
        {[0, 72, 144, 216, 288].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <ellipse cx="0" cy="-7.4" rx="6" ry="7.6" fill="#f3ebde" />
            <path d="M0 -10.5 Q1.6 -6 0 -3.4 Q-1.6 -6 0 -10.5Z" fill="#562650" />
          </g>
        ))}
        <circle r="2" fill="#d9a238" />
      </g>
    </svg>
  );
}

export function SiteHeader({ onServices }: { onServices: () => void }) {
  return (
    <header className="site-header" data-solid="false">
      <Link className="site-logo" href="/" aria-label="Steevanz, início">
        <FlowerMark />
        <span>STEEVANZ</span>
      </Link>
      <nav className="site-nav" aria-label="Principal">
        <button type="button" onClick={onServices}>
          Serviços
        </button>
        <a href="#trabalho">Trabalho</a>
        <a href={href("pt", { key: "about" })}>Sobre</a>
        <a href={href("pt", { key: "contact" })}>Contacto</a>
      </nav>
      <div className="site-actions">
        <a className="site-lang" href="/en" hrefLang="en">
          EN
        </a>
        <a className="site-cta" href={href("pt", { key: "book" })}>
          Agendar conversa
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const legal = [
    { label: "Política de privacidade", href: href("pt", { key: "privacy" }) },
    { label: "Política de cookies", href: href("pt", { key: "cookies" }) },
    { label: "Termos e condições", href: href("pt", { key: "terms" }) },
  ];
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <Link className="site-logo" href="/" aria-label="Steevanz, início">
            <FlowerMark size={34} />
            <span>STEEVANZ</span>
          </Link>
          <p>Casa de software portuguesa. Tecnologia empática e acessível a todos, com os bons modos de sempre.</p>
        </div>
        <div>
          <h3>Serviços</h3>
          <ul>
            {modules.map((m) => (
              <li key={m.id}>
                <a href={m.cta.href}>{m.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Empresa</h3>
          <ul>
            <li>
              <a href={href("pt", { key: "about" })}>Sobre nós</a>
            </li>
            <li>
              <a href="#trabalho">Trabalho</a>
            </li>
            <li>
              <a href={href("pt", { key: "book" })}>Agendar conversa</a>
            </li>
            <li>
              <a href={href("pt", { key: "requestInfo" })}>Pedir informação</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Contactos</h3>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="site-footer-base">
        <span>© {new Date().getFullYear()} Steevanz · Feito em Portugal</span>
        <ul>
          {legal.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">
              Livro de Reclamações
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
