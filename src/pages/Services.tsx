import { motion } from "motion/react";
import PageShell from "../components/PageShell";
import { Eyebrow } from "../components/ui/Eyebrow";
import { HeadlineReveal } from "../components/ui/HeadlineReveal";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Reveal, RevealGroup, revealItem } from "../components/ui/Reveal";
import { TiltCard } from "../components/ui/TiltCard";
import { useLanguage } from "../i18n/LanguageContext";

export default function Services() {
  const { c } = useLanguage();
  const s = c.services;

  return (
    <PageShell>
      {/* PRICING */}
      <section className="relative overflow-hidden pt-44 pb-28">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 0%, rgba(155,95,214,0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal className="text-center">
            <Eyebrow className="justify-center">{s.pricing.eyebrow}</Eyebrow>
            <HeadlineReveal
              as="h1"
              className="mx-auto mt-6 max-w-2xl text-balance font-display text-5xl leading-[1.06] tracking-tight text-(--color-bone) sm:text-6xl"
            >
              {s.pricing.titlePre}{" "}
              <span className="italic text-(--color-gold)">
                {s.pricing.titleEm}
              </span>
            </HeadlineReveal>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-(--color-fog)">
              {s.pricing.body}
            </p>
          </Reveal>

          <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-center">
            {s.pricing.plans.map((plan) => (
              <motion.div key={plan.n} variants={revealItem} className="h-full">
                <TiltCard
                  className={`flex h-full flex-col rounded-[2rem] border p-8 sm:p-10 ${
                    plan.featured
                      ? "border-(--color-gold) bg-(--color-surface-2) shadow-[0_24px_60px_-20px_rgba(214,168,92,0.35)] lg:scale-105"
                      : "border-(--color-line) bg-(--color-surface)/50"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-(--color-gold) px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-void)">
                      {s.pricing.featuredBadge}
                    </span>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-(--color-gold)">
                      {plan.n}
                    </span>
                    <span className="h-px flex-1 bg-(--color-line)" />
                    <span
                      className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{
                        borderColor: `${plan.color}55`,
                        color: plan.color,
                      }}
                    >
                      {plan.tagline}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl leading-[1.1] tracking-tight text-(--color-bone) sm:text-3xl">
                    {plan.name}
                  </h3>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl tracking-tight text-(--color-bone)">
                      {plan.price}
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-(--color-fog)">
                    {plan.priceNote}
                  </span>

                  <ul className="mt-8 flex-1 space-y-3.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-(--color-fog)"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: plan.color }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    to="/reach-out"
                    variant={plan.featured ? "solid" : "ghost"}
                    className="mt-9 w-full justify-center"
                  >
                    {plan.cta}
                  </MagneticButton>
                </TiltCard>
              </motion.div>
            ))}
          </RevealGroup>

          <p className="mx-auto mt-12 max-w-xl text-balance text-center font-mono text-[11px] uppercase tracking-[0.16em] text-(--color-fog)/60">
            {s.pricing.note}
          </p>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
        <Reveal>
          <Eyebrow>{s.usp.eyebrow}</Eyebrow>
          <HeadlineReveal
            as="h2"
            className="mt-6 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-(--color-bone) sm:text-5xl"
          >
            {s.usp.titlePre}{" "}
            <span className="italic text-(--color-gold)">{s.usp.titleEm}</span>{" "}
            {s.usp.titlePost}
          </HeadlineReveal>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-3">
          {s.usp.items.map((a) => (
            <motion.div
              key={a.title}
              variants={revealItem}
              whileHover={{ backgroundColor: "rgba(50,33,63,0.9)" }}
              className="group bg-(--color-surface)/50 p-8 transition-colors"
            >
              <span className="block h-9 w-9 rounded-lg bg-gradient-to-br from-(--color-gold)/30 to-(--color-violet-500)/20 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mt-6 font-display text-xl tracking-tight text-(--color-bone)">
                {a.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-(--color-fog)">
                {a.body}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-(--color-line) bg-(--color-surface)/50 p-10 sm:flex-row sm:items-center sm:p-14">
            <div>
              <HeadlineReveal as="h2" className="font-display text-3xl tracking-tight text-(--color-bone) sm:text-4xl">
                {s.cta.title}
              </HeadlineReveal>
              <p className="mt-3 max-w-md text-sm text-(--color-fog)">
                {s.cta.body}
              </p>
            </div>
            <MagneticButton
              to="/reach-out"
              variant="solid"
              className="shrink-0"
            >
              {s.cta.cta}
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
