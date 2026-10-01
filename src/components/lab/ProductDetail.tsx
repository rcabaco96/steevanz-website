import { getProductCopy } from "@/content/product-copy";
import { getProduct } from "@/content/products";
import type { ProductId } from "@/content/types";
import { bookingHref, href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import type { ModuleVisual } from "./chapters";
import { LineArt } from "./LineArt";
import { NfcShowcase } from "./NfcShowcase";

const BILLING: Record<string, string> = {
  "one-time": "pagamento único",
  monthly: "/mês",
  project: "por projeto",
};

const VISUALS: Record<ProductId, ModuleVisual> = {
  "nfc-google-reviews": "plate",
  "nfc-social": "plate",
  loyalty: "plate",
  bookings: "booking",
  waitlist: "booking",
  "ai-chatbot": "chat",
  "ai-voice": "chat",
  "ai-reviews": "chat",
  automation: "dashboard",
};

const euro = (amount: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

/**
 * Product detail page in the homepage's visual language, without 3D: everything a
 * business needs to decide (what it is, why, how it works, what's included, price,
 * FAQ) and a clear way to book. Pure component, so it renders both as a standalone
 * page and inside the homepage overlay.
 */
export function ProductDetail({ productId, headingLevel = 1 }: { productId: ProductId; headingLevel?: 1 | 2 }) {
  const product = getProduct(productId);
  const copy = getProductCopy(productId, "pt");
  const Title = headingLevel === 1 ? "h1" : "h2";
  const price = euro(product.priceFrom);
  const billing = BILLING[product.priceBilling];
  const book = bookingHref("pt", productId);
  const info = href("pt", { key: "requestInfo" });

  return (
    <article className="pd">
      <header className="pd-hero">
        <div className="pd-hero-visual" aria-hidden="true">
          <LineArt visual={VISUALS[productId]} />
        </div>
        <p className="pd-kicker">{copy.shortName}</p>
        <Title className="pd-title">{copy.heroTitle}</Title>
        <p className="pd-lead">{copy.heroSubtitle}</p>
        <div className="pd-hero-foot">
          <div className="pd-price">
            <span>desde</span>
            <strong>{price}</strong>
            <span>{product.priceBilling === "monthly" ? "/mês" : billing}</span>
            <small>
              {product.priceQualifier.pt} · + IVA{product.priceIsProvisional ? " · preço indicativo" : ""}
            </small>
          </div>
          <div className="pd-actions">
            <a className="home-cta" href={book}>
              Agendar demonstração <span aria-hidden="true">→</span>
            </a>
            <a className="pd-secondary" href={info}>
              Pedir informação
            </a>
          </div>
        </div>
      </header>

      {productId === "nfc-google-reviews" || productId === "nfc-social" ? <NfcShowcase /> : null}

      <section className="pd-split" aria-label="O problema e a solução">
        <div className="pd-card pd-card-muted">
          <p className="pd-label">O problema</p>
          <h2>{copy.problem.title}</h2>
          <p>{copy.problem.body}</p>
          <ul className="pd-list pd-list-dash">
            {copy.problem.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="pd-card pd-card-plum">
          <p className="pd-label">A solução</p>
          <h2>{copy.solution.title}</h2>
          <p>{copy.solution.body}</p>
          <ul className="pd-list pd-list-check">
            {copy.solution.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">Como funciona</p>
          <h2>Do primeiro contacto ao primeiro resultado.</h2>
        </div>
        <ol className="pd-steps">
          {copy.steps.map((step, i) => (
            <li key={step.title}>
              <span className="pd-step-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">Funcionalidades</p>
          <h2>Pensado ao pormenor.</h2>
        </div>
        <ul className="pd-features">
          {copy.features.map((feature) => (
            <li key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">Para quem</p>
          <h2>Feito para quem atende pessoas.</h2>
        </div>
        <ul className="pd-cases">
          {copy.useCases.map((useCase) => (
            <li key={useCase.sector}>
              <h3>{useCase.title}</h3>
              <p>{useCase.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pd-section pd-includes">
        <div className="pd-section-head">
          <p className="pd-label">O que está incluído</p>
          <h2>Tudo pronto a usar.</h2>
          <div className="pd-price pd-price-inline">
            <span>desde</span>
            <strong>{price}</strong>
            <span>{product.priceBilling === "monthly" ? "/mês" : billing}</span>
          </div>
        </div>
        <ul className="pd-list pd-list-check pd-list-columns">
          {copy.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">Perguntas frequentes</p>
          <h2>Dúvidas comuns.</h2>
        </div>
        <div className="pd-faq">
          {copy.faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {product.related.length ? (
        <section className="pd-section">
          <div className="pd-section-head">
            <p className="pd-label">Combina bem com</p>
          </div>
          <ul className="pd-related">
            {product.related.map((id) => {
              const related = getProduct(id);
              const relatedCopy = getProductCopy(id, "pt");
              return (
                <li key={id}>
                  <a href={href("pt", { key: "product", productId: id })}>
                    <strong>{relatedCopy.shortName}</strong>
                    <span>{relatedCopy.tagline}</span>
                    <em>
                      desde {euro(related.priceFrom)}
                      {related.priceBilling === "monthly" ? "/mês" : ""}
                    </em>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="pd-final">
        <h2>Veja a funcionar no seu negócio.</h2>
        <p>Numa conversa de 20 minutos mostramos tudo e dizemos com franqueza o que faz sentido para si.</p>
        <div className="pd-actions">
          <a className="home-cta" href={book}>
            Agendar demonstração <span aria-hidden="true">→</span>
          </a>
          <a className="pd-secondary" href={whatsappUrl(`Olá! Gostava de saber mais sobre ${copy.name}.`)} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </article>
  );
}
