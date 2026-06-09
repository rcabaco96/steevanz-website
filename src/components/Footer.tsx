import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";
import { Reveal, RevealGroup, revealItem } from "./ui/Reveal";

export default function Footer() {
  const { c } = useLanguage();

  return (
    <footer className="relative border-t border-(--color-line)/60 bg-(--color-ink)">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <RevealGroup
          className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]"
          stagger={0.1}
        >
          <motion.div variants={revealItem}>
            <Link
              to="/"
              className="font-display text-3xl tracking-tight text-(--color-bone)"
            >
              Steevanz<span className="text-(--color-gold)">.</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-(--color-fog)">
              {c.footer.blurb}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">
              {c.footer.hashtag}
            </p>
          </motion.div>

          <FooterCol
            title={c.footer.mapTitle}
            links={[
              { label: c.nav.links.home, to: "/" },
              { label: c.nav.links.neighbourhood, to: "/neighbourhood" },
              { label: c.nav.links.silkySoftware, to: "/sites" },
            ]}
          />

          <FooterCol
            title={c.footer.familyTitle}
            links={[{ label: c.nav.links.reachOut, to: "/reach-out" }]}
          />

          <motion.div variants={revealItem}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">
              {c.footer.reachTitle}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-(--color-fog)">
              <li>
                <a
                  href="mailto:rcabaco@steevanz.com"
                  className="transition-colors hover:text-(--color-bone)"
                >
                  rcabaco@steevanz.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+351928069072"
                  className="transition-colors hover:text-(--color-bone)"
                >
                  +351 928 069 072
                </a>
              </li>
              <li>
                <span>{c.footer.address}</span>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/steevanz_"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-(--color-bone)"
                >
                  @Steevanz_
                </a>
              </li>
            </ul>
          </motion.div>
        </RevealGroup>

        <Reveal
          delay={0.1}
          className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-(--color-line)/60 pt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-(--color-fog)/70 sm:flex-row sm:items-center"
        >
          <span>
            © {new Date().getFullYear()} Steevanz — {c.footer.rights}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--color-gold)" />
            {c.footer.since}
          </span>
        </Reveal>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <motion.div variants={revealItem}>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--color-gold)">
        {title}
      </h4>
      <ul className="mt-5 space-y-3 text-sm text-(--color-fog)">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="transition-colors hover:text-(--color-bone)"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
