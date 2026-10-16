import type { CSSProperties } from "react";
import { Check } from "@/components/icons";
import { phoneDisplay } from "@/lib/proposals/accept";
import { site } from "@/lib/site";
import styles from "./celebration.module.css";

const colors = ["var(--accent)", "var(--gold)", "var(--viz-1)", "var(--viz-2)", "var(--star)", "var(--success)"];
const shapes = ["", styles.round, styles.strip];

/** Confetti laid out by a fixed formula (no randomness): same burst on every render. */
const pieces = Array.from({ length: 30 }, (_, index) => {
  const spread = (index * 37) % 100;
  return {
    key: index,
    className: `${styles.piece} ${shapes[index % shapes.length]}`,
    style: {
      "--x": `${spread}%`,
      "--c": colors[index % colors.length],
      "--delay": `${(index % 6) * 90 + Math.floor(index / 6) * 140}ms`,
      "--dur": `${2300 + ((index * 53) % 1300)}ms`,
      "--drift": `${((index * 29) % 80) - 40}px`,
      "--rot": `${(index % 2 ? 1 : -1) * (240 + ((index * 47) % 420))}deg`,
    } as CSSProperties,
  };
});

const sparkles: { size: number; style: CSSProperties }[] = [
  { size: 16, style: { top: "-0.6rem", left: "-1.4rem", "--delay": "700ms" } as CSSProperties },
  { size: 20, style: { top: "0.4rem", right: "-1.7rem", "--delay": "900ms" } as CSSProperties },
  { size: 12, style: { bottom: "-0.5rem", left: "-1.9rem", "--delay": "1100ms" } as CSSProperties },
  { size: 14, style: { bottom: "-0.9rem", right: "-1.1rem", "--delay": "800ms" } as CSSProperties },
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

/** Replaces the acceptance form once the owner has the acceptance. */
export function ThankYou({ clientName, number, nextSteps }: { clientName: string; number: string; nextSteps: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className={styles.stage}>
        <div aria-hidden="true" className={styles.confetti}>
          {pieces.map((piece) => (
            <span key={piece.key} className={piece.className} style={piece.style} />
          ))}
        </div>

        <div className={styles.badgeWrap}>
          <span aria-hidden="true" className={styles.ring} />
          <span className={styles.badge}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path className={styles.check} d="m5 12.5 4.2 4.2L19 7" />
            </svg>
          </span>
          {sparkles.map(({ size, style }, index) => (
            <span key={index} className={styles.sparkle} style={style}>
              <Sparkle size={size} />
            </span>
          ))}
        </div>

        <p className={`eyebrow ${styles.rise}`} style={{ "--delay": "450ms" } as CSSProperties}>
          Proposta {number} · adjudicada
        </p>
        <h2 className={`display mt-3 text-[2rem] leading-[1.05] text-text sm:text-[2.4rem] ${styles.rise}`} style={{ "--delay": "550ms" } as CSSProperties}>
          Obrigado, {clientName}! <span className="display-italic text-accent-text">Está feito.</span>
        </h2>
        <p className={`mx-auto mt-4 max-w-md leading-relaxed text-muted ${styles.rise}`} style={{ "--delay": "700ms" } as CSSProperties}>
          A equipa Steevanz vai entrar em contacto muito em breve para começarmos. Enviámos-lhe também um resumo por email.
        </p>
      </div>

      <div className={styles.rise} style={{ "--delay": "850ms" } as CSSProperties}>
        <h3 className="text-sm font-semibold tracking-wide text-text">O que se segue</h3>
        <ol className="mt-4 flex flex-col">
          <li className="relative flex gap-3.5 pb-5 before:absolute before:top-8 before:bottom-0 before:left-[0.9375rem] before:w-px before:bg-line">
            <span className="inline-flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full bg-success text-[var(--surface)]">
              <Check size={16} strokeWidth={2.4} />
            </span>
            <p className="pt-1 leading-relaxed text-text">
              <strong className="font-semibold">Hoje:</strong> proposta adjudicada. Obrigado pela confiança.
            </p>
          </li>
          {nextSteps.map((step, index) => (
            <li
              key={step}
              className={`relative flex gap-3.5 ${index < nextSteps.length - 1 ? "pb-5 before:absolute before:top-8 before:bottom-0 before:left-[0.9375rem] before:w-px before:bg-line" : ""}`}
            >
              <span className="inline-flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-sm font-semibold text-accent-text tabular-nums">
                {index + 1}
              </span>
              <p className="pt-1 leading-relaxed text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={`border-t border-line pt-5 text-center ${styles.rise}`} style={{ "--delay": "1000ms" } as CSSProperties}>
        <p className="display-italic text-[1.35rem] text-text">Até já, com os bons modos de antigamente.</p>
        <p className="mt-1 text-sm text-subtle">A equipa Steevanz</p>
        <p className="mt-4 text-sm text-muted">
          Alguma dúvida entretanto? Ligue{" "}
          <a href={site.phoneHref} className="font-semibold whitespace-nowrap text-accent-text underline underline-offset-3">
            {phoneDisplay}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
