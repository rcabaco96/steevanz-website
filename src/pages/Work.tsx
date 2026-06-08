import { useState } from "react";
import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { Eyebrow } from "../components/ui/Eyebrow";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";
import { useLanguage } from "../i18n/LanguageContext";
import scpLogo from "../assets/scp.png";
import aubayLogo from "../assets/aubay.jpg";
import efficientSafeLogo from "../assets/efficient_safe.jpg";
import creditoAgricolaLogo from "../assets/credito_agricola.png";
import bmwLogo from "../assets/bmw.png";
import vinhaLogo from "../assets/vinha.jpg";

const FILTER_KEYS = [
  "all",
  "BMW",
  "Crédito Agrícola",
  "Sporting CP",
  "Aubay",
  "Mesh",
  "Efficient Safe",
] as const;

const LOGOS: Record<string, string> = {
  "Sporting CP": scpLogo,
  Aubay: aubayLogo,
  "Efficient Safe": efficientSafeLogo,
  "Crédito Agrícola": creditoAgricolaLogo,
  BMW: bmwLogo,
  Mesh: vinhaLogo,
};

const ACCENTS = [
  "from-(--color-violet-500)/30 to-(--color-violet-900)/10",
  "from-(--color-gold)/25 to-(--color-violet-900)/10",
  "from-(--color-violet-400)/25 to-(--color-gold)/10",
  "from-(--color-violet-500)/30 to-(--color-gold)/15",
  "from-(--color-gold)/20 to-(--color-violet-400)/15",
  "from-(--color-violet-600)/25 to-(--color-violet-900)/15",
  "from-(--color-violet-500)/25 to-(--color-violet-400)/10",
  "from-(--color-gold)/20 to-(--color-violet-900)/15",
];

export default function Work() {
  const { c } = useLanguage();
  const w = c.work;
  const [filter, setFilter] = useState<(typeof FILTER_KEYS)[number]>("all");
  const visible =
    filter === "all"
      ? w.projects
      : w.projects.filter((p) => p.category === filter);

  return (
    <PageShell>
      <section className="relative overflow-hidden pt-44 pb-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 40% at 80% 0%, rgba(214,168,92,0.14), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <Eyebrow>{w.hero.eyebrow}</Eyebrow>
            <h1 className="mt-7 max-w-3xl font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-7xl">
              {w.hero.titlePre}{" "}
              <span className="italic text-(--color-gold)">
                {w.hero.titleEm}
              </span>{" "}
              {w.hero.titlePost}
            </h1>
            <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-(--color-fog)">
              {w.hero.body}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 flex flex-wrap gap-3">
            {FILTER_KEYS.map((key, i) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`relative rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  filter === key
                    ? "border-(--color-gold) text-(--color-bone)"
                    : "border-(--color-line) text-(--color-fog) hover:text-(--color-bone)"
                }`}
              >
                {filter === key && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 -z-10 rounded-full bg-(--color-gold)/15"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {w.filters[i]}
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
        <RevealGroup
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          key={filter}
        >
          {visible.map((p) => {
            const idx = w.projects.indexOf(p);
            return (
              <motion.article
                key={p.title}
                variants={revealItem}
                layout
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group relative rounded-3xl border border-(--color-line) bg-(--color-surface)/50"
              >
                {LOGOS[p.category] && (
                  <span className="absolute -top-8 left-1/2 z-10 grid h-16 w-16 -translate-x-1/2 place-items-center overflow-hidden rounded-full border border-(--color-line) bg-(--color-bone) shadow-[0_8px_28px_-8px_rgba(0,0,0,0.5)]">
                    <img
                      src={LOGOS[p.category]}
                      alt={`${p.category} logo`}
                      className="h-full w-full object-cover"
                    />
                  </span>
                )}
                <div
                  className={`relative flex h-52 items-end overflow-hidden rounded-t-3xl bg-gradient-to-br ${ACCENTS[idx]} p-6`}
                >
                  <div
                    className="absolute inset-0 opacity-40 transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 18px)",
                    }}
                  />
                  <span className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-bone)/70">
                    {p.category} · {p.year}
                  </span>
                  <span className="absolute right-6 top-6 grid h-9 w-9 place-items-center rounded-full border border-(--color-bone)/25 text-(--color-bone) opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 13L13 3M13 3H5M13 3V11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl tracking-tight text-(--color-bone)">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">
                    {p.blurb}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-(--color-line) px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-(--color-fog)"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </RevealGroup>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-(--color-line) bg-gradient-to-br from-(--color-surface) to-(--color-violet-900)/30 p-10 sm:flex-row sm:items-center sm:p-14">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-(--color-bone) sm:text-4xl">
                {w.cta.title}
              </h2>
              <p className="mt-3 max-w-md text-sm text-(--color-fog)">
                {w.cta.body}
              </p>
            </div>
            <MagneticButton
              to="/reach-out"
              variant="solid"
              className="shrink-0"
            >
              {w.cta.cta}
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
