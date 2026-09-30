import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  tone?: "default" | "soft" | "inverse";
}

const toneClasses = {
  default: "",
  soft: "bg-bg-soft",
  inverse: "bg-surface-inverse text-inverse",
};

export function Section({ id, className = "", children, labelledBy, tone = "default" }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative py-20 sm:py-28 ${toneClasses[tone]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeader({ id, eyebrow, title, lead, align = "left", as = "h2", className = "" }: SectionHeaderProps) {
  const Heading = as;
  const alignment = align === "center" ? "mx-auto text-center items-center" : "items-start";
  return (
    <div data-reveal className={`flex max-w-3xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className="display text-[2.1rem] sm:text-5xl md:text-[3.4rem]">
        {title}
      </Heading>
      {lead ? <p className="max-w-2xl text-lg leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}
