import Link from "next/link";
import { href } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { getProductCopy } from "@/content/product-copy";
import { products } from "@/content/products";
import { sectors } from "@/content/sectors";
import { modules } from "./chapters";
import { FlowerMark } from "./FlowerMark";

export { SiteHeader } from "./Header";
export { FlowerMark };

/** Footer mirrors the header: every product (grouped), sectors, docs, company, contact and legal. */
export function SiteFooter() {
  const legal = [
    { label: "Política de privacidade", href: href("pt", { key: "privacy" }) },
    { label: "Política de cookies", href: href("pt", { key: "cookies" }) },
    { label: "Termos e condições", href: href("pt", { key: "terms" }) },
  ];
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <Link className="site-logo" href="/" aria-label="Steevanz, início">
            <FlowerMark size={34} />
            <span>STEEVANZ</span>
          </Link>
          <p>Empresa portuguesa de software. Tecnologia empática e acessível a todos, com os bons modos de sempre.</p>
          <a className="site-cta site-footer-cta" href={href("pt", { key: "book" })}>
            Agendar demo
          </a>
        </div>
        <ul className="site-footer-contacts">
          <li>
            <a href={whatsappUrl("Olá! Gostava de falar com a Steevanz.")} target="_blank" rel="noopener noreferrer">
              <small>WhatsApp</small>
              {site.whatsappDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`}>
              <small>E-mail</small>
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.phoneHref}>
              <small>Telefone</small>
              {site.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              <small>Instagram</small>
              {site.instagramHandle}
            </a>
          </li>
        </ul>
      </div>

      <div className="site-footer-grid">
        <div className="site-footer-products">
          <h3>Produtos</h3>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <a href={href("pt", { key: "product", productId: product.id })}>{getProductCopy(product.id, "pt").shortName}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Projetos à medida</h3>
          <ul>
            {modules
              .filter((m) => m.id === "websites" || m.id === "software")
              .map((m) => (
                <li key={m.id}>
                  <a href={m.cta.href}>{m.label}</a>
                </li>
              ))}
            <li>
              <a href={href("pt", { key: "products" })}>Todos os produtos</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Setores</h3>
          <ul>
            {sectors.map((sector) => (
              <li key={sector.id}>
                <a href={href("pt", { key: "sector", sectorId: sector.id })}>{sector.copy.pt.name}</a>
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
              <a href={href("pt", { key: "contact" })}>Contacto</a>
            </li>
            <li>
              <a href={href("pt", { key: "docs" })}>Documentação</a>
            </li>
            <li>
              <a href={href("pt", { key: "requestInfo" })}>Pedir informação</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer-base">
        <span>© {new Date().getFullYear()} Steevanz · Feito em Portugal, com os bons modos de sempre.</span>
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
