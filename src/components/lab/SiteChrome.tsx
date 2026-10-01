import Link from "next/link";
import { href } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { modules } from "./chapters";
import { FlowerMark } from "./FlowerMark";

export { SiteHeader } from "./Header";
export { FlowerMark };

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
          <p>Empresa portuguesa de software. Tecnologia empática e acessível a todos, com os bons modos de sempre.</p>
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
              <Link href="/#trabalho">Trabalho</Link>
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
