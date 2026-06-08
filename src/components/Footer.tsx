import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative border-t border-(--color-line)/60 bg-(--color-ink)">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-display text-3xl tracking-tight text-(--color-bone)">
              Steevanz<span className="text-(--color-gold)">.</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-(--color-fog)">
              Uma família alentejana de nerds, geeks, genuínos e de carne e osso —
              a fazer tecnologia à medida, com os modos do antigamente.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">
              #ITRUNSINTHEFAMILY
            </p>
          </div>

          <FooterCol
            title="O Mapa da Casa"
            links={[
              { label: "Casa / Home", to: "/" },
              { label: "Quem Somos", to: "/quem-somos" },
              { label: "Silky Software", to: "/silky-software" },
              { label: "Networking", to: "/networking" },
            ]}
          />

          <FooterCol
            title="Mais família"
            links={[
              { label: "Neighbourhood", to: "/neighbourhood" },
              { label: "Steevanz Fashion", to: "/fashion" },
              { label: "Reach Out", to: "/reach-out" },
            ]}
          />

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">Reach us</h4>
            <ul className="mt-5 space-y-3 text-sm text-(--color-fog)">
              <li>
                <a href="mailto:mouth2mouth@steevanz.com" className="transition-colors hover:text-(--color-bone)">
                  mouth2mouth@steevanz.com
                </a>
              </li>
              <li>
                <a href="tel:+351928069072" className="transition-colors hover:text-(--color-bone)">
                  +351 928 069 072
                </a>
              </li>
              <li>
                <span>Herdade alentejana de IT, CBD Lisboeta</span>
              </li>
              <li>
                <a href="https://www.instagram.com/steevanz_" target="_blank" rel="noreferrer" className="transition-colors hover:text-(--color-bone)">
                  @Steevanz_
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-(--color-line)/60 pt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-(--color-fog)/70 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Steevanz — tecnologia do amanhã, com os bons modos do antigamente</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-gold)" />
            Família desde 04.02.2021
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm text-(--color-fog)">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="transition-colors hover:text-(--color-bone)">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
