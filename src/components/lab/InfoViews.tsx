import { HandFlower } from "./HandFlower";
import { aboutCopy, contactCopy } from "@/content/company";
import { getProductCopy } from "@/content/product-copy";
import { products, type ProductFamily } from "@/content/products";
import { href } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";
import { about as homeAbout, modules, portfolio } from "./chapters";

const euro = (amount: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);

function PageHero({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <header className="pd-hero">
      <p className="pd-kicker">{kicker}</p>
      <h1 className="pd-title">{title}</h1>
      <p className="pd-lead">{lead}</p>
    </header>
  );
}

function FinalCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="pd-final">
        <HandFlower className="pd-final-flower" />
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="pd-actions">
        <a className="home-cta" href={href("pt", { key: "book" })}>
          Agendar conversa <span aria-hidden="true">→</span>
        </a>
        <a className="pd-secondary" href={whatsappUrl("Olá! Gostava de falar com a Steevanz.")} target="_blank" rel="noopener noreferrer">
          Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}

export function AboutView() {
  const copy = aboutCopy.pt;
  return (
    <article className="pd">
      <PageHero kicker={copy.eyebrow} title={copy.title} lead={copy.lead} />

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">{copy.storyTitle}</p>
          <h2>Do Alentejo, com software.</h2>
        </div>
        <div className="pd-prose">
          {copy.story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <dl className="home-facts pd-facts">
            {homeAbout.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">{copy.valuesEyebrow}</p>
          <h2>{copy.valuesTitle}…</h2>
        </div>
        <ul className="pd-features pd-values">
          {copy.values.map((value) => (
            <li key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">{copy.howTitle}</p>
          <h2>Simples, de ponta a ponta.</h2>
        </div>
        <ol className="pd-steps pd-steps-3">
          {copy.how.map((step, i) => (
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
          <p className="pd-label">{portfolio.kicker}</p>
          <h2>Quem já confiou em nós.</h2>
        </div>
        <ul className="pd-cases">
          {portfolio.projects.map((project) => (
            <li key={`${project.client}-${project.title}`}>
              <h3>
                {project.client} — {project.title}
              </h3>
              <p>{project.tags.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta title={copy.ctaTitle} body={copy.ctaBody} />
    </article>
  );
}

export function ContactView() {
  const copy = contactCopy.pt;
  const channels = [
    { title: copy.channels.whatsapp, body: copy.channels.whatsappBody, value: site.whatsappDisplay, link: whatsappUrl("Olá! Gostava de falar com a Steevanz."), external: true, primary: true },
    { title: copy.channels.email, body: copy.channels.emailBody, value: site.email, link: `mailto:${site.email}`, external: false, primary: false },
    { title: copy.channels.phone, body: copy.channels.phoneBody, value: site.phoneDisplay, link: site.phoneHref, external: false, primary: false },
    { title: copy.channels.instagram, body: copy.channels.instagramBody, value: site.instagramHandle, link: site.instagramUrl, external: true, primary: false },
  ];
  return (
    <article className="pd">
      <PageHero kicker={copy.eyebrow} title={copy.title} lead={copy.lead} />

      <section className="pd-channels" aria-label="Canais de contacto">
        {channels.map((channel) => (
          <a
            key={channel.title}
            className={channel.primary ? "pd-channel pd-channel-primary" : "pd-channel"}
            href={channel.link}
            {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="pd-label">{channel.title}</span>
            <strong>{channel.value}</strong>
            <span>{channel.body}</span>
          </a>
        ))}
      </section>

      <section className="pd-split">
        <div className="pd-card pd-card-plum">
          <p className="pd-label">{copy.demoTitle}</p>
          <h2>Demonstração gratuita de 20 minutos.</h2>
          <p>{copy.demoBody}</p>
          <div className="pd-actions pd-actions-card">
            <a className="home-cta pd-cta-light" href={href("pt", { key: "book" })}>
              Agendar demonstração <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="pd-card pd-card-muted">
          <p className="pd-label">{copy.infoTitle}</p>
          <h2>Detalhes e preços por escrito.</h2>
          <p>{copy.infoBody}</p>
          <div className="pd-actions pd-actions-card">
            <a className="home-cta" href={href("pt", { key: "requestInfo" })}>
              Pedir informação <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">{copy.hoursTitle}</p>
          <h2>{copy.hours}.</h2>
        </div>
        <div className="pd-prose">
          <p>{copy.responseTime}</p>
          <p>
            <strong>{copy.locationTitle}.</strong> {copy.location}
          </p>
        </div>
      </section>
    </article>
  );
}

const FAMILIES: { id: ProductFamily; title: string; lead: string }[] = [
  { id: "nfc", title: "Placas NFC e fidelização", lead: "Reviews no Google, redes sociais e clientes que voltam, com um toque." },
  { id: "operations", title: "Reservas e filas", lead: "Agenda cheia e salas de espera calmas, sem atender o telefone." },
  { id: "ai", title: "Inteligência artificial", lead: "Atendimento, reviews e tarefas repetitivas tratadas por IA, 24 horas por dia." },
];

export function ProductsView() {
  const services = modules.filter((m) => m.id === "websites" || m.id === "software");
  return (
    <article className="pd">
      <PageHero
        kicker="Serviços e produtos"
        title="Tudo o que fazemos, num só sítio."
        lead="Produtos prontos a usar para negócios locais e projetos à medida para empresas. Escolha por onde começar, ou fale connosco e ajudamos a decidir."
      />

      {FAMILIES.map((family) => (
        <section key={family.id} className="pd-section">
          <div className="pd-section-head">
            <p className="pd-label">Produtos</p>
            <h2>{family.title}</h2>
            <p className="pd-section-lead">{family.lead}</p>
          </div>
          <ul className="pd-related">
            {products
              .filter((product) => product.family === family.id)
              .map((product) => {
                const copy = getProductCopy(product.id, "pt");
                return (
                  <li key={product.id}>
                    <a href={href("pt", { key: "product", productId: product.id })}>
                      <strong>{copy.shortName}</strong>
                      <span>{copy.tagline}</span>
                      <em>
                        desde {euro(product.priceFrom)}
                        {product.priceBilling === "monthly" ? "/mês" : ""}
                      </em>
                    </a>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}

      <section className="pd-section">
        <div className="pd-section-head">
          <p className="pd-label">Projetos à medida</p>
          <h2>Websites e software.</h2>
          <p className="pd-section-lead">Para quem precisa de algo feito de raiz, com orçamento fechado.</p>
        </div>
        <div className="pd-services">
          {services.map((service) => (
            <div key={service.id} className="pd-card pd-card-muted">
              <p className="pd-label">{service.label}</p>
              <h2>{service.title.join(" ")}</h2>
              <p>{service.lead}</p>
              <ul className="home-offers pd-offers">
                {service.offers.map((offer) => (
                  <li key={offer.name}>
                    <span>
                      <b>{offer.name}</b>
                      {offer.note ? <small>{offer.note}</small> : null}
                    </span>
                    {offer.price ? <em>{offer.price}</em> : null}
                  </li>
                ))}
              </ul>
              <div className="pd-actions pd-actions-card">
                <a className="home-cta" href={service.cta.href}>
                  {service.cta.label} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FinalCta title="Não sabe por onde começar?" body="Conte-nos o que tem em mente. Recomendamos o âmbito certo, a equipa certa e a tecnologia certa." />
    </article>
  );
}
